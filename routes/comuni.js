var mysql = require('mysql');
var sql = require('../helpers/db.js');
var tableName = 'Comuni';

var express = require('express');
var router = express.Router();

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
        connection.query('SELECT * FROM '+tableName+' WHERE id='+req.params.id, function(err, data) {
            if (err) throw err;
			res.json(data.length == 1 ? data[0] : []);
	});
    });
});

router.delete('/:id', function(req, res, next) {
    sql(function (err, connection) {
        connection.query('DELETE FROM '+tableName+' WHERE id = '+req.params.id, function(err, data) {
            if (err) throw err;
	    res.json(data);
        });
    });
});

router.post('/', function(req, res, next) {
    sql(function (err, connection) {
	var query = "INSERT INTO ??(??,??) VALUES (?,?)";
        var table = [tableName, "name", "pec", req.body.name, req.body.pec ];
        query = mysql.format(query, table);
	
        connection.query(query, function(err, data) {
            if (err) throw err;
	    res.json(data);
        });
    });
});

router.put('/:id', function(req, res, next) {
    sql(function (err, connection) {
	var query = "UPDATE ?? SET ?? = ?, ?? = ? WHERE ?? = ?";
        var table = [tableName, "name", req.body.name, "pec", req.body.pec, "id", req.params.id];
        query = mysql.format(query, table);
	
        connection.query(query, function(err, data) {
	    if (err) throw err;
            res.json(data);
        });
    });
});

module.exports = router;

