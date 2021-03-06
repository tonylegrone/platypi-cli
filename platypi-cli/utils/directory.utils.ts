﻿import path = require('path');
import promises = require('es6-promise');
import fileutil = require('../utils/file.utils');
import rmdir = require('rimraf');

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
export var upOneLevel = (directory: string = process.cwd()): string => {
    var upOne = path.resolve(directory, '../');

    return upOne;
};

/*
 * Returns the appdata path relative to the host OS
 */
export var appDataDir = (): Thenable<string> => {
    var appdata = process.env.APPDATA || (process.platform === 'darwin'
        ? path.join(process.env.HOME, 'Library/Application\ Support')
        : '/var/local');

    appdata = path.join(appdata, '/platypi-cli');

    return fileutil.mkdir(appdata).then(() => {
        return appdata;
    }, (err) => {
        return appdata;
    });
};

export var deleteDirectoryRecursive = (fullPath: string): Thenable<any> => {
    return new Promise((resolve, reject) => {
        rmdir(fullPath, (err) => {
            if (err) {
                return reject(err);
            }

            return resolve();
        });
    });
};
