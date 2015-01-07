/// <reference path="_references.d.ts" />

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

/**
 *  New Project Command
 */
commander
    .version(globals.package.version)
    .usage('[command] [parameters..]')
    .command('create [type] [name]')
    .description('Create a new PlatypusTS project of type mobile or web. Default: web')
    .action((type, name) => {
        var view = new NewProjectView()
            , controller = new NewProjectController(view, type, name);

        controller.getResponseView().then((responseView) => {
            responseView.display();
            process.exit(0);
        });
    });

/**
 * Add Control Command.
 */
commander
            console.log('here');
    .command('add <type> <name>')
    .description('Add a new control to an existing project.')
    .option('-r, --registername [value]', 'Register Name for Control with the framework')
    .action((type:string, name: string, options: any) => {
        var view = new AddControlsView()
            , registerName = (<any>options).registername
            , controller = new AddControlsController(view, type, name, registerName);

        controller.getResponseView().then((responseView) => {
            responseView.display();
        });
    });

/**
 * Initialize a New Project through prompts
 */
commander
    .command('init')
    .description('initialize a new Platypi project through a series of prompts.')
    .action(() => {
        var view = new NewProjectView()
            , controller = new NewProjectController(view, null, null, true);

        controller.getResponseView().then((responseView) => {
            responseView.display();
            process.exit(0);
        });
    });


/**
 * Update templates command.
 */
commander
    .command('update')
    .description('Update the cached CLI files.')
    .action(() => {
        var view = new CliGenericView()
            , controller = new CliUpdateTemplatesController(view);

        controller.getResponseView().then((responseView) => {
            responseView.display();
            process.exit(0);
        });
    });

/**
 * Delete Cached Templates
 */
commander
    .command('cache-clean')
    .description('Clean the CLI cache directory.')
    .action(() => {
        var view = new CliGenericView()
            , controller = new CliCacheCleanController(view);

        controller.getResponseView().then((responseView) => {
            responseView.display();
            process.exit(0);
        });
    });

commander.parse(process.argv);

// No command issued, display help
if (!commander.args.length) {
    commander.help();
}
