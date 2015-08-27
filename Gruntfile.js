var semver = require('semver');

module.exports = function(grunt) {

    grunt.initConfig({

        exec: {
            push_docs: "git subtree push --prefix docs origin gh-pages"
        },

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

        typedoc: {
            build: {
                options: {
                    module: 'commonjs',
                    out: './docs',
                    name: 'TSCore',
                    target: 'es5',
                    mode: 'file'
                },
                src: ['./src/**/*.ts']
            }
        },
        release: {
            options: {
                additionalFiles: ['bower.json'],
                indentation: '    ', // four spaces
                afterRelease: [
                    'exec:push_docs'
                ]
            }
        }
    });

    grunt.loadNpmTasks('grunt-release');
    grunt.loadNpmTasks('grunt-prompt');
    grunt.loadNpmTasks('grunt-bump');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-exec');
    grunt.loadNpmTasks('grunt-karma');
    grunt.loadNpmTasks('grunt-ts');
    grunt.loadNpmTasks('grunt-typedoc');

    /** Development **/
    grunt.registerTask('compile', [
        'ts:compile',
        'ts:compile_test'
    ]);

    grunt.registerTask('test', [
        'compile',
        'karma:dev'
    ]);

    grunt.registerTask('docs', [
        'compile',
        'typedoc'
    ]);

    /** Release **/

    grunt.registerTask('build', [
        'compile',
        'karma:build',
        'uglify:build',
        'typedoc'
    ]);
};