var chai = require('chai')
    , sinon = require('sinon')
    , sinonChai = require('sinon-chai')
    , expect = chai.expect
    , Promise = require('es6-promise').Promise
    , CacheCleanController = require('../../../platypi-cli/controllers/cli/cacheclean.controller');

chai.use(sinonChai);

describe('CacheClean Controller', function () {
    it('should return a new controller', function (done) {
        try {
            var controller = new CacheCleanController({
                viewStuff: 'fakeview'
            });
            expect(controller).to.be.an.object;
            expect(controller.model).to.be.an.object;
            expect(controller.view).to.be.an.object;
            expect(controller.view.model).to.equal(controller.model);
            done();
        } catch (e) {
            done(e);
        }
    });

    describe('getResponseView method', function () {
        var sandbox, controller, clearFunc;

        beforeEach(function (done) {
            sandbox = sinon.sandbox.create();

            controller = new CacheCleanController({
                viewStuff: 'fakeview'
            });

            clearFunc = sandbox.stub(controller.__provider, 'clear');

            done();
        });

        afterEach(function (done) {
            sandbox.restore();
            done();
        });

        it('should call the clean method and return the view', function (done) {
            clearFunc.returns(Promise.resolve(''));

            controller.getResponseView().then(function (view) {
                try {
                    expect(clearFunc).to.have.been.called;
                    expect(controller.model.successMessage).not.to.equal('');
                    expect(view).to.exist;
                    done();
                } catch (e) {
                    done(e);
                }
            }, function (err) {
                done(err);
            });
        });

        it('should call the clean method and throw an error', function (done) {
            clearFunc.returns(Promise.reject('Err'));

            controller.getResponseView().then(function (view) {
                try {
                    expect(clearFunc).to.have.been.called;
                    expect(controller.model.errorMessage).not.to.equal('');
                    expect(view).to.exist;
                    done();
                } catch (e) {
                    done(e);
                }
            }, function (err) {
                done('Unexpectedly successful.');
            });
        });

    });

});
