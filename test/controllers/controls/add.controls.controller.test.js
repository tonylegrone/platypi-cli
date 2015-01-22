var chai = require('chai')
    , sinon = require('sinon')
    , sinonChai = require('sinon-chai')
    , expect = chai.expect
    , Promise = require('es6-promise').Promise
    , AddControlController = require('../../../platypi-cli/controllers/controls/add/add.controls.controller');

chai.use(sinonChai);

describe('Add Controls Controller', function () {
    it('should initialize a new controller', function (done) {
        var controller = new AddControlController({}, 'viewcontrol', 'test', 't', '');
        expect(controller).to.be.an.object;
        expect(controller.model).to.be.an.object;
        expect(controller.view.model).to.be.an.object;
        done();
    });

    describe('getResponseView() method', function () {
        var controller = new AddControlController({}, 'viewcontrol', 'test', 't', '');
        var sandbox, createFunc;

        beforeEach(function (done) {
            sandbox = sinon.sandbox.create();

            createFunc = sandbox.stub(controller.model, 'create');
            createFunc.returns(Promise.resolve('newPath'));

            done();
        });

        afterEach(function (done) {
            sandbox.restore();
            done();
        });

        it('should call the create method and return a view', function (done) {
            controller.getResponseView().then(function (view) {
                try {
                    expect(createFunc).to.have.been.called;
                    expect(controller.model.successMessage).to.equal('newPath');
                    done();
                } catch (e) {
                    done(e);
                }
            }, function (err) {
                done(err);
            });
        });

        it('should call the create method and reject the promise', function (done) {
            createFunc.returns(Promise.reject('Intended Error'));
            controller.getResponseView().then(function (view) {
                try {
                    expect(createFunc).to.have.been.called;
                    expect(controller.model.errorMessage).to.equal('Intended Error');
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
