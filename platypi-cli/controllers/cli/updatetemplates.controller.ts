/// <reference path="../../_references.d.ts" />

import TemplateProvider = require('../../providers/githubtemplate.provider');

class UpdateTemplatesController implements IController {
    private __provider;

    constructor(public view: IView) {
        this.__provider = new TemplateProvider();
    }

    update(): Thenable<any> {
        return this.__provider.update();
    }

    getResponseView(): Thenable<IView> {
        return this.update().then(() => {
            this.view.setResponse('Templates updated from source.');
            return this.view;
        }, (err) => {
            this.view.setResponse('', err);
            return this.view;
        });
    }
}

export = UpdateTemplatesController;
