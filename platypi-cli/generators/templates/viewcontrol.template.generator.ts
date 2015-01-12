/// <reference path="../../_references.d.ts" />

import BaseTemplateGenerator = require('./base.template.generator');

class ViewControlTemplateGenerator extends BaseTemplateGenerator {
    constructor(name: string, type: string, registeredName?: string, extendsClass?: string) {
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
                value: (extendsClass && extendsClass != '' ? extendsClass : '')
            }];
        super('viewcontrol', type, environmentVariables);
    }
}

export = ViewControlTemplateGenerator;

