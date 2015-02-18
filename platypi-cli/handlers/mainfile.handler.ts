/// <reference path="../_references.d.ts" />

import util = require('util');
import path = require('path');
import pathsUtil = require('../utils/paths.util');
import fileutils = require('../utils/file.utils');
import promises = require('es6-promise');

var Promise = promises.Promise;

/**
 *  Contains methods for handling a project's main.ts file.
 */
class MainFileHandler {
    /**
     *  Add a 'require' reference for a control to the current project's main.ts file.
     *  @param controlFolderPath The absolute path to the folder containing the control.
     *  @param projectCOnfig The absolute path to the project's config file.
     */
    static addControl(controlFolderPath: string, projectConfig: config.IPlatypi, controlType?: string): Thenable<string> {
        var relativePathToControl = path.relative(projectConfig.mainFile, controlFolderPath);

        return this.findTypeScriptFiles(controlFolderPath).then((tsFiles) => {
            if (tsFiles.length > 0) {
                return Promise.all(<Array<Promise<string>>>tsFiles.map((file) => {
                    return fileutils.readFile(projectConfig.mainFile, { encoding: 'utf8' }).then((mainData: string) => {
                        var typePos = -1,
                            relativePathToControlFile = path.join(relativePathToControl, file);

                        // remove ../ fomr beginning of path for require statement
                        relativePathToControlFile = relativePathToControlFile.slice(3);

                        // remove .ts from the end of path for require statement (node will find it)
                        relativePathToControlFile = relativePathToControlFile.slice(0, relativePathToControlFile.indexOf('.ts'));

                        // append './' to the beginning of the path (could be combined with the first step but let's be safe)
                        relativePathToControlFile = './' + relativePathToControlFile;

                        if (controlType) {
                            var controlTypeComment = '// ' + controlType.toLowerCase() + 's';

                            typePos = mainData.indexOf(controlTypeComment);
                            typePos = (typePos > -1 ?  typePos + controlTypeComment.length : -1);
                        }

                        return fileutils.appendFileAt(projectConfig.mainFile, typePos, '\n'
                            + pathsUtil.newRequireString(relativePathToControlFile));
                    });
                })).then(() => {
                    return '';
                });
            } else {
                return Promise.resolve('');
            }
        });
    }

    /**
     *  Remove a 'require' reference for a control to the current project's main.ts file.
     *  @param controlFolderPath The absolute path to the folder containing the control.
     *  @param projectCOnfig The absolute path to the project's config file.
     */
    static removeControl(controlFolderPath: string, projectConfig: config.IPlatypi): Thenable<any> {
        var relativePathToControl = path.relative(projectConfig.mainFile, controlFolderPath);

        return this.findTypeScriptFiles(controlFolderPath).then((tsFiles) => {
            if (tsFiles.length > 0) {
                return Promise.all(<Array<Promise<string>>>tsFiles.map((file) => {
                    return fileutils.readFile(projectConfig.mainFile, { encoding: 'utf8' }).then((mainData: string) => {
                        var relativePathToControlFile = path.join(relativePathToControl, file);

                        // remove ../ fomr beginning of path for require statement
                        relativePathToControlFile = relativePathToControlFile.slice(3);

                        // remove .ts from the end of path for require statement (node will find it)
                        relativePathToControlFile = relativePathToControlFile.slice(0, relativePathToControlFile.indexOf('.ts'));

                        // append './' to the beginning of the path (could be combined with the first step but let's be safe)
                        relativePathToControlFile = './' + relativePathToControlFile;

                        // the require statement to look for
                        var requireStatement = pathsUtil.newRequireString(relativePathToControlFile);

                        // the new MainFile data to write to disk
                        var newMainFile: string = mainData.slice(0, mainData.indexOf(requireStatement));

                        // concat the two halves
                        newMainFile = util.format('%s%s', newMainFile, mainData.slice(newMainFile.length + requireStatement.length));

                        return fileutils.writeFile(projectConfig.mainFile, newMainFile);
                    });
                })).then(() => {
                        return '';
                    });
            } else {
                return Promise.resolve('');
            }
        });
    }

    /**
     *  Search a directory for TypeScript files.
     *  @param templatePath The path to the template directory to reference.
     */
    static findTypeScriptFiles(templatePath: string): Thenable<Array<string>> {
        return fileutils.readdir(templatePath).then((fileList) => {
            var tsFiles: Array<string> = [];

            fileList.forEach((file) => {
                if (file.indexOf('.ts') > -1 && file.indexOf('.d.ts') === -1) {
                    tsFiles.push(file);
                }
            });

            return tsFiles;
        });
    }
}

export = MainFileHandler;

