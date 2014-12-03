declare module providers {
    export interface ITemplateProvider {
        update(): Thenable<any>;
        clear(): Thenable<any>;
    }
}
