var sql = require('../helpers/db.js');
var tableName = 'Pratiche';

var express = require('express');
var router = express.Router();

/* GET /pratiche listing. */
router.get('/', function(req, res, next) {
    sql(function(err,connection) {
	connection.query('SELECT * FROM '+tableName, function(err, rows){
            if (err) throw err;
	    res.json(rows);
        });
    });
});

/* GET /pratiche/id */
router.get('/:id', function(req, res, next) {
    sql(function(err, connection) {
	connection.query('SELECT * FROM '+tableName+' WHERE id = '+req.params.id, function(err, data){
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
        var data = inputToData(input);

        connection.query('UPDATE '+tableName+' set ? WHERE id = ? ', [data, id], function(err, rows) {
            if (err) console.log("Error Updating : %s ", err);
	    res.json(rows);
        });
    });
});

/* DELETE /pratiche/:id */
router.delete('/:id', function(req, res, next) {
    sql(function (err, connection) {
        connection.query('DELETE FROM '+tableName+' WHERE id = ? ', req.params.id, function(err, rows) {
            if (err) console.log("Error deleting : %s ", err);
	    res.json(rows);
        });
    });
});

module.exports = router;
