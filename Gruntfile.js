module.exports = function(grunt) {

    grunt.initConfig({
        ts: {
            options: {
              declaration: true
            },
            default: {
                src: ["**/*.ts", "!node_modules/**/*.ts"],
                out: "dist/tscore.js"
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

    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-ts');

    grunt.registerTask('default', [
        'ts:default',
        'uglify:tscore'
    ]);

};