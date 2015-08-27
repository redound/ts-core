module.exports = function(grunt) {

    grunt.initConfig({

        project: {
            name: 'tscore'
        },

        // Watch for changing ts files
        watch: {
            dev: {
                files: ['src/**/*.ts', 'test/**/*.ts'],
                tasks: ['compile']
            }
        },

        // For compiling our TypeScript/JavaScript
        ts: {
            compile: {
                src: ['src/tscore.r.ts', 'src/**/*.ts', '!node_modules/**/*.ts'],
                out: 'build/<%= project.name %>.js',
                reference: 'src/tscore.r.ts',
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
                    'build/<%= project.name %>.min.js': ['build/<%= project.name %>.js']
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

    grunt.registerTask('compile', [
        'ts:compile',
        'ts:compile_test'
    ]);

    grunt.registerTask('build', [
        'compile',
        'uglify:tscore'
    ]);

    grunt.registerTask('test', [
        'compile',
        'karma:unit'
    ]);

    grunt.registerTask('default', 'watch');
};