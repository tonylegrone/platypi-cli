/// <reference path="../../_references.d.ts" />

import request = require('request');
import promises = require('es6-promise');
import BaseService = require('../base.service');
import util = require('util');

var Promise = promises.Promise;

class GithubService extends BaseService {

    getRelease(version: string, savePath: string, token?: string): Thenable<string> {
        var host = 'https://codeload.github.com/Platypi/platypi-cli-templates/archive/'
            , location = util.format('%s%s%s', host, version, '.zip');

        return this._downloadFile(location, savePath, token);
    }
}

export = GithubService;
