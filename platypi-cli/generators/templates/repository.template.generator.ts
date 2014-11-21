/// <reference path="../../_references.d.ts" />

import BaseTemplateGenerator = require('./base.template.generator');
import path = require('path');

class RepositoryTemplateGenerator extends BaseTemplateGenerator {
    constructor(name: string, registeredName: string) {
        var environmentVariables: Array<config.IEnvironmentVariable> = [
            {
                name: 'name',
                value: name
            },
            {
                name: 'registername',
                value: (registeredName && registeredName !== '' ? registeredName : name)
            }];
        super('repository', 'base', environmentVariables);
    }

    generate(projectConfig: config.IPlatypi): Thenable<string> {
        console.log('Creating Repository...');
        var repositoryPath = path.join(projectConfig.public, 'common/repositories');
        return this._copyTemplateTo(repositoryPath).then((newPath) => {
            projectConfig.addRepository(this.instanceName, 'repository', this.registeredName);
            return projectConfig.save().then(() => {
                return newPath;
            });
        });
    }
}

export = RepositoryTemplateGenerator;

