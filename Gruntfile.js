module.exports = function(grunt) {

    grunt.initConfig({
        exec: {
            typescript: { cmd: 'tsc --out dist/tsdata.js src/tsdata.ts -t ES5'}
        }
    });

    grunt.loadNpmTasks('grunt-exec');

    grunt.registerTask('default', [
        'exec:typescript'
    ]);

};