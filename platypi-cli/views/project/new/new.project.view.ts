import BaseView = require('../../base.view');

class NewProjectView extends BaseView {
    constructor() {
        super();
        this._errorText = 'Error: %s';
        this._responseText = 'Project Created: %s';
    }
}

export = NewProjectView;
