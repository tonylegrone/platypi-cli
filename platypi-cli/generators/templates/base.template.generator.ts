import TemplateHelper = require('../../helpers/template.helper');
import GithubService = require('../../services/github/github.service');
import CliConfig = require('../../config/cli/platypicli.config');
import path = require('path');
import fs = require('fs');
import util = require('util');
import promises = require('es6-promise');

var Promise = promises.Promise;

class BaseTemplateGenerator {
    helper: TemplateHelper<any> = null;
    config: CliConfig.PlatypiCliConfig = null;
    location = null;
    _CONTROLNAME = '';
    instanceName = '';

    constructor(private environmentVariables: Array<config.IEnvironmentVariable>) {
        this.helper = new TemplateHelper(GithubService);
        this.config = CliConfig.config;
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
            this.instanceName = this._CONTROLNAME;
            this.environmentVariables.push({
                name: 'name',
                value: this._CONTROLNAME
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

    _resolveTemplateLocation(): string {
        if (!this.location) {
            // update templates
        }

        return path.normalize(path.resolve(this.location));
    }

    _getControlName(): string {
        return this._CONTROLNAME;
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
        if (!this.location) {
            return Promise.reject('No location!');
        }
        return new Promise((resolve, reject) => {
            var templateLocation = this._resolveTemplateLocation();
            fs.readdir(templateLocation, (err, files) => {
                if (err) {
                    return reject(err);
                }

                var newFolder = path.join(destination, this.instanceName);

                if (files && files.length > 0) {
                    fs.mkdir(newFolder, (err) => {
                        var templatePromises = [];

                        files.forEach((file) => {
                            var fullPath = path.join(templateLocation, file);
                            fs.stat(fullPath, (err, stat) => {
                                if (stat.isDirectory()) {
                                    templatePromises.push(this.__createTemplateFolder(file, fullPath, newFolder));
                                } else {
                                    templatePromises.push(this.__createTemplateFile(file, fullPath, newFolder));
                                }

                                Promise.all(templatePromises).then((newfiles) => {
                                    resolve(newfiles);
                                }, (err) => {
                                    reject(err);
                                });
                            });
                        });
                    });
                } else {
                    return reject('No template files found.');
                }
            });
        });
    }

    private __createTemplateFolder(folder: string, folderFullPath: string, destination: string): Thenable<string> {
        return new Promise((resolve, reject) => {
            fs.readdir(folderFullPath, (err, files) => {
                var newFolder = path.join(destination, folder);

                fs.mkdir(newFolder, (err) => {
                    files.forEach((file) => {
                        var fullPath = path.join(folderFullPath, file);
                        fs.stat(fullPath, (err, stat) => {
                            if (stat.isDirectory()) {
                                return resolve(this.__createTemplateFolder(file, fullPath, newFolder));
                            } else {
                                return resolve(this.__createTemplateFile(file, fullPath, newFolder));
                            }
                        });
                    });
                });
            });
        });
    }

    private __createTemplateFile(file: string, templateFullPath: string, destination: string): Thenable<string> {
        return new Promise((resolve, reject) => {
            fs.readFile(templateFullPath, 'utf8', (err, data) => {
                if (err) {
                    return reject(err);
                }

                data = this.__fillEnvironmentVariables(data);

                var newFilename = this._handleFileName(file)
                    , newfullPath = path.join(destination, newFilename);

                fs.writeFile(newfullPath, data, (err) => {
                    if (err) {
                        return reject(err);
                    }
                    return resolve(newfullPath);
                });
            });
        });
    }

    private __fillEnvironmentVariables(data: string): string {
        this.environmentVariables.forEach((variable) => {
            var regex = new RegExp('%' + variable.name + '%', 'g');
            data = data.replace(regex, variable.value);
        });

        return data;
    }

}

export = BaseTemplateGenerator;
