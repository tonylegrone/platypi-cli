var chai = require('chai')
    , sinon = require('sinon')
    , sinonChai = require('sinon-chai')
    , expect = chai.expect
    , Promise = require('es6-promise').Promise
    , ProjectConfigFinder = require('../../../platypi-cli/config/project/config.finder')
    , globals = require('../../../platypi-cli/globals')
    , ProjectTemplateGen = require('../../../platypi-cli/generators/templates/project.template.generator');

chai.use(sinonChai);

describe('Project Template Generator', function () {
    describe('generate method', function () {
        var generator = new ProjectTemplateGen('web', []);

        var sandbox,
            copyTemplateFunc,
            configFindFunc,
            mkdirFunc,
            getCliConfigFunc,
            readdirFunc,
            statFunc;

        beforeEach(function (done) {
            sandbox = sinon.sandbox.create();

            sandbox.stub(globals.console);

            copyTemplateFunc = sandbox.stub(ProjectTemplateGen.prototype, '_copyTemplateTo')
                .returns(Promise.resolve('testFolder'));

            configFindFunc = sandbox.stub(ProjectConfigFinder, 'findConfig')
                .returns(Promise.resolve({
                    type: 'web',
                    viewcontrols: [
                        {
                            name: 'test',
                            type: 'viewcontrol'
                        }
                    ],
                    attributecontrols: [],
                    injectables: [],
                    models: [],
                    repositories: [],
                    services: [],
                    templatecontrols: [],
                    save: function () {
                        return Promise.resolve('');
                    }
                }));

            mkdirFunc = sandbox.stub(generator.fileUtils, 'mkdir')
                .returns(Promise.resolve(''));

            getCliConfigFunc = sandbox.stub(generator._config, 'getConfig')
                .returns(Promise.resolve({
                    templates: {
                        projectStruct: [
                            'app',
                            'stuff'
                        ],
                        controlLocation: {
                            attribute: "common/controls",
                            injectable: "common/injectables",
                            model: "models",
                            service: "services",
                            repository: "repositories",
                            templatecontrol: "common/controls",
                            viewcontrol: "viewcontrols"
                        }
                    }
                }));

            readdirFunc = sandbox.stub(generator.fileUtils, 'readdir')
                .returns(Promise.resolve(''))
                .onFirstCall().returns(Promise.resolve([
                    'test'
                ]))
                .onSecondCall().returns(Promise.resolve([
                    'app'
                ]));

            statFunc = sandbox.stub(generator.fileUtils, 'stat')
                .returns(Promise.resolve({
                    isDirectory: function () {
                        return false;
                    }
                }));

            done();
        });

        afterEach(function (done) {
            sandbox.restore();
            done();
        });

        it('should generate a project template at the cwd', function (done) {
            generator.generate().then(function () {
                try {
                    expect(copyTemplateFunc).to.have.been.called;
                    expect(configFindFunc).to.have.been.called;
                    expect(mkdirFunc).to.have.been.called;
                    expect(getCliConfigFunc).to.have.been.called;
                    expect(statFunc).to.have.been.called;
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