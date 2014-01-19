
module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({

    // Metadata.
    pkg: grunt.file.readJSON('package.json'),
    banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n',
    // Task configuration.
    clean: {
      dist: ['public']
    },

    concat: {
      options: {
        banner: '<%= banner %>',
        stripBanners: false
      },
      bootstrap: {
        src: [
          'source/bootstrap/js/transition.js',
          'source/bootstrap/js/alert.js',
          'source/bootstrap/js/button.js',
          'source/bootstrap/js/carousel.js',
          'source/bootstrap/js/collapse.js',
          'source/bootstrap/js/dropdown.js',
          'source/bootstrap/js/modal.js',
          'source/bootstrap/js/tooltip.js',
          'source/bootstrap/js/popover.js',
          'source/bootstrap/js/scrollspy.js',
          'source/bootstrap/js/tab.js',
          'source/bootstrap/js/affix.js'
        ],
        dest: 'public/resource/js/<%= pkg.name %>.js'
      }
    },

    uglify: {
      options: {
        banner: '<%= banner %>',
        report: 'min'
      },
      bootstrap: {
        src: ['<%= concat.bootstrap.dest %>'],
        dest: 'public/resource/js/<%= pkg.name %>.min.js'
      }
    },

    recess: {
      options: {
        compile: true,
        banner: '<%= banner %>'
      },
      bootstrap: {
        src: ['source/bootstrap/less/bootstrap.less'],
        dest: 'public/resource/css/<%= pkg.name %>.css'
      },
      min: {
        options: {
          compress: true
        },
        src: ['source/bootstrap/less/bootstrap.less'],
        dest: 'public/resource/css/<%= pkg.name %>.min.css'
      },
      custom: {
        src: ['source/less/custom.less'],
        dest: 'public/resource/css/<%= pkg.name %>-custom.css'
      },
      custom_min: {
        options: {
          compress: true
        },
        src: ['source/less/custom.less'],
        dest: 'public/resource/css/<%= pkg.name %>-custom.min.css'
      },      
    },

    copy: {
      fonts: {
        expand: true,
        src: ["source/bootstrap/fonts/*"],
        dest: 'public/resource/fonts'
      },
      images: {
        expand: true,
        src: ["source/img/*"],
        dest: 'public/resource/img',
        flatten:true
      },
      vendorjs: {
        expand: true,
        src: ["source/js/vendor/*"],
        dest: 'public/resource/js',
        flatten:true
      }  
    },
    directory_to_json: {
      blog_internal: {
        root_directory: 'source/pages/blog',
        dest: 'source/pages/blog/index.json',
        src: ['source/pages/blog/*.html','!source/pages/blog/index.html'],
        sort_by : 'date',
        sort_dir : 'desc'
      },
      front_listing: {
        root_directory: 'source/pages',
        dest: 'source/pages/index.json',
        src: ['source/pages/blog/*.html','!source/pages/blog/index.html'],
        sort_by : 'date',
        sort_dir : 'desc'
      }      
    },
    swig: {
      development: {
        init: {
            autoescape: true
        },
        expand:true,
        dest: 'public/',
        cwd: 'source/pages/',
        src: ['**/*.html'],
        generateSitemap: true,
        generateRobotstxt: true,
        siteUrl: 'http://andrew-couch.com/',
        production: false,
        ga_account_id: 'UA-xxxxxxxx-1',
        resource_basename : '<%= pkg.name %>',
        robots_directive: 'Disallow /',
        sitemap_priorities: {
            '_DEFAULT_': '0.5',
            'index.html': '0.8',
            'subpage.html': '0.7'
        }
      }
    }
  });


  // These plugins provide necessary tasks.
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-recess');
  grunt.loadNpmTasks('grunt-swig');
  grunt.loadNpmTasks('grunt-directory-to-json');


  // JS distribution task.
  grunt.registerTask('dist-js', ['concat', 'uglify']);

  // CSS distribution task.
  grunt.registerTask('dist-css', ['recess']);

  // Fonts/Image distribution task.
  grunt.registerTask('dist-fonts', ['copy']);

  // Swig compile task.
  grunt.registerTask('dist-swig', ['directory_to_json','swig']);

  // Full distribution task.
  grunt.registerTask('default', ['clean', 'dist-css', 'dist-fonts', 'dist-js','dist-swig']);
};
