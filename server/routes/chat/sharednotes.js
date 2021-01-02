var rest = require('../../helpers/rest.js');
var sql = require('../../helpers/db.js');
var tableName = 'SharedNotes';

var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {

	sql.pool.query('SELECT '+sql.tables.SharedNotes+'.*, '+sql.tables.Utenti+'.username FROM '+sql.tables.SharedNotes+' LEFT JOIN '+sql.tables.Utenti+' on '+sql.tables.SharedNotes+'.create_user = '+sql.tables.Utenti+'.id', function(err, data) {
		if (err) rest.error500(res, err);
		else res.json(data.rows);
	});
});

router.get('/:id', function(req, res, next) {
	sql.pool.query('SELECT * FROM '+sql.tables.SharedNotes+' WHERE id=$1', [req.params.id], function(err, data) {
		if (err) rest.error500(res, err);
		else res.json(data.rows.length == 1 ? data.rows[0] : []);
	});
});

router.delete('/:id', function(req, res, next) {
	sql.pool.query('DELETE FROM '+sql.tables.SharedNotes+' WHERE id=$1', [req.params.id], function(err, data) {
		if (err) rest.error500(res, err);
		else rest.deleted(res, data.rows);
	});
});

router.post('/', function(req, res, next) {
	sql.pool.query('INSERT INTO '+sql.tables.SharedNotes+'($1,$2,$3) VALUES ($4,$5, NOW())', ["create_user", "text", "create_timePoint", req.user.id, req.body.text ], function(err, data) {
		if (err) rest.error500(res, err);
		else rest.created(res, data.rows);
	});
});

router.put('/:id', function(req, res, next) {
	sql.pool.query('UPDATE '+sql.tables.SharedNotes+' SET $1 = $2, $3 = $4, create_timePoint=create_timePoint WHERE $5 = $6', ["text", req.body.text, "mod_user", req.user.id, "id", req.params.id], function(err, data) {
		if (err) rest.error500(res, err);
		else rest.updated(res, data.rows);
	});
});

module.exports = router;
