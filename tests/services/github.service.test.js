var should = require('should') // jshint ignore:line
    , GithubService = require('../../platypi-cli/services/github/github.service')
    , path = require('path')
    , fs = require('fs')
    , http = require('https')
    , package = require('../../package.json');

describe('github service', function () {

    describe('private __getUrl method', function () {
        var service = new GithubService();

        it('should be a function', function () {
            service.__getUrl.should.be.a.Function;
        });

        it('should return a url using the current cli version', function () {
            service.__getUrl(package.version).should.containEql(package.version);
        });

        describe('the url', function () {
            it('should be valid & accessible for downloading templates', function () {
                var url = service.__getUrl(package.version);

                http.get(url, function (res) {
                    res.statusCode.should.equal(302 || 200);
                });
            });
        });
    });

    var returnedPath = '';

    before(function (done) {
        var service = new GithubService();
        service.getRelease('0.0.1', path.normalize('.') + '/0.0.1.zip').then(function (path) {
            returnedPath = path;
            done();
        });
    });

    it('should download a release', function () {
        returnedPath.should.not.equal('');
    });

    after(function () {
        fs.unlink(path.normalize('.') + '/0.0.1.zip');
    });

});
