/*
 *  calentdar quotations.js
 *  package: /calendar/controllers
 *  DOC: 'quotations' collection controller
 *       Cada nodo representa una solicitud de cotizacion asociado al proyecto
 *       Este modulo contiene los 'controllers'
 *       para aplicar los metodos CRUD.
 *  Use:
 *     Exporta el objeto controller de un proyecto via 'exports'
 *     metodos exportados:
 *          open(); find(); findById; findAll; add(), update(); delete(); viewId
 */
var dbi ;
var BSON;
var config = {};
var quotationsCol = 'quotations';
var MSGS = [
    'ERROR: No se pudo insertar el nodo en la base de datos',
    'ERROR: No se pudo borrar el nodo en la base de datos'
];
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


exports.viewId = function(req, res) {
    var id = req.params.id;
    //console.log('viewId: Retrieving %s id:[%s]', quotationsCol,id);
    //console.log(config.publicpath + '/requisitoria.html');

    //res.sendfile(config.publicpath + '/requisitoria.html');
};

exports.findById = function(req, res) {
    var id = req.params.id;
    console.log('findById: Retrieving %s id:[%s]', quotationsCol,id);
    dbi.collection(quotationsCol, function(err, collection) {
        collection.findOne({'_id':new BSON.ObjectID(id)}, function(err, item) {
            res.send(item);
        });
    });
};

exports.find = function(req, res) {
    var query = req.body; //{};
    console.log('find: Retrieving query:[%s]',((query.project)?query.project._id:'null'));
    dbi.collection(quotationsCol, function(err, collection) {
        collection.find(query).sort({slug:1}).toArray(function(err, items) {
            res.send(items);
        });
    });
};

exports.findAll = function(req, res) {
    console.log('findAll: Retrieving all instances of [%s] collection', quotationsCol);
    dbi.collection(quotationsCol, function(err, collection) {
        collection.find().sort({slug:1}).toArray(function(err, items) {
            res.send(items);
        });
    });
};

exports.add = function(req, res) {
    var quotation = req.body;
    dbi.collection(quotationsCol, function(err, collection) {
        collection.insert(quotation, function(err, result) {
            if (err) {
                res.send({'error':'An error has occurred'});
            } else {
                console.log('ADD: se inserto correctamente el nodo %s', JSON.stringify(result[0]));
                res.send(result[0]);
            }
        });
    });
};

exports.update = function(req, res) {
    var id = req.params.id;
    var quotation = req.body;
    delete quotation._id;
    console.log('Updating node id:[%s] ',id);
    console.log(JSON.stringify(quotation));
    dbi.collection(quotationsCol, function(err, collection) {
        collection.update({'_id':new BSON.ObjectID(id)}, quotation, function(err, result) {
            if (err) {
                console.log('Error updating %s error: %s',quotationsCol,err);
                res.send({error: MSGS[0] + err});
            } else {
                console.log('UPDATE: se insertaron exitosamente [%s] nodos',result);
                res.send(quotation);
            }
        });
    });
};

exports.delete = function(req, res) {
    var id = req.params.id;
    console.log('Deleting node: [%s] ', id);
    dbi.collection(quotationsCol, function(err, collection) {
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
