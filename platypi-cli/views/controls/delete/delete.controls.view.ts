import BaseView = require('../../base.view');

class DeleteControlsView extends BaseView {
    constructor() {
        super();
        this._errorText = 'Could not deleted control: %s';
        this._responseText = 'Control deleted at: $s';
    }
}

export = DeleteControlsView;
