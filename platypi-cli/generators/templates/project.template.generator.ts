﻿/// <reference path="../../_references.d.ts" />

import BaseTemplateGenerator = require('./base.template.generator');
import path = require('path');
import promises = require('es6-promise');
import ProjectConfigFinder = require('../../config/project/config.finder');

var Promise = promises.Promise;

class ProjectTemplateGenerator extends BaseTemplateGenerator {
    constructor(type: string, environmentVariables: Array<config.IEnvironmentVariable>) {
        super('project', type, environmentVariables);
    }

    generate(): Thenable<string> {
        console.log('Extracting templates to: ' + process.cwd());
        return this._copyTemplateTo(process.cwd()).then((folder) => {
            return ProjectConfigFinder.findConfig('package.json', folder).then((projectConfig) => {
                var publicPath = path.join(folder, 'public')
                    , mainFile = path.join(publicPath, 'main.ts')
                    , configPath = path.join(folder, 'package.json');

                projectConfig.public = publicPath;
                projectConfig.mainFile = mainFile;
                projectConfig.root = folder;
                return this.__mapGeneratedControls(projectConfig).then(() => {
                    console.log('config path: ', configPath);
                    return projectConfig.save(configPath).then(() => {
                        return this.__preserveStructure(publicPath);
                    }).then(() => { return folder; });
                });
            });
        });
    }

    private __mapGeneratedControls(projectConfig: config.IPlatypi): Thenable<any> {
        var controlCollections = [
            { name: 'attributecontrols', controls: projectConfig.attributecontrols },
            { name: 'injectables', controls: projectConfig.injectables },
            { name: 'models', controls: projectConfig.models },
            { name: 'repositories', controls: projectConfig.repositories },
            { name: 'services', controls: projectConfig.services },
            { name: 'templatecontrols', controls: projectConfig.templatecontrols },
            { name: 'viewcontrols', controls: projectConfig.viewcontrols }
        ];

        return Promise.all(controlCollections.map((collection) => {
            return <Promise<any>>(this.__mapControlCollection(collection.controls, projectConfig.public).then((newCollection) => {
                return projectConfig[collection.name] = newCollection;
            }));
        }));
    }

    private __mapControlCollection(controlCollection: Array<config.IPlatypusControl>, publicPath: string): Thenable<any> {
        return Promise.all(controlCollection.map((control) => {
            return <Promise<config.IPlatypusControl>>this.__findAndFillPath(control, publicPath);
        }));
    }

    private pluralType(type: string): string {
        var pluralType = (type === 'webviewcontrol' ? 'viewcontrol' : type);
        if (pluralType.substr(pluralType.length - 1, pluralType.length) === 'y') {
            pluralType = pluralType.replace('y', 'ie');
        }
        return pluralType + 's';
    }

    private __findAndFillPath(control: config.IPlatypusControl, publicPath: string): Thenable<config.IPlatypusControl> {
        if (!control.path || control.path === '') {
            var typePath: string = path.join(publicPath, this.pluralType(control.type));
            return this.fileUtils.readdir(typePath).then((children) => {
                if (children.indexOf(control.name) > -1) {
                    control.path = path.join(typePath, control.name);
                    return control;
                } else {
                    throw 'Cannot map path to ' + control.type + ' : ' + control.name;
                }
            });
        } else {
            return Promise.resolve(control);
        }
    }

    private __preserveStructure(publicPath: string): Thenable<any> {
        return this.__walkItOut(publicPath, publicPath).then((result) => {
            return this._config.getConfig().then((cliConfig) => {
                var projectStruct = cliConfig.templates.projectStruct;
                return Promise.all<Array<Promise<any>>>(projectStruct.map((directory) => {
                    var dirNormal = path.normalize(directory);
                    if (result.indexOf(dirNormal) < 0) {
                        var fullPath = path.join(publicPath, dirNormal);
                        return this.fileUtils.mkdir(fullPath);
                    }
                }));
            });
        });
    }

    private __walkItOut(walkPath: string, publicPath: string): Thenable<Array<string>> {
        var rtnArray = [];

        return this.fileUtils.readdir(walkPath).then((listings) => {
            return Promise.all(<Array<Promise<Array<string>>>>listings.map((listing) => {
                var p = path.join(walkPath, listing);
                return this.fileUtils.stat(p).then((stats) => {
                    if (stats.isDirectory()) {
                        rtnArray.push(path.normalize(path.relative(publicPath, p)));
                        return this.__walkItOut(p, publicPath);
                    } else {
                        return <Thenable<Array<string>>>Promise.resolve<Array<string>>([]);
                    }
                });
            }));
        })
        .then((results) => {
            return results.reduce((prev, curr) => {
                return prev.concat(curr);
            }, rtnArray);
        });
    }
}

export = ProjectTemplateGenerator;
