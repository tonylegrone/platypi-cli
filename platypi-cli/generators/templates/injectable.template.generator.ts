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
}

export = InjectableTemplateGenerator;
