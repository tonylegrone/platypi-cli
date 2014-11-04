// You can use the DEBUG variable to conditionally do tasks such as minification.
var DEBUG = true,
    path = require('path');

module.exports = function (grunt) {
    var clientFiles = [
        './public/*.ts',
        './public/**/*.ts'
    ],
       tsLintIgnores = [
           '!./public/typings/**',
           '!./public/lib/**'
       ];

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        browserify: {
            dist: {
                files: {
                    './public/app.js': './public/main.js'
                },
                options: {
                    commondir: true,
                    browserifyOptions: {
                        debug: DEBUG
                    },
                    transform: ['deamdify']
                }
            }
        },
        clean: {
            options: {
                force: true
            },
            bundle: [
                './public/app.js',
                './public/app.js.map',
                './public/style.css',
                './public/style.css.map'
            ]
        },
        concurrent: {
            options: {
                logConcurrentOutput: true
            },
            build: {
                tasks: [
                    'typescript:client',
                    'less'
                ]
            },
            bundle: {
                tasks: [
                    'cssmin',
                    'bundle'
                ]
            },
            install: {
                tasks: [
                    'tsd',
                    'bower'
                ]
            },
            run: {
                tasks: [
                    'connect',
                    'watch'
                ]
            }
        },
        copy: {
            map: {
                src: './public/app.js.map',
                dest: './public/app.js.map',
                options: {
                    // Fixes the sourcemap to point to the correct directory
                    process: function (content) {
                        var regex = new RegExp(path.resolve(__dirname, 'public').replace(/\\/g, '/'), 'g');
                        return content.replace(regex, '.');
                    }
                }
            }
        },
        cssmin: {
            combine: {
                options: {
                    keepSpecialComments: 0,
                    target: 'public/style.css'
                },
                files: {
                    // Add files (e.g. bootstrap) in here to combine them into 1 output css file.
                    './public/style.css': [
                        './public/common/css/main.css'
                    ]
                }
            }
        },
        exorcise: {
            bundle: {
                options: {},
                files: {
                    './public/app.js.map': ['./public/app.js']
                }
            }
        },
        less: {
            main: {
                options: {
                    compress: true,
                    relativeUrls: true,
                    sourceMap: DEBUG
                },
                files: {
                    'public/style.css': 'public/common/css/main.less'
                }
            }
        },
        shell: {
            bower: {
                command: path.normalize('./node_modules/.bin/bower') + ' install'
            },
            tsd: {
                command: [
                    path.normalize('./node_modules/.bin/tsd') + ' update -so --config tsd.public.json'
                ].join(' && ')
            }
        },
        tslint: {
            options: {
                configuration: grunt.file.readJSON('tslint.json')
            },
            files: {
                src: clientFiles.concat(tsLintIgnores)
            }
        },
        typescript: {
            options: {
                module: 'commonjs',
                target: 'es5'
            },
            client: {
                src: clientFiles
            }
        },
        uglify: {
            options: {
                sourceMap: false,
                mangle: true
            },
            bundle: {
                files: {
                    './public/app.js': [
                        './public/app.js'
                    ]
                }
            }
        },
        watch: {
            client: {
                files: clientFiles,
                tasks: ['tslint', 'typescript:client']
            },
            less: {
                files: ['./public/**/*.less'],
                tasks: ['less', 'cssmin']
            },
            browserify: {
                files: ['./public/**/*.js'],
                tasks: ['bundle']
            }
        }
    });

    /// Load tasks
    grunt.loadNpmTasks('grunt-browserify');
    grunt.loadNpmTasks('grunt-concurrent');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-exorcise');
    grunt.loadNpmTasks('grunt-shell');
    grunt.loadNpmTasks('grunt-tslint');
    grunt.loadNpmTasks('grunt-typescript');


    /// Register tasks

    // Bundles the JS using browserify, also uglifies if we aren't debugging
    grunt.registerTask('bundle', ['browserify'].concat(DEBUG ? ['exorcise', 'copy:map'] : ['uglify']));

    // Concurrently compiles all the typescript/less, then bundles the JS with browserify
    grunt.registerTask('make', ['clean:bundle', 'concurrent:build', 'concurrent:bundle']);

    // Runs TSD
    grunt.registerTask('tsd', ['shell:tsd']);

    grunt.registerTask('bower', ['shell:bower']);

    // This task is where you can run anything you would need to install in order to have everything work
    // such as TSD/Bower
    grunt.registerTask('install', ['concurrent:install']);

    /// Default task
    grunt.registerTask('default', ['make', 'concurrent:run']);
};
