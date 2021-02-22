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

	sql.pool.query('SELECT '+sql.tables.StatoPratiche+'.*, '+sql.tables.ConstStatoPratiche+'.descrizione as "descStato", A.username as "usernameAss", B.username as usernameMod, '+
				sql.tables.Integrazioni+'.id as "integID", '+ sql.tables.Integrazioni+'."dateOUT", '+sql.tables.Integrazioni+'."dateIN", '+sql.tables.Integrazioni+'."protoOUT", '+sql.tables.Integrazioni+'."protoIN", '+sql.tables.Integrazioni+'.note as "noteInteg" FROM '+
				sql.tables.StatoPratiche+' LEFT JOIN '+sql.tables.ConstStatoPratiche+' on '+sql.tables.StatoPratiche+'."idStato"='+sql.tables.ConstStatoPratiche+'.id LEFT JOIN '+
				sql.tables.AssStatoPraticheUtenti+' on '+sql.tables.StatoPratiche+'.id = '+sql.tables.AssStatoPraticheUtenti+'."idStato" LEFT JOIN '+
				sql.tables.Utenti+' AS A on "idUtente"=A.id LEFT JOIN '+sql.tables.Utenti+' AS B on "idUtenteModifica"=B.id '+
				'LEFT JOIN '+sql.tables.AssStatoPraticheIntegrazioni+' ON '+sql.tables.StatoPratiche+'.id = '+sql.tables.AssStatoPraticheIntegrazioni+'."idStato" LEFT JOIN '+
				sql.tables.Integrazioni+' ON '+sql.tables.AssStatoPraticheIntegrazioni+'."idInteg" = '+sql.tables.Integrazioni+'.id WHERE "idPratica"=$1', [req.params.id], function(err, data) {
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

	sql.pool.query('INSERT INTO '+sql.tables.StatoPratiche+'("idPratica","idStato","idUtenteModifica") VALUES ($1,$2,$3) RETURNING ID', [ req.body.idPratica, req.body.idStato, userid ], function(err, data) {
		if (err) rest.error500(res, err);
		else {
			var laststatoid = data.rows[0].id;

			// richiedi integrazioni / comunicaz. motivi ostativi
			if (req.body.idStato == 7 || req.body.idStato == 13)
			{
				var ostativi = req.body.idStato == 7 ? 0 : 1;
			
				sql.pool.query('INSERT INTO '+sql.tables.Integrazioni+'("dateOUT", "dateIN", "protoOUT", "protoIN", "ostativi", "note") VALUES ($1,NULL,$2,NULL,$3,$4) RETURNING ID', [ req.body.integData, req.body.integProto, ostativi, req.body.integNote], function(err, data2) {
					if (err) rest.error500(res, err);
					else {
						var lastintegid = data2.rows[0].id;

						sql.pool.query('INSERT INTO '+sql.tables.AssStatoPraticheIntegrazioni+'("idStato","idInteg") VALUES ($1,$2)', [ laststatoid, lastintegid ], function(err, data3) {
							if (err) rest.error500(res, err);
							else rest.created(res, data3.rows);
						});
					}
				});
			}
			// lavorazione (arrivate integrazioni)
			else if (req.body.idStato == 2 && req.body.integData)
			{
				// 1.get id last integ -> lastintegid
				sql.pool.query('SELECT "idInteg" as id FROM (SELECT MAX(id) as id FROM ' + sql.tables.StatoPratiche +' WHERE "idPratica"=$1 AND ("idStato"=7 OR "idStato"=13) GROUP BY "idPratica") as T1 LEFT JOIN ' + sql.tables.AssStatoPraticheIntegrazioni +' on T1.id = ' + sql.tables.AssStatoPraticheIntegrazioni +'."idStato"', [ req.body.idPratica ], function(err, data2) {
					if (err) rest.error500(res, err);
					else {
						var lastintegid = data2.rows[0].id;

						// 2.update that integ
						sql.pool.query('UPDATE ' + sql.tables.Integrazioni +' SET "dateIN"=$1, "protoIN"=$2 WHERE id=$3', [ req.body.integData, req.body.integProto, lastintegid ], function(err, data3) {
							if (err) rest.error500(res, err);
							else {
								// 3.add AssStatoPraticheIntegrazioni(laststatoid, lastintegid)								
								sql.pool.query('INSERT INTO ' + sql.tables.AssStatoPraticheIntegrazioni +'("idStato","idInteg") VALUES ($1,$2)', [ laststatoid, lastintegid ], function(err, data) {
									if (err) rest.error500(res, err);
									else rest.created(res, data);
								});								
							}
						});						
					}
				});
			}
			// lavorazione or "in correzione"
			else if (req.body.idStato == 2 || req.body.idStato == 5)
			{
				sql.pool.query('INSERT INTO '+sql.tables.AssStatoPraticheUtenti+'("idStato","idUtente") VALUES ($1,$2)', [ laststatoid, req.body.idUtente], function(err, data) {
					if (err) rest.error500(res, err);
					else rest.created(res, data);
				});
			}
		}
	});
});

module.exports = router;