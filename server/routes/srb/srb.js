var rest = require('../../helpers/rest.js');
var mssql = require('../../helpers/mssql.js');

var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
	var query = "SELECT distinct dbo.TBL_SITI.id_sito as ID, dbo.TBL_SITI.codice_sito as 'Codice Sito', dbo.TBL_SITI.stato_parere as 'Stato Parere', "+
				"dbo.TBL_GESTORI.descrizione as Gestore, dbo.TBL_SITI.comune as Comune, "+ 
				"dbo.TBL_SITI.provincia as Provincia, dbo.TBL_SITI.indirizzo as Indirizzo, "+ 
				"dbo.TBL_SITI.notesito AS Notee, dbo.TBL_SITI.Pt_RicARP AS 'Protocollo In', dbo.TBL_SITI.Dt_RicARP AS 'Data Protocollo In', "+
				"dbo.TBL_SITI.Pt_RilPar AS 'Protocollo Out', dbo.TBL_SITI.Dt_RilPar AS 'Data Protocollo Out', dbo.TBL_SITI.Data_Attivazione AS 'Data Attivazione', "+ 
				"dbo.TBL_SITI.quota_slm as Quota, dbo.TBL_SITI.utmx as UTMX, dbo.TBL_SITI.utmy as UTMY, TempRealizzato.descr_flag as Realizzato "+
				"FROM dbo.TBL_SITI INNER JOIN dbo.TBL_GESTORI ON (dbo.TBL_SITI.gestore = dbo.TBL_GESTORI.codice), dbo.TBL_CELLE, (SELECT id_flag,descr_flag  FROM dbo.TBL_DESCRIZIONE_FLAG_realizz UNION SELECT 0 as id_flag, 'NON SPECIFICATO' as descr_flag) as TempRealizzato "+ 
				"WHERE dbo.TBL_SITI.Flag_realizzato = TempRealizzato.id_flag"

	mssql.query(query, function(err, data) {
		if (err) rest.error500(res, err);
		else res.json(data);
	});
});

router.get('/:id', function(req, res, next) {
	var query = "SELECT distinct dbo.TBL_SITI.id_sito as ID, dbo.TBL_SITI.codice_sito as 'Codice Sito', dbo.TBL_SITI.stato_parere as 'Stato Parere', "+
				"dbo.TBL_GESTORI.descrizione as Gestore, dbo.TBL_SITI.comune as Comune, "+ 
				"dbo.TBL_SITI.provincia as Provincia, dbo.TBL_SITI.indirizzo as Indirizzo, "+ 
				"dbo.TBL_SITI.notesito AS Notee, dbo.TBL_SITI.Pt_RicARP AS 'Protocollo In', dbo.TBL_SITI.Dt_RicARP AS 'Data Protocollo In', "+
				"dbo.TBL_SITI.Pt_RilPar AS 'Protocollo Out', dbo.TBL_SITI.Dt_RilPar AS 'Data Protocollo Out', dbo.TBL_SITI.Data_Attivazione AS 'Data Attivazione', "+ 
				"dbo.TBL_SITI.quota_slm as Quota, dbo.TBL_SITI.utmx as UTMX, dbo.TBL_SITI.utmy as UTMY, TempRealizzato.descr_flag as Realizzato "+
				"FROM dbo.TBL_SITI INNER JOIN dbo.TBL_GESTORI ON (dbo.TBL_SITI.gestore = dbo.TBL_GESTORI.codice), dbo.TBL_CELLE, (SELECT id_flag,descr_flag  FROM dbo.TBL_DESCRIZIONE_FLAG_realizz UNION SELECT 0 as id_flag, 'NON SPECIFICATO' as descr_flag) as TempRealizzato "+ 
				"WHERE dbo.TBL_CELLE.Sito = dbo.TBL_SITI.id_sito AND dbo.TBL_SITI.ID_SITO = "+req.params.id+" AND "+
				"dbo.TBL_SITI.Flag_realizzato = TempRealizzato.id_flag"

	mssql.query(query, function(data) {
		res.json(data.length == 1 ? data[0] : []);
	}, function(err) { rest.error500(res, err); });
});
/*
router.delete('/:id', function(req, res, next) {
	var query = sql.format('DELETE FROM ?? WHERE id=?', [tableName, req.params.id]);

	sql.query(query, function(err, data) {
		if (err) rest.error500(res, err);
		else rest.deleted(res, data);
	});
});

router.post('/', function(req, res, next) {
	var query =  sql.format("INSERT INTO ??(??,??,idaas) VALUES (?,?)", [tableName, "name", "pec", req.body.name, req.body.pec, req.body.idaas ]);

	sql.query(query, function(err, data) {
		if (err) rest.error500(res, err);
		else rest.created(res, data);
	});
});

router.put('/:id', function(req, res, next) {
	var query = sql.format("UPDATE ?? SET ?? = ?, ?? = ?, ?? = ? WHERE ?? = ?", [tableName, "name", req.body.name, "pec", req.body.pec, "idaas", req.body.idaas, "id", req.params.id]);

	sql.query(query, function(err, data) {
		if (err) rest.error500(res, err);
		else rest.updated(res, data);
	});
});
*/
module.exports = router;
