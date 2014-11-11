import path = require('path');
import fileutils = require('../../utils/file.utils');

class Config implements config.IPlatypi {
    // required
    private __name: string = 'New Platypi Project';

    get name(): string {
        return this.__name;
    }

    set name(value: string) {
        this.__name = value;
    }

    private __author = 'Platypi';

    get author(): string {
        return this.__author;
    }

    set author(value: string) {
        this.__author = value;
    }

    private __type = 'web';

    get type(): string {
        return this.__type;
    }

    set type(value: string) {
        this.__type = value.toLowerCase();
    }

    // optional

    private __description = 'A new PlatypusTS project.';

    get description(): string {
        return this.__description;
    }

    set description(value: string) {
        this.__description = value;
    }

    private __email;

    get email(): string {
        return this.__email;
    }

    set email(value: string) {
        this.__email = value;
    }

    private __homepage = 'http://getplatypi.com';

    get homepage(): string {
        return this.__homepage;
    }

    set homepage(value: string) {
        this.__homepage = value;
    }

    private __root;

    get root(): string {
        return this.__root;
    }

    set root(value: string) {
        this.__root = path.normalize(value);
    }

    private __public;

    get public(): string {
        return this.__public;
    }

    set public(value: string) {
        this.__public = path.normalize(value);
    }

    private __cordova;

    get cordova(): string {
        return this.__cordova;
    }

    set cordova(value: string) {
        this.__cordova = path.normalize(value);
    }

    private __viewcontrols: Array<config.IViewControl> = new Array();

    get viewcontrols(): Array<config.IViewControl> {
        return this.__viewcontrols;
    }

    set viewcontrols(value: Array<config.IViewControl>) {
        this.__viewcontrols = value;
    }

    private __injectables: Array<config.IInjectable> = new Array();

    get injectables(): Array<config.IInjectable> {
        return this.__injectables;
    }

    set injectables(value: Array<config.IInjectable>) {
        this.__injectables = value;
    }
    
    private __services: Array<config.IService> = new Array();

    get services(): Array<config.IService> {
        return this.__services;
    }

    set services(value: Array<config.IService>) {
        this.__services = value;
    }

    private __repositories: Array<config.IRepository> = new Array();

    get repositories(): Array<config.IRepository> {
        return this.__repositories;
    }

    set repositories(value: Array<config.IRepository>) {
        this.__repositories = value;
    }

    private __models: Array<config.IModel> = new Array();

    get models(): Array<config.IModel> {
        return this.__services;
    }

    set models(value: Array<config.IModel>) {
        this.__services = value;
    }

    private __templatecontrols: Array<config.ITemplateControl> = new Array();

    get templatecontrols(): Array<config.ITemplateControl> {
        return this.__templatecontrols;
    }

    set templatecontrols(value: Array<config.ITemplateControl>) {
        this.__templatecontrols = value;
    }

    private __attributecontrols: Array<config.IAttributeControl> = new Array();

    get attributecontrols(): Array<config.IAttributeControl> {
        return this.__attributecontrols;
    }

    set attributecontrols(value: Array<config.IAttributeControl>) {
        this.__attributecontrols = value;
    }

    save(configPath: string): Thenable<string> {
        return fileutils.writeFile(configPath, JSON.stringify(this));
    }

    addViewControl(name: string, type: string, registeredName?: string) {
        var newViewControl: config.IViewControl = {
            name: name,
            type: type,
            registeredName: registeredName || name
        };
        this.__viewcontrols.push(newViewControl);
    }

    addInjectable(name: string, type: string, registeredName?: string) {
        var newInjectable: config.IInjectable = {
            name: name,
            type: type,
            registeredName: registeredName || name
        };
        this.__injectables.push(newInjectable);
    }

    addService(name: string, type: string, registeredName?: string) {
        var newService: config.IService = {
            name: name,
            type: type,
            registeredName: registeredName || name
        };
        this.__services.push(newService);
    }

    addModel(name: string, type: string, registeredName?: string) {
        var newModel: config.IModel = {
            name: name,
            type: type,
            registeredName: registeredName || name
        };
        this.__models.push(newModel);
    }

    addTemplateControl(name: string, type: string, registeredName?: string) {
        var newTemplateControl: config.ITemplateControl = {
            name: name,
            type: type,
            registeredName: registeredName || name
        };
        this.__templatecontrols.push(newTemplateControl);
    }

    addAttributeControl(name: string, type: string, registeredName?: string) {
        var newAttributeControl: config.IAttributeControl = {
            name: name,
            type: type,
            registeredName: registeredName || name
        };
        this.__attributecontrols.push(newAttributeControl);
    }

    addRepository(name: string, type: string, registeredName?: string) {
        var newRepository: config.IRepository = {
            name: name,
            type: type,
            registeredName: registeredName || name
        };
        this.__repositories.push(newRepository);
    }

    static CreateNewMobileConfig(): config.IPlatypi {
        var mobileConfig = new Config();
        mobileConfig.type = 'mobile';

        // TODO: this should be configurable in the template version
        mobileConfig.addModel('base', 'model');
        mobileConfig.addModel('server', 'model');

        mobileConfig.addRepository('base', 'repository');

        mobileConfig.addService('base', 'service');

        mobileConfig.addViewControl('base', 'viewcontrol');

        mobileConfig.addViewControl('home', 'viewcontrol');

        return mobileConfig;
    }

    static CreateNewWebConfig(): config.IPlatypi {
        var webConfig = new Config();
        webConfig.type = 'web';

        // TODO: this should be configurable in the template version
        webConfig.addModel('base', 'model');
        webConfig.addModel('server', 'model');

        webConfig.addRepository('base', 'repository');

        webConfig.addService('base', 'service');

        webConfig.addViewControl('base', 'webviewcontrol');

        webConfig.addViewControl('home', 'webviewcontrol');

        return webConfig;
    }

    static load(configPath: string): Thenable<config.IPlatypi> {
        return fileutils.readFile(configPath, { encoding: 'utf8' }).then((data) => {
            var configData: config.IPlatypi = JSON.parse(data)
                , parsedConfig = new Config()
                , keys = Object.keys(configData);

            keys.forEach((key) => {
                parsedConfig[key] = configData[key] || parsedConfig[key];
            });

            return parsedConfig;
        }, (err) => {
            throw err;
        });
    }

}

export = Config;
