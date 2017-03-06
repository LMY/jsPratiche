var rest = require('../../helpers/rest.js');
var sql = require('../../helpers/db.js');
var tableName = 'Pratiche';

var express = require('express');
var router = express.Router();

const shared = require('../dbemittenti/shared.js');


/* GET /pratiche in corso listing. */
router.get('/', function(req, res, next) {
	var query = "SELECT T3.*, T4.stringUser, T5.diff FROM (SELECT Pratiche.*, idStato, Gestori.name as stringGestore, Comuni.name as stringComune, ConstTipoPratiche.descrizione as stringTipo, T1.stringStato, T1.final FROM Pratiche LEFT JOIN Gestori on idGestore=Gestori.id LEFT JOIN Comuni on idComune = Comuni.id LEFT JOIN ConstTipoPratiche on tipopratica = ConstTipoPratiche.id LEFT JOIN (SELECT StatoPratiche.*, ConstStatoPratiche.descrizione as stringStato, ConstStatoPratiche.final FROM StatoPratiche LEFT JOIN ConstStatoPratiche on idStato = ConstStatoPratiche.id  WHERE StatoPratiche.id IN (SELECT MAX(id) as id FROM StatoPratiche GROUP BY idPratica)) as T1 on Pratiche.id = T1.idPratica) as T3 LEFT JOIN (SELECT T2.idPratica, T2.timepoint as timePointInCarico, Utenti.username as stringUser FROM (SELECT StatoPratiche.* FROM StatoPratiche WHERE StatoPratiche.id IN (SELECT MAX(StatoPratiche.id) as id FROM AssStatoPraticheUtenti LEFT JOIN StatoPratiche on AssStatoPraticheUtenti.idStato = StatoPratiche.id WHERE StatoPratiche.idStato=2 GROUP BY idPratica)) AS T2 JOIN AssStatoPraticheUtenti on T2.id=AssStatoPraticheUtenti.idStato LEFT JOIN Utenti on AssStatoPraticheUtenti.idUtente=Utenti.id) as T4 on T3.id = T4.idPratica LEFT JOIN (SELECT idPratica, SUM(DATEDIFF(dateIN, dateOUT)) as diff FROM StatoPratiche LEFT JOIN AssStatoPraticheIntegrazioni on StatoPratiche.id=AssStatoPraticheIntegrazioni.idStato LEFT JOIN Integrazioni on AssStatoPraticheIntegrazioni.idInteg = Integrazioni.id GROUP BY idPratica) AS T5 on T3.id = T5.idPratica WHERE final=0 OR FINAL IS NULL";

	sql.query(query, function(err, data) {
		if (err) rest.error500(res, err);
		else res.json(data);
	});
});

router.get('/count', function(req, res, next) {
	var query = "SELECT Pratiche.idGestore as id,Gestori.name,COUNT(idGestore) as count FROM LinkSitiPratiche JOIN Pratiche on LinkSitiPratiche.idPratica = Pratiche.id JOIN Gestori on Pratiche.idGestore = Gestori.id WHERE dateOUT > '2016-12-31' GROUP BY Pratiche.idGestore,Gestori.name";

	sql.query(query, function(err, data) {
		if (err) rest.error500(res, err);
		else res.json(data);
	});
});

