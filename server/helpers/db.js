var mysql = require('mysql');
var config = require('../config/config.js');
var thepool = mysql.createPool(config.db);

module.exports = {
	pool: thepool,

	connect: function(callback) {
		thepool.getConnection((err, connection) => {
			callback(err, connection);
			connection.release();
		});
	},
	
	query: function(query, callback) {
		thepool.getConnection(function(err, connection) {
			connection.query(query,
				(err, data) => { callback(err, data); }
			);

			connection.release();
		});
	},

	queryfmt: function(query, args, callback) {
		thepool.getConnection(function(err, connection) {
			connection.query(mysql.format(query, args),
				(err, data) => { callback(err, data); }
			);

			connection.release();
		});
	},
	
	format: mysql.format
}
