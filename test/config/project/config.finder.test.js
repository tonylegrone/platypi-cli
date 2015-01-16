var chai = require('chai')
    , path = require('path')
    , sinon = require('sinon')
    , sinonChai = require('sinon-chai')
    , expect = chai.expect
    , Promise = require('es6-promise').Promise
    , utils = require('../../../platypi-cli/utils/directory.utils')
    , fileutils = require('../../../platypi-cli/utils/file.utils')
    , ProjectConfig = require('../../../platypi-cli/config/project/platypi.config')
    , ConfigFinder = require('../../../platypi-cli/config/project/config.finder');

chai.use(sinonChai);

describe('Project Config Finder', function () {
    it('should return an object', function (done) {
        expect(new ConfigFinder()).to.be.an.object;
        done();
    });

    describe('findConfig static method', function () {
        var sandbox,
            readFile,
            upOneLevel;

        beforeEach(function (done) {
            sandbox = sinon.sandbox.create();

            readFile = sandbox.stub(fileutils, 'readFile', function (filepath, props) {
                if (filepath === path.join('path1', 'package.json')) {
                    return Promise.resolve(JSON.stringify({
                        test: 'test',
                        props: props,
                        platypi: {
                            type: "web"
                        }
                    }));
                } else if (filepath === path.join('path2', 'package.json')) {
                    return Promise.resolve(JSON.stringify({
                        test: 'test'
                    }));
                } else if (filepath === path.join('good', 'platypi.json')) {
                    return Promise.resolve(JSON.stringify({
                        type: 'web'
                    }));
                } else if (filepath === path.join('bad', 'platypi.json')) {
                    return Promise.resolve(JSON.stringify({
                        type: 'badvalue'
                    }));
                }
                return Promise.reject('not found');
            });

            upOneLevel = sandbox.stub(utils, 'upOneLevel', function (currentDirectory) {
                console.log(currentDirectory);
                if (currentDirectory === 'path') {
                    return 'path1';
                } else {
                    return path.resolve('/'); // return root
                }
            });

            var validatorStub = sandbox.stub(ProjectConfig, 'isValid');
            validatorStub.returns(true);
            

            validatorStub.withArgs({ type: "badvalue" }).returns(false);

            sandbox.stub(ProjectConfig, 'loadFromObject', function (config) {
                return Promise.resolve(config);
            });

            done();
        });

        afterEach(function (done) {
            sandbox.restore();
            done();
        });

        it('should find the project config in package.json ', function (done) {
            ConfigFinder.findConfig('package.json', 'path').then(function (config) {
                try {
                    expect(config).to.be.an.object;
                    expect(config.type).to.equal('web');
                    done();
                } catch (e) {
                    done(e);
                }
            }, function (err) {
                done(err);
            });
        });

        it('should reject the promise with an error message', function (done) {
            ConfigFinder.findConfig('platypi.json', 'path3').then(function (config) {
                done(config);
            }, function (err) {
                try {
                    expect(err).to.equal('A valid platypi config file was not found.');
                    done();
                } catch (e) {
                    done(e);
                }
            });
        });

        it('should recursively look for platypi.json when package.json does not contain project config', function (done) {
            ConfigFinder.findConfig('package.json', 'path2').then(function (config) {
                done(config);
            }, function (err) {
                try {
                    expect(err).to.equal('A valid platypi config file was not found.');
                    done();
                } catch (e) {
                    done(e);
                }
            });
        });

        it('should find config values in platypi.json', function (done) {
            ConfigFinder.findConfig('platypi.json', 'good').then(function (config) {
                expect(config).to.be.an.object;
                expect(config.type).to.equal('web');
                done();
            }, function (err) {
                done(err);
            });
        });

        it('should find an invalid config file', function (done) {
            ConfigFinder.findConfig('platypi.json', 'bad').then(function (config) {
                done(config);
            }, function (err) {
                expect(err).to.equal('A valid platypi config file was not found.');
                done();
            });
        });

        it('should fail to find a config using default values', function (done) {
            ConfigFinder.findConfig().then(function (config) {
                done(config);
            }, function (err) {
                expect(err).to.equal('A valid platypi config file was not found.');
                done();
            });
        });

    });
});