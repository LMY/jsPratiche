var rest = require('../../helpers/rest.js');
var sql = require('../../helpers/db.js');

var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
  sql.pool.query('SELECT * FROM ' + sql.tables.Strumenti, function(err, data) {
    if (err)
      rest.error500(res, err);
    else
      res.json(data.rows);
  });
});

// GET strumenti di una catena
router.get('/catena/:id', function(req, res, next) {
  sql.pool.query(
      'SELECT * FROM ' + sql.tables.Strumenti +
          ' WHERE id IN (SELECT "idStrumento" FROM ' + sql.tables.StrumentiDelleCatene + ' WHERE "idCatena"=$1)',
      [req.params.id], function(err, data) {
        if (err)
          rest.error500(res, err);
        else
          res.json(data.rows);
      });
});

// GET strumenti di nessuna catena
router.get('/free', function(req, res, next) {
  sql.pool.query(
      'SELECT * FROM ' + sql.tables.Strumenti +
          ' WHERE id NOT IN (SELECT "idStrumento" FROM ' + sql.tables.StrumentiDelleCatene + ')',
      function(err, data) {
        if (err)
          rest.error500(res, err);
        else
          res.json(data.rows);
      });
});

// ADD/REMOVE strumenti a una catena
router.put('/free/:id', function(req, res, next) {
  var query = '';

  if (req.body.verb == 'add') {
    sql.pool.query(
        'INSERT INTO ' + sql.tables.StrumentiDelleCatene + '("idCatena","idStrumento") VALUES ($1,$2)',
        [req.params.id, req.body.idStrumento],
        function(err, data) {
          if (err)
            rest.error500(res, err);
          else
            rest.created(res, data.rows);
        });

  } else if (req.body.verb == 'remove') {
    sql.pool.query(
        'DELETE FROM ' + sql.tables.StrumentiDelleCatene +
            ' WHERE "idCatena"=$1 AND "idStrumento"=$2',
        [req.params.id, req.body.idStrumento], function(err, data) {
          if (err)
            rest.error500(res, err);
          else
            rest.deleted(res, data.rows);
        });
  } else {
    rest.error500(res, 'no verb specified');
    return;
  }
});


// altri metodi di /strumenti
router.get('/:id', function(req, res, next) {
  sql.pool.query(
      'SELECT * FROM ' + sql.tables.Strumenti + ' WHERE id=$1', [req.params.id],
      function(err, data) {
        if (err)
          rest.error500(res, err);
        else
          res.json(data.rows.length == 1 ? data.rows[0] : []);
      });
});

router.delete('/:id', function(req, res, next) {
  sql.pool.query(
      'DELETE FROM ' + sql.tables.Strumenti + ' WHERE id=$1', [req.params.id],
      function(err, data) {
        if (err)
          rest.error500(res, err);
        else
          rest.deleted(res, data.rows);
      });
});

router.post('/', function(req, res, next) {
  sql.pool.query(
      'INSERT INTO ' + sql.tables.Strumenti +
          '(name,marca,modello,serial,inventario,tipo,taratura,note) VALUES ($1,$2,$3,$4,$5,$6,$7,$8)',
      [
        req.body.name, req.body.marca, req.body.modello, req.body.serial,
        req.body.inventario, req.body.tipo, req.body.taratura, req.body.note
      ],
      function(err, data) {
        if (err)
          rest.error500(res, err);
        else
          rest.created(res, data.rows);
      });
});

router.put('/:id', function(req, res, next) {
  sql.pool.query(
      'UPDATE ' + sql.tables.Strumenti +
          ' SET name = $1, marca = $2, modello = $3, serial = $4, inventario = $5, tipo = $6, taratura = $7, note = $8 WHERE id = $9',
      [
        req.body.name, req.body.marca, req.body.modello, req.body.serial,
        req.body.inventario, req.body.tipo, req.body.taratura, req.body.note,
        req.params.id
      ],
      function(err, data) {
        if (err)
          rest.error500(res, err);
        else
          rest.updated(res, data.rows);
      });
});

module.exports = router;
