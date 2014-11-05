import fs = require('fs');
import path = require('path');
import util = require('util');
import dirutil = require('../../utils/directory.utils');
import promises = require('es6-promise');

var Promise = promises.Promise;

export class PlatypiCliConfig {
    private __config: config.IPlatypiCliConfig = null;
    configPath: string = '';

    setConfig(newConfig: config.IPlatypiCliConfig): Thenable<config.IPlatypiCliConfig> {
        if (JSON.stringify(newConfig) === JSON.stringify(this.__config)) {
            return Promise.resolve(this.__config);
        } else {
            this.__config = newConfig;
            return this.__updateConfig();
        }
    }

    getConfig(): Thenable<config.IPlatypiCliConfig> {
        if (this.__config) {
            return Promise.resolve(this.__config);
        } else {
            return this.__loadConfig();
        }
    }

    private __loadConfig(): Thenable<config.IPlatypiCliConfig> {
        return new Promise((resolve, reject) => {
            dirutil.appDataDir().then((appDataDir) => {
                var configPath = path.normalize(util.format('%s/%s', appDataDir, 'cli.json'));
                fs.readFile(configPath, 'utf8', (err, data) => {
                    if (err) {
                        return reject(err);
                    }

                    this.configPath = configPath;
                    this.__config = JSON.parse(data);

                    resolve(this.__config);
                });
            });
        });
    }

    private __updateConfig(): Thenable<config.IPlatypiCliConfig> {
        return new Promise((resolve, reject) => {
            dirutil.appDataDir().then((appDataDir) => {
                var configPath = path.normalize(util.format('%s/%s', appDataDir, 'cli.json'));

                if (!this.__config) {
                    return reject('No config loaded!');
                }
                fs.writeFile(configPath, JSON.stringify(this.__config), (err) => {
                    if (err) {
                        return reject(err);
                    }
                    this.configPath = configPath;

                    resolve(this.__config);
                });
            });
        });
    }
}

export var config = new PlatypiCliConfig();
