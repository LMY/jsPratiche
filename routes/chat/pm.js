var rest = require('../../helpers/rest.js');
var sql = require('../../helpers/db.js');
var tableName = 'PrivateMessages';

var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
	var query = sql.format("SELECT PrivateMessages.*, Utenti.username FROM PrivateMessages LEFT JOIN Utenti on PrivateMessages.userfrom = Utenti.id WHERE userto=?", [req.user.id]);

	sql.connect(function (err, connection) {
		connection.query(query, function(err, data1) {
			if (err) rest.error500(res, err);
			else {
				var query2 = sql.format("UPDATE PrivateMessages SET readen=1 WHERE userto=? AND readen=0", [req.user.id]);
				
				connection.query(query2, function(err, data2) {
					if (err) rest.error500(res, err);
					else res.json(data1);
				});
			}
		});
	});
});

router.get('/count', function(req, res, next) {
	var query = sql.format('SELECT count(*) as pms FROM PrivateMessages WHERE readen=0 AND userto=?', [req.user.id]);

	sql.query(query, function(err, data) {
		if (err) rest.error500(res, err);
		else res.json(data[0].pms);
	});
});

router.get('/new', function(req, res, next) {
	var query = sql.format("SELECT PrivateMessages.*, Utenti.username FROM PrivateMessages LEFT JOIN Utenti on PrivateMessages.userfrom = Utenti.id WHERE userto=? AND readen=0", [req.user.id]);

	sql.connect(function (err, connection) {
		connection.query(query, function(err, data1) {
			if (err) rest.error500(res, err);
			else {
				var query2 = sql.format("UPDATE PrivateMessages SET readen=1 WHERE userto=? AND readen=0", [req.user.id]);
				
				connection.query(query2, function(err, data2) {
					if (err) rest.error500(res, err);
					else res.json(data1);
				});
			}
		});
	});
});

router.get('/sent', function(req, res, next) {
	var query =  sql.format("SELECT * FROM PrivateMessages WHERE userfrom=?", [req.user.id]);

	sql.query(query, function(err, data) {
		if (err) rest.error500(res, err);
		else res.json(data);
	});
});

router.get('/:id', function(req, res, next) {
	var query = sql.format('SELECT * FROM PrivateMessages WHERE id=?', [req.params.id]);

	sql.query(query, function(err, data) {
		if (err) rest.error500(res, err);
		else res.json(data.length == 1 ? data[0] : []);
	});
});

router.delete('/:id', function(req, res, next) {
	var query = sql.format('DELETE FROM ?? WHERE id=?', [tableName, req.params.id]);

	sql.query(query, function(err, data) {
		if (err) rest.error500(res, err);
		else rest.deleted(res, data);
	});
});

router.post('/', function(req, res, next) {
	var query =  sql.format("INSERT INTO ??(??,??,??,??,??) VALUES (?,?,?,?,CURRENT_TIMESTAMP())", [tableName, "userfrom", "userto", "msg", "readen", "timePoint", req.user.id, req.body.userto, req.body.msg, 1]);

	sql.query(query, function(err, data) {
		if (err) rest.error500(res, err);
		else rest.created(res, data);
	});
});

router.put('/:id', function(req, res, next) {
	var query = sql.format("UPDATE ?? SET ?? = ?, ?? = ? WHERE ?? = ?", [tableName, "msg", req.body.msg, "readen", req.body.readen,"id", req.params.id]);

	sql.query(query, function(err, data) {
		if (err) rest.error500(res, err);
		else rest.updated(res, data);
	});
});

module.exports = router;
