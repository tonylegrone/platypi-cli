/// <reference path="../../_references.d.ts" />

import BaseTemplateGenerator = require('./base.template.generator');
import path = require('path');

class ModelTemplateGenerator extends BaseTemplateGenerator {
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
        super('model', 'base', environmentVariables);
    }

    generate(projectConfig: config.IPlatypi): Thenable<string> {
        console.log('Creating new Model...');
        var modelPath = path.join(projectConfig.public, 'models');
        return this._copyTemplateTo(modelPath).then((newPath) => {
            projectConfig.addModel(this.instanceName, 'model', this.registeredName);
            return projectConfig.save().then(() => {
                return newPath;
            });
        });
    }
}

export = ModelTemplateGenerator;

