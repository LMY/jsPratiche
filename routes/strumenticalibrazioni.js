var rest = require('../helpers/rest.js');
var mysql = require('mysql');
var sql = require('../helpers/db.js');
var tableName = 'Calibrazioni';

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
			else res.json(data);
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
		var query = mysql.format("INSERT INTO ??(??,??,??,??,??,??) VALUES (?,?,?,?,?,?)", [tableName, "idCatena", "lab", "certn", "dateCal", "note", "scadenza", req.body.idCatena, req.body.lab, req.body.certn, req.body.dateCal, req.body.note, req.body.scadenza ]);

        connection.query(query, function(err, data) {
            if (err) rest.error500(res, err);
            else rest.created(res, data);
        });
    });
});

router.put('/:id', function(req, res, next) {
    sql(function (err, connection) {
		var query = mysql.format("UPDATE ?? SET ?? = ?, ?? = ?, ?? = ?, ?? = ?, ?? = ? WHERE ?? = ?", [tableName, "idCatena", req.body.idCatena, "lab", req.body.lab, "certn", req.body.certn, "dateCal", req.body.dateCal, "note", req.body.note, "scadenza", req.body.scadenza, "id", req.params.id ]);

        connection.query(query, function(err, data) {
            if (err) rest.error500(res, err);
            else rest.updated(res, data);
        });
    });
});

module.exports = router;
