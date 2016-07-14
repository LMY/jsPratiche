var mysql = require('mysql');
var bcrypt = require('bcrypt');
var jwt = require('jwt-simple');
var express = require('express');
var router = express.Router();
var passport = require('passport');
var sql = require('../helpers/db.js');
var config = require('../helpers/config.js');


comparePassword = function(passw, user, cb) {
    bcrypt.compare(passw, user.hash, function(err, isMatch) {
        if (err)
            return cb(err);

        cb(null, isMatch);
    });
};

router.post('/', function(req, res) {
	sql(function(err,connection) {
		var query = mysql.format('SELECT * FROM ?? WHERE username=?', ["Utenti", req.body.username]);
		
		connection.query(query, function(err, data) {
			connection.release();
			if (err) throw err;
			
			if (!data || data.length != 1 )
				res.send({success: false, msg: 'Authentication failed.'});
			else
				comparePassword(req.body.password, data[0], function(err, isMatch) {
					if (isMatch && !err) {
						var token = jwt.encode(data, config.secret);
						res.json({success: true, token: 'JWT ' + token});
					} 
					else
						res.send({success: false, msg: 'Authentication failed.'});
				});
		});
	});
});

getToken = function(headers) {
	if (headers && headers.authorization) {
		var parted = headers.authorization.split(' ');
		if (parted.length === 2)
			return parted[1];
		else
			return null;
	}
	else
		return null;
};

router.get('/memberinfo', passport.authenticate('jwt', { session: true }), function(req, res) {
	var token = getToken(req.headers);

	if (token) {
		var decoded = jwt.decode(token, config.secret);
		
		if (!decoded || decoded.length != 1 || !decoded[0].username)
			return res.status(403).send({success: false, msg: 'Authentication failed.'});
		
	    sql(function(err,connection) {
			var query = mysql.format('SELECT * FROM ?? WHERE username=?', ["Utenti", decoded[0].username]);
		
			connection.query(query, function(err, data) {
				connection.release();
				if (!data || data.length != 1)
					return res.status(403).send({success: false, msg: 'Authentication failed.'});
				else
					res.json({success: true, msg: 'Welcome in the member area ' + decoded[0].username + '!'});
			});
		});
	}
	else
		return res.status(403).send({success: false, msg: 'No token provided.'});
});

module.exports = router;