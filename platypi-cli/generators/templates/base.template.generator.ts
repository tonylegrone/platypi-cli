import TemplateHelper = require('../../helpers/template.helper');
import GithubService = require('../../services/github/github.service');
import CliConfig = require('../../config/cli/platypicli.config');
import path = require('path');
import util = require('util');
import promises = require('es6-promise');
import dirutils = require('../../utils/directory.utils');
import fileUtils = require('../../utils/file.utils');

var Promise = promises.Promise;

class BaseTemplateGenerator {
    _helper: TemplateHelper<any> = null;
    _config: CliConfig.PlatypiCliConfig = null;
    location = null;
    instanceName = '';

    constructor(private __controlName
        , private __projectType
        , private environmentVariables: Array<config.IEnvironmentVariable>) {
        this._helper = new TemplateHelper(GithubService);
        this._config = CliConfig.config;
        this.__handleEnvironmentVariables();
    }

    private __handleEnvironmentVariables() {
        var name = ''
            , registerName = null;

        this.environmentVariables.forEach((variable) => {
            if (variable.name === 'name') {
                name = variable.value;
            } else if (variable.name === 'registername') {
                registerName = variable.value;
            }
        });

        if (name === '') {
            this.instanceName = this.__controlName;
            this.environmentVariables.push({
                name: 'name',
                value: this.__controlName
            });
        } else {
            this.instanceName = name;
        }

        if (!registerName) {
            this.environmentVariables.push({
                name: 'registername',
                value: this.instanceName
            });
        }
    }

    private __createTemplateFolder(folder: string, folderFullPath: string, destination: string): Thenable<string> {
        var createPromises = [];
        return new Promise((resolve, reject) => {
            return fileUtils.readdir(folderFullPath).then((files) => {
                var newFolder = path.join(destination, folder);

                return fileUtils.mkdir(newFolder).then(() => {
                    files.forEach((file) => {
                        var fullPath = path.join(folderFullPath, file);
                        fileUtils.stat(fullPath).then((stat) => {
                            if (stat.isDirectory()) {
                                createPromises.push(this.__createTemplateFolder(file, fullPath, newFolder));
                            } else {
                                createPromises.push(this.__createTemplateFile(file, fullPath, newFolder));
                            }
                        });
                    });
                    Promise.all(createPromises).then(() => {
                        resolve(newFolder);
                    }, (err) => {
                        reject(err);
                    });
                });
            });
        });
    }

    private __createTemplateFile(file: string, templateFullPath: string, destination: string): Thenable<string> {
        return fileUtils.readFile(templateFullPath, { encoding: 'utf8' }).then((data) => {
            data = this.__fillEnvironmentVariables(data);

            var newFilename = this._handleFileName(file)
                , newfullPath = path.join(destination, newFilename);

            return fileUtils.writeFile(newfullPath, data).then(() => {
                return newfullPath;
            });
        });
    }

    private __fillEnvironmentVariables(data: string): string {
        this.environmentVariables.forEach((variable) => {
            var regex = new RegExp('%' + variable.name + '%', 'g');
            data = data.replace(regex, variable.value);
        });

        data = data.replace(/%.*?%/g, '');

        return data;
    }

    _resolveTemplateLocation(): Thenable<string> {
        if (!this.location) {
            return this.updateTemplates().then((config) => {
                if (this.__controlName === 'project') {
                    this.location = path.join(config.templates.baseLocation, config.templates.projects[this.__projectType]);
                    return this.location;
                }

                this.location = path.join(config.templates.baseLocation, config.templates.controls[this.__projectType][this.__controlName]);
                return this.location;
            });
        } else {
            return Promise.resolve(this.location);
        }
    }

    _getControlName(): string {
        return this.__controlName;
    }

    _getInstanceName(): string {
        return this.instanceName;
    }

    _handleFileName(baseName: string): string {
        var output = ''
            , fileType = baseName.slice(baseName.lastIndexOf('.') + 1);

        var typeMatches = baseName.match(/\.(.*?)\./)
            , type = null
            , prefix = baseName.slice(0, baseName.indexOf('.'));

        if (typeMatches && typeMatches.length > 0) {
            type = typeMatches[1];
        }

        if (prefix.indexOf(type) < 0 || !type || type === '') {
            return baseName;
        }

        // preserve interface identifier
        if (baseName[0] === 'i') {
            output = 'i';
            baseName = baseName.slice(1);
        }

        output += this.instanceName;

        return util.format('%s.%s.%s', output, type, fileType);
    }

    _copyTemplateTo(destination: string): Thenable<any> {
        return this._resolveTemplateLocation().then((templateLocation) => {
            return fileUtils.readdir(templateLocation).then((files) => {
                var newFolder = path.join(destination, this.instanceName);

                if (files && files.length > 0) {
                    return fileUtils.mkdir(newFolder).then(() => {
                        var templatePromises = [];

                        files.forEach((file) => {
                            var fullPath = path.join(templateLocation, file);
                            return fileUtils.stat(fullPath).then((stat) => {
                                if (stat.isDirectory()) {
                                    templatePromises.push(this.__createTemplateFolder(file, fullPath, newFolder));
                                } else {
                                    templatePromises.push(this.__createTemplateFile(file, fullPath, newFolder));
                                }
                            });
                        });
                        return Promise.all(templatePromises).then((newfiles) => {
                            return newFolder;
                        }, (err) => {
                            throw err;
                        });
                    });
                } else {
                    throw 'No template files found.';
                }
            });
        });
    }

    /*
     * Updates templates if the cache age is maxed.
     * returns config
     */
    updateTemplates(): Thenable<config.IPlatypiCliConfig> {
        return this._config.getConfig().then((cliConfig) => {
            var lastUpdate = cliConfig.templates.lastUpdated,
                maxAge = new Date();

            maxAge.setHours(maxAge.getHours() - 12);

            if (lastUpdate < maxAge) {
                return dirutils.appDataDir().then((appDataDir) => {
                    return dirutils.appDataDir()
                        .then((appDataDir) => {
                            return this._helper.updateTemplates(appDataDir);
                        })
                        .then((templateLocation) => {
                            return cliConfig;
                        });
                });
            } else {
                return Promise.resolve(cliConfig);
            }
        });
    }
}

export = BaseTemplateGenerator;
