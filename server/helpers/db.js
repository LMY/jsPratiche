var mysql = require('mysql');
var pg = require('pg');
var config = require('../config/config.js');
var mysqlpool = config.db.type=="mysql"? mysql.createPool(config.db) : null;
var pgpool = config.db.type=="mysql"? null : mysql.createPool(config.db);

module.exports = {
	pool: config.db.type=="mysql"? mysqlpool : pgpool,

	connect: function(callback) {
		if (config.db.type=="mysql")
		{
			console.log("CONNECT MSQL");

			mysqlpool.getConnection((err, connection) => {
				callback(err, connection);
				connection.release();
			});
		}
			else
		{
console.log("CONNECT PG");
			pgpool.getConnection((err, connection) => {
				callback(err, connection);
				connection.release();
			});
		}
	},
	
	query: function(query, callback) {
		if (config.db.type=="mysql")
		mysqlpool.getConnection(function(err, connection) {
			connection.query(query,
				(err, data) => { callback(err, data); }
			);

			connection.release();
		});
		else
		pgpool.getConnection(function(err, connection) {
			connection.query(query,
				(err, data) => { callback(err, data); }
			);

			connection.release();
		});
	},

	queryfmt: function(query, args, callback) {
		if (config.db.type=="mysql")
		mysqlpool.getConnection(function(err, connection) {
			connection.query(mysql.format(query, args),
				(err, data) => { callback(err, data); }
			);

			connection.release();
		});
		else
		pgpool.getConnection(function(err, connection) {
			connection.query(mysql.format(query, args),
				(err, data) => { callback(err, data); }
			);

			connection.release();
		});
	},
	
	format: config.db.type=="mysql"? mysql.format : pg.format,
}
