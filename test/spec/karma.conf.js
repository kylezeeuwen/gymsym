
module.exports = function (config) {
  config.set({

//    preprocessors: {
//      '**/*.coffee': ['coffee']
//    },
//
//    coffeePreprocessor: {
//      // options passed to the coffee compiler
//      options: {
//        bare: true,
//        sourceMap: false
//      },
//      // transforming the filenames
//      transformPath: function(path) {
//        return path.replace(/\.coffee$/, '.js');
//      }
//    },

    reporters: ['progress'],

    // base path, that will be used to resolve files and exclude
    basePath: '',

    // testing framework to use (jasmine/mocha/qunit/...)
    frameworks: ['jasmine'],

    // list of files / patterns to load in the browser
    files: [
      '../../dist/bower_components/angular/angular.js',
      '../../dist/bower_components/angular-ui-router/release/angular-ui-router.js',
      '../../node_modules/angular-mocks/angular-mocks.js',
      '../../dist/scripts/**/*.js',
      '../../compiled/test/spec/**/*Spec.js'
    ],

    proxies: {
    },

    // list of files / patterns to exclude
    // exclude: ['app/.tmp/spec/cukes/**','app/.tmp/spec/e2e/**', 'app/.tmp/spec/pages/**'],

    // web server port
    port: 8080,

    // level of logging
    // possible values: LOG_DISABLE || LOG_ERROR || LOG_WARN || LOG_INFO || LOG_DEBUG
    logLevel: config.LOG_INFO,

    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: false,

    browsers: ['Chrome'],


    // Continuous Integration mode
    // if true, it capture browsers, run tests and exit
    singleRun: false,

    // when CI gets slow the default of 10s between
    // karma start and karma run is not enough
    browserNoActivityTimeout: 30000

  });
};
