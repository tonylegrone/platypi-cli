/// <reference path="../../_references.d.ts" />

import BaseTemplateGenerator = require('./base.template.generator');
import path = require('path');
import promises = require('es6-promise');

var Promise = promises.Promise;

class ViewControlTemplateGenerator extends BaseTemplateGenerator {
    constructor(type: string, environmentVariables: Array<config.IEnvironmentVariable>) {
        super('viewcontrol', type, environmentVariables);
    }

    generateViewControl(projectConfig: config.IPlatypi): Thenable<string> {
        console.log('Creating ViewControl...');
        var viewControlPath = path.join(projectConfig.public, 'viewcontrols');
        return this._copyTemplateTo(viewControlPath).then((newPath) => {
            projectConfig.addViewControl(this.instanceName, 'viewcontrol', this.registeredName);
            return newPath;
        });
    }

}

export = ViewControlTemplateGenerator;
