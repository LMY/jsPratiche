var rest = require('../helpers/rest.js');
var mysql = require('mysql');
var sql = require('../helpers/db.js');
var tableName = 'RegistroStrumenti';

var express = require('express');
var router = express.Router();

router.get('/latest', function(req, res, next) {
    sql(function(err,connection) {

        connection.query('SELECT * FROM Catene INNER JOIN (SELECT * FROM RegistroStrumenti WHERE id IN (SELECT id FROM (SELECT MAX(id) as id, idCatena FROM RegistroStrumenti GROUP BY idCatena))) ON Catene.id = RegistroStrumenti.idCatena', function(err, data) {
            if (err) rest.error500(res, err);
			else res.json(data);
		});
    });
});

router.put('/latest/:id', function(req, res, next) {
	var query = "";

	if (req.body.verb == 'open')
		query = mysql.format("INSERT INTO ??(??,??,??,??,??) VALUES (?,?,?,?,?)", [tableName, "idCatena", "idUtente", "timePointFrom", "timePointTo", "idSeteTo", req.params.id, req.body.idUtente, req.body.timePointFrom, req.body.timePointTo, req.body.idSeteTo ]);
	else if (req.body.verb == 'close')
//		query = mysql.format('UPDATE ?? SET ?? = ?, ?? = ? WHERE id=?', [tableName, "timePointTo", req.body.timePointTo, "idSedeTo", req.body.idSedeTo, req.params.id]);
		query = mysql.format('UPDATE ?? SET ?? = ?, ?? = ? WHERE id=(SELECT MAX(id) as id WHERE idCatena = ? FROM RegistroStrumenti)', [tableName, "timePointTo", req.body.timePointTo, "idSedeTo", req.body.idSedeTo, req.params.id]);
	else {
		rest.error500(res, 'no verb specified');
		return;
	}

    sql(function(err,connection) {
		connection.query(query, function(err, data) {
			if (err) rest.error500(res, err);
			else res.json(data);
		});
    });
});

router.get('/latest/:id', function(req, res, next) {
    sql(function(err,connection) {
		var query = mysql.format('SELECT * FROM ?? WHERE id IN (SELECT MAX(id) as id WHERE idCatena = ? FROM RegistroStrumenti)', [tableName, req.params.id]);

        connection.query(query, function(err, data) {
            if (err) rest.error500(res, err);
			else res.json(data.length == 1 ? data[0] : []);
		});
    });
});

// standard functions
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

// RegistroStrumenti(id, idCatena, idUtente, timePointFrom, timePointTo, idSeteTo);
router.post('/', function(req, res, next) {
    sql(function (err, connection) {
		var query =  mysql.format("INSERT INTO ??(??,??,??,??,??) VALUES (?,?,?,?,?)", [tableName, "idCatena", "idUtente", "timePointFrom", "timePointTo", "idSeteTo", req.body.idCatena, req.body.idUtente, req.body.timePointFrom, req.body.timePointTo, req.body.idSeteTo ]);

        connection.query(query, function(err, data) {
            if (err) rest.error500(res, err);
			else rest.created(res, data);
        });
    });
});

router.put('/:id', function(req, res, next) {
    sql(function (err, connection) {
		var query = mysql.format("UPDATE ?? SET ?? = ?, ?? = ?, ?? = ?, ?? = ?, ?? = ? WHERE ?? = ?", [tableName, "idCatena", req.body.idCatena, "idUtente", req.body.idUtente, "timePointFrom", req.body.timePointFrom, "timePointTo", req.body.timePointTo, "idSeteTo", req.body.idSeteTo, "id", req.params.id]);

        connection.query(query, function(err, data) {
            if (err) rest.error500(res, err);
            else rest.updated(res, data);
        });
    });
});

module.exports = router;