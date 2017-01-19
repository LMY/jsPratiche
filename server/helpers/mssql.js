const mssql = require('mssql');
const config = require('../config/config.js');

module.exports = {

	connect: function(callback) {
		const conn = new mssql.Connection(config.mssql);
		conn.connect(function(err) {
			callback(err, conn);
		});
	},
	
	conquery: function(conn, queryString, callback) {
		const req = new mssql.Request(conn);
		req.query(queryString, function(err, data) {
			callback(err, data);
		});
	},

	query: function(queryString, callback, errcallback) {
		const conn = new mssql.Connection(config.mssql);
		conn.connect(function(err) {
			if (err) {
				conn.close();
				errcallback(err);
			}
			else {
				const req = new mssql.Request(conn);
				req.query(queryString).then(function(recordset) {
					conn.close();
					callback(recordset);
				})
				.catch(function (err) {
					conn.close();
					errcallback(err);
				});
			}
		});
	},
	
	mssql: mssql
}
