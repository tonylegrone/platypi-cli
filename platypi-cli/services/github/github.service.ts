/// <reference path="../../_references.d.ts" />

import BaseService = require('../base.service');
import util = require('util');

class GithubService extends BaseService implements IBaseService {

    baseUrl = 'https://github.com/Platypi/platypi-cli-templates/archive/';

    private __getUrl(version: string) {
        return util.format('%s/%s.zip', this.baseUrl, version);
    }

    getRelease(version: string, savePath: string, token?: string): Thenable<string> {
        var location = this.__getUrl(version);

        return this._downloadFile(location, savePath, token);
    }
}

export = GithubService;
