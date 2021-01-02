var rest = require('../../helpers/rest.js');
var sql = require('../../helpers/db.js');

var express = require('express');
var router = express.Router();


router.get('/', function(req, res, next) {
	if (!req.query.dateFrom || !req.query.dateTo)
		rest.error500(res, "Not permitted");
	else
		sql.pool.query(sql.format('SELECT * FROM ' + sql.tables.LinkSitiPratiche + ' WHERE idpratica IN (SELECT id FROM ' + sql.tables.Pratiche + ' where dateOUT BETWEEN $1 AND $2)',
								[ req.query.dateFrom, req.query.dateTo ]), function(err, data) {
			if (err) rest.error500(res, err);
			else rest.json(res, data.rows);
		});		
});

router.get('/:id', function(req, res, next) {
	sql.pool.query('SELECT * FROM ' + sql.tables.LinkSitiPratiche + ' WHERE idpratica=$1', [req.params.id], function(err, data) {
		if (err) rest.error500(res, err);
		else rest.json(res, data.rows);
	});
});

router.post('/', function(req, res, next) {
	sql.pool.query('INSERT INTO ' + sql.tables.LinkSitiPratiche + '(idsite,idpratica,flag87bis,flagSupTerra,flagA24,idriconf) VALUES ($1,$2,$3,$4,$5,$6)',
	//	ON DUPLICATE KEY UPDATE idpratica=idpratica, flag87bis=flag87bis, flagSupTerra=flagSupTerra, flagA24=flagA24",
								[ req.body.idsite, req.body.idpratica, req.body.flag87bis, req.body.flagSupTerra, req.body.flagA24, req.body.idriconf ], function(err, data) {
		if (err) rest.error500(res, err);
		else rest.created(res, data.rows);
	});
});

router.put('/:idsite', function(req, res, next) {
	sql.pool.query('UPDATE ' + sql.tables.LinkSitiPratiche + ' SET idpratica=$1, flag87bis=$2, flagSupTerra=$3, flagA24=$4, idriconf=$5 WHERE idsite=$6',
	[ req.body.idpratica, req.body.flag87bis, req.body.flagSupTerra, req.body.flagA24, req.body.idriconf, req.params.idsite ], function(err, data) {
		if (err) rest.error500(res, err);
		else rest.updated(res, data.rows);
	});
});

router.delete('/:idsite', function(req, res, next) {
	sql.pool.query('DELETE FROM ' + sql.tables.LinkSitiPratiche + ' WHERE idsite = $1', [ req.params.idsite ], function(err, data) {
		if (err) rest.error500(res, err);
		else rest.deleted(res, data.rows);
	});
});

module.exports = router;
