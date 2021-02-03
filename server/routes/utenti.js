var rest = require('../helpers/rest.js');
var bCrypt = require('bcrypt');
var sql = require('../helpers/db.js');

var express = require('express');
var router = express.Router();


var calculatehash = function(input, cb) {
	bCrypt.genSalt(8, function(err, salt) {
		bCrypt.hash(input, salt, function(err, hash) {
			cb(err, hash);
			//return hash;
		});
	});
}

var getUserLevel = function(inputid, cb) {

	sql.pool.query('SELECT * FROM '+sql.tables.Utenti+' WHERE id=$1', [inputid], function(err, data) {
		var ret = false;
		if (err);
		else if (!data || !data.rows || data.rows.length != 1);
		else ret = data.rows[0].userlevel;
		cb(ret);
	});
};

var checkPassword = function(id, password, cb, errcb) {

	if (!id || !password)	{	// ensure they do exist
		err("old password not provided");
		return;
	}

	sql.pool.query('SELECT * FROM '+sql.tables.Utenti+' WHERE id=$1', [id], function(err, data) {

		if (!err && data && data.rows && data.rows.length == 1 && bCrypt.compareSync(password, data.rows[0].hash))
			return cb();
		else
			errcb("wrong password");
	});
}

router.get('/me', function(req, res, next) {
	res.json({
		id: req.user.id,
		username: req.user.username,
		userlevel: req.user.userlevel,
		pareri: req.user.pareri,
		correzioni: req.user.correzioni
	});
});


router.get('/', function(req, res, next) {
	sql.pool.query('SELECT id, username, name, surname, email, phone, lastlogin, userlevel FROM '+sql.tables.Utenti, function(err, data) {
		if (err) rest.error500(res, err);
		else res.json(data.rows);
	});
});

router.get('/:id', function(req, res, next) {
	sql.pool.query('SELECT id, username, name, surname, email, phone, lastlogin, userlevel FROM '+sql.tables.Utenti+' WHERE id=$1', [req.params.id], function(err, data) {
		if (err) rest.error500(res, err);
		else res.json(data.rows.length == 1 ? data.rows[0] : []);
	});
});

router.delete('/:id', function(req, res, next) {

	getUserLevel(req.params.id, function(requserlvl) {
		// a normal user cannot delete an account <= level. superuser(lvl=0) can delete anything
		if (req.user.userlevel != 0 && requserlvl <= req.user.userlevel)
			rest.error403(res);
		else {
			sql.pool.query('DELETE FROM '+sql.tables.Utenti+' WHERE id=$1', [req.params.id], function(err, data) {
				if (err) rest.error500(res, err);
				else rest.deleted(res, data.rows);
			});
		}
	});
});

router.post('/', function(req, res, next) {

	// a normal user cannot create users
	if (req.user.userlevel != 0)
		rest.error403(res);
	else
		calculatehash(req.body.password, function(err, newhash) {
			sql.pool.query('INSERT INTO '+sql.tables.Utenti+'("username", "hash", "name", "surname", "email", "phone", "lastlogin", "userlevel") VALUES ($1,$2,$3,$4,$5,$6,$7,$8)',
			 [req.body.username, newhash, req.body.name, req.body.surname, req.body.email, req.body.phone, null, 1], function(err, data) {
				if (err) rest.error500(res, err);
				else rest.created(res, data.rows);
			});
		});
});

router.put('/:id', function(req, res, next) {

	if (req.user.userlevel != 0 && req.user.id != req.params.id)					// a normal user cannot update other users
		rest.error403(res);
	else if (req.user.userlevel != 0 && req.user.userlevel != req.body.userlevel)	// normal users cannot change (his own) level
		rest.error403(res);
	else
		calculatehash(req.body.password, function(err, newhash) {
			sql.pool.query('UPDATE '+sql.tables.Utenti+' SET "username" = $1, "name" = $2, "surname" = $3, "email" = $4, "phone" = $5, "userlevel" = $6 WHERE "id" = $7',
			[req.body.username, req.body.name, req.body.surname, req.body.email, req.body.phone, req.body.userlevel, req.params.id], function(err, data) {
				if (err) rest.error500(res, err);
				else rest.updated(res, data.rows);
			});
		});
});

router.put('/password/:id', function(req, res, next) {

	// a normal user cannot update other users passwords
	if (req.user.userlevel != 0 && req.user.id != req.params.id)
		rest.error403(res);
	else {
		checkPassword(req.user.id, req.body.oldpassword, function() {
			calculatehash(req.body.password, function(err, newhash) {
				sql.pool.query('UPDATE '+sql.tables.Utenti+' SET "hash" = $1 WHERE "id" = $2', [newhash,  req.params.id], function(err, data) {
					if (err) rest.error500(res, err);
					else rest.updated(res, data.rows);
				});
			});
		},
		function(err) {
			rest.error403(res);
		});
	}
});

module.exports = router;
