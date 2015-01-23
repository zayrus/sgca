/*
 *  calentdar assets.js
 *  package: /calendar/controllers
 *  DOC: Cada 'activo' es recurso / activo / que fue subido al server
 *       puede ser un file de cualquier tipo y estar asociado a un proyecto
 *       o recurso.
 *        
 *  Use:
 *     Exporta el objeto controller de un activo via 'exports'
 *     metodos exportados:
 *          open(); findById; findAll; add(), update(); delete()
 */
var dbi ;
var BSON;
var config = {};
var assetsCol = 'assets';
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
};

exports.findById = function(req, res) {
    var id = req.params.id;
    console.log('assets:findById  Retrieving %s id:[%s]', assetsCol,id);
    dbi.collection(assetsCol, function(err, collection) {
        collection.findOne({'_id':new BSON.ObjectID(id)}, function(err, item) {
            res.send(item);
        });
    });
};

exports.renderImg = function(req, res) {
    var id = req.params.id;
    console.log('assets:renderImg  Retrieving %s id:[%s]', assetsCol,id);
    dbi.collection(assetsCol, function(err, collection) {
        collection.findOne({'_id':new BSON.ObjectID(id)}, function(err, item) {
            console.log('assets:renderById  Retrieving urlpath:[%s]', item.urlpath);
            res.redirect(item.urlpath);
        });
    });
};

exports.renderVideo = function(req, res) {
    var id = req.params.id;
    console.log('assets:renderVideo  Retrieving %s id:[%s]', assetsCol,id);
    dbi.collection(assetsCol).findOne({'_id':new BSON.ObjectID(id)}, function(err, item){
            console.log('assets:renderById  Retrieving urlpath:[%s]', item.urlpath);
            res.send({url: item.urlpath});
    });
};

exports.find = function(req, res) {
    console.log('assets: find:');
    var query = req.body; //{};
    dbi.collection(assetsCol, function(err, collection) {
        //ojo: sort
        collection.find(query).sort({name:1}).toArray(function(err, items) {
            res.send(items);
        });
    });
};


exports.findAll = function(req, res) {
    console.log('findAll: Retrieving all instances of [%s] collection', assetsCol);
    dbi.collection(assetsCol, function(err, collection) {
        //ojo: sort
        collection.find().sort({name:1}).toArray(function(err, items) {
            res.send(items);
        });
    });
};

exports.add = function(req, res) {
    console.log('add:assets.js');
    var asset = req.body;
    var query = {};
    query.name  = asset.name;
    query['es_asset_de'] = asset['es_asset_de'];

    //paso-add-1.01: verifico si ya existe un asset con la misma URI
    dbi.collection(assetsCol, function(err, collection) {
        collection.find(query).toArray(function(err, items) {
            if(items.length>0){
                console.log('add:assets: item found, ready to updateNode');
                updateNode(req, res, asset, items);
            }else{
                console.log('add:assets: item NOT found, ready to createNode');
                createNode(req, res, asset);
            }
        });
    });
};

var createNode = function(req, res, asset) {
    console.log('KreateNode:assets.js insert new node');
    dbi.collection(assetsCol, function(err, collection) {
        collection.insert(asset, function(err, result) {
            if (err) {
                res.send({'error':'An error has occurred'});
            } else {
                console.log('ADD: se inserto correctamente el nodo %s', JSON.stringify(result[0]));
                res.send(result[0]);
            }
        });
    });
};

var updateNode = function(req,res, newasset, items) {
    console.log('updateNode:assets.js ');
    var asset = items[0];
    var id = asset._id;

    console.log('update node: '+newasset.slug+' :['+newasset.urlpath+']');
   
    asset.urlpath = newasset.urlpath;
    asset.versions.push(newasset.versions[0]);

    dbi.collection(assetsCol, function(err, collection) {
        collection.update({'_id':asset._id}, asset, function(err, result) {
            if (err) {
                console.log('Error updating %s error: %s',assetsCol,err);
                res.send({error: MSGS[0] + err});
            } else {
                console.log('UPDATE: ASSE insertaron exitosamente [%s] nodos',result);
                res.send(asset);
            }
        });
    });
};

exports.update = function(req, res) {
    var id = req.params.id;
    var asset = req.body;
    delete asset._id;
    console.log('Updating node id:[%s] ',id);
    console.log(JSON.stringify(asset));
    dbi.collection(assetsCol, function(err, collection) {
        collection.update({'_id':new BSON.ObjectID(id)}, asset, function(err, result) {
            if (err) {
                console.log('Error updating %s error: %s',assetsCol,err);
                res.send({error: MSGS[0] + err});
            } else {
                console.log('UPDATE: se... insertaron exitosamente [%s] nodos',result);
                res.send(asset);
            }
        });
    });
}

exports.delete = function(req, res) {
    var id = req.params.id;
    console.log('Deleting node: [%s] ', id);
    dbi.collection(assetsCol, function(err, collection) {
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
//mgo modifique esta linea
