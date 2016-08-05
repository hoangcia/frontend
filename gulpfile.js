var gulp = require('gulp');
var sass = require('gulp-sass'); //css builder
var pug  = require('gulp-pug'); //view template engine
var autoprefixer = require('gulp-autoprefixer'); 
var pugLint = require('gulp-pug-lint'); //check the code quality of the view template
var jsHint = require('gulp-jshint'); //check the code quality of js
var jsLint = require('gulp-jslint');
var scssLint = require('gulp-sass-lint');

var uglify = require('gulp-uglify'); //compress js
var pump = require('pump'); //for uglify module

var uglifyCss = require('gulp-uglifycss'); //compress css

var browser_sync = require('browser-sync').create();

var imageMin = require('gulp-imagemin');

//default task
gulp.task('default', function(){

});

//start browser 
gulp.task("browserSync", function(){
    browser_sync.init({
        server: {
            baseDir: '.'
        }
    })
});

//watch any change from js, css and views

gulp.task("watch", ['browserSync'], function(){
    gulp.watch('app/scss/**/*.scss', ['compressCss']);
    gulp.watch('app/views/**/*.pug', ['runPug']);
    gulp.watch('app/js/**/*.js', ['compressJs']);
    gulp.watch('app/images/*', ['compressImg']);
});

//Build CSS
gulp.task('runSass', function(){
    return gulp.src('app/scss/*.scss')
    .pipe(scssLint())    
    .pipe(sass())    
    .pipe(autoprefixer('last 2 versions'))
    .pipe(gulp.dest('app/css'))
    .pipe(browser_sync.reload({
        stream: true
    }));
});

//Build HTML files
gulp.task('runPug', function(){
    return gulp.src('app/views/*.pug')
    .pipe(pugLint())
    .pipe(pug({pretty:true}))
    .pipe(gulp.dest('dist/views'))
    .pipe(browser_sync.reload({
        stream: true
    }));
});
//Build Javascript files
gulp.task('runJs', function(){
    return gulp.src('app/js/**/*.js')
    .pipe(jsHint())
    .pipe(jsLint())
    .pipe(gulp.dest('app/js'))    
    .pipe(browser_sync.reload({
        stream: true
    }));    
});
//Compress all javascript files
gulp.task('compressJs',['runJs'], function(cb){
    pump([
        gulp.src('app/js/*.js'),
        uglify(),
        gulp.dest('dist/js')
    ],
    cb)
});

//Compress all CSS files
gulp.task('compressCss',['runSass'], function(){
    gulp.src('app/css/**/*.css')
    .pipe(uglifyCss({
      "maxLineLen": 99,
      "uglyComments": true
    }))
    .pipe(gulp.dest('dist/css'));
});

//Compress all images
gulp.task('compressImg', function(){
    gulp.src('app/images/*')
    .pipe(imageMin())
    .pipe(gulp.dest('dist/images'));
});

