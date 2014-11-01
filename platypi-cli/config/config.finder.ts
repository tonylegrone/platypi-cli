/// <reference path="../_references.d.ts" />

import path = require('path');
import fs = require('fs');
import utils = require('../utils/directory.utils');
import validator = require('./config.validator');
import promises = require('es6-promise');

var cwd = process.cwd()
    , Promise = promises.Promise
    , root = path.resolve('/');

class ConfigFinder {
    findConfig(name = 'platypi.json', currentDirectory = cwd): Thenable<config.IPlatypi> {
        return this.readFileRecursive(name, currentDirectory).then((result) => {
            if (result && validator(result)) {
                return result;
            } else {
                return 'A valid platypi config file was not found.';
            }
        });
    }

    readFileRecursive(name: string, currentDirectory: string): Thenable<any> {
        return new Promise((resolve, reject) => {
            var filePath = path.join(currentDirectory, name);
            fs.readFile(filePath, 'utf8', (err, data) => {
                if (data) {
                    return resolve(JSON.parse(data));
                } else  if (currentDirectory === root) {
                    return reject('not found');
                } else {
                    return resolve(this.readFileRecursive(name, utils.upOneLevel(currentDirectory)));
                }
            });
        });

    }
}

export = ConfigFinder;
