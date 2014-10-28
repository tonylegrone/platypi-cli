/// <reference path="_references.d.ts" />

import commander = require('commander');
import msg = require('./helpers/msg.helper');

var package = require('../package.json'),
    progressbar = require('simple-progress-bar'),
    controlTypes = ['viewcontrol', 'injectable', 'repository', 'service', 'model', 'templatecontrol', 'attributecontrol'];

commander
    .version(package.version)
    .command('create [type] [name]')
    .description('Create a new PlatypusTS project of type mobile or web. Default: mobile')
    .action((type, name) => {
        if (!name) {
            msg.warning('No type specified, using Mobile');
            type = 'mobile';
        }
        if (!name) {
            msg.warning('No name specified, using NewProject');
            name = 'NewProject';
        }
        process.exit(0);
    });

commander
    .command('add <type> [name] [registered name]')
    .description('Add a new control to your project. Types: [' + controlTypes.reduce((a, b) => { return a + ', ' + b }) + ']')
    .action((type, name, registeredname) => {
        process.exit(0);
    });

commander.parse(process.argv);

// no command issued, display help
commander.help();

