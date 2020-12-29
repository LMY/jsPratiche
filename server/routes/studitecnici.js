var rest = require('../helpers/rest.js');
var sql = require('../helpers/db.js');

var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
	console.log("forza roma");
	sql.pool.query('SELECT * FROM StudiTecnici', (err, data) => {
		if (err) rest.error500(res, err);
		else res.json(data.rows);
	});
});

router.post('/', function(req, res, next) {
	sql.pool.query("INSERT INTO StudiTecnici($1,$2) VALUES ($3,$4)", ["name", "pec", req.body.name, req.body.pec], function(err, data) {
		if (err) rest.error500(res, err);
		else rest.created(res, data);
	});
});

router.get('/:id', function(req, res, next) {
	sql.pool.query('SELECT * FROM StudiTecnici WHERE id=$1', [req.params.id], function(err, data) {
		if (err) rest.error500(res, err);
		else res.json(data.length == 1 ? data[0] : []);
	});
});

router.put('/:id', function(req, res, next) {
	sql.pool.query("UPDATE StudiTecnici SET $1 = $2, $3 = $4 WHERE $5 = $6", ["name", req.body.name, "pec", req.body.pec, "id", req.params.id], function(err, data) {
		if (err) rest.error500(res, err);
		else rest.updated(res, data);
	});
});

router.delete('/:id', function(req, res, next) {
	sql.pool.query('DELETE FROM StudiTecnici WHERE id=$1', [req.params.id], function(err, data) {
		if (err) rest.error500(res, err);
		else rest.deleted(res, data);
	});
});

module.exports = router;
