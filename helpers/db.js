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

module.exports = getConnection;

