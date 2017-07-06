const mssql = require('../../helpers/mssql.js');
const sql = require('../../helpers/db.js');
const config = require('../../config/config.js');


module.exports = {

	translateUserId: function(id, connection, callback) {
		if (typeof config.usedbemittenti ==='boolean' && config.usedbemittenti === false) {
			callback(err, "");
			return;
		}

		connection.query(sql.format('SELECT idlink as id FROM LinkUtenti WHERE id=?', [id]), function(err, data) {
			callback(err, data[0].id);
		});
	},

	translateUsername: function(username, connection, callback) {
		if (typeof config.usedbemittenti ==='boolean' && config.usedbemittenti === false) {
			callback(err, "");
			return;
		}
		
		connection.query(sql.format('SELECT id from Utenti WHERE username=?', [username]), function(err, data) {
			if (err) callback(err, []);
			else
				connection.query(sql.format('SELECT idlink as id FROM LinkUtenti WHERE id=?', [data[0].id]), function(err, data2) {
					callback(err, data2[0].id);
				});
		});
	},

	translateSiteToPratica: function(id, connection, callback) {
		if (typeof config.usedbemittenti ==='boolean' && config.usedbemittenti === false) {
			callback(err, "");
			return;
		}
		
		connection.query(sql.format('SELECT idpratica as id FROM LinkSitiPratiche WHERE idsite=?', [id]), function(err, data) {
			callback(err, data[0].id);
		});
	},

	translatePraticaToSites: function(id, connection, callback) {
		if (typeof config.usedbemittenti ==='boolean' && config.usedbemittenti === false) {
			callback(err, []);
			return;
		}
		
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
		if (typeof config.usedbemittenti ==='boolean' && config.usedbemittenti === false) {
			callback(err, "");
			return;
		}
		
		sql.connect(function(err, connection) {
			if (err) callback(err, null);
			else module.exports.translateUserId(id, connection, callback);
		});
	},

	conTranslateUsername: function(username, callback) {
		if (typeof config.usedbemittenti ==='boolean' && config.usedbemittenti === false) {
			callback(err, "");
			return;
		}
		
		sql.connect(function(err, connection) {
			if (err) callback(err, null);
			else module.exports.translateUsername(username, connection, callback);
		});
	},

	conTranslateSiteToPratica: function(id, callback) {
		if (typeof config.usedbemittenti ==='boolean' && config.usedbemittenti === false) {
			callback(err, "");
			return;
		}
		
		sql.connect(function(err, connection) {
			if (err) callback(err, null);
			else module.exports.translateSiteToPratica(id, connection, callback);
		});
	},

	conTranslatePraticaToSites: function(id, callback) {
		if (typeof config.usedbemittenti ==='boolean' && config.usedbemittenti === false) {
			callback(err, []);
			return;
		}
		
		sql.connect(function(err, connection) {
			if (err) callback(err, null);
			else module.exports.translatePraticaToSites(id, connection, callback);
		});
	},

	setStatoParere: function(userid, id, stato, callback) {
		if (typeof config.usedbemittenti ==='boolean' && config.usedbemittenti === false) {
			callback(err, []);
			return;
		}
		
		var query_cells = "UPDATE db_emittenti.dbo.tbl_celle SET Parere=@code, ID_UTENTE=@idutente, DataUltMod=@datamod WHERE sito=@siteid";
		var query_sites = "UPDATE db_emittenti.dbo.tbl_siti SET Stato_Parere=@code, ID_UTENTE=@idutente, DataOperazione=@datamod, Flag_realizzato=@realizzato WHERE id_sito=@siteid";

		sql.connect(function(err, connection) {
			if (err) callback(err, null);
			else
				module.exports.translateUserId(userid, connection, function(err, translated_userid) {
					if (err || !translated_userid) rest.error500(res, err);
					else
						mssql.connect(function(err, mssqlconnection) {
							if (err) { callback(err, res); mssqlconnection.close(); }
							else {
								const now = new Date();
								const realizzato = stato=='A'?3:'F'?4:null;

								new mssql.mssql.Request(mssqlconnection)
									.input('code', mssql.mssql.VarChar, stato)
									.input('idutente', mssql.mssql.Int, translated_userid)
									.input('datamod', mssql.mssql.DateTime, now)
									.input('siteid', mssql.mssql.BigInt, id)
									.query(query_cells, function(err, data2) {
										if (err) { callback(err, res); mssqlconnection.close(); }
										else
											new mssql.mssql.Request(mssqlconnection)
												.input('code', mssql.mssql.VarChar, stato)
												.input('idutente', mssql.mssql.Int, translated_userid)
												.input('datamod', mssql.mssql.DateTime, now)
												.input('siteid', mssql.mssql.BigInt, id)
												.input('realizzato', mssql.mssql.Int, realizzato)
												.query(query_sites, function(err, data3) {
													mssqlconnection.close();
													callback(err, data3);
												});
									});
							}
						});
				});
		});
	},

	setProtoParere: function(userid, id, connection, proto, protodate, callback) {
		if (typeof config.usedbemittenti ==='boolean' && config.usedbemittenti === false) {
			callback(err, []);
			return;
		}
		
		var query_cells = "UPDATE db_emittenti.dbo.tbl_celle SET Pt_RilPar = @proto, Dt_RilPar = @protodate, ID_Utente = @idutente, DataUltMod = @datamod WHERE Sito = @siteid";
		var query_sites = "UPDATE db_emittenti.dbo.tbl_siti SET Pt_RilPar = @proto, Dt_RilPar = @protodate, ID_Utente = @idutente, DataOperazione = @datamod WHERE ID_SITO = @siteid";
			
		protodate = new Date(protodate);

		module.exports.translateUserId(userid, connection, function(err, translated_userid) {
			if (err || !translated_userid) rest.error500(err, null);
			else
				mssql.connect(function(err, mssqlconnection) {
					if (err) { mssqlconnection.close(); callback(err); }
					else {
						const now = new Date();
						new mssql.mssql.Request(mssqlconnection)
							.input('proto', mssql.mssql.VarChar(16), proto)
							.input('protodate', mssql.mssql.DateTime, protodate)
							.input('idutente', mssql.mssql.Int, translated_userid)
							.input('datamod', mssql.mssql.DateTime, now)
							.input('siteid', mssql.mssql.BigInt, id)
							.query(query_cells, function(err, data2) {
								if (err) { mssqlconnection.close(); callback(err); }
								else
									new mssql.mssql.Request(mssqlconnection)
										.input('proto', mssql.mssql.VarChar(20), proto)
										.input('protodate', mssql.mssql.DateTime, protodate)
										.input('idutente', mssql.mssql.Int, translated_userid)
										.input('datamod', mssql.mssql.DateTime, now)
										.input('siteid', mssql.mssql.BigInt, id)
										.query(query_sites, function(err, data3) {
											mssqlconnection.close();
											callback(err);
										});
							});
					}
				});
		});
	},

	conSetProtoParere: function(userid, id, proto, protodate, callback) {
		if (typeof config.usedbemittenti ==='boolean' && config.usedbemittenti === false) {
			callback(err, []);
			return;
		}
		
		sql.connect(function(err, connection) {
			if (err) callback(err);
			else module.exports.setProtoParere(userid, id, connection, proto, protodate, callback);
		});
	}
};
