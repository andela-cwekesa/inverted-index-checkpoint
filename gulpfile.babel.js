const gulp = require('gulp'),
  less = require('gulp-less'),
  istanbul = require('gulp-istanbul'),
  livereload = require('gulp-livereload'),
  cleanCSS = require('gulp-clean-css'),
  jasmine = require('gulp-jasmine'),
  babel = require('gulp-babel'),
  browserify = require('browserify'),
  babelify = require('babelify'),
  source = require('vinyl-source-stream'),
  jshint = require('gulp-jshint');
const browserSync1 = require('browser-sync').create();
const browserSync2 = require('browser-sync').create();
const browserSync = require('browser-sync').create();

gulp.task('default', ['front', 'test1', 'transpile']);

gulp.task('css', () => {
  gulp.src('public/design/css/*.css')
    .pipe(cleanCSS())
    .pipe(gulp.dest('css'))
    .pipe(livereload('.public/index.html'));
});

gulp.task('watch', () => {
  livereload.listen();
  gulp.watch('public/design/css/*.css', ['css']);
});

gulp.task('js-watch', ['js'], (done) => {
  browserSync.reload();
  done();
});

gulp.task('front', () => {
  browserSync1.init({
    server: {
      baseDir: './public',
    },
    port: 3002,
    ui: {
      port: 3070,
    },
  });

  gulp.watch('./public/**/*.{html,js,css}').on('change', browserSync1.reload);
});

gulp.task('test1', ['pre-test'], () => {
  browserSync2.init({
    server: {
      baseDir: ['./public/dist/', './jasmine'] },
    port: 3080,
    ui: {
      port: 3090,
    },
  });
  gulp.watch('./jasmine/spec/*.js').on('change', browserSync2.reload);
  gulp.watch('./public/src/*.js').on('change', browserSync2.reload);
});

gulp.task('travis-test', ['pre-test'], () => {
  browserSync2.init({
    server: {
      baseDir: ['./public/dist/', './jasmine'] }
  });
  gulp.watch('./jasmine/spec/*.js').on('change', browserSync2.reload);
  gulp.watch('./public/src/*.js').on('change', browserSync2.reload);
});

gulp.task('test', ['pre-test'], () => {
  gulp.src(['./jasmine/spec/inverted-index-test.js', './public/src/inverted-index.js'])
    .pipe(jasmine())
    .pipe(istanbul.writeReports());
});

gulp.task('pre-test', () => {
  return gulp.src(['./jasmine/spec/inverted-index-test.js'])
    .pipe(istanbul())
    .pipe(istanbul.hookRequire());
});

gulp.task('transpile', () => {
  browserify('./public/src/inverted-index.js')
    .transform(babelify, { presets: ['es2015'] })
    .bundle()
    .on('error', console.error.bind(console))
    .pipe(source('inverted-index.js'))
    .pipe(gulp.dest('public/dist'));
});
