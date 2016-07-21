var rest = require('../helpers/rest.js');
var mysql = require('mysql');
var sql = require('../helpers/db.js');
var tableName = 'StoricoStatoPratiche';
var tableNameCurrent = 'StatoPratiche';

var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
    sql(function(err,connection) {
        connection.query('SELECT * FROM '+tableName, function(err, data) {
            if (err) rest.error500(err);
			else res.json(data);
		});
    });
});

router.get('/stati', function(req, res, next) {
    sql(function(err,connection) {
        connection.query('SELECT * FROM ConstStatoPratiche', function(err, data) {
            if (err) rest.error500(err);
			else res.json(data);
		});
    });
});

router.get('/tipi', function(req, res, next) {
    sql(function(err,connection) {
        connection.query('SELECT * FROM ConstTipoPratiche', function(err, data) {
            if (err) rest.error500(err);
			else res.json(data);
		});
    });
});

router.get('/current', function(req, res, next) {
    sql(function(err,connection) {
        connection.query('SELECT * FROM '+tableNameCurrent, function(err, data) {
            if (err) rest.error500(err);
			else res.json(data);
		});
    });
});

router.get('/current/:id', function(req, res, next) {
    sql(function(err,connection) {
		var query = mysql.format('SELECT * FROM ?? WHERE ??=?', [tableNameCurrent, "idPratica", req.params.id]);
				
        connection.query(query, function(err, data) {
            if (err) rest.error500(err);
			else res.json(data);
		});
    });
});

router.get('/pratica/:id', function(req, res, next) {
    sql(function(err,connection) {
		var query = mysql.format('SELECT * FROM ?? WHERE ??=?', [tableName, "idPratica", req.params.id]);
			
        connection.query(query, function(err, data) {
            if (err) rest.error500(err);
			else res.json(data.length == 1 ? data[0] : []);
		});
    });
});

router.get('/:id', function(req, res, next) {
    sql(function(err,connection) {
		var query = mysql.format('SELECT * FROM ?? WHERE ??=?', [tableName, "id", req.params.id]);
		
        connection.query(query, function(err, data) {
            if (err) rest.error500(err);
			else res.json(data.length == 1 ? data[0] : []);
		});
    });
});

/*
router.delete('/:id', function(req, res, next) {
    sql(function (err, connection) {
        connection.query('DELETE FROM '+tableName+' WHERE id = '+req.params.id, function(err, data) {
            if (err) throw err;
			res.json(data);
        });
    });
});*/

router.post('/', function(req, res, next) {
	var userid = req.user.id;
		
    sql(function (err, connection) {
		var query =  mysql.format("INSERT INTO ??(??,??,??,idUtenteModifica) VALUES (?,?,?,?)", [tableName, "idPratica", "idUtente", "idStato", req.body.id, req.body.user, req.body.state, userid ]);
	
        connection.query(query, function(err, data) {
            if (err)			
				throw err;

			// if OK, update Current table
			query = mysql.format("INSERT INTO ??(??,??,??,idUtenteModifica) VALUES (?,?,?,?) ON DUPLICATE KEY UPDATE ??=?, ??=?", [tableNameCurrent, "idPratica", "idUtente", "idStato", req.body.id, req.body.user, req.body.state, "idUtente", req.body.user, "idStato", req.body.state, userid ]);
		
			connection.query(query, function(err, data) {			
				if (err) rest.error500(err);
				else rest.created(res, data);
			});
		});
    });
});

/*
router.put('/:id', function(req, res, next) {
    sql(function (err, connection) {
		var query = mysql.format("UPDATE ?? SET ?? = ?, ?? = ?, ?? = ?, ?? = ? WHERE ?? = ? AND ?? = ?", [tableName, "dateIN", req.body.dateIN, "protoOUT", req.body.protoOUT, "protoIN", req.body.protoIN, "note", req.body.note, "idPratica", req.params.id, "dateOUT", req.body.dateout ];
	
        connection.query(query, function(err, data) {
            if (err) rest.error500(err);
            else rest.updated(res, data);
        });
    });
});*/

module.exports = router;