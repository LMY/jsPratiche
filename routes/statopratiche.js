var rest = require('../helpers/rest.js');
var mysql = require('mysql');
var sql = require('../helpers/db.js');
var tableNameCurrent = 'StatoPratiche';

var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
    sql(function(err,connection) {
        connection.query('SELECT * FROM StatoPratiche', function(err, data) {
            if (err) rest.error500(res, err);
			else res.json(data);
		});
    });
});

router.get('/stati', function(req, res, next) {
    sql(function(err,connection) {
        connection.query('SELECT * FROM ConstStatoPratiche', function(err, data) {
            if (err) rest.error500(res, err);
			else res.json(data);
		});
    });
});

router.get('/tipi', function(req, res, next) {
    sql(function(err,connection) {
        connection.query('SELECT * FROM ConstTipoPratiche', function(err, data) {
            if (err) rest.error500(res, err);
			else res.json(data);
		});
    });
});

router.get('/history/:id', function(req, res, next) {
    sql(function(err,connection) {
		var query = mysql.format('SELECT StatoPratiche.*, ConstStatoPratiche.descrizione as descStato, A.username as usernameAss, B.username as usernameMod FROM StatoPratiche LEFT JOIN ConstStatoPratiche on StatoPratiche.idStato=ConstStatoPratiche.id LEFT JOIN AssStatoPraticheUtenti on StatoPratiche.id = AssStatoPraticheUtenti.idStato LEFT JOIN Utenti AS A on idUtente=A.id LEFT JOIN Utenti AS B on idUtenteModifica=B.id WHERE idPratica=?', [req.params.id]);

        connection.query(query, function(err, data) {
            if (err) rest.error500(res, err);
			else res.json(data);
		});
    });
});

router.get('/:id', function(req, res, next) {
    sql(function(err,connection) {
		var query = mysql.format('SELECT * FROM StatoPratiche WHERE id=?', [req.params.id]);

        connection.query(query, function(err, data) {
            if (err) rest.error500(res, err);
			else res.json(data.length == 1 ? data[0] : []);
		});
    });
});

// todo
router.post('/', function(req, res, next) {
	var userid = req.user.id;

    sql(function (err, connection) {
		connection.query('START TRANSACTION;', function(err, data) {
			if (err) rest.error500(res, err);
			else {
				if (!req.body.dataOUT) {
					rest.error500(res, "dataOUT not specified");
					return;
				}

				var query =  mysql.format("INSERT INTO ??(idPratica,idUtente,idStato,idUtenteModifica) VALUES (?,?,?,?)", [tableNameHistory, req.body.idPratica, req.body.idUtente, req.body.idStato, userid ]);
console.log(query);
				connection.query(query, function(err, data) {
					if (err) rest.error500(res, err);
					else {
						if (req.body.idStato == 7) {	// richiedi integrazioni
							var query3 = mysql.format("INSERT INTO Integrazioni(idPratica, dateOUT, dateIN, protoOUT, protoIN, note) VALUES (?,?,NULL,?,NULL,?)", [ req.body.idPratica, req.body.integData, req.body.integProto, req.body.integNote]);
console.log(query3);
							connection.query(query3, function(err, data) {
								if (err) rest.error500(res, err);
								else {
									connection.query('COMMIT;', function(err, data) {
										if (err) rest.error500(res, err);
										else rest.created(res, data);
									});
								}
							});//Integrazioni(idPratica, dateOUT, dateIN, protoOUT, protoIN, note)
						}
						else if (req.body.idStato == 2 && req.body.integData) {	// lavorazione (arrivate integrazioni)
							var query3 = mysql.format("UPDATE Integrazioni SET dateIN=?,protoIN=? WHERE idPratica=? AND dateOUT=?", [ req.body.integData, req.body.integProto, req.body.idPratica, req.body.dataOUT]);

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