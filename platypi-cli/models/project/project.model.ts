/// <reference path="../../_references.d.ts" />

import PlatypiConfig = require('../../config/project/platypi.config');
import EnvironmentVariableHandler = require('../../handlers/environmentvariable.handler');

class ProjectModel implements IModel {
    public errorMessage: string = '';
    public successMessage: string = '';
    public environmentVariables;
    public projectConfig;

    constructor(public type = 'web', public name = 'New Project', config?: config.IPlatypi, cordovaId?: string) {
        if (config) {
            this.projectConfig = config;
        } else {
            this.projectConfig = (type === 'web' ? PlatypiConfig.CreateNewWebConfig() : PlatypiConfig.CreateNewMobileConfig());
        }

        this.projectConfig.name = this.name;
        this.projectConfig.cordovaName = ProjectModel.SanitizeCordovaId(this.name);

        if (cordovaId) {
            this.projectConfig.cordovaId = ProjectModel.SanitizeCordovaId(cordovaId);
        } else {
            this.projectConfig.cordovaId = 'plat.' + ProjectModel.SanitizeCordovaId(name);
        }

        this.environmentVariables = EnvironmentVariableHandler.parseVariables(this.projectConfig);
    }

    static SanitizeCordovaId(id: string): string {
        var illiegalCharacters: Array<string> = [
            '-',
            ' '
        ];

        illiegalCharacters.forEach((illiegalChar) => {
            id = id.replace(illiegalChar, '');
        });

        return id;
    }
}

export = ProjectModel;

