var rest = require('../../helpers/rest.js');
var sql = require('../../helpers/db.js');
var tableName = 'PrivateMessages';

var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {

	sql.pool.query('SELECT jspratiche."PrivateMessages".*, jspratiche."Utenti".username FROM jspratiche."PrivateMessages" LEFT JOIN jspratiche."Utenti" on jspratiche."PrivateMessages".userfrom = jspratiche."Utenti".id WHERE userto=$1', [req.user.id], function(err, data1) {
		if (err) rest.error500(res, err);
		else {
			sql.pool.query("UPDATE PrivateMessages SET readen=1 WHERE userto=$1 AND readen=0", [req.user.id], function(err, data2) {
				if (err) rest.error500(res, err);
				else res.json(data1);
			});
		}
	});
});

router.get('/count', function(req, res, next) {
	sql.pool.query('SELECT count(*) as pms FROM jspratiche."PrivateMessages" WHERE readen=0 AND userto=$1', [req.user.id], function(err, data) {
		if (err) rest.error500(res, err);
		// else res.json(data[0].pms);
		else res.json("0");
	});
});

router.get('/new', function(req, res, next) {

	sql.pool.query('SELECT jspratiche."PrivateMessages".*, jspratiche."Utenti".username FROM jspratiche."PrivateMessages" LEFT JOIN jspratiche."Utenti" on jspratiche."PrivateMessages".userfrom = jspratiche."Utenti".id WHERE userto=$1 AND readen=0', [req.user.id], function(err, data1) {
		if (err) rest.error500(res, err);
		else {
			sql.pool.query("UPDATE PrivateMessages SET readen=1 WHERE userto=$1 AND readen=0", [req.user.id], function(err, data2) {
				if (err) rest.error500(res, err);
				else res.json(data1);
			});
		}
	});
});

router.get('/sent', function(req, res, next) {
	sql.pool.query('SELECT * FROM jspratiche."PrivateMessages" WHERE userfrom=$1', [req.user.id], function(err, data) {
		if (err) rest.error500(res, err);
		else res.json(data);
	});
});

router.get('/:id', function(req, res, next) {
	sql.pool.query('SELECT * FROM jspratiche."PrivateMessages" WHERE id=$1', [req.params.id], function(err, data) {
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
	if (!req.body.userto || !req.body.msg) {
		rest.error500(res, "input data required");
		return;
	}
	
	sql.pool.query("INSERT INTO $1($2,$3,$4,$5,$6) VALUES ($7,$8,$9,$10,CURRENT_TIMESTAMP())", [tableName, "userfrom", "userto", "msg", "readen", "timePoint", req.user.id, req.body.userto, req.body.msg, 1], function(err, data) {
		if (err) rest.error500(res, err);
		else rest.created(res, data);
	});
});

router.put('/:id', function(req, res, next) {
	sql.pool.query("UPDATE $1 SET $2 = $3, $4 = $5 WHERE $6 = $7", [tableName, "msg", req.body.msg, "readen", req.body.readen,"id", req.params.id], function(err, data) {
		if (err) rest.error500(res, err);
		else rest.updated(res, data);
	});
});

module.exports = router;
