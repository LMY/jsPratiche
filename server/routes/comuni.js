var rest = require('../helpers/rest.js');
var sql = require('../helpers/db.js');

var express = require('express');
var router = express.Router();

router.get('/', (req, res, next) => {
    sql.pool.query('SELECT * FROM '+sql.tables.Comuni)
		.then(data => res.json(data.rows))
		.catch(err => rest.error500(res, err));
});

router.get('/:id', (req, res, next) => {
	sql.pool.query('SELECT * FROM '+sql.tables.Comuni+' WHERE id=$1', [req.params.id])
		.then(data => res.json(data.rows.length == 1 ? data.rows[0] : []))
		.catch(err => rest.error500(res, err));	
});

router.delete('/:id', (req, res, next) => {
	sql.pool.query('DELETE FROM '+sql.tables.Comuni+' WHERE id=$1', [req.params.id])
		.then(data => rest.deleted(res, data.rows))
		.catch(err => rest.error500(res, err));
});

router.post('/', (req, res, next) => {
	sql.pool.query('INSERT INTO '+sql.tables.Comuni+'(name,pec,idaas,province) VALUES ($1,$2,$3,$4)', [req.body.name, req.body.pec, req.body.idaas, req.body.province])
		.then(data => rest.created(res, data.rows))
		.catch(err => rest.error500(res, err));
});

router.put('/:id', (req, res, next) => {
	sql.pool.query('UPDATE '+sql.tables.Comuni+' SET name = $1, pec = $2, idaas = $3, province = $4 WHERE id = $5', [req.body.name, req.body.pec, req.body.idaas, req.body.province, req.params.id])
		.then(data => rest.updated(res, data.rows))
		.catch(err => rest.error500(res, err));
});

module.exports = router;
