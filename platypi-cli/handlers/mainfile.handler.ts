/// <reference path="../_references.d.ts" />
import fileutils = require('../utils/file.utils');

class MainFileHandler {
    static addControl(controlPath: string, projectConfig: config.IPlatypi) {
        controlPath = (controlPath.charAt(0) === '.' ? controlPath : './' + controlPath);
        var toAppend = 'require(\'' + controlPath + '\');\n';
        return fileutils.appendFIle(projectConfig.mainFile, toAppend);
    }
}

export = MainFileHandler;

