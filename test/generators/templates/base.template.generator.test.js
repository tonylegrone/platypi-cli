var chai = require('chai')
    , fs = require('fs')
    , sinon = require('sinon')
    , sinonChai = require('sinon-chai')
    , expect = chai.expect
    , Promise = require('es6-promise').Promise
    , BaseGenerator = require('../../../platypi-cli/generators/templates/base.template.generator')
    , ReferenceHandler = require('../../../platypi-cli/handlers/references.handler')
    , MainFileHandler = require('../../../platypi-cli/handlers/mainfile.handler')
    , globals = require('../../../platypi-cli/globals');

chai.use(sinonChai); 

describe('Base Template Generator', function() {
    var environmentVariables = []
        , nameVar = {
            name: 'name',
            value: 'test'
        };

    environmentVariables.push(nameVar);

    var generator = new BaseGenerator('model', 'base', environmentVariables);

    describe('generate method', function() {
        var sandbox, mockProjectConfig;
        beforeEach(function(done) {
            sandbox = sinon.sandbox.create();

            // mock project config
            mockProjectConfig = {
                public: 'fake/public/dir',
                save: function() {
                    return Promise.resolve('');
                },
                addControl: function() {
                    return;
                }
            };

            // stub methods

            sandbox.stub(generator._config, 'getConfig', function() {
                return Promise.resolve({
                    templates: {
                        lastUpdated: new Date(2012, 01, 01),
                        controlLocation: {
                            model: 'fake/location'
                        },
                        controls: {
                            base: {
                                model: './fake/model/location'
                            }
                        },
                        baseLocation:'fake/base/location'
                    }
                });
            });

            sandbox.stub(generator._provider, 'update', function() {
                return Promise.resolve('fake/template/location');
            });

            sandbox.stub(fs, 'readdir', function(dirPath, callback) {
                callback(null, ['model.mock.ts', 'model.mock.d.ts']);
            });

            sandbox.stub(fs, 'mkdir', function(newPath, mode, callback) {
                callback(null);
            });

            sandbox.stub(fs, 'stat', function(statPath, callback) {
                callback(null, {
                    isDirectory: function() {
                        return false;
                    }
                });
            });

            sandbox.stub(fs, 'readFile', function(filename, options, callback) {
                callback(null, '%name%');
            });

            sandbox.stub(fs, 'writeFile', function(filename, data, callback) {
                callback(null);
            });

            sandbox.stub(ReferenceHandler, 'addReference', function(projectConfig, newPath) {
                return Promise.resolve('');
            });

            sandbox.stub(MainFileHandler, 'addControl', function(projectConfig, newPath) {
                return Promise.resolve('');
            });

            // suppress any logging from module
            sandbox.stub(globals.console, 'log', function() {
                return;
            });

            done();
        });

        afterEach(function(done) {
            sandbox.restore();
            done();
        });

        it('should copy the template to the desired location.', function(done) {
            generator.generate(mockProjectConfig).then(function(newPath) {
                // add checks for each stub that should be called/not called
                expect(newPath).to.equal('fake/public/dir/fake/location/test');
                done();
            });
        });
        
    });
});
