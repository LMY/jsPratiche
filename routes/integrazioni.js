var mysql = require('mysql');
var sql = require('../helpers/db.js');
var tableName = 'Integrazioni';

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
        connection.query('SELECT * FROM '+tableName+' WHERE idPratica='+req.params.id, function(err, data) {
            if (err) throw err;
	    res.json(data);
	});
    });
});

router.delete('/:id', function(req, res, next) {
    sql(function (err, connection) {
        connection.query('DELETE FROM '+tableName+' WHERE idPratica = '+req.params.id, function(err, data) {
            if (err) throw err;
			res.json(data.length == 1 ? data[0] : []);
        });
    });
});

router.post('/', function(req, res, next) {
    sql(function (err, connection) {
	var query = "INSERT INTO ??(??,??,??,??,??,??) VALUES (?,?,?,?,?,?)";
        var table = [tableName, "idPratica", "dateOUT", "dateIN", "protoOUT", "protoIN", "note", req.body.id, req.body.dateOUT, req.body.dateIN, req.body.protoOUT, req.body.protoIN, req.body.note ];
        query = mysql.format(query, table);
	
        connection.query(query, function(err, data) {
            if (err) throw err;
	    res.json(data);
        });
    });
});

router.put('/:id', function(req, res, next) {
    sql(function (err, connection) {
	var query = "UPDATE ?? SET ?? = ?, ?? = ?, ?? = ?, ?? = ? WHERE ?? = ? AND ?? = ?";
        var table = [tableName, "dateIN", req.body.dateIN, "protoOUT", req.body.protoOUT, "protoIN", req.body.protoIN, "note", req.body.note, "idPratica", req.params.id, "dateOUT", req.body.dateout ];
        query = mysql.format(query, table);
	
        connection.query(query, function(err, data) {
	    if (err) throw err;
            res.json(data);
        });
    });
});

module.exports = router;

