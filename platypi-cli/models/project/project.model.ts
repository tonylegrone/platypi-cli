import PlatypiConfig = require('../../config/project/platypi.config');
import EnvironmentVariableHandler = require('../../handlers/environmentvariable.handler');

class ProjectModel {
    public environmentVariables;
    public config;

    constructor(public type = 'web', public name = 'New Project') {
        this.config = (type === 'web' ? PlatypiConfig.CreateNewWebConfig() : PlatypiConfig.CreateNewMobileConfig());
        this.config.name = this.name;
        this.environmentVariables = EnvironmentVariableHandler.parseVariables(this.config);
    }
}

export = ProjectModel;

