var rest = require('../../helpers/rest.js');
var sql = require('../../helpers/db.js');

var express = require('express');
var router = express.Router();

const shared = require('../dbemittenti/shared.js');

const daBigQuery = 'SELECT P.*, Q.*, csp.descrizione as "stringStato", '+ sql.tables.Comuni+'.name as "stringComune", '+sql.tables.Gestori+'.name as "stringGestore", ctp.descrizione as "stringTipo", csp.final, dt.diff, tmo."dateCommOst" FROM '+sql.tables.Pratiche+' P INNER JOIN (SELECT sp."idPratica", sp."idStato", sp."idUtenteModifica", sp."timePoint", sq."timePointInCarico", sq.userid, sq.username as "stringUser" FROM '+sql.tables.StatoPratiche+' sp INNER JOIN (SELECT '+sql.tables.StatoPratiche+'."idPratica", MAX("timePoint") AS "MaxDateTime" FROM '+sql.tables.StatoPratiche+' GROUP BY "idPratica") groupedtt ON sp."idPratica" = groupedtt."idPratica" AND sp."timePoint" = groupedtt."MaxDateTime" LEFT JOIN (SELECT sp."idPratica", sp."timePoint" as "timePointInCarico", '+ sql.tables.Utenti+'.id as userid, '+ sql.tables.Utenti+'.username FROM '+sql.tables.StatoPratiche+' sp INNER JOIN (SELECT sp."idPratica", MAX("timePoint") AS "MaxDateTime" FROM '+sql.tables.StatoPratiche+' sp INNER JOIN '+ sql.tables.AssStatoPraticheUtenti+' aspu on sp.id=aspu."idStato" WHERE "idUtente" IS NOT NULL AND sp."idStato"=2 GROUP BY "idPratica") groupedtt ON sp."idPratica" = groupedtt."idPratica" AND sp."timePoint" = groupedtt."MaxDateTime" INNER JOIN '+ sql.tables.AssStatoPraticheUtenti+' aspu on sp.id = aspu."idStato" INNER JOIN '+ sql.tables.Utenti+' on aspu."idUtente" = '+ sql.tables.Utenti+'.id) sq on sp."idPratica" = sq."idPratica") Q on P.id = Q."idPratica" INNER JOIN '+sql.tables.ConstStatoPratiche+' csp on "idStato"=csp.id INNER JOIN '+ sql.tables.Comuni+' on "idComune" = '+ sql.tables.Comuni+'.id INNER JOIN '+sql.tables.Gestori+' on "idGestore" = '+sql.tables.Gestori+'.id INNER JOIN '+sql.tables.ConstTipoPratiche+' ctp on tipopratica = ctp.id LEFT JOIN (SELECT '+sql.tables.StatoPratiche+'."idPratica", SUM(DATE_PART(\'day\', "dateIN"::timestamp - "dateOUT"::timestamp)) as diff FROM '+sql.tables.StatoPratiche+' LEFT JOIN '+ sql.tables.AssStatoPraticheIntegrazioni+' on '+sql.tables.StatoPratiche+'.id='+ sql.tables.AssStatoPraticheIntegrazioni+'."idStato" LEFT JOIN '+sql.tables.Integrazioni+' on '+ sql.tables.AssStatoPraticheIntegrazioni+'."idInteg" = '+sql.tables.Integrazioni+'.id WHERE ostativi=0 OR ostativi IS NULL GROUP BY "idPratica") dt on P.id=dt."idPratica" LEFT JOIN (select '+sql.tables.StatoPratiche+'."idPratica", MAX("dateOUT") as "dateCommOst" from '+sql.tables.Integrazioni+' LEFT JOIN '+ sql.tables.AssStatoPraticheIntegrazioni+' on '+sql.tables.Integrazioni+'.id='+ sql.tables.AssStatoPraticheIntegrazioni+'."idInteg" LEFT JOIN '+sql.tables.StatoPratiche+' on '+ sql.tables.AssStatoPraticheIntegrazioni+'."idStato"='+sql.tables.StatoPratiche+'.id WHERE ostativi=1 GROUP BY "idPratica") tmo on P.id=tmo."idPratica"';


/* GET /pratiche in corso listing. */
router.get('/', (req, res, next) => {
	sql.pool.query(daBigQuery+' WHERE final=0 OR FINAL IS NULL')
    .then(data => res.json(data.rows))
    .catch(err => rest.error500(res, err));
});

