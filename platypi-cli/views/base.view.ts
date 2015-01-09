/// <reference path="../_references.d.ts" />
import util = require('util');
import msg = require('../helpers/msg.helper');
import globals = require('../globals');

class BaseView implements IView {
    public logger = msg;
    public model: IModel;
    _errorText = '';
    _responseText = '';
    _debug = globals.debug || false;

    constructor() {}

    display() {
        if (this.model.errorMessage && this.model.errorMessage !== '') {
            this.logger.error(util.format(this._errorText, this.model.errorMessage));
            return;
        }

        this.logger.log(util.format(this._responseText, this.model.successMessage));
    }
}

export = BaseView;

