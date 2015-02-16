var chai = require('chai')
    , sinon = require('sinon')
    , sinonChai = require('sinon-chai')
    , expect = chai.expect
    , consolePrompt = require('prompt')
    , ConfigGenerator = require('../../platypi-cli/generators/platypiconfig.generator');

chai.use(sinonChai);

describe('Command Line Prompt Config Generator', function () {
    var sandbox, promptFunc;

    beforeEach(function(done){
        sandbox = sinon.sandbox.create();

        promptFunc = sandbox.stub(consolePrompt, 'get', function (schema, callback) {
            callback(null, {
                name: 'Test',
                description: 'Test',
                author: 'Tester',
                version: '0.0.1'
            });
        });

        done();
    });

    afterEach(function(done){
        sandbox.restore();
        done();
    });

    it('should return a config based on prompts', function (done) {
        ConfigGenerator().then(function (config) {
            try {
                expect(promptFunc).to.have.been.called;
                expect(config).to.be.an.object;
                expect(config.version).to.equal('0.0.1');
                expect(config.type).to.equal('mobile');
                done();
            } catch (e) {
                done(e);
            }
        }, function (err) {
            done(err);
        });
    });
});