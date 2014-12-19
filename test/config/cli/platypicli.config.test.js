var should = require('should') // jshint ignore:line
    , CliConfig = require('../../../platypi-cli/config/cli/platypicli.config');

describe('Platypi-CLI Config', function () {
    var config = CliConfig.config;
    it('should exist and be an object', function () {
        should.exist(config);
        config.should.be.an.Object;
    });

    describe('loadConfig', function () {
        var output = null;

        before(function (done) {
            config.__loadConfig().then(function (configOut) {
                output = configOut;
                done();
            }, function (err) {
                console.log(err);
                done();
            });
        });

        it('should load the config file if it exists', function () {
            should.exist(output);
            output.should.be.an.Object;
        });
    });
});
