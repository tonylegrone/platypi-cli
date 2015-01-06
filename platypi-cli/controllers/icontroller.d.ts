/// <reference path="../_references.d.ts" />

export interface IController {
    view: IView;
    getResopnseView(): Thenable<IView>;
}
