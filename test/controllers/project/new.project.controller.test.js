var chai = require('chai')
    , sinon = require('sinon')
    , sinonChai = require('sinon-chai')
    , expect = chai.expect
    , Promise = require('es6-promise').Promise
    , ProjectGenerator = require('../../../platypi-cli/generators/templates/project.template.generator')
    , NewProjectController = require('../../../platypi-cli/controllers/project/new/new.project.controller');

chai.use(sinonChai);

describe('New Project Controller', function () {
    it('should initialize a new controller', function (done) {
        var controller = new NewProjectController({}, 'web', 'test', 'test.test');
        expect(controller).to.be.an.object;
        expect(controller.model).to.be.an.object;
        expect(controller.view.model).to.be.an.object;
        done();
    });

    describe('getResponseView() method', function () {
        var controller = new NewProjectController({}, 'web', 'test', 'test.test');
        var sandbox, generateFunc, configGeneratorFunc;

        beforeEach(function (done) {
            sandbox = sinon.sandbox.create();

            generateFunc = sandbox.stub(ProjectGenerator.prototype, 'generate');
            generateFunc.returns(Promise.resolve('newPath'));

            configGeneratorFunc = sandbox.stub(controller, 'configGen');
            configGeneratorFunc.returns(Promise.resolve({
                type: 'web',
                name: 'test'
            }));

            done();
        });

        afterEach(function (done) {
            sandbox.restore();
            done();
        });

        it('should call the create method without initializing through prompts and return a view', function (done) {
            controller.getResponseView().then(function (view) {
                try {
                    expect(generateFunc).to.have.been.called;
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

        it('should call the create method without initializing through prompts and reject the promise', function (done) {
            generateFunc.returns(Promise.reject('Intended Error'));
            controller.getResponseView().then(function (view) {
                try {
                    expect(generateFunc).to.have.been.called;
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
