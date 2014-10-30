var should = require('should'),
    finder = require('../platypi-cli/config/config.finder'),
    fs = require('fs');

describe('finder', function () {
    it('should be a function', function () {
        finder.should.be.a.Function;
    });

    describe('no config', function () {
        it('should throw an exception', function () {
            finder().then(function (config) {
                // success

                done();
            }, function (err) {
                throw err;
                done();
            }).should.throw();
        });
    });

    describe('with config', function () {
        var config = {
            name: 'project',
            type: 'mobile',
            author: 'Donald Jones'
        },
            exists = false;

        before(function (done) {
            // anti-pattern, but necessary to preserve user created json
            if (!fs.existsSync('platypi.json')) {
                fs.writeFile('platypi.json', JSON.stringify(config), function (err) {
                    if (err) {
                        console.log(err);
                    }
                    done();
                });
            } else {
                exists = true;
            }
        });

        it('should not throw an exception', function () {
            (function () {
                finder();
            }).should.not.throw();
        });

        after(function () {
            if (!exists) {
                fs.unlink('platypi.json');
            }
        });
    });

    describe('with config in parent (recursive search)', function () {
        if (!fs.existsSync('../platypi.json')) {
            var config = {
                name: 'project',
                type: 'mobile',
                author: 'Donald Jones'
            };

            before(function (done) {
                fs.writeFile('../platypi.json', JSON.stringify(config), function (err) {
                    if (err) {
                        console.log(err);
                    }
                    done();
                });
            });

            it('should not throw an exception', function () {
                (function () {
                    finder();
                }).should.not.throw();
            });

            after(function () {
                fs.unlink('../platypi.json');
            });
        } else {
            it('should not throw an exception', function () {
                (function () {
                    finder();
                }).should.not.throw();
            });
        }
    });
});
