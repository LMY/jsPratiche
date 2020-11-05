const gulp = require('gulp');
const concat = require('gulp-concat');
const rename = require('gulp-rename');
const uglify = require('gulp-uglify');
const babel = require('gulp-babel');
const htmlMin = require('gulp-htmlmin');
const ngAnnotate = require('gulp-ng-annotate');
const stripDebug = require('gulp-strip-debug');
const size = require('gulp-size');
const cleanCSS = require('gulp-clean-css');


var clientNgFiles = ['client/app.js', 'client/controllers/*.js' ],
	clientNgDest = 'dist';

var clientHtmlFiles = 'client/app.html',
	clientHtmlDest = 'dist';

var clientHtmlTemplateFiles = 'client/templates/*.html',
	clientHtmlTemplateDest = 'dist/templates';
	
var clientCssFiles = ['client/css/*.css', 'client/libs/bootstrap/dist/css/bootstrap.min.css', 'client/libs/eonasdan-bootstrap-datetimepicker/build/css/bootstrap-datetimepicker.min.css'],
	clientCssDest = 'dist/css';

var clientImgFiles = 'client/imgs/*',
	clientImgDest = 'dist/imgs';

var libFiles = 	[ 'client/libs/jquery/dist/jquery.min.js',
					'client/libs/angular/angular.min.js',
					'client/libs/angular-route/angular-route.min.js',
					'client/libs/angular-resource/angular-resource.min.js',
					'client/libs/bootstrap/dist/js/bootstrap.min.js',
					'client/libs/moment/min/moment.min.js',
					'client/libs/angular-modal-service/dst/angular-modal-service.min.js',
					'client/libs/eonasdan-bootstrap-datetimepicker/build/js/bootstrap-datetimepicker.min.js',
					'client/libs/angular-bootstrap-datetimepicker-directive/angular-bootstrap-datetimepicker-directive.min.js' ],
	libDest = 'dist/libs';
	

gulp.task('js', function() {
	return gulp.src(clientNgFiles)
//		.pipe(babel({ presets: ['es2017', 'es2016', 'es2015'] }))
		.pipe(babel({ presets: ['@babel/preset-env'] }))
//        .pipe(stripDebug())
		.pipe(concat('app.js'))
		.pipe(gulp.dest(clientNgDest))		
        .pipe(rename('app.min.js'))
		.pipe(ngAnnotate())
        .pipe(uglify())
        .pipe(size())		
		.pipe(gulp.dest(clientNgDest));
});

gulp.task('libs', function() {
	return gulp.src(libFiles)
        .pipe(stripDebug())	
		.pipe(concat('libs.js'))
		.pipe(gulp.dest(libDest))		
        .pipe(rename('libs.min.js'))
        .pipe(uglify())
        .pipe(size())		
		.pipe(gulp.dest(libDest));
});

gulp.task('html-main', function() {
	return gulp.src(clientHtmlFiles)
        .pipe(htmlMin({ collapseWhitespace: true }))
		.pipe(gulp.dest(clientHtmlDest));
});

gulp.task('html-templates', function() {
	return gulp.src(clientHtmlTemplateFiles)
        .pipe(htmlMin({ collapseWhitespace: true }))
		.pipe(gulp.dest(clientHtmlTemplateDest));
});

gulp.task('css', function () {
	return gulp.src(clientCssFiles)
		.pipe(cleanCSS({compatibility: 'ie8'}))
		.pipe(concat('main.css'))		
		.pipe(gulp.dest(clientCssDest));
});

gulp.task('fonts', function () {
	return gulp.src([ 'client/libs/bootstrap/dist/fonts/glyphicons-halflings-regular.woff', 'client/libs/bootstrap/dist/fonts/glyphicons-halflings-regular.woff2' ])
		.pipe(gulp.dest('dist/fonts'));
});

gulp.task('images', function () {
	return gulp.src('client/imgs/*')
		.pipe(gulp.dest('dist/imgs/'));
});


gulp.task('html', gulp.parallel('html-main', 'html-templates'));
gulp.task('angular', gulp.parallel('html', 'js'));
gulp.task('all', gulp.parallel('js', 'html-main', 'html-templates', 'css', 'images', 'libs', 'fonts'));


// WATCHES

gulp.task('watch-html-main', function() {
	gulp.watch(clientHtmlFiles, ['html-main']);
});

gulp.task('watch-html-templates', function() {
	gulp.watch([clientHtmlTemplateFiles], ['html-templates']);
});

gulp.task('watch-js', function() {
	gulp.watch(clientNgFiles, ['js']);
});

gulp.task('watch-html', gulp.parallel('watch-html-main', 'watch-html-templates'));
gulp.task('watch-angular', gulp.parallel('watch-html', 'watch-js'));
