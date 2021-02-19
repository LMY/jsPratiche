var rest = require('../../helpers/rest.js');
var sql = require('../../helpers/db.js');

var express = require('express');
var router = express.Router();

router.get('/latest', function(req, res, next) {
	sql.pool.query('SELECT '+sql.tables.Catene+'.*, T2."idCatena", T2."idUtente", T2."timePointFrom", T2."timePointTo", T2.username, T2.sede, T2.catena ' +
		' FROM '+sql.tables.Catene+' LEFT JOIN ('+
		' SELECT '+sql.tables.RegistroStrumenti+'.*, '+sql.tables.Utenti+'.username, '+sql.tables.Sedi+'.nome as sede, '+sql.tables.Catene+'.name as catena'+
		' FROM '+sql.tables.RegistroStrumenti+' LEFT JOIN '+sql.tables.Utenti+' ON '+sql.tables.RegistroStrumenti+'."idUtente" = '+sql.tables.Utenti+'.id'+
		' LEFT JOIN '+sql.tables.Sedi+' on '+sql.tables.RegistroStrumenti+'."idSedeTo" = '+sql.tables.Sedi+'.id'+
		' LEFT JOIN '+sql.tables.Catene+' on '+sql.tables.RegistroStrumenti+'."idCatena" = '+sql.tables.Catene+'.id '+
		' WHERE '+sql.tables.RegistroStrumenti+'.id IN (SELECT MAX(id) FROM '+sql.tables.RegistroStrumenti+' GROUP BY "idCatena")) as T2'+
		' ON '+sql.tables.Catene+'.id = T2."idCatena"', function(err, data) {
		if (err) rest.error500(res, err);
		else res.json(data.rows);
	});
});

router.put('/latest/:id', function(req, res, next) {

	if (req.body.verb == 'open') {
		sql.pool.query('INSERT INTO '+tableName+'("idCatena", "idUtente", "timePointFrom") VALUES ($1,$2,$3)', [req.params.id, req.body.idUtente, req.body.timePointFrom ], function(err, data) {
			if (err) rest.error500(res, err);
			else res.json(data.rows);
		});
	}
	else if (req.body.verb == 'close') {
		sql.pool.query('SELECT MAX(id) as id FROM '+tableName+' WHERE "idCatena" = $1', [req.params.id], function(err, data) {
			if (err) rest.error500(res, err);
			else
				sql.pool.query('UPDATE '+tableName+' SET timePointFrom = timePointFrom, "timePointTo" = $1, "idSedeTo" = $2  WHERE id=$3',
				[req.body.timePointTo, req.body.idSedeTo, data[0].id], function(err, data2) {
					if (err) rest.error500(res, err);
					else res.json(data2.rows);
				});			
		});
	}
	else {
		rest.error500(res, 'no verb specified');
		return;
	}
});

router.get('/', function(req, res, next) {
  sql.pool.query(
	  	'SELECT '+tableName+'.*, '+sql.tables.Utenti+'.username, '+sql.tables.Sedi+'.nome as sede, ' + sql.tables.Catene +'.name as catena' +
	  	' FROM '+tableName+' LEFT JOIN '+sql.tables.Utenti+' ON '+tableName+'."idUtente" = '+sql.tables.Utenti+'.id LEFT' +
		' JOIN '+sql.tables.Sedi+' on '+tableName+'.idSedeTo = '+sql.tables.Sedi+'.id LEFT JOIN ' +sql.tables.Catene +
		' ON  '+tableName+'."idCatena" = ' + sql.tables.Catene + '.id',
      function(err, data) {
        if (err)
          rest.error500(res, err);
        else
          res.json(data.rows);
      });
});

module.exports = router;