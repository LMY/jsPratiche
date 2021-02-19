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
      'INSERT INTO '+sql.tables.Integrazioni+'("dateOUT", "dateIN","protoOUT", "protoIN", "ostativi", "note") VALUES ($1,$2,$3,$4,$5,$6)',
      [ req.body.dateOUT, req.body.dateIN, req.body.protoOUT, req.body.protoIN, req.body.ostativi, req.body.note ],
      function(err, data) {
        if (err)
          rest.error500(res, err);
        else
          rest.created(res, data.rows);
      });
});

router.put('/:id', function(req, res, next) {
  sql.pool.query(
      'UPDATE '+sql.tables.Integrazioni+' SET "dateOUT" = $1, "dateIN" = $2, "protoOUT" = $3, "protoIN" = $4, "ostativi" = $5, "note" = $6 WHERE "id" = $7',
      [ req.body.dateOUT, req.body.dateIN, req.body.protoOUT, req.body.protoIN, req.body.ostativi, req.body.note, req.params.id ],
      function(err, data) {
        if (err)
          rest.error500(res, err);
        else
          rest.updated(res, data.rows);
      });
});

module.exports = router;
