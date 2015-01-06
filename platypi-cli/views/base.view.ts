/// <reference path="../_references.d.ts" />
import msg = require('../helpers/msg.helper');

class BaseView implements IView {
    logger = msg;
    constructor(public responseText?: string) {}

    display() {
        this.logger.log(this.responseText);
        return;
    }
}

export = BaseView;

