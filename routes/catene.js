var rest = require('../helpers/rest.js');
var mysql = require('mysql');
var sql = require('../helpers/db.js');
var tableName = 'Catene';

var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
    sql(function(err,connection) {
        connection.query('SELECT Catene.*, T2.lab, T2.certn, T2.dateCal, T2.note as noteCalib, T2.scadenza FROM Catene LEFT JOIN (SELECT * From Calibrazioni WHERE id IN (SELECT id FROM (SELECT id,idCatena,MAX(dateCal) FROM Calibrazioni GROUP BY idCatena) AS T1)) AS T2 ON Catene.id = T2.idCatena', function(err, data) {
            if (err) rest.error500(res, err);
			else res.json(data);
		});
    });
});

router.get('/:id', function(req, res, next) {
    sql(function(err,connection) {
		var query = mysql.format('SELECT Catene.*, T2.lab, T2.certn, T2.dateCal, T2.note as noteCalib, T2.scadenza FROM Catene LEFT JOIN (SELECT * From Calibrazioni WHERE id IN (SELECT id FROM (SELECT id,idCatena,MAX(dateCal) FROM Calibrazioni GROUP BY idCatena) AS T1)) AS T2 ON Catene.id = T2.idCatena WHERE Catene.id=?', [req.params.id]);
				
        connection.query(query, function(err, data) {
            if (err) rest.error500(res, err);
			else res.json(data.length == 1 ? data[0] : []);
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
		var query =  mysql.format("INSERT INTO ??(??,??) VALUES (?,?)", [tableName, "name", "note", req.body.name, req.body.note ]);
		
        connection.query(query, function(err, data) {
            if (err) rest.error500(res, err);
			else rest.created(res, data);
        });
    });
});

router.put('/:id', function(req, res, next) {
    sql(function (err, connection) {
		var query = mysql.format("UPDATE ?? SET ?? = ?, ?? = ? WHERE ?? = ?", [tableName, "name", req.body.name, "note", req.body.note,"id", req.params.id]);
	
        connection.query(query, function(err, data) {
            if (err) rest.error500(res, err);
            else rest.updated(res, data);
        });
    });
});

module.exports = router;