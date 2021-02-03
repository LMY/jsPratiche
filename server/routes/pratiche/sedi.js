var rest = require('../../helpers/rest.js');
var sql = require('../../helpers/db.js');

var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
  sql.pool.query('SELECT * FROM ' + sql.tables.Sedi, function(err, data) {
    if (err)
      rest.error500(res, err);
    else
      res.json(data.rows);
  });
});

router.get('/:id', function(req, res, next) {
  sql.pool.query(
      'SELECT * FROM ' + sql.tables.Sedi + ' WHERE id=$1', [req.params.id],
      function(err, data) {
        if (err)
          rest.error500(res, err);
        else
          res.json(data.rows.length == 1 ? data.rows[0] : []);
      });
});

router.delete('/:id', function(req, res, next) {
  sql.pool.query(
      'DELETE FROM ' + sql.tables.Sedi + ' WHERE id=$1', [req.params.id],
      function(err, data) {
        if (err)
          rest.error500(res, err);
        else
          rest.deleted(res, data.rows);
      });
});

router.post('/', function(req, res, next) {
  sql.pool.query(
      'INSERT INTO ' + sql.tables.Sedi + '(nome,telefono,note) VALUES ($1,$2,$3)',
      [req.body.nome, req.body.telefono,req.body.note],
      function(err, data) {
        if (err)
          rest.error500(res, err);
        else
          rest.created(res, data.rows);
      });
});

router.put('/:id', function(req, res, next) {
  sql.pool.query(
      'UPDATE ' + sql.tables.Sedi + ' SET nome = $1, telefono = $2, note = $3 WHERE id = $4',
      [ req.body.nome, req.body.telefono, req.body.note, req.params.id ],
      function(err, data) {
        if (err)
          rest.error500(res, err);
        else
          rest.updated(res, data.rows);
      });
});

module.exports = router;