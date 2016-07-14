var express = require('express');
var path = require('path');
//var favicon = require('serve-favicon');

module.exports = function(app, passport) {
	
	var isAuthenticated = function(req, res, next) {
		if (req.isAuthenticated())
			return next();

		res.redirect('/');
	}
		
	//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));	// public/favicon.ico
	app.use(express.static(path.join(__dirname, 'public')));
	app.use("/public", express.static(path.join(__dirname, 'public')));


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
	app.use('/pratiche', isAuthenticated, require('./pratiche'));
	app.use('/integrazioni', isAuthenticated, require('./integrazioni'));
	app.use('/statopratiche', isAuthenticated, require('./statopratiche'));
	
	app.get("/home", isAuthenticated, function(req, res) {
		res.render('app');
	});
	
	app.get('/logout', function(req, res) {
		req.logout();
		res.redirect('/');
	});
}