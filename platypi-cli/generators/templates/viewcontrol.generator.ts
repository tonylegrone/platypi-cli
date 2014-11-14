/// <reference path="../../_references.d.ts" />

import BaseTemplateGenerator = require('./base.template.generator');
import path = require('path');

class ViewControlTemplateGenerator extends BaseTemplateGenerator {
    constructor(name: string, type: string, registeredName?: string) {
        var environmentVariables: Array<config.IEnvironmentVariable> = [];
        environmentVariables.push(<config.IEnvironmentVariable>{ name: 'name', value: name });
        environmentVariables.push(<config.IEnvironmentVariable>{ name: 'registerName', value: registeredName || name });
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
            return newPath;
        });
    }

}

export = ViewControlTemplateGenerator;
