/// <reference path="../_references.d.ts" />

import path = require('path');
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
    static addControl(controlFolderPath: string, projectConfig: config.IPlatypi, controlType?: string) {
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
                            typePos = typePos + controlTypeComment.length;
                        }

                        return fileutils.appendFileAt(projectConfig.mainFile, typePos, '\n'
                            + this.newRequireString(relativePathToControlFile));
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
     *  Creates a new 'require' string from the provided control path.
     *  @param controlPath The relative path to the control to be required.
     */
    static newRequireString(controlPath: string): string {
        return 'require(\'' + controlPath + '\');\n';
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

