var should = require('should') // jshint ignore:line
    , path = require('path')
    , fs = require('fs')
    , util = require('util')
    , package = require('../../package.json')
    , TemplateHelper = require('../../platypi-cli/helpers/template.helper')
    , GithubService = require('../../platypi-cli/services/github/github.service')
    , directory = require('../../platypi-cli/utils/directory.utils');

describe('template helper', function () {
    var helper = new TemplateHelper(GithubService);

    it('should be an object', function () {
        helper.should.be.an.Object;
    });

    describe('package.json', function () {
        it('should be an object', function () {
            should.exist(package);
            package.should.be.an.Object;
        });

        it('should contain a version number', function () {
            should.exist(package.version);
        });
    });

    describe('__makeCache method', function () {
        var cachePath = '';
        before(function (done) {
            directory.appDataDir()
                .then(function (appDataPath) {
                    return helper.__makeCacheDir(appDataPath);
                })
                .then(function (cacheDir) {
                    cachePath = cacheDir;
                    done();
                }, function (err) {
                    throw err;
                });
        });

        it('should make the cache dir', function () {
            cachePath.should.not.equal('');
        });

    });

    describe('__makeArchiveCacheDir method', function () {
        var archiveCachePath = '';
        before(function (done) {
            directory.appDataDir()
                .then(function (appDataPath) {
                    return helper.__makeCacheDir(appDataPath);
                })
                .then(function (cacheDir) {
                    return helper.__makeArchiveCacheDir(cacheDir);
                }, function (err) {
                    throw err;
                })
                .then(function (archiveDir) {
                    archiveCachePath = archiveDir;
                    done();
                }, function (err) {
                    throw err;
                });
        });

        it('should make the cache dir', function () {
            archiveCachePath.should.not.equal('');
        });

    });

    describe('__downloadTemplates', function () {
        var templatePath = '';

        before(function (done) {
            directory.appDataDir()
                .then(function (appDir) {
                    return helper.__downloadTemplates(appDir);
                })
                .then(function (tmpPath) {
                    templatePath = tmpPath;
                    done();
                }, function (err) {
                    throw err;
                });
        });

        it('should download a template archive', function () {
            templatePath.should.not.equal('');
        });
        
    });

    describe('updateTemplates', function () {
        var extractedTemplatePath = ''
            , appDataDir = '';

        before(function (done) {
            directory.appDataDir()
                .then(function (appDir) {
                    appDataDir = appDir;
                    return helper.updateTemplates(appDir);
                })
                .then(function (tmpPath) {
                    extractedTemplatePath = tmpPath;
                    done();
                }, function (err) {
                    throw err;
                });
        });

        it('should download and extract the templates', function () {
            extractedTemplatePath.should.not.equal('');
        });

        it('should update the cli config file', function () {
            var cliConfigFile = path.normalize(util.format('%s/%s', appDataDir, 'cli.json'));

            fs.readFile(cliConfigFile, 'utf8', function (err, data) {
                should.not.exist(err);

                var config = JSON.parse(data);

                should.exist(config);

                config.version.should.exist;
            });
        });

    });
});
