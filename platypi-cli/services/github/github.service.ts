/// <reference path="../../_references.d.ts" />

import BaseService = require('../base.service');
import util = require('util');

class GithubService extends BaseService {

    getRelease(version: string, savePath: string, token?: string): Thenable<string> {
        var host = 'https://github.com/Platypi/platypi-cli-templates/archive/'
            , location = util.format('%s%s%s', host, version, '.zip');

        return this._downloadFile(location, savePath, token);
    }
}

export = GithubService;
