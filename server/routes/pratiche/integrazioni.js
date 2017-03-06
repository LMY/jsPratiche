var rest = require('../../helpers/rest.js');
var sql = require('../../helpers/db.js');
var tableName = 'Integrazioni';

var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
	sql.query('SELECT * FROM '+tableName, function(err, data) {
		if (err) rest.error500(res, err);
		else res.json(data);
	});
});

router.get('/:id', function(req, res, next) {
	var query = sql.format('SELECT * FROM ?? WHERE id=?', [tableName, req.params.id]);

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
	var query = sql.format("INSERT INTO ??(??,??,??,??,??,??) VALUES (?,?,?,?,?,?)",
					[tableName, "dateOUT", "dateIN", "protoOUT", "protoIN", "ostativi", "note", req.body.dateOUT, req.body.dateIN, req.body.protoOUT, req.body.protoIN, req.body.ostativi, req.body.note ]);

	sql.query(query, function(err, data) {
		if (err) rest.error500(res, err);
		else rest.created(res, data);
	});
});

router.put('/:id', function(req, res, next) {
	var query = sql.format("UPDATE ?? SET ?? = ?, ?? = ?, ?? = ?, ?? = ?, ?? = ?, ?? = ? WHERE ?? = ?",
					[tableName, "dateOUT", req.body.dateOUT, "dateIN", req.body.dateIN, "protoOUT", req.body.protoOUT, "protoIN", req.body.protoIN, "ostativi", req.body.ostativi, "note", req.body.note, "id", req.params.id ]);

	sql.query(query, function(err, data) {
		if (err) rest.error500(res, err);
		else rest.updated(res, data);
	});
});

module.exports = router;
