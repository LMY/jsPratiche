var rest = require('../helpers/rest.js');
var mysql = require('mysql');
var sql = require('../helpers/db.js');
var tableName = 'Pratiche';

var express = require('express');
var router = express.Router();

/* GET /pratiche in corso listing. */
router.get('/', function(req, res, next) {
    sql(function(err,connection) {
		var query = "SELECT T3.*, T4.stringUser, T5.diff FROM (SELECT Pratiche.*, idStato, Gestori.name as stringGestore, Comuni.name as stringComune, ConstTipoPratiche.descrizione as stringTipo, T1.stringStato, T1.final FROM Pratiche LEFT JOIN Gestori on idGestore=Gestori.id LEFT JOIN Comuni on idComune = Comuni.id LEFT JOIN ConstTipoPratiche on tipopratica = ConstTipoPratiche.id LEFT JOIN (SELECT StatoPratiche.*, ConstStatoPratiche.descrizione as stringStato, ConstStatoPratiche.final FROM StatoPratiche LEFT JOIN ConstStatoPratiche on idStato = ConstStatoPratiche.id  WHERE StatoPratiche.id IN (SELECT MAX(id) as id FROM StatoPratiche GROUP BY idPratica)) as T1 on Pratiche.id = T1.idPratica) as T3 LEFT JOIN (SELECT T2.idPratica, T2.timepoint as timePointInCarico, Utenti.username as stringUser FROM (SELECT StatoPratiche.* FROM StatoPratiche WHERE StatoPratiche.id IN (SELECT MAX(StatoPratiche.id) as id FROM StatoPratiche WHERE StatoPratiche.idStato=2 GROUP BY idPratica)) AS T2 LEFT JOIN AssStatoPraticheUtenti on T2.id=AssStatoPraticheUtenti.idStato LEFT JOIN Utenti on AssStatoPraticheUtenti.idUtente=Utenti.id) as T4 on T3.id = T4.idPratica LEFT JOIN (SELECT idPratica, SUM(DATEDIFF(dateIN, dateOUT)) as diff FROM StatoPratiche LEFT JOIN AssStatoPraticheIntegrazioni on StatoPratiche.id=AssStatoPraticheIntegrazioni.idStato LEFT JOIN Integrazioni on AssStatoPraticheIntegrazioni.idInteg = Integrazioni.id GROUP BY idPratica) AS T5 on T3.id = T5.idPratica WHERE final=0 OR FINAL IS NULL;";

		connection.query(query, function(err, data) {
            if (err) rest.error500(res, err);
			else res.json(data);
        });
    });
});

/* GET /pratiche storico listing. */
router.get('/all', function(req, res, next) {
    sql(function(err,connection) {
		var query = "SELECT T3.*, T4.stringUser, T5.diff FROM (SELECT Pratiche.*, idStato, Gestori.name as stringGestore, Comuni.name as stringComune, ConstTipoPratiche.descrizione as stringTipo, T1.stringStato, T1.final FROM Pratiche LEFT JOIN Gestori on idGestore=Gestori.id LEFT JOIN Comuni on idComune = Comuni.id LEFT JOIN ConstTipoPratiche on tipopratica = ConstTipoPratiche.id LEFT JOIN (SELECT StatoPratiche.*, ConstStatoPratiche.descrizione as stringStato, ConstStatoPratiche.final FROM StatoPratiche LEFT JOIN ConstStatoPratiche on idStato = ConstStatoPratiche.id  WHERE StatoPratiche.id IN (SELECT MAX(id) as id FROM StatoPratiche GROUP BY idPratica)) as T1 on Pratiche.id = T1.idPratica) as T3 LEFT JOIN (SELECT T2.idPratica, T2.timepoint as timePointInCarico, Utenti.username as stringUser FROM (SELECT StatoPratiche.* FROM StatoPratiche WHERE StatoPratiche.id IN (SELECT MAX(StatoPratiche.id) as id FROM StatoPratiche WHERE StatoPratiche.idStato=2 GROUP BY idPratica)) AS T2 LEFT JOIN AssStatoPraticheUtenti on T2.id=AssStatoPraticheUtenti.idStato LEFT JOIN Utenti on AssStatoPraticheUtenti.idUtente=Utenti.id) as T4 on T3.id = T4.idPratica LEFT JOIN (SELECT idPratica, SUM(DATEDIFF(dateIN, dateOUT)) as diff FROM StatoPratiche LEFT JOIN AssStatoPraticheIntegrazioni on StatoPratiche.id=AssStatoPraticheIntegrazioni.idStato LEFT JOIN Integrazioni on AssStatoPraticheIntegrazioni.idInteg = Integrazioni.id GROUP BY idPratica) AS T5 on T3.id = T5.idPratica;";

		connection.query(query, function(err, data) {
            if (err) rest.error500(res, err);
			else res.json(data);
        });
    });
});

