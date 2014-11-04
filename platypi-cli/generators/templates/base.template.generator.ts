import TemplateHelper = require('../../helpers/template.helper');
import GithubService = require('../../services/github/github.service');
import CliConfig = require('../../config/cli/platypicli.config');

class BaseTemplateGenerator {
    helper = null;
    config = null;

    constructor() {
        this.helper = new TemplateHelper(GithubService);
        this.config = CliConfig.config;
    }

}

export = BaseTemplateGenerator;
