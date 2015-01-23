/*
 *  calendar actions.js
 *  package: /calendar/controllers
 *  DOC: 'actions' collection controller
 *  Use:
 *     Exporta el objeto controller de un action via 'exports'
 *     metodos exportados:
 *          open(); find(); findById; findAll; add(), update(); delete(); viewId
 *
 */
var _ = require('underscore');

var dbi ;
var BSON;
var config = {};
var actionsCol = 'actions';
var budgetsCol = 'budgets';
var serialCol = 'seriales';

var _ = require('underscore');


var MSGS = [
    'ERROR: No se pudo insertar el nodo en la base de datos',
    'ERROR: No se pudo borrar el nodo en la base de datos'
];

//ATENCION: para agregar un serial, agregar entrada en taction_adapter y en series;
var series = ['action101','action102','action103'];

var seriales = {};

//ATENCION: para agregar un serial, agregar entrada en taction_adapter y en series;
var taction_adapter = {
    accion:{
        serie: 'action101',
        base: 1000000,
        prefix: 'A'
        },
    programa:{
        serie: 'action102',
        base: 1000000,
        prefix: 'P'
        },
    actividad: {
        serie: 'action103',
        base: 1000000,
        prefix:'T'
        },
    poromision: {
        serie: 'action999',
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
    var adapter = taction_adapter[node.tregistro] || taction_adapter['poromision'];
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

var addNewAction = function(req, res, node, cb){
    //console.log("addNewAction:actions.js ");

    setNodeCode(node);
    insertNewAction(req, res, node, cb);
};


var fetchOne = function(query, cb) {
    console.log('findAction Retrieving action collection for passport');

    dbi.collection(actionsCol, function(err, collection) {
        collection.findOne(query, function(err, item) {
            cb(err, item);
        });
    });
};

var insertNewAction = function (req, res, action, cb){
    //console.log('insertNewAction:actions.js BEGIN [%s]',action.slug);
    //dbi.collection(actionsCol, function(err, collection) {

    dbi.collection(actionsCol).insert(action,{w:1}, function(err, result) {
            if (err) {
                if(res){
                    res.send({'error':'An error has occurred'});
                }else if(cb){
                    cb({'error':'An error has occurred:' + err})
                }
            } else {
                if(res){
                    console.log('3.1. ADD: se inserto correctamente el nodo %s', JSON.stringify(result[0]));
                    res.send(result[0]);
                }else if(cb){
                    console.log('3.1. ADD: se inserto correctamente el nodo [%s]  [%s] ', result[0]['_id'], JSON.stringify(result[0]['_id'].str));
                    cb({'model':result[0]})
                }
            }
        });
    //});
};

exports.setDb = function(db) {
    //console.log('***** Action setDB*******');
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

    console.log('findONE:action Retrieving action collection with query [%s] sort:[%s]',query.cnumber, sort.cnumber);
 
    dbi.collection(actionsCol, function(err, collection) {
        collection.find   (query).sort(sort).toArray(function(err, items) {
            res.send(items[0]);
        });
    });
};

exports.fetchById = function(id, cb) {
    console.log('findById: Retrieving %s id:[%s]', actionsCol,id);
    dbi.collection(actionsCol, function(err, collection) {
        collection.findOne({'_id':new BSON.ObjectID(id)}, function(err, item) {
            cb(err, item);
        });
    });
};

exports.findById = function(req, res) {
    var id = req.params.id;
    console.log('findById: Retrieving %s id:[%s]', actionsCol,id, req.user);
    dbi.collection(actionsCol, function(err, collection) {
        collection.findOne({'_id':new BSON.ObjectID(id)}, function(err, item) {
            res.send(item);
        });
    });
};

exports.find = function(req, res) {
    var query = req.body; //{};

    console.log('find:action Retrieving action collection with query');

    dbi.collection(actionsCol, function(err, collection) {
        collection.find(query).sort({cnumber:1}).toArray(function(err, items) {
            res.send(items);
        });
    });
};

exports.findAll = function(req, res) {
    console.log('findAll: Retrieving all instances of [%s] collection', actionsCol);
    dbi.collection(actionsCol, function(err, collection) {
        collection.find().sort({cnumber:1}).toArray(function(err, items) {
            res.send(items);
        });
    });
};

exports.createNew = function(docum, cb) {
    console.log('createNew:action.js: NEW RECEIPT BEGINS');
    addNewAction(null, null, docum, cb);
};

exports.add = function(req, res) {
    console.log('add:action.js: NEW RECEIPT BEGINS');
    var action = req.body;
    addNewAction(req, res, action);
};

exports.update = function(req, res) {
    var id = req.params.id;
    var action = req.body;
    delete action._id;
    console.log('Updating node id:[%s] ',id);
    console.log(JSON.stringify(action));
    dbi.collection(actionsCol, function(err, collection) {
        collection.update({'_id':new BSON.ObjectID(id)}, action, {safe:true}, function(err, result) {
            if (err) {
                console.log('Error updating %s error: %s',actionsCol,err);
                res.send({error: MSGS[0] + err});
            } else {
                console.log('UPDATE: se insertaron exitosamente [%s] nodos',result);
                res.send(action);
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
};

exports.fetchActionBudgetCol = function(req, res){
    var resultCol,
        query = buildQuery(req.body);

    console.log('fetchActionBudgetCol BEGIN')
    console.dir(query);

    dbi.collection(actionsCol).find(query).sort({cnumber:1}).toArray(function(err, actItems) {
        dbi.collection(budgetsCol).find().sort({owner_id:1}).toArray(function(err, budItems) {
            resultCol = loadActionBudgetCol(actItems, budItems);
            res.send(resultCol);
        });
    });
};
var buildQuery = function(qr){
    var query = {}; 
    if(!qr) return query;
    if(qr.areas){
        query.$or = buildAreaList(qr.areas);
    }
    return query;
};
var buildAreaList = function(areas){
    return _.map(areas, function(item){
        return {area: item};

    });
}

var loadActionBudgetCol = function(actions, budgets){
    var resultCol = [],
        budgetsGroup = _.groupBy(budgets, 'owner_id');

    _.each(actions, function(action){
        _.each(budgetsGroup[action._id], function(budget){
            budget.parent_action = action;
            resultCol.push(budget);
        });

    })

    console.log('resultCol leng[%s]', resultCol.length);
    return resultCol;
};



exports.partialupdate = function(req, res) {
    if (req){
        data = req.body;
    }
    var query = buildTargetNodes(data);
    var update = buildUpdateData(data);


    console.log('UPDATING partial fields nodes:[%s]', query.$or[0]._id );
    //res.send({query:query, update:update});

    dbi.collection(actionsCol).update(query, {$set: update}, {safe:true, multi:true}, function(err, result) {
        if (err) {
            console.log('Error partial updating %s error: %s',actionsCol,err);
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
    dbi.collection(actionsCol, function(err, collection) {
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


/*
var fetchActions = function(query, cb) {
    console.log('fetchActions: retrieven Actions Col');

    dbi.collection(actionsCol, function(err, collection) {
        collection.find(query).sort({cnumber:1}).toArray(function(err, items) {
            cb(items);
        });
    });
};

var buildActionBudgetCol = function(query, cb){
    fetchActions(query, function(actionsCol){
        

    });

};

*/
exports.importNewAction = function (data, cb){

    addNewAction(null, null, data, cb);
    //});
};




