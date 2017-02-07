var rest = require('../../helpers/rest.js');

var express = require('express');
var router = express.Router();

const shared = require('./shared.js');


router.get('/user/me', function(req, res, next) {
	shared.conTranslateUserId(req.user.id, function(err, data) {
		if (err) rest.error500(res, err);
		else rest.json(res, data);
	});
});

router.get('/user/name/:id', function(req, res, next) {
	shared.conTranslateUsername(req.params.id, function(err, data) {
		if (err) rest.error500(res, err);
		else rest.json(res, data);
	});
});

router.get('/user/id/:id', function(req, res, next) {
	shared.conTranslateUserId(req.params.id, function(err, data) {
		if (err) rest.error500(res, err);
		else rest.json(res, data);
	});
});

router.get('/site/:id', function(req, res, next) {
	shared.conTranslatePraticaToSites(req.params.id, function(err, data) {
		if (err) rest.error500(res, err);
		else rest.json(res, data);
	});
});

module.exports = router;
