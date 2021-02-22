var rest = require('../../helpers/rest.js');
var sql = require('../../helpers/db.js');

var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
  sql.pool.query(
      'SELECT ' + sql.tables.Catene +
          '.*, t2.lab, t2.certn, t2."dateCal", t2.note as "noteCalib", t2.scadenza FROM ' +
          sql.tables.Catene + ' LEFT JOIN (SELECT * From ' +
          sql.tables.Calibrazioni +
          ' WHERE id IN (SELECT id FROM (SELECT id,"idCatena",MAX("dateCal") FROM ' +
          sql.tables.Calibrazioni + ' GROUP BY "idCatena",id) AS T1)) AS t2 ON ' +
          sql.tables.Catene + '.id = t2."idCatena"',
      function(err, data) {
        if (err)
          rest.error500(res, err);
        else
          res.json(data);
      });
});

router.get('/:id', function(req, res, next) {
  sql.pool.query(
      'SELECT ' + sql.tables.Catene +
          '.*, t2.lab, t2.certn, t2."dateCal", t2.note as "noteCalib", t2.scadenza FROM ' +
          sql.tables.Catene + ' LEFT JOIN (SELECT * FROM ' +
          sql.tables.Calibrazioni +
          ' WHERE id IN (SELECT id FROM (SELECT id,"idCatena",MAX("dateCal") FROM ' +
          sql.tables.Calibrazioni + ' GROUP BY "idCatena",id) AS T1)) AS t2 ON ' +
          sql.tables.Catene + '.id = t2."idCatena" WHERE ' + sql.tables.Catene +
          '.id=$1',
      [req.params.id], function(err, data) {
        if (err)
          rest.error500(res, err);
        else
          res.json(data.rows.length == 1 ? data.rows[0] : []);
      });
});

router.delete('/:id', function(req, res, next) {
	sql.pool.query('DELETE FROM '+sql.tables.Catene+' WHERE id=$1', [req.params.id], function(err, data) {
		if (err) rest.error500(res, err);
		else rest.deleted(res, data.rows);
	});
});

router.post('/', function(req, res, next) {
	sql.pool.query('INSERT INTO '+sql.tables.Catene+'(name, note) VALUES ($1,$2)', [req.body.name, req.body.note], function(err, data) {
		if (err) rest.error500(res, err);
		else rest.created(res, data.rows);
	});
});

router.put('/:id', function(req, res, next) {
  sql.pool.query('UPDATE ' + sql.tables.Catene + ' SET name = $1, note = $2 WHERE id = $3',
      [req.body.name, req.body.note, req.params.id], function(err, data) {
        if (err)
          rest.error500(res, err);
        else
          rest.updated(res, data.rows);
      });
});

module.exports = router;