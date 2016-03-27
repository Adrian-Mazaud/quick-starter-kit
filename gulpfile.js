'use strict';
/** [require | Require modules] */
var gulp = require('gulp');
var sass = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');
var uglify = require('gulp-uglify');
var coffee = require('gulp-coffee');
var jade = require('gulp-jade');

/**
 * Gulpfile Spécial pour mes démos !! ;)
 */

/**
    * --------------------------
    * [folders | relative path for foldersss | D means destination]
    * @type {Object}
    * --------------------------
 */
var folders = {

        sass : 'dev/sass/**/*.sass',
        scss : 'dev/sass/**/*.scss',
        cssD : 'dist/assets/css',

        html : 'dev/**/*.html',
        htmlD : 'dist/',

        jade : 'dev/*.jade',
        jadeD : 'dist/',

        js : 'dev/app/**/*.js',
        jsD : 'dist/app/',

        json : 'dev/app/**/*.json',
        jsonD : 'dist/app/',

        coffee : 'dev/app/**/*.coffee',
        coffeeD : 'dist/app/',

        jsLib : 'dev/app/lib/**/*.js',
        jsLibD : 'dist/app/lib',

        img : 'dev/img/**/*.*',
        imgD : 'dist/assets/img/',

        fonts: 'dev/fonts/**/*.*',
        fontsD: 'dist/assets/fonts/',

}

/**
    * --------------------------
    * Tasks
    * --------------------------
 */

/**
    * Build
 */
gulp.task('build', ['html', 'sass', 'compress', 'copyjslib', 'json', 'fonts', 'images', 'racine']);

gulp.task('default', ['html', 'sass', 'copyjs', 'copyjslib', 'json', 'fonts', 'images']);


/** [SASS | LibSass - Convert Scss to Css and move to Dist] */
gulp.task('sass', function(){
    return gulp.src(folders.sass)
        .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
        .pipe(autoprefixer({
			browsers: ['> 1%', 'Last 5 versions','Firefox > 20','IE 8'],
			cascade: false
		}))
        .pipe(gulp.dest(folders.cssD));
});

/** [Compress - Compress Javascripts] */
gulp.task('compress', function(){
    return gulp.src(folders.js)
        .pipe(uglify({mangle: false}))
        .pipe(gulp.dest(folders.jsD));
});

gulp.task('racine', function(){
    return gulp.src(['dev/.htaccess', 'dev/robots.txt', 'dev/humans.txt', 'dev/favicon.ico'])
        .pipe(gulp.dest('dist/'))
});


/** [copyjs - Compress Javascripts] */
gulp.task('copyjs', function(){
    return gulp.src(folders.js)
        .pipe(gulp.dest(folders.jsD));
});

/** [Jade - Convert jade to html and past to dist folder] */
gulp.task('jade', function(){
    return gulp.src(folders.jade)
        .pipe(jade({pretty: true}))
        .pipe(gulp.dest(folders.jadeD));
});

/** [Coffee - Convert coffee to js and past to dist folder] */
gulp.task('coffee', function(){
    return gulp.src(folders.coffee)
        .pipe(coffee({bare: true}))
        .pipe(gulp.dest(folders.jsD));
});

/** [copyjsvendor - Permet de copier toutes les librairies JS depuis Dev to Dist] */
gulp.task('copyjslib', function(){
    return gulp.src(folders.jsLib)
        .pipe(gulp.dest(folders.jsLibD));
});

gulp.task('javascript', function(){
    return gulp.src(folders.js)
        .pipe(gulp.dest(folders.jsD));
});

/** [Html - Copie tous les .html depuis Dev vers Dist] */
gulp.task('html', function(){
    return gulp.src(folders.html)
        .pipe(gulp.dest(folders.htmlD));
});

/** [Json - Copie tous les .JSON depuis Dev vers Dist] */
gulp.task('json', function(){
    return gulp.src(folders.json)
        .pipe(gulp.dest(folders.jsonD));
});

/** [images - Copie toutes les images dans le folder dist] */
gulp.task('images', function(){
    return gulp.src(folders.img)
        .pipe(gulp.dest(folders.imgD));
});

/** [fonts - Copie les fonts] */
gulp.task('fonts', function(){
    return gulp.src(folders.fonts)
        .pipe(gulp.dest(folders.fontsD));
});




/**
    * --------------------------
    * Watching Tasks
    *  - La tache 'live' permet de regrouper différentes tâches watch en une seule et unique,
    *  ainsi que de renvoyer dans la console, un log avec l'heure de modif
    *  de chaque fichier ainsi que les possibles erreurs.
    *
    *  Elle est surtout destinée pour la modification du code
    *  pas pour des assets, tel que les images, svg, ou vendors,
    *  ce qui la rendrait bien plus lente et moins performante.
    * --------------------------
 */

gulp.task('live', ['sass', 'html', 'javascript'], function(){
    gulp.watch(folders.sass, ['sass']).on('change', function(event){
        console.log('Le fichier :' + event.path  + ' a ete modifie !')
    });
    gulp.watch(folders.html, ['html']).on('change', function(event){
        console.log('Le fichier :' + event.path + ' a ete modifie !')
    });
    gulp.watch(folders.js, ['javascript']).on('change', function(event){
        console.log('Le fichier :' + event.path + ' a ete modifie !')
    });
});
