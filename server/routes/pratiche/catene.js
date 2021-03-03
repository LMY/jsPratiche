var rest = require('../../helpers/rest.js');
var sql = require('../../helpers/db.js');

var express = require('express');
var router = express.Router();

router.get('/', (req, res, next) => {
  sql.pool.query(
      'SELECT ' + sql.tables.Catene +
          '.*, t2.lab, t2.certn, t2."dateCal", t2.note as "noteCalib", t2.scadenza FROM ' +
          sql.tables.Catene + ' LEFT JOIN (SELECT * From ' +
          sql.tables.Calibrazioni +
          ' WHERE id IN (SELECT id FROM (SELECT id,"idCatena",MAX("dateCal") FROM ' +
          sql.tables.Calibrazioni + ' GROUP BY "idCatena",id) AS T1)) AS t2 ON ' +
          sql.tables.Catene + '.id = t2."idCatena"')
    .then(data => res.json(data.rows))
    .catch(err => rest.error500(res, err));
});

router.get('/:id', (req, res, next) => {
  sql.pool.query(
      'SELECT ' + sql.tables.Catene +
          '.*, t2.lab, t2.certn, t2."dateCal", t2.note as "noteCalib", t2.scadenza FROM ' + sql.tables.Catene +
          ' LEFT JOIN (SELECT * FROM ' + sql.tables.Calibrazioni +
          ' WHERE id IN (SELECT id FROM (SELECT id,"idCatena",MAX("dateCal") FROM ' +
          sql.tables.Calibrazioni + ' GROUP BY "idCatena",id) AS T1)) AS t2 ON ' +
          sql.tables.Catene + '.id = t2."idCatena" WHERE ' + sql.tables.Catene + '.id=$1', [req.params.id])
    .then(data => res.json(data.rows.length == 1 ? data.rows[0] : []))
    .catch(err => rest.error500(res, err)); 
});

router.delete('/:id', (req, res, next) => {
	sql.pool.query('DELETE FROM '+sql.tables.Catene+' WHERE id=$1', [req.params.id])
    .then(data => rest.deleted(res, data.rows))
    .catch(err => rest.error500(res, err)); 
});

router.post('/', (req, res, next) => {
	sql.pool.query('INSERT INTO '+sql.tables.Catene+'(name, note) VALUES ($1,$2)', [req.body.name, req.body.note])
    .then(data => rest.created(res, data.rows))
    .catch(err => rest.error500(res, err));
});

router.put('/:id', (req, res, next) => {
  sql.pool.query('UPDATE ' + sql.tables.Catene + ' SET name = $1, note = $2 WHERE id = $3', [req.body.name, req.body.note, req.params.id])
    .then(data => rest.updated(res, data.rows))
    .catch(err => rest.error500(res, err)); 
});

module.exports = router;