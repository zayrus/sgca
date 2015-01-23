/*
 *  calendar budgets.js
 *  package: /calendar/controllers
 *  DOC: 'budgets' collection controller
 *  Use:
 *     Exporta el objeto controller de un budget via 'exports'
 *     metodos exportados:
 *          open(); find(); findById; findAll; add(), update(); delete(); viewId
 *
 */
var dbi ;
var BSON;
var config = {};
var budgetsCol = 'budgets';
var serialCol = 'seriales';
var MSGS = [
    'ERROR: No se pudo insertar el nodo en la base de datos',
    'ERROR: No se pudo borrar el nodo en la base de datos'
];

var series = ['budget101'];

var seriales = {};

//ATENCION: para agregar un serial, agregar entrada en taction_adapter y en series;
var taction_adapter = {
    presupuesto:{
        serie: 'budget101',
        base: 1000000,
        prefix: 'PRE'
        },
    poromision: {
        serie: 'budget999',
        base: 1000000,
        prefix: 'X'
    }

};

var loadSeriales = function(){
    for(var key in series){
        fetchserial(series[key]);
    }
};

var fetchserial = function(serie){
    //console.log("INIT:fetchserie:action.js:[%s]",serie);
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
    //console.log('addSerial:action.js INIT con exito: [%s] next:[%s]',seriales[serial].serie,seriales[serial].nextnum);
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
    //console.log('setNodeCode:[%s]',node.tregistro);
    var adapter = taction_adapter['presupuesto'] || taction_adapter['poromision'];
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

var addNewBudget = function(req, res, node, cb){
    console.log("addNewBudget:budgets.js ");

    setNodeCode(node);
    
    insertNewBudget(req, res, node, cb);
};


var fetchOne = function(query, cb) {
    //console.log('findBudget Retrieving budget collection for passport');

    dbi.collection(budgetsCol, function(err, collection) {
        collection.findOne(query, function(err, item) {
            cb(err, item);
        });
    });
};

var insertNewBudget = function (req, res, budget, cb){
    //console.log('insertNewBudget:budgets.js BEGIN [%s]',budget.slug);
    //dbi.collection(budgetsCol, function(err, collection) {

    dbi.collection(budgetsCol).insert(budget,{w:1}, function(err, result) {
            if (err) {
                if(res){
                    res.send({'error':'An error has occurred'});
                }else if(cb){
                    cb({'error':'An error has occurred'})
                }
            } else {
                if(res){
                    //console.log('3.1. ADD: se inserto correctamente el nodo %s', JSON.stringify(result[0]));
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

    //console.log('findONE:budget Retrieving budget collection with query [%s] sort:[%s]',query.cnumber, sort.cnumber);
 
    dbi.collection(budgetsCol, function(err, collection) {
        collection.find   (query).sort(sort).toArray(function(err, items) {
            res.send(items[0]);
        });
    });
};

exports.fetchById = function(id, cb) {
    console.log('findById: Retrieving %s id:[%s]', budgetsCol,id);
    dbi.collection(budgetsCol, function(err, collection) {
        collection.findOne({'_id':new BSON.ObjectID(id)}, function(err, item) {
            cb(err, item);
        });
    });
};

exports.findById = function(req, res) {
    var id = req.params.id;
    console.log('findById: Retrieving %s id:[%s]', budgetsCol,id);
    dbi.collection(budgetsCol, function(err, collection) {
        collection.findOne({'_id':new BSON.ObjectID(id)}, function(err, item) {
            res.send(item);
        });
    });
};

exports.find = function(req, res) {
    var query = req.body; //{};
    //console.dir(query);

    dbi.collection(budgetsCol).find(query).toArray(function(err, items) {
            res.send(items);
    });
};

exports.findAll = function(req, res) {
    //console.log('findAll: Retrieving all instances of [%s] collection', budgetsCol);
    dbi.collection(budgetsCol, function(err, collection) {
        collection.find().sort({cnumber:1}).toArray(function(err, items) {
            res.send(items);
        });
    });
};

exports.createNew = function(docum, cb) {
    //console.log('createNew:budget.js: NEW RECEIPT BEGINS');
    addNewBudget(null, null, docum, cb);
};

exports.add = function(req, res) {
    //console.log('add:budget.js: NEW RECEIPT BEGINS');
    var budget = req.body;
    addNewBudget(req, res, budget);
};

exports.update = function(req, res) {
    var id = req.params.id;
    var budget = req.body;
    delete budget._id;
    console.log('Updating node id:[%s] ',id);
    console.log(JSON.stringify(budget));
    dbi.collection(budgetsCol, function(err, collection) {
        collection.update({'_id':new BSON.ObjectID(id)}, budget, {safe:true}, function(err, result) {
            if (err) {
                console.log('Error updating %s error: %s',budgetsCol,err);
                res.send({error: MSGS[0] + err});
            } else {
                console.log('UPDATE: se insertaron exitosamente [%s] nodos',result);
                res.send(budget);
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

exports.partialupdate = function(req, res) {
    if (req){
        data = req.body;
    }
    var query = buildTargetNodes(data);
    var update = buildUpdateData(data);


    console.log('UPDATING partial fields nodes:[%s]', query.$or[0]._id );
    //res.send({query:query, update:update});

    dbi.collection(budgetsCol).update(query, {$set: update}, {safe:true, multi:true}, function(err, result) {
        if (err) {
            console.log('Error partial updating %s error: %s',budgetsCol,err);
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
    dbi.collection(budgetsCol, function(err, collection) {
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


exports.importNewBudget = function (data, cb){

    addNewBudget(null, null, data, cb);
    //});
};


