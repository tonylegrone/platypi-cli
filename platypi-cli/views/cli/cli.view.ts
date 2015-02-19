import BaseView = require('../base.view');

class CliGenericView extends BaseView {
    constructor() {
        super();
        this._errorText = 'An error occurred while executing this command: %s';
        this._responseText = '%s';
    }
}

export = CliGenericView;
