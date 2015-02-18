import BaseView = require('../../base.view');

class AddControlsView extends BaseView {
    constructor() {
        super();
        this._errorText = 'Could not add component: %s';
        this._responseText = 'Component added at: %s';
    }
}

export = AddControlsView;
