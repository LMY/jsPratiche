var mssql = require('../../helpers/mssql.js');
var sql = require('../../helpers/db.js');

module.exports = {

	translateUserId: function(id, connection, callback) {
		connection.query(sql.format('SELECT idlink as id FROM LinkUtenti WHERE id=?', [id]), function(err, data) {
			callback(err, data[0].id);
		});
	},

	translateUsername: function(username, connection, callback) {
		connection.query(sql.format('SELECT id from Utenti WHERE username=?', [username]), function(err, data) {
			if (err) callback(err, []);
			else
				connection.query(sql.format('SELECT idlink as id FROM LinkUtenti WHERE id=?', [data[0].id]), function(err, data2) {
					callback(err, data2[0].id);
				});
		});
	},

	translateSiteToPratica: function(id, connection, callback) {
		connection.query(sql.format('SELECT idpratica as id FROM LinkSitiPratiche WHERE idsite=?', [id]), function(err, data) {
			callback(err, data[0].id);
		});
	},

	translatePraticaToSites: function(id, connection, callback) {
		connection.query(sql.format('SELECT idsite as id FROM LinkSitiPratiche WHERE idpratica=?', [id]), function(err, data) {
			if (err) callback(err, data);

			function enqueue(i, data, ret) {
				if (i == data.length)
					callback(err, ret);
				else {
					ret.push(data[i].id);
					enqueue(i+1, data, ret);
				}
			}

			enqueue(0, data, []);
		});
	},


	conTranslateUserId: function(id, callback) {
		sql.connect(function(err, connection) {
			if (err) callback(err, null);
			else module.exports.translateUserId(id, connection, callback);
		});
	},

	conTranslateUsername: function(username, callback) {
		sql.connect(function(err, connection) {
			if (err) callback(err, null);
			else module.exports.translateUsername(username, connection, callback);
		});
	},

	conTranslateSiteToPratica: function(id, callback) {
		sql.connect(function(err, connection) {
			if (err) callback(err, null);
			else module.exports.translateSiteToPratica(id, connection, callback);
		});
	},

	conTranslatePraticaToSites: function(id, callback) {
		sql.connect(function(err, connection) {
			if (err) callback(err, null);
			else module.exports.translatePraticaToSites(id, connection, callback);
		});
	},

	setStatoParere: function(userid, id, stato, callback) {
		var query_cells = "UPDATE db_emittenti.dbo.tbl_celle SET Parere=@code, ID_UTENTE=@idutente, DataUltMod=@datamod WHERE sito=@siteid";
		var query_sites = "UPDATE db_emittenti.dbo.tbl_siti SET Stato_Parere=@code, ID_UTENTE=@idutente, DataOperazione=@datamod, Flag_realizzato=@realizzato WHERE id_sito=@siteid";

		sql.connect(function(err, connection) {
			if (err) callback(err, null);
			else
				translateUserId(userid, connection, function(err, translated_userid) {
					if (err || dat.length != 1) rest.error500(res, err);
					else
						mssql.connect(function(err, connection) {
							if (err) { callback(err, res); connection.close(); }
							else {
								const now = moment().toISOString();
								const realizzato = stato=='A'?3:'F'?4:null;

								new mssql.mssql.Request(connection)
									.input('code', mssql.mssql.VarChar, stato)
									.input('idutente', mssql.mssql.Int, translated_userid)
									.input('datamod', mssql.mssql.DateTime, now)
									.input('siteid', mssql.mssql.Int, id)
									.query(query_cells, function(err, data2) {
										if (err) { callback(err, res); connection.close(); }
										else
											new mssql.mssql.Request(connection)
												.input('code', mssql.mssql.VarChar, stato)
												.input('idutente', mssql.mssql.Int, translated_userid)
												.input('datamod', mssql.mssql.DateTime, now)
												.input('siteid', mssql.mssql.Int, id)
												.input('realizzato', mssql.mssql.Int, realizzato)
												.query(query_sites, function(err, data3) {
													callback(err, data3);
													connection.close();
												});
									});
							}
						});
				});
		});
	},

	setProtoParere: function(userid, id, proto, protodate, callback) {
		var query_cells = "UPDATE db_emittenti.dbo.tbl_celle SET Pt_RilPar=@proto, Dt_RilPar=@protodate, ID_UTENTE=@idutente, DataUltMod=@datamod WHERE sito=@siteid";
		var query_sites = "UPDATE db_emittenti.dbo.tbl_siti SET Pt_RilPar=@proto, Dt_RilPar=@protodate, ID_UTENTE=@idutente, DataOperazione=@datamod WHERE id_sito=@siteid";

		sql.connect(function(err, connection) {
			if (err) callback(err, null);
			else
				translateUserId(userid, connection, function(err, translated_userid) {
					if (err || dat.length != 1) rest.error500(res, err);
					else
						mssql.connect(function(err, connection) {
							if (err) { callback(err, res); connection.close(); }
							else {
								const now = moment().toISOString();

								new mssql.mssql.Request(connection)
									.input('proto', mssql.mssql.VarChar, proto)
									.input('protodate', mssql.mssql.Date, protodate)
									.input('idutente', mssql.mssql.Int, translated_userid)
									.input('datamod', mssql.mssql.DateTime, now)
									.input('siteid', mssql.mssql.Int, id)
									.query(query_cells, function(err, data2) {
										if (err) { callback(err, res); connection.close(); }
										else
											new mssql.mssql.Request(connection)
												.input('proto', mssql.mssql.VarChar, proto)
												.input('protodate', mssql.mssql.Date, protodate)
												.input('idutente', mssql.mssql.Int, translated_userid)
												.input('datamod', mssql.mssql.DateTime, now)
												.input('siteid', mssql.mssql.Int, id)
												.query(query_sites, function(err, data3) {
													callback(err, data3);
													connection.close();
												});
									});
							}
						});
				});
		});
	},
};