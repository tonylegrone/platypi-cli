/// <reference path="../_references.d.ts" />

import path = require('path');
import fs = require('fs');
import utils = require('../utils/directory.utils');
import validator = require('./config.validator');
import promises = require('es6-promise');

var cwd = process.cwd(),
    Promise = promises.Promise,
    root = path.resolve('/'),
    __currentDirectory = cwd,
    __name = 'platypi.json',
    __last = '',
    __promises = [],
    __found = false;

var findConfig = (name = __name, currentDirectory = cwd): Thenable<config.IPlatypi> => {
    __last = '';
    __promises = [];
    __found = false;
    while (currentDirectory !== root) {
        __promises.push(readJson(name, currentDirectory));
        currentDirectory = utils.upOneLevel(currentDirectory);
        __last = currentDirectory;
    }

    return Promise.all(__promises).then((results) => {
        return results[0];
    });
};

var readJson = (name: string, currentDirectory: string) => {
    if (currentDirectory === __last) {
        if (__found) {
            return Promise.resolve();
        }
        return Promise.reject('No file found');
    }
    fs.readFile(path.join(currentDirectory, name), 'utf8', lookUpForConfig);
};

var lookUpForConfig = (err, data) => {
    if (data) {
        __found = true;
        return Promise.resolve(JSON.parse(data));
    }

    return Promise.resolve();
};

export = findConfig; 
