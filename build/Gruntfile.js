/*global module:false, console:false, process:false*/

module.exports = function(grunt) {
	
	'use strict';
	
	grunt.initConfig({
		
		pkg : grunt.file.readJSON('package.json'),
		
		/**
		 * Build date and version.
		 *
		 * @see http://tanepiper.com/blog/2012/11/25/building-and-testing-javascript-with-gruntjs/
		 * @see http://blog.stevenlevithan.com/archives/date-time-format
		 */
		
		now : grunt.template.today('yyyymmdd'), // Alternative: yyyymmddhhMMss
		
		/*----------------------------------( WATCH )----------------------------------*/
		
		/**
		 * Run predefined tasks whenever watched file patterns are added, changed
		 * or deleted.
		 *
		 * $ grunt watch
		 *
		 * @see https://github.com/gruntjs/grunt-contrib-watch
		 */
		
		watch : {
			
			tmpl : {
				
				files : [
					
					'./files/css/less/**/*',
					'./files/tmpl/**/*',
					'./files/js/**/*'
					
				],
				
				tasks : ['dev']
				
			}
			
		},
		
		/*----------------------------------( PREFLIGHT )----------------------------------*/
		
		/**
		 * Validate files with JSHint.
		 *
		 * @see https://github.com/gruntjs/grunt-contrib-jshint
		 * @see http://www.jshint.com/docs/
		 */
		
		jshint : {
			
			options : {
				
				jshintrc : '.jshintrc'
				
			},
			
			init : [
				
				'./Gruntfile.js',
				'./files/js/woof.*.js'
				
			]
			
		},
		
		/*----------------------------------( ENVIRONMENT )----------------------------------*/
		
		/**
		 * Grunt task to automate environment configuration for future tasks.
		 *
		 * @see https://github.com/onehealth/grunt-env
		 */
		
		env : {
			
			/*
			options : {
				
				globalOption : 'foo'
				
			},
			*/
			
			dev : {
				
				NODE_ENV : 'DEVELOPMENT'
				
			},
			
			pro : {
				
				NODE_ENV : 'PRODUCTION'
				
			}
			
		},
		
		/*----------------------------------( CLEAN )----------------------------------*/
		
		/**
		 * Clean files and folders.
		 *
		 * @see https://github.com/gruntjs/grunt-contrib-clean
		 */
		
		clean : {
			
			options : {
				
				force : true // Sketchy!
				
			},
			
			dev : {
				
				src : [
					
					'./files/index.html',
					'./files/css/<%= pkg.name %>.css',
					'../demo/**/*'
					
				]
				
			},
			
			pro : {
				
				src : [
					
					'../<%= pkg.name %>/<%= pkg.version %>/<%= now %>/**/*',
					'../demo/**/*'
					
				]
				
			}
			
		},
		
		/*----------------------------------( UGLIFY )----------------------------------*/
		
		/**
		 * Minify files with UglifyJS.
		 *
		 * @see https://github.com/gruntjs/grunt-contrib-uglify
		 * @see http://lisperator.net/uglifyjs/
		 */
		
		uglify : {
			
			pro : {
				
				files : {
					
					'../<%= pkg.name %>/<%= pkg.version %>/<%= now %>/js/respond.min.js' : [
						'./files/js/respond.src.js',
						'./files/js/respond.proxy.js'
					]
					
				}
				
			}
			
		},
		
		/*----------------------------------( LESS )----------------------------------*/
		
		/**
		 * Compile LESS files to CSS.
		 *
		 * @see https://github.com/gruntjs/grunt-contrib-less
		 */
		
		less : {
			
			options : {
				
				compress : true
				
			},
			
			dev : {
				
				files : {
					
					'./files/css/<%= pkg.name %>.css' : './files/css/less/<%= pkg.name %>.less',
					'./files/css/demo.css' : [
						
						'./files/css/less/demo.less',
						'./lib/css/**/*'
						
					]
					
				}
				
			},
			
			pro : {
				
				options : {
					
					yuicompress : true
					
				},
				
				files : {
					
					'../<%= pkg.name %>/<%= pkg.version %>/<%= now %>/css/<%= pkg.name %>.min.css' : './files/css/less/<%= pkg.name %>.less',
					'./files/css/demo.css' : './files/css/less/demo.less'
					
				}
				
			}
			
		},
		
		/*----------------------------------( COPY )----------------------------------*/
		
		/**
		 * Copy files and folders.
		 *
		 * @see https://github.com/gruntjs/grunt-contrib-copy
		 * @see http://gruntjs.com/configuring-tasks#globbing-patterns
		 */
		
		copy : {
			
			dev : {
				
				files : [
					
					{
						
						expand : true,
						cwd : './files/',
						src : ['img/**'],
						dest : '../demo/'
						
					},
					
					{
						
						expand : true,
						cwd : './files/',
						src : ['css/*.css'],
						dest : '../demo/'
						
					},
					
					{
						
						expand : true,
						cwd : './files/',
						src : ['js/*.js'],
						dest : '../demo/'
						
					}
					
				]
				
			},
			
			pro : {
				
				files : [
					
					{
						
						expand : true,
						cwd : './files/',
						src : ['img/**', 'css/demo.css'],
						dest : '../demo/'
						
					},
					
					{
						
						expand : true,
						cwd : '../<%= pkg.name %>/<%= pkg.version %>/<%= now %>/',
						src : ['css/<%= pkg.name %>.min.css'],
						dest : '../demo/'
						
					}
					
				]
				
			}
			
		},
		
		/*----------------------------------( INCLUDES )----------------------------------*/
		
		/**
		 * Include other files, like php `include`.
		 *
		 * @see https://github.com/vanetix/grunt-includes
		 */
		
		includes: {
			
			files: {
				
				src: './files/tmpl/index.html', // Source files
				dest: '../demo', // Destination directory
				flatten: true,
				cwd: '.'
				
			}
			
		},
		
		/*----------------------------------( PREPROCESS )----------------------------------*/
		
		/**
		 * Grunt task around preprocess npm module.
		 *
		 * @see https://github.com/onehealth/grunt-preprocess
		 * @see https://github.com/onehealth/preprocess
		 */
		
		preprocess : {
			
			options : {
				
				context : {
					path : '../<%= pkg.name %>/<%= pkg.version %>/<%= now %>',
					name : '<%= pkg.name %>'
				}
				
			},
			
			dev : {
				
				src : '../demo/index.html',
				dest : '../demo/index.html'
				
			},
			
			pro : {
				
				src : '../demo/index.html',
				dest : '../demo/index.html'
				
			}
			
		}
		
	});
	
	/*----------------------------------( TASKS )----------------------------------*/
	
	grunt.loadNpmTasks('grunt-contrib-clean');
	
	grunt.loadNpmTasks('grunt-contrib-jshint');
	
	grunt.loadNpmTasks('grunt-contrib-uglify');
	
	grunt.loadNpmTasks('grunt-contrib-copy');
	
	grunt.loadNpmTasks('grunt-contrib-less');
	
	grunt.loadNpmTasks('grunt-contrib-watch');
	
	grunt.loadNpmTasks('grunt-preprocess');
	
	grunt.loadNpmTasks('grunt-includes');
	
	grunt.loadNpmTasks('grunt-env');
	
	//----------------------------------
	
	/**
	 * @see https://github.com/onehealth/grunt-preprocess/issues/7
	 * @see https://github.com/onehealth/grunt-env/issues/4
	 */
	
	grunt.registerTask('printenv', function () { console.log(process.env); });
	
	//grunt.registerTask('default', ['clean', 'jshint', 'uglify', 'copy']);
	
	grunt.registerTask('default', ['jshint']);
	
	grunt.registerTask('dev', ['jshint', 'env:dev', 'clean:dev', 'less:dev', 'includes', 'preprocess:dev', 'copy:dev']);
	
	grunt.registerTask('pro', ['jshint', 'env:pro', 'clean:pro', 'less:pro', 'includes', 'preprocess:pro', 'copy:pro']);
	
};
