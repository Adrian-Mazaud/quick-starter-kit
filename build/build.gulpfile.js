'use strict';
// require('shelljs/global');
var ora = require('ora');
var path = require('path');
var spinner = ora('Build...');

var root = path.resolve(__dirname, '../');

spinner.start();



/** [require | Require modules] */
const gulp = require('gulp');
const sass = require('gulp-sass');
const autoprefixer = require('gulp-autoprefixer');
const uglify = require('gulp-uglify');
// const useref = require('gulp-useref');
// const htmlmin = require('gulp-html-minifier');
// const gulpif = require('gulp-if');
const imagemin = require('gulp-imagemin');
const pug = require('gulp-pug');


/**
    * --------------------------
    * [folderss | relative path for folders | D means destination || dist]
    * @type {Object}
    * --------------------------
 */


var folders = {

        sass : root+'/dev/sass/**/*.sass',
        cssD : root+'/dist/assets/css',

        pug: root + '/dev/*.pug',

        html: root + '/dev/*.target',
        htmlD: root + '/dist/',

        js : root+'/dev/app/*.js',
        jsD : root+'/dist/app/',

        jsLibs: root+'/dev/app/lib/**/*.js',
        jsLibsD: root+'/dist/app/lib',

        jade : root+'/dev/index.jade',
        jadeD : root+'/dist/',

        img: root+'/dev/img/**/*.*',
        imgD: root+'/dist/assets/img',

        data: root + '/dev/data/**.*',
        dataD: root +'/dist/assets/data',

        fonts : root+'/dev/fonts/*.*',
        fontsD: root+'/dist/assets/fonts',
}


/**
    * --------------------------
    * Tasks
    * --------------------------
 */

/** [Default | Build] */
gulp.task('default', ['sass', 'images', 'fonts', 'pug', 'browserify'], function(){
    spinner.stop();
    console.log('End build ! Enjoy !');
});


gulp.task('fonts', function(){
    return gulp.src(folders.fonts)
        .pipe(gulp.dest(folders.fontsD))
})

/** [SASS | LibSass - Convert Sass to Css and move to Dist] */
 gulp.task('sass', function(){
     return gulp.src(folders.sass)
         .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
         .pipe(autoprefixer({
 			browsers: ['> 1%', 'Last 5 versions','Firefox > 20','IE 8'],
 			cascade: false
 		}))
         .pipe(gulp.dest(folders.cssD));
 });

gulp.task('pug', function(){
    return gulp.src(folders.pug)
        .pipe(pug({pretty: true}))
        .pipe(gulp.dest(folders.htmlD));
})

/** [Compress | Move Js from Dev to Dist | Optional uglify] */
gulp.task('compress', function() {
  gulp.src(folders.js)
    .pipe(uglify({mangle: false}))
    .pipe(gulp.dest(folders.jsD));
});

/** [Icons - Copy Icons from Dev to Dist] */
gulp.task('images', function(){
    return gulp.src(folders.img)
        .pipe(imagemin({verbose: true}))
        .pipe(gulp.dest(folders.imgD));
});


gulp.task('lib', function(){
    return gulp.src(folders.jsLibs)
        .pipe(gulp.dest(folders.jsLibsD));
})

// --------------------------------
// Browserify task

var browserify = require('browserify');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var globby = require('globby');
var through = require('through2');
var gutil = require('gulp-util');
var sourcemaps = require('gulp-sourcemaps');
var babelify = require('babelify');


// see : https://github.com/gulpjs/gulp/blob/master/docs/recipes/browserify-with-globs.md
gulp.task('browserify', function () {
  // gulp expects tasks to return a stream, so we create one here.
  var bundledStream = through();

  bundledStream
    // turns the output bundle stream into a stream containing
    // the normal attributes gulp plugins expect.
    .pipe(source('app.min.js'))
    // the rest of the gulp task, as you would normally write it.
    // here we're copying from the Browserify + Uglify2 recipe.
    .pipe(buffer())
    .pipe(sourcemaps.init({loadMaps: true}))
      // Add gulp plugins to the pipeline here.
      .pipe(uglify())
      .on('error', gutil.log)
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest(folders.jsD));

  // "globby" replaces the normal "gulp.src" as Browserify
  // creates it's own readable stream.
  globby([folders.js]).then(function(entries) {
    // create the Browserify instance.
    var b = browserify({
      entries: entries,
      debug: true,
      transform: [babelify.configure({presets: ["es2015"]})]
    });

    // pipe the Browserify stream into the stream we created earlier
    // this starts our gulp pipeline.
    b.bundle().pipe(bundledStream);
  }).catch(function(err) {
    // ensure any errors from globby are handled
    bundledStream.emit('error', err);
  });

  // finally, we return the stream, so gulp knows when this task is done.
  return bundledStream;
});


gulp.start('default');
