import path = require('path');
import fs = require('fs');
import promises = require('es6-promise');

var Promise = promises.Promise;

/*
 * Returns the current working directory as an array of strings in order.
 * i.e. /path/to/home/ = ['', 'path', 'to', 'home']
 */
export var dirToArray = (directory?: string): Array<string> => {
    if (directory) {
        return path.normalize(directory).split(path.sep);
    }

    return process.cwd().split(path.sep);
};

/*
 * Returns the directory level above the current working directory as a string.
 */
export var upOneLevel = (directory?: string): string => {
    var c: Array<string> = dirToArray(directory);

    if (c.length > 0) {
        c = c.slice(0, c.length - 1);
    }

    return c.join(path.sep);
};

/*
 * Returns the appdata path relative to the host OS
 */
export var appDataDir = (): Thenable<string> => {
    return new Promise((resolve, reject) => {
        var appdata = process.env.APPDATA || (process.platform == 'darwin' ? process.env.HOME + 'Library/Preference' : '/var/local');

        appdata = appdata + '/platypi-cli';

        fs.mkdir(appdata, (err) => {
            resolve(appdata);
        });
    });
};
