/// <reference path="../../_references.d.ts" />

import BaseTemplateGenerator = require('./base.template.generator');

class TemplateControlTemplateGenerator extends BaseTemplateGenerator {
    constructor(name: string, registeredName: string, extendsClass?: string) {
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
                value: (extendsClass && extendsClass !== '' ? extendsClass : '')
            }];
        super('templatecontrol', 'base', environmentVariables);
    }
}

export = TemplateControlTemplateGenerator;

