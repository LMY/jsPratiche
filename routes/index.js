var express = require('express');
var path = require('path');
//var favicon = require('serve-favicon');

module.exports = function(app, passport) {

	var isAuthenticated = function(req, res, next) {
		if (req.isAuthenticated())
			return next();

		res.redirect('/login');
	}

	//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));	// public/favicon.ico
	app.use("/public", isAuthenticated, express.static(path.join(__dirname, '../public')));

	app.get('/', function(req, res) {
		res.render('index', { message: req.flash('message') });
	});

	app.get('/login', function(req, res) {
		res.render('login', { message: req.flash('message') });
	});

    app.post('/login', passport.authenticate('login', {
        successRedirect : '/home',
        failureRedirect : '/login',
        failureFlash : true
    }));

	app.use('/utenti', isAuthenticated, require('./utenti'));
	app.use('/gestori', isAuthenticated, require('./gestori'));
	app.use('/comuni', isAuthenticated, require('./comuni'));
	app.use('/sedi', isAuthenticated, require('./sedi'));
	app.use('/pratiche', isAuthenticated, require('./pratiche'));
	app.use('/integrazioni', isAuthenticated, require('./integrazioni'));
	app.use('/statopratiche', isAuthenticated, require('./statopratiche'));

	app.use('/strumenti', isAuthenticated, require('./strumenti'));
	app.use('/catene', isAuthenticated, require('./catene'));
	app.use('/strumentiregistro', isAuthenticated, require('./strumentiregistro'));
	app.use('/strumenticalibrazioni', isAuthenticated, require('./strumenticalibrazioni'));

	app.get("/home", isAuthenticated, function(req, res) {
		res.render('app');
	});

	app.get("/test", isAuthenticated, function(req, res) {
		res.render('test');
	});

	app.get('/logout', function(req, res) {
		req.logout();
		res.redirect('/');
	});
}