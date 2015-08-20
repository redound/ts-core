module.exports = function(grunt) {

    grunt.initConfig({
        typescript: {
            base: {
                src: ['src/tsdata.ts'],
                dest: 'dist',
                options: {
                    module: 'amd', //or commonjs
                    target: 'es5', //or es3
                    sourceMap: true,
                    declaration: true
                }
            }
        },
        concat: {
            options: {
                separator: ';'
            },
            dist: {
                src: ['dist/**/*.js'],
                dest: 'dist/built.js'
            }
        }
    });

    grunt.loadNpmTasks('grunt-typescript');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.registerTask('default', [
        'typescript',
        'concat'
    ])

};