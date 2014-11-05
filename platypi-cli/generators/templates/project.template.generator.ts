/// <reference path="../../_references.d.ts" />

import BaseTemplateGenerator = require('./base.template.generator');

class ProjectTemplateGenerator extends BaseTemplateGenerator {
    constructor(type: string, environmentVariables: Array<config.IEnvironmentVariable>) {
        super('project', type, environmentVariables);
    }


}

export = ProjectTemplateGenerator;
