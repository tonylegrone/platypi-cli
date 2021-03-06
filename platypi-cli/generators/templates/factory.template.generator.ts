/// <reference path="../../_references.d.ts" />

import BaseTemplateGenerator = require('./base.template.generator');

class FactoryTemplateGenerator extends BaseTemplateGenerator {
    constructor(name: string, registeredName: string, extendsClass?: string) {
        name = name.toLowerCase().replace(' ', '');

        var environmentVariables: Array<config.IEnvironmentVariable> = [
            {
                name: 'name',
                value: name
            },
            {
                name: 'registername',
                value: (registeredName && registeredName !== '' ? registeredName : name)
            },
            {
                name: 'extendsClass',
                value: (extendsClass && extendsClass !== '' ? extendsClass : 'base')
            }];
        super('factory', 'base', environmentVariables);
    }
}

export = FactoryTemplateGenerator;

