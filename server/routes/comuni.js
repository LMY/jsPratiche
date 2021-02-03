var rest = require('../helpers/rest.js');
var sql = require('../helpers/db.js');

var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
    sql.pool.query('SELECT * FROM '+sql.tables.Comuni, function(err, data) {

		console.log("query to: "+data.rows);
		console.log("query to: "+data.rows[0]);
		console.log("query to: "+JSON.stringify(data.rows));

		if (err) rest.error500(res, err);
		else res.json(data.rows);
	});
});

router.get('/:id', function(req, res, next) {
	sql.pool.query('SELECT * FROM '+sql.tables.Comuni+' WHERE id=$1', [req.params.id], function(err, data) {
		if (err) rest.error500(res, err);
		else res.json(data.rows.length == 1 ? data.rows[0] : []);
	});
});

router.delete('/:id', function(req, res, next) {
	sql.pool.query('DELETE FROM '+sql.tables.Comuni+' WHERE id=$1', [req.params.id], function(err, data) {
		if (err) rest.error500(res, err);
		else rest.deleted(res, data.rows);
	});
});

router.post('/', function(req, res, next) {
	sql.pool.query('INSERT INTO '+sql.tables.Comuni+'(name,pec,idaas,province) VALUES ($1,$2,$3,$4)', [req.body.name, req.body.pec, req.body.idaas, req.body.province], function(err, data) {
		if (err) rest.error500(res, err);
		else rest.created(res, data.rows);
	});
});

// update jspratiche."Comuni" set name = 'Aiello del Friuli', pec = 'comune.aiellodelfriuli@certgov.fvg.it', idaas = 2, province = 'GO' WHERE id = 1;
router.put('/:id', function(req, res, next) {
	sql.pool.query('UPDATE '+sql.tables.Comuni+' SET name = $1, pec = $2, idaas = $3, province = $4 WHERE id = $5', [req.body.name, req.body.pec, req.body.idaas, req.body.province, req.params.id], function(err, data) {
		if (err) rest.error500(res, err);
		else rest.updated(res, data.rows);
	});
});

module.exports = router;
