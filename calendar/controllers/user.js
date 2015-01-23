/*
 *  calentdar users.js
 *  package: /calendar/controllers
 *  DOC: 'articlos' collection controller
 *  Use:
 *     Exporta el objeto controller de un usero via 'exports'
 *     metodos exportados:
 *          open(); find(); findById; findAll; add(), update(); delete(); viewId
 *
 * Todo: cachear los usuarios activos para no leer de la base de datos en cada acceso.
    Ojo: Administrar el cache: ver c´mo

 */

var path = require('path');
var rootPath = path.normalize(__dirname + '/../..');

var utils = require(rootPath + '/core/util/utils');
var anyw  = require(rootPath + '/calendar/controllers/anyw');

var dbi ;
var BSON;
var config = {};
var usersCol = 'users';
var serialCol = 'seriales';
var MSGS = [
    'ERROR: No se pudo insertar el nodo en la base de datos',
    'ERROR: No se pudo borrar el nodo en la base de datos'
];

var userlist = {};
var getUserFromList = function(id){
    return userlist[id];
};
var setUserInList = function(id, user){
    console.log('updating USERLIST [%s] [%s]',user._id, user.username);
    userlist[id] = user;
};

var addNewUser = function(req, res, node){
    console.log("addNewUser:users.js ");
    insertNewUser(req,res,node);
};


var insertNewUser = function (req, res, user){
    console.log('insertNewUser:users.js BEGIN [%s]',user.username);
    //dbi.collection(usersCol, function(err, collection) {

    dbi.collection(usersCol).insert(user,{w:1}, function(err, result) {
            if (err) {
                res.send({'error':'An error has occurred'});
            } else {
                console.log('3.1. ADD: se inserto correctamente el nodo %s', JSON.stringify(result[0]));
                res.send(result[0]);
            }
        });
    //});
};

exports.setDb = function(db) {
    dbi = db;
    return this;
};

exports.setConfig = function(conf){
    config = conf;
    return this;
};

exports.setBSON = function(bs) {
    BSON = bs;
    return this;
};


exports.validPassword = function(currentUser, password) {
    //console.log('valid password BEGIN');
    if(!currentUser) return false;
    if(password === currentUser.password){
       //console.log('valid password TRUE');
       return true;
    }else{
       //console.log('valid password FALSE');
       return false;
    }
 };

exports.findOne = function(query, cb) {
    //console.log('findUser Retrieving user collection for passport');
    console.log("user/findOne [%s] [%s]", query, utils.anywModule());

    dbi.collection(usersCol, function(err, collection) {
        collection.findOne(query, function(err, item) {
            cb(err, item);
        });
    });
};

exports.fetchById = function(id, cb) {
    //console.log('findById: Retrieving %s id:[%s]', usersCol,id);
    var user = getUserFromList(id);
    if(user){
        //console.log('findById: USER FOUND in USER LIST');
        cb(null,user);
    } else {
        dbi.collection(usersCol, function(err, collection) {
            collection.findOne({'_id':new BSON.ObjectID(id)}, function(err, item) {
                console.log('findById: db findOne [%s]',item._id);
                if(utils.anywModule()){
                    anyw.auth(item.displayName, item.password, function(token){
                        item.anyw_token = token;
                        console.log('findById: Token [%s]',item.anyw_token);
                        setUserInList(id,item);
                        cb(err, item);
                    });
                }else{
                    setUserInList(id,item);
                    cb(err, item);
                }
            });
        });
    }
};

exports.findById = function(req, res) {
    var id = req.params.id;
    //console.log('findById: Retrieving %s id:[%s]', usersCol,id);
    dbi.collection(usersCol, function(err, collection) {
        collection.findOne({'_id':new BSON.ObjectID(id)}, function(err, item) {
            res.send(item);
        });
    });
};

exports.findCurrentUser = function(req, res) {
    var user = req.user;
    //console.log('findCurrentUser [%s]',user.username);
    res.send(user);


};

exports.find = function(req, res) {
    var query = req.body; //{};

    //console.log('find:user Retrieving user collection with query [%s]',query['es_usuario_de.id']);
    dbi.collection(usersCol, function(err, collection) {
        collection.find(query).sort({username:1}).toArray(function(err, items) {
            //console.log('recuperados [%s]',items.length)
            res.send(items);
        });
    });
};

exports.findAll = function(req, res) {
    //console.log('findAll: Retrieving all instances of [%s] collection', usersCol);
    dbi.collection(usersCol, function(err, collection) {
        collection.find().sort({username:1}).toArray(function(err, items) {
            res.send(items);
        });
    });
};

exports.add = function(req, res) {
    console.log('add:user.js: NEW USER BEGINS');
    var user = req.body;
    addNewUser(req, res, user);
};

exports.update = function(req, res) {
    var id = req.params.id;
    var user = req.body;
    delete user._id;
    //console.log('Updating node id:[%s] ',id);
    //console.log(JSON.stringify(user));
    dbi.collection(usersCol, function(err, collection) {
        collection.update({'_id':new BSON.ObjectID(id)}, user, {safe:true}, function(err, result) {
            if (err) {
                console.log('Error updating %s error: %s',usersCol,err);
                res.send({error: MSGS[0] + err});
            } else {
                console.log('UPDATE: se insertaron exitosamente [%s] nodos',result);
                user._id = id;
                setUserInList(id, user);
                res.send(user);
            }
        });
    });
};

exports.delete = function(req, res) {
    var id = req.params.id;
    console.log('Deleting node: [%s] ', id);
    dbi.collection(usersCol, function(err, collection) {
        collection.remove({'_id':new BSON.ObjectID(id)}, function(err, result) {
            if (err) {
                res.send({error: MSGS[1] + err});
            } else {
                console.log('DELETE: se eliminaron exitosamente [%s] nodos',result);
                res.send(req.body);
            }
        });
    });
};
