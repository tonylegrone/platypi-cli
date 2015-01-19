var chai = require('chai')
    , path = require('path')
    , fs = require('fs')
    , sinon = require('sinon')
    , sinonChai = require('sinon-chai')
    , expect = chai.expect
    , Promise = require('es6-promise').Promise
    , CliConfig = require('../../../platypi-cli/config/cli/platypicli.config')
    , InjectableGenerator = require('../../../platypi-cli/generators/templates/injectable.template.generator')
    , ReferenceHandler = require('../../../platypi-cli/handlers/references.handler')
    , MainFileHandler = require('../../../platypi-cli/handlers/mainfile.handler')
    , globals = require('../../../platypi-cli/globals');

chai.use(sinonChai);

describe('Injectable Control template Generator', function () {
    describe('generate method, no extends', function () {
        var generator = new InjectableGenerator('test', 'test', '');

        var sandbox, mockProjectConfig;
        beforeEach(function (done) {
            sandbox = sinon.sandbox.create();

            // mock project config
            mockProjectConfig = {
                public: path.normalize('fake/public/dir'),
                save: function () {
                    return Promise.resolve('');
                },
                addControl: function () {
                    return;
                }
            };

            // stub methods

            sandbox.stub(CliConfig.config, 'getConfig', function () {
                return Promise.resolve({
                    templates: {
                        lastUpdated: new Date(2012, 01, 01),
                        controlLocation: {
                            injectable: path.normalize('fake/location')
                        },
                        controls: {
                            base: {
                                injectable: path.normalize('./fake/injectable/location')
                            }
                        },
                        baseLocation: path.normalize('fake/base/location')
                    }
                });
            });

            sandbox.stub(generator._provider, 'update', function () {
                return Promise.resolve(path.normalize('fake/template/location'));
            });

            sandbox.stub(fs, 'readdir', function (dirPath, callback) {
                if (dirPath === path.normalize("fake\\base\\location\\fake\\injectable\\location\\topLevel")) {
                    callback(null, ['injectable.mock.ts', 'injectable.mock.d.ts']);
                } else if (dirPath === path.normalize('fake/public/dir/fake/location/test')) {
                    callback(null, ['topLevel']);
                } else {
                    callback(null, ['injectable.mock.ts', 'injectable.mock.d.ts']);
                }
            });

            sandbox.stub(fs, 'mkdir', function (newPath, mode, callback) {
                callback(null);
            });

            sandbox.stub(fs, 'stat', function (statPath, callback) {
                callback(null, {
                    isDirectory: function () {
                        if (path.normalize(statPath) === path.normalize("fake\\base\\location\\fake\\injectable\\location\\topLevel")) {
                            return true;
                        } else {
                            return false;
                        }
                    }
                });
            });

            sandbox.stub(fs, 'readFile', function (filename, options, callback) {
                callback(null, '%name%');
            });

            sandbox.stub(fs, 'writeFile', function (filename, data, callback) {
                callback(null);
            });

            sandbox.stub(ReferenceHandler, 'addReference', function (projectConfig, newPath) {
                return Promise.resolve({ n: newPath, p: projectConfig });
            });

            sandbox.stub(MainFileHandler, 'addControl', function (projectConfig, newPath) {
                return Promise.resolve({ n: newPath, p: projectConfig });
            });

            // suppress any logging from module
            sandbox.stub(globals.console, 'log', function () {
                return;
            });

            done();
        });

        afterEach(function (done) {
            sandbox.restore();
            done();
        });

        it('should copy the template to the desired location.', function (done) {
            generator.generate(mockProjectConfig).then(function (newPath) {
                // add checks for each stub that should be called/not called
                expect(newPath).to.equal(path.normalize('fake/public/dir/fake/location/test'));
                done();
            }, function (err) {
                done(err);
            });
        });

    });
});