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
