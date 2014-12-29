var chai = require('chai')
    , fs = require('fs')
    , sinon = require('sinon')
    , sinonChai = require('sinon-chai')
    , expect = chai.expect
    , Promise = require('es6-promise').Promise
    , TemplateHelper = require('../../platypi-cli/helpers/template.helper')
    , ZipUtil = require('../../platypi-cli/utils/zip/zip.util')
    , package = require('../../package.json');

chai.use(sinonChai); 

// Dummy function to return a fake service obj
var MockService = (function() {
    function MockService() {
    }

    MockService.prototype.getRelease = function(version, filepath) {
        return Promise.resolve(filepath);
    };

    return MockService;
})();

// Tests

describe('Template Helper', function() {
    var helper = new TemplateHelper(MockService);

    describe('__makeCacheDir method', function() {
        var sandbox, mkdirFunc; 
        beforeEach(function(done) {
            sandbox = sinon.sandbox.create();

            mkdirFunc = sandbox.stub(fs, 'mkdir', function(folder, mode, callback) {
                if (folder === 'folder/doesnt/exist/cache') {
                    callback(null);
                } else if (folder === 'folder/already/exists/cache') {
                    callback({ code : 'EEXIST' });
                } else {
                    callback({ code : 'OTHERERROR' });
                }
            });
            
            done();
        });

        afterEach(function(done) {
            sandbox.restore();
            done();
        });

        it('should return an error since something went wrong', function(done) {
            helper.__makeCacheDir('cause/an/error').then(function(cacheDir) {
                try {
                    expect(cacheDir).to.not.exist;
                    done();
                } catch (e) {
                    done(e);
                }
            }, function(err) {
                try {
                    expect(err).to.be.an.object;
                    expect(err.code).to.be.an.object;
                    done();
                } catch(e) {
                    done(e);
                }
            });
        });

        it('should return the cachefolder that exists', function(done) {
            helper.__makeCacheDir('folder/already/exists').then(function(cacheFolder) {
                try {
                    expect(cacheFolder).to.equal('folder/already/exists/cache');
                    done();
                } catch(e) {
                    done(e);
                }
            });
        });

        it('should create a cacheFolder', function(done) {
            helper.__makeCacheDir('folder/doesnt/exist').then(function(cacheFolder) {
                try {
                    expect(cacheFolder).to.equal('folder/doesnt/exist/cache');
                    done();
                } catch(e) {
                    done(e);
                }
            });
        });
    });

    describe('__makeArchiveCacheDir method', function() {
        var sandbox, mkdirFunc; 
        beforeEach(function(done) {
            sandbox = sinon.sandbox.create();

            mkdirFunc = sandbox.stub(fs, 'mkdir', function(folder, mode, callback) {
                if (folder === 'folder/doesnt/exist/archives/') {
                    callback(null);
                } else if (folder === 'folder/already/exists/archives/') {
                    callback({ code : 'EEXIST' });
                } else {
                    callback({ code : 'OTHERERROR' });
                }
            });
            
            done();
        });

        afterEach(function(done) {
            sandbox.restore();
            done();
        });

        it('should return an error since something went wrong', function(done) {
            helper.__makeArchiveCacheDir('cause/an/error').then(function(archiveDir) {
                try {
                    expect(archiveDir).to.not.exist;
                    done();
                } catch (e) {
                    done(e);
                }
            }, function(err) {
                try {
                    expect(err).to.be.an.object;
                    expect(err.code).to.be.an.object;
                    done();
                } catch(e) {
                    done(e);
                }
            });
        });

        it('should return the archive folder that exists', function(done) {
            helper.__makeArchiveCacheDir('folder/already/exists').then(function(archiveDir) {
                try {
                    expect(archiveDir).to.equal('folder/already/exists/archives/');
                    done();
                } catch(e) {
                    done(e);
                }
            });
        });

        it('should create a archive folder', function(done) {
            helper.__makeArchiveCacheDir('folder/doesnt/exist').then(function(archiveDir) {
                try {
                    expect(archiveDir).to.equal('folder/doesnt/exist/archives/');
                    done();
                } catch(e) {
                    done(e);
                }
            });
        });
    });

    describe('updateTemplates function', function() {
        var sandbox, mkdirFunc, getReleaseMethod, extractAllMethod, version;

        version = true;

        beforeEach(function(done) {
            // dummy functions
            var cliConfig = { setConfig: function() { } };

            sandbox = sinon.sandbox.create();

            mkdirFunc = sandbox.stub(fs, 'mkdir', function(dirpath, mode, callback) {
                callback(null);
            });

            sandbox.stub(package, 'version', function() {
                if (version) {
                    return '0.0.1';
                } else {
                    return undefined;
                }
            }());

            sandbox.stub(fs, 'readFile', function(filepath, options, callback) {
                var testConfig = {
                    templates: {
                        lastUpedate: new Date(),
                        baseLocation: ''
                    }
                };

                callback(null, JSON.stringify(testConfig));
            });

            sandbox.stub(ZipUtil.prototype, 'extractAll', function(extractDir, overwrite) {
                if (extractDir === 'test/dir/fail/cache/0.0.1') {
                    throw 'Error';
                }
                return extractDir;
            });


            sandbox.stub(cliConfig, 'setConfig', function(cfg) {
                return Promise.resolve(cfg);
            });

            done();
        });

        afterEach(function(done) {
            sandbox.restore();
            version = (version ? false : true);
            done();
        });

        it('should download, unzip, and update the cli config', function(done) {
            helper.updateTemplates('test/dir').then(function(extractDir) {
                try {
                    expect(extractDir).to.equal('test/dir/cache/0.0.1/platypi-cli-templates-0.0.1');
                    done();
                } catch (e) {
                    done(e);
                }
            }, function(err) {
                done(err);
            });
        });

        it('should download, unzip, and update the cli config defaulting to a version number', function(done) {
            helper.updateTemplates('test/dir').then(function(extractDir) {
                try {
                    expect(extractDir).to.equal('test/dir/cache/0.0.1/platypi-cli-templates-0.0.1');
                    done();
                } catch (e) {
                    done(e);
                }
            }, function(err) {
                done(err);
            });
        });


        it('should fail because there was an error unzipping', function(done) {
            helper.updateTemplates('test/dir/fail').then(function(extractDir) {
                done('should not return from here');
            }, function(err) {
                expect(err).to.equal('Error');
                done();
            });
        });

    });
});
