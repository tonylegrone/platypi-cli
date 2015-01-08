import BaseView = require('../../base.view');

class NewProjectView extends BaseView {
    constructor() {
        this._errorText = 'Error: %s';
        this._responseText = 'Project Create Controller: %s';
        super();
    }
}

export = NewProjectView;
