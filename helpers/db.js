var mysql = require('mysql');
var config = require('../helpers/config.js');
var pool = mysql.createPool(config.db);

module.exports = {

	connect: function(callback) {
		pool.getConnection((err, connection) => {
			callback(err, connection);
			connection.release();
		});
	},
	
	query: function(query, callback) {
		pool.getConnection(function(err, connection) {
			connection.query(query,
				(err, data) => { callback(err, data); }
			);

			connection.release();
		});
	},

	queryfmt: function(query, args, callback) {
		pool.getConnection(function(err, connection) {
			connection.query(mysql.format(query, args),
				(err, data) => { callback(err, data); }
			);

			connection.release();
		});
	},
	
	format: mysql.format
}
