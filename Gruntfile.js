module.exports = function(grunt) {

    grunt.initConfig({
        //typescript: {
        //    base: {
        //        src: ['src/tsdata.ts'],
        //        dest: 'dist',
        //        options: {
        //            module: 'amd', //or commonjs
        //            target: 'es5', //or es3
        //            sourceMap: true,
        //            declaration: true
        //        }
        //    }
        //},
        //concat: {
        //    options: {
        //        separator: ';'
        //    },
        //    dist: {
        //        src: ['dist/**/*.js'],
        //        dest: 'dist/built.js'
        //    }
        //}
        exec: {
            typescript: { cmd: 'tsc --out dist/tsdata.js src/tsdata.ts -t ES5'}
        }
    });
    //
    //grunt.loadNpmTasks('grunt-typescript');
    grunt.loadNpmTasks('grunt-exec');
    //grunt.loadNpmTasks('grunt-contrib-concat');
    //grunt.registerTask('default', [
    //    'typescript',
    //    'concat'
    //])

    grunt.registerTask('default', [

        'exec:typescript'
    ]);

};