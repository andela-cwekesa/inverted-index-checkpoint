/**
 * This file is dependent on gulp which automate tasks.
 *Author : # Collins

 */

var gulp = require('gulp'),
    less = require('gulp-less'),
    livereload = require('gulp-livereload'),
    cleanCSS = require('gulp-clean-css'),
    jshint = require('gulp-jshint'),
    livereload = require('gulp-livereload');

var browserSync1 = require("browser-sync").create();
var browserSync2 = require("browser-sync").create();
var browserSync = require("browser-sync").create();

gulp.task("default", ["front","test"]);

gulp.task('css', function() {
  gulp.src('public/design/css/*.css')
    .pipe(cleanCSS())
    .pipe(gulp.dest('css'))
    .pipe(livereload(".public/index.html"));
});
 
gulp.task('watch', function() {
  livereload.listen();
  gulp.watch('public/design/css/*.css', ['css']);
});

// A task that ensures the javascript task is complete before
// reloading browsers
gulp.task('js-watch', ['js'], function (done) {
    browserSync.reload();
    done();
});


gulp.task('front', function () {
    
    browserSync1.init({
        server : {
            baseDir: "./public"
        },
        port : 3002,
        ui: {
            port:3070
        }
    });
    // tracks html,js and css changes 
    // I have used to allow reload
    gulp.watch("./public/**/*.{html,js,css}").on("change", browserSync1.reload);
});

gulp.task("test", function () {

    browserSync2.init({
        server: {
          baseDir: ["./public/src/", "./jasmine"]},
          port: 3080,
          ui: {
              port: 3090
          }
      //}
    });

    gulp.watch('./jasmine/spec/*.js').on("change",browserSync2.reload);
    gulp.watch("./public/src/*.js").on("change", browserSync2.reload);
}); 
// end tasks