/// <reference path="../../_references.d.ts" />

import path = require('path');
import utils = require('../../utils/directory.utils');
import validator = require('./config.validator');
import fileutils = require('../../utils/file.utils');
import PlatypiConfig = require('./platypi.config');

var cwd = process.cwd()
    , root = path.resolve('/');

/**
 *  Contains methods relating to a project's Platypi Config file.
 */
class ConfigFinder {
    /**
     *  Walk upwards looking for a platypi.config file. 
     *  @param name The name of the config file.
     *  @param currentDirectory the directory to start looking in.
     */
    findConfig(name = 'platypi.json', currentDirectory = cwd): Thenable<config.IPlatypi> {
        return this.readFileRecursive(name, currentDirectory);
    }

    /**
     *  Recursive walk method.
     */
    readFileRecursive(name: string, currentDirectory: string): Thenable<any> {
        var filePath = path.join(currentDirectory, name);
        return fileutils.readFile(filePath, { encoding: 'utf8' }).then((data) => {
            var config: config.IPlatypi = JSON.parse(data);

            if (validator(config)) {
                config = PlatypiConfig.loadFromObject(config);
                return config;
            } else {
                throw 'A valid platypi config file was not found.';
            }
        }, (err) => {
            if (currentDirectory === root) {
                throw 'A valid platypi config file was not found.';
            } else {
                return this.readFileRecursive(name, utils.upOneLevel(currentDirectory));
            }
        });
    }
}

export = ConfigFinder;
