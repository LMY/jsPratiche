var rest = require('../../helpers/rest.js');
var sql = require('../../helpers/db.js');
var tableName = 'Strumenti';

var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
	sql.query('SELECT * FROM '+tableName, function(err, data) {
		if (err) rest.error500(res, err);
		else res.json(data);
	});
});

// GET strumenti di una catena
router.get('/catena/:id', function(req, res, next) {
	var query = sql.format('SELECT * FROM ?? WHERE id IN (SELECT idStrumento FROM StrumentiDelleCatene WHERE idCatena=?)', [tableName, req.params.id]);

	sql.query(query, function(err, data) {
		if (err) rest.error500(res, err);
		else res.json(data);
	});
});

// GET strumenti di nessuna catena
router.get('/free', function(req, res, next) {
	var query = sql.format('SELECT * FROM ?? WHERE id NOT IN (SELECT idStrumento FROM StrumentiDelleCatene)', [tableName]);

	sql.query(query, function(err, data) {
		if (err) rest.error500(res, err);
		else res.json(data);
	});
});

// ADD/REMOVE strumenti a una catena
router.put('/free/:id', function(req, res, next) {
	var query = "";

	if (req.body.verb == 'add')
		query = sql.format("INSERT INTO StrumentiDelleCatene(??,??) VALUES (?,?)", ["idCatena", "idStrumento", req.params.id, req.body.idStrumento ]);
	else if (req.body.verb == 'remove')
		query = sql.format('DELETE FROM StrumentiDelleCatene WHERE idCatena=? AND idStrumento=?', [req.params.id, req.body.idStrumento ]);
	else {
		rest.error500(res, 'no verb specified');
		return;
	}

	sql.query(query, function(err, data) {
		if (err) rest.error500(res, err);
		else rest.deleted(res, data);
	});
});


// altri metodi di /strumenti
router.get('/:id', function(req, res, next) {
	var query = sql.format('SELECT * FROM ?? WHERE id=?', [tableName, req.params.id]);

	sql.query(query, function(err, data) {
		if (err) rest.error500(res, err);
		else res.json(data.length == 1 ? data[0] : []);
	});
});

router.delete('/:id', function(req, res, next) {
	var query = sql.format('DELETE FROM ?? WHERE id=?', [tableName, req.params.id]);

	sql.query(query, function(err, data) {
		if (err) rest.error500(res, err);
		else rest.deleted(res, data);
	});
});

router.post('/', function(req, res, next) {
	var query =  sql.format("INSERT INTO ??(??,??,??,??,??,??,??,??) VALUES (?,?,?,?,?,?,?,?)", [tableName, "name", "marca", "modello", "serial", "inventario", "tipo", "taratura", "note", req.body.name, req.body.marca, req.body.modello, req.body.serial, req.body.inventario, req.body.tipo, req.body.taratura, req.body.note ]);

	sql.query(query, function(err, data) {
		if (err) rest.error500(res, err);
		else rest.created(res, data);
	});
});

router.put('/:id', function(req, res, next) {
	var query = sql.format("UPDATE ?? SET ?? = ?, ?? = ?, ?? = ?, ?? = ?, ?? = ?, ?? = ?, ?? = ?, ?? = ? WHERE ?? = ?", [tableName, "name", req.body.name, "marca", req.body.marca, "modello", req.body.modello, "serial", req.body.serial, "inventario", req.body.inventario, "tipo", req.body.tipo, "taratura", req.body.taratura, "note", req.body.note, "id", req.params.id]);

	sql.query(query, function(err, data) {
		if (err) rest.error500(res, err);
		else rest.updated(res, data);
	});
});

module.exports = router;