/* GET /pratiche/correggere in correzione listing. */
router.get('/correggere', function(req, res, next) {
    sql(function(err,connection) {
		var query = "SELECT T3.*, T4.stringUser, T5.diff FROM (SELECT Pratiche.*, idStato, Gestori.name as stringGestore, Comuni.name as stringComune, ConstTipoPratiche.descrizione as stringTipo, T1.stringStato, T1.final FROM Pratiche LEFT JOIN Gestori on idGestore=Gestori.id LEFT JOIN Comuni on idComune = Comuni.id LEFT JOIN ConstTipoPratiche on tipopratica = ConstTipoPratiche.id LEFT JOIN (SELECT StatoPratiche.*, ConstStatoPratiche.descrizione as stringStato, ConstStatoPratiche.final FROM StatoPratiche LEFT JOIN ConstStatoPratiche on idStato = ConstStatoPratiche.id  WHERE StatoPratiche.id IN (SELECT MAX(id) as id FROM StatoPratiche GROUP BY idPratica)) as T1 on Pratiche.id = T1.idPratica) as T3 LEFT JOIN (SELECT T2.idPratica, T2.timepoint as timePointInCarico, Utenti.username as stringUser FROM (SELECT StatoPratiche.* FROM StatoPratiche WHERE StatoPratiche.id IN (SELECT MAX(StatoPratiche.id) as id FROM StatoPratiche WHERE StatoPratiche.idStato=2 GROUP BY idPratica)) AS T2 LEFT JOIN AssStatoPraticheUtenti on T2.id=AssStatoPraticheUtenti.idStato LEFT JOIN Utenti on AssStatoPraticheUtenti.idUtente=Utenti.id) as T4 on T3.id = T4.idPratica LEFT JOIN (SELECT idPratica, SUM(DATEDIFF(dateIN, dateOUT)) as diff FROM StatoPratiche LEFT JOIN AssStatoPraticheIntegrazioni on StatoPratiche.id=AssStatoPraticheIntegrazioni.idStato LEFT JOIN Integrazioni on AssStatoPraticheIntegrazioni.idInteg = Integrazioni.id GROUP BY idPratica) AS T5 on T3.id = T5.idPratica WHERE idStato = 4 OR idStato = 5";

		connection.query(query, function(err, data) {
            if (err) rest.error500(res, err);
			else res.json(data);
        });
    });
});

/* GET /pratiche/protocollare in uscita ma senza protocollo listing. */
router.get('/protocollare', function(req, res, next) {
    sql(function(err,connection) {
		var query = "SELECT T3.*, T4.stringUser, T5.diff FROM (SELECT Pratiche.*, idStato, Gestori.name as stringGestore, Comuni.name as stringComune, ConstTipoPratiche.descrizione as stringTipo, T1.stringStato, T1.final FROM Pratiche LEFT JOIN Gestori on idGestore=Gestori.id LEFT JOIN Comuni on idComune = Comuni.id LEFT JOIN ConstTipoPratiche on tipopratica = ConstTipoPratiche.id LEFT JOIN (SELECT StatoPratiche.*, ConstStatoPratiche.descrizione as stringStato, ConstStatoPratiche.final FROM StatoPratiche LEFT JOIN ConstStatoPratiche on idStato = ConstStatoPratiche.id  WHERE StatoPratiche.id IN (SELECT MAX(id) as id FROM StatoPratiche GROUP BY idPratica)) as T1 on Pratiche.id = T1.idPratica) as T3 LEFT JOIN (SELECT T2.idPratica, T2.timepoint as timePointInCarico, Utenti.username as stringUser FROM (SELECT StatoPratiche.* FROM StatoPratiche WHERE StatoPratiche.id IN (SELECT MAX(StatoPratiche.id) as id FROM StatoPratiche WHERE StatoPratiche.idStato=2 GROUP BY idPratica)) AS T2 LEFT JOIN AssStatoPraticheUtenti on T2.id=AssStatoPraticheUtenti.idStato LEFT JOIN Utenti on AssStatoPraticheUtenti.idUtente=Utenti.id) as T4 on T3.id = T4.idPratica LEFT JOIN (SELECT idPratica, SUM(DATEDIFF(dateIN, dateOUT)) as diff FROM StatoPratiche LEFT JOIN AssStatoPraticheIntegrazioni on StatoPratiche.id=AssStatoPraticheIntegrazioni.idStato LEFT JOIN Integrazioni on AssStatoPraticheIntegrazioni.idInteg = Integrazioni.id GROUP BY idPratica) AS T5 on T3.id = T5.idPratica WHERE idStato = 6";

		connection.query(query, function(err, data) {
            if (err) rest.error500(res, err);
			else res.json(data);
        });
    });
});

