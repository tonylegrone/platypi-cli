var should = require('should'),
    finder = require('../platypi-cli/config/config.finder'),
    fs = require('fs');

describe('finder', function () {
    it('should be a function', function () {
        finder.should.be.a.Function;
    });

    describe('no config', function () {
        var error = null;

        before(function (done) {
            finder().then(function () {
            }, function (err) {
                error = err;
                done();
            });
        });

        it('should reject promise', function () {
            should.exist(error);
        });
    });

    describe('with config', function () {
        var config = {
            name: 'project',
            type: 'mobile',
            author: 'Donald Jones'
        },
            exists = false,
            error = null;

        before(function (done) {
            // anti-pattern, but necessary to preserve user created json
            fs.exists('platypi.json', function (exist) {
                if (exist) {
                    exists = true;
                    finder().then(function (c) {
                        console.log(c);
                        done();
                    }, function (err) {
                        error = err;
                        done();
                    });
                    done();
                    return;
                }

                fs.writeFile('platypi.json', JSON.stringify(config), function (err) {
                    if (err) {
                        console.log(err);
                    }
                    fs.exists('platypi.json', function (exist2) {
                        finder().then(function (c) {
                            done();
                        }, function (err) {
                            error = err;
                            done();
                        });
                    });
                });
            });
        });

        it('should not reject promise', function () {
            should.not.exist(error);
        });

        after(function () {
            if (!exists) {
                fs.unlink('platypi.json');
            }
        });
    });

    describe('with config in parent (recursive search)', function () {
        var exists = false,
            config = {
                name: 'project',
                type: 'mobile',
                author: 'Donald Jones'
            },
            error = null,
            found = null;


        before(function (done) {
            // anti-pattern, but necessary to preserve user created json
            fs.exists('../platypi.json', function (exist) {
                if (exist) {
                    exists = true;
                    done();
                    return;
                }

                fs.writeFile('../platypi.json', JSON.stringify(config), function (err) {
                    if (err) {
                        console.log(err);
                    }
                    fs.exists('../platypi.json', function (exist2) {
                        console.log('wrote to: ' + path.resolve('../'));
                        finder().then(function () {
                            done();
                        }, function (err) {
                            error = err;
                            done();
                        });
                    });
                });
            });
        });

        it('should not reject promise', function () {
            should.not.exist(error);
        });

        after(function () {
            if (!exists) {
                fs.unlink('../platypi.json');
            }
        });
    });
});
