/// <reference path="../_references.d.ts" />

import GithubService = require('../services/github/github.service');
import TemplateHelper = require('../helpers/template.helper');
import dirutils = require('../utils/directory.utils');

class GithubTemplateProvider implements providers.ITemplateProvider {
    private __helper = null;

    constructor() {
        this.__helper = new TemplateHelper(GithubService);
    }

    update(): Thenable<any> {
        return dirutils.appDataDir().then((appDataDir) => {
            return this.__helper.updateTemplates(appDataDir);
        });
    }

    clear(): Thenable<any> {
       return dirutils.appDataDir().then((appDataDir) => {
           return dirutils.deleteDirectoryRecursive(appDataDir);
       });
    }
}

export = GithubTemplateProvider;

