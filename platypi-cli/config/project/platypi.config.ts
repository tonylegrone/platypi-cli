/// <reference path="../../_references.d.ts" />

import path = require('path');
import fileutils = require('../../utils/file.utils');

/**
 *  Contains methods and properties for the Platypi config file.
 */
class Config implements config.IPlatypi {
    configPath = '';

    getAbsolutePath(): string {
        return this.configPath.slice(0, this.configPath.indexOf(path.basename(this.configPath)));
    }

    projectType = 'web';

    get type(): string {
        return this.projectType;
    }

    set type(value: string) {
        this.projectType = value.toLowerCase();
    }

    publicPath: string;

    get public(): string {
        return path.resolve(this.getAbsolutePath(), this.publicPath);
    }

    set public(value: string) {
        this.publicPath = path.normalize(value);
    }

    cordovaPath: string;

    get cordova(): string {
        return path.resolve(this.getAbsolutePath(), this.cordovaPath);
    }

    set cordova(value: string) {
        this.cordova = path.normalize(value);
    }

    mainFilePath: string;

    get mainFile(): string {
        return path.resolve(this.getAbsolutePath(), this.mainFilePath);
    }

    set mainFile(value: string) {
        this.mainFilePath = path.normalize(value);
    }

    viewcontrols: Array<config.IPlatypusControl> = new Array();

    injectables: Array<config.IPlatypusControl> = new Array();

    services: Array<config.IPlatypusControl> = new Array();

    repositories: Array<config.IPlatypusControl> = new Array();

    models: Array<config.IPlatypusControl> = new Array();

    templatecontrols: Array<config.IPlatypusControl> = new Array();

    attributecontrols: Array<config.IPlatypusControl> = new Array();

    private __replacer(key, value) {
        if (key === 'configPath') {
            return undefined;
        }

        return value;
    }

    /**
     *  Save the platypi config file to disk.
     *  @param configPath String path to save the config file to.
     */
    save(configPath?: string): Thenable<string> {
        this.configPath = (configPath && configPath !== '' ? path.normalize(configPath) : this.configPath);

        if (this.configPath.indexOf('package.json') > -1) {
            // do not overwrite all config values in package.json, only those in the platypi object
            return fileutils.readFile(this.configPath).then((data) => {
                var package = JSON.parse(data);
                package.platypi = this;
                return fileutils.writeFile(this.configPath, JSON.stringify(package, this.__replacer, 4));
            });
        } else {
            return fileutils.writeFile(this.configPath, JSON.stringify(this, this.__replacer, 4));
        }
    }

    /**
     *  Add a control to the project config file.
     *  @param name The instance name of the control.
     *  @param type The control type to be added.
     *  @param registeredName The name the control will register with the framework as.
     */
    addControl(control: config.IPlatypusControl) {
        var type = (control.type === 'webviewcontrol' ? 'viewcontrol' : control.type);
        if (type.substr(type.length - 1, type.length) === 'y') {
            type = type.replace('y', 'ie');
        }
        this[type + 's'].push(control);
    }

    removeControl(type: string, name: string): config.IPlatypusControl {
        var controlArray = this[type + 's'],
            deletedControl: config.IPlatypusControl;

        this[type + 's'] = controlArray.filter((control) => {
            if (control.name !== name) {
                return true;
            } else {
                deletedControl = control;
                return false;
            }
        });

        if (!deletedControl) {
            throw 'Control of type ' + type + ' with name: ' + name + ' not found.';
        }

        return deletedControl;
    }

    /**
     *  Initialize a new Platypi Project Config for the mobile project template.
     */
    static CreateNewMobileConfig(): config.IPlatypi {
        var mobileConfig = new Config();
        mobileConfig.type = 'mobile';

        return mobileConfig;
    }

    /**
     *  Initializes a new Platypi Project Config for the web project template.
     */
    static CreateNewWebConfig(): config.IPlatypi {
        var webConfig = new Config();
        webConfig.type = 'web';

        return webConfig;
    }

    /**
     *  Load the Platypi project config from disk.
     *  @param configPath Path to the config file to be loaded from disk.
     */
    static loadFromFile(configPath: string): Thenable<config.IPlatypi> {
        return fileutils.readFile(configPath, { encoding: 'utf8' }).then((data) => {
            var configData: config.IPlatypi = JSON.parse(data)
                , parsedConfig = new Config()
                , keys = Object.keys(configData);

            keys.forEach((key) => {
                parsedConfig[key] = configData[key] || parsedConfig[key];
            });

            parsedConfig.configPath = configPath;

            return parsedConfig;
        }, (err) => {
            throw err;
        });
    }

    /**
     *  Load the project cli from another object.
     *  @param configData Object containing properties to be loaded.
     */
    static loadFromObject(configData: config.IPlatypi, configPath?: string): config.IPlatypi {
        var parsedConfig = new Config()
            , keys = Object.keys(configData);

        keys.forEach((key) => {
            parsedConfig[key] = configData[key] || parsedConfig[key];
        });

        parsedConfig.configPath = (configPath && configPath !== ''? path.normalize(configPath) : parsedConfig.configPath);

        return parsedConfig;
    }

    static isValid(config: any): boolean {
        if (!config.type || config.type === '') {
            return false;
        }

        return true;
    }

}

export = Config;
