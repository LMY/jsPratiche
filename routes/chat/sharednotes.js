var rest = require('../../helpers/rest.js');
var sql = require('../../helpers/db.js');
var tableName = 'SharedNotes';

var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
	sql.query('SELECT SharedNotes.*, Utenti.username FROM SharedNotes LEFT JOIN Utenti on SharedNotes.create_user = Utenti.id', function(err, data) {
		if (err) rest.error500(res, err);
		else res.json(data);
	});
});

router.get('/:id', function(req, res, next) {
	var query = sql.format('SELECT * FROM SharedNotes WHERE id=?', [req.params.id]);

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
	var query =  sql.format("INSERT INTO ??(??,??,??) VALUES (?,?, NOW())", [tableName, "create_user", "text", "create_timePoint", req.user.id, req.body.text ]);

	sql.query(query, function(err, data) {
		if (err) rest.error500(res, err);
		else rest.created(res, data);
	});
});

router.put('/:id', function(req, res, next) {
	var query = sql.format("UPDATE ?? SET ?? = ?, ?? = ?, create_timePoint=create_timePoint WHERE ?? = ?", [tableName, "text", req.body.text, "mod_user", req.user.id, "id", req.params.id]);

	sql.query(query, function(err, data) {
		if (err) rest.error500(res, err);
		else rest.updated(res, data);
	});
});

module.exports = router;
