declare module config {
    export interface IPlatypiCliConfig {
        version: string;
        templates: {
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
    }
}
