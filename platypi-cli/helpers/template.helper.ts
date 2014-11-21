/// <reference path="../_references.d.ts" />

import util = require('util');
import path = require('path');
import PlatypiCliConfig = require('../config/cli/platypicli.config');
import fileutils = require('../utils/file.utils');

var package = require('../../package.json')
    , admzip = require('adm-zip')
    , cliConfig = PlatypiCliConfig.config;

class TemplateHelper<T extends IBaseService> {
    service: T;
    cacheDir = null;

    constructor(Service: new () => T) {
        this.service = new Service();
    }

    private __makeCacheDir(appDataFolderPath: string): Thenable<string> {
        var cacheFolder = path.normalize(util.format('%s/%s', appDataFolderPath, 'cache'));

        return fileutils.mkdir(cacheFolder).then(() => {
            this.cacheDir = cacheFolder;
            return cacheFolder;
        }, (err) => {
            if (err.code === 'EEXIST') {
                // path already exists
                this.cacheDir = cacheFolder;
                return cacheFolder;
            } else {
                return err;
            }
        });
    }

    private __makeArchiveCacheDir(cacheFolderPath: string): Thenable<string> {
        var archiveFolder = path.normalize(util.format('%s/%s/', cacheFolderPath, 'archives'));
        return fileutils.mkdir(archiveFolder).then(() => {
            return archiveFolder;
        }, (err) => {
            if (err.code === 'EEXIST') {
                // path already exists
                return archiveFolder;
            } else {
                return err;
            }
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

                try {
                    zip.extractAllTo(extractDir, true);
                } catch (e) {
                    throw e;
                }
                extractDir = path.normalize(util.format('%s/%s-%s', extractDir, 'platypi-cli-templates', package.version));

                return this.__updateConfig(extractDir).then(() => {
                    return extractDir;
                });
            });
    }

    private __updateConfig(extractDir: string): Thenable<any> {
        var configPath = path.normalize(util.format('%s/%s', extractDir, 'cli.json'));

        return fileutils.readFile(configPath).then((configData) => {
            var templateConfig = JSON.parse(configData);

            templateConfig.templates.lastUpdated = new Date();
            templateConfig.templates.baseLocation = extractDir;

            return cliConfig.setConfig(templateConfig);

        });
    }
}

export = TemplateHelper;
