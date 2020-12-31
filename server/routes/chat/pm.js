var rest = require('../../helpers/rest.js');
var sql = require('../../helpers/db.js');
var tableName = 'jspratiche."PrivateMessages"';

var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {

	sql.pool.query('SELECT '+tableName+'.*, jspratiche."Utenti".username FROM '+tableName+' LEFT JOIN jspratiche."Utenti" on '
	+tableName+'.userfrom = jspratiche."Utenti".id WHERE userto=$1', [req.user.id], function(err, data1) {
		if (err) rest.error500(res, err);
		else {
			sql.pool.query("UPDATE PrivateMessages SET readen=1 WHERE userto=$1 AND readen=0", [req.user.id], function(err, data2) {
				if (err) rest.error500(res, err);
				else res.json(data1.rows);
			});
		}
	});
});

router.get('/count', function(req, res, next) {
	sql.pool.query('SELECT count(*) as pms FROM '+tableName+' WHERE readen=0 AND userto=$1', [req.user.id], function(err, data) {
		if (err) rest.error500(res, err);
		else res.json(data.rows[0].pms);
	});
});

router.get('/new', function(req, res, next) {

	sql.pool.query('SELECT '+tableName+'.*, jspratiche."Utenti".username FROM '+tableName+' LEFT JOIN " \
	" jspratiche."Utenti" on '+tableName+'.userfrom = jspratiche."Utenti".id WHERE userto=$1 AND readen=0', [req.user.id], function(err, data1) {
		if (err) rest.error500(res, err);
		else {
			sql.pool.query('UPDATE '+tableName+' SET readen=1 WHERE userto=$1 AND readen=0', [req.user.id], function(err, data2) {
				if (err) rest.error500(res, err);
				else res.json(data1.rows);
			});
		}
	});
});

router.get('/sent', function(req, res, next) {
	sql.pool.query('SELECT * FROM '+tableName+' WHERE userfrom=$1', [req.user.id], function(err, data) {
		if (err) rest.error500(res, err);
		else res.json(data.rows);
	});
});

router.get('/:id', function(req, res, next) {
	sql.pool.query('SELECT * FROM '+tableName+' WHERE id=$1', [req.params.id], function(err, data) {
		if (err) rest.error500(res, err);
		else res.json(data.rows.length == 1 ? data.rows[0] : []);
	});
});

router.delete('/:id', function(req, res, next) {
	sql.pool.query('DELETE FROM '+tableName+' WHERE id=$1', [req.params.id], function(err, data) {
		if (err) rest.error500(res, err);
		else rest.deleted(res, data.rows);
	});
});

router.post('/', function(req, res, next) {
	if (!req.body.userto || !req.body.msg) {
		rest.error500(res, "input data required");
		return;
	}
	
	sql.pool.query('INSERT INTO '+tableName+'($1,$2,$3,$4,$5) VALUES ($6,$7,$8,$9,CURRENT_TIMESTAMP())', ["userfrom", "userto", "msg", "readen", "timePoint", req.user.id, req.body.userto, req.body.msg, 1], function(err, data) {
		if (err) rest.error500(res, err);
		else rest.created(res, data.rows);
	});
});

router.put('/:id', function(req, res, next) {
	sql.pool.query('UPDATE '+tableName+' SET $1 = $2, $3 = $4 WHERE $5 = $6', ["msg", req.body.msg, "readen", req.body.readen,"id", req.params.id], function(err, data) {
		if (err) rest.error500(res, err);
		else rest.updated(res, data.rows);
	});
});

module.exports = router;
