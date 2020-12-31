var rest = require('../../helpers/rest.js');
var sql = require('../../helpers/db.js');
var tableName = 'jspratiche."Messages"';

var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
	sql.pool.query('SELECT jspratiche."Messages".*, jspratiche."Utenti".username FROM jspratiche."Messages" LEFT JOIN jspratiche."Utenti" on jspratiche."Messages".userfrom = jspratiche."Utenti".id ORDER BY id DESC LIMIT 50', function(err, data) {
		if (err) rest.error500(res, err);
		else res.json(data.rows);
	});
});

router.get('/sent', function(req, res, next) {
	sql.pool.query('SELECT jspratiche."Messages".*, jspratiche."Utenti".username FROM jspratiche."Messages" LEFT JOIN jspratiche."Utenti" on jspratiche."Messages".userfrom = jspratiche."Utenti".id WHERE userfrom=$1', [req.user.id], function(err, data) {
		if (err) rest.error500(res, err);
		else res.json(data.rows);
	});
});

router.get('/:id', function(req, res, next) {
	sql.pool.query('SELECT * FROM jspratiche."Messages" WHERE id=$1', [req.params.id], function(err, data) {
		if (err) rest.error500(res, err);
		else res.json(data.rows.length == 1 ? data.rows[0] : []);
	});
});

router.delete('/:id', function(req, res, next) {
	sql.pool.query('DELETE FROM $1 WHERE id=$2', [tableName, req.params.id], function(err, data) {
		if (err) rest.error500(res, err);
		else rest.deleted(res, data.rows);
	});
});

router.post('/', function(req, res, next) {
	sql.pool.query("INSERT INTO $1($2,$3,$4) VALUES ($5,$6, CURRENT_TIMESTAMP())", [tableName, "userfrom", "msg", "timePoint", req.user.id, req.body.msg ], function(err, data) {
		if (err) rest.error500(res, err);
		else rest.created(res, data.rows);
	});
});

router.put('/:id', function(req, res, next) {
	sql.pool.query("UPDATE $1 SET $2 = $3 WHERE $4 = $5", [tableName, "msg", req.body.msg, "id", req.params.id], function(err, data) {
		if (err) rest.error500(res, err);
		else rest.updated(res, data.rows);
	});
});

module.exports = router;
