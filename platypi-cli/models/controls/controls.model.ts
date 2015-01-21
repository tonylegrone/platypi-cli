/// <reference path="../../_references.d.ts" />
import path = require('path');
import PlatypiConfig = require('../../config/project/platypi.config');
import ConfigFinder = require('../../config/project/config.finder');
import GeneratorHandler = require('../../handlers/generator.handler');
import MainFileHandler = require('../../handlers/mainfile.handler');
import ReferenceFileHandler = require('../../handlers/references.handler');
import DirUtils = require('../../utils/directory.utils');

class ControlsModel implements IModel {
    public type: string;
    public name: string;
    public registeredName: string;
    public extendsClass: string;
    public errorMessage: string;
    public successMessage: string;

    constructor(type: string, name: string, registeredName?: string, extendsClass?: string) {
        this.type = type.toLowerCase().trim();
        this.name = name.trim();
        this.registeredName = (registeredName && registeredName !== '' ? registeredName.trim() : this.name);
        this.extendsClass = (extendsClass && extendsClass !== '' ? extendsClass.trim() : '');
    }

    private __getConfig(): Thenable<config.IPlatypi> {
        return ConfigFinder.findConfig().then(PlatypiConfig.loadFromObject);
    }

    create(): Thenable<string> {
        return this.__getConfig().then((config) => {
            var generator = GeneratorHandler.getGenerator(this.type, this.name, this.registeredName, this.extendsClass, config.type);
            return generator.generate(config);
        });
    }

    delete(): Thenable<any> {
        return this.__getConfig().then((config) => {
            var deletedControl: config.IPlatypusControl = config.removeControl(this.type, this.name),
                deletedControlAbsolutePath: string = path.resolve(config.public, deletedControl.path);

            return MainFileHandler.removeControl(deletedControlAbsolutePath, config).then(() => {
                return ReferenceFileHandler.removeReference(deletedControlAbsolutePath, config);
            }).then(() => {
                return DirUtils.deleteDirectoryRecursive(deletedControl.path).then(() => {
                    return config.save().then(() => {
                        return deletedControl.path;
                    });
                });
            });
        });
    }

}

export = ControlsModel;
