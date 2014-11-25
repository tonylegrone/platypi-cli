declare module config {
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
                    attribute: string;
                    injectable: string;
                    model: string;
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
            }
        };
        projectStruct: Array<string>;
        controlLocation: {
            attribute: string;
            injectable: string;
            model: string;
            repository: string;
            service: string;
            templatecontrol: string;
            viewcontrol: string;
        };
   }
}
