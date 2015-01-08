import BaseView = require('../base.view');

class CliGenericView extends BaseView {
    constructor() {
        this._errorText = 'An error occurred while executing this command: %s';
        this._responseText = 'Success: %s';
        super();
    }
}

export = CliGenericView;
