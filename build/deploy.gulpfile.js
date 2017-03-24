var gulp = require( 'gulp' );
/**
 * Simply FTP connexion
 */
var gutil = require( 'gulp-util' );
var ftp = require( 'vinyl-ftp' );

/**
 * Path
 */
var path = require('path');
var root = path.resolve(__dirname, '../');
var local = root+'/dist/';

/**
 * Load FTP config file
 * /!\ VERY IMPORTANT - DON'T COMMIT FTP INFORMATIONS !!
 * ADD `build/ftpconf.yaml` TO YOUR .GITIGNORE
 */
const YAML = require('yamljs');
var config = YAML.load(root + '/build/ftpconf.yaml');


/**
 * Gulp task
 * So... ``config`` var is used for provide good configuration for ftp connect
 * Then it's OK var globs is used for targeting what you want transfer
 * Then classic pipe gulp with globs for src files, ``base`` it's for explained context,
 * upload `dist` folder to your server or the files in `dist` folders
 * Buffer false, for better perfomance
 * And finally... conn.dest for write on you ftp server
 * Enjoy !
 */
gulp.task( 'default', function () {
    console.log(config);
	var conn = ftp.create( {
		host:     config.host,
		user:     config.user,
		password: config.password,
        port: config.port,
		parallel: 2,
		log:      gutil.log,
        idleTimeout: 2000
	} );

	var globs = [
        root + '/dist/**/*.*'
	];

	// using base = '.' will transfer everything to /public_html correctly
	// turn off buffering in gulp.src for best performance

	return gulp.src( globs, { base: './dist/', buffer: false } )
		.pipe( conn.newer( config.remote ) ) // only upload newer files
		.pipe( conn.dest( config.remote ) );

} );

gulp.start('default');
