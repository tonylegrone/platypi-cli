/// <reference path="_references.d.ts" />

import commander = require('commander');
import msg = require('./helpers/msg.helper');
import ConfigFinder = require('./config/config.finder');
import configGenerator = require('./generators/platypiconfig.generator');
import promises = require('es6-promise');

var package = require('../package.json'),
    Promise = promises.Promise,
    prompt = require('prompt'),
    progressbar = require('simple-progress-bar'),
    controlTypes = ['viewcontrol', 'injectable', 'repository', 'service', 'model', 'templatecontrol', 'attributecontrol'],
    platypiConfig: config.IPlatypi = null;

commander
    .version(package.version)
    .usage('[command] [parameters..]')
    .command('create [type] [name]')
    .description('Create a new PlatypusTS project of type mobile or web. Default: mobile')
    .action((type, name) => {
        process.exit(0);
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

commander.parse(process.argv);

// command not matched
if (commander.args.length > 0) {
    msg.error('No command found matching ' + commander.args[0]);
    process.exit(1);
}

// no command issued use the CLI q&a
// commander.js TS definitions need to be updated using <any> for now.
msg.label('Platypi Command Line Interface');
msg.log('Version ' + package.version);
msg.log('Now entering interactive project generation...');

// use prompt to fill in platypi.json properties
configGenerator().then((config) => {
    platypiConfig = config;
    msg.log('Config file created, generating project structure...');
});
