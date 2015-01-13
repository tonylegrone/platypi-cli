/// <reference path="../../_references.d.ts" />
import TemplateProvider = require('../../providers/githubtemplate.provider');
import CliConfig = require('../../config/cli/platypicli.config');
import path = require('path');
import util = require('util');
import promises = require('es6-promise');
import dirutils = require('../../utils/directory.utils');
import fileUtils = require('../../utils/file.utils');
import globals = require('../../globals');
import ReferenceHandler = require('../../handlers/references.handler');
import MainFileHandler = require('../../handlers/mainfile.handler');
import ExtendsHandler = require('../../handlers/extends.handler');

var Promise = promises.Promise;

/**
 *  Contains the base class for project template generators.
 */
class BaseTemplateGenerator implements generators.ITemplateGenerator {
    _provider: providers.ITemplateProvider = null;
    _config: CliConfig.PlatypiCliConfig = null;
    _projectConfig: config.IPlatypi = null;
    _extends: string;
    _imports: Array<string>;
    location = null;
    instanceName = '';
    registeredName = '';
    fileUtils = fileUtils;
    dirUtils = dirutils;

    constructor(private __controlName
        , private __projectType
        , private environmentVariables: Array<config.IEnvironmentVariable>) {
        this._provider = new TemplateProvider();
        this._config = CliConfig.config;
        this.__handleEnvironmentVariables();
    }

    /**
     * Generate import and extends statements when a control extends another control
     * @param paramExtends The name of the control being extended.
     */
    private __handleExtends(paramExtends: string) {
        var extender = ExtendsHandler.extendClass(paramExtends, this.__controlName, this._projectConfig);
        if (extender) {
            this._extends = extender.extendsStatement;
            this._imports.push(extender.importStatement);
        } else {
            throw 'Extended class not found in project.';
        }
    }

