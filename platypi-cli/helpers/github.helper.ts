/// <reference path="../_references.d.ts" />

import fs = require('fs');
import http = require('https');
import util = require('util');
import promises = require('es6-promise');

var package = require('../../package.json')
    , baseUrl = 'https://github.com/Platypi/platypi-cli-templates/archive/'
    , Promise = promises.Promise;

export class GithubHelper {
    private __getUrl() {
        return util.format('%s%s%s', baseUrl, package.version, '.zip');
    }

    downloadRepo(path: string): Thenable<string> {
        return new Promise((resolve, reject) => {
            fs.mkdir(path + '/cache/archives', (err) => {
                var filepath = util.format('%s%s%s', path + '/cache/archives/', package.version, '.zip');
                http.get(this.__getUrl(), (res: any) => {
                    var data = '';
                    res.setEncoding('binary');

                    res.on('data', (chunk) => {
                        data += chunk;
                    });

                    res.on('error', (err) => {
                        throw err;
                    });

                    res.on('end', () => {
                        fs.writeFile(filepath, data, 'binary', (err) => {
                            if (err) {
                                throw err;
                            }
                            resolve(filepath);
                        });
                    });
                });
            });
        });
    }
}

export var helper = new GithubHelper();
