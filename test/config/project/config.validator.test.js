var should = require('should') // jshint ignore:line
    , validator = require('../../../platypi-cli/config/project/config.validator');

describe('validator', function () {
    it('should be a function', function () {
        validator.should.be.a.Function;
    });

    var config = {
        name: '',
        author: 'Bob'
    };

    describe('invalid config, blank project name', function () {
        it('should be false', function () {
            validator(config).should.be.false;
        });
    });

    var configFail1 = {
        name: 'Bob Project',
        author: 'Bob'
    };

    describe('invalid config, type missing', function() {
        it('should be false', function(done) {
            validator(configFail1).should.be.false;
            done();
        });
    });


    var configFail2 = {
        name: 'Bob Project',
        type: 'mobile'
    };

    describe('invalid config, author missing', function() {
        it('should be false', function(done) {
            validator(configFail2).should.be.false;
            done();
        });
    });

    var config2 = {
        name: 'Project',
        type: 'mobile',
        author: 'Donald Jones'
    };

    describe('valid config', function () {
        it('should be false', function () {
            validator(config2).should.be.true;
        });
    });
});

