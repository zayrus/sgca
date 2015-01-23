/*
 *  core dbconnect.js
 *  package: /core/config
 *  Use:
 *     Exporta una instancia de la conexion a la base de datos
 */
var mongo = require('mongodb');
var MongoClient = mongo.MongoClient;
var BSON = BSON = mongo.BSONPure;

var path = require('path');
var fs = require('fs');

var dbdriver;
var dburi ;
var rootPath = path.normalize(__dirname + '/../..');
var utilcb;

exports.connect = function (config){
    dburi = config.dburi;
    //console.log("dbconnect URI:[%s]",dburi);
    MongoClient.connect(dburi, function (err, db){
        if(err){
            console.log("errors connecting to db!"+err.toString());
        }else{
            //console.log("dbconnect: connect.ok!");
            // Bootstrap models
            dbdriver = db;
            config.connectionListeners(db,BSON);
            if(utilcb) utilcb(db);
        }
    });
};

exports.db = dbdriver;
exports.BSON = BSON;
exports.dburi = dburi;
exports.setConnectCallback = function(cb){
    if(cb) utilcb=cb;
};
