const gulp = require('gulp');
const concat = require('gulp-concat');
const rename = require('gulp-rename');
const uglify = require('gulp-uglify');
const babel = require('gulp-babel');
const minifyHtml = require('gulp-minify-html');
const ngmin = require('gulp-ngmin');
const stripDebug = require('gulp-strip-debug');
const size = require('gulp-size');
const minifyCss = require('gulp-minify-css');

//'client/app.html', 'client/templates/*.html'
var clientNgFiles = ['client/app.js', 'client/controllers/*.js' ],
	clientNgDest = 'dist/js';

var clientHtmlFiles = 'client/app.html',
	clientHtmlDest = 'dist/html';
	
var clientCssFiles = 'client/css/*.css',
	clientCssDest = 'dist/css';

var clientImgFiles = 'client/imgs/*',
	clientImgDest = 'dist/imgs';


gulp.task('angular', function() {
	return gulp.src(clientNgFiles)
		.pipe(babel({ presets: ['es2017', 'es2016', 'es2015'] }))
        .pipe(stripDebug())	
		.pipe(concat('app.js'))
		.pipe(gulp.dest(clientNgDest))		
        .pipe(rename('app.min.js'))
        .pipe(uglify())
        .pipe(size())		
		.pipe(gulp.dest(clientNgDest));
});

gulp.task('html', function() {
	return gulp.src(clientHtmlFiles)
        .pipe(rename('app.html'))
		.pipe(gulp.dest(clientHtmlDest))
        .pipe(rename('app.min.html'))
        .pipe(minifyHtml())
		.pipe(gulp.dest(clientHtmlDest));
});

gulp.task('css', function () {
	return gulp.src(clientCssFiles)
		.pipe(minifyCss())
		.pipe(gulp.dest(clientCssDest));
});