/* GET /pratiche storico listing. */
router.get('/all', function(req, res, next) {
	var query = "SELECT T3.*, T4.stringUser, T5.diff FROM (SELECT Pratiche.*, idStato, Gestori.name as stringGestore, Comuni.name as stringComune, ConstTipoPratiche.descrizione as stringTipo, T1.stringStato, T1.final FROM Pratiche LEFT JOIN Gestori on idGestore=Gestori.id LEFT JOIN Comuni on idComune = Comuni.id LEFT JOIN ConstTipoPratiche on tipopratica = ConstTipoPratiche.id LEFT JOIN (SELECT StatoPratiche.*, ConstStatoPratiche.descrizione as stringStato, ConstStatoPratiche.final FROM StatoPratiche LEFT JOIN ConstStatoPratiche on idStato = ConstStatoPratiche.id  WHERE StatoPratiche.id IN (SELECT MAX(id) as id FROM StatoPratiche GROUP BY idPratica)) as T1 on Pratiche.id = T1.idPratica) as T3 LEFT JOIN (SELECT T2.idPratica, T2.timepoint as timePointInCarico, Utenti.username as stringUser FROM (SELECT StatoPratiche.* FROM StatoPratiche WHERE StatoPratiche.id IN (SELECT MAX(StatoPratiche.id) as id FROM AssStatoPraticheUtenti LEFT JOIN StatoPratiche on AssStatoPraticheUtenti.idStato = StatoPratiche.id WHERE StatoPratiche.idStato=2 GROUP BY idPratica)) AS T2 JOIN AssStatoPraticheUtenti on T2.id=AssStatoPraticheUtenti.idStato LEFT JOIN Utenti on AssStatoPraticheUtenti.idUtente=Utenti.id) as T4 on T3.id = T4.idPratica LEFT JOIN (SELECT idPratica, SUM(DATEDIFF(dateIN, dateOUT)) as diff FROM StatoPratiche LEFT JOIN AssStatoPraticheIntegrazioni on StatoPratiche.id=AssStatoPraticheIntegrazioni.idStato LEFT JOIN Integrazioni on AssStatoPraticheIntegrazioni.idInteg = Integrazioni.id GROUP BY idPratica) AS T5 on T3.id = T5.idPratica";

	if (req.query.dateFrom && req.query.dateTo) {
		var dateType = "dateIN";

		if (req.query.dateType) {
			if (req.query.dateType == "dateOUT" || req.query.dateType == "out")
				dateType = "dateOUT";
		}

		query = sql.format(query + " WHERE ?? BETWEEN ? AND ?", [ dateType, req.query.dateFrom, req.query.dateTo ]);
	}

	sql.query(query, function(err, data) {
		if (err) rest.error500(res, err);
		else res.json(data);
	});
});

/* GET /pratiche/correggere in correzione listing. */
router.get('/correggere', function(req, res, next) {
	var query = "SELECT T3.*, T4.stringUser, T5.diff FROM (SELECT Pratiche.*, idStato, Gestori.name as stringGestore, Comuni.name as stringComune, ConstTipoPratiche.descrizione as stringTipo, T1.stringStato, T1.final FROM Pratiche LEFT JOIN Gestori on idGestore=Gestori.id LEFT JOIN Comuni on idComune = Comuni.id LEFT JOIN ConstTipoPratiche on tipopratica = ConstTipoPratiche.id LEFT JOIN (SELECT StatoPratiche.*, ConstStatoPratiche.descrizione as stringStato, ConstStatoPratiche.final FROM StatoPratiche LEFT JOIN ConstStatoPratiche on idStato = ConstStatoPratiche.id  WHERE StatoPratiche.id IN (SELECT MAX(id) as id FROM StatoPratiche GROUP BY idPratica)) as T1 on Pratiche.id = T1.idPratica) as T3 LEFT JOIN (SELECT T2.idPratica, T2.timepoint as timePointInCarico, Utenti.username as stringUser FROM (SELECT StatoPratiche.* FROM StatoPratiche WHERE StatoPratiche.id IN (SELECT MAX(StatoPratiche.id) as id FROM AssStatoPraticheUtenti LEFT JOIN StatoPratiche on AssStatoPraticheUtenti.idStato = StatoPratiche.id WHERE StatoPratiche.idStato=2 GROUP BY idPratica)) AS T2 JOIN AssStatoPraticheUtenti on T2.id=AssStatoPraticheUtenti.idStato LEFT JOIN Utenti on AssStatoPraticheUtenti.idUtente=Utenti.id) as T4 on T3.id = T4.idPratica LEFT JOIN (SELECT idPratica, SUM(DATEDIFF(dateIN, dateOUT)) as diff FROM StatoPratiche LEFT JOIN AssStatoPraticheIntegrazioni on StatoPratiche.id=AssStatoPraticheIntegrazioni.idStato LEFT JOIN Integrazioni on AssStatoPraticheIntegrazioni.idInteg = Integrazioni.id GROUP BY idPratica) AS T5 on T3.id = T5.idPratica WHERE idStato = 4 OR idStato = 5";

	sql.query(query, function(err, data) {
		if (err) rest.error500(res, err);
		else res.json(data);
	});
});

