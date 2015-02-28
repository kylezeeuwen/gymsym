/* jshint node:true */
'use strict';
// generated on 2015-01-10 using generator-gulp-webapp 0.2.0
var gulp = require('gulp');
var $ = require('gulp-load-plugins')();
var fs = require('fs-extra');
var runSequence = require('run-sequence');

gulp.task('clean', function(cb) {
  fs.remove('dist', cb);
});

gulp.task('test-clean', function(cb) {
  fs.remove('compiled', cb);
});

//gulp.task('clean', require('del').bind(null, ['dist']));

gulp.task('compile-coffee', function () {
  var gulp_coffee = require("gulp-coffee");
  gulp.src('test/**/*.coffee')
    .pipe(gulp_coffee())
    .pipe(gulp.dest('compiled/test/'));

  gulp.src('app/scripts/**/*.coffee')
    .pipe(gulp_coffee())
    .pipe(gulp.dest('dist/scripts/'));
});

gulp.task('test', function(cb) {
  runSequence(['test-clean', 'clean'], ['compile-coffee', 'wiredep', 'copy'], 'karma', cb);
});

gulp.task('karma', function() {
  var karma = require('gulp-karma');
  var testFiles = 'compiled/test/**/*Spec.js';

  return gulp.src('./fakefile/use-files-array-in/test/spec/karma.conf.js')
    .pipe(karma({
      configFile: 'test/spec/karma.conf.js',
      action: 'run'
    }))
    .on('error', function(err) {
      throw err;
    });
});

gulp.task('styles', function () {
  return gulp.src('app/styles/main.scss')
    .pipe($.plumber())
    .pipe($.rubySass({
      style: 'expanded',
      precision: 10
    }))
    .pipe($.autoprefixer({browsers: ['last 1 version']}))
    .pipe(gulp.dest('dist/styles'));
});

gulp.task('images', function () {
  return gulp.src('app/images/**/*')
    .pipe($.cache($.imagemin({
      progressive: true,
      interlaced: true
    })))
    .pipe(gulp.dest('dist/images'));
});

gulp.task('fonts', function () {
  return gulp.src(require('main-bower-files')().concat('app/fonts/**/*'))
    .pipe($.filter('**/*.{eot,svg,ttf,woff}'))
    .pipe($.flatten())
    .pipe(gulp.dest('dist/fonts'));
});

gulp.task('copy', function () {
  gulp.src([
    'app/**/*.html'
  ], {
    dot: true
  }).pipe(gulp.dest('dist'));

  gulp.src([
    'app/bower_components/**/*'
  ], {
    dot: true
  }).pipe(gulp.dest('dist/bower_components'));

});

gulp.task('connect', ['build'], function () {
  var serveStatic = require('serve-static');
  var serveIndex = require('serve-index');
  var app = require('connect')()
    .use(require('connect-livereload')({port: 35729}))
    .use(serveStatic('dist'))
    .use(serveIndex('dist'));

  require('http').createServer(app)
    .listen(9000)
    .on('listening', function () {
      console.log('Started connect web server on http://localhost:9000');
    });
});

gulp.task('serve', ['connect', 'watch'], function () {
  require('opn')('http://localhost:9000');
});

// inject bower components
gulp.task('wiredep', function () {
  var wiredep = require('wiredep').stream;

  gulp.src('app/styles/*.scss')
    .pipe(wiredep())
    .pipe(gulp.dest('app/styles'));

  gulp.src('app/index.html')
    .pipe(wiredep({exclude: ['bootstrap-sass-official']}))
    .pipe(gulp.dest('app'));
});

gulp.task('watch', ['connect'], function () {
  $.livereload.listen();

  // watch for changes
  gulp.watch([
    'dist/*.html',
    'dist/styles/**/*.css',
    'dist/scripts/**/*.js',
    'dist/images/**/*'
  ]).on('change', $.livereload.changed);

  gulp.watch('app/**/*.html', ['copy']);
  gulp.watch('app/images/**/*', ['images']);
  gulp.watch('app/styles/**/*.scss', ['styles']);
  gulp.watch('app/scripts/**/*.coffee', ['compile-coffee']);

});

//clean doesn't finish before next task ..
//gulp.task('build', ['clean', 'wiredep', 'images', 'fonts', 'styles', 'copy'], function () {
gulp.task('build', ['wiredep', 'compile-coffee', 'fonts', 'styles', 'copy'], function () {
  return gulp.src('dist/**/*').pipe($.size({title: 'build', gzip: true}));
});

gulp.task('default', function () {
  gulp.start('build');
});
