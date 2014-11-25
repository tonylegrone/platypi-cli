/// <reference path="../_references.d.ts" />

import ViewControlGenerator = require('../generators/templates/viewcontrol.template.generator');
import InjectableGenerator = require('../generators/templates/injectable.template.generator');
import RepositoryGenerator = require('../generators/templates/repository.template.generator');
import ServiceGenerator = require('../generators/templates/service.template.generator');
import TemplateControlGenerator = require('../generators/templates/templatecontrol.template.generator');
import ModelGenerator = require('../generators/templates/model.template.generator');
import AttributeControlGenerator = require('../generators/templates/attributecontrol.template.generator');

module GeneratorHandler {
    export var getGenerator = (controlName: string, instanceName: string, registeredname: string, configType: string) => {
        var controlGenerator: generators.ITemplateGenerator = null
            , type = controlName;

        if (type === 'viewcontrol') {
            controlGenerator = new ViewControlGenerator(instanceName, configType, registeredname);
        } else if (type === 'injectable') {
            controlGenerator = new InjectableGenerator(instanceName, registeredname);
        } else if (type === 'repository') {
            controlGenerator = new RepositoryGenerator(instanceName, registeredname);
        } else if (type === 'service') {
            controlGenerator = new ServiceGenerator(instanceName, registeredname);
        } else if (type === 'templatecontrol') {
            controlGenerator = new TemplateControlGenerator(instanceName, registeredname);
        } else if (type === 'model') {
            controlGenerator = new ModelGenerator(instanceName, registeredname);
        } else if (type === 'attribute') {
            controlGenerator = new AttributeControlGenerator(instanceName, registeredname);
        } else {
            throw 'Unknown control type.';
        }

        return controlGenerator;
    };
}

export = GeneratorHandler;

