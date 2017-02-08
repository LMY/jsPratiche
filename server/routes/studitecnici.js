var rest = require('../helpers/rest.js');
var sql = require('../helpers/db.js');
var tableName = 'StudiTecnici';

var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
	sql.query('SELECT * FROM '+tableName, function(err, data) {
		if (err) rest.error500(res, err);
		else res.json(data);
	});
});

router.post('/', function(req, res, next) {
	var query = sql.format("INSERT INTO ??(??,??) VALUES (?,?)", [tableName, "name", "pec", req.body.name, req.body.pec]);

	sql.query(query, function(err, data) {
		if (err) rest.error500(res, err);
		else rest.created(res, data);
	});
});

router.get('/:id', function(req, res, next) {
	var query = sql.format('SELECT * FROM ?? WHERE id=?', [tableName, req.params.id]);

	sql.query(query, function(err, data) {
		if (err) rest.error500(res, err);
		else res.json(data.length == 1 ? data[0] : []);
	});
});

router.put('/:id', function(req, res, next) {
	var query = sql.format("UPDATE ?? SET ?? = ?, ?? = ? WHERE ?? = ?", [tableName, "name", req.body.name, "pec", req.body.pec, "id", req.params.id]);

	sql.query(query, function(err, data) {
		if (err) rest.error500(res, err);
		else rest.updated(res, data);
	});
});

router.delete('/:id', function(req, res, next) {
	var query = sql.format('DELETE FROM ?? WHERE id=?', [tableName, req.params.id]);

	sql.query(query, function(err, data) {
		if (err) rest.error500(res, err);
		else rest.deleted(res, data);
	});
});

module.exports = router;
