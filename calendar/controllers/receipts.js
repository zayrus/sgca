/*
 *  calendar receipts.js
 *  package: /calendar/controllers
 *  DOC: 'receipts' collection controller
 *  Use:
 *     Exporta el objeto controller de un receipto via 'exports'
 *     metodos exportados:
 *          open(); find(); findById; findAll; add(), update(); delete(); viewId
 *
 */
var dbi ;
var BSON;
var config = {};
var receiptsCol = 'receipts';
var serialCol = 'seriales';
var MSGS = [
    'ERROR: No se pudo insertar el nodo en la base de datos',
    'ERROR: No se pudo borrar el nodo en la base de datos'
];

//ATENCION: para agregar un serial, agregar entrada en tcomp_adapter y en series;
var series = ['rent101','rsal101','ptec101','nemi101','nped101','gcom101','pdia101','nsol101'];

var seriales = {};

//ATENCION: para agregar un serial, agregar entrada en tcomp_adapter y en series;
var tcomp_adapter = {
    nrecepcion:{
        serie: 'rent101',
        base: 100000,
        prefix: 'R'
        },
    nsolicitud:{
        serie: 'nsol101',
        base: 100000,
        prefix: 'M'
        },
    nentrega: {
        serie: 'rsal101',
        base: 100000,
        prefix:'S'
        },
    npedido: {
        serie: 'nped101',
        base: 100000,
        prefix: 'P'
        },
    ptecnico: {
        serie: 'ptec101',
        base: 100000,
        prefix: 'T'
        },
    pemision: {
        serie: 'nemi101',
        base: 100000,
        prefix: 'E'
        },
    pdiario: {
        serie: 'pdia101',
        base: 100000,
        prefix: 'D'
        },
    poromision: {
        serie: 'gcom101',
        base: 100000,
        prefix: 'X'
        }
};

var loadSeriales = function(){
    for(var key in series){
        fetchserial(series[key]);
    }
};

var fetchserial = function(serie){
    //console.log("INIT:fetchserie:receipt.js:[%s]",serie);
    var collection = dbi.collection(serialCol);
    collection.findOne({'serie':serie}, function(err, item) {
        if(!item){
            console.log('INIT:fetchserial:serial not found: [%s]',serie);
            item = initSerial(serie);

            collection.insert(item, {safe:true}, function(err, result) {
                if (err) {
                    console.log('Error initializing  [%s] error: %s',serialCol,err);
                } else {
                    console.log('NEW serial: se inserto nuevo [%s] [%s] nodos',serialCol,result);
                    addSerial(serie,result[0]);
                }
            });
        }else{
            addSerial(serie,item);
        }  
    });
};

var addSerial = function(serial,data){
    seriales[serial] = data;
    //console.log('addSerial:receipt.js INIT con exito: [%s] next:[%s]',seriales[serial].serie,seriales[serial].nextnum);
};

var initSerial = function(serie){
    var serial ={
        _id: null,
        serie: serie,
        nextnum: 1,
        feUltMod: new Date()
    };
    return serial;
};

var updateSerialCollection = function(serial){
    var collection = dbi.collection(serialCol);    
    collection.update( {'_id':serial._id}, serial,{w:1},function(err,result){});
};


var setNodeCode = function(node){
    console.log('setNodeCode:[%s]',node.tipocomp);
    var adapter = tcomp_adapter[node.tipocomp] || tcomp_adapter['poromision'];
    node.cnumber = nextSerial(adapter);

};

var nextSerial = function (adapter){
    var serie = adapter.serie;
    var nxt = seriales[serie].nextnum + adapter.base;
    seriales[serie].nextnum += 1;
    seriales[serie].feUltMod = new Date();
    //
    updateSerialCollection(seriales[serie]);
    //
    return adapter.prefix + nxt;
};

var addNewReceipt = function(req, res, node, cb){
    console.log("addNewReceipt:receipts.js ");

    setNodeCode(node);
    insertNewReceipt(req, res, node, cb);
};


var fetchOne = function(query, cb) {
    console.log('findReceipt Retrieving receipt collection for passport');

    dbi.collection(receiptsCol, function(err, collection) {
        collection.findOne(query, function(err, item) {
            cb(err, item);
        });
    });
};

var insertNewReceipt = function (req, res, receipt, cb){
    console.log('insertNewReceipt:receipts.js BEGIN [%s]',receipt.slug);
    //dbi.collection(receiptsCol, function(err, collection) {

    dbi.collection(receiptsCol).insert(receipt,{w:1}, function(err, result) {
            if (err) {
                if(res){
                    res.send({'error':'An error has occurred'});
                }else if(cb){
                    cb({'error':'An error has occurred'})
                }
            } else {
                if(res){
                    console.log('3.1. ADD: se inserto correctamente el nodo %s', JSON.stringify(result[0]));
                    res.send(result[0]);
                }else if(cb){
                    cb({'model':result[0]})
                }
            }
        });
    //});
};

