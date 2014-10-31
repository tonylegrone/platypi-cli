var should = require('should') // jshint ignore:line
    , fs = require('fs')
    , http = require('https')
    , package = require('../package.json')
    , helper = require('../platypi-cli/helpers/github.helper').helper
    , directory = require('../platypi-cli/utils/directory.utils');

describe('github helper', function () {
    it('should be an object', function () {
        helper.should.be.an.Object;
    });

    describe('package.json', function () {
        it('should be an object', function () {
            should.exist(package);
            package.should.be.an.Object;
        });

        it('should contain a version number', function () {
            should.exist(package.version);
        });
    });
    
    describe('_getUrl', function () {
        it('should be a function', function () {
            helper.__getUrl.should.be.a.Function;
        });

        it('should return a url using the current cli version', function () {
            helper.__getUrl(package.version).should.containEql(package.version);
        });

        describe('the url', function () {
            it('should be valid & accessible for downloading templates', function () {
                var url = helper.__getUrl(package.version);

                http.get(url, function (res) {
                    res.statusCode.should.equal(302);
                });
            });
        });
    });

    describe('downloadRepo', function () {
        // override timeout value since this is downloading from github and slow connections are possible
        setTimeout(10000);

        var appPath = '';
        before(function (done) {
            directory.appDataDir().then(function (path) {
                appPath = path;
                fs.unlink(appPath + '/cache/archives/' + package.version + '.zip', function (err) {
                    // didn't exist or lack permissions (not important for this test)
                    if (err) {
                        console.log(err);
                    }
                });
                helper.downloadRepo(appPath).then(function () {
                    done();
                });
            });
        });

        it('should create a cache dir', function () {
            fs.stat(appPath + '/cache/', function (err, stats) {
                appPath.should.not.equal('');
                stats.should.be.an.Object;
                stats.isDirectory().should.be.true;
            });
        });

        it('should download an archive of templates', function () {
            fs.stat(appPath + '/cache/archives/' + package.version + '.zip', function (err, stats) {
                stats.should.be.an.Object;
                stats.isFile().should.be.true;
            });            
        });
    });
});