router.get('/count', (req, res, next) => {

// console.log('SELECT ' + sql.tables.StatoPratiche + '."idGestore" as id,' +
// sql.tables.Gestori + '.name,COUNT("idGestore") as count FROM ' +
// sql.tables.StatoLinkSitiPratiche + ' JOIN ' + sql.tables.StatoPratiche +
// ' on ' + sql.tables.StatoLinkSitiPratiche + '."idPratica" = ' +
// sql.tables.StatoPratiche + '.id JOIN ' + sql.tables.Gestori + ' on ' +
// sql.tables.StatoPratiche + '."idGestore" = ' + sql.tables.Gestori +
// '.id WHERE "dateOUT" > \'2016-12-31\' GROUP BY ' +
// sql.tables.StatoPratiche + '."idGestore",' + sql.tables.Gestori + '.name');

  sql.pool.query(
      'SELECT ' + sql.tables.StatoPratiche + '."idGestore" as id,' +
          sql.tables.Gestori + '.name,COUNT("idGestore") as count FROM ' +
          sql.tables.StatoLinkSitiPratiche + ' JOIN ' + sql.tables.StatoPratiche +
          ' on ' + sql.tables.StatoLinkSitiPratiche + '."idPratica" = ' +
          sql.tables.StatoPratiche + '.id JOIN ' + sql.tables.Gestori + ' on ' +
          sql.tables.StatoPratiche + '."idGestore" = ' + sql.tables.Gestori +
          '.id WHERE "dateOUT" > \'2016-12-31\' GROUP BY ' +
          sql.tables.StatoPratiche + '."idGestore",' + sql.tables.Gestori + '.name')
    .then(data => res.json(data.rows))
    .catch(err => rest.error500(res, err));
});

/* GET /pratiche storico listing. */
router.get('/all', (req, res, next) => {
	var query = daBigQuery;
	
	if (req.query.dateFrom && req.query.dateTo) {
		var dateType = "\"dateIN\"";

		if (req.query.dateType) {
			if (req.query.dateType == "dateOUT" || req.query.dateType == "out")
				dateType = "\"dateOUT\"";
		}

		sql.pool.query(query + ' WHERE '+dateType+' BETWEEN $1 AND $2', [ req.query.dateFrom, req.query.dateTo ])
      .then(data => res.json(data.rows))
      .catch(err => rest.error500(res, err));
	}
	else
		sql.pool.query(query)
      .then(data => res.json(data.rows))
      .catch(err => rest.error500(res, err));
});

/* GET /pratiche/correggere in correzione listing. */
router.get('/correggere', (req, res, next) => {
	sql.pool.query(daBigQuery + ' WHERE "idStato" = 4 OR "idStato" = 5')
    .then(data => res.json(data.rows))
    .catch(err => rest.error500(res, err));
});

/* GET /pratiche/protocollare in uscita ma senza protocollo listing. */
router.get('/protocollare', (req, res, next) => {
	sql.pool.query(daBigQuery + ' WHERE "idStato" = 6')
    .then(data => res.json(data.rows))
    .catch(err => rest.error500(res, err));
});

router.get('/:id', (req, res, next) => {
	sql.pool.query(daBigQuery+' WHERE P.id=$1', [req.params.id])
    .then(data => res.json(data.rows.length == 1 ? data.rows[0] : []))
    .catch(err => rest.error500(res, err));
});

router.post('/', (req, res, next) => {
  sql.pool.query('INSERT INTO ' + sql.tables.Pratiche + '("idGestore", "idComune", address, sitecode, tipopratica, "protoIN", "dateIN", "protoOUT", "dateOUT", note) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING id',
                [ req.body.idGestore, req.body.idComune, req.body.address, req.body.sitecode, req.body.tipopratica, req.body.protoIN, req.body.dateIN, req.body.protoOUT, req.body.dateOUT, req.body.note ])
      .then(data => 
        sql.pool.query('INSERT INTO ' + sql.tables.StatoPratiche + '("idPratica","idUtenteModifica","idStato") VALUES ($1,$2,$3)',
          [data.rows[0].id, req.user.id, 1])
          .then(data => rest.created(res, data.rows))
          /*.catch(err => rest.error500(res, err))*/
        )
      .catch(err => rest.error500(res, err));
});

router.put('/:id', (req, res, next) => {
  sql.pool.query(
      'UPDATE ' + sql.tables.Pratiche +
          ' SET "idGestore" = $1, "idComune" = $2, address = $3, sitecode = $4, tipopratica = $5, "protoIN" = $6, "dateIN" = $7, "protoOUT" = $8, "dateOUT" = $9, note = $10 WHERE id = $11',
      [
        req.body.idGestore, req.body.idComune, req.body.address,
        req.body.sitecode, req.body.tipopratica, req.body.protoIN,
        req.body.dateIN, req.body.protoOUT, req.body.dateOUT, req.body.note,
        req.params.id
      ])
      .then(data => rest.updated(res, data.rows))
      .catch(err => rest.error500(res, err));
});

/* PUT /pratiche/protoout/:id */
router.put('/protoout/:id', (req, res, next) => {
	sql.pool.query('UPDATE '+sql.tables.Pratiche+' SET "protoOUT" = $1, "dateOUT" = $2 WHERE id = $3', [req.body.protoOUT, req.body.dateOUT, req.params.id])
  .then(data => 
    sql.pool.query('INSERT INTO '+sql.tables.StatoPratiche+'("idPratica","idStato","idUtenteModifica") VALUES ($1,$2,$3)', [ req.params.id, 12, req.user.id ])
    .then(data2 => rest.updated(res, data.rows))
  )
  .catch(err => rest.error500(res, err));
});

router.delete('/:id', (req, res, next) => {
	sql.pool.query('INSERT INTO '+sql.tables.StatoPratiche+'("idPratica","idStato","idUtenteModifica") VALUES ($1,$2,$3)', [ req.params.id, 10, req.user.id ])
    .then(data => rest.deleted(res, data.rows))
    .catch(err => rest.error500(res, err));
});

module.exports = router;
