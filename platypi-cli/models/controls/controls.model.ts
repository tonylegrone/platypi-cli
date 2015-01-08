/// <reference path="../../_references.d.ts" />
import PlatypiConfig = require('../../config/project/platypi.config');
import ConfigFinder = require('../../config/project/config.finder');
import GeneratorHandler = require('../../handlers/generator.handler');
import DirUtils = require('../../utils/directory.utils');

class ControlsModel implements IModel {
    public type: string;
    public name: string;
    public registeredName: string;
    public errorMessage: string;
    public successMessage: string;

    constructor(type: string, name: string, registeredName?: string) {
        this.type = type.toLowerCase().trim();
        this.name = name.trim();
        this.registeredName = (registeredName && registeredName !== '' ? registeredName.trim() : this.name);
    }

    private __getConfig(): Thenable<config.IPlatypi> {
        // TODO: get rid of finder constructor
        var finder = new ConfigFinder();
        return finder.findConfig().then(PlatypiConfig.loadFromObject);
    }

    create(): Thenable<string> {
        return this.__getConfig().then((config) => {
            var generator = GeneratorHandler.getGenerator(this.type, this.name, this.registeredName, config.type);
            return generator.generate(config);
        });
    }

    delete(): Thenable<any> {
        return this.__getConfig().then((config) => {
            var deletedControl: config.IPlatypusControl = config.removeControl(this.type, this.name);
            return DirUtils.deleteDirectoryRecursive(deletedControl.path).then(() => {
                return deletedControl.path;
            });
        });
    }

}

export = ControlsModel;
