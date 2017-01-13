var path = require('path');
const fs = require('fs');

module.exports = function(config, dirpath) {

	var listDirs = function(path) {

		const files = fs.readdirSync(path);
		const ret = [];
		var k=0;

		if (!path.endsWith('/'))
			path += '/';

		for (var i=0; i<files.length; i++) {
			if (files[i].startsWith('.'))
				continue;

			if (fs.statSync(path+files[i]).isDirectory())
				ret[k++] = files[i];
		}

		return ret;
	}

	var isAuthenticated = function(req, res, next) {
		if (req.isAuthenticated())
			return next();

		res.redirect('/login');
	}

	config.app.use("/dist", isAuthenticated, config.deps.express.static(path.join(__dirname, '../../dist')));

	config.app.get('/', function(req, res) {
		//res.sendFile(path.join(__dirname, '../../client', 'index.html'));
		res.redirect('/login');
	});	

	config.app.get('/login', function(req, res) {
		res.render('login', { message: req.flash('message') });
	});

    config.app.post('/login', config.deps.passport.authenticate('login', {
        successRedirect : '/home',
        failureRedirect : '/login',
        failureFlash : true
    }));

	// app router
	config.app.use('/utenti', isAuthenticated, require('./utenti'));
	config.app.use('/gestori', isAuthenticated, require('./gestori'));
	config.app.use('/comuni', isAuthenticated, require('./comuni'));
	config.app.use('/aas', isAuthenticated, require('./aas'));

	// for each subfolder, route it
	listDirs(dirpath).forEach(f => {
		if (fs.existsSync(dirpath+'/'+f+'/index.js')) {
//			console.log("use('"+'/'+f+"', "+"'./"+f+"/index.js" +"');");
			config.app.use('/'+f, isAuthenticated, require('./'+f+'/index.js')(config, './'+f));
		}
	});

	config.app.get("/home", isAuthenticated, function(req, res) {
		res.sendFile(path.join(__dirname, '../../client', 'app.html'));
	});

	config.app.get("/test", isAuthenticated, function(req, res) {
		res.sendFile(path.join(__dirname, '../../client', 'test.html'));
	});

	config.app.get('/logout', function(req, res) {
		req.logout();
		res.redirect('/');
	});
}
