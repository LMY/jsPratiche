var express = require('express');
var mysql = require('mysql');

var pool = mysql.createPool({
        connectionLimit : 100,
        host     : 'localhost',
        user     : 'ceruser',
        password : 'cerpass',
        database : 'jsPratiche',
        debug    :  false
});

var getConnection = function(callback) {
    pool.getConnection(function(err, connection) {
        callback(err, connection);
    });
};

module.exports = getConnection;

