var rest = require('../../helpers/rest.js');
var sql = require('../../helpers/db.js');
var tableName = 'Bookmarks';

var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
	sql.query('SELECT * FROM Bookmarks', function(err, data) {
		if (err) rest.error500(res, err);
		else res.json(data);
	});
});

router.get('/:id', function(req, res, next) {
	var query = sql.format('SELECT * FROM Bookmarks WHERE id=?', [req.params.id]);

	sql.query(query, function(err, data) {
		if (err) rest.error500(res, err);
		else res.json(data.length == 1 ? data[0] : []);
	});
});

router.delete('/:id', function(req, res, next) {
	var query = sql.format('DELETE FROM ?? WHERE iduser=?, idurl=?', [tableName, req.user.id, req.params.id]);

	sql.query(query, function(err, data) {
		if (err) rest.error500(res, err);
		else rest.deleted(res, data);
	});
});

router.post('/', function(req, res, next) {
	var query =  sql.format("INSERT INTO ??(??,??) VALUES (?,?)", [tableName, "idurl", req.params.idurl, "iduser", req.user.id ]);

	sql.query(query, function(err, data) {
		if (err) rest.error500(res, err);
		else rest.created(res, data);
	});
});

module.exports = router;
