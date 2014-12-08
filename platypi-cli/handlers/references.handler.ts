/// <reference path="../_references.d.ts" />

import path = require('path');
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
                                typePos = typePos + referenceTypeComment.length;

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
     *  Creates a new TypeScript reference string from the provided path.
     *  @param referencePath The relative path to the interface to be referenced.
     */
     static newReferenceString(referencePath: string): string {
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

