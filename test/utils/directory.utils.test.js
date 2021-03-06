var should = require('should') // jshint ignore:line
    , path = require('path')
    , directory = require('../../platypi-cli/utils/directory.utils');

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

        it('should go all the way to root', function () {
            var current = path.resolve('.')
                , root = path.resolve('/');

            while (path.relative(current, '/') !== '') {
                current = directory.upOneLevel(current);
            }

            current.should.equal(root);
        });
    });

    describe('appDataDir', function () {
        var dirPath = '';
        before(function (done) {
            directory.appDataDir().then(function (path) {
                dirPath = path;
                done();
            });
        });

        it('should create or return an app dir in the OS appdata dir', function () {
            dirPath.should.not.equal('');
        });
    });
});
