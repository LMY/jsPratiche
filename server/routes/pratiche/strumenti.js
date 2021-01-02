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
          ' WHERE id IN (SELECT idStrumento FROM ' + sql.tables.StrumentiDelleCatene + ' WHERE idCatena=$1)',
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
          ' WHERE id NOT IN (SELECT idStrumento FROM ' + sql.tables.StrumentiDelleCatene + ')',
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
        'INSERT INTO ' + sql.tables.StrumentiDelleCatene + '($1,$2) VALUES ($3,$4)',
        ['idCatena', 'idStrumento', req.params.id, req.body.idStrumento],
        function(err, data) {
          if (err)
            rest.error500(res, err);
          else
            rest.created(res, data.rows);
        });

  } else if (req.body.verb == 'remove') {
    sql.pool.query(
        'DELETE FROM ' + sql.tables.StrumentiDelleCatene +
            ' WHERE idCatena=$1 AND idStrumento=$2',
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
          '($1,$2,$3,$4,$5,$6,$7,$8) VALUES ($9,$10,$11,$12,$13,$14,$15,$16)',
      [
        'name', 'marca', 'modello', 'serial', 'inventario', 'tipo', 'taratura',
        'note', req.body.name, req.body.marca, req.body.modello,
        req.body.serial, req.body.inventario, req.body.tipo, req.body.taratura,
        req.body.note
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
          ' SET $1 = $2, $3 = $4, $5 = $6, $7 = $8, $9 = $10, $11 = $12, $13 = $14, $15 = $16 WHERE $17 = $18',
      [
        'name', req.body.name, 'marca', req.body.marca, 'modello',
        req.body.modello, 'serial', req.body.serial, 'inventario',
        req.body.inventario, 'tipo', req.body.tipo, 'taratura',
        req.body.taratura, 'note', req.body.note, 'id', req.params.id
      ],
      function(err, data) {
        if (err)
          rest.error500(res, err);
        else
          rest.updated(res, data.rows);
      });
});

module.exports = router;
