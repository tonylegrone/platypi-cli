/// <reference path="../_references.d.ts" />

declare module command {
    export interface ICommand {
        command: string;
        description: string;
        commandParameters: Array<command.ICommandParameter>;
        CommandView: new (...args: any[]) => IView;
        CommandController: new (...args: any[]) => IController;
        commandOptions?: Array<command.ICommandOption>;
        commandAction?: () => void;
    }
}
