var rest = require('../../helpers/rest.js');
var sql = require('../../helpers/db.js');

var express = require('express');
var router = express.Router();


router.get('/', function(req, res, next) {
	if (!req.query.dateFrom || !req.query.dateTo)
		rest.error500(res, "Not permitted");
	else
		sql.query(sql.format("SELECT * FROM LinkSitiPratiche WHERE idpratica IN (SELECT id FROM Pratiche where dateOUT BETWEEN ? AND ?)",
								[ req.query.dateFrom, req.query.dateTo ]), function(err, data) {
			if (err) rest.error500(res, err);
			else rest.json(res, data);
		});		
});

router.get('/:id', function(req, res, next) {
	var query = sql.format("SELECT * FROM LinkSitiPratiche WHERE idpratica=?", [req.params.id]);

	sql.query(query, function(err, data) {
		if (err) rest.error500(res, err);
		else rest.json(res, data);
	});
});

router.post('/', function(req, res, next) {
	var query = sql.format("INSERT INTO LinkSitiPratiche(idsite,idpratica,flag87bis,flagSupTerra,flagA24,idriconf) VALUES (?,?,?,?,?,?)",
//	ON DUPLICATE KEY UPDATE idpratica=idpratica, flag87bis=flag87bis, flagSupTerra=flagSupTerra, flagA24=flagA24",
							[ req.body.idsite, req.body.idpratica, req.body.flag87bis, req.body.flagSupTerra, req.body.flagA24, req.body.idriconf ]);

	sql.query(query, function(err, data) {
		if (err) rest.error500(res, err);
		else rest.created(res, data);
	});
});

router.put('/:idsite', function(req, res, next) {
	var query = sql.format("UPDATE LinkSitiPratiche SET idpratica=?, flag87bis=?, flagSupTerra=?, flagA24=?, idriconf=? WHERE idsite=?",
							[ req.body.idpratica, req.body.flag87bis, req.body.flagSupTerra, req.body.flagA24, req.body.idriconf, req.params.idsite ]);

	sql.query(query, function(err, data) {
		if (err) rest.error500(res, err);
		else rest.updated(res, data);
	});
});

router.delete('/:idsite', function(req, res, next) {
	var query = sql.format("DELETE FROM LinkSitiPratiche WHERE idsite = ?", [ req.params.idsite ]);

	sql.query(query, function(err, data) {
		if (err) rest.error500(res, err);
		else rest.deleted(res, data);
	});
});

module.exports = router;
