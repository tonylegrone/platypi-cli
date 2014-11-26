﻿/// <reference path="_references.d.ts" />

import commander = require('commander');
import msg = require('./helpers/msg.helper');
import ConfigFinder = require('./config/project/config.finder');
import ConfigGenerator = require('./generators/platypiconfig.generator');
import ProjectGenerator = require('./generators/templates/project.template.generator');
import TemplateProvider = require('./providers/githubtemplate.provider');
import GeneratorHandler = require('./handlers/generator.handler');
import PlatypiConfig = require('./config/project/platypi.config');
import EnvironmentVariableHandler = require('./handlers/environmentvariable.handler');
import globals = require('./globals');

var platypiConfig: config.IPlatypi = null
    , provider = new TemplateProvider()
    , identifyApplication = () => {
        msg.label('Platypi Command Line Interface');
        msg.log('Version ' + globals.package.version);
    };

identifyApplication();

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
            msg.log('New Project at: ' + path);
            process.exit(0);
        }, (err) => {
            msg.error(err);
            process.exit(1);
        });
    });

commander
    .command('add <type> <name>')
    .description('Add a new control to an existing project.')
    .option('-r, --registername [value]', 'Register Name for Control with the framework')
    .action((type:string , name: string, options: any) => {
        var finder = new ConfigFinder();
        finder.findConfig()
            .then((config) => {
                platypiConfig = config;

                var registeredname = (<any>options).registername;

                type = type.toLowerCase().trim();

                var controlGen = GeneratorHandler.getGenerator(type, name, registeredname, config.type);
                return controlGen.generate(config);

            })
            .then((newPath) => {
                msg.log('New ' + type + ' generated at: ' + newPath);
                process.exit(0);
            }, (err) => {
                msg.error(err);
                process.exit(1);
            });
    });

commander
    .command('update')
    .description('Update the cached CLI files.')
    .action(() => {
        msg.log('Forcing template update...');
        provider.update().then(() => {
            msg.log('Templates Updated.');
        });
    });

commander
    .command('cache-clean')
    .description('Clean the CLI cache directory.')
    .action(() => {
        msg.log('Cleaning the cache directory...');
        provider.clear().then(() => {
            msg.log('Cache has been cleaned.');
        });
    });

commander
    .command('init')
    .description('initialize a new Platypi project through a series of prompts.')
    .action(() => {
        // commander.js TS definitions need to be updated using <any> for now.
        // generate project from command prompts
        msg.log('Now entering interactive project generation...');
        ConfigGenerator().then((newConfig) => {
            var environmentVariables = EnvironmentVariableHandler.parseVariables(newConfig);

            var projectGen = new ProjectGenerator(newConfig.type, environmentVariables);
            return projectGen.generate(newConfig);

        }).then((path) => {
            msg.log('New Project at: ' + path);
        }, (err) => {
            msg.error(err);
            process.exit(0);
        });
    });

commander.parse(process.argv);

if (!commander.args.length) {
    commander.help();
}
