var rest = require('../../helpers/rest.js');
var sql = require('../../helpers/db.js');

var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
	sql.pool.query('SELECT '+sql.tables.Messages+'.*, '+sql.tables.Utenti+'.username FROM '+sql.tables.Messages+' LEFT JOIN '+sql.tables.Utenti+' on '+sql.tables.Messages+'.userfrom = '+sql.tables.Utenti+'.id ORDER BY id DESC LIMIT 50', function(err, data) {
		if (err) rest.error500(res, err);
		else res.json(data.rows);
	});
});

router.get('/sent', function(req, res, next) {
	sql.pool.query('SELECT '+sql.tables.Messages+'.*, '+sql.tables.Utenti+'.username FROM '+sql.tables.Messages+' LEFT JOIN '+sql.tables.Utenti+' on '+sql.tables.Messages+'.userfrom = '+sql.tables.Utenti+'.id WHERE userfrom=$1', [req.user.id], function(err, data) {
		if (err) rest.error500(res, err);
		else res.json(data.rows);
	});
});

router.get('/:id', function(req, res, next) {
	sql.pool.query('SELECT * FROM '+sql.tables.Messages+' WHERE id=$1', [req.params.id], function(err, data) {
		if (err) rest.error500(res, err);
		else res.json(data.rows.length == 1 ? data.rows[0] : []);
	});
});

router.delete('/:id', function(req, res, next) {
	sql.pool.query('DELETE FROM '+sql.tables.Messages+' WHERE id=$1', [req.params.id], function(err, data) {
		if (err) rest.error500(res, err);
		else rest.deleted(res, data.rows);
	});
});

router.post('/', function(req, res, next) {
	sql.pool.query('INSERT INTO '+sql.tables.Messages+'($1,$2,$3) VALUES ($4,$5, CURRENT_TIMESTAMP())', ["userfrom", "msg", "timePoint", req.user.id, req.body.msg ], function(err, data) {
		if (err) rest.error500(res, err);
		else rest.created(res, data.rows);
	});
});

router.put('/:id', function(req, res, next) {
	sql.pool.query('UPDATE '+sql.tables.Messages+' SET $1 = $2 WHERE $3 = $4', ["msg", req.body.msg, "id", req.params.id], function(err, data) {
		if (err) rest.error500(res, err);
		else rest.updated(res, data.rows);
	});
});

module.exports = router;
