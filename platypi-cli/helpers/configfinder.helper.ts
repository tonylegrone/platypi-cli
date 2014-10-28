/// <reference path="../_references.d.ts" />

import path = require('path');
import utils = require('../utils/directory.utils');

var platypi: config.IPlatypi = require('platypi.json'),
    cwd = process.cwd();

var findConfig = (name = 'platypi.json'): config.IPlatypi => {
    if (platypi) {
        return platypi;
    }

    return lookUpForConfig(name, cwd);
};

var lookUpForConfig = (name: string, currentDirectory: string): config.IPlatypi => {
    if (currentDirectory && currentDirectory !== '') {
        currentDirectory = path.normalize(currentDirectory);

        var config = require(path.join(currentDirectory, name));

        if (config) {
            return config;
        }

        lookUpForConfig(name, utils.upOneLevel(currentDirectory));
    } else {
        throw new Error('Valid Platypi.json not found.');
    }
};

