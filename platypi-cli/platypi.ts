/// <reference path="_references.d.ts" />

// Command Handler
import CommandHandler = require('./handlers/command.handler');

// CLI Lib
import commander = require('commander');

// Global Variables
import globals = require('./globals');

// Views
import NewProjectView = require('./views/project/new/new.project.view');
import AddControlsView = require('./views/controls/add/add.controls.view');
import CliGenericView = require('./views/cli/cli.view');

// Controllers
import NewProjectController = require('./controllers/project/new/new.project.controller');
import AddControlsController = require('./controllers/controls/add/add.controls.controller');
import CliUpdateTemplatesController = require('./controllers/cli/updatetemplates.controller');
import CliCacheCleanController = require('./controllers/cli/cacheclean.controller');

globals.identifyApplication();

var handler = new CommandHandler(commander, globals.package.version, '[command] [args..]', globals.console);

/**
 *  New Project Command
 */
var newProjectCommand: command.ICommand = {
    command: 'create',
    description: 'Create a new PlatypusTS project of type mobile or web. Default: web',
    commandParameters: [
        {
            name: 'type'
        },
        {
            name: 'name'
        }
    ],
    CommandView: NewProjectView,
    CommandController: NewProjectController
};

handler.registerCommand(newProjectCommand);

/**
 * Initialize a New Project through prompts
 */
var newProjectInitCommand: command.ICommand = {
    command: 'init',
    description: 'initialize a new Platypi project through a series of prompts.',
    commandParameters: [],
    CommandView: NewProjectView,
    CommandController: NewProjectController
};

handler.registerCommand(newProjectInitCommand);

/**
 * Add Control Command.
 */
var addControlCommand: command.ICommand = {
    command: 'add',
    description: 'Add a new control to an existing project.',
    commandParameters: [
        {
            name: 'type'
        },
        {
            name: 'name'
        }
    ],
    CommandView: AddControlsView,
    CommandController: AddControlsController,
    commandOptions: [
        {
            shortFlag: 'r',
            longFlag: 'registername',
            description: 'Register Name for Control with the framework'
        }
    ]
};

handler.registerCommand(addControlCommand);

/**
 * Update templates command.
 */
var updateCommand: command.ICommand = {
    command: 'update',
    description: 'Update the cached CLI files.',
    commandParameters: [],
    CommandView: CliGenericView,
    CommandController: CliUpdateTemplatesController
};

handler.registerCommand(updateCommand);

/**
 * Delete Cached Templates
 */
var cleanCommand: command.ICommand = {
    command: 'cache-clean',
    description: 'Clean the CLI cache directory.',
    commandParameters: [],
    CommandView: CliGenericView,
    CommandController: CliCacheCleanController
};

handler.registerCommand(cleanCommand);

handler.runCommand(process.argv);

