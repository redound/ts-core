module.exports = function(grunt) {

    grunt.initConfig({
        watch: {
            scripts: {
                files: 'src/**/*.ts',
                tasks: 'compile'
            }
        },
        ts: {
            dev: {
                src: ['**/*.ts', '!node_modules/**/*.ts'],
                out: 'dist/tscore.js',
                options: {
                    declaration: true,
                    watch: '.'
                },
            }
        },
        uglify: {
            tscore: {
                files: {
                    'dist/tscore.min.js': ['dist/tscore.js']
                }
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-ts');

    grunt.registerTask('default', [
        'watch'
    ]);

    grunt.registerTask('compile', [
        'ts:dev',
        'uglify:tscore'
    ]);

};