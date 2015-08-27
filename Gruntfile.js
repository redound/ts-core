module.exports = function(grunt) {

    grunt.initConfig({

        project: {
            name: 'tscore'
        },

        // Watch for changing ts files
        watch: {
            dev: {
                files: ['src/**/*.ts', 'test/**/*.ts'],
                tasks: ['default']
            }
        },

        // For compiling our TypeScript/JavaScript
        ts: {
            compile: {
                src: ['src/**/*.ts', '!node_modules/**/*.ts'],
                out: 'build/<%= project.name %>.js',
                options: {
                    declaration: true
                }
            },
            compile_test: {
                src: ['test/**/*.ts', '!node_modules/**/*.spec.ts'],
                out: 'test/<%= project.name %>.spec.js',
                options: {
                    sourceMap: false
                }
            }
        },
        uglify: {
            tscore: {
                files: {
                    '<%= dir.dist_main %>/<%= project.name %>.min.js': ['build/<%= project.name %>.js']
                }
            }
        },

        karma: {
            unit: {
                configFile: 'karma.conf.js'
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

    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-tslint');
    grunt.loadNpmTasks('grunt-karma');
    grunt.loadNpmTasks('grunt-ts');

    grunt.registerTask('default', [
        'ts:compile',
        'ts:compile_test'
    ]);

    grunt.registerTask('build', [
        'default',
        'uglify:tscore'
    ]);

    grunt.registerTask('test', [
        'karma:unit'
    ]);
};