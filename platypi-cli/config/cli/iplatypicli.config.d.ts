declare module config {
    /**
     * Interface for CLI Config 
     */
    export interface IPlatypiCliConfig {
        version: string;
        templates: {
            baseLocation?: string;
            lastUpdated?: Date;
            projects: {
                mobile: string;
                web: string;
            };
            controls: {
                base: {
                    attributecontrol: string;
                    injectable: string;
                    factory: string;
                    repository: string;
                    service: string;
                    templatecontrol: string;
                };
                mobile: {
                    viewcontrol: string;
                };
                web: {
                    viewcontrol: string;
                };
            };
            projectStruct: Array<string>;
            controlLocation: {
                attributecontrol: string;
                injectable: string;
                factory: string;
                repository: string;
                service: string;
                templatecontrol: string;
                viewcontrol: string;
            };
        };
   }
}
