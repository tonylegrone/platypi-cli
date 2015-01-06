/// <reference path="../_references.d.ts" />
import globals = require('../globals');

class BaseView implements IView {
    logger = globals.console;
    constructor(public responseText?: string) {}

    display() {
        logger.log(this.responseText);
        return;
    }
}

export = BaseView;

