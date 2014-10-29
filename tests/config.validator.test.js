var should = require('should'),
    validator = require('../platypi-cli/config/config.validator');

describe('validator', function () {
    it('should be a function', function () {
        validator.should.be.a.Function;
    });
});

var config = {
    name: '',
    author: 'Bob'
};

describe('config', function () {
    it('should be an object', function () {
        config.should.be.an.Object;
    });
});


describe('validator(config)', function () {
    it('should be false', function () {
        validator(config).should.be.false;
    });
});

var config2 = {
    name: 'Project',
    type: 'mobile',
    author: 'Donald Jones'
};

describe('validator(config2)', function () {
    it('should be false', function () {
        validator(config2).should.be.true;
    });
});

