/// <reference path="../../../_references.d.ts" />

import ProjectGenerator = require('../../../generators/templates/project.template.generator');
import Model = require('../../../models/project/project.model');

import ConfigGenerator = require('../../../generators/platypiconfig.generator');

class NewProjectController implements IController {
    public model;
    public init = false;

    constructor(public view: IView, type: string, name: string) {
        if (!type || type === '') {
            type = 'web';
        }
        if (!name || name === '') {
            this.init = true;
        }
        this.model = new Model(type, name);
    }

    create(): Thenable<string> {
        if (this.init) {
            return ConfigGenerator().then((newConfig) => {
                this.model = new Model(newConfig.type, newConfig.name, newConfig);
                var generator = new ProjectGenerator(this.model.type, this.model.environmentVariables);
                return generator.generate(this.model.config);
            });
        } else {
            var generator = new ProjectGenerator(this.model.type, this.model.environmentVariables);
            return generator.generate(this.model.config);
        }
    }

    getResponseView(): Thenable<any> {
        return this.create().then((path) => {
            this.view.setResponse(path);
            return this.view;
        }, (err) => {
            this.view.setResponse('', err);
            return this.view;
        });
    }
}

export = NewProjectController;

