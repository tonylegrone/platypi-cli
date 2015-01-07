import BaseView = require('../../base.view');

class AddControlsView extends BaseView {
    setResponse(response: string, error?: string): any {
        if (error) {
            super.setResponse('', 'Control not added: ' + error);
            return;
        }

        super.setResponse('Control added at: ' + response);
    }
}

export = AddControlsView;
