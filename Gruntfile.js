var path = require('path');

module.exports = function (grunt) {
    var tsFiles = [
        './platypi-cli/*.ts',
        './platypi-cli/**/*.ts'
    ]
    , tests = [
        './tests/*.test.js',
        './tests/**/*.test.js'
    ]
    , lintIgnore = [
        '!./platypi-cli/*.d.ts',
        '!./platypi-cli/typings/**'
    ];

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json')
        , shell: {
            tsd: {
                command: path.normalize('./node_modules/.bin/tsd') + ' update -so --config tsd.json'
            }
        }
        , tslint: {
            options: {
                configuration: grunt.file.readJSON('tslint.json')
            }
            , default: {
                src: tsFiles.concat(lintIgnore)
            }
        }
        , jshint: {
            options: {
                jshintrc: 'jshint.json'
            }
            , all: ['Gruntfile.js'].concat(tests)
        }
        , typescript: {
            options: {
                module: 'commonjs',
                target: 'es5'
            },
            default: {
                src: tsFiles
            }
        }
        , mochaTest: {
            test: {
                src: tests
            }
        }
    });


    grunt.loadNpmTasks('grunt-shell');
    grunt.loadNpmTasks('grunt-tslint');
    grunt.loadNpmTasks('grunt-typescript');
    grunt.loadNpmTasks('grunt-mocha-test');
    grunt.loadNpmTasks('grunt-contrib-jshint');

    grunt.registerTask('lint', ['tslint','jshint']);

    grunt.registerTask('test', ['mochaTest']);

    grunt.registerTask('build', ['shell:tsd', 'lint', 'typescript', 'test']);

    grunt.registerTask('default', ['build']);

};
