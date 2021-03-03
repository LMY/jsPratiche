var rest = require('../../helpers/rest.js');
var sql = require('../../helpers/db.js');

var express = require('express');
var router = express.Router();


router.get('/', (req, res, next) => {
	if (!req.query.dateFrom || !req.query.dateTo)
		rest.error500(res, "Not permitted");
	else
		sql.pool.query('SELECT * FROM ' + sql.tables.LinkSitiPratiche + ' WHERE idpratica IN (SELECT id FROM ' + sql.tables.Pratiche + ' where dateOUT BETWEEN $1 AND $2)',
								[ req.query.dateFrom, req.query.dateTo ])
								.then(data => rest.json(res, data.rows))
								.catch(err => rest.error500(res, err));							
});

router.get('/:id', (req, res, next) => {
	sql.pool.query('SELECT * FROM ' + sql.tables.LinkSitiPratiche + ' WHERE idpratica=$1', [req.params.id])
		.then(data => rest.json(res, data.rows))
		.catch(err => rest.error500(res, err));
});

router.post('/', (req, res, next) => {
	sql.pool.query('INSERT INTO ' + sql.tables.LinkSitiPratiche + '(idsite,idpratica,"flag87bis","flagSupTerra","flagA24","idriconf") '+
					'VALUES ($1,$2,$3,$4,$5,$6) '+
					'ON CONFLICT (idsite) DO UPDATE SET idpratica=excluded.idpratica, "flag87bis"=excluded."flag87bis", "flagSupTerra"=excluded."flagSupTerra", "flagA24"=excluded."flagA24"',
		[ req.body.idsite, req.body.idpratica, req.body.flag87bis, req.body.flagSupTerra, req.body.flagA24, req.body.idriconf ])
		.then(data => rest.created(res, data.rows))
		.catch(err => rest.error500(res, err));
});

router.put('/:idsite', (req, res, next) => {
	sql.pool.query('UPDATE ' + sql.tables.LinkSitiPratiche + ' SET idpratica=$1, "flag87bis"=$2, "flagSupTerra"=$3, "flagA24"=$4, idriconf=$5 WHERE idsite=$6',
		[ req.body.idpratica, req.body.flag87bis, req.body.flagSupTerra, req.body.flagA24, req.body.idriconf, req.params.idsite ])
		.then(data => rest.updated(res, data.rows))
		.catch(err => rest.error500(res, err));
});

router.delete('/:idsite', (req, res, next) => {
	sql.pool.query('DELETE FROM ' + sql.tables.LinkSitiPratiche + ' WHERE idsite = $1', [ req.params.idsite ])
		.then(data => rest.deleted(res, data.rows))
		.catch(err => rest.error500(res, err));
});

module.exports = router;
