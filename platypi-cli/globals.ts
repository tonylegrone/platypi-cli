/// <reference path="_references.d.ts" />

import msg = require('./helpers/msg.helper');

export var console = msg;

export var package = require('../package.json');

export var identifyApplication = () => {
    msg.label('Platypi Command Line Interface');
    msg.log('Version ' + package.version);
};

