/// <reference path="../_references.d.ts" />

import ViewControlGenerator = require('../generators/templates/viewcontrol.template.generator');
import InjectableGenerator = require('../generators/templates/injectable.template.generator');
import RepositoryGenerator = require('../generators/templates/repository.template.generator');
import ServiceGenerator = require('../generators/templates/service.template.generator');
import TemplateControlGenerator = require('../generators/templates/templatecontrol.template.generator');
import ModelGenerator = require('../generators/templates/model.template.generator');
import AttributeControlGenerator = require('../generators/templates/attributecontrol.template.generator');

module GeneratorHandler {

    /**
     *  Retrieve the appropriate generator for the given control parameters.
     *  @param controlName Control Type name to be generated.
     *  @param instanceName The desired name for the control once generated.
     *  @param registeredname The name the control will register with the framework as.
     *  @param configType The config type of the platypi project.
     */
    export var getGenerator = (controlName: string
        , instanceName: string
        , registeredname: string
        , extendsClass: string
        , configType: string) => {
        var controlGenerator: generators.ITemplateGenerator = null
            , type = controlName;

        if (type === 'viewcontrol') {
            controlGenerator = new ViewControlGenerator(instanceName, configType, registeredname, extendsClass);
        } else if (type === 'injectable') {
            controlGenerator = new InjectableGenerator(instanceName, registeredname, extendsClass);
        } else if (type === 'repository') {
            controlGenerator = new RepositoryGenerator(instanceName, registeredname, extendsClass);
        } else if (type === 'service') {
            controlGenerator = new ServiceGenerator(instanceName, registeredname, extendsClass);
        } else if (type === 'templatecontrol') {
            controlGenerator = new TemplateControlGenerator(instanceName, registeredname, extendsClass);
        } else if (type === 'model') {
            controlGenerator = new ModelGenerator(instanceName, registeredname, extendsClass);
        } else if (type === 'attributecontrol') {
            controlGenerator = new AttributeControlGenerator(instanceName, registeredname, extendsClass);
        } else {
            throw 'Unknown control type.';
        }

        return controlGenerator;
    };
}

export = GeneratorHandler;

