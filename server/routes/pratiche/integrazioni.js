var rest = require('../../helpers/rest.js');
var sql = require('../../helpers/db.js');

var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
	sql.pool.query('SELECT * FROM '+sql.tables.Integrazioni, function(err, data) {
		if (err) rest.error500(res, err);
		else res.json(data.rows);
	});
});

router.get('/:id', function(req, res, next) {
	sql.pool.query('SELECT * FROM '+sql.tables.Integrazioni+' WHERE id=$1', [req.params.id], function(err, data) {
		if (err) rest.error500(res, err);
		else res.json(data.rows.length == 1 ? data.rows[0] : []);
	});
});

router.delete('/:id', function(req, res, next) {
	sql.pool.query('DELETE FROM '+sql.tables.Integrazioni+' WHERE id=$1', [req.params.id], function(err, data) {
		if (err) rest.error500(res, err);
		else rest.deleted(res, data.rows);
	});
});

router.post('/', function(req, res, next) {
  sql.pool.query(
      'INSERT INTO '+sql.tables.Integrazioni+'($1,$2,$3,$4,$5,$6) VALUES ($7,$8,$9,$10,$11,$12)',
      [
        'dateOUT', 'dateIN', 'protoOUT', 'protoIN', 'ostativi', 'note',
        req.body.dateOUT, req.body.dateIN, req.body.protoOUT, req.body.protoIN,
        req.body.ostativi, req.body.note
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
      'UPDATE '+sql.tables.Integrazioni+' SET $1 = $2, $3 = $4, $5 = $6, $7 = $8, $9 = $10, $11 = $12 WHERE $13 = $14',
      [
        'dateOUT', req.body.dateOUT, 'dateIN', req.body.dateIN, 'protoOUT',
        req.body.protoOUT, 'protoIN', req.body.protoIN, 'ostativi',
        req.body.ostativi, 'note', req.body.note, 'id', req.params.id
      ],
      function(err, data) {
        if (err)
          rest.error500(res, err);
        else
          rest.updated(res, data.rows);
      });
});

module.exports = router;
