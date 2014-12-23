
var chai = require('chai')
    , sinon = require('sinon')
    , sinonChai = require('sinon-chai')
    , expect = chai.expect
    , globals = require('../platypi-cli/globals');

chai.use(sinonChai);

describe('globals', function() {
    var sandbox, msgLabel, msgLog; 

    before(function(done) {
       sandbox = sinon.sandbox.create();
       
       msgLog = sandbox.stub(globals.console, 'log', function(message) {
           return message;
       });

       msgLabel = sandbox.stub(globals.console, 'label', function(label) {
           return label;
       });

       done();
    });

    after(function(done) {
        sandbox.restore();
        done();
    });

    describe('identifyApplication()', function() {
        it('should output using msg.label and msg.log', function(done) {
            globals.identifyApplication();
            expect(msgLabel).to.have.been.calledWith('Platypi Command Line Interface');
            expect(msgLog).to.have.been.calledWith('Version ' + globals.package.version);
            done();
        });
    });
});
