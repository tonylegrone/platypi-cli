import fs = require('fs');
import path = require('path');
import util = require('util');
import dirutil = require('../../utils/directory.utils');

export class PlatypiCliConfig {
    config: config.IPlatypiCliConfig = null;
    configPath: string = '';

    loadConfig(): Thenable<any> {
        return dirutil.appDataDir().then((appDataDir) => {
            var configPath = path.normalize(util.format('%s/%s', appDataDir, 'cli.json'));
            fs.readFile(configPath, 'utf8', (err, data) => {
                if (err) {
                    throw err;
                }

                this.configPath = configPath;
                this.config = JSON.parse(data);

                return this.config;
            });
        });
    }

    updateConfig(): Thenable<any> {
        return dirutil.appDataDir().then((appDataDir) => {
            var configPath = path.normalize(util.format('%s/%s', appDataDir, 'cli.json'));
            if (!this.config) {
                throw 'No config loaded!';
            }
            fs.writeFile(configPath, JSON.stringify(this.config), (err) => {
                if (err) {
                    throw err;
                }
                this.configPath = configPath;
                return this.config;
            });
        });
    }
}

export var config = new PlatypiCliConfig();
