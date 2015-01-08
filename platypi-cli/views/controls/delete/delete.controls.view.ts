import BaseView = require('../../base.view');

class DeleteControlsView extends BaseView {
    constructor() {
        this._errorText = 'Could not deleted control: %s';
        this._responseText = 'Control deleted at: $s';
        super();
    }
}

export = DeleteControlsView;
