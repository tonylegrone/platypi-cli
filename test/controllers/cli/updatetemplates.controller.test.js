var chai = require('chai')
    , sinon = require('sinon')
    , sinonChai = require('sinon-chai')
    , expect = chai.expect
    , Promise = require('es6-promise').Promise
    , UpdateTemplatesController = require('../../../platypi-cli/controllers/cli/updatetemplates.controller');

chai.use(sinonChai);

describe('TemplateUpdate controller', function () {
    it('should return a new controller', function (done) {
        try {
            var controller = new UpdateTemplatesController({
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
        var sandbox, controller, updateFunc;

        beforeEach(function (done) {
            sandbox = sinon.sandbox.create();

            controller = new UpdateTemplatesController({
                viewStuff: 'fakeview'
            });

            updateFunc = sandbox.stub(controller.__provider, 'update');

            done();
        });

        afterEach(function (done) {
            sandbox.restore();
            done();
        });


        it('should call the clean method and return the view', function (done) {
            updateFunc.returns(Promise.resolve(''));

            controller.getResponseView().then(function (view) {
                try {
                    expect(updateFunc).to.have.been.called;
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

        it('should call the update method and throw an error', function (done) {
            updateFunc.returns(Promise.reject('Err'));

            controller.getResponseView().then(function (view) {
                try {
                    expect(updateFunc).to.have.been.called;
                    expect(controller.model.errorMessage).not.to.equal('');
                    expect(view).to.exist;
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