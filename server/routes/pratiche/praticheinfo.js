var rest = require('../../helpers/rest.js');
var sql = require('../../helpers/db.js');

var express = require('express');
var router = express.Router();


router.get('/', function(req, res, next) {
	rest.error500(res, "Not permitted");
});

router.get('/:id', function(req, res, next) {
	var query = sql.format("SELECT * FROM LinkSitiPratiche WHERE idpratica=?", [req.params.id]);

	sql.query(query, function(err, data) {
		if (err) rest.error500(res, err);
		else rest.json(res, data);
	});
});

router.post('/', function(req, res, next) {
	var query = sql.format("INSERT INTO LinkSitiPratiche(idsite,idpratica,flag87bis,flagSupTerra,flagA24) VALUES (?,?,?,?,?)",
//	ON DUPLICATE KEY UPDATE idpratica=idpratica, flag87bis=flag87bis, flagSupTerra=flagSupTerra, flagA24=flagA24",
							[ req.body.idsite, req.body.idpratica, req.body.flag87bis, req.body.flagSupTerra, req.body.flagA24 ]);

	sql.query(query, function(err, data) {
		if (err) rest.error500(res, err);
		else rest.created(res, data);
	});
});

router.put('/:idsite', function(req, res, next) {
	var query = sql.format("UPDATE LinkSitiPratiche SET idpratica=?, flag87bis=?, flagSupTerra=?, flagA24=? WHERE idsite=?",
							[ req.body.idpratica, req.body.flag87bis, req.body.flagSupTerra, req.body.flagA24, req.params.idsite ]);

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
