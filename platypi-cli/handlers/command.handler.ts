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

    registerCommand(commandObj: command.ICommand) {

        var commandString: string = commandObj.command;

        // concat command parameters
        commandObj.commandParameters.forEach((parameter) => {
            commandString += ' [' + parameter.name + ']';
        });

        var newCommand = this.commander.command(commandString);
        newCommand.description(commandObj.description);

        if (commandObj.commandOptions && commandObj.commandOptions.length > 0) {
            commandObj.commandOptions.forEach((option) => {
                var optionString = util.format('-%s,--%s [value]', option.shortFlag, option.longFlag);
                newCommand.option(optionString, option.description);
            });
        }

        if (commandObj.commandAction) {
            newCommand.action(commandObj.commandAction);
        } else {
            newCommand.action((...args: any[]) => {
                var view = new commandObj.CommandView();
                var optionsArguments = [];
                var controller: IController;

                if (args) {
                    if ((<any>args).options) {
                        commandObj.commandOptions.forEach((option) => {
                            optionsArguments.push((<any>args).options[option.longFlag]);
                        });
                        args = args.splice(0, args.indexOf('options'));
                        args = args.concat(args, optionsArguments);
                        var newArgs = [view].concat(args);
                    }
                    controller = commandObj.CommandController.apply(this, newArgs);
                } else {
                    controller = new commandObj.CommandController(view);
                }

                controller.getResponseView().then((responseView) => {
                    responseView.display();
                    process.exit(0);
                });
            });
        }

        this.registeredCommands[commandObj.command] = commandObj;
    }

}

export = CommandHandler;
