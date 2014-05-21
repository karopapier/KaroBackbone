module.exports = function(grunt) {

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        uglify: {
            options: {
                banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
            },
            build: {
                src: ['js/model/*.js','js/view/*.js'],
                dest: 'js/<%= pkg.name %>.min.js'
            }
        },
        jst: {
            options: {
                prettify: true,
                processName: function(filepath) {
                    var p = filepath.replace("js/templates/","");
                    return p;
                }
            },
            compile: {
                files: {
                    "js/templates/JST.js": ['js/templates/**/*.html','js/templates/**/*.tpl']
                }
            }

        },
        watch: {
            scripts: {
                files: ['js/model/*.js','js/view/*.js','js/app/*.js'],
                tasks: ['uglify'],
                options: {
                    interrupt: true
                }
            },
            templates: {
                files: ['js/templates/*.html','js/templates/*.tpl'],
                tasks: ['jst'],
                options: {
                    interrupt: true
                }
            }
        }
    });

    // Load the plugins
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-jst');
    grunt.loadNpmTasks('grunt-contrib-watch');

    // Default task(s).
    grunt.registerTask('default', ['uglify', 'jst', 'watch']);
    //grunt.registerTask('guck', ['watch']);

};