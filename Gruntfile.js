module.exports = function(grunt) {
    // Project configuration.
    require('time-grunt')(grunt);

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
                    'public/index.html': ['templates/index.template.html'],
                    'public/newgame.html': ['templates/index.template.html'],
                    'public/dran.html': ['templates/index.template.html'],
                    'public/chat.html': ['templates/index.template.html'],
                    'public/editor.html': ['templates/index.template.html']
                }
            }
        },
        browserify: {
            options: {
                browserifyOptions: {
                    debug: true
                }
            },
            dist: {
                files: {
                    "public/js/<%= pkg.name %>.browserified.js": ['src/start.js']
                }
            }
        },
        uglify: {
            min: {
                files: {
                    //"src/<%= pkg.name %>.min.js": ["src/<%= pkg.name %>.browserified.js"]
                    "public/js/<%= pkg.name %>.min.js": ['src/app/**/*.js', 'src/layout/**/*.js', 'src/model/**/*.js', 'src/collection/**/*.js', 'src/view/**/*.js', 'src/router/**/*.js']
                },
                options: {
                    sourceMap: true,
                    sourceMapIncludeSources: true,
                    banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n',
                }
            },
            dev: {
                files: {
                    "public/js/<%= pkg.name %>.js": ['src/app/**/*.js', 'src/layout/**/*.js', 'src/model/**/*.js', 'src/collection/**/*.js', 'src/view/**/*.js', 'src/router/**/*.js']
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
                processName: function(filepath) {
                    var p = filepath;
                    p = p.replace("templates/", "");
                    p = p.replace(/\.html$/, "");
                    p = p.replace(/\.tpl$/, "");
                    return p;
                }
            },
            compile: {
                files: {
                    "public/js/JST.js": ['templates/**/*.html', 'templates/**/*.tpl']
                }
            }

        },
        cssmin: {
            options: {
                rebase: false
            },
            target: {
                files: {
                    "public/css/Karopapier.min.css": ["css/*.css", "!css/*.min.css"]
                }
            }
        },
        watch: {
            scripts: {
                files: ['src/**/*.js', '!src/<%= pkg.name %>*.js', 'test/**/*.js'],
                tasks: ['build', 'publish', 'test'],
                options: {
                    interrupt: true,
                    livereload: {
                        port: 20000
                    }
                }
            },
            templates: {
                files: ['templates/**/*.html', 'templates/**/*.tpl', 'index.template.html'],
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
            tests: {
                files: ['public/test/**/*'],
                tasks: ['test'],
                options: {
                    interrupt: true,
                    livereload: {
                        port: 20000
                    }
                }
            },
            spielwiese: {
                files: ['public/spielwiese/**/*'],
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
                    'src/app/**/*.js',
                    'src/collection/**/*.js',
                    'src/layout/**/*.js',
                    'src/model/**/*.js',
                    'src/router/**/*.js',
                    'src/view/**/*.js',
                ],
                options: {
                    destination: 'public/doc'
                }
            }
        },
        nodeunit: {
            all: ['test/test.js']
        },
        copy: {
            main: {
                files: [
                    {
                        expand: true,
                        src: ['src/**'],
                        dest: 'public/js/'
                    }
                ]
            }
        }
    });

    // Load the plugins
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-jst');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-jsdoc');
    grunt.loadNpmTasks('grunt-asset-cachebuster');
    grunt.loadNpmTasks('grunt-contrib-nodeunit');
    grunt.loadNpmTasks('grunt-browserify');

    // Default task(s).
    grunt.registerTask('build', ['copy', 'browserify', 'uglify', 'jst', 'cssmin', 'asset_cachebuster']);
    grunt.registerTask('default', ['build', 'watch']);
    grunt.registerTask('build', ['browserify', 'uglify', 'jst', 'cssmin', 'asset_cachebuster']);
    grunt.registerTask('spielwiese', ['spielwiese']);
    grunt.registerTask('publish', ['copy']);
    grunt.registerTask('test', 'nodeunit');

};
