/// <reference path="../../../_references.d.ts" />

import PlatypiConfig = require('../../../config/project/platypi.config');
import ProjectGenerator = require('../../../generators/templates/project.template.generator');
import EnvironmentVariableHandler = require('../../../handlers/environmentvariable.handler');
import Model = require('../../../models/project/project.model');

class NewProjectController implements IController {
    public model;

    constructor(public view: IView, type: string, name: string) {
        this.model = new Model(type, name);
    }

    create(): Thenable<string> {
        var generator = new ProjectGenerator(this.model.type, this.model.environmentVariables);
        return generator.generate(this.model.config);
    }

    getResponseView(): Thenable<any> {
        return create().then((path) => {
            this.view.responseText = path;
            return this.view;
        });
    }
}

export = NewProjectController;

