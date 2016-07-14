var mysql = require('mysql');
var bcrypt = require('bcrypt');
var sql = require('../helpers/db.js');
var tableName = 'Utenti';

var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
    sql(function(err,connection) {
        connection.query('SELECT * FROM '+tableName, function(err, data) {
            connection.release();
            if (err) throw err;
			res.json(data);
		});
    });
});

router.get('/:id', function(req, res, next) {
    sql(function(err,connection) {
		var query = mysql.format('SELECT * FROM ?? WHERE id=?', [tableName, req.params.id]);
		
        connection.query(query, function(err, data) {
            connection.release();
            if (err) throw err;
			res.json(data.length == 1 ? data[0] : []);
		});
    });
});

router.delete('/:id', function(req, res, next) {
    sql(function (err, connection) {
		var query = mysql.format('DELETE FROM ?? WHERE id=?', [tableName, req.params.id]);
		
        connection.query(query, function(err, data) {
            connection.release();
            if (err) throw err;
			res.json(data);
        });
    });
});

router.post('/', function(req, res, next) {
    sql(function (err, connection) {
		//
		var reqhash = "";
		bcrypt.genSalt(10, function (err, salt) {
			if (err)
				return next(err);

			bcrypt.hash(req.body.password, salt, function (err, hash) {
				if (err)
					return next(err);

				reqhash = hash;
			});
		});
		
		var query = "INSERT INTO ??(??,??,??,??,??,??,??) VALUES (?,?,?,?,?,?,?)";
        var table = [tableName, "username", "hash", "name", "surname", "email", "phone", "lastlogin", req.body.username, reqhash, req.body.name, req.body.surname, req.body.email, req.body.phone, "NULL"];
        query = mysql.format(query, table);
	
        connection.query(query, function(err, data) {
            connection.release();
            if (err) throw err;
			res.json(data);
        });
    });
});

router.put('/:id', function(req, res, next) {
    sql(function (err, connection) {
	var query = "UPDATE ?? SET ?? = ?, ?? = ?, ?? = ?, ?? = ?, ?? = ?, ?? = ? WHERE ?? = ?";
        var table = [tableName, "username", req.body.username, "hash", md5(req.body.password), "name", req.body.name, "surname", req.body.surname, "email", req.body.email, "phone", req.body.phone, "id", req.params.id];
        query = mysql.format(query, table);
	
        connection.query(query, function(err, data) {
            connection.release();
			if (err) throw err;
            res.json(data);
        });
    });
});

module.exports = router;
