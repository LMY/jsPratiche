var mysql = require('mysql');
var bcrypt = require('bcrypt');
var sql = require('../helpers/db.js');
var tableName = 'Utenti';

var express = require('express');
var router = express.Router();


var calculatehash = function(input) {
	bcrypt.genSalt(8, function (err, salt) {
		bcrypt.hash(input, salt, function(err, hash) {
			return hash;
		});
	});
}

router.get('/', function(req, res, next) {
    sql(function(err,connection) {
        connection.query('SELECT * FROM '+tableName, function(err, data) {
            if (err) throw err;
			res.json(data);
		});
    });
});

router.get('/:id', function(req, res, next) {
    sql(function(err,connection) {
		var query = mysql.format('SELECT * FROM ?? WHERE id=?', [tableName, req.params.id]);
		
        connection.query(query, function(err, data) {
            if (err) throw err;
			res.json(data.length == 1 ? data[0] : []);
		});
    });
});

router.delete('/:id', function(req, res, next) {
    sql(function (err, connection) {
		var query = mysql.format('DELETE FROM ?? WHERE id=?', [tableName, req.params.id]);
		
        connection.query(query, function(err, data) {
            if (err) throw err;
			res.json(data);
        });
    });
});

router.post('/', function(req, res, next) {
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
    sql(function (err, connection) {
	var query = "UPDATE ?? SET ?? = ?, ?? = ?, ?? = ?, ?? = ?, ?? = ?, ?? = ?, ?? = ? WHERE ?? = ?";
		var newhash =  calculatehash(req.body.password);
        var table = [tableName, "username", req.body.username, "hash", newhash, "name", req.body.name, "surname", req.body.surname, "email", req.body.email, "phone", req.body.phone, "userlevel", req.body.userlevel, "id", req.params.id];
        query = mysql.format(query, table);
	
        connection.query(query, function(err, data) {
			if (err) throw err;
            res.json(data);
        });
    });
});

module.exports = router;
