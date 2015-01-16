/// <reference path="../../_references.d.ts" />

declare module config {

    /**
     *  Interface for Platypi Project Config
     */
    export interface IPlatypi {
        cordovaId?: string;
        configPath?: string;
        name?: string;
        description?: string;
        author?: string;
        email?: string;
        homepage?: string;
        type: string;
        version?: string;
        root?: string;
        public?: string;
        cordova?: string;
        mainFile?: string;
        viewcontrols?: Array<IPlatypusControl>;
        injectables?: Array<IPlatypusControl>;
        services?: Array<IPlatypusControl>;
        models?: Array<IPlatypusControl>;
        repositories?: Array<IPlatypusControl>;
        templatecontrols?: Array<IPlatypusControl>;
        attributecontrols?: Array<IPlatypusControl>;
        cliDepend?: string;

        addControl(control: IPlatypusControl);
        removeControl(type: string, name: string);

        save(configPath?: string): Thenable<string>;
    }

    /**
     *  Interface for Control Config Property
     */
    export interface IPlatypusControl {
        name: string;
        type: string;
        path?: string;
        registeredName?: string;
    }

}
