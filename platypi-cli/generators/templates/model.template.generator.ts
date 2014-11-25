/// <reference path="../../_references.d.ts" />

import BaseTemplateGenerator = require('./base.template.generator');

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
}

export = ModelTemplateGenerator;

