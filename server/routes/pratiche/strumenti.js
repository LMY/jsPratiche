var rest = require('../../helpers/rest.js');
var sql = require('../../helpers/db.js');

var express = require('express');
var router = express.Router();

router.get('/', (req, res, next) => {
  sql.pool.query('SELECT * FROM ' + sql.tables.Strumenti)
    .then(data => res.json(data.rows))
    .catch(err => rest.error500(res, err));
});

// GET strumenti di una catena
router.get('/catena/:id', (req, res, next) => {
  sql.pool.query(
      'SELECT * FROM ' + sql.tables.Strumenti +
          ' WHERE id IN (SELECT "idStrumento" FROM ' + sql.tables.StrumentiDelleCatene + ' WHERE "idCatena"=$1)',
      [req.params.id])
      .then(data => res.json(data.rows))
      .catch(err => rest.error500(res, err));
});

// GET strumenti di nessuna catena
router.get('/free', (req, res, next) => {
  sql.pool.query(
      'SELECT * FROM ' + sql.tables.Strumenti + ' WHERE id NOT IN (SELECT "idStrumento" FROM ' + sql.tables.StrumentiDelleCatene + ')')
    .then(data => res.json(data.rows))
    .catch(err => rest.error500(res, err));
});

// ADD/REMOVE strumenti a una catena
router.put('/free/:id', (req, res, next) => {

  if (req.body.verb == 'add') {
    sql.pool.query('INSERT INTO ' + sql.tables.StrumentiDelleCatene + '("idCatena","idStrumento") VALUES ($1,$2)',
        [req.params.id, req.body.idStrumento])
      .then(data => rest.created(res, data.rows))
      .catch(err => rest.error500(res, err));

  }
  else if (req.body.verb == 'remove') {
    sql.pool.query('DELETE FROM ' + sql.tables.StrumentiDelleCatene + ' WHERE "idCatena"=$1 AND "idStrumento"=$2', [req.params.id, req.body.idStrumento])
      .then(data => rest.deleted(res, data.rows))
      .catch(err => rest.error500(res, err));
  }
  else {
    rest.error500(res, 'no verb specified');
    return;
  }
});

// altri metodi di /strumenti
router.get('/:id', (req, res, next) => {
  sql.pool.query(
      'SELECT * FROM ' + sql.tables.Strumenti + ' WHERE id=$1', [req.params.id])
      .then(data => res.json(data.rows.length == 1 ? data.rows[0] : []))
      .catch(err => rest.error500(res, err));
});

router.delete('/:id', (req, res, next) => {
  sql.pool.query(
      'DELETE FROM ' + sql.tables.Strumenti + ' WHERE id=$1', [req.params.id])
      .then(data => rest.deleted(res, data.rows))
      .catch(err => rest.error500(res, err));
});

router.post('/', (req, res, next) => {
  sql.pool.query(
      'INSERT INTO ' + sql.tables.Strumenti + '(name,marca,modello,serial,inventario,tipo,taratura,note) VALUES ($1,$2,$3,$4,$5,$6,$7,$8)',
      [
        req.body.name, req.body.marca, req.body.modello, req.body.serial,
        req.body.inventario, req.body.tipo, req.body.taratura, req.body.note
      ])
      .then(data => rest.created(res, data.rows))
      .catch(err => rest.error500(res, err));
});

router.put('/:id', (req, res, next) => {
  sql.pool.query(
      'UPDATE ' + sql.tables.Strumenti +
      ' SET name = $1, marca = $2, modello = $3, serial = $4, inventario = $5, tipo = $6, taratura = $7, note = $8 WHERE id = $9',
      [
        req.body.name, req.body.marca, req.body.modello, req.body.serial,
        req.body.inventario, req.body.tipo, req.body.taratura, req.body.note,
        req.params.id
      ])
      .then(data => rest.updated(res, data.rows))
      .catch(err => rest.error500(res, err));
});

module.exports = router;
