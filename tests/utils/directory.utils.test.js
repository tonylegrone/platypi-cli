var should = require('should') // jshint ignore:line
    , fs = require('fs')
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

    describe('deleteWithPromise', function () {
        var error = null;

        before(function (done) {
            fs.writeFile('test.json', JSON.stringify({ test: 'test' }), function (err) {
                if (err) {
                    error = err;
                    done();
                }

                directory.deleteWithPromise('test.json').then(function () {
                    done();
                }, function (err) {
                    error = err;
                    done();
                });
            });
        });

        it('should delete the test file', function () {
            should.not.exist(error);
        });
    });

    describe('deleteDirectoryRecursive', function () {
        var error = '';

        before(function (done) {
            fs.mkdir('./testdir', function (err) {
                if (err) {
                    error = err;
                    done();
                }
                fs.mkdir('./testdir/test1', function (err) {
                    if (err) {
                        error = err;
                        done();
                    }

                    fs.writeFile('./testdir/test1/test.json', JSON.stringify({ test: 'test' }), function (err) {
                        if (err) {
                            error = err;
                            done();
                        }

                        directory.deleteDirectoryRecursive('./testdir')
                            .then(function () {
                                done();
                            }, function (err) {
                                error = err;
                                done();
                            });
                    });
                });
            });
        });

        it('should delete a directory with contents', function () {
            error.should.equal('');
        });
    });

});
