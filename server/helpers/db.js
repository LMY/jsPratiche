var config = require('../config/config.js');
var config_tables = require('../config/config.tables.js');

const Pool = require('pg').Pool
const pgpool = new Pool({
  user: config.db.user,
  host: config.db.host,
  database: config.db.database,
  password: config.db.password,
  port: 5432,
});
var pgformat = require('pg-format');


module.exports = {
	pool: pgpool,

	// export all table names defined in config.tables.js
	tables : config_tables.tables,

	connect: function(callback) {
		pgpool.getConnection((err, connection) => {
			callback(err, connection);
			connection.release();
		});
	},
	
	query: function(querytxt, callback) {
		console.log("QUERY ["+query+"]");
		pgpool.query(querytxt, (err, res) => {
		  console.log(err, res.rows);
		  pgpool.end();
		});		
	},

	queryfmt: function(query, args, callback) {

		pgpool.getConnection(function(err, connection) {
			connection.query(mysql.format(query, args),
				(err, data) => { callback(err, data); }
			);

			connection.release();
		});
	},
	
	format: pgformat,
}
