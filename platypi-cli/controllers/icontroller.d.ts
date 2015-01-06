/// <reference path="../_references.d.ts" />

interface IController {
    view: IView;
    getResponseView(): Thenable<IView>;
}
