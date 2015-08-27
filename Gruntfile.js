module.exports = function(grunt) {

    grunt.initConfig({

        // For compiling our TypeScript/JavaScript
        ts: {
            compile: {
                src: ['src/tscore.r.ts', 'src/**/*.ts', '!node_modules/**/*.ts'],
                out: 'build/tscore.js',
                reference: 'src/tscore.r.ts',
                options: {
                    declaration: true
                }
            },
            compile_test: {
                src: ['test/**/*.ts', '!node_modules/**/*.spec.ts'],
                out: 'test/tscore.spec.js',
                options: {
                    sourceMap: false
                }
            }
        },
        uglify: {
            tscore: {
                files: {
                    'build/tscore.min.js': ['build/tscore.js']
                }
            }
        },

        karma: {
            unit: {
                configFile: 'karma.conf.js'
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-uglify');
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

    grunt.registerTask('default', 'compile');
};