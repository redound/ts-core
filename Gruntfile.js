module.exports = function(grunt) {

    grunt.initConfig({
        exec: {
            typescript: { cmd: 'tsc --out dist/tscore.js src/tscore.ts -t ES5 --declaration'}
        },
        uglify: {
            tscore: {
                files: {
                    'dist/tscore.min.js': ['dist/tscore.js']
                }
            }
        }
    });

    grunt.loadNpmTasks('grunt-exec');
    grunt.loadNpmTasks('grunt-contrib-uglify');

    grunt.registerTask('default', [
        'exec:typescript',
        'uglify:tscore'
    ]);

};