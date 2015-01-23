/*
 *
 */
var dbi ;
var BSON;
var config = {};
var reportsCol = 'reports';
var serialCol = 'seriales';

var MSGS = [
    'ERROR: No se pudo insertar el nodo en la base de datos',
    'ERROR: No se pudo borrar el nodo en la base de datos'
];


////////

//ATENCION: para agregar un serial, agregar entrada en tcomp_adapter y en series;
var series = ['inf101'];

var seriales = {};

//ATENCION: para agregar un serial, agregar entrada en tcomp_adapter y en series;
var tcomp_adapter = {
    reporte:{
        serie: 'inf101',
        base: 100000,
        prefix: 'I'
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
    //console.log("INIT:fetchserie:reporte.js:[%s]",serie);
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
    //console.log('addSerial:report.js INIT con exito: [%s] next:[%s]',seriales[serial].serie,seriales[serial].nextnum);
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
/////////

var addNewReport = function(req, res, node){
    console.log("addNewReport:reports.js ");


    setNodeCode(node);
    insertNewReport(req,res,node);
};

var insertNewReport = function (req, res, report){
    console.log('insertNewReport:reports.js BEGIN [%s]',report.slug);
    //dbi.collection(reportsCol, function(err, collection) {

    dbi.collection(reportsCol).insert(report,{w:1}, function(err, result) {
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


exports.fetchById = function(id, cb) {
    console.log('findById: Retrieving %s id:[%s]', reportsCol,id);
    dbi.collection(reportsCol, function(err, collection) {
        collection.findOne({'_id':new BSON.ObjectID(id)}, function(err, item) {
            cb(err, item);
        });
    });
};

exports.findById = function(req, res) {
    var id = req.params.id;
    console.log('findById: Retrieving %s id:[%s]', reportsCol,id);
    dbi.collection(reportsCol, function(err, collection) {
        collection.findOne({'_id':new BSON.ObjectID(id)}, function(err, item) {
            res.send(item);
        });
    });
};

exports.find = function(req, res) {
    var query = req.body; //{};
    query = normaliseQuery(query);

    console.log('find:report Retrieving report collection with query');
//            res.send(query);

    dbi.collection(reportsCol, function(err, collection) {
        collection.find(query).sort({slug:1}).toArray(function(err, items) {
            res.send(items);
        });
    });



};
var normaliseQuery = function(query){

    return query;
};

exports.findAll = function(req, res) {
    console.log('findAll: Retrieving all instances of [%s] collection', reportsCol);
    dbi.collection(reportsCol, function(err, collection) {
        collection.find().sort({slug:1}).toArray(function(err, items) {
            res.send(items);
        });
    });
};

exports.findOne = function(req, res) {
    var query = req.body;

    var sort = {cnumber: 1};
    if (query.cnumber['$lt']) sort = {cnumber: -1};

    console.log('findONE:report Retrieving report collection with query [%s] sort:[%s]',query.cnumber, sort.cnumber);
 
    dbi.collection(reportsCol, function(err, collection) {
        collection.find   (query).sort(sort).toArray(function(err, items) {
            res.send(items[0]);
        });
    });
};


exports.add = function(req, res) {
    console.log('add:report.js: NEW ENTITY BEGINS');
    var report = req.body;
    addNewReport(req, res, report);
};

exports.update = function(req, res) {
    var id = req.params.id;
    var report = req.body;
    delete report._id;
    console.log('Updating node id:[%s] ',id);
    console.log(JSON.stringify(report));
    dbi.collection(reportsCol, function(err, collection) {
        collection.update({'_id':new BSON.ObjectID(id)}, report, {safe:true}, function(err, result) {
            if (err) {
                console.log('Error updating %s error: %s',reportsCol,err);
                res.send({error: MSGS[0] + err});
            } else {
                console.log('UPDATE: se insertaron exitosamente [%s] nodos',result);
                res.send(report);
            }
        });
    });
};

exports.delete = function(req, res) {
    var id = req.params.id;
    console.log('Deleting node: [%s] ', id);
    dbi.collection(reportsCol, function(err, collection) {
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
