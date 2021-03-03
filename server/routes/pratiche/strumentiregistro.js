var rest = require('../../helpers/rest.js');
var sql = require('../../helpers/db.js');

var express = require('express');
var router = express.Router();

router.get('/latest', (req, res, next) => {
	sql.pool.query('SELECT '+sql.tables.Catene+'.*, T2."idCatena", T2."idUtente", T2."timePointFrom", T2."timePointTo", T2.username, T2.sede, T2.catena ' +
		' FROM '+sql.tables.Catene+' LEFT JOIN ('+
		' SELECT '+sql.tables.RegistroStrumenti+'.*, '+sql.tables.Utenti+'.username, '+sql.tables.Sedi+'.nome as sede, '+sql.tables.Catene+'.name as catena'+
		' FROM '+sql.tables.RegistroStrumenti+' LEFT JOIN '+sql.tables.Utenti+' ON '+sql.tables.RegistroStrumenti+'."idUtente" = '+sql.tables.Utenti+'.id'+
		' LEFT JOIN '+sql.tables.Sedi+' on '+sql.tables.RegistroStrumenti+'."idSedeTo" = '+sql.tables.Sedi+'.id'+
		' LEFT JOIN '+sql.tables.Catene+' on '+sql.tables.RegistroStrumenti+'."idCatena" = '+sql.tables.Catene+'.id '+
		' WHERE '+sql.tables.RegistroStrumenti+'.id IN (SELECT MAX(id) FROM '+sql.tables.RegistroStrumenti+' GROUP BY "idCatena")) as T2'+
		' ON '+sql.tables.Catene+'.id = T2."idCatena"')
	.then(data => res.json(data.rows))
	.catch(err => rest.error500(res, err));
});

router.put('/latest/:id', (req, res, next) => {

	if (req.body.verb == 'open') {
		sql.pool.query('INSERT INTO '+sql.tables.RegistroStrumenti+'("idCatena", "idUtente", "timePointFrom") VALUES ($1,$2,$3)', [req.params.id, req.body.idUtente, req.body.timePointFrom ])
			.then(data => res.json(data.rows))
			.catch(err => rest.error500(res, err));
	}
	else if (req.body.verb == 'close') {
		sql.pool.query('SELECT MAX(id) as id FROM '+sql.tables.RegistroStrumenti+' WHERE "idCatena" = $1', [req.params.id])
		.then(data =>
				sql.pool.query('UPDATE '+sql.tables.RegistroStrumenti+' SET "timePointFrom" = "timePointFrom", "timePointTo" = $1, "idSedeTo" = $2  WHERE id=$3',
								[req.body.timePointTo, req.body.idSedeTo, data[0].id])
					.then(data2 => res.json(data2.rows))
		)
		.catch(err => rest.error500(res, err));
	}
	else {
		rest.error500(res, 'no verb specified');
		return;
	}
});

router.get('/', (req, res, next) => {
  sql.pool.query(
	  	'SELECT '+sql.tables.RegistroStrumenti+'.*, '+sql.tables.Utenti+'.username, '+sql.tables.Sedi+'.nome as sede, ' + sql.tables.Catene +'.name as catena' +
	  	' FROM '+sql.tables.RegistroStrumenti+' LEFT JOIN '+sql.tables.Utenti+' ON '+sql.tables.RegistroStrumenti+'."idUtente" = '+sql.tables.Utenti+'.id LEFT' +
		' JOIN '+sql.tables.Sedi+' on '+sql.tables.RegistroStrumenti+'.idSedeTo = '+sql.tables.Sedi+'.id LEFT JOIN ' +sql.tables.Catene +
		' ON  '+sql.tables.RegistroStrumenti+'."idCatena" = ' + sql.tables.Catene + '.id')
	.then(data => res.json(data.rows))
	.catch(err => rest.error500(res, err));		
});

module.exports = router;