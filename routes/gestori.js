var rest = require('../helpers/rest.js');
var mysql = require('mysql');
var sql = require('../helpers/db.js');
var tableName = 'Gestori';

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

router.post('/', function(req, res, next) {
    sql(function (err, connection) {
		var query = mysql.format("INSERT INTO ??(??,??) VALUES (?,?)", [tableName, "name", "pec", req.body.name, req.body.pec]);

        connection.query(query, function(err, data) {
            if (err) rest.error500(res, err);
            else rest.created(res, data);
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

router.put('/:id', function(req, res, next) {
    sql(function (err, connection) {
        var query = mysql.format("UPDATE ?? SET ?? = ?, ?? = ? WHERE ?? = ?", [tableName, "name", req.body.name, "pec", req.body.pec, "id", req.params.id]);
	
        connection.query(query, function(err, data) {
            if (err) rest.error500(res, err);
            else rest.updated(res, data);
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

module.exports = router;
