/// <reference path="_references.d.ts" />

// Commands
import Commands = require('./commands');

// Command Handler
import CommandHandler = require('./handlers/command.handler');

// CLI Lib
import commander = require('commander');

// Global Variables
import globals = require('./globals');

globals.identifyApplication();

var handler = new CommandHandler(commander, globals.package.version, '[command] [args..]', globals.console);

Commands.map(handler.registerCommand, handler);

handler.runCommand(process.argv);

