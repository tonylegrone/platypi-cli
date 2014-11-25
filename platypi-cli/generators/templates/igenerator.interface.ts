/// <reference path="../../_references.d.ts" />

declare module generators {
    export interface ITemplateGenerator {
        generate(projectConfig: config.IPlatypi): Thenable<any>;
    }
}
