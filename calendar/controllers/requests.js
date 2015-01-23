/*
 *  calentdar requests.js
 *  package: /calendar/controllers
 *  DOC: Cada solicitud es un evento / solicitud / concurso / actividad planificada en
 *       la agenda. Este modulo contiene los 'controllers'
 *        para aplicar los metidos CRUD a una cierta entidad.
 *  Use:
 *     Exporta el objeto controller de un solicitud via 'exports'
 *     metodos exportados:
 *          open(); findById; findAll; add(), update(); delete()
 */
var dbi ;
var BSON;
var config = {};
var requestsCol = 'requests';
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
    console.log('findById: Retrieving %s id:[%s]', requestsCol,id);
    dbi.collection(requestsCol, function(err, collection) {
        collection.findOne({'_id':new BSON.ObjectID(id)}, function(err, item) {
            console.dir(item);
            res.send(item);
        });
    });
};

exports.find = function(req, res) {
    console.log('requests: find:');
    var query = req.body; //{};
    dbi.collection(requestsCol, function(err, collection) {
        collection.find(query).sort({eventdate:1}).toArray(function(err, items) {
            res.send(items);
        });
    });
};


exports.findAll = function(req, res) {
    console.log('findAll: Retrieving all instances of [%s] collection', requestsCol);
    dbi.collection(requestsCol, function(err, collection) {
        collection.find().sort({eventdate:1}).toArray(function(err, items) {
            res.send(items);
        });
    });
};

exports.add = function(req, res) {
    var request = req.body;

    //console.log('Adding rq: [%s]', JSON.stringify(req));
    //console.log('Adding body: [%s]', JSON.stringify(request));
    dbi.collection(requestsCol, function(err, collection) {
        collection.insert(request, function(err, result) {
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
    var request = req.body;
    delete request._id;
    console.log('Updating node id:[%s] ',id);
    console.log(JSON.stringify(request));
    dbi.collection(requestsCol, function(err, collection) {
        collection.update({'_id':new BSON.ObjectID(id)}, request, function(err, result) {
            if (err) {
                console.log('Error updating %s error: %s',requestsCol,err);
                res.send({error: MSGS[0] + err});
            } else {
                console.log('UPDATE: se insertaron exitosamente [%s] nodos',result);
                res.send(request);
            }
        });
    });
}

exports.delete = function(req, res) {
    var id = req.params.id;
    console.log('Deleting node: [%s] ', id);
    dbi.collection(requestsCol, function(err, collection) {
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

