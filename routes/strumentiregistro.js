var rest = require('../helpers/rest.js');
var mysql = require('mysql');
var sql = require('../helpers/db.js');
var tableName = 'RegistroStrumenti';

var express = require('express');
var router = express.Router();

router.get('/latest', function(req, res, next) {
    sql(function(err,connection) {
        connection.query('SELECT Catene.*, T2.idCatena, T2.idUtente, T2.timePointFrom, T2.timePointTo, T2.username, T2.sede, T2.catena FROM Catene LEFT JOIN (SELECT RegistroStrumenti.*, Utenti.username, Sedi.nome as sede, Catene.name as catena FROM RegistroStrumenti LEFT JOIN Utenti ON RegistroStrumenti.idUtente = Utenti.id LEFT JOIN Sedi on RegistroStrumenti.idSedeTo = Sedi.id LEFT JOIN Catene on RegistroStrumenti.idCatena = Catene.id WHERE RegistroStrumenti.id IN (SELECT MAX(id) FROM RegistroStrumenti GROUP BY idCatena))  as T2 ON Catene.id = T2.idCatena', function(err, data) {
            if (err) rest.error500(res, err);
			else res.json(data);
		});
    });
});

router.put('/latest/:id', function(req, res, next) {

	if (req.body.verb == 'open') {
		var query = mysql.format("INSERT INTO ??(??,??,??) VALUES (?,?,?)", [tableName, "idCatena", "idUtente", "timePointFrom", req.params.id, req.body.idUtente, req.body.timePointFrom ]);
		sql(function(err,connection) {

			connection.query(query, function(err, data) {
				if (err) rest.error500(res, err);
				else res.json(data);
			});
		});
	}
	else if (req.body.verb == 'close') {
		var query1 = mysql.format('SELECT MAX(id) as id FROM RegistroStrumenti WHERE idCatena = ?', [req.params.id]);
		sql(function(err, connection) {
			connection.query(query1, function(err, data) {
				if (err || data.length != 1) rest.error500(res, err);
				else {
					var query2 = mysql.format('UPDATE ?? SET timePointFrom = timePointFrom, ?? = ?, ?? = ?  WHERE id=?', [tableName, "timePointTo", req.body.timePointTo, "idSedeTo", req.body.idSedeTo, data[0].id]);

					sql(function(err,connection) {
						connection.query(query2, function(err, data) {
							if (err) rest.error500(res, err);
							else res.json(data);
						});
					});
				}
			});
		});
	}
	else {
		rest.error500(res, 'no verb specified');
		return;
	}
});

router.get('/', function(req, res, next) {
    sql(function(err,connection) {

        connection.query('SELECT RegistroStrumenti.*, Utenti.username, Sedi.nome as sede, Catene.name as catena FROM RegistroStrumenti LEFT JOIN Utenti ON RegistroStrumenti.idUtente = Utenti.id LEFT JOIN Sedi on RegistroStrumenti.idSedeTo = Sedi.id LEFT JOIN Catene ON RegistroStrumenti.idCatena = Catene.id', function(err, data) {
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