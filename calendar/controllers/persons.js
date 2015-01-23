/*
 *  calentdar persons.js
 *  package: /calendar/controllers
 *  DOC: 'articlos' collection controller
 *  Use:
 *     Exporta el objeto controller de un persono via 'exports'
 *     metodos exportados:
 *          open(); find(); findById; findAll; add(), update(); delete(); viewId
 *
 * Todo: cachear los personas activos para no leer de la base de datos en cada acceso.
    Ojo: Administrar el cache: ver c´mo

 */
var dbi ;
var BSON;
var config = {};
var personsCol = 'persons';
var serialCol = 'seriales';
var MSGS = [
    'ERROR: No se pudo insertar el nodo en la base de datos',
    'ERROR: No se pudo borrar el nodo en la base de datos'
];
//ATENCION: para agregar un serial, agregar entrada en tpr_adapter y en series;

//ATENCION: para agregar un serial, agregar entrada en tpr_adapter y en series;


var addNewPerson = function(req, res, node){
    console.log("addNewPerson:persons.js ");

    insertNewPerson(req,res,node);
};


var insertNewPerson = function (req, res, person){
    console.log('insertNewPerson:persons.js BEGIN [%s]',person.name);
    //dbi.collection(personsCol, function(err, collection) {

    dbi.collection(personsCol).insert(person,{w:1}, function(err, result) {
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


exports.findOne = function(query, cb) {
    console.log('findPerson Retrieving person collection for passport');

    dbi.collection(personsCol, function(err, collection) {
        collection.findOne(query, function(err, item) {
            cb(err, item);
        });
    });
};

exports.fetchById = function(id, cb) {
    console.log('findById: Retrieving %s id:[%s]', personsCol,id);
    dbi.collection(personsCol, function(err, collection) {
        collection.findOne({'_id':new BSON.ObjectID(id)}, function(err, item) {
            cb(err, item);
        });
    });
};

exports.findById = function(req, res) {
    var id = req.params.id;
    console.log('findById: Retrieving %s id:[%s]', personsCol,id);
    dbi.collection(personsCol, function(err, collection) {
        collection.findOne({'_id':new BSON.ObjectID(id)}, function(err, item) {
            res.send(item);
        });
    });
};

exports.find = function(req, res) {
    var query = req.body; //{};
    query = normaliseQuery(query);

    // console.log('find:person Retrieving person collection with query');
    console.dir(query);
    // res.send(query);

    dbi.collection(personsCol, function(err, collection) {
        collection.find(query).sort({personname:1}).toArray(function(err, items) {
            res.send(items);
        });
    });
};

var normaliseQuery = function(query){
    var tipojuridico = {
        pfisica: (query.pfisica==='true' ? true: false),
        pjuridica: (query.pjuridica==='true' ? true: false),
        pideal:(query.pideal==='true' ? true: false),
        porganismo:(query.porganismo==='true' ? true: false),
    };

    console.log('pjuridica: tipojuridico[%s] aderente[%s] fisico[%s]',query.queryjuridico, query.adherente, query.pfisica);
    if(query.queryjuridico === 'true'){
        query.tipojuridico = tipojuridico;
    }else{
        delete query.tipojuridico;
        delete query['roles.adherente'];
    }
    delete query.queryjuridico;
    delete query.pfisica;
    delete query.pjuridica;
    delete query.pideal;
    delete query.porganismo;

    if(query.adherente==='true') query['roles.adherente'] = true;
    delete query.adherente;


    /*
    if(query.hasOwnProperty('pjuridica')) {
        console.log('pjuridica: [%s] [%s] [%s]',query.pjuridica, query.pjuridica === 'true', query.pjuridica === true);
        query['tipojuridico.pjuridica'] = (query.pjuridica==='true' ? true: false);
        delete query.pjuridica;
    };
    if(query.hasOwnProperty('pfisica')) {
        query['tipojuridico.pfisica'] = (query.pfisica==='true' ? true: false);
        delete query.pfisica;
    };
    if(query.hasOwnProperty('pideal')) {
        query['tipojuridico.pideal'] = (query.pideal==='true' ? true: false);
        delete query.pideal;
    };*/
    return query;
};

exports.findAll = function(req, res) {
    console.log('findAll: Retrieving all instances of [%s] collection', personsCol);
    dbi.collection(personsCol, function(err, collection) {
        collection.find().sort({personname:1}).toArray(function(err, items) {
            res.send(items);
        });
    });
};

exports.add = function(req, res) {
    console.log('add:person.js: NEW PRODUCT BEGINS');
    var person = req.body;
    addNewPerson(req, res, person);
};

exports.update = function(req, res) {
    var id = req.params.id;
    var person = req.body;
    delete person._id;
    console.log('Updating node id:[%s] ',id);
    console.log(JSON.stringify(person));
    dbi.collection(personsCol, function(err, collection) {
        collection.update({'_id':new BSON.ObjectID(id)}, person, {safe:true}, function(err, result) {
            if (err) {
                console.log('Error updating %s error: %s',personsCol,err);
                res.send({error: MSGS[0] + err});
            } else {
                console.log('UPDATE: se insertaron exitosamente [%s] nodos',result);
                res.send(person);
            }
        });
    });
};

exports.importNewPerson = function(person, cb) {
    dbi.collection(personsCol).insert(person,{w:1}, function(err, result) {
            if (err){
                if(cb) cb({'error':'An error has occurred'})
            } else {
                if(cb){
                    //console.log('3.1. ADD: se inserto correctamente el nodo [%s]  [%s] ', result[0]['_id'], JSON.stringify(result[0]['_id'].str));
                    cb({'model':result[0]})
                }
            }
        });
};

exports.delete = function(req, res) {
    var id = req.params.id;
    console.log('Deleting node: [%s] ', id);
    dbi.collection(personsCol, function(err, collection) {
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
