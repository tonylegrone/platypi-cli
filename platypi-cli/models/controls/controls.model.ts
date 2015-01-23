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
    public controlsTable: Array<string>;

    constructor(type?: string, name?: string, registeredName?: string, extendsClass?: string) {
        this.type = (type && type !== '' ? type.toLowerCase().trim() : '');
        this.name = (name && name !== '' ? name.trim() : 'new' + type);
        this.registeredName = (registeredName && registeredName !== '' ? registeredName.trim() : this.name);
        this.extendsClass = (extendsClass && extendsClass !== '' ? extendsClass.trim() : '');
    }

    private __getConfig(): Thenable<config.IPlatypi> {
        return ConfigFinder.findConfig().then(PlatypiConfig.loadFromObject);
    }

    list(): Thenable<Array<string>> {
        var controlsTable: Array<string> = [];

        return this.__getConfig().then((config) => {
            // attributecontrols
            controlsTable = controlsTable.concat(this.__formatControlTypeString('Attribute Controls', config.attributecontrols));

            // injectables
            controlsTable = controlsTable.concat(this.__formatControlTypeString('Injectables', config.injectables));

            // models
            controlsTable = controlsTable.concat(this.__formatControlTypeString('Models', config.models));

            // repositories
            controlsTable = controlsTable.concat(this.__formatControlTypeString('Repositories', config.repositories));

            // services
            controlsTable = controlsTable.concat(this.__formatControlTypeString('Services', config.services));

            // templatecontrols
            controlsTable = controlsTable.concat(this.__formatControlTypeString('Template Controls', config.templatecontrols));

            // viewcontrols
            controlsTable = controlsTable.concat(this.__formatControlTypeString('View Controls', config.viewcontrols));

            this.controlsTable = controlsTable;

            return controlsTable;
        });
    }

    private __formatControlTypeString(controlTypeName: string, controlCollection: Array<config.IPlatypusControl>): Array<string> {
        if (controlCollection.length > 0) {
            var controlTypeString: Array<string> = [],
                count = 1;

            controlTypeString.push(controlTypeName + '(' + controlCollection.length + ')');
            controlCollection.forEach((control) => {
                controlTypeString.push(count + '. ' + this.__formatControlString(control));
                count++;
            });

            return controlTypeString;
        } else {
            return [];
        }
    }

    private __formatControlString(control: config.IPlatypusControl): string {
        return 'name: ' + control.name + ' path: ' + control.path;
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
