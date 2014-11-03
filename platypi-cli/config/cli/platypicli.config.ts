import fs = require('fs');
import path = require('path');
import util = require('util');
import dirutil = require('../../utils/directory.utils');

export class PlatypiCliConfig {
    config: config.IPlatypiCliConfig = null;
    configPath: string = '';

    loadConfig(): Thenable<config.IPlatypiCliConfig> {
        return dirutil.appDataDir().then((appDataDir) => {
            var configPath = path.normalize(util.format('%s/%s/%s', appDataDir, 'cache', 'cli.json'));
            return new Promise((resolve, reject) => {
                fs.readFile(configPath, 'utf8', (err, data) => {
                    if (err) {
                        return reject(err);
                    }

                    this.configPath = configPath;
                    this.config = JSON.parse(data);

                    return resolve(this.config);
                });
            });
        });
    }

    updateConfig(): Thenable<config.IPlatypiCliConfig> {
        return new Promise((resolve, reject) => {
            if (!this.config || this.configPath === '') {
                return reject('No config loaded!');
            }

            fs.writeFile(this.configPath, JSON.stringify(this.config), (err) => {
                if (err) {
                    return reject(err);
                }

                return resolve(this.config);
            });
        });
    }
}

export var config = new PlatypiCliConfig();
