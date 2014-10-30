/// <reference path="../_references.d.ts" />

import path = require('path');
import fs = require('fs');
import utils = require('../utils/directory.utils');
import validator = require('./config.validator');
import promises = require('es6-promise');

var cwd = process.cwd(),
    Promise = promises.Promise;

var findConfig = (name = 'platypi.json'): Thenable<config.IPlatypi> => {
    return lookUpForConfig(name, cwd);
};

var lookUpForConfig = (name: string, currentDirectory: string): Thenable<config.IPlatypi> => {
    return new Promise((resolve, reject) => {
        if (currentDirectory && currentDirectory !== '') {
            currentDirectory = path.normalize(currentDirectory);

            var config = null;

            fs.readFile(path.join(currentDirectory, name), 'utf8', (err, data) => {
                if (err) {
                    reject(err);
                }

                if (data) {
                    config = JSON.parse(data);
                }

                if (config && validator(config)) {
                    resolve(config);
                }

                lookUpForConfig(name, utils.upOneLevel(currentDirectory));
            });
        } else {
            reject('Valid Platypi.json not found.');
        }
    });
};

export = findConfig; 
