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


var clientNgFiles = ['client/app.html', 'client/controllers/*.js', 'client/templates/*.html'],
    clientNgDest = 'dist/scripts';

var clientCssFiles = 'client/css/*.css',
    clientCssDest = 'dist/css';
	
var clientImgFiles = 'client/imgs/*',
	clientImgDest = 'dist/imgs';	


gulp.task('angular', function() {
    return gulp.src(clientNgFiles)
        .pipe(ngmin({dynamic: true}))
        .pipe(gulp.dest(clientNgDest));
});

gulp.task('css', function () {
	return gulp.src(clientCssFiles)
		.pipe(minifyCss())
		.pipe(gulp.dest(clientCssDest));
});
