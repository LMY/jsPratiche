var bCrypt = require('bcrypt');
var LocalStrategy = require('passport-local').Strategy;
var mysql = require('mysql');
var sql = require('../helpers/db.js');

module.exports = function(passport) {

	var calculatehash = function(input) {
		bCrypt.genSalt(8, function (err, salt) {
			bCrypt.hash(input, salt, function(err, hash) {
				return hash;
			});
		});
	}

    passport.serializeUser(function(user, done) {
		done(null, user.id);
    });
	
	passport.deserializeUser(function(id, done) {
		sql(function(err, connection) {
			var query = mysql.format('SELECT id,username,userlevel FROM ?? WHERE id=?', ["Utenti", id]);
			
			connection.query(query, function(err, user) {
				done(err, user[0]);
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
//					console.log('User Not Found with username '+username);
					return done(null, false, req.flash('message', 'User Not found.'));                 
				}

				if (!bCrypt.compareSync(password, data[0].hash)) {
//					console.log('Invalid Password');
//					console.log("data[0].hash: "+data[0].hash);
//					console.log("password given: "+password);
//					console.log("should be: "+calculatehash(password));
					return done(null, false, req.flash('message', 'Invalid Password'));
				}

				// set lastlogin
				sql(function(err, connection) {
					var timestamp = new Date().toISOString(); //.slice(0, 19).replace('T', ' ');

					var query2 = mysql.format('UPDATE ?? SET lastlogin=? WHERE username=?', ["Utenti", timestamp, username]);
					connection.query(query2, function(err, data2) {

						if (err) {
//							console.log("error: "+err);
							return done(err);
						}
						console.log("error: ");
						return done(null, data[0]);
					});
				});	
			});
		});
	}));

}