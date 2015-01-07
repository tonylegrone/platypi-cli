/// <reference path="../_references.d.ts" />
import msg = require('../helpers/msg.helper');
import globals = require('../globals');

class BaseView implements IView {
    public logger = msg;
    private __responseText = '';
    private __errorText = '';
    _debug = globals.debug || false;

    constructor() {}

    setResponse(response: string, error?: string): any {
       if (error) {
           this.__errorText = error;
           return;
       }

       this.__responseText = response;
    }

    display() {
        if (this.__errorText !== '') {
            this.logger.error(this.__errorText);
            return;
        }

        this.logger.log(this.__responseText);
    }
}

export = BaseView;

