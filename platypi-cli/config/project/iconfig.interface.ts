declare module config {

    /**
     *  Interface for Platypi Project Config
     */
    export interface IPlatypi {
        name: string;
        description?: string;
        author: string;
        email?: string;
        homepage?: string;
        type: string;
        version?: string;
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
        cliDepend?: string;

        addControl(name: string, type: string, registeredName?: string);
        addViewControl(name: string, type: string, registeredName?: string);
        addInjectable(name: string, type: string, registeredName?: string);
        addService(name: string, type: string, registeredName?: string);
        addModel(name: string, type: string, registeredName?: string);
        addRepository(name: string, type: string, registeredName?: string);
        addTemplateControl(name: string, type: string, registeredName?: string);
        addAttributeControl(name: string, type: string, registeredName?: string);

        save(configPath?: string): Thenable<string>;
    }

    /**
     *  Interface for Viewcontrol Config property
     */
    export interface IViewControl {
        name: string;
        type: string;
        registeredName?: string;
    }

    /**
     *  Interface for Injectable Config property.
     */
    export interface IInjectable {
        name: string;
        type: string;
        registeredName?: string;
    }

    /**
     *  Interface for Repository Config property.
     */
    export interface IRepository {
        name: string;
        type: string;
        registeredName?: string;
    }

    /**
     *  Interface for Service Config property.
     */
    export interface IService {
        name: string;
        type: string;
        registeredName?: string;
    }

    /**
     *  Interface for Model Config property.
     */
    export interface IModel {
        name: string;
        type: string;
        registeredName?: string;
    }

    /**
     *  Interface for TemplateControl config property.
     */
    export interface ITemplateControl {
        name: string;
        type: string;
        registeredName?: string;
    }

    /**
     *  Interface for AttributeControl config property.
     */
    export interface IAttributeControl {
        name: string;
        type: string;
        registeredName?: string;
    }

}
