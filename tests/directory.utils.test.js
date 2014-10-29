var should = require('should'),
    path = require('path'),
    directory = require('../platypi-cli/utils/directory.utils');

describe('directory utils', function () {
    it('directory.utils should be an object', function () {
        directory.should.be.an.Object;
    });

    it('dirToArray should return an array', function () {
        directory.dirToArray().should.be.an.Array;
    });

    it('upOneLevel should return a string path to the parent dir', function () {
        var parent = path.resolve('../');
        directory.upOneLevel().should.eql(parent);
    });

});
