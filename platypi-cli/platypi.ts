/// <reference path="_references.d.ts" />

import commander = require('commander');
import msg = require('./helpers/msg.helper');

var package = require('../package.json'),
    progressbar = require('simple-progress-bar');

commander
    .version(package.version)
    .command('create [type] [name]', 'Create a new PlatypusTS project of type mobile or web. Default: mobile')
    .action(function (type, name) {
        if (!name) {
            msg.warning('No type specified, using Mobile');
            type = 'mobile';
        }
        if (!name) {
            msg.warning('No name specified, using NewProject');
            name = 'NewProject';
        }
    });

commander.parse(process.argv);
