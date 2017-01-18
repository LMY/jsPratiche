const mssql = require('mssql');
const config = require('../config/config.js');

module.exports = {

	connect: function(callback, errcallback) {
		const conn = new mssql.Connection(config.mssql);
		conn.connect(function(err) {
			if (err) {
				conn.close();
				errcallback(err);
			}
			else {
				callback(conn);
				conn.close();
			}
		});
	},

	query: function(queryString, callback, errcallback) {
		console.log(config.mssql);
		const conn = new mssql.Connection(config.mssql);
		conn.connect(function(err) {
			if (err) {
				conn.close();
				errcallback(err);
			}
			else {
				const req = new mssql.Request(conn);
				req.query(queryString).then(function (recordset) {
					conn.close();
					callback(recordset);
				})
				.catch(function (err) {
					conn.close();
					errcallback(err);
				});
			}
		});
	}
}
