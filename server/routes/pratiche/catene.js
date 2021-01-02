var rest = require('../../helpers/rest.js');
var sql = require('../../helpers/db.js');

var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
	sql.pool.query('SELECT '+sql.tables.Catene+'.*, T2.lab, T2.certn, T2.dateCal, T2.note as noteCalib, T2.scadenza FROM '+sql.tables.Catene+' LEFT JOIN (SELECT * From '+sql.tables.Calibrazioni+' WHERE id IN (SELECT id FROM (SELECT id,idCatena,MAX(dateCal) FROM '+sql.tables.Calibrazioni+' GROUP BY idCatena) AS T1)) AS T2 ON '+sql.tables.Catene+'.id = T2.idCatena', function(err, data) {
		if (err) rest.error500(res, err);
		else res.json(data);
	});
});

router.get('/:id', function(req, res, next) {
	sql.pool.query('SELECT '+sql.tables.Catene+'.*, T2.lab, T2.certn, T2.dateCal, T2.note as noteCalib, T2.scadenza FROM '+
	sql.tables.Catene+' LEFT JOIN (SELECT * From '+sql.tables.Calibrazioni+' WHERE id IN (SELECT id FROM (SELECT id,idCatena,MAX(dateCal) FROM '+sql.tables.Calibrazioni+' GROUP BY idCatena) AS T1)) AS T2 ON '+sql.tables.Catene+'.id = T2.idCatena WHERE '+sql.tables.Catene+'.id=$1', [req.params.id], function(err, data) {
		if (err) rest.error500(res, err);
		else res.json(data.rows.length == 1 ? data.rows[0] : []);
	});
});

router.delete('/:id', function(req, res, next) {
	sql.pool.query('DELETE FROM '+sql.tables.Catene+' WHERE id=$1', [req.params.id], function(err, data) {
		if (err) rest.error500(res, err);
		else rest.deleted(res, data.rows);
	});
});

router.post('/', function(req, res, next) {
	var query =  sql.format('INSERT INTO '+sql.tables.Catene+'($1,$2) VALUES (?,?)', ["name", "note", req.body.name, req.body.note ]);

	sql.pool.query(query, function(err, data) {
		if (err) rest.error500(res, err);
		else rest.created(res, data.rows);
	});
});

router.put('/:id', function(req, res, next) {
	sql.pool.query('UPDATE '+sql.tables.Catene+' SET $1 = $2, $3 = $4 WHERE $5 = $6', ["name", req.body.name, "note", req.body.note,"id", req.params.id], function(err, data) {
		if (err) rest.error500(res, err);
		else rest.updated(res, data.rows);
	});
});

module.exports = router;