/// <reference path="../../../_references.d.ts" />
import Model = require('../../../models/controls/controls.model');

class DeleteControlController implements IController {
    public model;

    constructor(public view: IView, type: string, name: string) {
        this.model = new Model(type, name);
        this.view.model = this.model;
    }

    delete(): Thenable<string> {
        return this.model.delete();
    }

    getResponseView(): Thenable<IView> {
        return this.delete().then((path) => {
            this.model.successMessage = path;
            return this.view;
        }, (err) => {
            this.model.errorMessage = err;
            return this.view;
        });
    }
}

export = DeleteControlController;
