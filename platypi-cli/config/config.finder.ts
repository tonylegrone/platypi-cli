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
    readJson(name: string, currentDirectory: string): Thenable<any> {
        return new Promise((resolve, reject) => {
            fs.readFile(path.join(currentDirectory, name), 'utf8', (err, data) => {
                if (data) {
                    resolve(JSON.parse(data));
                }

                resolve();
            });
        });
    }

    findConfig(name = 'platypi.json', currentDirectory = cwd): Thenable<config.IPlatypi> {
        var lookupPromises = [];

        while (currentDirectory !== root) {
            lookupPromises.push(this.readJson.bind(this, name, currentDirectory));
            currentDirectory = utils.upOneLevel(currentDirectory);
        }

        var fns = lookupPromises.map((promise) => {
            return promise();
        });

        return Promise.all(fns).then((results: Array<config.IPlatypi>) => {
            var filtered = results.filter((value, index, array) => {
                return (value !== undefined && validator(value));
            });

            if (filtered.length < 1) {
                return Promise.reject('A valid platypi config file was not found.');
            }

            return Promise.resolve(filtered[0]);
        });
    }
}

export = ConfigFinder;
