/// <reference path="_references.d.ts" />

import commander = require('commander');
import ConfigFinder = require('./config/project/config.finder');
import ConfigGenerator = require('./generators/platypiconfig.generator');
import ProjectGenerator = require('./generators/templates/project.template.generator');
import TemplateProvider = require('./providers/githubtemplate.provider');
import GeneratorHandler = require('./handlers/generator.handler');
import PlatypiConfig = require('./config/project/platypi.config');
import EnvironmentVariableHandler = require('./handlers/environmentvariable.handler');
import globals = require('./globals');

var provider = new TemplateProvider();

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
        var newConfig = (type === 'mobile' ? PlatypiConfig.CreateNewMobileConfig() : PlatypiConfig.CreateNewWebConfig());

        newConfig.name = name;

        var environmentVariables = EnvironmentVariableHandler.parseVariables(newConfig);

        var projectGen = new ProjectGenerator(newConfig.type, environmentVariables);
        projectGen.generate(newConfig).then((path) => {
            globals.console.log('New Project at: ' + path);
            process.exit(0);
        }, (err) => {
            globals.console.error(err);
            process.exit(1);
        });
    });

/**
 * Add Control Command.
 */
commander
    .command('add <type> <name>')
    .description('Add a new control to an existing project.')
    .option('-r, --registername [value]', 'Register Name for Control with the framework')
    .action((type:string , name: string, options: any) => {
        var finder = new ConfigFinder();
        finder.findConfig()
            .then((config) => {
                // commander.js TS definitions need to be updated using <any> for now.
                // generate project from command prompts
                var registeredname = (<any>options).registername
                    , controlGen = GeneratorHandler.getGenerator(type.toLowerCase().trim(), name, registeredname, config.type);

                return controlGen.generate(config);
            })
            .then((newPath) => {
                globals.console.log('New ' + type + ' generated at: ' + newPath);
                process.exit(0);
            }, (err) => {
                globals.console.error(err);
                process.exit(1);
            });
    });

/**
 * Update templates command.
 */
commander
    .command('update')
    .description('Update the cached CLI files.')
    .action(() => {
        globals.console.log('Forcing template update...');
        provider.update().then(() => {
            globals.console.log('Templates Updated.');
        });
    });

/**
 * Delete Cached Templates
 */
commander
    .command('cache-clean')
    .description('Clean the CLI cache directory.')
    .action(() => {
        globals.console.log('Cleaning the cache directory...');
        provider.clear().then(() => {
            globals.console.log('Cache has been cleaned.');
        });
    });

/**
 * Initialize a New Project through prompts
 */
commander
    .command('init')
    .description('initialize a new Platypi project through a series of prompts.')
    .action(() => {
        // commander.js TS definitions need to be updated using <any> for now.
        // generate project from command prompts
        globals.console.log('Now entering interactive project generation...');
        ConfigGenerator().then((newConfig) => {
            var environmentVariables = EnvironmentVariableHandler.parseVariables(newConfig);

            var projectGen = new ProjectGenerator(newConfig.type, environmentVariables);
            return projectGen.generate(newConfig);

        }).then((path) => {
            globals.console.log('New Project at: ' + path);
        }, (err) => {
            globals.console.error(err);
            process.exit(0);
        });
    });

commander.parse(process.argv);

// No command issued, display help
if (!commander.args.length) {
    commander.help();
}
