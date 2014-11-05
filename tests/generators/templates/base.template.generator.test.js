var should = require('should') // jshint ignore:line
    , BaseGenerator = require('../../../platypi-cli/generators/templates/base.template.generator')
    , fs = require('fs')
    , path = require('path')
    , utils = require('../../../platypi-cli/utils/directory.utils.js');

describe('Base Template Generator', function () {
    var environmentVariables = []
        , nameVar = {
            name: 'name',
            value: 'test'
        };

    environmentVariables.push(nameVar);

    var generator = new BaseGenerator('model', 'base', environmentVariables);

    it('should be an object', function () {
        should.exist(generator);
        generator.should.be.an.Object;
    });

    describe('_handleFileName', function () {
        it('should generate test.model.ts', function () {
            generator.instanceName = 'test';
            var name = generator._handleFileName('model.model.ts');
            name.should.equal('test.model.ts');
        });

        it('should generate iconfig.model.ts', function () {
            generator.instanceName = 'config';
            var name = generator._handleFileName('imodel.model.ts');
            name.should.equal('iconfig.model.ts');
        });
    });

    describe('__fillEnvironmentVariables', function () {
        it('should replace placeholders with value', function () {
            var data = 'class %name%Model { }';
            data = generator.__fillEnvironmentVariables(data);

            data.should.equal('class testModel { }');
        });
    });

    describe('_copyTemplateTo', function () {
        generator.instanceName = 'test';
        var error = ''
            , output = [];

        before(function (done) {
            generator.location = path.join(__dirname, 'testtemplate/viewcontrol');
            fs.mkdir(path.join(__dirname, 'testoutput'), function (err) {
                if (err) {
                    if (err.code !== 'EEXIST') {
                        throw err;
                    }
                }
                generator._copyTemplateTo(path.join(__dirname, './testoutput')).then(function (newFiles) {
                    output = newFiles;
                    done();
                }, function (err) {
                    error = err;
                    done();
                });
            });
        });

        it('should copy control template files', function () {
            error.should.equal('');
            output.length.should.be.greaterThan(0);
        });
    });

    describe('_copyTemplateTo', function () {
        var projectTemplateGen = new BaseGenerator('project', 'web', environmentVariables);
        projectTemplateGen.instanceName = 'test';
        var error = ''
            , output = [];

        before(function (done) {
            projectTemplateGen.location = path.join(__dirname, 'testtemplate/web');
            fs.mkdir(path.join(__dirname, 'testoutput'), function (err) {
                if (err) {
                    if (err.code !== 'EEXIST') {
                        throw err;
                    }
                }
                projectTemplateGen._copyTemplateTo(path.join(__dirname, './testoutput')).then(function (newFiles) {
                    output = newFiles;
                    done();
                }, function (err) {
                    error = err;
                    done();
                });
            });
        });

        it('should copy project template files', function () {
            error.should.equal('');
            output.length.should.be.greaterThan(0);
        });

        after(function () {
            utils.deleteDirectoryRecursive(path.join(__dirname, './testoutput'));
        });
    });

});
