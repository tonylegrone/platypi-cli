var should = require('should'),
    validator = require('../platypi-cli/config/config.validator');

describe('validator', function () {
    it('should be a function', function () {
        validator.should.be.a.Function;
    });

    var config = {
        name: '',
        author: 'Bob'
    };

    describe('invalid config', function () {
        it('should be false', function () {
            validator(config).should.be.false;
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

