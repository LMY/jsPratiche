var express = require('express');
var mysql = require('mysql');
var config = require('../helpers/config.js');

var pool = mysql.createPool(config.db);

var getConnection = function(callback) {
    pool.getConnection(function(err, connection) {
        callback(err, connection);
		connection.release();
    });
};

var query = function(query, args, callback, errcallback) {
    pool.getConnection(function(err, connection) {
		connection.query(mysql.format(query, args), function(err, data) {
            if (err && errcallback) errcallback(err);
			else callback(data);
        });

		connection.release();
    });
};

module.exports = getConnection;
