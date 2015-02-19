/// <reference path="../../_references.d.ts" />

import util = require('util');
import Finder = require('../../config/project/config.finder');
import Model = require('../../models/cli.model');
import globals = require('../../globals');

class TemplateVersionController implements IController {
    public model: IModel;

    constructor(public view: IView) {
        this.model = new Model();
        this.view.model = this.model;
    }

    getResponseView(): Thenable<IView> {
        return Finder.findConfig().then((projectConfig) => {
            var versions = util.format(
                'CLI templates version: %s\nProject templates version: %s',
                    globals.package.templates.version, projectConfig.templatesVersion);
            this.model.successMessage = versions;
            return this.view;
        },(err) => {
            this.model.errorMessage = 'Could not find project configuration. Please make sure you are currently in a project directory';
            return this.view;
        });
    }
}

export = TemplateVersionController;
