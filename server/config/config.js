module.exports = {
	'secret': 'eo8tnr8q23g4q238yvo782qg3mqch478nq7yo43umx,pqh3',
	'db': {
        connectionLimit : 100,
        host     : 'localhost',
        user     : 'certest',
        password : 'certest',
        database : 'jsTest',
		dateStrings: 'date',
        debug    :  false
	},
	'mssql': {
		user: 'user',
		password: 'pass',
		server: 'localhost',
		database: 'db_emittenti',
		port: 1433,
		options: {
			encrypt: false,
			tdsVersion: '7_1'	// https://github.com/patriksimek/node-mssql/issues/36 issue with mssql2000
		}
	}
};
