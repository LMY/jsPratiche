var rest = require('../../helpers/rest.js');
var sql = require('../../helpers/db.js');

var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
	sql.pool.query('SELECT * FROM '+sql.tables.Pratiche, function(err, data) {
		if (err) rest.error500(res, err);
		else res.json(data.rows);
	});
});

router.get('/stati', function(req, res, next) {
	sql.pool.query('SELECT * FROM '+sql.tables.ConstStatoPratiche, function(err, data) {
		if (err) rest.error500(res, err);
		else res.json(data.rows);
	});
});

router.get('/tipi', function(req, res, next) {
	sql.pool.query('SELECT * FROM '+sql.tables.ConstStatoPratiche, function(err, data) {
		if (err) rest.error500(res, err);
		else res.json(data.rows);
	});
});

router.get('/history/:id', function(req, res, next) {
	sql.pool.query('SELECT '+sql.tables.Pratiche+'.*, '+sql.tables.ConstStatoPratiche+'.descrizione as descStato, A.username as usernameAss, B.username as usernameMod, '+
	sql.tables.Integrazioni+'.id as integID, '+
	sql.tables.Integrazioni+'.dateOUT, '+sql.tables.Integrazioni+'.dateIN, '+sql.tables.Integrazioni+'.protoOUT, '+sql.tables.Integrazioni+'.protoIN, '+sql.tables.Integrazioni+'.note as noteInteg FROM '+
	''+sql.tables.Pratiche+' LEFT JOIN '+sql.tables.ConstStatoPratiche+' on '+sql.tables.Pratiche+'.idStato='+sql.tables.ConstStatoPratiche+'.id LEFT JOIN '+
	''+sql.tables.AssStatoPraticheUtenti+' on '+sql.tables.Pratiche+'.id = '+sql.tables.AssStatoPraticheUtenti+'.idStato LEFT JOIN '+
	sql.tables.Utenti+' AS A on idUtente=A.id LEFT JOIN '+sql.tables.Utenti+' AS B on idUtenteModifica=B.id '+
	'LEFT JOIN '+sql.tables.AssStatoPraticheIntegrazioni+' ON '+sql.tables.Pratiche+'.id = '+sql.tables.AssStatoPraticheIntegrazioni+'.idStato LEFT JOIN '+
	sql.tables.Integrazioni+' ON AssStatoPraticheIntegrazioni.idInteg = '+sql.tables.Integrazioni+'.id WHERE idPratica=$1', [req.params.id], function(err, data) {
		if (err) rest.error500(res, err);
		else res.json(data.rows);
	});
});

router.get('/:id', function(req, res, next) {
	sql.pool.query('SELECT * FROM '+sql.tables.Pratiche+' WHERE id=$1', [req.params.id], function(err, data) {
		if (err) rest.error500(res, err);
		else res.json(data.rows.length == 1 ? data.rows[0] : []);
	});
});

router.post('/', function(req, res, next) {
	var userid = req.user.id;

    sql.connect(function (err, connection) {
		connection.query('START TRANSACTION;', function(err, data) {
			if (err) rest.error500(res, err);
			else {
				connection.query('INSERT INTO StatoPratiche(idPratica,idStato,idUtenteModifica) VALUES (?,?,?)', [ req.body.idPratica, req.body.idStato, userid ], function(err, data) {
					if (err) rest.error500(res, err);
					else {
						if (req.body.idStato == 7 || req.body.idStato == 13) {	// richiedi integrazioni / comunicaz. motivi ostativi
							var ostativi = req.body.idStato == 7 ? 0 : 1;
						
							connection.query("SELECT LAST_INSERT_ID() AS id", function(err, laststatoid) {
								if (err) rest.error500(res, err);
								else {
									var query3 = sql.format('INSERT INTO '+sql.tables.Integrazioni+'(dateOUT, dateIN, protoOUT, protoIN, ostativi, note) VALUES (?,NULL,?,NULL,?,?)', [ req.body.integData, req.body.integProto, ostativi, req.body.integNote]);

									connection.query(query3, function(err, data) {
										if (err) rest.error500(res, err);
										else
											connection.query("SELECT LAST_INSERT_ID() AS id", function(err, lastintegid) {
												if (err) rest.error500(res, err);
												else {
													var query4 = sql.format('INSERT INTO AssStatoPraticheIntegrazioni(idStato,idInteg) VALUES (?,?)', [ laststatoid[0].id, lastintegid[0].id ]);

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

											var query3 = sql.format('UPDATE Integrazioni SET dateIN=?, protoIN=? WHERE id=?', [ req.body.integData, req.body.integProto, lastintegid[0].id ]);	// 2.update that integ

											connection.query(query3, function(err, data) {
												if (err) rest.error500(res, err);
												else {
													var query4 = sql.format('INSERT INTO AssStatoPraticheIntegrazioni(idStato,idInteg) VALUES (?,?)', [ laststatoid[0].id, lastintegid[0].id ]);	// 3.add AssStatoPraticheIntegrazioni(laststatoid, lastintegid)

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
						else if (req.body.idStato == 2 || req.body.idStato == 5) {	// lavorazione or "in correzione"
							connection.query("SELECT LAST_INSERT_ID() AS id", function(err, lastid) {
								if (err) rest.error500(res, err);
								else {
									var query3 = sql.format('INSERT INTO '+sql.tables.AssStatoPraticheUtenti+'(idStato,idUtente) VALUES (?,?)', [ lastid[0].id, req.body.idUtente]);

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