/* GET /pratiche/protocollare in uscita ma senza protocollo listing. */
router.get('/protocollare', function(req, res, next) {
	var query = "SELECT T3.*, T4.stringUser, T5.diff FROM (SELECT Pratiche.*, idStato, Gestori.name as stringGestore, Comuni.name as stringComune, ConstTipoPratiche.descrizione as stringTipo, T1.stringStato, T1.final FROM Pratiche LEFT JOIN Gestori on idGestore=Gestori.id LEFT JOIN Comuni on idComune = Comuni.id LEFT JOIN ConstTipoPratiche on tipopratica = ConstTipoPratiche.id LEFT JOIN (SELECT StatoPratiche.*, ConstStatoPratiche.descrizione as stringStato, ConstStatoPratiche.final FROM StatoPratiche LEFT JOIN ConstStatoPratiche on idStato = ConstStatoPratiche.id  WHERE StatoPratiche.id IN (SELECT MAX(id) as id FROM StatoPratiche GROUP BY idPratica)) as T1 on Pratiche.id = T1.idPratica) as T3 LEFT JOIN (SELECT T2.idPratica, T2.timepoint as timePointInCarico, Utenti.username as stringUser FROM (SELECT StatoPratiche.* FROM StatoPratiche WHERE StatoPratiche.id IN (SELECT MAX(StatoPratiche.id) as id FROM AssStatoPraticheUtenti LEFT JOIN StatoPratiche on AssStatoPraticheUtenti.idStato = StatoPratiche.id WHERE StatoPratiche.idStato=2 GROUP BY idPratica)) AS T2 JOIN AssStatoPraticheUtenti on T2.id=AssStatoPraticheUtenti.idStato LEFT JOIN Utenti on AssStatoPraticheUtenti.idUtente=Utenti.id) as T4 on T3.id = T4.idPratica LEFT JOIN (SELECT idPratica, SUM(DATEDIFF(dateIN, dateOUT)) as diff FROM StatoPratiche LEFT JOIN AssStatoPraticheIntegrazioni on StatoPratiche.id=AssStatoPraticheIntegrazioni.idStato LEFT JOIN Integrazioni on AssStatoPraticheIntegrazioni.idInteg = Integrazioni.id GROUP BY idPratica) AS T5 on T3.id = T5.idPratica WHERE idStato = 6";

	sql.query(query, function(err, data) {
		if (err) rest.error500(res, err);
		else res.json(data);
	});
});

router.get('/:id', function(req, res, next) {
	var query = sql.format("SELECT Pratiche.*, idStato, Gestori.name as stringGestore, Comuni.name as stringComune, ConstTipoPratiche.descrizione as stringTipo, T1.stringStato FROM Pratiche LEFT JOIN Gestori on idGestore=Gestori.id LEFT JOIN Comuni on idComune = Comuni.id LEFT JOIN ConstTipoPratiche on tipopratica = ConstTipoPratiche.id LEFT JOIN (SELECT StatoPratiche.*, ConstStatoPratiche.descrizione as stringStato FROM StatoPratiche LEFT JOIN ConstStatoPratiche on idStato = ConstStatoPratiche.id  WHERE StatoPratiche.id IN (SELECT MAX(id) as id FROM StatoPratiche GROUP BY idPratica)) as T1 on Pratiche.id = T1.idPratica WHERE Pratiche.id=?", [req.params.id]);

	sql.query(query, function(err, data) {
		if (err) rest.error500(res, err);
		else res.json(data.length == 1 ? data[0] : []);
	});
});

