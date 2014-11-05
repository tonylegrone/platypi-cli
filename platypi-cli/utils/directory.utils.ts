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
export var upOneLevel = (directory: string = process.cwd()): string => {
    var upOne = path.resolve(directory, '../');

    return upOne;
};

/*
 * Returns the appdata path relative to the host OS
 */
export var appDataDir = (): Thenable<string> => {
    return new Promise((resolve, reject) => {
        var appdata = process.env.APPDATA || (process.platform === 'darwin' ? process.env.HOME + 'Library/Preference' : '/var/local');

        appdata = appdata + '/platypi-cli';

        fs.mkdir(appdata, (err) => {
            resolve(appdata);
        });
    });
};

export var deleteDirectoryRecursive = (fullPath: string) => {
    var deletePromises = [];
    return new Promise((resolve, reject) => {
        fs.stat(fullPath, (err, stats) => {
            if (err) {
                reject(err);
            }
            if (stats.isDirectory()) {
                fs.readdir(fullPath, (err, files) => {
                    if (err) {
                        return reject(err);
                    }
                    files.forEach((file) => {
                        var filePath = path.join(fullPath, file)
                            , fileStats = fs.statSync(filePath);

                        if (fileStats.isDirectory()) {
                            console.log('pushed dir' + filePath);
                            deletePromises.push(deleteDirectoryRecursive(filePath));
                        } else {
                            deletePromises.push(deleteWithPromise(filePath));
                        }
                    });

                    Promise.all(deletePromises).then(() => {
                        console.log('resolved: ' + fullPath);
                        fs.rmdir(fullPath, (err) => {
                            if (err) {
                                reject(err);
                            }
                            resolve();
                        });
                    }, (err) => {
                        reject(err);
                    });

                });
            } else {
                fs.unlink(fullPath, (err) => {
                    if (err) {
                        return reject(err);
                    }
                    return resolve();
                });
            }
        });
    });
};

export var deleteWithPromise = (filePath: string) => {
    return new Promise((resolve, reject) => {
        fs.unlink(filePath, (err) => {
            if (err) {
                return reject(err);
            }

            resolve();
        });
    });
};
