module.exports = function (grunt) {
    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        uglify: {
            min: {
                files: {
                    "js/<%= pkg.name %>.min.js": ['js/app/*.js', 'js/layout/*.js', 'js/model/*.js', 'js/collection/*.js', 'js/view/*.js', 'js/router/*.js']
                },
                options: {
                    sourceMap: true,
                    banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n',
                }
            },
            dev: {
                files: {
                    "js/<%= pkg.name %>.js": ['js/app/*.js', 'js/layout/*.js', 'js/model/*.js', 'js/collection/*.js', 'js/view/*.js', 'js/router/*.js']
                },
                options: {
                    banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n',
                    beautify: true
                }
            }
        },
        jst: {
            options: {
                prettify: true,
                processName: function (filepath) {
                    var p = filepath;
                    p = p.replace("js/templates/", "");
                    p = p.replace(/\.html$/, "");
                    p = p.replace(/\.tpl$/, "");
                    return p;
                }
            },
            compile: {
                files: {
                    "js/templates/JST.js": ['js/templates/**/*.html', 'js/templates/**/*.tpl']
                }
            }

        },
        watch: {
            scripts: {
                files: ['js/**/*.js', '!js/<%= pkg.name %>*.js'],
                tasks: ['uglify'],
                options: {
                    interrupt: true,
                    livereload: true
                }
            },
            templates: {
                files: ['js/templates/**/*.html', 'js/templates/**/*.tpl'],
                tasks: ['jst'],
                options: {
                    interrupt: true,
                    livereload: true
                }
            },
            statics: {
                files: ['**/*.html', 'css/**/*', 'images/**/*'],
                options: {
                    interrupt: true,
                    livereload: true
                }
            },
            spielwiese: {
                files: ['spielwiese/**/*'],
                options: {
                    interrupt: true,
                    livereload: true
                }
            }
        },
        jsdoc: {
            dist: {
                src: [
                    'js/app/**/*.js',
                    'js/collection/**/*.js',
                    'js/layout/**/*.js',
                    'js/model/**/*.js',
                    'js/router/**/*.js',
                    'js/view/**/*.js',
                ],
                options: {
                    destination: 'doc'
                }
            }
        }
    });

    // Load the plugins
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-jst');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-jsdoc');

    // Default task(s).
    grunt.registerTask('default', ['uglify', 'jst', 'watch']);
    //grunt.registerTask('guck', ['watch']);
    grunt.registerTask('spielwiese', ['spielwiese']);

};
