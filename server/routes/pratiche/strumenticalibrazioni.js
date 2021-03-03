var rest = require('../../helpers/rest.js');
var sql = require('../../helpers/db.js');

var express = require('express');
var router = express.Router();

router.get('/', (req, res, next) => {
	sql.pool.query('SELECT * FROM '+sql.tables.Calibrazioni)
		.then(data => res.json(data.rows))
		.catch(err => rest.error500(res, err));
});

router.get('/catena/:id', (req, res, next) => {
	sql.pool.query('SELECT * FROM ' + sql.tables.Calibrazioni + ' WHERE "idCatena"=$1', [req.params.id])
		.then(data => res.json(data.rows))
		.catch(err => rest.error500(res, err));
});

router.get('/:id', (req, res, next) => {
	sql.pool.query('SELECT * FROM ' + sql.tables.Calibrazioni + ' WHERE id=$1', [req.params.id])
		.then(data => res.json(data.rows.length == 1 ? data.rows[0] : []))
		.catch(err => rest.error500(res, err));
});

router.delete('/:id', (req, res, next) => {
	sql.pool.query('DELETE FROM ' + sql.tables.Calibrazioni + ' WHERE id=$1', [req.params.id])
		.then(data => rest.deleted(res, data.rows))
		.catch(err => rest.error500(res, err));
});

router.post('/', (req, res, next) => {
	sql.pool.query('INSERT INTO ' + sql.tables.Calibrazioni + '("idCatena", "lab", "certn", "dateCal", "note", "scadenza") VALUES ($1,$2,$3,$4,$5,$6)', [req.body.idCatena, req.body.lab, req.body.certn, req.body.dateCal, req.body.note, req.body.scadenza])
		.then(data => rest.created(res, data.rows))
		.catch(err => rest.error500(res, err));st.created(res, data.rows);
});

router.put('/:id', (req, res, next) => {
	sql.pool.query('UPDATE ' + sql.tables.Calibrazioni + ' SET "idCatena" = $1, "lab" = $2, "certn" = $3, "dateCal" = $4, "note" = $5, "scadenza" = $6 WHERE "id" = $7',
	 	[req.body.idCatena, req.body.lab, req.body.certn, req.body.dateCal, req.body.note, req.body.scadenza, req.params.id ])
		.then(data => rest.updated(res, data.rows))
		.catch(err => rest.error500(res, err));
});

module.exports = router;
