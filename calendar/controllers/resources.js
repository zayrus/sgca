/*
 *  calentdar resources.js
 *  package: /calendar/controllers
 *  DOC: Cada nodo representa un recurso requerido para el proyecto
 *       Este modulo contiene los 'controllers'
 *       para aplicar los metodos CRUD a una cierta entidad.
 *  Use:
 *     Exporta el objeto controller de un proyecto via 'exports'
 *     metodos exportados:
 *          open(); findById; findAll; add(), update(); delete()
 */
var dbi ;
var BSON;
var config = {};
var resourcesCol = 'resources';
var MSGS = [
    'ERROR: No se pudo insertar el nodo en la base de datos',
    'ERROR: No se pudo borrar el nodo en la base de datos'
];
exports.setDb = function(db) {
    dbi = db;
    return this;
};
exports.setBSON = function(bs) {
    BSON = bs;
    return this;
};
exports.setConfig = function(conf){
    config = conf;
    return this;
},

exports.findById = function(req, res) {
    var id = req.params.id;
    console.log('findById: Retrieving %s id:[%s]', resourcesCol,id);
    dbi.collection(resourcesCol, function(err, collection) {
        collection.findOne({'_id':new BSON.ObjectID(id)}, function(err, item) {
            res.send(item);
        });
    });
};

exports.find = function(req, res) {
    var query = req.body; //{};
    var logid =(query.project)?query.project._id:'null';
    console.log('find: Retrieving query:[%s]',logid);
    // for (var prop in req.body){
    //     query[prop] = req.body[prop];
    //    console.log('find3: prop %s value:[%s]', prop, req.body[prop]);
    // }
    //console.log('find4: Retrieving %s query:[%s]', resourcesCol,query.toString());
    dbi.collection(resourcesCol, function(err, collection) {
        collection.find(query).sort({rubro:1,slug:1}).toArray(function(err, items) {
            res.send(items);
        });
    });
};


exports.findAll = function(req, res) {
    console.log('findAll: Retrieving all instances of [%s] collection', resourcesCol);
    dbi.collection(resourcesCol, function(err, collection) {
        collection.find().sort({eventdate:1}).toArray(function(err, items) {
            res.send(items);
        });
    });
};

exports.add = function(req, res) {
    var resource = req.body;

    //console.log('Adding rq: [%s]', JSON.stringify(req));
    //console.log('Adding body: [%s]', JSON.stringify(resource));
    dbi.collection(resourcesCol, function(err, collection) {
        collection.insert(resource, function(err, result) {
            if (err) {
                res.send({'error':'An error has occurred'});
            } else {
                console.log('ADD: se inserto correctamente el nodo %s', JSON.stringify(result[0]));
                res.send(result[0]);
            }
        });
    });
}

exports.update = function(req, res) {
    var id = req.params.id;
    var resource = req.body;
    delete resource._id;
    console.log('Updating node id:[%s] ',id);
    console.log(JSON.stringify(resource));
    dbi.collection(resourcesCol, function(err, collection) {
        collection.update({'_id':new BSON.ObjectID(id)}, resource, function(err, result) {
            if (err) {
                console.log('Error updating %s error: %s',resourcesCol,err);
                res.send({error: MSGS[0] + err});
            } else {
                console.log('UPDATE: se insertaron exitosamente [%s] nodos',result);
                res.send(resource);
            }
        });
    });
}

exports.delete = function(req, res) {
    var id = req.params.id;
    console.log('Deleting node: [%s] ', id);
    dbi.collection(resourcesCol, function(err, collection) {
        collection.remove({'_id':new BSON.ObjectID(id)}, function(err, result) {
            if (err) {
                res.send({error: MSGS[1] + err});
            } else {
                console.log('DELETE: se eliminaron exitosamente [%s] nodos',result);
                res.send(req.body);
            }
        });
    });
}

