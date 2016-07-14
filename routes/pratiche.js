var mysql = require('mysql');
var sql = require('../helpers/db.js');
var tableName = 'Pratiche';

var express = require('express');
var router = express.Router();

/* GET /pratiche listing. */
router.get('/', function(req, res, next) {
    sql(function(err,connection) {
		connection.query('SELECT * FROM '+tableName, function(err, rows){
			connection.release();			
            if (err) throw err;
			res.json(rows);
        });
    });
});

/* GET /pratiche/id */
router.get('/:id', function(req, res, next) {
    sql(function(err, connection) {
		var query = mysql.format('SELECT * FROM ?? WHERE id=?', [tableName, req.params.id]);
		
		connection.query(query, function(err, data){
			connection.release();			
            if (err) throw err;
			res.json(data.length == 1 ? data[0] : []);
        });
    });
});

/* POST /pratiche */
router.post('/', function(req, res, next) {
    var input = JSON.parse(JSON.stringify(req.body));

    sql(function (err, connection) {
        var data = inputToData(input);
	
        connection.query('INSERT INTO '+tableName+' set ? ', data, function(err, rows) {
			connection.release();
            if (err) console.log("Error inserting : %s ", err);
			res.json(rows);
        });
    });
});

/* PUT /pratiche/:id */
router.put('/:id', function(req, res, next) {
    var input = JSON.parse(JSON.stringify(req.body));
    var id = req.params.id;

    sql(function (err, connection) {
        var query = mysql.format('UPDATE ?? set ? WHERE id = ?', [tableName, data, id]);

        connection.query(query, function(err, rows) {
			connection.release();
            if (err) console.log("Error Updating : %s ", err);
			res.json(rows);
        });
    });
});

/* DELETE /pratiche/:id */
router.delete('/:id', function(req, res, next) {
    sql(function (err, connection) {
		var query = mysql.format('DELETE FROM ?? WHERE id=?', [tableName, req.params.id]);
		
        connection.query(query, function(err, rows) {
            connection.release();
			if (err) console.log("Error deleting : %s ", err);
			res.json(rows);
        });
    });
});

module.exports = router;
