var rest = require('../helpers/rest.js');
var mysql = require('mysql');
var sql = require('../helpers/db.js');
var tableName = 'Integrazioni';

var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
    sql(function(err,connection) {
        connection.query('SELECT * FROM '+tableName, function(err, data) {
            if (err) rest.error500(res, err);
			else res.json(data);
		});
    });
});

router.get('/:id', function(req, res, next) {
    sql(function(err,connection) {
		var query = mysql.format('SELECT * FROM ?? WHERE id=?', [tableName, req.params.id]);

        connection.query(query, function(err, data) {
            if (err) rest.error500(res, err);
			else res.json(data);	// return ARRAY of integrazioni
		});
    });
});

router.delete('/:id', function(req, res, next) {
    sql(function (err, connection) {
		var query = mysql.format('DELETE FROM ?? WHERE id=?', [tableName, req.params.id]);

        connection.query(query, function(err, data) {
            if (err) rest.error500(res, err);
            else rest.deleted(res, data);
        });
    });
});

router.post('/', function(req, res, next) {
    sql(function (err, connection) {
		var query = mysql.format("INSERT INTO ??(??,??,??,??,??) VALUES (?,?,?,?,?)",
						[tableName, "dateOUT", "dateIN", "protoOUT", "protoIN", "note", req.body.dateOUT, req.body.dateIN, req.body.protoOUT, req.body.protoIN, req.body.note ]);

        connection.query(query, function(err, data) {
            if (err) rest.error500(res, err);
            else rest.created(res, data);
        });
    });
});

router.put('/:id', function(req, res, next) {
    sql(function (err, connection) {
		var query = mysql.format("UPDATE ?? SET ?? = ?, ?? = ?, ?? = ?, ?? = ?, ?? = ? WHERE ?? = ?",
						[tableName, "dateOUT", req.body.dateOUT, "dateIN", req.body.dateIN, "protoOUT", req.body.protoOUT, "protoIN", req.body.protoIN, "note", req.body.note, "id", req.params.id ]);

        connection.query(query, function(err, data) {
            if (err) rest.error500(res, err);
            else rest.updated(res, data);
        });
    });
});

module.exports = router;
