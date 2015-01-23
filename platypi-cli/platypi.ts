/// <reference path="_references.d.ts" />

// Commands
import Commands = require('./commands');

// Command Handler
import CommandHandler = require('./handlers/command.handler');

// CLI Lib
import commander = require('commander');

// Global Variables
import globals = require('./globals');

// Arguments passed from the user's command line.
var argumentsFromCommandLine = process.argv;

/*
 *  Setup the CLI handler
 *  @param commandsCollection A collection of ICommands
 *  @param commandLineLibrary The command line library to handle command argument and options parsing.
 *  @param versionNumber The version number of the Platypi Command Line Interface.
 *  @param usage Default command usage example for display in --help.
 *  @param logger Console log handler.
 */
var setupCli = (commandsCollection: Array<command.ICommand>, commandLineLibrary: any, versionNumber: string, usage: string, logger: any)
    : CommandHandler => {

    var handler = new CommandHandler(commandLineLibrary, versionNumber, usage, logger, globals.identifyApplication);

    commandsCollection.map(handler.registerCommand, handler);

    return handler;
};

// Initialize the CLI
var cli = setupCli(Commands, commander, globals.package.version, '[command] [args..]', globals.console);

// Run the provided command.
cli.runCommand(argumentsFromCommandLine);
