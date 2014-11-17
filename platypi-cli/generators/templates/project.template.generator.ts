/// <reference path="../../_references.d.ts" />

import BaseTemplateGenerator = require('./base.template.generator');
import path = require('path');
import promises = require('es6-promise');

var Promise = promises.Promise;

class ProjectTemplateGenerator extends BaseTemplateGenerator {
    constructor(type: string, environmentVariables: Array<config.IEnvironmentVariable>) {
        super('project', type, environmentVariables);
    }

    generateProject(projectConfig?: config.IPlatypi, configPath?: string): Thenable<string> {
        console.log('Extracting templates to: ' + process.cwd());
        return this._copyTemplateTo(process.cwd()).then((folder) => {
            var publicPath = path.join(folder, 'public');

            if (!configPath || configPath === '') {
                configPath = path.join(folder, 'platypi.json');
            }

            projectConfig.public = publicPath;
            projectConfig.root = folder;

            return projectConfig.save(configPath).then(() => {
                return this.__preserveStructure(publicPath).then(() => {
                    return folder;
                });
            });
        });
    }

    private __preserveStructure(publicPath: string): Thenable<any> {
        return this.__walkItOut(publicPath, publicPath).then((result) => {
            return Promise.all<Array<Promise<any>>>(this.projectStruct.map((directory) => {
                var dirNormal = path.normalize(directory);
                if (!result[dirNormal]) {
                    var fullPath = path.join(publicPath, dirNormal);
                    return this.fileUtils.mkdir(fullPath);
                }
            }));
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

    projectStruct = [
        'app',
        'common',
        'common/css',
        'common/css/base',
        'common/css/mixins',
        'common/css/variables',
        'common/assets',
        'common/assets/fonts',
        'common/assets/img',
        'common/controls',
        'common/injectables',
        'lib',
        'lib/platypus',
        'models',
        'models/base',
        'models/server',
        'repositories',
        'repositories/base',
        'services',
        'services/base',
        'viewcontrols',
        'viewcontrols/base',
        'viewcontrols/home'
    ];

}

export = ProjectTemplateGenerator;
