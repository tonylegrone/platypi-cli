/// <reference path="../_references.d.ts" />
import promises = require('es6-promise');
import PlatypiConfig = require('../config/project/platypi.config');

var consolePrompt = require('prompt')
    , Promise = promises.Promise;

/**
 *  Generate a config file based on prompts.
 */
var generateConfig = (): Thenable<config.IPlatypi> => {
    var schema = {
        properties: {
            name: {
                description: 'Project Name',
                type: 'string',
                pattern: /^[^\s]+$/,
                message: 'Spaces not allowed in name.',
                default: 'newproject',
                required: true
            }
            , description: {
                description: 'Project Description',
                type: 'string'
            }
            , author: {
                description: 'Project Author',
                type: 'string',
                required: true,
                default: 'Platypi'
            }
            , version: {
                description: 'Version',
                type: 'string',
                default: '0.0.1'
            }
        }
    };

    return new Promise((resolve, reject) => {
        consolePrompt.get(schema, (err, response) => {
            var config: config.IPlatypi = PlatypiConfig.CreateNewMobileConfig();

            config.name = response.name;
            config.description = response.description;
            config.author = response.author;
            config.version = response.version;

            resolve(config);
        });
    });
};

export = generateConfig;
