/// <reference path="../../_references.d.ts" />

import path = require('path');
import fs = require('fs');
import utils = require('../../utils/directory.utils');
import validator = require('./config.validator');
import promises = require('es6-promise');
import PlatypiConfig = require('./platypi.config');

var cwd = process.cwd()
    , Promise = promises.Promise
    , root = path.resolve('/');

class ConfigFinder {
    findConfig(name = 'platypi.json', currentDirectory = cwd): Thenable<config.IPlatypi> {
        return this.readFileRecursive(name, currentDirectory);
    }

    readFileRecursive(name: string, currentDirectory: string): Thenable<any> {
        return new Promise((resolve, reject) => {
            var filePath = path.join(currentDirectory, name);
            fs.readFile(filePath, 'utf8', (err, data) => {
                if (data) {
                    var config: config.IPlatypi = JSON.parse(data);

                    if (validator(config)) {
                        config = PlatypiConfig.loadFromObject(config);
                        return resolve(config);
                    } else {
                        return reject('A valid platypi config file was not found.');
                    }
                } else  if (currentDirectory === root) {
                    return reject('A valid platypi config file was not found.');
                } else {
                    return resolve(this.readFileRecursive(name, utils.upOneLevel(currentDirectory)));
                }
            });
        });

    }
}

export = ConfigFinder;
