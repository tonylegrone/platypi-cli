/// <reference path="../_references.d.ts" />

import util = require('util');
import promises = require('es6-promise');
import Finder = require('../config/project/config.finder');

var Promise = promises.Promise;

/**
 *  Contains methods for handling a new control that extends an existing control of the same type.
 */
class ExtendsHandler {
    /**
     *  Returns an object containing the strings for extends/import statements.
     *  @param extendsName The name of the extended class.
     *  @param controlType The type of control being extended.
     *  @param projectConfig The config of the current project that contains all control settings.
     */
    static extendClass(extendsName: string, controlType: string, projectConfig?: config.IPlatypi): Thenable<IExtendsClass> {
        return ExtendsHandler.FulfillConfig(projectConfig).then((projectConfig) => {
            var type = controlType;
            if (type.substr(type.length - 1, type.length) === 'y') {
                type = type.replace('y', 'ie');
            }
            type = type + 's';

            if (projectConfig && projectConfig[type]) {
                var _control: config.IPlatypusControl;

                (<Array<config.IPlatypusControl>>projectConfig[type]).map((control) => {
                    if (control.name === extendsName) {
                        _control = control;
                    }
                });

                if (_control) {
                    return {
                        extendsStatement: util.format('extends %s', _control.name),
                        importStatement: util.format('import %s = require(\'%s\');', _control.name, _control.path)
                    };
                }

                return null;
            }

            return null;
        });
    }

    static FulfillConfig(projectConfig?: config.IPlatypi): Thenable<config.IPlatypi> {
        if (projectConfig) {
            return Promise.resolve(projectConfig);
        }

        return Finder.findConfig();
    }
}

export = ExtendsHandler;
