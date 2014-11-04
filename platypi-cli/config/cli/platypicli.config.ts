import fs = require('fs');
import path = require('path');
import util = require('util');
import dirutil = require('../../utils/directory.utils');
import promises = require('es6-promise');

var Promise = promises.Promise;

export class PlatypiCliConfig {
    config: config.IPlatypiCliConfig = null;
    configPath: string = '';

    setConfig(newConfig: config.IPlatypiCliConfig): Thenable<config.IPlatypiCliConfig> {
        if (JSON.stringify(newConfig) === JSON.stringify(this.config)) {
            return Promise.resolve(this.config);
        } else {
            this.config = newConfig;
            return this.__updateConfig();
        }
    }

    getConfig(): Thenable<config.IPlatypiCliConfig> {
        if (config) {
            return Promise.resolve(this.config);
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
                    this.config = JSON.parse(data);

                    resolve(this.config);
                });
            });
        });
    }

    private __updateConfig(): Thenable<config.IPlatypiCliConfig> {
        return new Promise((resolve, reject) => {
            dirutil.appDataDir().then((appDataDir) => {
                var configPath = path.normalize(util.format('%s/%s', appDataDir, 'cli.json'));
                if (!this.config) {
                    return reject('No config loaded!');
                }
                fs.writeFile(configPath, JSON.stringify(this.config), (err) => {
                    if (err) {
                        throw err;
                    }
                    this.configPath = configPath;

                    resolve(this.config);
                });
            });
        });
    }
}

export var config = new PlatypiCliConfig();
