/// <reference path="../../_references.d.ts" />

import BaseTemplateGenerator = require('./base.template.generator');
import path = require('path');

class ViewControlTemplateGenerator extends BaseTemplateGenerator {
    constructor(name: string, type: string, registeredName?: string) {
        var environmentVariables: Array<config.IEnvironmentVariable> = [
            {
                name: 'name',
                value: name
            },
            {
                name: 'registername',
                value: (registeredName && registeredName !== '' ? registeredName : name)
            }];
        super('viewcontrol', type, environmentVariables);
    }

    generateViewControl(projectConfig: config.IPlatypi): Thenable<string> {
        console.log('Creating ViewControl...');
        var viewControlPath = path.join(projectConfig.public, 'viewcontrols');
        return this._copyTemplateTo(viewControlPath).then((newPath) => {
            var vcType = 'viewcontrol';
            if (projectConfig.type === 'web') {
                vcType = 'webviewcontrol';
            }
            projectConfig.addViewControl(this.instanceName, vcType, this.registeredName);
            return projectConfig.save().then(() => {
                return newPath;
            });
        });
    }

}

export = ViewControlTemplateGenerator;
