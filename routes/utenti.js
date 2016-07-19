var mysql = require('mysql');
var bCrypt = require('bcrypt');
var sql = require('../helpers/db.js');
var tableName = 'Utenti';

var express = require('express');
var router = express.Router();


var calculatehash = function(input) {
	bCrypt.genSalt(8, function (err, salt) {
		bCrypt.hash(input, salt, function(err, hash) {
			return hash;
		});
	});
}

var getUserLevel = function(inputid, cb) {
	sql(function(err,connection) {
		var query = mysql.format('SELECT * FROM ?? WHERE id=?', [tableName, inputid]);
				
		connection.query(query, function(err, data) {
			var ret = false;
			if (err);
			else if (!data || data.length != 1);
			else ret = data[0].userlevel;	
			cb(ret);
		});
    });
};

var checkPassword = function(id, password, cb, err) {
	if (id && password)	{	// ensure they do exist
		err("old password not provided");
		return;
	}
		
	sql(function(err, connection) {
		var query = mysql.format('SELECT * FROM ?? WHERE id=?', [tableName, id]);
		connection.query(query, function(err, data) {
			if (!err && data && data.length == 1 && bCrypt.compareSync(password, data[0].hash))
				return cb();
			else
				err("wrong password");
		});
	});	
}


router.get('/', function(req, res, next) {
    sql(function(err,connection) {
        connection.query('SELECT id, username, name, surname, email, phone, lastlogin, userlevel FROM '+tableName, function(err, data) {
            if (err) throw err;
			res.json(data);
		});
    });
});

router.get('/:id', function(req, res, next) {
	sql(function(err,connection) {
		var query = mysql.format('SELECT id, username, name, surname, email, phone, lastlogin, userlevel FROM ?? WHERE id=?', [tableName, req.params.id]);
		
		connection.query(query, function(err, data) {
			if (err) throw err;
			res.json(data.length == 1 ? data[0] : []);
		});
	});
});

router.delete('/:id', function(req, res, next) {
	
	getUserLevel(req.params.id, function(requserlvl) {
		// a normal user cannot delete an account <= level. superuser(lvl=0) can delete anything
		if (req.user.userlevel != 0 && requserlvl <= req.user.userlevel)
			res.render("error", {message:"not authorized"});
		else
			sql(function (err, connection) {
				var query = mysql.format('DELETE FROM ?? WHERE id=?', [tableName, req.params.id]);
				
				connection.query(query, function(err, data) {
					if (err) throw err;
					res.json(data);
				});
			});
	});
});

router.post('/', function(req, res, next) {

	// a normal user cannot create users
	if (req.user.userlevel != 0)
		res.render("error", {message:"not authorized"});
	else
		sql(function (err, connection) {

			var reqhash = calculatehash(req.body.password);
			
			var query = "INSERT INTO ??(??,??,??,??,??,??,??,??) VALUES (?,?,?,?,?,?,?,?)";
			var table = [tableName, "username", "hash", "name", "surname", "email", "phone", "lastlogin", "userlevel", req.body.username, reqhash, req.body.name, req.body.surname, req.body.email, req.body.phone, "NULL", 1];
			query = mysql.format(query, table);
		
			connection.query(query, function(err, data) {
				if (err) throw err;
				res.json(data);
			});
		});
});

router.put('/:id', function(req, res, next) {
	
	// a normal user cannot update other users
	if (req.user.userlevel != 0 && req.user.id != req.params.id)
		res.render("error", {message:"not authorized"});
	else
		sql(function (err, connection) {
		var query = "UPDATE ?? SET ?? = ?, ?? = ?, ?? = ?, ?? = ?, ?? = ?, ?? = ? WHERE ?? = ?";
			var newhash =  calculatehash(req.body.password);
			var table = [tableName, "username", req.body.username, "name", req.body.name, "surname", req.body.surname, "email", req.body.email, "phone", req.body.phone, "userlevel", req.body.userlevel, "id", req.params.id];
			query = mysql.format(query, table);
		
			connection.query(query, function(err, data) {
				if (err) throw err;
				res.json(data);
			});
		});
});

router.put('/password/:id', function(req, res, next) {
	
	// a normal user cannot update other users passwords
	if (req.user.userlevel != 0 && req.user.id != req.params.id)
		res.render("error", {message:"not authorized"});
	else {
		
		checkPassword(req.user.id, req.body.oldpassword, function() {
			sql(function (err, connection) {
				var query = "UPDATE ?? SET ?? = ? WHERE ?? = ?";
				var newhash =  calculatehash(req.body.password);
				var table = [tableName, "hash", newhash, "id", req.params.id];
				query = mysql.format(query, table);
			
				connection.query(query, function(err, data) {
					if (err) throw err;
					res.json(data);
				});
			});
		},
		function(err) {
			res.render("error", { message: err });
		});
	}
});

module.exports = router;
