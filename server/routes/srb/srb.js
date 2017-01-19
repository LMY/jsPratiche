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

	const errorHandler = function(err) { rest.error500(res, err); connection.close(); }

	mssql.connect(function(err, connection) {
		if (err) errorHandler(err);
		else
			new mssql.mssql.Request(connection)
				.batch(query, function(err, data2) {
					if (err) errorHandler(err);
					else {
						connection.close();
						res.json(data2);
					}
				});	
	});
});

router.get('/cells/:id', function(req, res, next) {

	var query_cells = "SELECT dbo.TBL_CELLE.Sito as IDSito, dbo.TBL_CELLE.Marca_Antenna, dbo.TBL_CELLE.Modello_Antenna, dbo.TBL_CELLE.Altezza, " +
				"dbo.TBL_SITI.Quota_slm as Quota, dbo.TBL_CELLE.Direzione, dbo.TBL_CELLE.Potenza, dbo.TBL_CELLE.Guadagno as Gain, " +
				"dbo.TBL_CELLE.Tilt_Mecc as TiltM, dbo.TBL_CELLE.Tilt_Elettrico as TiltE, dbo.TBL_CELLE.UTMX as X, dbo.TBL_CELLE.UTMY as Y, dbo.TBL_CELLE.ALFA24, Flag_sistema, dbo.TBL_CELLE.FREQUENZA " +
				"FROM dbo.TBL_CELLE INNER JOIN dbo.TBL_SITI on (dbo.TBL_CELLE.Sito = dbo.TBL_SITI.ID_SITO) " +
				"WHERE Sito = @reqparamsid";

	const errorHandler = function(err) { rest.error500(res, err); connection.close(); }

	mssql.connect(function(err, connection) {
		if (err) errorHandler(err);
		else
			new mssql.mssql.Request(connection)
				.input('reqparamsid', mssql.mssql.NVarChar, req.params.id)
				.query(query_cells, function(err, data2) {
					if (err) errorHandler(err);
					else {
						connection.close();
						res.json(data2);
					}
				});
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
				"WHERE dbo.TBL_CELLE.Sito = dbo.TBL_SITI.id_sito AND dbo.TBL_SITI.ID_SITO = @reqparamsid AND "+
				"dbo.TBL_SITI.Flag_realizzato = TempRealizzato.id_flag"

	var query_cells = "SELECT dbo.TBL_CELLE.Sito as IDSito, dbo.TBL_CELLE.Marca_Antenna, dbo.TBL_CELLE.Modello_Antenna, dbo.TBL_CELLE.Altezza, " +
				"dbo.TBL_SITI.Quota_slm as Quota, dbo.TBL_CELLE.Direzione, dbo.TBL_CELLE.Potenza, dbo.TBL_CELLE.Guadagno as Gain, " +
				"dbo.TBL_CELLE.Tilt_Mecc as TiltM, dbo.TBL_CELLE.Tilt_Elettrico as TiltE, dbo.TBL_CELLE.UTMX as X, dbo.TBL_CELLE.UTMY as Y, dbo.TBL_CELLE.ALFA24, Flag_sistema, dbo.TBL_CELLE.FREQUENZA " +
				"FROM dbo.TBL_CELLE INNER JOIN dbo.TBL_SITI on (dbo.TBL_CELLE.Sito = dbo.TBL_SITI.ID_SITO) " +
				"WHERE Sito = @reqparamsid";


	const errorHandler = function(err) { rest.error500(res, err); connection.close(); }


	mssql.connect(function(err, connection) {
		if (err) errorHandler(err);
		else
			new mssql.mssql.Request(connection)
				.input('reqparamsid', mssql.mssql.NVarChar, req.params.id)
				.query(query, function(err, data1) {
					if (err) errorHandler(err);
					else
						new mssql.mssql.Request(connection)
							.input('reqparamsid', mssql.mssql.NVarChar, req.params.id)
							.query(query_cells, function(err, data2) {
								if (err) errorHandler(err);
								else {
									connection.close();
									data1[0].cells = data2;
									res.json(data1);
								}
							});
				});
	});
});

router.delete('/:id', function(req, res, next) {
	rest.error500(res, "Not permitted");
});

router.post('/', function(req, res, next) {
	rest.error500(res, "Not permitted");
});

router.put('/:id', function(req, res, next) {
	rest.error500(res, "Not permitted");
});

module.exports = router;
