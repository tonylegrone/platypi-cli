declare module config {

    export interface IPlatypi {
        name: string;
        description?: string;
        author: string;
        email?: string;
        homepage?: string;
        type: string;
        root?: string;
        public?: string;
        cordova?: string;
        viewcontrols?: Array<IViewControl>;
        injectables?: Array<IInjectable>;
        services?: Array<IService>;
        models?: Array<IModel>;
        repositories?: Array<IRepository>;
        templatecontrols?: Array<ITemplateControl>;
        attributecontrols?: Array<IAttributeControl>;

        addViewControl(name: string, type: string, registeredName?: string);
        addInjectable(name: string, type: string, registeredName?: string);
        addService(name: string, type: string, registeredName?: string);
        addModel(name: string, type: string, registeredName?: string);
        addRepository(name: string, type: string, registeredName?: string);
        addTemplateControl(name: string, type: string, registeredName?: string);
        addAttributeControl(name: string, type: string, registeredName?: string);

        save(configPath?: string): Thenable<string>;
    }

    export interface IViewControl {
        name: string;
        type: string;
        registeredName?: string;
    }

    export interface IInjectable {
        name: string;
        type: string;
        registeredName?: string;
    }

    export interface IRepository {
        name: string;
        type: string;
        registeredName?: string;
    }

    export interface IService {
        name: string;
        type: string;
        registeredName?: string;
    }

    export interface IModel {
        name: string;
        type: string;
        registeredName?: string;
    }

    export interface ITemplateControl {
        name: string;
        type: string;
        registeredName?: string;
    }

    export interface IAttributeControl {
        name: string;
        type: string;
        registeredName?: string;
    }

}
