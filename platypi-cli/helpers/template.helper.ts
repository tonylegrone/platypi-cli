/// <reference path="../_references.d.ts" />

import fs = require('fs');
import util = require('util');
import path = require('path');
import promises = require('es6-promise');

var package = require('../../package.json')
    , admzip = require('adm-zip')
    , Promise = promises.Promise;

class TemplateHelper<T extends IBaseService> {
    service: T;
    cacheDir = null;

    constructor(Service: new () => T) {
        this.service = new Service();
    }

    private __makeCacheDir(appDataFolderPath: string): Thenable<string> {
        return new Promise((resolve, reject) => {
            var cacheFolder = path.normalize(util.format('%s/%s', appDataFolderPath, 'cache'));

            fs.mkdir(cacheFolder, (err) => {
                if (err) {
                    if (err.code === 'EEXIST') {
                        // path already exists
                        this.cacheDir = cacheFolder;
                        return resolve(cacheFolder);
                    } else {
                        return reject(err);
                    }
                }

                this.cacheDir = cacheFolder;
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

    private __downloadTemplates(appDataDir: string): Thenable<string> {
        return this.__makeCacheDir(appDataDir)
            .then(this.__makeArchiveCacheDir)
            .then((archivePath) => {
                var version = package.version || '0.0.1'
                    , filePath = path.normalize(util.format('%s/%s.%s', archivePath, version, 'zip'));

                return this.service.getRelease(version, filePath);
            });
    }

    updateTemplates(appDataDir: string): Thenable<string> {
        return this.__downloadTemplates(appDataDir)
            .then((zipLocation) => {
                var extractDir = path.normalize(util.format('%s/%s', this.cacheDir, package.version));
                var zip = admzip(zipLocation);

                zip.extractAllTo(extractDir, true);

                extractDir = path.normalize(util.format('%s/%s-%s', extractDir, 'platypi-cli-templates', package.version));

                return extractDir;
            });
    }
}

export = TemplateHelper;
