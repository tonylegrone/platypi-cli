/// <reference path="_references.d.ts" />

import commander = require('commander');
import msg = require('./helpers/msg.helper');
import ConfigFinder = require('./config/project/config.finder');
import ConfigGenerator = require('./generators/platypiconfig.generator');
import ProjectGenerator = require('./generators/templates/project.template.generator');
import ViewControlGenerator = require('./generators/templates/viewcontrol.template.generator');
import InjectableGenerator = require('./generators/templates/injectable.template.generator');
import RepositoryGenerator = require('./generators/templates/repository.template.generator');
import ServiceGenerator = require('./generators/templates/service.template.generator');
import TemplateControlGenerator = require('./generators/templates/templatecontrol.template.generator');
import ModelGenerator = require('./generators/templates/model.template.generator');
import AttributeControlGenerator = require('./generators/templates/attributecontrol.template.generator');
import TemplateProvider = require('./providers/githubtemplate.provider');
import PlatypiConfig = require('./config/project/platypi.config');
import globals = require('./globals');

var platypiConfig: config.IPlatypi = null
    , provider = new TemplateProvider()
    , identifyApplication = () => {
        msg.label('Platypi Command Line Interface');
        msg.log('Version ' + globals.package.version);
    };

var parseVariables = (newConfig: config.IPlatypi): Array<config.IEnvironmentVariable> => {
    var environmentVariables: Array<config.IEnvironmentVariable> = []
        , configKeys = Object.keys(newConfig);

    configKeys.forEach((key) => {
        var value = newConfig[key];
        if (!(value instanceof Array)) {
            var envVar: config.IEnvironmentVariable = {
                name: key,
                value: value
            };
            environmentVariables.push(envVar);
        }
    });

    return environmentVariables;
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

        var environmentVariables = parseVariables(newConfig);

        var projectGen = new ProjectGenerator(newConfig.type, environmentVariables);
        projectGen.generateProject(newConfig).then((path) => {
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

                var registeredname = (<any>options).registername
                    , controlGenerator = null;

                type = type.toLowerCase().trim();

                if (type === 'viewcontrol') {
                    controlGenerator = new ViewControlGenerator(name, config.type, registeredname);
                } else if (type === 'injectable') {
                    controlGenerator = new InjectableGenerator(name, registeredname);
                } else if (type === 'repository') {
                    controlGenerator = new RepositoryGenerator(name, registeredname);
                } else if (type === 'service') {
                    controlGenerator = new ServiceGenerator(name, registeredname);
                } else if (type === 'templatecontrol') {
                    controlGenerator = new TemplateControlGenerator(name, registeredname);
                } else if (type === 'model') {
                    controlGenerator = new ModelGenerator(name, registeredname);
                } else if (type === 'attribute') {
                    controlGenerator = new AttributeControlGenerator(name, registeredname);
                } else {
                    throw 'Unknown control type.';
                }

                return controlGenerator.generate(config);
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
            var environmentVariables = parseVariables(newConfig);

            var projectGen = new ProjectGenerator(newConfig.type, environmentVariables);
            return projectGen.generateProject(newConfig);

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
