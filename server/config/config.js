module.exports = {
	'secret': 'eo8tnr8q23g4q238yvo782qg3mqch478nq7yo43umx,pqh3',
	'dbtest': {
        connectionLimit : 100,
        host     : 'localhost',
        user     : 'ceruser',
        password : 'cerpass',
        database : 'jsPraticheTest',
		dateStrings: 'date',
        debug    :  false
	},
	'db': {
        connectionLimit : 100,
        host     : 'localhost',
        user     : 'ceruser',
        password : 'cerpass',
        database : 'jsPratiche',
		dateStrings: 'date',
        debug    :  false
	},
	'mssql': {
		user: '',
		password: '',
		server: '',
		database: '',
		port: 1433,
		options: {
			encrypt: false,
			tdsVersion: '7_1'	// https://github.com/patriksimek/node-mssql/issues/36 issue with mssql2000
		}
	}
};
