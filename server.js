 /*!
  * SGCA - 2014
 */
var express = require('express');
var path = require('path');
var http = require('http');
var fs = require('fs');

var coreApp  = __dirname + '/core';

// var options = {
//   key: fs.readFileSync('key.pem'),
//   cert: fs.readFileSync('key-cert.pem')
// }

console.log('server: BEGIN at: ['+ __dirname +"]");
console.log('NODE_APP_MODE: ['+process.env.NODE_APP_MODE +"]");
console.log('NODE_PORT: ['+process.env.NODE_PORT +"]");
console.log('NODE_LOG: ['+process.env.NODE_LOG +"]");

var env = process.env.NODE_APP_MODE || 'development'
var config = require(coreApp + '/config/config')[env];

var mongodb = require(coreApp + '/config/dbconnect');
mongodb.connect(config);

var app = express();
config.routesBootstrap(app,express);
//se agrego https conexion ssl
//var server = http.createServer(options, app);
var server = http.createServer(app);
server.listen(app.get('port'), function () {
    console.log("Express server listening on port " + app.get('port'));
});
