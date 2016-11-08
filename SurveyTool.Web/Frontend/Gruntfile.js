// Generated on 2015-10-20 using generator-angular 0.12.1
'use strict';

// # Globbing
// for performance reasons we're only matching one level down:
// 'test/spec/{,*/}*.js'
// use this if you want to recursively match all subfolders:
// 'test/spec/**/*.js'



module.exports = function (grunt) {
    // Load all files starting with `grunt-`
    require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);
    
    // JsHint configuration is read from packages.json
    var pkg = grunt.file.readJSON('package.json');
    
    grunt.initConfig({
        pkg: pkg,

        // JsHint
        jshint: {
            options: pkg.jshintConfig,
            all: [
                'Gruntfile.js',
                'scripts/**/*.js'
            ]
        },
        
        // Clean
        clean: {
            // clean:release removes generated files
            release: [ 'dist' ]
        },
        
        /// userminPrepare
        useminPrepare: {
            html: '../index.html',
            options: {
                dest: 'dist/'
            }
        },

        // Concat
        concat: {
            options: {
                separator: ';'
            },
            // dist configuration is provided by useminPrepare
            dist: {}
        },

        // Uglify
        uglify: {
            // dist configuration is provided by useminPrepare
            dist: {}
        },
        
        // Cssmin
        cssmin: {
            // dist configuration is provided by useminPrepare
            dist: {}
        },
        
        // Copy HTML and fonts
        copy: {
            // copy:release copies all html and image files to dist
            // preserving the structure
            release: {
                files: [
                    {
                        expand: true,
                        cwd: '.',
                        src: [
                            'images/*.{png,gif,jpg,svg}',
                            '*.html',
                            'app/{,*/}/*.html',
                            '*.{ico,png,txt}',
                            '../*.html',
                            '../*.{ico,png,txt}',
                            'styles/fonts/{,*/}*.*'
                        ],
                        dest: 'dist/Frontend'
                    }, {
                        //for bootstrap fonts
                        expand: true,
                        dot: true,
                        cwd: 'vendors/bootstrap/dist',
                        src: ['fonts/*.*'],
                        dest: 'dist/Frontend'
                    }, {

                        //for font-awesome
                        expand: true,
                        dot: true,
                        cwd: 'vendors/font-awesome',
                        src: ['fonts/*.*'],
                        dest: 'dist/Frontend'
                    }
                ]
            }
        },
        
        // Filerev
        filerev: {
            options: {
                encoding: 'utf8',
                algorithm: 'md5',
                length: 20
            },
            release: {
                // filerev:release hashes(md5) all assets (images, js and css )
                // in dist directory
                files: [{
                    src: [
                        'dist/Frontend/images/*.{png,gif,jpg,svg}',
                        'dist/Frontend/scripts/*.js',
                        'dist/Frontend/styles/*.css',
                    ]
                }]
            }
        },
        
        // Usemin
        // Replaces all assets with their revved version in html and css files.
        // options.assetDirs contains the directories for finding the assets
        // according to their relative paths
        usemin: {
            html: [
                'dist/*.html',
                'dist/Frontend/app/{,*/}/*.html',
                'dist/Frontend/views/*.html'],
            css: ['dist/Frontend/styles/*.css'],
            options: {
                assetsDirs: ['dist', 'dist/Frontend/styles']
            }
        },

        // grunt-express will serve the files from the folders listed in `bases`
        // on specified `port` and `hostname`
        express: {
            all: {
                options: {
                    port: 3000,
                    hostname: "0.0.0.0",
                    bases: ["dist"],
                    livereload: false
                }
            }
        },

        // grunt-open will open your browser at the project's URL
        open: {
            all: {
                // Gets the port from the connect configuration
                path: 'http://localhost:<%= express.all.options.port%>'
            }
        }
        
    });
    
    // Invoked when grunt is called
    grunt.registerTask('default', 'Default task', [
        'jshint'
    ]);
    
    // Invoked with grunt release, creates a release structure
    grunt.registerTask('release', 'Creates a release in /dist', [
        'clean',
        //'jshint',
        'useminPrepare',
        'concat',
        'uglify',
        'cssmin',
        'copy',
        'filerev',
        'usemin'
    ]);

    // Creates the `server` task
    grunt.registerTask('server', [
        'release',
        'express',
        'open',
        'express-keepalive'
    ]);
};
