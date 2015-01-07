/// <reference path="../_references.d.ts" />

import util = require('util');

class CommandHandler {
    public registeredCommands = [];
    public commander: any;

    constructor(commander: any, version: string, usage: string) {
        this.commander = commander;
        this.commander.version(version);
        this.commander.usage(usage);
    }

    registerCommand(command: string, description: string, commandParameters: Array<command.ICommandParameter>
            , CommandView: new (...args: any[]) => IView
            , CommandController: new (...args: any[]) => IController
            , commandOptions?: Array<command.ICommandOption>
            , commandAction?: () => void) {

        var commandString: string = command;

        // concat command parameters
        commandParameters.forEach((parameter) => {
            commandString += ' [' + parameter.name + ']';
        });

        var newCommand = this.commander.command(commandString);
        newCommand.description(description);

        if (commandOptions && commandOptions.length > 0) {
            commandOptions.forEach((option) => {
                var optionString = util.format('-%s,--%s [value]', option.shortFlag, option.longFlag);
                newCommand.option(optionString, option.description);
            });
        }

        if (commandAction) {
            newCommand.action(commandAction);
        } else {
            newCommand.action((...args: any[]) => {
                var view = new CommandView();
                var optionsArguments = [];
                var controller: IController;

                if (args) {
                    if (args['options']) {
                        commandOptions.forEach((option) => {
                            optionsArguments.push(args['options'][option.longFlag]);
                        });
                        args = args.splice(0, args.indexOf('options'));
                        args = args.concat(args, optionsArguments);
                    }
                    controller = CommandController.apply(this, args);
                } else {
                    controller = new CommandController();
                }

                controller.getResponseView().then((responseView) => {
                    responseView.display();
                    process.exit(0);
                });
            });
        }

        this.registeredCommands[command] = newCommand;
    }

}

export = CommandHandler;