router.get('/:id', function(req, res, next) {
    sql(function(err, connection) {
		var query = mysql.format("SELECT Pratiche.*, idStato, Gestori.name as stringGestore, Comuni.name as stringComune, ConstTipoPratiche.descrizione as stringTipo, T1.stringStato, 'boh' as stringUser FROM Pratiche LEFT JOIN Gestori on idGestore=Gestori.id LEFT JOIN Comuni on idComune = Comuni.id LEFT JOIN ConstTipoPratiche on tipopratica = ConstTipoPratiche.id LEFT JOIN (SELECT StatoPratiche.*, ConstStatoPratiche.descrizione as stringStato FROM StatoPratiche LEFT JOIN ConstStatoPratiche on idStato = ConstStatoPratiche.id  WHERE StatoPratiche.id IN (SELECT MAX(id) as id FROM StatoPratiche GROUP BY idPratica)) as T1 on Pratiche.id = T1.idPratica WHERE Pratiche.id=?", [req.params.id]);

		connection.query(query, function(err, data) {
            if (err) rest.error500(res, err);
			else res.json(data.length == 1 ? data[0] : []);
        });
    });
});

router.post('/', function(req, res, next) {

    sql(function (err, connection) {
		connection.query('START TRANSACTION;', function(err, data) {
			if (err) rest.error500(res, err);
			else {
				var query = mysql.format('INSERT INTO ??(idGestore, idComune, address, sitecode, tipopratica, protoIN, dataIN, protoOUT, dataOUT, note) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', [tableName, req.body.idGestore, req.body.idComune, req.body.address, req.body.sitecode, req.body.tipopratica, req.body.protoIN, req.body.dataIN, req.body.protoOUT, req.body.dataOUT, req.body.note]);

				connection.query(query, function(err, data) {
					if (err) rest.error500(res, err);
					else
						connection.query("SELECT LAST_INSERT_ID() AS id;", function(err, datares) {
							if (err) rest.error500(res, err);
							else {
								var lastid = datares[0].id;
								var query2 = mysql.format("INSERT INTO StatoPratiche(idPratica,idUtenteModifica,idStato) VALUES (?,?,?)", [lastid, req.user.id, 1]);

								connection.query(query2, function(err, datares2) {
									if (err) rest.error500(res, err);
									else {
										connection.query('COMMIT;', function(err, data) {
											if (err) rest.error500(res, err);
											rest.created(res, datares[0]);
										});
									}
								});
							}
						});
				});
			}
		});
    });
});

router.put('/:id', function(req, res, next) {
    sql(function (err, connection) {
        var query = mysql.format('UPDATE ?? SET idGestore = ?, idComune = ?, address = ?, sitecode = ?, tipopratica = ?, protoIN = ?, dataIN = ?, protoOUT = ?, dataOUT = ?, note = ? WHERE id = ?', [tableName, req.body.idGestore, req.body.idComune, req.body.address, req.body.sitecode, req.body.tipopratica, req.body.protoIN, req.body.dataIN, req.body.protoOUT, req.body.dataOUT, req.body.note, req.params.id]);

        connection.query(query, function(err, data) {
            if (err) rest.error500(res, err);
            else rest.updated(res, data);
        });
    });
});

/* PUT /pratiche/protoout/:id */
router.put('/protoout/:id', function(req, res, next) {

	sql(function (err, connection) {
		connection.query('START TRANSACTION;', function(err, data) {
			if (err) rest.error500(res, err);
			else
				connection.query(mysql.format('UPDATE ?? SET protoOUT = ?, dataOUT = ? WHERE id = ?', [tableName, req.body.protoOUT, req.body.dataOUT, req.params.id]), function(err, data) {
					if (err) rest.error500(res, err);
					else
						connection.query(mysql.format("INSERT INTO StatoPratiche(idPratica,idStato,idUtenteModifica) VALUES (?,?,?)", [ req.params.id, 12, req.user.id ]), function(err, datares2) {
							if (err) rest.error500(res, err);
							else {
								connection.query('COMMIT;', function(err, data) {
									if (err) rest.error500(res, err);
									else rest.updated(res, datares2);
								});
							}
						});
				});
		});
    });
});

router.delete('/:id', function(req, res, next) {

    sql(function (err, connection) {
		var query = mysql.format("INSERT INTO StatoPratiche(idPratica,idStato,idUtenteModifica) VALUES (?,?,?)", [ req.params.id, 10, req.user.id ]);

		connection.query(query, function(err, data) {
			if (err) rest.error500(res, err);
			else rest.deleted(res, data);
		});
    });
});

module.exports = router;
