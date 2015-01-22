/// <reference path="../../../_references.d.ts" />

import ProjectGenerator = require('../../../generators/templates/project.template.generator');
import Model = require('../../../models/project/project.model');
import ConfigGenerator = require('../../../generators/platypiconfig.generator');

class NewProjectController implements IController {
    public model;
    public init = false;
    configGen = ConfigGenerator;

    constructor(public view: IView, type: string, name: string, cordovaId?: string) {
        if (!type || type === '') {
            type = 'web';
        }
        if (!name || name === '') {
            this.init = true;
        }
        this.model = new Model(type, name, null, cordovaId);
        this.view.model = this.model;
    }

    create(): Thenable<string> {
        if (this.init) {
            return this.configGen().then((newConfig) => {
                this.model = new Model(newConfig.type, newConfig.name, newConfig);
                var generator = new ProjectGenerator(this.model.type, this.model.environmentVariables);
                return generator.generate();
            });
        } else {
            var generator = new ProjectGenerator(this.model.type, this.model.environmentVariables);
            return generator.generate();
        }
    }

    getResponseView(): Thenable<any> {
        return this.create().then((path) => {
            this.model.successMessage = path;
            return this.view;
        }, (err) => {
            this.model.errorMessage = err;
            return this.view;
        });
    }
}

export = NewProjectController;

