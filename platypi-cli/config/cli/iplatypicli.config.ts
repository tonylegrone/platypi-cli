module config {
    interface IPlatypiCliConfig {
        templates: {
            lastUpdated: Date;
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
                    template: string;
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
