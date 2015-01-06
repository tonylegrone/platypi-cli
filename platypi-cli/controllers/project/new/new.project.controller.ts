/// <reference path="../../../_references.d.ts" />

import PlatypiConfig = require('./config/project/platypi.config');
import ProjectGenerator = require('./generators/templates/project.template.generator');
import EnvironmentVariableHandler = require('./handlers/environmentvariable.handler');

class NewProjectController implements IController {
    private __environmentVariables;
    private __config;

    constructor(public view: IView, private __type = 'web', private __name = 'New Project') {
        this.__config = (__type === 'web' ? PlatypiConfig.CreateNewWebConfig() : PlatypiConfig.CreateNewMobileConfig());
        this.__config.name = this.__name;
        this.__environmentVariables = EnvironmentVariableHandler.parse(this.__config);
    }

    create(): Thenable<string> {
        var generator = new ProjectGenerator(this.__type, this.__environmentVariables);
        return this.generate(this.__config);
    }

    getResponseView(): Thenable<any> {
        return create().then((path) => {
            this.view.responseText = path;
            return this.view;
        });
    }
}

export = NewProjectController;

