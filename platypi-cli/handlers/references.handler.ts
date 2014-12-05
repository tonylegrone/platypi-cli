/// <reference path="../_references.d.ts" />
import fileutils = require('../utils/file.utils');

class ReferencesHandler {
    constructor(private location: string  = './public/_references.d.ts') {}

    addReference(referencePath: string, referenceType?: string): Thenable<any> {
        return fileutils.readFile(this.location).then((referenceData: string) => {
            var typePos = -1;

            if (referenceType) {
                var referenceTypeComment = '// ' + referenceType.toLowerCase();

                typePos = referenceData.indexOf(referenceTypeComment);
                typePos = typePos + referenceTypeComment.length;

                return fileutils.appendFileAt(this.location, typePos, '\n' + this.__newReferenceString(referencePath));
            } else {
                return fileutils.appendFIle(this.location, '\n' + this.__newReferenceString(referencePath));
            }
        });
    }

    private __newReferenceString(referencePath: string): String {
        return '/// <reference path=\"' + referencePath + '\" />';
    }
}

export = ReferencesHandler;

