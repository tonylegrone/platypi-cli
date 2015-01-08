/// <reference path="_references.d.ts" />

// Views
import NewProjectView = require('./views/project/new/new.project.view');
import AddControlsView = require('./views/controls/add/add.controls.view');
import CliGenericView = require('./views/cli/cli.view');

// Controllers
import NewProjectController = require('./controllers/project/new/new.project.controller');
import AddControlsController = require('./controllers/controls/add/add.controls.controller');
import CliUpdateTemplatesController = require('./controllers/cli/updatetemplates.controller');
import CliCacheCleanController = require('./controllers/cli/cacheclean.controller');

var commands: Array<command.ICommand> = [];

/**
 *  New Project Command
 */
commands.push({
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
});

/**
 * Initialize a New Project through prompts
 */
commands.push({
    command: 'init',
    description: 'initialize a new Platypi project through a series of prompts.',
    commandParameters: [],
    CommandView: NewProjectView,
    CommandController: NewProjectController
});


/**
 * Add Control Command.
 */
commands.push({
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
});

/**
 * Update templates command.
 */
commands.push({
    command: 'update',
    description: 'Update the cached CLI files.',
    commandParameters: [],
    CommandView: CliGenericView,
    CommandController: CliUpdateTemplatesController
});


/**
 * Delete Cached Templates
 */
 commands.push({
    command: 'cache-clean',
    description: 'Clean the CLI cache directory.',
    commandParameters: [],
    CommandView: CliGenericView,
    CommandController: CliCacheCleanController
});

export = commands;
