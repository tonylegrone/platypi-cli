/// <reference path="../../_references.d.ts" />

import TemplateProvider = require('../../providers/githubtemplate.provider');

class CacheCleanController implements IController {
    private __provider;

    constructor(public view: IView) {
        this.__provider = new TemplateProvider();
    }

    clean(): Thenable<any> {
        return this.__provider.clear();
    }

    getResponseView(): Thenable<IView> {
        return this.clean().then(() => {
            this.view.setResponse('Cached Templates Cleaned');
            return this.view;
        }, (err) => {
            this.view.setResponse('', err);
            return this.view;
        });
    }

}

export = CacheCleanController;
