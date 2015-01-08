/// <reference path="../../_references.d.ts" />

import TemplateProvider = require('../../providers/githubtemplate.provider');
import Model = require('../../models/cli.model');

class UpdateTemplatesController implements IController {
    private __provider;
    public model: IModel;

    constructor(public view: IView) {
        this.__provider = new TemplateProvider();
        this.model = new Model();
    }

    update(): Thenable<any> {
        return this.__provider.update();
    }

    getResponseView(): Thenable<IView> {
        return this.update().then(() => {
            this.model.successMessage = 'Templates updated from source.';
            return this.view;
        }, (err) => {
            this.model.errorMessage = err;
            return this.view;
        });
    }
}

export = UpdateTemplatesController;
