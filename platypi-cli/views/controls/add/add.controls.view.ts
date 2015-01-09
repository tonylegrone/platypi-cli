import BaseView = require('../../base.view');

class AddControlsView extends BaseView {
    constructor() {
        super();
        this._errorText = 'Could not add control: %s';
        this._responseText = 'Control added at: %s';
    }
}

export = AddControlsView;
