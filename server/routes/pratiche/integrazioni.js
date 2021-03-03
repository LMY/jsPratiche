var rest = require('../../helpers/rest.js');
var sql = require('../../helpers/db.js');

var express = require('express');
var router = express.Router();

router.get('/', (req, res, next) => {
	sql.pool.query('SELECT * FROM '+sql.tables.Integrazioni)
    .then(data => res.json(data.rows))
    .catch(err => rest.error500(res, err));
});

router.get('/:id', (req, res, next) => {
	sql.pool.query('SELECT * FROM '+sql.tables.Integrazioni+' WHERE id=$1', [req.params.id])
    .then(data => res.json(data.rows.length == 1 ? data.rows[0] : []))
    .catch(err => rest.error500(res, err));
});

router.delete('/:id', (req, res, next) => {
	sql.pool.query('DELETE FROM '+sql.tables.Integrazioni+' WHERE id=$1', [req.params.id])
    .then(data => rest.deleted(res, data.rows))
    .catch(err => rest.error500(res, err));
});

router.post('/', (req, res, next) => {
  sql.pool.query(
      'INSERT INTO '+sql.tables.Integrazioni+'("dateOUT", "dateIN","protoOUT", "protoIN", "ostativi", "note") VALUES ($1,$2,$3,$4,$5,$6)',
      [ req.body.dateOUT, req.body.dateIN, req.body.protoOUT, req.body.protoIN, req.body.ostativi, req.body.note ])
    .then(data => rest.created(res, data.rows))
    .catch(err => rest.error500(res, err));
});

router.put('/:id', (req, res, next) => {
  sql.pool.query(
      'UPDATE '+sql.tables.Integrazioni+' SET "dateOUT" = $1, "dateIN" = $2, "protoOUT" = $3, "protoIN" = $4, "ostativi" = $5, "note" = $6 WHERE "id" = $7',
      [ req.body.dateOUT, req.body.dateIN, req.body.protoOUT, req.body.protoIN, req.body.ostativi, req.body.note, req.params.id ])
    .then(data => rest.updated(res, data.rows))
    .catch(err => rest.error500(res, err));
});

module.exports = router;
