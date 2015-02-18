/// <reference path="../../_references.d.ts" />

import BaseTemplateGenerator = require('./base.template.generator');

class ServiceTemplateGenerator extends BaseTemplateGenerator {
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
                value: (extendsClass && extendsClass !== '' ? extendsClass : 'base')
            }];
        super('service', 'base', environmentVariables);
    }
}

export = ServiceTemplateGenerator;

