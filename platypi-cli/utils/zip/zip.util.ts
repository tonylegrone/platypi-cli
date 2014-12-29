/// <reference path="../../_references.d.ts" />

var admzip = require('adm-zip');

class ZipUtil implements utils.IZipUtil {
    constructor(public zipLocation: string) { }
    extractAll(extractLocation: string, overwrite: boolean) {
        var zip = new admzip(this.zipLocation);

        try {
            zip.extractAllTo(extractLocation, overwrite);
        } catch (e) {
            throw e;
        }

        return extractLocation;
    }
}

export = ZipUtil;
