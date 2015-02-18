class TypeScriptPathsUtil {
    /**
     *  Creates a new 'require' string from the provided control path.
     *  @param controlPath The relative path to the control to be required.
     */
    static newRequireString(controlPath: string): string {
        controlPath = controlPath.replace(/\\/g, '/');
        return 'require(\'' + controlPath + '\');\n';
    }

    /**
     *  Creates a new TypeScript reference string from the provided path.
     *  @param referencePath The relative path to the interface to be referenced.
     */
    static newReferenceString(referencePath: string): string {
        referencePath = referencePath.replace(/\\/g, '/');
        return '/// <reference path=\"' + referencePath + '\" />';
    }
}

export = TypeScriptPathsUtil;
