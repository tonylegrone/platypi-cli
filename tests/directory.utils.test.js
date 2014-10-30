var should = require('should'),
    path = require('path'),
    directory = require('../platypi-cli/utils/directory.utils');

describe('directory utils', function () {
    it('should be an object', function () {
        directory.should.be.an.Object;
    });

    describe('dirToArray', function () {
        it('should be a function', function () {
            directory.dirToArray.should.be.a.Function;
        });

        it('should return an array', function () {
            directory.dirToArray().should.be.an.Array;
        });
    });

    describe('upOneLevel', function () {
        it('should be a function', function () {
            directory.upOneLevel.should.be.a.Function;
        });

        it('should return a string path to the parent dir', function () {
            var parent = path.resolve('../');
            directory.upOneLevel().should.eql(parent);
        });
    });

    describe('appDataDir', function () {
        var dirPath = '';
        before(function () {
            directory.appDataDir().then(function (path) {
                dirPath = path;
                done();
            });
        });

        it('should create an app dir in the OS appdata dir', function () {
            dirPath.should.not.equal('');
        });
    });
});
