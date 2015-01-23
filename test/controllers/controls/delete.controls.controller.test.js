var chai = require('chai')
    , sinon = require('sinon')
    , sinonChai = require('sinon-chai')
    , expect = chai.expect
    , Promise = require('es6-promise').Promise
    , DeleteControlController = require('../../../platypi-cli/controllers/controls/delete/delete.control.controller');

chai.use(sinonChai);

describe('Delete Controls Controller', function () {
    it('should initialize a new controller', function (done) {
        var controller = new DeleteControlController({}, 'viewcontrol', 'test');
        expect(controller).to.be.an.object;
        expect(controller.model).to.be.an.object;
        expect(controller.view.model).to.be.an.object;
        done();
    });

    describe('getResponseView() method', function () {
        var controller = new DeleteControlController({}, 'viewcontrol', 'test');
        var sandbox, deleteFunc;

        beforeEach(function (done) {
            sandbox = sinon.sandbox.create();

            deleteFunc = sandbox.stub(controller.model, 'delete');
            deleteFunc.returns(Promise.resolve('newPath'));

            done();
        });

        afterEach(function (done) {
            sandbox.restore();
            done();
        });

        it('should call the delete method and return a view', function (done) {
            controller.getResponseView().then(function (view) {
                try {
                    expect(deleteFunc).to.have.been.called;
                    expect(controller.model.successMessage).to.equal('newPath');
                    expect(view).to.be.an.object;
                    done();
                } catch (e) {
                    done(e);
                }
            }, function (err) {
                done(err);
            });
        });

        it('should call the delete method and reject the promise', function (done) {
            deleteFunc.returns(Promise.reject('Intended Error'));
            controller.getResponseView().then(function (view) {
                try {
                    expect(deleteFunc).to.have.been.called;
                    expect(controller.model.errorMessage).to.equal('Intended Error');
                    expect(view).to.be.an.object;
                    done();
                } catch (e) {
                    done(e);
                }
            }, function (err) {
                done(err);
            });
        });
    });
});
