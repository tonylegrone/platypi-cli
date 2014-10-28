/// <reference path="../_references.d.ts" />

import path = require('path');
import utils = require('../utils/directory.utils');
import validator = require('./config.validator');

var cwd = process.cwd();

var findConfig = (name = 'platypi.json'): config.IPlatypi => {
    var platypi: config.IPlatypi = null;

    try {
        platypi = require('platypi.json');
    } catch (e) {
        platypi = lookUpForConfig(name, cwd);
    }

    return platypi;
};

var lookUpForConfig = (name: string, currentDirectory: string): config.IPlatypi => {
    if (currentDirectory && currentDirectory !== '') {
        currentDirectory = path.normalize(currentDirectory);

        var config = null;

        try {
            config = require(path.join(currentDirectory, name));
        } catch (e) {

        }

        if (config && validator(config)) {
            return config;
        }

        lookUpForConfig(name, utils.upOneLevel(currentDirectory));
    } else {
        throw new Error('Valid Platypi.json not found.');
    }
};

export = findConfig; 