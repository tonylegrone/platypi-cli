var chai = require('chai')
    , dirutils = require('../../platypi-cli/utils/directory.utils')
    , sinon = require('sinon')
    , sinonChai = require('sinon-chai')
    , expect = chai.expect
    , Promise = require('es6-promise').Promise
    , Provider = require('../../platypi-cli/providers/githubtemplate.provider');

chai.use(sinonChai);

var providerInstance;

describe('Github Template Provider', function() {
    providerInstance = new Provider();

    it('should join a helper with a service', function(done) {
        expect(providerInstance).to.be.an.object;
        expect(providerInstance.__helper).to.be.an.object;
        done();
    });

    describe('update method', function() {
        var sandbox, updateTemplateFunc;

        before(function(done) {
            sandbox = sinon.sandbox.create();
            updateTemplateFunc = sandbox.stub(providerInstance.__helper, 'updateTemplates', function(path) {
                return Promise.resolve('successDir');
            });

            done();
        });

        after(function(done) {
            sandbox.restore();
            done();
        });

        it('should call the helpers updateTemplates method', function(done) {
            providerInstance.update().then(function(rtnDir) {
                expect(rtnDir).to.equal('successDir');
                done();
            });
        });
    });

    describe('clear method', function() {
        var sandbox, recursiveDirDelete;

        before(function(done) {
            sandbox = sinon.sandbox.create();
            sandbox.stub(dirutils, 'appDataDir', function() {
                return Promise.resolve('test');
            });
            recursiveDirDelete = sandbox.stub(dirutils, 'deleteDirectoryRecursive', function(pathToDel) {
                return Promise.resolve(pathToDel);
            });
            done();
        });

        after(function(done) {
            sandbox.restore();
            done();
        });

        it('should delete the cached folder', function(done) {
            providerInstance.clear().then(function(deletedPath) {
                expect(deletedPath).to.equal('test');
                done();
            });
        });
    });
});
