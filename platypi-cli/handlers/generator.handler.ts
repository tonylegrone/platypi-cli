/// <reference path="_references.d.ts" />

import ProjectGenerator = require('./generators/templates/project.template.generator');
import ViewControlGenerator = require('./generators/templates/viewcontrol.template.generator');
import InjectableGenerator = require('./generators/templates/injectable.template.generator');
import RepositoryGenerator = require('./generators/templates/repository.template.generator');
import ServiceGenerator = require('./generators/templates/service.template.generator');
import TemplateControlGenerator = require('./generators/templates/templatecontrol.template.generator');
import ModelGenerator = require('./generators/templates/model.template.generator');
import AttributeControlGenerator = require('./generators/templates/attributecontrol.template.generator');

module GeneratorHandler {
    export getGenerator = (controlName: string) => {
        var controlGenerator: generators.ITemplateGenerator = null;
        if (type === 'viewcontrol') {
            controlGenerator = new ViewControlGenerator(name, config.type, registeredname);
        } else if (type === 'injectable') {
            controlGenerator = new InjectableGenerator(name, registeredname);
        } else if (type === 'repository') {
            controlGenerator = new RepositoryGenerator(name, registeredname);
        } else if (type === 'service') {
            controlGenerator = new ServiceGenerator(name, registeredname);
        } else if (type === 'templatecontrol') {
            controlGenerator = new TemplateControlGenerator(name, registeredname);
        } else if (type === 'model') {
            controlGenerator = new ModelGenerator(name, registeredname);
        } else if (type === 'attribute') {
            controlGenerator = new AttributeControlGenerator(name, registeredname);
        } else {
            throw 'Unknown control type.';
        }
        
        return controlGenerator; 
    };
}

export = GeneratorHandler;

