var chai = require('chai')
    , fs = require('fs')
    , sinon = require('sinon')
    , sinonChai = require('sinon-chai')
    , expect = chai.expect
    , mainFileHandler = require('../../platypi-cli/handlers/mainfile.handler');

chai.use(sinonChai);

describe('Main File Handler', function() {
    it('should be an object', function(done) {
        expect(mainFileHandler).to.be.an.object;
        done();
    });

    it('constructor should return an instance', function(done) {
        var newHandler = new mainFileHandler();
        expect(newHandler).to.be.an.object;
        done();
    });

    describe('addControl Static Method', function() {
        var sandbox
            , readDirFunc
            , readFileFunc
            , writeFileFunc;

        beforeEach(function(done) {
            sandbox = sinon.sandbox.create();

            readDirFunc = sandbox.stub(fs, 'readdir', function(templatePath, callback) {
                if (templatePath === 'test') {
                    callback(null, ['blah.ts']);
                } else {
                    callback(null, []);
                }
            });

            readFileFunc = sandbox.stub(fs, 'readFile', function(filename, options, callback) {
                if (filename === 'main2.ts') {
                    callback(null, '// viewcontrols');
                } else {
                    callback(null, 'test');
                }
            });

            writeFileFunc = sandbox.stub(fs, 'writeFile', function(fillename, data, callback) {
                callback(null);
            });
            
            done();
        });

        it('should append to the main.ts file', function(done) {
            var projectConfig = {
                mainFile: 'main.ts'
            };
            mainFileHandler.addControl('test', projectConfig).then(function() {
                expect(readDirFunc).to.have.been.called;
                expect(readFileFunc).to.have.been.called;
                expect(writeFileFunc).to.have.been.called;
                done();
            });
        });


        it('should append to the specific line in main.ts file', function(done) {
            var projectConfig = {
                mainFile: 'main2.ts'
            };
            mainFileHandler.addControl('test', projectConfig, 'viewcontrol').then(function() {
                expect(readDirFunc).to.have.been.called;
                expect(readFileFunc).to.have.been.called;
                expect(writeFileFunc).to.have.been.called;
                done();
            });
        });


        it('should append to the end of main.ts file if control is specified but category not found', function(done) {
            var projectConfig = {
                mainFile: 'main2.ts'
            };
            mainFileHandler.addControl('test', projectConfig, 'model').then(function() {
                expect(readDirFunc).to.have.been.called;
                expect(readFileFunc).to.have.been.called;
                expect(writeFileFunc).to.have.been.called;
                done();
            });
        });

        it('should not append if no TS files in template', function(done) {
            var projectConfig = {
                mainFile: 'main.ts'
            };
            mainFileHandler.addControl('test3', projectConfig).then(function() {
                expect(readDirFunc).to.have.been.called;
                expect(readFileFunc).not.to.have.been.called;
                expect(writeFileFunc).not.to.have.been.called;
                done();
            });
        });

        afterEach(function(done) {
            sandbox.restore();
            done();
        });
    });
});
