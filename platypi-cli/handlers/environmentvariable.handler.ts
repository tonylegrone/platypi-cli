/// <reference path="../_references.d.ts" />

/**
 *  Contains util functions for dealing with environment variables.
 */
module EnvironmentVariableHandler {
    /**
     *  Takes in a Project config and outputs environment variables.
     *  @param newConfig a Platypi project config.
     */
    export var parseVariables = (newConfig: config.IPlatypi): Array<config.IEnvironmentVariable> => {
        var environmentVariables: Array<config.IEnvironmentVariable> = []
            , configKeys = Object.keys(newConfig);

        configKeys.forEach((key) => {
            var value = newConfig[key];
            if (!(value instanceof Array)) {
                var envVar: config.IEnvironmentVariable = {
                    name: key,
                    value: value
                };
                environmentVariables.push(envVar);
            }
        });

        return environmentVariables;
    };
}

export = EnvironmentVariableHandler;

