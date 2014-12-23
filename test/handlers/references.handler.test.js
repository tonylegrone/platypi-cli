var chai = require('chai')
    , fs = require('fs')
    , fileutils = require('../../platypi-cli/utils/file.utils')
    , sinon = require('sinon')
    , sinonChai = require('sinon-chai')
    , expect = chai.expect
    , referencesFileHandler = require('../../platypi-cli/handlers/references.handler');

chai.use(sinonChai);

describe('References File Handler', function() {
    it('should be an object', function(done) {
        expect(referencesFileHandler).to.be.an.object;
        done();
    });

    it('constructor should return an instance', function(done) {
        var newHandler = new referencesFileHandler();
        expect(newHandler).to.be.an.object;
        done();
    });

    describe('addReference Static Method', function() {
        var sandbox
            , readDirFunc
            , readFileFunc
            , writeFileFunc
            , appendFileAtFunc
            , position = -1;

        beforeEach(function(done) {
            sandbox = sinon.sandbox.create();

            readDirFunc = sandbox.stub(fs, 'readdir', function(templatePath, callback) {
                if (templatePath === 'test') {
                    callback(null, ['blah.ts', 'blah.d.ts']);
                } else {
                    callback(null, []);
                }
            });

            readFileFunc = sandbox.stub(fs, 'readFile', function(filename, options, callback) {
                if (filename === '_references2.d.ts') {
                    callback(null, '// models');
                } else {
                    callback(null, 'test');
                }
            });

            writeFileFunc = sandbox.stub(fs, 'writeFile', function(fillename, data, callback) {
                callback(null);
            });

            appendFileAtFunc = sandbox.spy(fileutils, 'appendFileAt');

            
            done();
        });

        afterEach(function(done) {
            sandbox.restore();
            done();
        });

        it('should append interface to the end of references file', function(done) {
            referencesFileHandler.addReference('_reference.d.ts', 'test').then(function() {
                expect(readDirFunc).to.have.been.called;
                expect(readFileFunc).to.have.been.called;
                expect(writeFileFunc).to.have.been.called;
                done();
            });
        });

        it('should append interface to the control category in the references file', function(done) {
            referencesFileHandler.addReference('_references2.d.ts', 'test', 'model').then(function() {
                expect(readDirFunc).to.have.been.called;
                expect(readFileFunc).to.have.been.called;
                expect(appendFileAtFunc.args[0][1]).to.be.above(-1);
                expect(writeFileFunc).to.have.been.called;
                done();
            });
        });


        it('should append interface to the end of the references file because the control category was not found', function(done) {
            referencesFileHandler.addReference('_reference.d.ts', 'test', 'model').then(function() {
                expect(readDirFunc).to.have.been.called;
                expect(readFileFunc).to.have.been.called;
                expect(writeFileFunc).to.have.been.called;
                done();
            });
        });

        it('should not append since no interface was found', function(done) {
            referencesFileHandler.addReference('_reference.d.ts', '/').then(function() {
                expect(readDirFunc).to.have.been.called;
                expect(readFileFunc).not.to.have.been.called;
                expect(writeFileFunc).not.to.have.been.called;
                done();
            });
        });

    });
});
