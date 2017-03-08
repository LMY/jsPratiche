var rest = require('../../helpers/rest.js');
var sql = require('../../helpers/db.js');
var tableName = 'Pratiche';

var express = require('express');
var router = express.Router();

const shared = require('../dbemittenti/shared.js');

const daBigQuery = "SELECT P.*, Q.*, csp.descrizione as stringStato, Comuni.name as stringComune, Gestori.name as stringGestore, ctp.descrizione as stringTipo, csp.final, dt.diff, tmo.dateCommOst FROM Pratiche P INNER JOIN (SELECT sp.idPratica, sp.idStato, sp.idUtenteModifica, sp.timePoint, sq.timePointInCarico, sq.userid, sq.username as stringUser FROM StatoPratiche sp INNER JOIN (SELECT idPratica, MAX(timePoint) AS MaxDateTime FROM StatoPratiche GROUP BY idPratica) groupedtt ON sp.idPratica = groupedtt.idPratica AND sp.timePoint = groupedtt.MaxDateTime LEFT JOIN (SELECT sp.idPratica, sp.timePoint as timePointInCarico, Utenti.id as userid, Utenti.username FROM StatoPratiche sp INNER JOIN (SELECT idPratica, MAX(timePoint) AS MaxDateTime FROM StatoPratiche WHERE StatoPratiche.idStato=2 GROUP BY idPratica) groupedtt ON sp.idPratica = groupedtt.idPratica AND sp.timePoint = groupedtt.MaxDateTime INNER JOIN AssStatoPraticheUtenti aspu on sp.id = aspu.idStato INNER JOIN Utenti on aspu.idUtente = Utenti.id) sq on sp.idPratica = sq.idPratica) Q on P.id = Q.idPratica INNER JOIN ConstStatoPratiche csp on idStato=csp.id INNER JOIN Comuni on idComune = Comuni.id INNER JOIN Gestori on idGestore = Gestori.id INNER JOIN ConstTipoPratiche ctp on tipopratica = ctp.id LEFT JOIN (SELECT idPratica, SUM(DATEDIFF(dateIN, dateOUT)) as diff FROM StatoPratiche LEFT JOIN AssStatoPraticheIntegrazioni on StatoPratiche.id=AssStatoPraticheIntegrazioni.idStato LEFT JOIN Integrazioni on AssStatoPraticheIntegrazioni.idInteg = Integrazioni.id WHERE ostativi=0 OR ostativi IS NULL GROUP BY idPratica) dt on P.id=dt.idPratica LEFT JOIN (select idPratica, MAX(dateOUT) as dateCommOst from Integrazioni LEFT JOIN AssStatoPraticheIntegrazioni on Integrazioni.id=AssStatoPraticheIntegrazioni.idInteg LEFT JOIN StatoPratiche on AssStatoPraticheIntegrazioni.idStato=StatoPratiche.id WHERE ostativi=1 GROUP BY idPratica) tmo on P.id=tmo.idPratica";


/* GET /pratiche in corso listing. */
router.get('/', function(req, res, next) {
	var query = daBigQuery+" WHERE final=0 OR FINAL IS NULL";

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
	var query = daBigQuery;

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
	var query = daBigQuery + " WHERE idStato = 4 OR idStato = 5";

	sql.query(query, function(err, data) {
		if (err) rest.error500(res, err);
		else res.json(data);
	});
});

/* GET /pratiche/protocollare in uscita ma senza protocollo listing. */
router.get('/protocollare', function(req, res, next) {
	var query = daBigQuery + " WHERE idStato = 6";

	sql.query(query, function(err, data) {
		if (err) rest.error500(res, err);
		else res.json(data);
	});
});

router.get('/:id', function(req, res, next) {
	var query = sql.format(daBigQuery+" WHERE P.id=?", [req.params.id]);

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
