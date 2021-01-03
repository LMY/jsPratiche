var rest = require('../../helpers/rest.js');
var sql = require('../../helpers/db.js');
var tableName = sql.tables.Links;

var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
	sql.pool.query('SELECT * FROM '+sql.tables.Links+' WHERE id IN (SELECT idurl FROM '+sql.tables.Bookmarks+' WHERE iduser=$1)', [req.user.id], function(err, data) {
		if (err) rest.error500(res, err);
		else res.json(data);
	});
});

/*router.get('/:id', function(req, res, next) {
	sql.pool.query('SELECT * FROM '+sql.tables.Links+' WHERE id=$1', [req.params.id], function(err, data) {
		if (err) rest.error500(res, err);
		else res.json(data.length == 1 ? data[0] : []);
	});
});*/

router.delete('/:id', function(req, res, next) {
	sql.pool.query('DELETE FROM '+sql.tables.Bookmarks+' WHERE idurl=$1 AND isuser=$2', [req.params.id, req.user.id], function(err, data) {
		if (err) rest.error500(res, err);
		else rest.deleted(res, data);
	});
});

router.post('/', function(req, res, next) {
	sql.connect(function (err, connection) {
		connection.query(sql.format('SELECT * FROM '+sql.tables.Links+' WHERE URL=$1', [req.body.url]), function(err, data) {
			if (err) rest.error500(res, err);
			else {
				if (data && data.length == 1) {
					connection.query(sql.format('INSERT INTO '+sql.tables.Bookmarks+'(idurl,isuser) VALUES ($1,$2)', [data[0].id, req.user.id]), function(res, data2) {
						if (err) rest.error500(res, err);
						else rest.json(data2);
					});
				}
				else {
					connection.query(sql.format('INSERT INTO '+sql.tables.Links+'(url) VALUES ($1); SELECT LAST_INSERT_ID() AS id', [req.body.url]), function(res, data2) {
						if (err) rest.error500(res, err);
						else {
							connection.query(sql.format('INSERT INTO '+sql.tables.Bookmarks+'(idurl,isuser) VALUES ($1,$2)', [data2[0].id, req.user.id]), function(res, data) {
								if (err) rest.error500(res, err);
								else rest.json(data);
							});
						}
					});
				}
			}
		});
	});
});

/*router.put('/:id', function(req, res, next) {
	sql.pool.query('UPDATE '+sql.tables.Links+' SET $1 = $2 WHERE $3 = $4', ["url", req.user.url, "name", req.user.name, "id", req.params.id], function(err, data) {
		if (err) rest.error500(res, err);
		else rest.updated(res, data);
	});
});*/

module.exports = router;
