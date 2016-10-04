var rest = require('../helpers/rest.js');
var mysql = require('mysql');
var sql = require('../helpers/db.js');
var tableName = 'RegistroStrumenti';

var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
    sql(function(err,connection) {
		
        connection.query('SELECT * FROM '+tableName, function(err, data) {
            if (err) rest.error500(res, err);
			else res.json(data);
		});
    });
});

router.get('/:id', function(req, res, next) {
    sql(function(err,connection) {
		var query = mysql.format('SELECT * FROM ?? WHERE id=?', [tableName, req.params.id]);
		
        connection.query(query, function(err, data) {
            if (err) rest.error500(res, err);
			else res.json(data.length == 1 ? data[0] : []);
		});
    });
});

router.delete('/:id', function(req, res, next) {
    sql(function (err, connection) {
		var query = mysql.format('DELETE FROM ?? WHERE id=?', [tableName, req.params.id]);
				
        connection.query(query, function(err, data) {
            if (err) rest.error500(res, err);
			else rest.deleted(res, data);
        });
    });
});

// RegistroStrumenti(id, idCatena, idUtente, timePointFrom, timePointTo, idSeteTo);
router.post('/', function(req, res, next) {
    sql(function (err, connection) {
		var query =  mysql.format("INSERT INTO ??(??,??,??,??,??) VALUES (?,?,?,?,?)", [tableName, "idCatena", "idUtente", "timePointFrom", "timePointTo", "idSeteTo", req.body.idCatena, req.body.idUtente, req.body.timePointFrom, req.body.timePointTo, req.body.idSeteTo ]);

        connection.query(query, function(err, data) {
            if (err) rest.error500(res, err);
			else rest.created(res, data);
        });
    });
});

router.put('/:id', function(req, res, next) {
    sql(function (err, connection) {
		var query = mysql.format("UPDATE ?? SET ?? = ?, ?? = ?, ?? = ?, ?? = ?, ?? = ? WHERE ?? = ?", [tableName, "idCatena", req.body.idCatena, "idUtente", req.body.idUtente, "timePointFrom", req.body.timePointFrom, "timePointTo", req.body.timePointTo, "idSeteTo", req.body.idSeteTo, "id", req.params.id]);
	
        connection.query(query, function(err, data) {
            if (err) rest.error500(res, err);
            else rest.updated(res, data);
        });
    });
});

module.exports = router;