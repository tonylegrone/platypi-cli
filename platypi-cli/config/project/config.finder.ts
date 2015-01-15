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
    static findConfig(name = 'package.json', currentDirectory = cwd): Thenable<config.IPlatypi> {
        return ConfigFinder.readFileRecursive(name, currentDirectory);
    }

    /**
     *  Recursive walk method.
     */
    static readFileRecursive(name: string, currentDirectory: string): Thenable<any> {
        var filePath = path.join(currentDirectory, name);
        return fileutils.readFile(filePath, { encoding: 'utf8' }).then((data): any => {
            var parsedData = JSON.parse(data),
                config: config.IPlatypi;

            if (name === 'package.json') {
                if (!parsedData.platypi) {
                    return ConfigFinder.readFileRecursive('platypi.json', currentDirectory);
                } else {
                    config = parsedData.platypi;
                }
            } else {
                config = JSON.parse(data);
            }

            if (validator(config)) {
                config.configPath = filePath;
                config = PlatypiConfig.loadFromObject(config);
                return config;
            } else {
                throw 'A valid platypi config file was not found.';
            }
        }, (err) => {
            if (currentDirectory === root) {
                throw 'A valid platypi config file was not found.';
            } else {
                return ConfigFinder.readFileRecursive(name, utils.upOneLevel(currentDirectory));
            }
        });
    }
}

export = ConfigFinder;
