﻿/// <reference path="../../_references.d.ts" />

import BaseTemplateGenerator = require('./base.template.generator');

class InjectableTemplateGenerator extends BaseTemplateGenerator {
    constructor(name: string, registeredName?: string, extendsClass?: string) {
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
        super('injectable', 'base', environmentVariables);
    }
}

export = InjectableTemplateGenerator;
