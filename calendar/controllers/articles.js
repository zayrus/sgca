/*
 *  calentdar articles.js
 *  package: /calendar/controllers
 *  DOC: 'articlos' collection controller
 *  Use:
 *     Exporta el objeto controller de un producto via 'exports'
 *     metodos exportados:
 *          open(); find(); findById; findAll; add(), update(); delete(); viewId
 */
var dbi ;
var BSON;
var config = {};
var articlesCol = 'articles';
var serialCol = 'seriales';
var MSGS = [
    'ERROR: No se pudo insertar el nodo en la base de datos',
    'ERROR: No se pudo borrar el nodo en la base de datos'
];
//ATENCION: para agregar un serial, agregar entrada en tpr_adapter y en series;

//ATENCION: para agregar un serial, agregar entrada en tpr_adapter y en series;


var addNewArticle = function(req, res, pr){
    console.log("addNewArticle:articles.js ["+pr.tipoproducto+"]");

    insertNewArticle(req,res,pr);
};


var insertNewArticle = function (req, res, product){
    console.log('insertNewArticle:articles.js BEGIN');
    //dbi.collection(articlesCol, function(err, collection) {

    dbi.collection(articlesCol).insert(product,{w:1}, function(err, result) {
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


exports.findById = function(req, res) {
    var id = req.params.id;
    console.log('findById: Retrieving %s id:[%s]', articlesCol,id);
    dbi.collection(articlesCol, function(err, collection) {
        collection.findOne({'_id':new BSON.ObjectID(id)}, function(err, item) {
            res.send(item);
        });
    });
};

exports.find = function(req, res) {
    var query = req.body; //{};

    console.log('find:product Retrieving product collection with query');

    dbi.collection(articlesCol, function(err, collection) {
        collection.find(query).sort({slug:1}).toArray(function(err, items) {
            res.send(items);
        });
    });
};

exports.findAll = function(req, res) {
    console.log('findAll: Retrieving all instances of [%s] collection', articlesCol);
    dbi.collection(articlesCol, function(err, collection) {
        collection.find().sort({slug:1}).toArray(function(err, items) {
            res.send(items);
        });
    });
};

exports.add = function(req, res) {
    console.log('add:product.js: NEW PRODUCT BEGINS');
    var product = req.body;
    addNewArticle(req, res, product);
};

exports.update = function(req, res) {
    var id = req.params.id;
    var product = req.body;
    delete product._id;
    console.log('Updating node id:[%s] ',id);
    console.log(JSON.stringify(product));
    dbi.collection(articlesCol, function(err, collection) {
        collection.update({'_id':new BSON.ObjectID(id)}, product, {safe:true}, function(err, result) {
            if (err) {
                console.log('Error updating %s error: %s',articlesCol,err);
                res.send({error: MSGS[0] + err});
            } else {
                console.log('UPDATE: se insertaron exitosamente [%s] nodos',result);
                res.send(product);
            }
        });
    });
};

exports.delete = function(req, res) {
    var id = req.params.id;
    console.log('Deleting node: [%s] ', id);
    dbi.collection(articlesCol, function(err, collection) {
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