router.post('/', function(req, res, next) {

    sql.connect(function (err, connection) {
		connection.query('START TRANSACTION;', function(err, data) {
			if (err) rest.error500(res, err);
			else {
				var query = sql.format('INSERT INTO ??(idGestore, idComune, address, sitecode, tipopratica, protoIN, dateIN, protoOUT, dateOUT, note) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', [tableName, req.body.idGestore, req.body.idComune, req.body.address, req.body.sitecode, req.body.tipopratica, req.body.protoIN, req.body.dateIN, req.body.protoOUT, req.body.dateOUT, req.body.note ]);

				connection.query(query, function(err, data) {
					if (err) rest.error500(res, err);
					else
						connection.query("SELECT LAST_INSERT_ID() AS id;", function(err, datares) {
							if (err) rest.error500(res, err);
							else {
								var lastid = datares[0].id;
								var query2 = sql.format("INSERT INTO StatoPratiche(idPratica,idUtenteModifica,idStato) VALUES (?,?,?)", [lastid, req.user.id, 1]);

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

var setProtoOutOnDBEmittenti = function(id, protoOUT, dateOUT, userid) {
	shared.translatePraticaToSites(id, connection, function(err, idsites) {
		if (err) rest.error500(res, err);
		else {
			function doSetProtoOUT(i, data) {
				if (i == data.length)
					rest.updated(res, null); // null, otherwise Expected response to contain an object but got an array
				else {
					shared.setProtoParere(userid, idsites[i], connection, protoOUT, dateOUT, function(err) {
						if (err) rest.error500(res, err);
						else doSetProtoOUT(i+1, data);
					});
				}
			}

			doSetProtoOUT(0, idsites);
		}
	});	
};

router.put('/:id', function(req, res, next) {
	var query = sql.format('UPDATE ?? SET idGestore = ?, idComune = ?, address = ?, sitecode = ?, tipopratica = ?, protoIN = ?, dateIN = ?, protoOUT = ?, dateOUT = ?, note = ? WHERE id = ?', [tableName, req.body.idGestore, req.body.idComune, req.body.address, req.body.sitecode, req.body.tipopratica, req.body.protoIN, req.body.dateIN, req.body.protoOUT, req.body.dateOUT, req.body.note, req.params.id]);

	sql.query(query, function(err, data) {
		if (err) rest.error500(res, err);
		else {
			// if set proto out, update on db_emittenti
			if (req.body.protoOUT && req.body.dateOUT)
				setProtoOutOnDBEmittenti(req.params.id, req.body.protoOUT, req.body.dateOUT, req.user.id);
			else
				rest.updated(res, data);
		}
	});
});

/* PUT /pratiche/protoout/:id */
router.put('/protoout/:id', function(req, res, next) {
	sql.connect(function (err, connection) {
		connection.query('START TRANSACTION;', function(err, data) {
			if (err) rest.error500(res, err);
			else
				connection.query(sql.format('UPDATE ?? SET protoOUT = ?, dateOUT = ? WHERE id = ?', [tableName, req.body.protoOUT, req.body.dateOUT, req.params.id]), function(err, data) {
					if (err) rest.error500(res, err);
					else
						connection.query(sql.format("INSERT INTO StatoPratiche(idPratica,idStato,idUtenteModifica) VALUES (?,?,?)", [ req.params.id, 12, req.user.id ]), function(err, datares2) {
							if (err) rest.error500(res, err);
							else {
								connection.query('COMMIT;', function(err, data) {
									if (err) rest.error500(res, err);
									else {
										// update db_emittenti
										setProtoOutOnDBEmittenti(req.params.id, req.body.protoOUT, req.body.dateOUT, req.user.id);
									}
								});
							}
						});
				});
		});
	});
});

router.delete('/:id', function(req, res, next) {
	var query = sql.format("INSERT INTO StatoPratiche(idPratica,idStato,idUtenteModifica) VALUES (?,?,?)", [ req.params.id, 10, req.user.id ]);

	sql.query(query, function(err, data) {
		if (err) rest.error500(res, err);
		else rest.deleted(res, data);
	});
});

module.exports = router;
