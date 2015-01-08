/// <reference path="../../../_references.d.ts" />
import Model = require('../../../models/controls/controls.model');

class AddControlsController implements IController {
    public model;

    constructor(public view: IView, type: string, name: string, registeredName?: string) {
        this.model = new Model(type, name, registeredName);
        this.view.model = this.model;
    }

    create(): Thenable<string> {
        return this.model.create();
    }

    getResponseView(): Thenable<IView> {
        return this.create().then((path) => {
            this.model.successMessage = path;
            return this.view;
        }, (err) => {
            this.model.errorMessage = err;
            return this.view;
        });
    }
}

export = AddControlsController;
