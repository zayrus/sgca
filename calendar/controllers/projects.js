/*
 *  calentdar projects.js
 *  package: /calendar/controllers
 *  DOC: Cada proyecto es un evento / proyecto / concurso / actividad planificada en
 *       la agenda. Este modulo contiene los 'controllers'
 *        para aplicar los metidos CRUD a una cierta entidad.
 *  Use:
 *     Exporta el objeto controller de un proyecto via 'exports'
 *     metodos exportados:
 *          open(); findById; findAll; add(), update(); delete()
 */
var dbi ;
var BSON;
var config = {};
var projectsCol = 'projects';
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
    console.log('findById: Retrieving %s id:[%s]', projectsCol,id);
    dbi.collection(projectsCol, function(err, collection) {
        collection.findOne({'_id':new BSON.ObjectID(id)}, function(err, item) {
            res.send(item);
        });
    });
};

exports.find = function(req, res) {
    console.log('projects: find:');
    var query = req.body; //{};
    dbi.collection(projectsCol, function(err, collection) {
        collection.find(query).sort({eventdate:1}).toArray(function(err, items) {
            res.send(items);
        });
    });
};


exports.findAll = function(req, res) {
    console.log('findAll: Retrieving all instances of [%s] collection', projectsCol);
    dbi.collection(projectsCol, function(err, collection) {
        collection.find().sort({eventdate:1}).toArray(function(err, items) {
            res.send(items);
        });
    });
};

exports.add = function(req, res) {
    var project = req.body;

    //console.log('Adding rq: [%s]', JSON.stringify(req));
    //console.log('Adding body: [%s]', JSON.stringify(project));
    dbi.collection(projectsCol, function(err, collection) {
        collection.insert(project, function(err, result) {
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
    var project = req.body;
    delete project._id;
    console.log('Updating node id:[%s] ',id);
    console.log(JSON.stringify(project));
    dbi.collection(projectsCol, function(err, collection) {
        collection.update({'_id':new BSON.ObjectID(id)}, project, function(err, result) {
            if (err) {
                console.log('Error updating %s error: %s',projectsCol,err);
                res.send({error: MSGS[0] + err});
            } else {
                console.log('UPDATE: se insertaron exitosamente [%s] nodos',result);
                res.send(project);
            }
        });
    });
}

exports.delete = function(req, res) {
    var id = req.params.id;
    console.log('Deleting node: [%s] ', id);
    dbi.collection(projectsCol, function(err, collection) {
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

