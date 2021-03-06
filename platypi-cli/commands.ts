/// <reference path="_references.d.ts" />

// Views
import NewProjectView = require('./views/project/new/new.project.view');
import AddControlsView = require('./views/controls/add/add.controls.view');
import CliGenericView = require('./views/cli/cli.view');
import ListControlsView = require('./views/controls/list/list.controls.view');

// Controllers
import NewProjectController = require('./controllers/project/new/new.project.controller');
import AddControlsController = require('./controllers/controls/add/add.controls.controller');
import CliUpdateTemplatesController = require('./controllers/cli/updatetemplates.controller');
import CliCacheCleanController = require('./controllers/cli/cacheclean.controller');
import ListControlsController = require('./controllers/controls/list/list.controls.controller');
import TemplateVersionController = require('./controllers/cli/templateversion.controller');

var commands: Array<command.ICommand> = [];

/**
 *  New Project Command
 */
commands.push({
    command: 'create',
    description: 'Create a new PlatypusTS project.',
    commandParameters: [
        {
            name: 'name'
        }
    ],
    CommandView: NewProjectView,
    CommandController: NewProjectController,
    commandOptions: [
        {
            shortFlag: 'c',
            longFlag: 'cordovaid',
            description: 'Set the cordova id for the project.'
        }
    ]
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
    description: 'Add a new component to an existing project.',
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
            description: 'Register Name for the component with the framework'
        },
        {
            shortFlag: 'e',
            longFlag: 'extends',
            description: 'Set the class this component should extend.'
        }
    ]
});

/**
 * List Components Command.
 */
commands.push({
    command: 'list',
    description: 'List components in a project.',
    commandParameters: [],
    CommandView: ListControlsView,
    CommandController: ListControlsController
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


 /**
  * Project Template Version
  */
 commands.push({
     command: 'template',
     description: 'Prints the template version number used to generate the project in the current working directory.',
     commandParameters: [],
     CommandView: CliGenericView,
     CommandController: TemplateVersionController
 });

export = commands;
