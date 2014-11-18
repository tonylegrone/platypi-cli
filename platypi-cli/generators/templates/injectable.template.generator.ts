/// <reference path="../../_references.d.ts" />

import BaseTemplateGenerator = require('./base.template.generator');
import path = require('path');

class InjectableTemplateGenerator extends BaseTemplateGenerator {
    constructor(name: string, registeredName?: string) {
        var environmentVariables: Array<config.IEnvironmentVariable> = [
            {
                name: 'name',
                value: name
            },
            {
                name: 'registername',
                value: (registeredName && registeredName !== '' ? registeredName : name)
            }];
        super('injectable', 'base', environmentVariables);
    }

    generate(projectConfig: config.IPlatypi): Thenable<string> {
        console.log('Creating Injectable...');
        var injectablePath = path.join(projectConfig.public, 'common/injectables');
        return this._copyTemplateTo(injectablePath).then((newPath) => {
            projectConfig.addInjectable(this.instanceName, 'injectable', this.registeredName);
            return projectConfig.save().then(() => {
                return newPath;
            });
        });
    }
}

export = InjectableTemplateGenerator;
