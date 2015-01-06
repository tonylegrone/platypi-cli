import BaseView = require('../../base.view');

class NewProjectView extends BaseView {
    display() {
        this.logger.log('New Project created at: ' + this.responseText);
    }
}
