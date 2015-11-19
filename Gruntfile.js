module.exports = function (grunt) {
    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        asset_cachebuster: {
            options: {
                buster: Date.now(),
                ignore: [],
                htmlExtension: 'html'
            },
            build: {
                files: {
                    'index.html': ['index.template.html'],
                    'dran.html': ['index.template.html'],
                    'chat.html': ['index.template.html']
                }
            }
        },
        uglify: {
            min: {
                files: {
                    "js/<%= pkg.name %>.min.js": ['js/app/*.js', 'js/layout/*.js', 'js/model/*.js', 'js/collection/*.js', 'js/view/*.js', 'js/router/*.js']
                },
                options: {
                    sourceMap: true,
                    sourceMapIncludeSources: true,
                    banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n',
                }
            },
            dev: {
                files: {
                    "js/<%= pkg.name %>.js": ['js/app/*.js', 'js/layout/*.js', 'js/model/*.js', 'js/collection/*.js', 'js/view/*.js', 'js/router/*.js']
                },
                options: {
                    sourceMapIncludeSources: true,
                    sourceMap: true,
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
        cssmin: {
            options: {
                rebase: false
            },
            target: {
                files: {
                    "css/Karopapier.min.css": ["css/*.css", "!css/*.min.css"]
                }
            }
        },
        watch: {
            scripts: {
                files: ['js/**/*.js', '!js/<%= pkg.name %>*.js', 'test/**/*.js'],
                tasks: ['uglify', 'asset_cachebuster'],
                options: {
                    interrupt: true,
                    livereload: {
                        port: 20000
                    }
                }
            },
            templates: {
                files: ['js/templates/**/*.html', 'js/templates/**/*.tpl', 'index.template.html'],
                tasks: ['jst', 'asset_cachebuster'],
                options: {
                    interrupt: true,
                    livereload: {
                        port: 20000
                    }
                }
            },
            statics: {
                files: ['images/**/*', '!docs'],
                options: {
                    interrupt: true,
                    livereload: {
                        port: 20000
                    }
                }
            },
            css: {
                files: ['css/**/*', '!css/**/*.min.css'],
                tasks: ["cssmin", 'asset_cachebuster'],
                options: {
                    interrupt: true,
                    livereload: {
                        port: 20000
                    }
                }
            },
            spielwiese: {
                files: ['spielwiese/**/*'],
                options: {
                    interrupt: true,
                    livereload: {
                        port: 20000
                    }
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
        },
        sprite: {
            all: {
                src: "css/mapfields/*.png",
                dest: "css/images/mapfields.png",
                destCss: "css/mapfields.css"
            }
        }
    });

    // Load the plugins
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-jst');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-spritesmith');
    grunt.loadNpmTasks('grunt-jsdoc');
    grunt.loadNpmTasks('grunt-asset-cachebuster');

    // Default task(s).
    grunt.registerTask('default', ['uglify', 'jst', 'cssmin', 'asset_cachebuster','watch']);
    //grunt.registerTask('guck', ['watch']);
    grunt.registerTask('spielwiese', ['spielwiese']);

};
