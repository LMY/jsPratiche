var rest = require('../../helpers/rest.js');
var sql = require('../../helpers/db.js');

var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
	sql.pool.query('SELECT * FROM '+sql.tables.Calibrazioni, function(err, data) {
		if (err) rest.error500(res, err);
		else res.json(data.rows);
	});
});

router.get('/catena/:id', function(req, res, next) {
	sql.pool.query('SELECT * FROM ' + sql.tables.Calibrazioni + ' WHERE idCatena=$1', [req.params.id], function(err, data) {
		if (err) rest.error500(res, err);
		else res.json(data.rows);
	});
});

router.get('/:id', function(req, res, next) {
	sql.pool.query('SELECT * FROM ' + sql.tables.Calibrazioni + ' WHERE id=$1', [req.params.id], function(err, data) {
		if (err) rest.error500(res, err);
		else res.json(data.rows.length == 1 ? data.rows[0] : []);
	});
});

router.delete('/:id', function(req, res, next) {
	sql.pool.query('DELETE FROM ' + sql.tables.Calibrazioni + ' WHERE id=$1', [req.params.id], function(err, data) {
		if (err) rest.error500(res, err);
		else rest.deleted(res, data.rows);
	});
});

router.post('/', function(req, res, next) {
	sql.pool.query('INSERT INTO ' + sql.tables.Calibrazioni + '($1,$2,$3,$4,$5,$6) VALUES ($7,$8,$9,$10,$11,$12)', ["idCatena", "lab", "certn", "dateCal", "note", "scadenza", req.body.idCatena, req.body.lab, req.body.certn, req.body.dateCal, req.body.note, req.body.scadenza], function(err, data) {
		if (err) rest.error500(res, err);
		else rest.created(res, data.rows);
	});
});

router.put('/:id', function(req, res, next) {
	sql.pool.query('UPDATE ' + sql.tables.Calibrazioni + ' SET $1 = $2, $3 = $4, $5 = $6, $7 = $8, $9 = $10, $11 = $12 WHERE $13 = $14', ["idCatena", req.body.idCatena, "lab", req.body.lab, "certn", req.body.certn, "dateCal", req.body.dateCal, "note", req.body.note, "scadenza", req.body.scadenza, "id", req.params.id ], function(err, data) {
		if (err) rest.error500(res, err);
		else rest.updated(res, data.rows);
	});
});

module.exports = router;
