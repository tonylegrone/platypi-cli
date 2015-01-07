import BaseView = require('../../base.view');

class NewProjectView extends BaseView {
    setResponse(response: string, error?: string): any {
        console.log('here');
        if (error) {
            if (this._debug) {
                super.setResponse('', 'Project Create Controller: ' + error);
                return;
            }
            super.setResponse('', 'An error occurrend and your project could not be created!');
            return;
        }

        super.setResponse('New Project Created at: ' + response);
    }
}

export = NewProjectView;
