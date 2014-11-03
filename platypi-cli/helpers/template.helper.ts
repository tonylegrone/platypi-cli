/// <reference path="../_references.d.ts" />

import fs = require('fs');
import util = require('util');
import path = require('path');
import promises = require('es6-promise');
import GithubService = require('../services/github/github.service');

var package = require('../../package.json')
    , Promise = promises.Promise;

export class TemplateHelper {

    private __makeCacheDir(appDataFolderPath: string): Thenable<string> {
        return new Promise((resolve, reject) => {
            var cacheFolder = path.normalize(util.format('%s/%s', appDataFolderPath, 'cache'));

            fs.mkdir(cacheFolder, (err) => {
                if (err) {
                    if (err.code === 'EEXIST') {
                        // path already exists
                        return resolve(cacheFolder);
                    } else {
                        return reject(err);
                    }
                }

                return resolve(cacheFolder);
            });
        });
    }

    private __makeArchiveCacheDir(cacheFolderPath: string): Thenable<string> {
        return new Promise((resolve, reject) => {
            var archiveFolder = path.normalize(util.format('%s/%s/', cacheFolderPath, 'archives'));
            fs.mkdir(archiveFolder, (err) => {
                if (err) {
                    if (err.code === 'EEXIST') {
                        // path already exists
                        return resolve(archiveFolder);
                    } else {
                        return reject(err);
                    }
                }

                return resolve(archiveFolder);
            });
        });
    }

    __downloadTemplates(appDataDir: string): Thenable<string> {
        return this.__makeCacheDir(appDataDir)
            .then(this.__makeArchiveCacheDir)
            .then((archivePath) => {
                var version = package.version || '0.0.1'
                    , filePath = path.normalize(util.format('%s/%s.%s', archivePath, version, 'zip'))
                    , service = new GithubService();

                return service.getRelease(version, filePath);
            });
    }
}

export var helper = new TemplateHelper();
