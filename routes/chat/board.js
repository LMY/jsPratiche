var rest = require('../../helpers/rest.js');
var sql = require('../../helpers/db.js');
var tableName = 'Messages';

var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
	sql.query('SELECT Messages.*, Utenti.username FROM Messages LEFT JOIN Utenti on Messages.userfrom = Utenti.id', function(err, data) {
		if (err) rest.error500(res, err);
		else res.json(data);
	});
});

router.get('/sent', function(req, res, next) {
	var query =  sql.format("SELECT Messages.*, Utenti.username FROM Messages LEFT JOIN Utenti on Messages.userfrom = Utenti.id WHERE userfrom=?", [req.user.id]);

	sql.query(query, function(err, data) {
		if (err) rest.error500(res, err);
		else res.json(data);
	});
});

router.get('/:id', function(req, res, next) {
	var query = sql.format('SELECT * FROM Messages WHERE id=?', [req.params.id]);

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
	var query =  sql.format("INSERT INTO ??(??,??,??) VALUES (?,?, CURRENT_TIMESTAMP())", [tableName, "userfrom", "msg", "timePoint", req.user.id, req.body.msg ]);

	sql.query(query, function(err, data) {
		if (err) rest.error500(res, err);
		else rest.created(res, data);
	});
});

router.put('/:id', function(req, res, next) {
	var query = sql.format("UPDATE ?? SET ?? = ? WHERE ?? = ?", [tableName, "msg", req.body.msg, "id", req.params.id]);

	sql.query(query, function(err, data) {
		if (err) rest.error500(res, err);
		else rest.updated(res, data);
	});
});

module.exports = router;
