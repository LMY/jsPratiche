module.exports = {
	'secret': 'eo8tnr8q23g4q238yvo782qg3mqch478nq7yo43umx,pqh3',
	'db': {
		connectionLimit : 100,
		type     : 'pg',
        host     : 'localhost',
        user     : 'lmy',
        password : 'waterstr',
		database : 'postgres',
		schema : 'jsPratiche',
		dateStrings: 'date',
        debug    :  false
	},

	'usedbemittenti':false,

	'mssql': {
		type: 'pg',
		user: 'lmy',
		password: 'watersr',
		server: 'localhost',
		database: 'postgres',
		schema : 'dbnir',

		// port: 1433,
		// options: {
		// 	encrypt: false,
		// 	tdsVersion: '7_1'	// https://github.com/patriksimek/node-mssql/issues/36 issue with mssql2000
		// }
	}
};
