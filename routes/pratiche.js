var rest = require('../helpers/rest.js');
var mysql = require('mysql');
var sql = require('../helpers/db.js');
var tableName = 'Pratiche';

var express = require('express');
var router = express.Router();

/* GET /pratiche listing. */
router.get('/', function(req, res, next) {
    sql(function(err,connection) {
		var query = "select Pratiche.id, Pratiche.idGestore, Pratiche.idComune, Pratiche.address, Pratiche.sitecode, Pratiche.tipopratica, Pratiche.protoIN, Pratiche.dataIN, Pratiche.protoOUT, Pratiche.dataOUT, Pratiche.note, Gestori.name as nameGestore, Comuni.name as nameComune, ConstTipoPratiche.descrizione as nameTipo, B.idUtente, B.idStato, B.timePoint, B.stringStato FROM Pratiche LEFT JOIN Gestori on (Pratiche.idGestore = Gestori.id) LEFT JOIN Comuni on (Pratiche.idComune = Comuni.id) LEFT JOIN ConstTipoPratiche on (Pratiche.tipopratica = ConstTipoPratiche.id) LEFT JOIN (select StatoPratiche.idPratica, StatoPratiche.idUtente, StatoPratiche.idStato, StatoPratiche.timePoint, ConstStatoPratiche.descrizione as stringStato FROM StatoPratiche LEFT JOIN ConstStatoPratiche on (StatoPratiche.idStato = ConstStatoPratiche.id)) AS B on (Pratiche.id = B.idPratica) ORDER BY Pratiche.ID;";
		
		connection.query(query, function(err, data) {
            if (err) rest.error500(res, err);
			else res.json(data);
        });
    });
});

/* GET /pratiche/id */
router.get('/:id', function(req, res, next) {
    sql(function(err, connection) {
		var query = mysql.format("select Pratiche.id, Pratiche.idGestore, Pratiche.idComune, Pratiche.address, Pratiche.sitecode, Pratiche.tipopratica, Pratiche.protoIN, Pratiche.dataIN, Pratiche.protoOUT, Pratiche.dataOUT, Pratiche.note, Gestori.name as nameGestore, Comuni.name as nameComune, ConstTipoPratiche.descrizione as nameTipo, B.idUtente, B.idStato, B.timePoint, B.stringStato FROM Pratiche LEFT JOIN Gestori on (Pratiche.idGestore = Gestori.id) LEFT JOIN Comuni on (Pratiche.idComune = Comuni.id) LEFT JOIN ConstTipoPratiche on (Pratiche.tipopratica = ConstTipoPratiche.id) LEFT JOIN (select StatoPratiche.idPratica, StatoPratiche.idUtente, StatoPratiche.idStato, StatoPratiche.timePoint, ConstStatoPratiche.descrizione as stringStato FROM StatoPratiche LEFT JOIN ConstStatoPratiche on (StatoPratiche.idStato = ConstStatoPratiche.id)) AS B on (Pratiche.id = B.idPratica) WHERE Pratiche.id=?", [req.params.id]);
		
		connection.query(query, function(err, data) {
            if (err) rest.error500(res, err);
			else res.json(data.length == 1 ? data[0] : []);
        });
    });
});

/* POST /pratiche */
router.post('/', function(req, res, next) {

	var userid = req.user.id;

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
											
								connection.query(mysql.format("INSERT INTO StatoPratiche(idPratica,idUtenteModifica,idStato) VALUES (?,?,?)", [lastid, userid, 1]), function(err, datares2) {				
									if (err) rest.error500(res, err);
									else 							
										connection.query(mysql.format("INSERT INTO StoricoStatoPratiche(idPratica,idUtenteModifica,idStato) VALUES (?,?,?)", [lastid, userid, 1]), function(err, datares3) {
											if (err) rest.error500(res, err);
											else {
												connection.query('COMMIT;', function(err, data) {
													if (err) rest.error500(res, err);
													rest.created(res, datares3[0]);
												});
											}
										});
									});
							}
						});
				});
			}
		});
    });
});

/* PUT /pratiche/:id */
router.put('/:id', function(req, res, next) {
    sql(function (err, connection) {
        var query = mysql.format('UPDATE ?? SET idGestore = ?, idComune = ?, address = ?, sitecode = ?, tipopratica = ?, protoIN = ?, dataIN = ?, protoOUT = ?, dataOUT = ?, note = ? WHERE id = ?', [tableName, req.body.idGestore, req.body.idComune, req.body.address, req.body.sitecode, req.body.tipopratica, req.body.protoIN, req.body.dataIN, req.body.protoOUT, req.body.dataOUT, req.body.note, req.params.id]);

        connection.query(query, function(err, data) {
            if (err) rest.error500(res, err);
            else rest.updated(res, data);
        });
    });
});

/* DELETE /pratiche/:id */
router.delete('/:id', function(req, res, next) {
	
	var userid = req.user.id;
		
    sql(function (err, connection) {
		connection.query('START TRANSACTION;', function(err, data) {
			if (err) rest.error500(err);
			else {
				var query =  mysql.format("INSERT INTO StoricoStatoPratiche(idPratica,idUtente,idStato,idUtenteModifica) VALUES (?,?,?,?)", [req.params.id, userid, 10, userid ]);
				
				console.log(query);
			
				connection.query(query, function(err, data) {
					if (err)			
						throw err;

					// if OK, update Current table
					var query2 = mysql.format("INSERT INTO StatoPratiche(idPratica,idUtente,idStato,idUtenteModifica) VALUES (?,?,?,?) ON DUPLICATE KEY UPDATE idUtente=?, idStato=?", [req.params.id, userid, 10, userid, userid, 10 ]);
					console.log(query2);
				
					connection.query(query2, function(err, data) {			
						if (err) rest.error500(err);
						else
							connection.query('COMMIT;', function(err, data) {
								if (err) rest.error500(err);
								else rest.created(res, data);
							});
					});
				});
			}
		});
    });	
});

module.exports = router;
