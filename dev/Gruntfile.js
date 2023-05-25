'use strict';

module.exports = function(grunt) {

  grunt.initConfig({

    pkg: grunt.file.readJSON('package.json'),

    conf: {
      project : 'fct304',
      src  : '',
      dest : '../',
      serverDir: function() {
        return this.project == '' ? '<%= conf.dest %>' : '<%= conf.dest %>../'
      },
      startPath: function() {
        return this.project == '' ? '/' : '/<%= conf.project %>'
      }
    },

    pug: {
      files: {
        expand: true,
        cwd: '<%= conf.src %>pug',
        src: ['**/*.pug', '!_layouts/**', '!_parts/**', '!_mixins/**', '!_sample/**'],
        dest: '<%= conf.dest %>',
        ext: '.html'
      },
      options: {
        pretty: true,
        spawn: false
      }
    },

    compass: {
      scss: {
        options: {
          spawn: false,
          sourcemap: true,
          noLineComments: true,
          sassDir: '<%= conf.src %>sass',
          cssDir: '<%= conf.dest %>css'
        }
      }
    },

    autoprefixer: {
      options: {
        browsers: ['last 4 version', 'ie 9']
      },
      multiple_files: {
        expand: true,
        flatten: true,
        cwd: '<%= conf.dest %>css',
        src: ['*.css', '!*.min.css'],
        dest: '<%= conf.dest %>css'
      }
    },

    concat: {
      libs: {
        src: '<%= conf.src %>js/libs/*.js',
        dest: '<%= conf.dest %>js/libs.js'
      },
      scripts: {
        files: [{
          expand: true,
          cwd: '<%= conf.src %>js',
          src: ['**/*.*', '!libs/**', '!helpers/**'],
          dest: '<%= conf.dest %>js'
        }]
      }
    },

    jsbeautifier: {
      src : ['<%= conf.dest %>js/scripts.js'],
      options:{
        js: {
          indentSize: 2
        }
      }
    },

    imagemin: {
      filesdynamic: {
        files: [{
          expand: true,
          cwd: '<%= conf.src %>img',
          src: ['**/*.{png,jpg,gif}'],
          dest: '<%= conf.dest %>img'
        }]
      }
    },

    copy: {
      svg: {
        files: [{
          expand: true,
          cwd: '<%= conf.src %>img',
          src: ['**/*.svg'],
          dest: '<%= conf.dest %>img'
        }]
      },
      fonts: {
        files: [{
          expand: true,
          cwd: '<%= conf.src %>sass/fonts',
          src: ['**/*'],
          dest: '<%= conf.dest %>css/fonts'
        }]
      }
    },

    clean: {
      options: {
        force: true
      },
      files: [
        '<%= conf.dest %>css',
        '<%= conf.dest %>js',
        '<%= conf.dest %>img',
        '<%= conf.dest %>**/*.html',
        '!<%= conf.dest %>dev/**',
        '!<%= conf.dest %>.git/**'
      ],
    },

    browserSync: {
      dev: {
        options: {
          //proxy: 'localhost/<%= conf.project %>',
          server: '<%= conf.serverDir() %>',
          startPath: '<%= conf.startPath() %>',
          files: ['<%= conf.dest %>**/*.{html,css,js}', '!<%= conf.src %>**/*.*'],
          watchTask: true
        }
      }
    },

    watch: {
      build_js: {
        files: ['<%= conf.src %>js/**/*.js'],
        tasks: ['concat', 'jsbeautifier']
      },
      build_css: {
        files: ['<%= conf.src %>sass/**/*.sass'],
        tasks: ['compass'],
        options: {
          spawn: false
        }
      },
      build_image: {
        files: ['<%= conf.src %>img/**/*.{png,jpg,gif,svg}'],
        tasks: ['imagemin-newer', 'copy:svg']
      },
      build_pug: {
        files: ['<%= conf.src %>pug/**/*.pug'],
        tasks: ['pug-newer'],
        options: {
          spawn: false
        }
      },
    },

    validation: {
      options: {
        reset: grunt.option('reset') || false,
        stoponerror: false,
        reportpath: false,
        generateReport: false,
        generateCheckstyleReport: false
      },
      files: {
        src: [
          '<%= conf.dest %>**/*.html',
          '!<%= conf.dest %>dev/**'
        ]
      }
    },

    htmllint: {
      default_options: {
        options: {
          'force': true,
          'id-class-style': 'dash',
          'indent-style': 'spaces',
          'attr-name-style': 'dash',
          'indent-width': 2,
          'line-end-style': false,
          'tag-bans': ['style'],
        },
        src: [
          '<%= conf.dest %>**/*.html',
          '!<%= conf.dest %>dev/**'
        ]
      }
    },

    csslint: {
      all: {
        options: {
          'force': true,
          'import': 1,
          'vendor-prefix': 2,
          'order-alphabetical': false,
          'compatible-vendor-prefixes': false,
          'known-properties': false,
          'selector-newline': false,
          'box-model': false,
          'adjoining-classes': false,
          'important': false,
          'box-sizing': false,
          'gradients': false,
          'universal-selector': false,
          'star-property-hack': false,
          'fallback-colors': false,
          'overqualified-elements': false,
          'duplicate-background-images': false,
          'text-indent': false,
          'floats': false,
          'outline-none': false,
          'font-sizes': false,
        },
        src: ['<%= conf.dest %>css/**/*.css']
      }
    },

    jshint: {
      default_options: {
        options: {
          'force': true
        },
        src: ['<%= conf.dest %>js/scripts.js']
      },
    }

  });


  grunt.loadNpmTasks('grunt-contrib-imagemin');
  grunt.loadNpmTasks('grunt-contrib-compass');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-pug');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-newer');
  grunt.loadNpmTasks('grunt-browser-sync');
  grunt.loadNpmTasks("grunt-jsbeautifier");
  grunt.loadNpmTasks('grunt-w3c-html-validation');
  grunt.loadNpmTasks('grunt-htmllint');
  grunt.loadNpmTasks('grunt-contrib-csslint');
  grunt.loadNpmTasks('grunt-contrib-jshint');


  grunt.registerTask('default', [
    'clean',
    'compass',
    'concat',
    'jsbeautifier',
    'pug',
    'imagemin',
    'copy',
    'lint',
    'browserSync',
    'watch'
  ]);

  grunt.registerTask('quick', [
    'compass',
    'concat',
    'jsbeautifier',
    'pug',
    'browserSync',
    'watch'
  ]);

  grunt.registerTask('lint', [
    'validation',
    'htmllint',
    'csslint',
    'jshint'
  ]);

  grunt.registerTask('validate', [
    'validation'
  ]);

  grunt.registerTask('imagemin-newer', ['newer:imagemin:filesdynamic']);
  grunt.registerTask('pug-newer', ['newer:pug']);

}
