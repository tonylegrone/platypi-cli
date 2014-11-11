import path = require('path');
import fileutils = require('../../utils/file.utils');

class Config implements config.IPlatypi {
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

    viewcontrols: Array<config.IViewControl> = new Array();

    get ViewControls(): Array<config.IViewControl> {
        return this.viewcontrols;
    }

    set ViewControls(value: Array<config.IViewControl>) {
        this.viewcontrols = value;
    }

    injectables: Array<config.IInjectable> = new Array();

    get Injectables(): Array<config.IInjectable> {
        return this.injectables;
    }

    set Injectables(value: Array<config.IInjectable>) {
        this.injectables = value;
    }

    services: Array<config.IService> = new Array();

    get Services(): Array<config.IService> {
        return this.services;
    }

    set Services(value: Array<config.IService>) {
        this.services = value;
    }

    repositories: Array<config.IRepository> = new Array();

    get Repositories(): Array<config.IRepository> {
        return this.repositories;
    }

    set Repositories(value: Array<config.IRepository>) {
        this.repositories = value;
    }

    models: Array<config.IModel> = new Array();

    get Models(): Array<config.IModel> {
        return this.services;
    }

    set Models(value: Array<config.IModel>) {
        this.services = value;
    }

    templatecontrols: Array<config.ITemplateControl> = new Array();

    get TemplateControls(): Array<config.ITemplateControl> {
        return this.templatecontrols;
    }

    set TemplateControls(value: Array<config.ITemplateControl>) {
        this.templatecontrols = value;
    }

    attributecontrols: Array<config.IAttributeControl> = new Array();

    get AttributeControls(): Array<config.IAttributeControl> {
        return this.attributecontrols;
    }

    set AttributeControls(value: Array<config.IAttributeControl>) {
        this.attributecontrols = value;
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
        this.ViewControls.push(newViewControl);
    }

    addInjectable(name: string, type: string, registeredName?: string) {
        var newInjectable: config.IInjectable = {
            name: name,
            type: type,
            registeredName: registeredName || name
        };
        this.injectables.push(newInjectable);
    }

    addService(name: string, type: string, registeredName?: string) {
        var newService: config.IService = {
            name: name,
            type: type,
            registeredName: registeredName || name
        };
        this.services.push(newService);
    }

    addModel(name: string, type: string, registeredName?: string) {
        var newModel: config.IModel = {
            name: name,
            type: type,
            registeredName: registeredName || name
        };
        this.models.push(newModel);
    }

    addTemplateControl(name: string, type: string, registeredName?: string) {
        var newTemplateControl: config.ITemplateControl = {
            name: name,
            type: type,
            registeredName: registeredName || name
        };
        this.templatecontrols.push(newTemplateControl);
    }

    addAttributeControl(name: string, type: string, registeredName?: string) {
        var newAttributeControl: config.IAttributeControl = {
            name: name,
            type: type,
            registeredName: registeredName || name
        };
        this.attributecontrols.push(newAttributeControl);
    }

    addRepository(name: string, type: string, registeredName?: string) {
        var newRepository: config.IRepository = {
            name: name,
            type: type,
            registeredName: registeredName || name
        };
        this.repositories.push(newRepository);
    }

    static CreateNewMobileConfig(): config.IPlatypi {
        var mobileConfig = new Config();
        mobileConfig.Type = 'mobile';

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
        webConfig.Type = 'web';

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
