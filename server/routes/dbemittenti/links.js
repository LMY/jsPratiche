var rest = require('../../helpers/rest.js');
var mssql = require('../../helpers/mssql.js');
var sql = require('../../helpers/db.js');

var express = require('express');
var router = express.Router();



function translateUserId(id, callback) {
	sql.query(sql.format('SELECT idlink as id FROM LinkUtenti WHERE id=?', [id]), function(err, data) {
		callback(err, data[0].id);
	});
}

function translateUsername(username, callback) {
	sql.connect(function (err, connection) {
		connection.query(sql.format('SELECT id from Utenti WHERE username=?', [username]), function(err, data) {
			if (err) callback(err, []);
			else {
				connection.query(sql.format('SELECT idlink as id FROM LinkUtenti WHERE id=?', [data[0].id]), function(err, data2) {
					callback(err, data2[0].id);
				});
			}
		});
	});
}

function translateSiteToPratica(id, callback) {
	sql.query(sql.format('SELECT idsite as id FROM LinkSitiPratiche WHERE idpratica=?', [id]), function(err, data) {
		callback(err, data[0].id);
	});
}

function translatePraticaToSites(id, callback) {
	sql.query(sql.format('SELECT idpratica as id FROM LinkSitiPratiche WHERE idsite=?', [id]), function(err, data) {
		if (err) callback(err, data);
		
		function enqueue(i, data, ret) {
			if (i == data.length)
				callback(err, ret);
			else {
				ret.push(data[i].id);
				enqueue(i+1, data, ret);
			}
		}
		
		enqueue(0, data, []);
	});
}





router.get('/user/me', function(req, res, next) {
	translateUserId(req.user.id, function(err, data) {
		if (err) rest.error500(res, err);
		else rest.json(res, data);
	});
});

router.get('/user/name/:id', function(req, res, next) {
	translateUsername(req.params.id, function(err, data) {
		if (err) rest.error500(res, err);
		else rest.json(res, data);
	});
});

router.get('/user/id/:id', function(req, res, next) {
	translateUserId(req.params.id, function(err, data) {
		if (err) rest.error500(res, err);
		else rest.json(res, data);
	});
});

router.get('/site/:id', function(req, res, next) {
	translateSiteToPratica(req.params.id, function(err, data) {
		if (err) rest.error500(res, err);
		else rest.json(res, data);
	});
});

module.exports = router;
