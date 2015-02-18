/// <reference path="../_references.d.ts" />

import util = require('util');

class CommandHandler {
    public registeredCommands = [];
    public commander: any;

    public defaultCommands = [
        '-h',
        '--help',
        '-V',
        '--version'
    ];

    constructor(commander: any, version: string, usage: string, private __logger: any, private __identifyApplication: any) {
        this.commander = commander;
        this.commander.version(version);
        this.commander.usage(usage);
    }

    static Construct(constructor, args) {
        var c;
        function C(): void {
            constructor.apply(this, args);
        }
        C.prototype = constructor.prototype;
        c = new C();
        c.constructor = constructor;
        return c;
    }

    private __buildCommandString(commandObj: command.ICommand): string {
        var commandWithParameters = commandObj.commandParameters.reduce(
            (prev: command.ICommandParameter, next: command.ICommandParameter) => {
                return { name: prev.name + this.__concatBrackets(next.name) };
            }, { name: commandObj.command});
        return commandWithParameters.name;
    }

    private __concatBrackets(parameterName: string): string {
        return ' [' + parameterName + ']';
    }

    private __handleOptions(commandObj: command.ICommand): Array<{optionString: string; descString: string; }> {
        var options = commandObj.commandOptions || [];
        return options.map((option) => {
            return {
                optionString: util.format('-%s,--%s [value]', option.shortFlag, option.longFlag),
                descString: option.description
            };
        });
    }

    private __setDefaultAction(commandObj: command.ICommand) {
        if (commandObj.commandAction) {
            return;
        }

        commandObj.commandAction = (...args: any[]) => {
            var view = new commandObj.CommandView();
            var optionsArguments = [];
            var controller: IController;

            if (args) {
                var commanderArgs = args[commandObj.commandParameters.length];

                if (commanderArgs && commanderArgs.options && commanderArgs.options.length > 0) {
                    commandObj.commandOptions.forEach((option) => {
                        optionsArguments.push(commanderArgs[option.longFlag] || null);
                    });

                    args = args.splice(0, commandObj.commandParameters.length);
                    args = args.concat(optionsArguments);
                } else {
                    args = args.splice(0, commandObj.commandParameters.length);
                }

                var newArgs = [view].concat(args);
                controller = CommandHandler.Construct(commandObj.CommandController, newArgs);
            } else {
                controller = new commandObj.CommandController(view);
            }
            controller.getResponseView().then((responseView) => {
                responseView.display();
                process.exit(0);
            });
        };
    }

    registerCommand(commandObj: command.ICommand) {
        var newCommand = this.commander.command(this.__buildCommandString(commandObj));
        newCommand.description(commandObj.description);

        this.__handleOptions(commandObj).map((option) => {
            newCommand.option(option.optionString, option.descString);
        });

        this.__setDefaultAction(commandObj);

        newCommand.action(commandObj.commandAction);

        this.registeredCommands[commandObj.command] = commandObj;
    }

    isRegistered(cmd: string): boolean {
        if (this.registeredCommands[cmd]) {
            return true;
        }

        return false;
    }

    runCommand(args: any) {
        // register custom help
        this.commander.on('--help', function () {
            console.log('  Examples:');
            console.log('');
            console.log('    platypi add viewcontrol [name]');
            console.log('    platypi add templatecontrol [name]');
            console.log('    platypi add attributecontrol [name]');
            console.log('    platypi add repository [name]');
            console.log('    platypi add injectable [name]');
            console.log('    platypi add service [name]');
            console.log('');
            console.log('  You may also extend components from existing components: ');
            console.log('    platypi add [type] [name] --extends [name]');
            console.log('    platypi add viewcontrol [name] --extends [name]');
            console.log('    platypi add factory [name] --extends [name]');
        });

        // No command issued, display help
        if (args.length < 3) {
            this.commander.help();
            return;
        }

        if (this.defaultCommands.indexOf(args[2]) > -1) {
            this.commander.parse(args);
            return;
        }

        if (!this.isRegistered(args[2])) {
            this.__logger.error(util.format('Unknown command: %s', args[2]));
            return;
        }

        this.__identifyApplication();

        this.commander.parse(args);
    }

}

export = CommandHandler;
