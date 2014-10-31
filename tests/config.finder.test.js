var should = require('should'),
    ConfigFinder = require('../platypi-cli/config/config.finder'),
    fs = require('fs'),
    testFile = 'test123123.json';

describe('finder', function () {
    it('should be a function', function () {
        var finder = new ConfigFinder().findConfig;
        finder.should.be.a.Function;
    });

    describe('no config', function () {
        var error = '';

        before(function (done) {
            var finder = new ConfigFinder();

            finder.findConfig(testFile).then(function () {
                done();
            }, function (err) {
                error = err;
                done();
            });
        });

        it('should reject promise', function () {
            error.should.not.equal('');
        });
    });

    describe('with config', function () {
        var config = {
            name: 'project',
            type: 'mobile',
            author: 'Donald Jones'
        },
            exists = false,
            error = '',
            result = {};

        before(function (done) {
            var finder = new ConfigFinder();

            fs.writeFile(testFile, JSON.stringify(config), function (err) {
                if (err) {
                    console.log(err);
                }
                finder.findConfig(testFile).then(function (c) {
                    result = c;
                    done();
                }, function (err) {
                    error = err;
                    done();
                });
            });
        });

        it('should not reject promise', function () {
            error.should.equal('');
        });

        it('should equal input', function () {
            result.should.eql(config);
        });

        after(function () {
            if (!exists) {
                fs.unlink(testFile);
            }
        });
    });

    describe('with config in parent (recursive)', function () {
        var config = {
            name: 'project',
            type: 'mobile',
            author: 'Donald Jones'
        },
            exists = false,
            error = '',
            result = {};

        before(function (done) {
            var finder = new ConfigFinder();

            fs.writeFile('../' + testFile, JSON.stringify(config), function (err) {
                if (err) {
                    console.log(err);
                }
                finder.findConfig('../' + testFile).then(function (c) {
                    result = c;
                    done();
                }, function (err) {
                    error = err;
                    done();
                });
            });
        });

        it('should not reject promise', function () {
            error.should.equal('');
        });

        it('should equal input', function () {
            result.should.eql(config);
        });

        after(function () {
            if (!exists) {
                fs.unlink('../' + testFile);
            }
        });
    });

});
