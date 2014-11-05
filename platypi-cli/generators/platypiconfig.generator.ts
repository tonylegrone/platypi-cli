/// <reference path="../_references.d.ts" />
import promises = require('es6-promise');

var prompt = require('prompt')
    , Promise = promises.Promise;

var generateConfig = (): Thenable<config.IPlatypi> => {
    var schema = {
        properties: {
            name: {
                description: 'Project Name',
                type: 'string',
                pattern: /^[^\s]+$/,
                message: 'Spaces not allowed in name.',
                required: true
            }
            , description: {
                description: 'Project Description',
                type: 'string'
            }
            , author: {
                description: 'Project Author',
                type: 'string',
                required: true
            }
            , email: {
                description: 'Contact Email',
                type: 'string'
            }
            , website: {
                description: 'Project Website',
                type: 'string'
            }
            , type: {
                description: 'Project Type',
                default: 'web',
                type: 'string',
                pattern: /^web$|^mobile$/,
                message: 'Valid choices are web or mobile.',
                required: true
            }
        }
    };

    return new Promise((resolve, reject) => {
        prompt.get(schema, (err, response) => {
            var config: config.IPlatypi = {
                name: response.name,
                description: response.description,
                author: response.author,
                email: response.email,
                website: response.website,
                type: response.type
            };

            resolve(config);
        });
    });
};

export = generateConfig;
