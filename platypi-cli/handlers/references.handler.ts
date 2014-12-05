/// <reference path="../_references.d.ts" />
import fileutils = require('../utils/file.utils');
/**
 *  Contains methods for handling a project's _references.d.ts file.
 */
class ReferencesHandler {
    constructor(private location: string  = './public/_references.d.ts') {}

    /**
     *  Add a reference to the current project's _references.d.ts file.
     *  @param referencePath The relative path to the interface to be referenced.
     *  @param referenceType The control type of the interface.
     */
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

    /**
     *  Creates a new TypeScript reference string from the provided path.
     *  @param referencePath The relative path to the interface to be referenced.
     */
    private __newReferenceString(referencePath: string): String {
        return '/// <reference path=\"' + referencePath + '\" />';
    }
}

export = ReferencesHandler;

