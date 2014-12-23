var chai = require('chai')
    , request = require('request')
    , sinon = require('sinon')
    , sinonChai = require('sinon-chai')
    , expect = chai.expect
    , BaseService = require('../../platypi-cli/services/base.service');

chai.use(sinonChai);

describe('Base Service Implementation', function() {
    describe('_get Method', function() {
        var sandbox, service, getFunc;
        beforeEach(function(done) {
           service = new BaseService();
           sandbox = sinon.sandbox.create();
           getFunc = sandbox.stub(request, 'get', function(options, callback) {
               if (options.host === 'success.com') {
                   if (options.headers && options.headers.Authorization) {
                       callback(null, 'success token', 'success token');
                   } else {
                       callback(null, 'success', 'success');
                   }
               } else {
                   callback('Fail.');
               }
           });

           done();
        });

        afterEach(function(done) {
            sandbox.restore();
            done();
        });

        it('should return an error as no host was specified', function(done) {
            service._get().then(null, function(err) {
                expect(err).to.equal('Fail.');
                done();
            });
        });


        it('should return success as the request was successful', function(done) {
            service._get('success.com', '/').then(function(body) {
                expect(body).to.equal('success');
                done();
            });
        });


        it('should return success as the request was successful and the authtoken should be set', function(done) {
            service._get('success.com', '/', 'testtoken').then(function(body) {
                expect(body).to.equal('success token');
                done();
            });
        });

    });
});
