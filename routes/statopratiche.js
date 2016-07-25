var rest = require('../helpers/rest.js');
var mysql = require('mysql');
var sql = require('../helpers/db.js');
var tableNameHistory = 'StoricoStatoPratiche';
var tableNameCurrent = 'StatoPratiche';

var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
    sql(function(err,connection) {
        connection.query('SELECT * FROM StoricoStatoPratiche', function(err, data) {
            if (err) rest.error500(err);
			else res.json(data);
		});
    });
});

router.get('/stati', function(req, res, next) {
    sql(function(err,connection) {
        connection.query('SELECT * FROM ConstStatoPratiche', function(err, data) {
            if (err) rest.error500(err);
			else res.json(data);
		});
    });
});

router.get('/tipi', function(req, res, next) {
    sql(function(err,connection) {
        connection.query('SELECT * FROM ConstTipoPratiche', function(err, data) {
            if (err) rest.error500(err);
			else res.json(data);
		});
    });
});

router.get('/history/:id', function(req, res, next) {
    sql(function(err,connection) {
		//idPratica, idUtente, idStato, idUtenteModifica, timePoint)
		var query = mysql.format('SELECT A.*, Utenti.username as usernameMod FROM (SELECT StoricoStatoPratiche.id, StoricoStatoPratiche.idPratica, StoricoStatoPratiche.idUtente, StoricoStatoPratiche.idStato, StoricoStatoPratiche.idUtenteModifica, StoricoStatoPratiche.timePoint, Utenti.username as usernameAss, ConstStatoPratiche.descrizione as descStato FROM StoricoStatoPratiche LEFT JOIN Utenti on (StoricoStatoPratiche.idUtente = Utenti.id) LEFT JOIN ConstStatoPratiche on (StoricoStatoPratiche.idStato = ConstStatoPratiche.id) WHERE StoricoStatoPratiche.idPratica=? ORDER BY StoricoStatoPratiche.id DESC) AS A LEFT JOIN Utenti on (A.idUtenteModifica = Utenti.id)', [req.params.id]);
				
        connection.query(query, function(err, data) {
            if (err) rest.error500(err);
			else res.json(data);
		});
    });
});

router.get('/current/:id', function(req, res, next) {
    sql(function(err,connection) {
		var query = mysql.format('SELECT A.*, Utenti.username as usernameMod FROM (SELECT StoricoStatoPratiche.id, StoricoStatoPratiche.idPratica, StoricoStatoPratiche.idUtente, StoricoStatoPratiche.idStato, StoricoStatoPratiche.idUtenteModifica, StoricoStatoPratiche.timePoint, Utenti.username as usernameAss, ConstStatoPratiche.descrizione as descStato FROM StoricoStatoPratiche LEFT JOIN Utenti on (StoricoStatoPratiche.idUtente = Utenti.id) LEFT JOIN ConstStatoPratiche on (StoricoStatoPratiche.idStato = ConstStatoPratiche.id) WHERE StoricoStatoPratiche.idPratica=? ORDER BY StoricoStatoPratiche.id DESC) AS A LEFT JOIN Utenti on (A.idUtenteModifica = Utenti.id)', [req.params.id]);
				
        connection.query(query, function(err, data) {
            if (err) rest.error500(err);
			else res.json(data);
		});
    });
});

router.get('/:id', function(req, res, next) {
    sql(function(err,connection) {
		var query = mysql.format('SELECT * FROM StoricoStatoPratiche WHERE id=?', [req.params.id]);
		
        connection.query(query, function(err, data) {
            if (err) rest.error500(err);
			else res.json(data.length == 1 ? data[0] : []);
		});
    });
});

router.post('/', function(req, res, next) {
	var userid = req.user.id;
		
    sql(function (err, connection) {
		connection.query('START TRANSACTION;', function(err, data) {
			if (err) rest.error500(err);
			else {
				var query =  mysql.format("INSERT INTO ??(idPratica,idUtente,idStato,idUtenteModifica) VALUES (?,?,?,?)", [tableNameHistory, req.body.idPratica, req.body.idUtente, req.body.idStato, userid ]);
				
				console.log(query);
			
				connection.query(query, function(err, data) {
					if (err)			
						throw err;

					// if OK, update Current table
					var query2 = mysql.format("INSERT INTO ??(idPratica,idUtente,idStato,idUtenteModifica) VALUES (?,?,?,?) ON DUPLICATE KEY UPDATE idUtente=?, idStato=?", [tableNameCurrent, req.body.idPratica, req.body.idUtente, req.body.idStato, userid, req.body.idUtente, req.body.idStato ]);
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

/*
router.delete('/:id', function(req, res, next) {
    sql(function (err, connection) {
        connection.query('DELETE FROM '+tableNameHistory+' WHERE id = '+req.params.id, function(err, data) {
            if (err) throw err;
			res.json(data);
        });
    });
});*/
/*
router.put('/:id', function(req, res, next) {
    sql(function (err, connection) {
		var query = mysql.format("UPDATE ?? SET ?? = ?, ?? = ?, ?? = ?, ?? = ? WHERE ?? = ? AND ?? = ?", [tableNameHistory, "dateIN", req.body.dateIN, "protoOUT", req.body.protoOUT, "protoIN", req.body.protoIN, "note", req.body.note, "idPratica", req.params.id, "dateOUT", req.body.dateout ];
	
        connection.query(query, function(err, data) {
            if (err) rest.error500(err);
            else rest.updated(res, data);
        });
    });
});*/

module.exports = router;