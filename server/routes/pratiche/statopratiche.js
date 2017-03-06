var rest = require('../../helpers/rest.js');
var sql = require('../../helpers/db.js');
var tableNameCurrent = 'StatoPratiche';

var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
	sql.query('SELECT * FROM StatoPratiche', function(err, data) {
		if (err) rest.error500(res, err);
		else res.json(data);
	});
});

router.get('/stati', function(req, res, next) {
	sql.query('SELECT * FROM ConstStatoPratiche', function(err, data) {
		if (err) rest.error500(res, err);
		else res.json(data);
	});
});

router.get('/tipi', function(req, res, next) {
	sql.query('SELECT * FROM ConstTipoPratiche', function(err, data) {
		if (err) rest.error500(res, err);
		else res.json(data);
	});
});

router.get('/history/:id', function(req, res, next) {
	var query = sql.format('SELECT StatoPratiche.*, ConstStatoPratiche.descrizione as descStato, A.username as usernameAss, B.username as usernameMod, Integrazioni.id as integID, Integrazioni.dateOUT, Integrazioni.dateIN, Integrazioni.protoOUT, Integrazioni.protoIN, Integrazioni.note as noteInteg FROM StatoPratiche LEFT JOIN ConstStatoPratiche on StatoPratiche.idStato=ConstStatoPratiche.id LEFT JOIN AssStatoPraticheUtenti on StatoPratiche.id = AssStatoPraticheUtenti.idStato LEFT JOIN Utenti AS A on idUtente=A.id LEFT JOIN Utenti AS B on idUtenteModifica=B.id LEFT JOIN AssStatoPraticheIntegrazioni ON StatoPratiche.id = AssStatoPraticheIntegrazioni.idStato LEFT JOIN Integrazioni ON AssStatoPraticheIntegrazioni.idInteg = Integrazioni.id WHERE idPratica=?', [req.params.id]);

	sql.query(query, function(err, data) {
		if (err) rest.error500(res, err);
		else res.json(data);
	});
});

router.get('/:id', function(req, res, next) {
	var query = sql.format('SELECT * FROM StatoPratiche WHERE id=?', [req.params.id]);

	sql.query(query, function(err, data) {
		if (err) rest.error500(res, err);
		else res.json(data.length == 1 ? data[0] : []);
	});
});

router.post('/', function(req, res, next) {
	var userid = req.user.id;

    sql.connect(function (err, connection) {
		connection.query('START TRANSACTION;', function(err, data) {
			if (err) rest.error500(res, err);
			else {
				var query =  sql.format("INSERT INTO StatoPratiche(idPratica,idStato,idUtenteModifica) VALUES (?,?,?)", [ req.body.idPratica, req.body.idStato, userid ]);

				connection.query(query, function(err, data) {
					if (err) rest.error500(res, err);
					else {
						if (req.body.idStato == 7 || req.body.idStato == 13) {	// richiedi integrazioni / comunicaz. motivi ostativi
							var ostativi = req.body.idStato == 7 ? 0 : 1;
						
							connection.query("SELECT LAST_INSERT_ID() AS id", function(err, laststatoid) {
								if (err) rest.error500(res, err);
								else {
									var query3 = sql.format("INSERT INTO Integrazioni(dateOUT, dateIN, protoOUT, protoIN, ostativi, note) VALUES (?,NULL,?,NULL,?,?)", [ req.body.integData, req.body.integProto, ostativi, req.body.integNote]);

									connection.query(query3, function(err, data) {
										if (err) rest.error500(res, err);
										else
											connection.query("SELECT LAST_INSERT_ID() AS id", function(err, lastintegid) {
												if (err) rest.error500(res, err);
												else {
													var query4 = sql.format("INSERT INTO AssStatoPraticheIntegrazioni(idStato,idInteg) VALUES (?,?)", [ laststatoid[0].id, lastintegid[0].id ]);

													connection.query(query4, function(err, data) {
														if (err) rest.error500(res, err);
														else
															connection.query('COMMIT;', function(err, data) {
																if (err) rest.error500(res, err);
																else rest.created(res, data);
															});
													});
												}
										});
									});//Integrazioni(idPratica, dateOUT, dateIN, protoOUT, protoIN, note)
								}
							});
						}
						else if (req.body.idStato == 2 && req.body.integData) {	// lavorazione (arrivate integrazioni)

							connection.query("SELECT LAST_INSERT_ID() AS id", function(err, laststatoid) {
								if (err) rest.error500(res, err);
								else {
									var querygetlastidinteg = sql.format("SELECT idInteg as id FROM (SELECT MAX(id) as id FROM StatoPratiche WHERE idPratica=? AND (idStato=7 OR idStato=13) GROUP BY idPratica) as T1 LEFT JOIN AssStatoPraticheIntegrazioni on T1.id = AssStatoPraticheIntegrazioni.idStato", [ req.body.idPratica ]);	// 1.get id last integ -> lastintegid

									connection.query(querygetlastidinteg, function(err, lastintegid) {
										if (err) rest.error500(res, err);
										else {

											var query3 = sql.format("UPDATE Integrazioni SET dateIN=?, protoIN=? WHERE id=?", [ req.body.integData, req.body.integProto, lastintegid[0].id ]);	// 2.update that integ

											connection.query(query3, function(err, data) {
												if (err) rest.error500(res, err);
												else {
													var query4 = sql.format("INSERT INTO AssStatoPraticheIntegrazioni(idStato,idInteg) VALUES (?,?)", [ laststatoid[0].id, lastintegid[0].id ]);	// 3.add AssStatoPraticheIntegrazioni(laststatoid, lastintegid)

													connection.query(query4, function(err, data) {
														if (err) rest.error500(res, err);
														else
															connection.query('COMMIT;', function(err, data) {
																if (err) rest.error500(res, err);
																else rest.created(res, data);
															});
													});
												}
											});
										}
									});
								}
							});
						}
						else if (req.body.idStato == 2) {	// lavorazione
							connection.query("SELECT LAST_INSERT_ID() AS id", function(err, lastid) {
								if (err) rest.error500(res, err);
								else {
									var query3 = sql.format("INSERT INTO AssStatoPraticheUtenti(idStato,idUtente) VALUES (?,?)", [ lastid[0].id, req.body.idUtente]);

									connection.query(query3, function(err, data) {
										if (err) rest.error500(res, err);
										else {
											connection.query('COMMIT;', function(err, data) {
												if (err) rest.error500(res, err);
												else rest.created(res, data);
											});
										}
									});
								}
							});
						}
						else {
							connection.query('COMMIT;', function(err, data) {
								if (err) rest.error500(res, err);
								else rest.created(res, data);
							});
						}
					}
				});
			}
		});
    });
});

module.exports = router;