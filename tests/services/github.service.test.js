var should = require('should') // jshint ignore:line
    , GithubService = require('../../platypi-cli/services/github/github.service')
    , path = require('path')
    , fs = require('fs');

describe('github service', function () {
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
