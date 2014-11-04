var should = require('should') // jshint ignore:line
    , CliConfig = require('../../../platypi-cli/config/cli/platypicli.config');

describe('Platypi-CLI Config', function () {
    var config = CliConfig.config;
    it('should exist and be an object', function () {
        should.exist(config);
        config.should.be.an.Object;
    });

    describe('updateConfig', function () {
        var error = null;

        before(function (done) {
            config.__updateConfig().then(null,function(err) {
                error = err;
                done();
            });
        });

        it('should fail, no config loaded', function () {
            should.exist(error);
            error.should.equal('No config loaded!');
        });
    });

    describe('loadConfig', function () {
        var output = null;

        before(function (done) {
            config.__loadConfig().then(function (configOut) {
                output = configOut;
                done();
            }, function (err) {
                throw err;
                done();
            });
        });

        it('should load the config file if it exists', function () {
            should.exist(output);
            output.should.be.an.Object;
        });
    });
});
