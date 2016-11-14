var rest = require('../../helpers/rest.js');
var sql = require('../../helpers/db.js');
var tableName = 'Links';

var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
	var query = sql.format('SELECT * FROM Links WHERE id IN (SELECT idurl FROM Bookmarks WHERE iduser=?)', [req.user.id]);

	sql.query(query, function(err, data) {
		if (err) rest.error500(res, err);
		else res.json(data);
	});
});

/*router.get('/:id', function(req, res, next) {
	var query = sql.format('SELECT * FROM Links WHERE id=?', [req.params.id]);

	sql.query(query, function(err, data) {
		if (err) rest.error500(res, err);
		else res.json(data.length == 1 ? data[0] : []);
	});
});*/

router.delete('/:id', function(req, res, next) {
	var query = sql.format('DELETE FROM Bookmarks WHERE idurl=? AND isuser=?', [req.params.id, req.user.id]);

	sql.query(query, function(err, data) {
		if (err) rest.error500(res, err);
		else rest.deleted(res, data);
	});
});

router.post('/', function(req, res, next) {
	sql.connect(function (err, connection) {
		connection.query(sql.format("SELECT * FROM Links WHERE URL=?", [req.body.url]), function(err, data) {
			if (err) rest.error500(res, err);
			else {
				if (data && data.length == 1) {
					connection.query(sql.format("INSERT INTO Bookmarks(idurl,isuser) VALUES (?,?)", [data[0].id, req.user.id]), function(res, data2) {
						if (err) rest.error500(res, err);
						else rest.json(data2);
					});
				}
				else {
					connection.query(sql.format("INSERT INTO Links(url) VALUES (?); SELECT LAST_INSERT_ID() AS id", [req.body.url]), function(res, data2) {
						if (err) rest.error500(res, err);
						else {
							connection.query(sql.format("INSERT INTO Bookmarks(idurl,isuser) VALUES (?,?)", [data2[0].id, req.user.id]), function(res, data) {
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
	var query = sql.format("UPDATE ?? SET ?? = ? WHERE ?? = ?", [tableName, "url", req.user.url, "name", req.user.name, "id", req.params.id]);

	sql.query(query, function(err, data) {
		if (err) rest.error500(res, err);
		else rest.updated(res, data);
	});
});*/

module.exports = router;
