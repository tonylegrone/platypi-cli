﻿var chai = require('chai')
    , path = require('path')
    , fs = require('fs')
    , sinon = require('sinon')
    , sinonChai = require('sinon-chai')
    , expect = chai.expect
    , Promise = require('es6-promise').Promise
    , CliConfig = require('../../../platypi-cli/config/cli/platypicli.config')
    , TemplateGenerator = require('../../../platypi-cli/generators/templates/templatecontrol.template.generator')
    , ReferenceHandler = require('../../../platypi-cli/handlers/references.handler')
    , MainFileHandler = require('../../../platypi-cli/handlers/mainfile.handler')
    , Finder = require('../../../platypi-cli/config/project/config.finder')
    , globals = require('../../../platypi-cli/globals');

chai.use(sinonChai);

describe('Template Control template Generator', function () {
    describe('generate method, no extends', function () {
        var generator = new TemplateGenerator('test', 'test', '');

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
                },
                templatecontrols: [
                    {
                        name: 'base',
                        type: 'templatecontrol'
                    }
                ]
            };

            // stub methods

            sandbox.stub(CliConfig.config, 'getConfig', function () {
                return Promise.resolve({
                    templates: {
                        lastUpdated: new Date(2012, 01, 01),
                        controlLocation: {
                            templatecontrol: path.normalize('fake/location')
                        },
                        controls: {
                            base: {
                                templatecontrol: path.normalize('./fake/template/location')
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
                if (dirPath === path.normalize("fake\\base\\location\\fake\\template\\location\\topLevel")) {
                    callback(null, ['template.mock.ts', 'template.mock.d.ts']);
                } else if (dirPath === path.normalize('fake/public/dir/fake/location/test')) {
                    callback(null, ['topLevel']);
                } else {
                    callback(null, ['template.mock.ts', 'template.mock.d.ts']);
                }
            });

            sandbox.stub(fs, 'mkdir', function (newPath, mode, callback) {
                callback(null);
            });

            sandbox.stub(fs, 'stat', function (statPath, callback) {
                callback(null, {
                    isDirectory: function () {
                        if (path.normalize(statPath) === path.normalize("fake\\base\\location\\fake\\template\\location\\topLevel")) {
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

            sandbox.stub(Finder, 'findConfig', function () {
                return Promise.resolve(mockProjectConfig);
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