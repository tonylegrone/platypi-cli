/// <reference path="../../_references.d.ts" />

import BaseTemplateGenerator = require('./base.template.generator');
import fileutils = require('../../utils/file.utils');
import path = require('path');

class ProjectTemplateGenerator extends BaseTemplateGenerator {
    constructor(type: string, environmentVariables: Array<config.IEnvironmentVariable>) {
        super('project', type, environmentVariables);
    }

    generateProject(projectConfig: config.IPlatypi, configPath?: string): Thenable<string> {
        console.log('Extracting templates to: ' + process.cwd());
        return this._copyTemplateTo(process.cwd()).then((folder) => {
            var publicPath = path.join(folder, 'public');

            if (!configPath || configPath === '') {
                configPath = path.join(folder, 'platypi.json');
            }

            projectConfig.public = publicPath;

            return fileutils.writeFile(configPath, JSON.stringify(projectConfig)).then(() => {
                return folder;
            });
        });
    }

}

export = ProjectTemplateGenerator;
