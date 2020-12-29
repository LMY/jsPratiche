var rest = require('../../helpers/rest.js');
var sql = require('../../helpers/db.js');
var tableName = 'SharedNotes';

var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {

	sql.pool.query('SELECT jspratiche."SharedNotes".*, jspratiche."Utenti".username FROM jspratiche."SharedNotes" LEFT JOIN jspratiche."Utenti" on jspratiche."SharedNotes".create_user = jspratiche."Utenti".id', function(err, data) {
		if (err) rest.error500(res, err);
		else res.json(data);
	});
});

router.get('/:id', function(req, res, next) {
	sql.pool.query('SELECT * FROM SharedNotes WHERE id=$1', [req.params.id], function(err, data) {
		if (err) rest.error500(res, err);
		else res.json(data.length == 1 ? data[0] : []);
	});
});

router.delete('/:id', function(req, res, next) {
	sql.pool.query('DELETE FROM $1 WHERE id=$2', [tableName, req.params.id], function(err, data) {
		if (err) rest.error500(res, err);
		else rest.deleted(res, data);
	});
});

router.post('/', function(req, res, next) {
	sql.pool.query("INSERT INTO $1($2,$3,$4) VALUES ($1,$2, NOW())", [tableName, "create_user", "text", "create_timePoint", req.user.id, req.body.text ], function(err, data) {
		if (err) rest.error500(res, err);
		else rest.created(res, data);
	});
});

router.put('/:id', function(req, res, next) {
	sql.pool.query("UPDATE $1 SET $2 = $3, $4 = $5, create_timePoint=create_timePoint WHERE $6 = $7", [tableName, "text", req.body.text, "mod_user", req.user.id, "id", req.params.id], function(err, data) {
		if (err) rest.error500(res, err);
		else rest.updated(res, data);
	});
});

module.exports = router;
