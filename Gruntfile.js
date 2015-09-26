module.exports = function(grunt) {

    grunt.initConfig({

        // For compiling our TypeScript/JavaScript
        ts: {
            build: {
                src: ['src/TSCore/**/*.ts', '!node_modules/**/*.ts'],
                out: 'build/tscore.js',
                reference: 'src/tscore.r.ts',
                options: {
                    fast: 'never',
                    declaration: true,
                    //noResolve: true
                }
            },
            test: {
                src: ['test/**/*.ts', '!node_modules/**/*.spec.ts'],
                out: 'test/tscore.spec.js',
                options: {
                    fast: 'never',
                    sourceMap: false
                }
            }
        },

        uglify: {
            build: {
                files: {
                    'build/tscore.min.js': ['build/tscore.js']
                }
            }
        },

        karma: {
            dev: {
                configFile: 'karma.conf.js'
            },
            build: {
                configFile: 'karma.conf.js',
                singleRun: true
            }
        },

        release: {
            options: {
                additionalFiles: ['bower.json'],
                indentation: '    ', // four spaces
                beforeRelease: [
                    'build'
                ],
            }
        }
    });

    grunt.loadNpmTasks('grunt-release');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-karma');
    grunt.loadNpmTasks('grunt-ts');

    /** Dirty-hack **/
    grunt.registerTask('stripref', function() {


        var contents = grunt.file.read('./build/tscore.d.ts');
        contents = contents.replace("/// <reference path=\"../typings/tsd.d.ts\" />\n", "");
        grunt.file.write('./build/tscore.d.ts', contents);
    });

    /** Development **/
    grunt.registerTask('compile', [
        'ts:build',
        'ts:test',
        'stripref'
    ]);

    grunt.registerTask('test', [
        'compile',
        'karma:dev'
    ]);

    /** Release **/
    grunt.registerTask('build', [
        'compile',
        'karma:build',
        'uglify:build',
    ]);
};