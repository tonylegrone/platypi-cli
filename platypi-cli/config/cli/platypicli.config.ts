/// <reference path="../../_references.d.ts" />

import path = require('path');
import util = require('util');
import dirutil = require('../../utils/directory.utils');
import fileutil = require('../../utils/file.utils');
import promises = require('es6-promise');

var Promise = promises.Promise;

/**
 * Contains methods and variables for dealing with the CLI Config file.
 */
export class PlatypiCliConfig {
    private __config: config.IPlatypiCliConfig = null;
    configPath: string = '';

    /**
     * Set the current config.
     * @param newConfig CLI Config file to set.
     */
    setConfig(newConfig: config.IPlatypiCliConfig): Thenable<config.IPlatypiCliConfig> {
        if (JSON.stringify(newConfig) === JSON.stringify(this.__config)) {
            return Promise.resolve(this.__config);
        } else {
            this.__config = newConfig;
            return this.__updateConfig();
        }
    }

    /**
     *  Return loaded config or load config from disk.
     */
    getConfig(): Thenable<config.IPlatypiCliConfig> {
        if (this.__config) {
            return Promise.resolve(this.__config);
        } else {
            return this.__loadConfig();
        }
    }

    /**
     *  Load CLI config from disk.
     */
    private __loadConfig(): Thenable<config.IPlatypiCliConfig> {
        var configPath: string;

        return dirutil.appDataDir().then((appDataDir) => {
            configPath = path.normalize(util.format('%s/%s', appDataDir, 'cli.json'));
            return fileutil.readFile(configPath, { encoding: 'utf8' });
        })
            .then((data) => {
                this.configPath = configPath;
                this.__config = JSON.parse(data);

                return this.__config;
            });
    }

    /**
     *  Update the config file stored in the AppData directory.
     */
    private __updateConfig(): Thenable<config.IPlatypiCliConfig> {
        return dirutil.appDataDir().then((appDataDir) => {
            var configPath = path.normalize(util.format('%s/%s', appDataDir, 'cli.json'));

            if (!this.__config) {
                throw 'No config loaded!';
            }

            return fileutil.writeFile(configPath, JSON.stringify(this.__config)).then(() => {
                return this.__config;
            });
        });
    }
}

export var config = new PlatypiCliConfig();
