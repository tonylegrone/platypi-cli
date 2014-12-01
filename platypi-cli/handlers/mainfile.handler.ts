/// <reference path="../_references.d.ts" />
import fileutils = require('../utils/file.utils');

class MainFileHandler {
    static addControl(controlPath: string, projectConfig: config.IPlatypi) {
        var toAppend = 'require(\'' + controlPath + '\');';
        return fileutils.appendFIle(projectConfig.mainFile, toAppend);
    }
}

export = MainFileHandler;

