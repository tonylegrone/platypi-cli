import path = require('path');
import fileutils = require('../../utils/file.utils');

/**
 *  Contains methods and properties for the Platypi config file.
 */
class Config implements config.IPlatypi {
    configPath = '';

    // required
    name: string = 'New Platypi Project';

    get Name(): string {
        return this.name;
    }

    set Name(value: string) {
        this.name = value;
    }

    author = 'Platypi';

    get Author(): string {
        return this.author;
    }

    set Author(value: string) {
        this.author = value;
    }

    type = 'web';

    get Type(): string {
        return this.type;
    }

    set Type(value: string) {
        this.type = value.toLowerCase();
    }

    // optional

    version: string = '0.0.1';

    get Version(): string {
        return this.version;
    }

    set Version(value: string) {
        this.version = value;
    }

    description: string = 'A new PlatypusTS project.';

    get Description(): string {
        return this.description;
    }

    set Description(value: string) {
        this.description = value;
    }

    email: string;

    get Email(): string {
        return this.email;
    }

    set Email(value: string) {
        this.email = value;
    }

    homepage: string = 'http://getplatypi.com';

    get Homepage(): string {
        return this.homepage;
    }

    set Homepage(value: string) {
        this.homepage = value;
    }

    root: string;

    get Root(): string {
        return this.root;
    }

    set Root(value: string) {
        this.root = path.normalize(value);
    }

    public: string;

    get Public(): string {
        return this.public;
    }

    set Public(value: string) {
        this.public = path.normalize(value);
    }

    cordova: string;

    get Cordova(): string {
        return this.cordova;
    }

    set Cordova(value: string) {
        this.cordova = path.normalize(value);
    }

    mainFile: string;

    get MainFile(): string {
        return this.mainFile;
    }

    set MainFile(value: string) {
        this.mainFile = path.normalize(value);
    }

    viewcontrols: Array<config.IPlatypusControl> = new Array();

    get ViewControls(): Array<config.IPlatypusControl> {
        return this.viewcontrols;
    }

    set ViewControls(value: Array<config.IPlatypusControl>) {
        this.viewcontrols = value;
    }

    injectables: Array<config.IPlatypusControl> = new Array();

    get Injectables(): Array<config.IPlatypusControl> {
        return this.injectables;
    }

    set Injectables(value: Array<config.IPlatypusControl>) {
        this.injectables = value;
    }

    services: Array<config.IPlatypusControl> = new Array();

    get Services(): Array<config.IPlatypusControl> {
        return this.services;
    }

    set Services(value: Array<config.IPlatypusControl>) {
        this.services = value;
    }

    repositories: Array<config.IPlatypusControl> = new Array();

    get Repositories(): Array<config.IPlatypusControl> {
        return this.repositories;
    }

    set Repositories(value: Array<config.IPlatypusControl>) {
        this.repositories = value;
    }

    models: Array<config.IPlatypusControl> = new Array();

    get Models(): Array<config.IPlatypusControl> {
        return this.services;
    }

    set Models(value: Array<config.IPlatypusControl>) {
        this.services = value;
    }

    templatecontrols: Array<config.IPlatypusControl> = new Array();

    get TemplateControls(): Array<config.IPlatypusControl> {
        return this.templatecontrols;
    }

    set TemplateControls(value: Array<config.IPlatypusControl>) {
        this.templatecontrols = value;
    }

    attributecontrols: Array<config.IPlatypusControl> = new Array();

    get AttributeControls(): Array<config.IPlatypusControl> {
        return this.attributecontrols;
    }

    set AttributeControls(value: Array<config.IPlatypusControl>) {
        this.attributecontrols = value;
    }

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
        return fileutils.writeFile(this.configPath, JSON.stringify(this, this.__replacer, true));
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
        mobileConfig.Type = 'mobile';

        // TODO: this should be configurable in the template version
        mobileConfig.addControl({ name: 'base', type: 'model'});
        mobileConfig.addControl({ name:'server', type: 'model'});

        mobileConfig.addControl({ name: 'base', type: 'repository'});

        mobileConfig.addControl({ name:'base', type:'service' });

        mobileConfig.addControl({ name: 'base', type: 'viewcontrol'});

        mobileConfig.addControl({ name: 'home', type: 'viewcontrol'});

        return mobileConfig;
    }

    /**
     *  Initializes a new Platypi Project Config for the web project template.
     */
    static CreateNewWebConfig(): config.IPlatypi {
        var webConfig = new Config();
        webConfig.Type = 'web';

        // TODO: this should be configurable in the template version
        webConfig.addControl({ name: 'base', type: 'model'});
        webConfig.addControl({ name:'server', type: 'model' });

        webConfig.addControl({ name: 'base', type: 'repository' });

        webConfig.addControl({ name: 'base', type: 'service' });

        webConfig.addControl({ name: 'base', type: 'webviewcontrol'});

        webConfig.addControl({ name: 'home', type: 'webviewcontrol'});

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

}

export = Config;
