/// <reference path="../_references.d.ts" />

import fileutils = require('../utils/file.utils');
import promises = require('es6-promise');

var Promise = promises.Promise;

/**
 *  Contains methods for handling a project's _references.d.ts file.
 */
class ReferencesHandler {
    /**
     *  Add a reference to the current project's _references.d.ts file.
     *  @param referencePath The relative path to the interface to be referenced.
     *  @param referenceType The control type of the interface.
     */
    static addReference(referenceFileLocation: string, referencePath: string, referenceType?: string): Thenable<any> {
        if (referencePath.indexOf('.d.ts') > -1) {
            return fileutils.readFile(referenceFileLocation).then((referenceData: string) => {
                var typePos = -1;

                if (referenceType) {
                    var referenceTypeComment = '// ' + referenceType.toLowerCase();

                    typePos = referenceData.indexOf(referenceTypeComment);
                    typePos = typePos + referenceTypeComment.length;

                    return fileutils.appendFileAt(referenceFileLocation, typePos, '\n' + this.newReferenceString(referencePath));
                } else {
                    return fileutils.appendFIle(referenceFileLocation, '\n' + this.newReferenceString(referencePath));
                }
            });
        } else {
           return Promise.resolve('');
        }
    }

    /**
     *  Creates a new TypeScript reference string from the provided path.
     *  @param referencePath The relative path to the interface to be referenced.
     */
     static newReferenceString(referencePath: string): String {
        return '/// <reference path=\"' + referencePath + '\" />';
    }
}

export = ReferencesHandler;

