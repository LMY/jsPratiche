var bCrypt = require('bcrypt');
var LocalStrategy = require('passport-local').Strategy;
var mysql = require('mysql');
var sql = require('../helpers/db.js');

module.exports = function(passport) {

    passport.serializeUser(function(user, done) {
		done(null, user.id);
    });
	
	passport.deserializeUser(function(id, done) {
		sql(function(err, connection) {
			var query = mysql.format('SELECT * FROM ?? WHERE id=?', ["Utenti", id]);
			
			connection.query(query, function(err, user) {
				done(err, user);
			});
		});
	});
	
	passport.use('login', new LocalStrategy({ passReqToCallback : true }, function(req, username, password, done) { 
		sql(function(err, connection) {
			var query = mysql.format('SELECT * FROM ?? WHERE username=?', ["Utenti", username]);
			connection.query(query, function(err, data) {

				if (err)
					return done(err);

				if (!data || data.length != 1) {
					console.log('User Not Found with username '+username);
					return done(null, false, req.flash('message', 'User Not found.'));                 
				}

				if (!bCrypt.compareSync(password, data[0].hash)) {
					console.log('Invalid Password');
					console.log("data[0].hash: "+data[0].hash);
					console.log("password given: "+password);
					return done(null, false, req.flash('message', 'Invalid Password'));
				}

				return done(null, data[0]);
			});
		});
	}));

}