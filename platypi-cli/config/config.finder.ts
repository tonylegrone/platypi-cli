/// <reference path="../_references.d.ts" />

import path = require('path');
import fs = require('fs');
import utils = require('../utils/directory.utils');
import validator = require('./config.validator');
import promises = require('es6-promise');

var cwd = process.cwd(),
    Promise = promises.Promise,
    root = path.resolve('/');

class ConfigFinder {
    __promises = [];
    __fns = [];
    __last = '';

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
        while (currentDirectory !== root) {
            // console.log(currentDirectory);
            this.__promises.push(this.readJson.bind(this, name, currentDirectory));
            this.__last = currentDirectory;
            currentDirectory = utils.upOneLevel(currentDirectory);
        }

        this.__promises.forEach((v, i, a) => {
            this.__fns.push(v());
        });

        return Promise.all(this.__fns).then((results) => {
            var filtered = results.filter((value, index, array) => {
                return (value !== undefined);
            });

            if (filtered.length < 1) {
                return Promise.reject('Not found.');
            }

            return Promise.resolve(filtered[0]);
        });

    }    
}

export = ConfigFinder;
