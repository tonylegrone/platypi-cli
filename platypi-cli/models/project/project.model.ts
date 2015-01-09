/// <reference path="../../_references.d.ts" />

import PlatypiConfig = require('../../config/project/platypi.config');
import EnvironmentVariableHandler = require('../../handlers/environmentvariable.handler');

class ProjectModel implements IModel {
    public errorMessage: string = '';
    public successMessage: string = '';
    public environmentVariables;
    public config;

    constructor(public type = 'web', public name = 'New Project', config?: config.IPlatypi) {
        if (config) {
            this.config = config;
        } else {
            this.config = (type === 'web' ? PlatypiConfig.CreateNewWebConfig() : PlatypiConfig.CreateNewMobileConfig());
        }
        this.config.name = this.name;
        this.environmentVariables = EnvironmentVariableHandler.parseVariables(this.config);
    }
}

export = ProjectModel;

