import BaseView = require('../base.view');

class CliGenericView extends BaseView {
    setResponse(response: string, error?: string): any {
        if (error) {
            if (this._debug) {
                super.setResponse('', 'CLI Command: ' + error);
                return;
            }
            super.setResponse('', 'An error occurred while executing this command.');
            return;
        }

        super.setResponse('Success: ' + response);
    }
}

export = CliGenericView;
