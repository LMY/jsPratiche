var rest = require('../helpers/rest.js');
var sql = require('../helpers/db.js');

var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
    sql.query('SELECT * FROM Comuni', function(err, data) {
		if (err) rest.error500(res, err);
		else res.json(data);
	});
});

router.get('/:id', function(req, res, next) {
	var query = sql.format('SELECT * FROM Comuni WHERE id=?', [req.params.id]);

	sql.query(query, function(err, data) {
		if (err) rest.error500(res, err);
		else res.json(data.length == 1 ? data[0] : []);
	});
});

router.delete('/:id', function(req, res, next) {
	var query = sql.format('DELETE FROM Comuni WHERE id=?', [req.params.id]);

	sql.query(query, function(err, data) {
		if (err) rest.error500(res, err);
		else rest.deleted(res, data);
	});
});

router.post('/', function(req, res, next) {
	var query =  sql.format("INSERT INTO Comuni(name,pec,idaas,province) VALUES (?,?,?,?)", [req.body.name, req.body.pec, req.body.idaas, req.body.province]);

	sql.query(query, function(err, data) {
		if (err) rest.error500(res, err);
		else rest.created(res, data);
	});
});

router.put('/:id', function(req, res, next) {
	var query = sql.format("UPDATE Comuni SET name = ?, pec = ?, idaas = ?, province = ? WHERE id = ?", [req.body.name, req.body.pec, req.body.idaas, req.body.province, req.params.id]);

	sql.query(query, function(err, data) {
		if (err) rest.error500(res, err);
		else rest.updated(res, data);
	});
});

module.exports = router;