    /**
     * Parse environment variables for control values.
     */
    private __handleEnvironmentVariables() {
        var name = ''
            , registerName = null;

        this.environmentVariables.map((env) => {
            if (env.name === 'name') {
                name = env.value;
            } else if (env.name === 'registername') {
                registerName = env.value;
                this.registeredName = env.value;
            } else if (env.name === 'extendsClass') {
                this.__handleExtends(env.value);
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
            this.registeredName = this.instanceName;
        }
    }

    /**
     *  Make a directory for the template.
     *  @param folder The name of the folder to be added.
     *  @param folderFullPath Absolute path for the template folder to be created.
     *  @param destination Path where the folder will be created. 
     */
    private __createTemplateFolder(folder: string, folderFullPath: string, destination: string): Thenable<string> {
        return fileUtils.readdir(folderFullPath).then((files) => {
            var newFolder = path.join(destination, folder);
            return fileUtils.mkdir(newFolder).then(() => {
                return Promise.all(<Array<Promise<string>>>files.map((file) => {
                    var fullPath = path.join(folderFullPath, file);

                    return fileUtils.stat(fullPath).then((stat) => {
                        if (stat.isDirectory()) {
                            return this.__createTemplateFolder(file, fullPath, newFolder);
                        } else {
                            return this.__createTemplateFile(file, fullPath, newFolder);
                        }
                    });
                })).then(() => {
                    return newFolder;
                });
            }, (err) => {
                throw err;
            });
        });
    }

    /**
     *  Copy the template file filling in environment variables.
     *  @param file Filename to be processed.
     *  @param templateFullPath The path to the template file.
     *  @param destination The path to the destination for the processed template.
     */
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

    /**
     *  Replace placeholders with environment values.
     *  @param data Text containing placeholders to fill with environment values.
     */
    private __fillEnvironmentVariables(data: string): string {
        this.environmentVariables.forEach((variable) => {
            var regex = new RegExp('%' + variable.name + '%', 'g');

            if (variable.name === 'import') {
                if (this._imports && this._imports.length > 0) {
                    var importStrings = this._imports.reduce((prev, curr) => {
                        return prev + '\r\n' + curr;
                    }, '');
                    data = data.replace(regex, importStrings);
                } else {
                    data = data.replace(regex, '');
                }
            } else if (variable.name === 'extendsClass') {
                data = data.replace(regex, (this._extends && this._extends !== '' ? this._extends : ''));
            } else {
                data = data.replace(regex, variable.value);
            }
        });

        data = data.replace(/%.*?%/g, '');

        return data;
    }

    /**
     *  Return the path to the cached template files.
     */
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

    /**
     *  Replace the placeholder template filename.
     *  @param baseName Placeholder named to be processed.
     */
    _handleFileName(baseName: string): string {
        var output = ''
            , fileType = (baseName.indexOf('.d.ts') > -1 ? 'd.ts' : baseName.slice(baseName.lastIndexOf('.') + 1));

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

    /**
     *  Process and copy the desired template to the destination path.
     *  @param destination The path to the desired template location.
     */
    _copyTemplateTo(destination: string): Thenable<any> {
        return this._resolveTemplateLocation().then((templateLocation) => {
            return fileUtils.readdir(templateLocation).then((files) => {
                var newFolder = path.join(destination, this.instanceName);

                if (files && files.length > 0) {
                    return fileUtils.mkdir(newFolder).then(() => {
                        return Promise.all(<Array<Promise<string>>>files.map((file) => {
                            var fullPath = path.join(templateLocation, file);
                            return fileUtils.stat(fullPath).then((stat) => {
                                if (stat.isDirectory()) {
                                    return this.__createTemplateFolder(file, fullPath, newFolder);
                                } else {
                                    return this.__createTemplateFile(file, fullPath, newFolder);
                                }
                            });
                        }));
                    }).then(() => {
                        return newFolder;
                    });
                } else {
                    throw 'No template files found.';
                }
            });
        });
    }

    /**
     *  Adds a control to the project config then saves it.
     *  @param config The project config to add the control to.
     *  @param controlPath The path to the newly created control.
     */
    _addToProjectConfig(config: config.IPlatypi, controlPath: string): Thenable<any> {
        var newControl: config.IPlatypusControl = {
            name: this.instanceName,
            type: this.__controlName,
            path: controlPath,
            registeredName: this.registeredName
        };
        config.addControl(newControl);
        return config.save();
    }

    /**
     *  Add an interface reference to the project's references file.
     *  @param config The project config for the project the reference will be added to.
     *  @param templatePath Absolute path to the template to be referenced.
     */
    _addReferences(config: config.IPlatypi, templatePath: string): Thenable<any> {
        var referencesPath = path.join(config.public, '_references.d.ts');

        return ReferenceHandler.addReference(referencesPath, templatePath, this.__controlName);
    }

    /**
     *  Add a 'require' statement to the project's main file for a provided control template.
     *  @param config The project config for the project to add the control to.
     *  @param templatePath Absolute path to the template to be required.
     */
    _addRequireToMain(config: config.IPlatypi, templatePath: string): Thenable<any> {
        return MainFileHandler.addControl(templatePath, config, this.__controlName);
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

            if (lastUpdate < maxAge || globals.package.version !== cliConfig.version) {
                return this._provider.update().then((templateLocation) => {
                    return this._config.getConfig().then((newConfig) => {
                        return newConfig;
                    });
                });
            } else {
                return Promise.resolve(cliConfig);
            }
        }, (err) => {
            return this._provider.update().then((templateLocation) => {
                return this._config.getConfig().then((cliConfig) => {
                    return cliConfig;
                });
            });
        });
    }

    /**
     *  Generate the template and reference it in the project config.
     *  @param projectConfig The project config to add the control to.
     */
    generate(projectConfig: config.IPlatypi): Thenable<string> {
        this._projectConfig = projectConfig;
        return this._config.getConfig().then((cliConfig) => {
            globals.console.log('Creating ' + this.__controlName + '..');
            var controlPath = path.join(projectConfig.public, cliConfig.templates.controlLocation[this.__controlName]);
            return this._copyTemplateTo(controlPath).then((newPath) => {
                return this._addReferences(projectConfig, newPath).then(() => {
                    return this._addRequireToMain(projectConfig, newPath);
                }).then(() => {
                    return this._addToProjectConfig(projectConfig, newPath);
                }).then(() => {
                    return newPath;
                });
            });
        });
    }
}

export = BaseTemplateGenerator;
