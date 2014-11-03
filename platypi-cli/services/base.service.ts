/// <reference path="../_references.d.ts" />

import request = require('request');
import promises = require('es6-promise');
import fs = require('fs');

var Promise = promises.Promise;

class BaseService implements IBaseService {
    _get(host: string, path: string, authtoken?: string): Thenable<any> {
        return new Promise((resolve, reject) => {
            var userAgent = 'node.js'
                , httpOptions: request.Options = {
                    host: host
                    , url: path
                    , headers: {
                        'user-agent': userAgent
                    }
                };

            if (authtoken) {
                (<any>httpOptions.headers).Authorization = 'token ' + authtoken;
            }

            request.get(httpOptions, (err, res, body) => {
                if (err) {
                    reject(err);
                }

                resolve(body);
            });
        });
    }

    _downloadFile(url: string, savePath: string, authtoken?: string): Thenable<any> {
        return new Promise((resolve, reject) => {
            var userAgent = 'node.js'
                , httpOptions: request.Options = {
                    headers: {
                        'user-agent': userAgent
                    }
                };

            if (authtoken) {
                (<any>httpOptions.headers).Authorization = 'token ' + authtoken;
            }

            request(url, httpOptions).pipe(fs.createWriteStream(savePath))
                .on('close', () => {
                    return resolve(savePath);
                })
                .on('error', (err) => {
                    return reject(err);
                });

        });
    }

    getRelease(version: string, savePath: string): Thenable<string> {
        var location = '/';

        return this._downloadFile(location, savePath);
    }

}

export = BaseService;
