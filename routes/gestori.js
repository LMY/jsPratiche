var mysql = require('mysql');
var sql = require('../helpers/db.js');
var tableName = 'Gestori';

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

router.post('/', function(req, res, next) {
    sql(function (err, connection) {
		var query = mysql.format("INSERT INTO ??(??,??) VALUES (?,?)", [tableName, "name", "pec", req.body.name, req.body.pec]);

        connection.query(query, function(err, data) {
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

router.put('/:id', function(req, res, next) {
    sql(function (err, connection) {
        var query = mysql.format("UPDATE ?? SET ?? = ?, ?? = ? WHERE ?? = ?", [tableName, "name", req.body.name, "pec", req.body.pec, "id", req.params.id]);
	
        connection.query(query, function(err, data) {
			connection.release();
			if (err) throw err;
            res.json(data);
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

module.exports = router;
