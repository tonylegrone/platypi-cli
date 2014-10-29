var should = require('should'),
    finder = require('../platypi-cli/config/config.finder'),
    fs = require('fs');;

describe('finder', function () {
    it('should be a function', function () {
        finder.should.be.a.Function;
    });

    describe('no config', function () {
        it('should throw an exception', function () {
            (function () {
                finder();
            }).should.throw();
        });
    });

    describe('with config', function () {
        var config = {
            name: 'project',
            type: 'mobile',
            author: 'Donald Jones'
        };

        before(function (done) {
            fs.writeFile('platypi.json', JSON.stringify(config), function (err) {
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
            fs.unlink('platypi.json');
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
