var bCrypt = require('bcrypt');
var LocalStrategy = require('passport-local').Strategy;
var sql = require('../helpers/db.js');

module.exports = function(passport) {

	var calculatehash = function(input, username) {
		bCrypt.genSalt(8, function (err, salt) {
			bCrypt.hash(input, salt, function(err, hash) {
				console.log("calculatehash: "+hash);

				// on wrong password, set password
				// sql.pool.query('UPDATE '+sql.tables.Utenti+' SET hash=$1 WHERE username=$2', [hash, username], (err, data2) => {
				// 	if (err)
				// 		return done(err);
				// 	else
				// 		return done(null, false, req.flash('message', 'Invalid Password'));
				// });

			});
		});
	}

	// http://stackoverflow.com/questions/17415579/how-to-iso-8601-format-a-date-with-timezone-offset-in-javascript
	var formatLocalDate = function() {
		var now = new Date(),
		tzo = -now.getTimezoneOffset(),
		dif = tzo >= 0 ? '+' : '-',
		pad = function(num) {
			var norm = Math.abs(Math.floor(num));
			return (norm < 10 ? '0' : '') + norm;
		};
		return now.getFullYear()
			+ '-' + pad(now.getMonth()+1)
			+ '-' + pad(now.getDate())
			+ 'T' + pad(now.getHours())
			+ ':' + pad(now.getMinutes())
			+ ':' + pad(now.getSeconds())
			+ dif + pad(tzo / 60)
			+ ':' + pad(tzo % 60);
	}


    passport.serializeUser(function(user, done) {
		done(null, user.id);
    });

	passport.deserializeUser(function(id, done) {

		sql.pool.query('SELECT id,username,userlevel,pareri,correzioni FROM '+sql.tables.Utenti+' WHERE id=$1', [id], (err, user) => {
			// if (err)
			// 	return done(err, "");
			// else
				done(err, user.rows[0]);
		});
	});

	passport.use('login', new LocalStrategy({ passReqToCallback : true }, function(req, username, password, done) {
		sql.pool.query('SELECT * FROM '+sql.tables.Utenti+' WHERE username=$1', [username], (err, results) => {
			if (err)
				return done(err);

			if (!results || results.rows.length != 1) {
//					console.log('User Not Found with username '+username);
				return done(null, false, req.flash('message', 'User Not found.'));
			}

			if (!bCrypt.compareSync(password, results.rows[0].hash)) {

				// because sometimes you forget your hashes
				// console.log('Invalid Password');
				// console.log("results[0].hash: "+results.rows[0].hash);
				// console.log("password given: "+password);
				// calculatehash(password, username);

				return done(null, false, req.flash('message', 'Invalid Password'));
			}
				

			// set lastlogin
			sql.pool.query('UPDATE '+sql.tables.Utenti+' SET lastlogin=$1 WHERE username=$2', [formatLocalDate(), username], (err, data2) => {

				if (err) {
//							console.log("error: "+err);
					return done(err);
				}

				return done(null, results.rows[0]);
			});
		  })
	}));
}
