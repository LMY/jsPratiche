var config = require('../config/config.js');

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
