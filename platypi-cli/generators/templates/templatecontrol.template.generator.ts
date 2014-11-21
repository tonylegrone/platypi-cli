/// <reference path="../../_references.d.ts" />

import BaseTemplateGenerator = require('./base.template.generator');
import path = require('path');

class TemplateControlTemplateGenerator extends BaseTemplateGenerator {
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
        super('templatecontrol', 'base', environmentVariables);
    }

    generate(projectConfig: config.IPlatypi): Thenable<string> {
        console.log('Creating TemplateControl...');
        var templateControlPath = path.join(projectConfig.public, 'common/controls');
        return this._copyTemplateTo(templateControlPath).then((newPath) => {
            projectConfig.addTemplateControl(this.instanceName, 'templatecontrol', this.registeredName);
            return projectConfig.save().then(() => {
                return newPath;
            });
        });
    }
}

export = TemplateControlTemplateGenerator;

