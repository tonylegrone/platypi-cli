/// <reference path="../../_references.d.ts" />

import BaseTemplateGenerator = require('./base.template.generator');
import path = require('path');

class AttributeControlTemplateGenerator extends BaseTemplateGenerator {
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
        super('attributecontrol', 'base', environmentVariables);
    }

    generate(projectConfig: config.IPlatypi): Thenable<string> {
        console.log('Creating AttributeControl...');
        var attributeControlPath = path.join(projectConfig.public, 'common/controls');
        return this._copyTemplateTo(attributeControlPath).then((newPath) => {
            projectConfig.addAttributeControl(this.instanceName, 'attributecontrol', this.registeredName);
            return projectConfig.save().then(() => {
                return newPath;
            });
        });
    }
}

export = AttributeControlTemplateGenerator;

