import fs = require('fs');
import promises = require('es6-promise');

var Promise = promises.Promise;

export var writeFile = (filename: string, data: any): Thenable<string> => {
    return new Promise((resolve, reject) => {
        fs.writeFile(filename, data, (err) => {
            if (err) {
                return reject(err);
            }

            resolve(filename);
        });
    });
};

export var readFile = (filename: string, options?: { encoding?: string; flag?: string; }): Thenable<any> => {
    return new Promise((resolve, reject) => {
        if (options) {
            fs.readFile(filename, options, (err, data) => {
                if (err) {
                    return reject(err);
                }

                return resolve(data);
            });
        } else {
            fs.readFile(filename, (err, data) => {
                if (err) {
                    return reject(err);
                }

                return resolve(data);
            });
        }
    });
};

export var deleteFile = (location: string): Thenable<any> => {
    return new Promise((resolve, reject) => {
        fs.unlink(location, (err) => {
            if (err) {
                return reject(err);
            }

            return resolve();
        });
    });
};

export var stat = (location: string): Thenable<fs.Stats> => {
    return new Promise((resolve, reject) => {
        fs.stat(location, (err, stats) => {
            if (err) {
                return reject(err);
            }

            return resolve(stats);
        });
    });
};

export var readdir = (path: string): Thenable<Array<string>> => {
    return new Promise((resolve, reject) => {
        fs.readdir(path, (err, files) => {
            if (err) {
                return reject(err);
            }

            return resolve(files);
        });
    });
};

export var mkdir = (path: string, mode?: any) => {
    return new Promise((resolve, reject) => {
        if (mode) {
            fs.mkdir(path, mode, (err) => {
                if (err) {
                    return reject(err);
                }

                resolve();
            });
        } else {
            fs.mkdir(path, (err) => {
                if (err) {
                    return reject(err);
                }

                resolve();
            });
        }
    });
};
