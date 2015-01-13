/// <reference path="../_references.d.ts" />

import util = require('util');

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
    static extendClass(extendsName: string, controlType: string, projectConfig: config.IPlatypi): IExtendsClass {
        var type = controlType;
        if (type.substr(type.length - 1, type.length) === 'y') {
            type = type.replace('y', 'ie');
        }
        type = type + 's';

        if (projectConfig && projectConfig[type] && projectConfig[type][extendsName]) {
            var control: config.IPlatypusControl = projectConfig[type][extendsName];
            return {
                extendsStatement: util.format('extends %s', control.name),
                importStatement: util.format('import %s = require(\'%s\');', control.name, control.path)
            };
        }

        return null;
    }
}

export = ExtendsHandler;
