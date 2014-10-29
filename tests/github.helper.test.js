var should = require('should'),
    fs = require('fs'),
    http = require('https'),
    package = require('../package.json'),
    helper = require('../platypi-cli/helpers/github.helper').helper;

describe('github helper', function () {
    it('should be an object', function () {
        helper.should.be.an.Object;
    });
    
    describe('_getUrl', function () {
        it('should be a function', function () {
            helper._getUrl.should.be.a.Function;
        });

        it('should return a url using the current cli version', function () {
            helper._getUrl(package.version).should.containEql(package.version);
        });

        describe('the url', function () {
            it('should be valid & accessible for downloading templates', function () {
                var url = helper._getUrl(package.version);

                http.get(url, function (res) {
                    res.statusCode.should.equal(302);
                });
            });
        });
    });

    describe('downloadRepo', function () {
        before(function (done) {
            helper.downloadRepo().then(function () {
                done();
            });
        });

        it('should create a cache dir', function () {
            fs.stat('../cache/', function (err, stats) {
                stats.should.be.an.Object;
                stats.isDirectory().should.be.true;
            });
        });

        it('should download an archive of templates', function () {
            fs.stat('../cache/' + package.version + '.tar.gz', function (err, stats) {
                stats.should.be.an.Object;
                stats.isFile().should.be.true;
            });            
        });
    });
});
