import BaseView = require('../../base.view');

class NewProjectView extends BaseView {
    constructor() {
        super('');
    }
    display() {
        this.logger.log('New Project created at: ' + this.responseText);
    }
}

export = NewProjectView;
