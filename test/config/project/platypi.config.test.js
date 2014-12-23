var chai = require('chai')
    , fs = require('fs')
    , sinon = require('sinon')
    , sinonChai = require('sinon-chai')
    , expect = chai.expect
    , ProjectConfig = require('../../../platypi-cli/config/project/platypi.config');

chai.use(sinonChai);

var configInstance;

describe('Platypi Config Implementation', function() {
    configInstance = new ProjectConfig();

    it('should be an object', function(done) {
        configInstance.should.be.an.object;
        done();
    });

    it('should use getter and setter for name', function(done) {
        configInstance.name = 'test';
        configInstance.name.should.equal('test');
        done();
    });

    describe('save method', function() {
        var sandbox, writeFileFunc;
        beforeEach(function(done) {
            sandbox = sinon.sandbox.create();

            writeFileFunc = sandbox.stub(fs, 'writeFile', function(filename, data, callback) {
                callback(null);
            });

            done();
        });

        afterEach(function(done) {
            sandbox.restore();
            done();
        });


        it('should save the file at the default path', function(done) {
            configInstance.save().then(function() {
                expect(writeFileFunc.args[0][0]).to.equal('');
                done();
            });
        });

        it('should save the file at the desired path', function(done) {
            configInstance.save('test.json').then(function() {
                expect(writeFileFunc.args[0][0]).to.equal('test.json');
                done();
            });
        });
    });

    describe('CreateNewMobileConfig Static Method', function() {
        it('should return a new mobile config', function(done) {
            var mobileConfig = ProjectConfig.CreateNewMobileConfig();
            expect(mobileConfig).to.be.an.object;
            expect(mobileConfig.type).to.equal('mobile');
            done();
        });
    });


    describe('CreateNewWebConfig Static Method', function() {
        it('should return a new web config', function(done) {
            var webConfig = ProjectConfig.CreateNewWebConfig();
            expect(webConfig).to.be.an.object;
            expect(webConfig.type).to.equal('web');
            done();
        });
    });

    describe('loadFromFile Static Method', function() {
        var sandbox, readFileFunc;
        beforeEach(function(done) {
            sandbox = sinon.sandbox.create();

            readFileFunc = sandbox.stub(fs, 'readFile', function(filepath, options, callback) {
                if (filepath === 'test.json') {
                    var rtnValue = {
                        name: 'Test Project',
                        type: 'mobile',
                        author: 'Test Author'
                    };
                    callback(null, JSON.stringify(rtnValue));
                } else {
                    callback('Not Found');
                }
            });
            done();
        });

        afterEach(function(done) {
            sandbox.restore();
            done();
        });
        
        it('should return a new config from values in a json file', function(done) {
            ProjectConfig.loadFromFile('test.json').then(function(newConfig) {
                expect(newConfig).to.be.an.object;
                expect(newConfig.type).to.equal('mobile');
                expect(newConfig.author).to.equal('Test Author');
                expect(newConfig.name).to.equal('Test Project');
                done();
            });
        });


        it('should throw an error if not found', function(done) {
            ProjectConfig.loadFromFile('notthere').then(null,function(err) {
                expect(err).to.equal('Not Found');
                done();
            });
        });
    });

});
