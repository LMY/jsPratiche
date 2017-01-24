var rest = require('../../helpers/rest.js');
var mssql = require('../../helpers/mssql.js');
var moment = require('momentjs');

var express = require('express');
var router = express.Router();


router.get('/', function(req, res, next) {
	var sql_query = "select dbo.TBL_SITI.ID_SITO, dbo.TBL_GESTORI.DESCRIZIONE as GESTORE, dbo.TBL_SITI.Provincia, dbo.TBL_SITI.Comune, dbo.TBL_SITI.Indirizzo, " +
		"dbo.TBL_SITI.Stato_Parere, dbo.TBL_SITI.Pt_RicARP, dbo.TBL_SITI.Dt_RicARP, dbo.TBL_SITI.Pt_RilPar, dbo.TBL_SITI.Dt_RilPar, " +
		"dbo.TBL_DESCRIZIONE_FLAG_realizz.descr_flag as Realizzato, dbo.TBL_SITI.NoteSito " +
		"from dbo.TBL_SITI inner join  dbo.TBL_GESTORI  on (dbo.TBL_SITI.Gestore = dbo.TBL_GESTORI.codice) " +
		"inner join dbo.TBL_DESCRIZIONE_FLAG_realizz on (dbo.TBL_SITI.Flag_realizzato = dbo.TBL_DESCRIZIONE_FLAG_realizz.id_flag) " +
		"inner join dbo.TBL_UTENTI on (dbo.TBL_SITI.ID_Utente = dbo.TBL_UTENTI.ID_UTENTE)";

	var sql_where = "";

	// COMUNE	
	if (req.query.comune) {
		if (sql_where.length > 0)
			sql_where += " AND ";

		sql_where += "dbo.TBL_SITI.Comune LIKE '%@reqcomune%'";
	}

	// STATO
	/*
	if (req.query.state) {
		if (sql_where.length > 0)
			sql_where += " AND ";

		const letters = req.query.state.split('');
		sql_where += " (";
		for (var i=0; i<letters.length; i++) {
			if (i > 0)
				sql_where += " OR ";

			sql_where += "dbo.TBL_SITI.Stato_Parere = '" + letters[i] + "'";
		}

		sql_where += ")";
	}*/
	const protoString = req.query.proto || "dbo.TBL_SITI.Dt_RilPar";

	if (req.query.dateFrom) {
		if (sql_where.length > 0)
			sql_where += " AND ";

		sql_where += protoString + " >= @reqdatefrom";
	}
	if (req.query.dateTo) {
		if (sql_where.length > 0)
			sql_where += " AND ";

		sql_where += protoString + " <= @reqdateto";
	}

	sql_query += (sql_where.length==0 ? "" : " WHERE " + sql_where) + " order by dbo.TBL_SITI.ID_SITO;";
	
	mssql.connect(function(err, connection) {
		const errorHandler = function(err) { rest.error500(res, err); connection.close(); }

		if (err) errorHandler(err);
		else {
			const dbreq = new mssql.mssql.Request(connection);
			if (req.query.comune) dbreq.input('reqcomune', mssql.mssql.NVarChar, req.query.comune);
			if (req.query.dateFrom) dbreq.input('reqdatefrom', mssql.mssql.DateTime, new Date(moment(req.query.dateFrom).toISOString()));
			if (req.query.dateTo) dbreq.input('reqdateto', mssql.mssql.DateTime, new Date(moment(req.query.dateTo).toISOString()));

			dbreq.query(sql_query, function(err, data2) {
					if (err) errorHandler(err);
					else {
						connection.close();
						rest.json(res, data2);
					}
				});
		}
	});
});


module.exports = router;
