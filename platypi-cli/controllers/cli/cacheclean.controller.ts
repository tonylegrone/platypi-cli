/// <reference path="../../_references.d.ts" />

import TemplateProvider = require('../../providers/githubtemplate.provider');
import Model = require('../../models/cli.model');

class CacheCleanController implements IController {
    private __provider;
    public model: IModel;

    constructor(public view: IView) {
        this.__provider = new TemplateProvider();
        this.model = new Model();
        this.view.model = this.model;
    }

    clean(): Thenable<any> {
        return this.__provider.clear();
    }

    getResponseView(): Thenable<IView> {
        return this.clean().then(() => {
            this.model.successMessage = 'Cached Templates Cleaned.';
            return this.view;
        }, (err) => {
            this.model.errorMessage = 'An error occurred: %s';
            return this.view;
        });
    }

}

export = CacheCleanController;