exports.setDb = function(db) {
    dbi = db;
    loadSeriales();
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

exports.findOne = function(req, res) {
    var query = req.body;


    var sort = {cnumber: 1};
    if (query.cnumber['$lt']) sort = {cnumber: -1};

    console.log('findONE:receipt Retrieving receipt collection with query [%s] sort:[%s]',query.cnumber, sort.cnumber);
 
    dbi.collection(receiptsCol, function(err, collection) {
        collection.find   (query).sort(sort).toArray(function(err, items) {
            res.send(items[0]);
        });
    });
};

exports.fetchById = function(id, cb) {
    console.log('findById: Retrieving %s id:[%s]', receiptsCol,id);
    dbi.collection(receiptsCol, function(err, collection) {
        collection.findOne({'_id':new BSON.ObjectID(id)}, function(err, item) {
            cb(err, item);
        });
    });
};

exports.findById = function(req, res) {
    var id = req.params.id;
    console.log('findById: Retrieving %s id:[%s]', receiptsCol,id);
    dbi.collection(receiptsCol, function(err, collection) {
        collection.findOne({'_id':new BSON.ObjectID(id)}, function(err, item) {
            res.send(item);
        });
    });
};

exports.find = function(req, res) {
    var query = req.body; //{};

    console.log('find:receipt Retrieving receipt collection with query');

    dbi.collection(receiptsCol, function(err, collection) {
        collection.find(query).sort({cnumber:1}).toArray(function(err, items) {
            res.send(items);
        });
    });
};

exports.findAll = function(req, res) {
    console.log('findAll: Retrieving all instances of [%s] collection', receiptsCol);
    dbi.collection(receiptsCol, function(err, collection) {
        collection.find().sort({cnumber:1}).toArray(function(err, items) {
            res.send(items);
        });
    });
};

exports.createNew = function(docum, cb) {
    console.log('createNew:receipt.js: NEW RECEIPT BEGINS');
    addNewReceipt(null, null, docum, cb);
};

exports.add = function(req, res) {
    console.log('add:receipt.js: NEW RECEIPT BEGINS');
    var receipt = req.body;
    addNewReceipt(req, res, receipt);
};

exports.update = function(req, res) {
    var id = req.params.id;
    var receipt = req.body;
    delete receipt._id;
    console.log('Updating node id:[%s] ',id);
    console.log(JSON.stringify(receipt));
    dbi.collection(receiptsCol, function(err, collection) {
        collection.update({'_id':new BSON.ObjectID(id)}, receipt, {safe:true}, function(err, result) {
            if (err) {
                console.log('Error updating %s error: %s',receiptsCol,err);
                res.send({error: MSGS[0] + err});
            } else {
                console.log('UPDATE: se insertaron exitosamente [%s] nodos',result);
                res.send(receipt);
            }
        });
    });
};

var buildTargetNodes = function(data){
    if(!data.nodes) return;
    var list = [];
    var nodes = data.nodes;
    for (var i = 0; i<nodes.length; i++){
        var node = {};
        var id = nodes[i];

        console.log('buildTargetNodes: [%s] [%s]', id, typeof id);
        node._id = new BSON.ObjectID(id);
        list.push(node);
    }
    if(list.length){
        var query = {$or: list};
        return query
    }
};
var buildUpdateData = function(data){
    if(!data.newdata) return;
    return data.newdata;
}

exports.partialupdate = function(req, res, data, cb) {
    if (req){
        data = req.body;
    }
    var query = buildTargetNodes(data);
    var update = buildUpdateData(data);


    console.log('UPDATING partial fields nodes:[%s] data length[%s]', query.$or[0]._id , update.items.length);
    //res.send({query:query, update:update});

    dbi.collection(receiptsCol).update(query, {$set: update}, {safe:true, multi:true}, function(err, result) {
        if (err) {
            console.log('Error partial updating %s error: %s',receiptsCol,err);
            if(res){
                res.send({error: MSGS[0] + err});
            }else if(cb){
                cb({error: MSGS[0] + err});
            }

        } else {
            console.log('UPDATE: partial update success [%s] nodos',result);
            if(res){
                res.send({result: result});
            }else if(cb){
                cb({result: result});
            }
        }
    })
};

exports.delete = function(req, res) {
    var id = req.params.id;
    console.log('Deleting node: [%s] ', id);
    dbi.collection(receiptsCol, function(err, collection) {
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
