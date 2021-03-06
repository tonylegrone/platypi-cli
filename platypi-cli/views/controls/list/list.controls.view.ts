﻿import util = require('util');
import BaseView = require('../../base.view');
import Model = require('../../../models/controls/controls.model');

class ListControlsView extends BaseView {
    public model: Model;

    constructor() {
        super();
        this._errorText = 'Could not list components: %s';
        this._responseText = 'List of components: %s';
    }

    display() {
        var model = this.model;

        if (model.errorMessage && model.errorMessage !== '') {
            this.logger.error(util.format(this._errorText, this.model.errorMessage));
            return;
        }

        if (model.controlsTable) {
            this.logger.label(util.format(this._responseText, this.model.successMessage));

            var controlsTable = model.controlsTable;

            controlsTable.forEach((controlString) => {
                if (controlString.indexOf('path') < 0) {
                    this.logger.label('Type: ' + controlString);
                } else {
                    this.logger.log(controlString);
                }
            });

            return;
        } else {
            this.logger.warning('No components in project.');
            return;
        }
    }
}

export = ListControlsView;
