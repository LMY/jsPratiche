var mysql = require('mysql');
var sql = require('../helpers/db.js');
var tableName = 'Pratiche';

var express = require('express');
var router = express.Router();

/* GET /pratiche listing. */
router.get('/', function(req, res, next) {
    sql(function(err,connection) {
		var query = "select Pratiche.id, Pratiche.idGestore, Pratiche.idComune, Pratiche.address, Pratiche.sitecode, Pratiche.tipopratica, Pratiche.protoIN, Pratiche.dataIN, Pratiche.protoOUT, Pratiche.dataOUT, Pratiche.note, Gestori.name as nameGestore, Comuni.name as nameComune, ConstTipoPratiche.descrizione as nameTipo, B.idUtente, B.idStato, B.timePoint, B.stringStato FROM Pratiche INNER JOIN Gestori on (Pratiche.idGestore = Gestori.id) INNER JOIN Comuni on (Pratiche.idComune = Comuni.id) INNER JOIN ConstTipoPratiche on (Pratiche.tipopratica = ConstTipoPratiche.id) LEFT JOIN (select StatoPratiche.idPratica, StatoPratiche.idUtente, StatoPratiche.idStato, StatoPratiche.timePoint, ConstStatoPratiche.descrizione as stringStato FROM StatoPratiche INNER JOIN ConstStatoPratiche on (StatoPratiche.idStato = ConstStatoPratiche.id)) AS B on (Pratiche.id = B.idPratica) ORDER BY Pratiche.ID;";
		
		connection.query(query, function(err, rows) {
            if (err) throw err;
			res.json(rows);
        });
    });
});

/* GET /pratiche/id */
router.get('/:id', function(req, res, next) {
    sql(function(err, connection) {
		var query = mysql.format("select Pratiche.id, Pratiche.idGestore, Pratiche.idComune, Pratiche.address, Pratiche.sitecode, Pratiche.tipopratica, Pratiche.protoIN, Pratiche.dataIN, Pratiche.protoOUT, Pratiche.dataOUT, Pratiche.note, Gestori.name as nameGestore, Comuni.name as nameComune, ConstTipoPratiche.descrizione as nameTipo, B.idUtente, B.idStato, B.timePoint, B.stringStato FROM Pratiche INNER JOIN Gestori on (Pratiche.idGestore = Gestori.id) INNER JOIN Comuni on (Pratiche.idComune = Comuni.id) INNER JOIN ConstTipoPratiche on (Pratiche.tipopratica = ConstTipoPratiche.id) LEFT JOIN (select StatoPratiche.idPratica, StatoPratiche.idUtente, StatoPratiche.idStato, StatoPratiche.timePoint, ConstStatoPratiche.descrizione as stringStato FROM StatoPratiche INNER JOIN ConstStatoPratiche on (StatoPratiche.idStato = ConstStatoPratiche.id)) AS B on (Pratiche.id = B.idPratica) WHERE Pratiche.id=?", [req.params.id]);
		
		connection.query(query, function(err, data) {
            if (err) throw err;
			res.json(data.length == 1 ? data[0] : []);
        });
    });
});

/* POST /pratiche */
router.post('/', function(req, res, next) {

    sql(function (err, connection) {
        var query = mysql.format('INSERT INTO ??(idGestore, idComune, address, sitecode, tipopratica, protoIN, dataIN, protoOUT, dataOUT, note) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', [tableName, req.body.idGestore, req.body.idComune, req.body.address, req.body.sitecode, req.body.tipopratica, req.body.protoIN, req.body.dataIN, req.body.protoOUT, req.body.dataOUT, req.body.note]);
	
        connection.query(query, function(err, rows) {
            if (err) console.log("Error inserting : %s ", err);
			res.json(rows);
        });
    });
});

/* PUT /pratiche/:id */
router.put('/:id', function(req, res, next) {
    sql(function (err, connection) {
        var query = mysql.format('UPDATE ?? SET idGestore = ?, idComune = ?, address = ?, sitecode = ?, tipopratica = ?, protoIN = ?, dataIN = ?, protoOUT = ?, dataOUT = ?, note = ? WHERE id = ?', [tableName, req.body.idGestore, req.body.idComune, req.body.address, req.body.sitecode, req.body.tipopratica, req.body.protoIN, req.body.dataIN, req.body.protoOUT, req.body.dataOUT, req.body.note, req.params.id]);

        connection.query(query, function(err, rows) {
            if (err) console.log("Error Updating : %s ", err);
			res.json(rows);
        });
    });
});

/* DELETE /pratiche/:id */
router.delete('/:id', function(req, res, next) {
    sql(function (err, connection) {
		var query = mysql.format('DELETE FROM ?? WHERE id=?', [tableName, req.params.id]);
		
        connection.query(query, function(err, rows) {
			if (err) console.log("Error deleting : %s ", err);
			res.json(rows);
        });
    });
});

module.exports = router;
