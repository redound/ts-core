module.exports = function(grunt) {

    grunt.initConfig({

        project: {
            name: 'tscore'
        },

        dir: {
            "source": "src",
            // location where TypeScript source files are located
            "source_main": "src/main",
            // location where TypeScript/Jasmine test files are located
            "source_test": "src/test",
            // location where all build files shall be placed
            "dist": "dist",
            // location to place (compiled) javascript files
            "dist_main": "dist/main",
            // location to place (compiles) javascript test files
            "dist_test": "dist/test",
        },

        // Watch for changing ts files
        watch: {
            dev: {
                files: ['<%= dir.source_main %>/**/*.ts', '<%= dir.source_test %>/**/*.ts'],
                tasks: ['default']
            }
        },

        // For compiling our TypeScript/JavaScript
        ts: {
            compile: {
                src: ['<%= dir.source_main %>/**/*.ts', '!node_modules/**/*.ts'],
                out: '<%= dir.dist_main %>/<%= project.name %>.js',
                options: {
                    declaration: true,
                },
            },
            compile_tests: {
                src: ['<%= dir.source_test %>/**/*.ts', '!node_modules/**/*.ts'],
                out: '<%= dir.dist_test %>/<%= project.name %>.js',
                options: {
                    declaration: true,
                },
            }
        },
        uglify: {
            tscore: {
                files: {
                    '<%= dir.dist_main %>/<%= project.name %>.min.js': ['<%= dir.dist_main %>/<%= project.name %>.js']
                }
            }
        },

        testem: {
            unit: {
                options: {
                    framework: 'jasmine2',
                    launch_in_dev: ['PhantomJS'],
                    //before_tests: 'grunt jshint',
                    serve_files: [
                        'node_modules/underscore/underscore.js',
                        'node_modules/sinon/pkg/sinon.js',
                        '<%= dir.dist_main %>/**/*.js',
                        '<%= dir.dist_test %>/**/*.js',
                    ],
                    watch_files: [
                        '<%= dir.dist_main %>/**/*.js',
                        '<%= dir.dist_test %>/**/*.js',
                    ]
                }
            }
        },

        tslint: {

            options: {
                configuration: grunt.file.readJSON('./tslint.json')
            },

            dev: {
                src: ['src/**/*.ts']
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-testem');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-tslint');
    grunt.loadNpmTasks('grunt-ts');

    grunt.registerTask('default', [
        'ts:compile',
        'ts:compile_tests'
    ]);

    grunt.registerTask('build', [
        'default',
        'uglify:tscore'
    ]);

    grunt.registerTask('test', [
        'testem:run:unit'
    ]);
};