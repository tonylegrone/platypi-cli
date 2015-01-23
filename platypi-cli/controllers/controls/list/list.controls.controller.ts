/// <reference path="../../../_references.d.ts" />
import Model = require('../../../models/controls/controls.model');

class ListControlsController implements IController {
    public model;

    constructor(public view: IView, type: string) {
        this.model = new Model(type);
        this.view.model = this.model;
    }

    list(): Thenable<string> {
        return this.model.list();
    }

    getResponseView(): Thenable<IView> {
        return this.list().then((controlsTable) => {
            this.model.successMessage = 'Controls Table';
            return this.view;
        }, (err) => {
            this.model.errorMessage = err;
            return this.view;
        });
    }
}

export = ListControlsController;
