'use strict';

/**
 * Simple webserver with livereload || gulp-connect
 * Generally i assign this to "npm run dev" with small little project or HTML / SASS integration
 */

var path = require('path');
var root = path.resolve(__dirname, '../');




/** [require | Require modules] */
const gulp = require('gulp');
const sass = require('gulp-sass');
const autoprefixer = require('gulp-autoprefixer');
const uglify = require('gulp-uglify');
const imagemin = require('gulp-imagemin');
const pug = require('gulp-pug');

const connect = require('gulp-connect');


/**
    * --------------------------
    * [folderss | relative path for folders | D means destination || dist]
    * @type {Object}
    * --------------------------
 */
var folders = {

        sass : root+'/dev/sass/**/*.sass',
        cssD : root+'/temp/assets/css/',

        js : root+'/dev/app/*.js',
        jsD : root+'/temp/app/',

        html: root+'/dev/*.html',
        htmlD: root + '/temp/',

        data: root+'/dev/data/**/*.*',
        dataD: root+'/temp/assets/data',

        images: root + '/dev/img/**/*.*',
        imagesD: root + '/temp/assets/img/',

        fonts: root + '/dev/fonts/*.*',
        fontsD: root + '/temp/assets/fonts/',

        pug: root + '/dev/*.pug'
}


/**
    * --------------------------
    * Tasks
    * --------------------------
 */

/** [Default | Build] */
gulp.task('default', ['before', 'connect', 'watch'], function(){
    console.log('Server start ! Gulp watch you !!');
});

gulp.task('before', ['images', 'data', 'fonts', 'sass', 'pug'], function(){});


gulp.task('images', function(){
    return gulp.src(folders.images)
        // .pipe(imagemin({verbose: true}))
        .pipe(gulp.dest(folders.imagesD));
});

gulp.task('data', function(){
    return gulp.src(folders.data)
        .pipe(gulp.dest(folders.dataD));
});

gulp.task('fonts', function(){
    return gulp.src(folders.fonts)
        .pipe(gulp.dest(folders.fontsD))
})

gulp.task('connect', function() {
  connect.server({
    // root: 'app',
    root: 'temp',
    livereload: true
  });
});

gulp.task('watch', ['js'], function(){
    gulp.watch([folders.sass], ['sass']);
    gulp.watch([folders.pug], ['pug']);
})

/** [SASS | LibSass - Convert Sass to Css and move to Dist] */
 gulp.task('sass', function(){
     return gulp.src(folders.sass)
         .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
         .pipe(autoprefixer({
 			browsers: ['> 1%', 'Last 5 versions','Firefox > 20','IE 8'],
 			cascade: false
 		}))
         .pipe(gulp.dest(folders.cssD))
         .pipe(connect.reload());
 });

 gulp.task('html', function(){
     return gulp.src(folders.html)
        .pipe(gulp.dest(folders.htmlD))
        .pipe(connect.reload());
 })

gulp.task('pug', function(){
    return gulp.src(folders.pug)
        .pipe(pug({pretty: true}))
        .pipe(gulp.dest(folders.htmlD))
        .pipe(connect.reload());
})


/**
* watchify | Browserify
*/
var watchify = require('watchify');
var browserify = require('browserify');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var gutil = require('gulp-util');
var sourcemaps = require('gulp-sourcemaps');
var assign = require('lodash.assign');

var babelify = require('babelify');
var vueify = require('vueify');

// add custom browserify options here
var customOpts = {
    entries: [root+'/dev/app/app.js'],
    debug: true,
    transform: [vueify, babelify.configure({presets: ["es2015"]})]
};
var opts = assign({}, watchify.args, customOpts);
var b = watchify(browserify(opts));

// add transformations here
// i.e. b.transform(coffeeify);

gulp.task('js', bundle); // so you can run `gulp js` to build the file
b.on('update', bundle); // on any dep update, runs the bundler
b.on('log', gutil.log); // output build logs to terminal

function bundle() {
return b.bundle()
    // log errors if they happen
    .on('error', gutil.log.bind(gutil, 'Browserify Error'))
    .pipe(source('app.min.js'))
    // optional, remove if you don't need to buffer file contents
    .pipe(buffer())
    // optional, remove if you dont want sourcemaps
    .pipe(sourcemaps.init({loadMaps: true})) // loads map from browserify file
    // Add transformation tasks to the pipeline here.
    .pipe(sourcemaps.write('./')) // writes .map file
    .pipe(gulp.dest(root+'/temp/app/'))
    .pipe(connect.reload());
}




gulp.start('default');
