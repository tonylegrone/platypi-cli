/// <reference path="_references.d.ts" />

import commander = require('commander');
import msg = require('./helpers/msg.helper');
import ConfigFinder = require('./config/project/config.finder');
import ConfigGenerator = require('./generators/platypiconfig.generator');
import ProjectGenerator = require('./generators/templates/project.template.generator');
import ViewControlGenerator = require('./generators/templates/viewcontrol.generator');
import PlatypiConfig = require('./config/project/platypi.config');

var package = require('../package.json')
// TODO:   , progressbar = require('simple-progress-bar')
    , controlTypes = ['viewcontrol', 'injectable', 'repository', 'service', 'model', 'templatecontrol', 'attributecontrol']
    , platypiConfig: config.IPlatypi = null;

var identifyApplication = () => {
    msg.label('Platypi Command Line Interface');
    msg.log('Version ' + package.version);
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
    .version(package.version)
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
    .command('add viewcontrol [name] [ registered name]')
    .description('Add a new ViewControl to an existing project.')
    .action((name, registeredname) => {
        var finder = new ConfigFinder();
        finder.findConfig().then((config) => {
            platypiConfig = config;
            var controlGenerator = new ViewControlGenerator('viewcontrol', name, registeredname);
            controlGenerator.generateViewControl(config).then((newPath) => {
                msg.log('New ViewControl generated at: ' + newPath);
            });
        }, (err) => {
            msg.error(err);
            process.exit(1);
        });
    });

commander
    .command('add <type> [name] [registered name]')
    .description('Add a new control to your project. Types: [' + controlTypes.reduce((a, b) => { return a + ', ' + b; }) + ']')
    .action((type, name, registeredname) => {
        var finder = new ConfigFinder();
        finder.findConfig().then((config) => {
            platypiConfig = config;
            process.exit(0);
        }, (err) => {
            msg.error(err);
            process.exit(1);
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
