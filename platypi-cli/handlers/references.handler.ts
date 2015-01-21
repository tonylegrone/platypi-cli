/// <reference path="../_references.d.ts" />

import path = require('path');
import util = require('util');
import fileutils = require('../utils/file.utils');
import promises = require('es6-promise');

var Promise = promises.Promise;

/**
 *  Contains methods for handling a project's _references.d.ts file.
 */
class ReferencesHandler {
    /**
     *  Add a reference to the current project's _references.d.ts file.
     *  @param referenceFolderPath The absolute path to the folder containing an interface to be referenced.
     *  @param referenceType The control type of the interface.
     */
    static addReference(referenceFileLocation: string, referenceFolderPath: string, referenceType?: string): Thenable<any> {
        var relativePathToReference = path.relative(referenceFileLocation, referenceFolderPath);

        return this.findInterfaceFiles(referenceFolderPath).then((interfaceFiles) => {
            if (interfaceFiles.length > 0) {
                return Promise.all(<Array<Promise<string>>>interfaceFiles.map((file) => {
                    if (file.indexOf('.d.ts') > -1) {
                        return fileutils.readFile(referenceFileLocation, { encoding: 'utf8' }).then((referenceData: string) => {
                            var typePos = -1,
                                relativePathToReferenceFile = path.join(relativePathToReference, file);

                            relativePathToReferenceFile = relativePathToReferenceFile.slice(3);

                            if (referenceType) {
                                var referenceTypeComment = '// ' + referenceType.toLowerCase() + 's';

                                typePos = referenceData.indexOf(referenceTypeComment);
                                typePos = (typePos > -1 ? typePos + referenceTypeComment.length : -1);

                            }

                            return fileutils.appendFileAt(referenceFileLocation, typePos, '\n'
                                    + this.newReferenceString(relativePathToReferenceFile));
                        });
                    } else {
                        return Promise.resolve('');
                    }
                })).then(() => {
                    return '';
                });
            } else {
                return Promise.resolve('');
            }
        });
    }

    /**
     *  Remove a reference to the current project's _references.d.ts file.
     *  @param referenceFolderPath The absolute path to the folder containing an interface to be referenced.
     *  @param referenceType The control type of the interface.
     */
    static removeReference(referenceFolderPath: string, projectConfig: config.IPlatypi): Thenable<any> {
        var relativePathToReference = path.relative(projectConfig.public, referenceFolderPath),
            referenceFileLocation = path.join(projectConfig.public, '_references.d.ts');

        return this.findInterfaceFiles(referenceFolderPath).then((interfaceFiles) => {
            if (interfaceFiles.length > 0) {
                return Promise.all(<Array<Promise<string>>>interfaceFiles.map((file) => {
                    if (file.indexOf('.d.ts') > -1) {
                        return fileutils.readFile(referenceFileLocation, { encoding: 'utf8' }).then((referenceData: string) => {
                            var relativePathToReferenceFile = path.join(relativePathToReference, file);

                            var referenceString = this.newReferenceString(relativePathToReferenceFile);

                            var newReferenceFile = referenceData.slice(0, referenceData.indexOf(referenceString));

                            newReferenceFile = util.format('%s%s', newReferenceFile
                                , referenceData.slice(newReferenceFile.length + referenceString.length));

                            return fileutils.writeFile(referenceFileLocation, newReferenceFile);
                        });
                    } else {
                        return Promise.resolve('');
                    }
                })).then(() => {
                        return '';
                    });
            } else {
                return Promise.resolve('');
            }
        });
    }

    /**
     *  Creates a new TypeScript reference string from the provided path.
     *  @param referencePath The relative path to the interface to be referenced.
     */
    static newReferenceString(referencePath: string): string {
        referencePath = referencePath.replace(/\\/g, '/');
        return '/// <reference path=\"' + referencePath + '\" />';
    }

    /**
     *  Search a directory for interfaces files.
     *  @param referencePath The path to the directory to search.
     */
    static findInterfaceFiles(referencePath: string): Thenable<Array<string>> {
         return fileutils.readdir(referencePath).then((fileList) => {
             var interfaceFiles: Array<string> = [];

             fileList.forEach((file) => {
                 if (file.indexOf('.d.ts') > -1) {
                     interfaceFiles.push(file);
                 }
             });

             return interfaceFiles;
         });
    }
}

export = ReferencesHandler;

