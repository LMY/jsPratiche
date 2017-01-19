var rest = require('../../helpers/rest.js');
var mssql = require('../../helpers/mssql.js');

var express = require('express');
var router = express.Router();

router.get('/all', function(req, res, next) {
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
				.batch(query, function(err, data2) {	// batch, not query (res is ~3mb)
					if (err) errorHandler(err);
					else {
						connection.close();
						res.json(data2);
					}
				});
	});
});

function getCellsOfSite(connection, id, callback) {
	var query_cells = "SELECT dbo.TBL_CELLE.Sito as IDSito, dbo.TBL_CELLE.Marca_Antenna, dbo.TBL_CELLE.Modello_Antenna, dbo.TBL_CELLE.Altezza, " +
				"dbo.TBL_SITI.Quota_slm as Quota, dbo.TBL_CELLE.Direzione, dbo.TBL_CELLE.Potenza, dbo.TBL_CELLE.Guadagno as Gain, " +
				"dbo.TBL_CELLE.Tilt_Mecc as TiltM, dbo.TBL_CELLE.Tilt_Elettrico as TiltE, dbo.TBL_CELLE.UTMX as X, dbo.TBL_CELLE.UTMY as Y, dbo.TBL_CELLE.ALFA24, Flag_sistema, dbo.TBL_CELLE.FREQUENZA " +
				"FROM dbo.TBL_CELLE INNER JOIN dbo.TBL_SITI on (dbo.TBL_CELLE.Sito = dbo.TBL_SITI.ID_SITO) " +
				"WHERE Sito = @reqparamsid";

	new mssql.mssql.Request(connection)
		.input('reqparamsid', mssql.mssql.NVarChar, id)
		.query(query_cells, function(err, data2) {
			callback(err, data2);
		});
}

function getSite(connection, id, callback) {
	var query = "SELECT distinct dbo.TBL_SITI.id_sito as ID, dbo.TBL_SITI.codice_sito as 'Codice Sito', dbo.TBL_SITI.stato_parere as 'Stato Parere', "+
				"dbo.TBL_GESTORI.descrizione as Gestore, dbo.TBL_SITI.comune as Comune, "+
				"dbo.TBL_SITI.provincia as Provincia, dbo.TBL_SITI.indirizzo as Indirizzo, "+
				"dbo.TBL_SITI.notesito AS Notee, dbo.TBL_SITI.Pt_RicARP AS 'Protocollo In', dbo.TBL_SITI.Dt_RicARP AS 'Data Protocollo In', "+
				"dbo.TBL_SITI.Pt_RilPar AS 'Protocollo Out', dbo.TBL_SITI.Dt_RilPar AS 'Data Protocollo Out', dbo.TBL_SITI.Data_Attivazione AS 'Data Attivazione', "+
				"dbo.TBL_SITI.quota_slm as Quota, dbo.TBL_SITI.utmx as UTMX, dbo.TBL_SITI.utmy as UTMY, TempRealizzato.descr_flag as Realizzato "+
				"FROM dbo.TBL_SITI INNER JOIN dbo.TBL_GESTORI ON (dbo.TBL_SITI.gestore = dbo.TBL_GESTORI.codice), dbo.TBL_CELLE, (SELECT id_flag,descr_flag  FROM dbo.TBL_DESCRIZIONE_FLAG_realizz UNION SELECT 0 as id_flag, 'NON SPECIFICATO' as descr_flag) as TempRealizzato "+
				"WHERE dbo.TBL_CELLE.Sito = dbo.TBL_SITI.id_sito AND dbo.TBL_SITI.ID_SITO = @reqparamsid AND "+
				"dbo.TBL_SITI.Flag_realizzato = TempRealizzato.id_flag"


	const errorHandler = function(err) { connection.close(); callback(err, []); }

	new mssql.mssql.Request(connection)
		.input('reqparamsid', mssql.mssql.NVarChar, id)
		.query(query, function(err, data1) {
			if (err) errorHandler(err);
			else
				getCellsOfSite(connection, id, function(err, data2) {

					if (err) errorHandler(err);
					else {
						data1[0].cells = data2;
						callback(null, data1);
					}
				});
		});
}


router.get('/near', function(req, res, next) {
	var query = "SELECT DISTINCT dbo.TBL_SITI.ID_SITO as id " +
					"FROM dbo.TBL_SITI INNER JOIN dbo.TBL_CELLE ON dbo.TBL_SITI.ID_SITO = dbo.TBL_CELLE.Sito " +
					"WHERE " +
					(req.query.favorevoli ? "(dbo.TBL_CELLE.Parere <> 'A' AND dbo.TBL_CELLE.Parere <> 'C') AND ((dbo.TBL_SITI.Flag_realizzato = 1) OR (dbo.TBL_SITI.Flag_realizzato = 4)) AND (dbo.TBL_SITI.Stato_Parere = N'F' OR dbo.TBL_SITI.Stato_Parere = N'L') AND " : "") +
					"(dbo.TBL_SITI.Tipologia = 0 OR dbo.TBL_SITI.Tipologia = 3) AND " +
						"((dbo.TBL_SITI.UTMX < @reqparamsx + @reqparamsdist) AND (dbo.TBL_SITI.UTMX > @reqparamsx - @reqparamsdist) AND " +
						"(dbo.TBL_SITI.UTMY < @reqparamsy + @reqparamsdist) AND (dbo.TBL_SITI.UTMY > @reqparamsy - @reqparamsdist)) "
					"ORDER BY dbo.TBL_SITI.ID_SITO";

	mssql.connect(function(err, connection) {
		const errorHandler = function(err) { rest.error500(res, err); connection.close(); }

		if (err) errorHandler(err);
		else
			new mssql.mssql.Request(connection)
				.input('reqparamsx', mssql.mssql.Real, req.query.x)
				.input('reqparamsy', mssql.mssql.Real, req.query.y)
				.input('reqparamsdist', mssql.mssql.Real, req.query.dist)
				.batch(query, function(err, data2) {

					if (err) errorHandler(err);
					else {
						const appendi = function(ret, i, data) {		// iterate i=[0;data.length-1]
							if (i == data.length) {
								connection.close();
								res.json(ret);
							}
							else
								getSite(connection, data[i].id, function(err, newdata) {
									if (err) errorHandler(err);
									else {
										ret.push(newdata);
										appendi(ret, i+1, data);
									}
								});
						};

						appendi([], 0, data2);
					}
				});
	});
});


router.get('/cells/:id', function(req, res, next) {

	mssql.connect(function(err, connection) {
		if (err) { rest.error500(res, err); connection.close(); }
		else getCellsOfSite(connection, req.params.id, function(err, data) {

			connection.close();

			if (err) rest.error500(res, err);
			else res.json(data);
		});
	});
});

router.get('/:id', function(req, res, next) {

	mssql.connect(function(err, connection) {
		if (err) {
			connection.close();
			rest.error500(res, err);
		}
		else getSite(connection, req.params.id, function(err, data) {
			connection.close();

			if (err) rest.error500(res, err);
			else res.json1(data);
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
