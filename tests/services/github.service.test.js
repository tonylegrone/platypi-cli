var should = require('should') // jshint ignore:line
    , service = require('../../platypi-cli/services/github/github.service')
    , path = require('path');

describe('github service', function () {
    var returnedPath = '';

    before(function (done) {
        service.getRelease('0.0.1', path.normalize('.')).then(function (path) {
            returnedPath = path;
            done();
        });
    });

    it('should download a release', function () {
        returnedPath.should.not.equal('');
    });

});
