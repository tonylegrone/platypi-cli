﻿/// <reference path="../_references.d.ts" />

import util = require('util');
import path = require('path');
import pathsUtil = require('../utils/paths.util');
import promises = require('es6-promise');
import Finder = require('../config/project/config.finder');
import CliConfig = require('../config/cli/platypicli.config');

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
        if (extendsName.indexOf('plat.') > -1) {
            var extendsPlat = extendsName.replace('plat.', '');

            return Promise.resolve({
                extendsStatement: 'extends plat.' + ExtendsHandler.TitleCaseControlType(extendsPlat),
                importStatement: ''
            });
        }

        return ExtendsHandler.FulfillConfig(projectConfig).then((projectConfig) => {
            return CliConfig.config.getConfig().then((cliConfig) => {
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
                        var controlName = _control.name.substring(0, 1).toUpperCase() + _control.name.substr(1),
                            controlLocation = cliConfig.templates.controlLocation[_control.type],
                            titleCaseControlType = ExtendsHandler.TitleCaseControlType(_control.type),
                            titleCaseName = ExtendsHandler.TitleCaseControlType(_control.name)
                                + ExtendsHandler.TitleCaseControlType(_control.type);

                        return {
                            extendsStatement: util.format('extends %s', controlName + titleCaseControlType),
                            importStatement: util.format('import %s = %s', titleCaseName,
                                pathsUtil.newRequireString(util.format('../%s',
                                    path.relative(controlLocation, _control.path + '//' + _control.name + '.' + _control.type))))
                        };
                    }

                    return null;
                }

                return null;
            });
        });
    }

    static TitleCaseControlType(str: string): string {
        var controlIndex = str.indexOf('control');

        str = str.substr(0, 1).toUpperCase() + str.substr(1);

        if (controlIndex > -1) {
            str = str.substr(0, controlIndex) +  str.substr(controlIndex, 1).toUpperCase() + str.substr(controlIndex + 1);
        }

        return str;
    }

    static FulfillConfig(projectConfig?: config.IPlatypi): Thenable<config.IPlatypi> {
        if (projectConfig) {
            return Promise.resolve(projectConfig);
        }

        return Finder.findConfig();
    }
}

export = ExtendsHandler;
