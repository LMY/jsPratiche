var rest = require('../helpers/rest.js');
var mysql = require('mysql');
var sql = require('../helpers/db.js');
var tableName = 'RegistroStrumenti';

var express = require('express');
var router = express.Router();

router.get('/latest', function(req, res, next) {
    sql(function(err,connection) {

        connection.query('SELECT Catene.id, Catene.name as catena, Catene.note as note, T2.id as idRegistro, T2.idCatena, T2.idUtente, T2.timePointFrom, T2.timePointTo, T2.username, T2.sede FROM Catene LEFT JOIN  (SELECT RegistroStrumenti.*, Utenti.username, Sedi.nome as sede, Catene.name as catena FROM RegistroStrumenti INNER JOIN Utenti ON RegistroStrumenti.idUtente = Utenti.id INNER JOIN Sedi on RegistroStrumenti.idSedeTo = Sedi.id INNER JOIN Catene on RegistroStrumenti.idCatena = Catene.id WHERE RegistroStrumenti.id IN (SELECT id FROM (SELECT MAX(id) as id, idCatena FROM RegistroStrumenti GROUP BY idCatena) AS T1)) as T2 ON Catene.id = T2.idCatena', function(err, data) {
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

router.get('/', function(req, res, next) {
    sql(function(err,connection) {

        connection.query('SELECT RegistroStrumenti.*, Utenti.username, Sedi.nome as sede, Catene.name as catena FROM RegistroStrumenti INNER JOIN Utenti ON RegistroStrumenti.idUtente = Utenti.id INNER JOIN Sedi on RegistroStrumenti.idSedeTo = Sedi.id INNER JOIN Catene on RegistroStrumenti.idCatena = Catene.id WHERE RegistroStrumenti.id IN (SELECT id FROM (SELECT MAX(id) as id, idCatena FROM RegistroStrumenti GROUP BY idCatena) AS T1)', function(err, data) {
            if (err) rest.error500(res, err);
			else res.json(data);
		});
    });
});
/*
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
});*/

module.exports = router;