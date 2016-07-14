var mysql = require('mysql');
var sql = require('../helpers/db.js');
var tableName = 'StoricoStatoPratiche';
var tableNameCurrent = 'StatoPratiche';

var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
    sql(function(err,connection) {
        connection.query('SELECT * FROM '+tableName, function(err, data) {
            connection.release();
            if (err) throw err;
			res.json(data);
		});
    });
});

router.get('/stati', function(req, res, next) {
    sql(function(err,connection) {
        connection.query('SELECT * FROM ConstStatoPratiche', function(err, data) {
            connection.release();
            if (err) throw err;
			res.json(data);
		});
    });
});

router.get('/current', function(req, res, next) {
    sql(function(err,connection) {
        connection.query('SELECT * FROM '+tableNameCurrent, function(err, data) {
            connection.release();
            if (err) throw err;
			res.json(data);
		});
    });
});

router.get('/current/:id', function(req, res, next) {
    sql(function(err,connection) {
		var query = mysql.format('SELECT * FROM ?? WHERE ??=?', [tableNameCurrent, "idPratica", req.params.id]);
				
        connection.query(query, function(err, data) {
            connection.release();
            if (err) throw err;
			res.json(data);
		});
    });
});

router.get('/pratica/:id', function(req, res, next) {
    sql(function(err,connection) {
		var query = mysql.format('SELECT * FROM ?? WHERE ??=?', [tableName, "idPratica", req.params.id]);
			
        connection.query(query, function(err, data) {
            connection.release();
            if (err) throw err;
			res.json(data.length == 1 ? data[0] : []);
		});
    });
});

router.get('/:id', function(req, res, next) {
    sql(function(err,connection) {
		var query = mysql.format('SELECT * FROM ?? WHERE ??=?', [tableName, "id", req.params.id]);
		
        connection.query(query, function(err, data) {
            connection.release();
            if (err) throw err;
			res.json(data.length == 1 ? data[0] : []);
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
    sql(function (err, connection) {
	var query = "INSERT INTO ??(??,??,??,??) VALUES (?,?,?,?)";
        var table = [tableName, "idPratica", "idUtente", "idStato", "timePoint", req.body.id, req.body.user, req.body.state, Date.now() ];
        query = mysql.format(query, table);
	
        connection.query(query, function(err, data) {
            if (err) {
				connection.release();					
				throw err;
			}

			// if OK, update Current table
			query = "INSERT INTO ??(??,??,??,??) VALUES (?,?,?,?) ON DUPLICATE KEY UPDATE ??=?, ??=?, ??=?";
			table = [tableNameCurrent, "idPratica", "idUtente", "idStato", "timePoint", req.body.id, req.body.user, req.body.state, Date.now(),
				 "idUtente", req.body.user, "idStato", req.body.state, "timePoint", Date.now() ];

			query = mysql.format(query, table);
		
			connection.query(query, function(err, data) {
				connection.release();				
				if (err) throw err;
				res.json(data);
			});
		});
    });
});

/*
router.put('/:id', function(req, res, next) {
    sql(function (err, connection) {
	var query = "UPDATE ?? SET ?? = ?, ?? = ?, ?? = ?, ?? = ? WHERE ?? = ? AND ?? = ?";
        var table = [tableName, "dateIN", req.body.dateIN, "protoOUT", req.body.protoOUT, "protoIN", req.body.protoIN, "note", req.body.note, "idPratica", req.params.id, "dateOUT", req.body.dateout ];
        query = mysql.format(query, table);
	
        connection.query(query, function(err, data) {
			connection.release();				
			if (err) throw err;
            res.json(data);
        });
    });
});*/

module.exports = router;

