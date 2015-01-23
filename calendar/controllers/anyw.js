/*
 *
 */
var dbi ;
var BSON;
var config = {};
var reportsCol = 'anywproductions';
var serialCol = 'seriales';
var url = require('url');
var http = require("http");
var querystring = require('querystring');
var _ = require('underscore');

var path = require('path');
var rootPath = path.normalize(__dirname + '/../..');

var user = require(rootPath + '/calendar/controllers/user');
var utils = require(rootPath + '/core/util/utils');

var getLatestProductionPath = _.template("/content/ea/git/productions/<%= id %>/<%= node %>.v1.json");

 

var MSGS = [
    'ERROR: No se pudo insertar el nodo en la base de datos',
    'ERROR: No se pudo borrar el nodo en la base de datos'
];
var currentUsers = {


};


////////

//ATENCION: para agregar un serial, agregar entrada en tcomp_adapter y en series;
var series = ['xxxx'];
var seriales = {};

//ATENCION: para agregar un serial, agregar entrada en tcomp_adapter y en series;
var tcomp_adapter = {
    anywproductions:{
        serie: 'xxx',
        base: 100000,
        prefix: 'A'
        },
    poromision: {
        serie: 'anyw101',
        base: 100000,
        prefix: 'Y'
        }
};

var fetchCookie = function(req){
    var req_user = req.user;

    console.log('fetchCookie: [%s]',req_user._id, req_user.anyw_token );
    return req_user.anyw_token;

};

var loadSeriales = function(){
    for(var key in series){
        fetchserial(series[key]);
    }
};

var fetchserial = function(serie){
    console.log("INIT:fetchserie:reporte.js:[%s]",serie);
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
    console.log('addSerial:report.js INIT con exito: [%s] next:[%s]',seriales[serial].serie,seriales[serial].nextnum);
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


exports.setDb = function(db) {
    dbi = db;
    //loadSeriales();

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


var userdata = querystring.stringify({
    j_username:'admin',
    j_password: 'admin'
});

var anywserver = {
    host: '186.137.141.82',
    port: '60138',
};
var server


exports.auth =  function(user, passwd, cb){
    console.log("/ANYW login BEGINS [%s][%s]",user,passwd);
    
    var username = querystring.stringify({
        j_username: user,
        j_password: passwd
    });

    var options = anywserver;
    options.method = 'POST';
    options.path = '/app/ea/j_security_check?resource=/content/ea/api/discovery.v1.json';
    options.headers = {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Content-Length': Buffer.byteLength(username)
    };
    
    var req = http.request(options, function (http_res) {
        var respdata = "";
        console.log('STATUS: ' + http_res.statusCode);
        console.log('HEADERS: ' + JSON.stringify(http_res.headers));
 
        http_res.on("data", function (chunk) {
            respdata += chunk;
        });

        http_res.on('error',function(e){
            console.log( e.stack );
        });

        http_res.on("end", function () {
        }); 
    });

    req.on('error', function(e) {
        console.log('problem with request: ' + e.message);
    });

    req.on('response', function(any_res) {
        console.log("/ANYW login RESPONSE 5.1 ");
        cb(any_res.headers['set-cookie'][0]);        
    });

    req.write(username);
    req.end();
};



///NO en uso
exports.login =  function(req,res){
    console.log("/ANYW login BEGINS ");

    //var pa = '/webservice/response/client.php?Method=GetLugaresListFiltered&OrdenarPor=NombreUrl&Orden=ASC&Limit=10&Offset=0';
    //pa += '&NombreUrl='+utils.safeName(req.query.nombre);
    
    //console.log('pa: [%s]',pa);

    var options = anywserver;
    options.method = 'POST';
    options.path = '/app/ea/j_security_check?resource=/content/ea/api/discovery.v1.json';

    options.headers = {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Content-Length': Buffer.byteLength(userdata)
    };
    
    console.log("/ANYW login BEGINS 1.0 ");
    var req = http.request(options, function (http_res) {
        // initialize the container for our data
        var respdata = "";
        console.log('STATUS: ' + http_res.statusCode);
        console.log('HEADERS: ' + JSON.stringify(http_res.headers));
        // this event fires many times, each time collecting another piece of the response
        console.log("/ANYW login BEGINS 2.0 ");
        http_res.on("data", function (chunk) {
            // append this chunk to our growing `data` var
            console.log("/ANYW login BEGINS 2.1 ");
            respdata += chunk;
        });

        http_res.on('error',function(e){
            console.log("/ANYW login BEGINS 3.1 ");
            console.log("Error: " + e.message); 
            console.log( e.stack );
        });

        // this event fires *one* time, after all the `data` events/chunks have been gathered
        http_res.on("end", function () {
                // you can use res.send instead of console.log to output via express
            //console.log("/ANYW login BEGINS 4.1 ");
            //console.log(respdata);
            //res.send(respdata);
            //res.redirect('http://186.137.141.82:60138/content/ea/api/discovery.v1.json');


        }); 
    });

    req.on('error', function(e) {
        console.log('problem with request: ' + e.message);
    });
    //req.write('j_username=admin');
    //req.write('j_password=admin');
    req.on('response', function(any_res) {


        console.log("/ANYW login RESPONSE 5.1 ");
        if(!currentUsers['admin']){
            currentUsers['admin']={
                j_username:'admin',
                j_password: 'admin',
            };
        }
        currentUsers['admin'].j_cookie = any_res.headers['set-cookie'];
        fetchProductions(req, res, any_res)


    });

    req.write(userdata);
    req.end();
    //console.log("/agendacultural:routes.js ");
    //res.redirect();
};

var discover = function(req, res, any_res){

    var options = anywserver;
    options.method = 'GET';
    options.path = '/content/ea/api/discovery.v1.json';
    options.headers = {
        'set-cookie': currentUsers['admin']['j_cookie']
    };
    console.log("FETCH Discover BEGINS [%s]", currentUsers['admin']['j_cookie']);
   
    var req = http.request(options, function (http_res) {
        var data = "";
        console.log('STATUS: ' + http_res.statusCode);
        console.log('HEADERS: ' + JSON.stringify(http_res.headers));
        // this event fires many times, each time collecting another piece of the response
        console.log("FETCH Discover BEGINS 2.0 ");
        http_res.on("data", function (chunk) {
            // append this chunk to our growing `data` var
            console.log("FETCH Discover BEGINS 2.1 ");
            data += chunk;
        });

        http_res.on('error',function(e){
            console.log("FETCH Discover BEGINS 3.1 ");
            console.log("Error: " + e.message); 
            console.log( e.stack );
        });

        // this event fires *one* time, after all the `data` events/chunks have been gathered
        http_res.on("end", function () {
            // you can use res.send instead of console.log to output via express
            console.log("FETCH Discover BEGINS 4.1 ");
            console.log(data);
            res.send(data);
        });
    });

    req.on('response', function(any_res) {
        console.log("Discover  RESPONSE 5.1 ");
        //console.log(any_res);
    });

    req.end();



};

exports.findAllProductions = function(req, res) {
    console.log('findAll: Retrieving all instances of [%s] collection', reportsCol);

    var options = anywserver;
    options.method = 'GET';
    options.path = '/content/ea/git/productions.v1.json';

    options.headers = {
        'Cookie': fetchCookie(req)
    };


    var req = http.request(options, function (http_res) {
        var data = "";
        console.log('STATUS: ' + http_res.statusCode);
        console.log('HEADERS: ' + JSON.stringify(http_res.headers));
        console.log("FETCH Productions BEGINS 2.0 ");
        http_res.on("data", function (chunk) {
            data += chunk;
        });

        http_res.on('error',function(e){
            console.log("Error: " + e.message); 
            console.log( e.stack );
        });

        http_res.on("end", function () {
            console.log("FETCH Productions BEGINS 4.1 ");
            console.log(data);
            res.send(data);
        });
    });
    req.end();

};



var fetchProductions = function(req, res, any_res){

    var options = anywserver;
    options.method = 'GET';
    options.path = '/content/ea/git/productions.v1.json';

    options.headers = {
        'Cookie': currentUsers['admin']['j_cookie'][0]
    };
   
    var req = http.request(options, function (http_res) {
        var data = "";
        console.log('STATUS: ' + http_res.statusCode);
        console.log('HEADERS: ' + JSON.stringify(http_res.headers));
        // this event fires many times, each time collecting another piece of the response
        console.log("FETCH Productions BEGINS 2.0 ");
        http_res.on("data", function (chunk) {
            // append this chunk to our growing `data` var
            console.log("FETCH Productions BEGINS 2.1 ");
            data += chunk;
        });

        http_res.on('error',function(e){
            console.log("FETCH Productions BEGINS 3.1 ");
            console.log("Error: " + e.message); 
            console.log( e.stack );
        });

        // this event fires *one* time, after all the `data` events/chunks have been gathered
        http_res.on("end", function () {
            // you can use res.send instead of console.log to output via express
            console.log("FETCH Productions BEGINS 4.1 ");
            console.log(data);
            res.send(data);
        });
    });
    req.end();

};

exports.add = function(req, res) {
    var production = req.body;

    console.log('add:anyw.js: NEW ENTITY BEGINS [%s] [%s] [%s]',production.slug, production.description, production.tipoproduction);

    var newproduction = JSON.stringify({
        name: production.slug,
        description: production.description
        //tipoproduction: production.tipoproduction,
    });
    console.log('add:anyw.js: NEW ENTITY BEGINS [%s] [%s] [%s]: [%s]',production.slug, production.description, production.tipoproduction, newproduction);

/*    var newproduction = {
        name: production.slug,
        description: production.description,
        //tipoproduction: production.tipoproduction,
    };
*/
//
    
    // var username = querystring.stringify({
    //     j_username: user,
    //     j_password: passwd
    // });

    var options = anywserver;
    options.method = 'POST';

    options.path = '/content/ea/git/productions.v1.json';
    options.headers = {
        'Cookie': fetchCookie(req),
        'Content-Type': 'application/json',
        //'Content-Length': Buffer.byteLength(newproduction)
    };
    
    var request = http.request(options, function (http_res) {
        var respdata = "";
        console.log('addSTATUS: ' + http_res.statusCode);
        console.log('addHEADERS: ' + JSON.stringify(http_res.headers));
 
        http_res.on("data", function (chunk) {
            respdata += chunk;
        });

        http_res.on('error',function(e){
            console.log( e.stack );
        });

        http_res.on("end", function () {
            console.log("/ANYW create productions respdata END 5.1 [%s]", respdata);
            //addNewProduction(request, res, production);
            res.send(respdata);
        }); 
    });

    request.on('error', function(e) {
        console.log('problem with request: ' + e.message);
    });

    request.on('response', function(any_res) {
    });

    request.write(newproduction);
    request.end();

//


};

exports.findById = function(req, res) {
    var id = req.params.id;
    console.log('findById: Retrieving %s id:[%s]', reportsCol,id);

    var options = anywserver;
    options.method = 'GET';
    options.path = getLatestProductionPath({id:id, node:'HEAD'});
    options.headers = {
        'Cookie': fetchCookie(req)
    };
    console.log(options.path);

    var http_req = http.request(options, function (http_res) {
        var data = "";
        console.log('STATUS: ' + http_res.statusCode);
        console.log('HEADERS: ' + JSON.stringify(http_res.headers));
        http_res.on("data", function (chunk) {
            data += chunk;
        });
        http_res.on('error',function(e){
            console.log("Error: " + e.message); 
            console.log( e.stack );
        });
        http_res.on("end", function () {
            console.log(data);
            res.send(data);
        });
    });
    http_req.end();
};

lookUpPath = function(links, target){
    var link = _.find(links,function(node){
        return (node.rel === target);

    });
    var urlStr  = link.href;
    var parsedurl = url.parse(urlStr);
    var content = parsedurl.parse(urlStr, true).pathname;

    console.log('----------- lookup -------------');
    console.log('lookUpPath found:[%s]', urlStr);
    console.log('lookUpPath found:[%s]', content);
    console.log('-----------------------------');
    return content;
};

buildOptions = function (links, target, meth){
    var options = anywserver;
    options.method = meth;
    var eapath = lookUpPath(links, target);
    options.path = eapath;

    return options;
 
};

updateNodes = function(options, data,  cb){
    var newData = JSON.stringify(data);
    var http_req = http.request(options, function (http_res) {
        var data = "";
        console.log('----------- createNodes -------------');
        console.log('STATUS: ' + http_res.statusCode);
        console.log('HEADERS: ' + JSON.stringify(http_res.headers));
        console.log('------------------------------------');
        http_res.on("data", function (chunk) {
            data += chunk;
        });
        http_res.on('error',function(e){
            console.log("Error: " + e.message); 
            console.log( e.stack );
        });
        http_res.on("end", function () {
            cb(data);
        });
    });
    console.log('createNodes:[%s]',newData);
    http_req.write(newData);
    http_req.end();
};




createNodes = function(options, data,  cb){
    var newData = JSON.stringify(data);
    var http_req = http.request(options, function (http_res) {
        var data = "";
        console.log('----------- createNodes -------------');
        console.log('STATUS: ' + http_res.statusCode);
        console.log('HEADERS: ' + JSON.stringify(http_res.headers));
        console.log('------------------------------------');
        http_res.on("data", function (chunk) {
            data += chunk;
        });
        http_res.on('error',function(e){
            console.log("Error: " + e.message); 
            console.log( e.stack );
        });
        http_res.on("end", function () {
            cb(data);
        });
    });
    console.log('createNodes:[%s]',newData);
    http_req.write(newData);
    http_req.end();
};

fetchNodes = function(options, cb){
    var http_req = http.request(options, function (http_res) {
        var data = "";
        console.log('----------- fetchNodes -------------');
        console.log('STATUS: ' + http_res.statusCode);
        console.log('HEADERS: ' + JSON.stringify(http_res.headers));
        console.log('------------------------------------');
        http_res.on("data", function (chunk) {
            data += chunk;
        });
        http_res.on('error',function(e){
            console.log("Error: " + e.message); 
            console.log( e.stack );
        });
        http_res.on("end", function () {
            cb(data);
        });
    });
    http_req.end();
};

fetchJSonEntities = function (links, target, req, cb){
    var options = buildOptions (links, target, 'GET');
    options.headers = {
        'Cookie': fetchCookie(req)
    };
    fetchNodes(options, cb);
};

createJSonEntities = function (links, target, req, data, cb){
    var options = buildOptions (links, target, 'POST');
    options.headers = {
        'Cookie': fetchCookie(req),
        'Content-Type': 'application/json',
    };
    createNodes(options, data, cb);
};

updateJSonEntities = function (links, target, ifmatch, req, data, cb){
    var options = buildOptions (links, target, 'PUT');
    options.headers = {
        'Cookie': fetchCookie(req),
        'Content-Type': 'application/json',
        'If-Match': ifmatch,
    };
    createNodes(options, data, cb);
};

pushSessionData = function (links, target, req, data, cb){
    var options = buildOptions (links, target, 'POST');
    options.headers = {
        'Cookie': fetchCookie(req),
        'Content-Type': 'application/json',
    };
    createNodes(options, data, cb);
};


exports.fetchEntities = function(req, res){
    var query = req.body;
    var target = query.target;
    var links = query.links;
    fetchJSonEntities(links, target, req, function(entities){
        res.send(entities);

    });
};

exports.createEntities = function(req, res){
    var query = req.body;
    var target = query.target;
    var links = query.links;
    var data = query.bdata;
    console.log('createEntities: data:[%s] links:[%s] target:[%s]', data, links.length, target)
    console.dir(query);
    createJSonEntities(links, target, req, data, function(entities){
        res.send(entities);
    });
};

exports.updateEntities = function(req, res){
    var query = req.body;
    var target = query.target;
    var ifmatch = query.ifmatch;
    var links = query.links;
    var data = query.bdata;
    console.log('UPDATEEntities: data:[%s] links:[%s] target:[%s]', data, links.length, target);
    console.dir(query);
    updateJSonEntities(links, target, ifmatch, req, data, function(entities){
        res.send(entities);
    });
};

exports.pushSession = function(req, res){
    var query = req.body;
    var target = query.target;
    var links = query.links;
    var data = query.bdata;
    console.log('PushSession: data:[%s] links:[%s] target:[%s]', data, links.length, target);
    console.dir(query);
    pushSessionData(links, target, req, data, function(entities){
        res.send(entities);
    });
};

ingestNodes = function(options, data,  cb){
    var newData = JSON.stringify(data);
    options['Content-Length'] = Buffer.byteLength(newData);

    var http_req = http.request(options, function (http_res) {
        var data = "";
        console.log('----------- createNodes -------------');
        console.log('STATUS: ' + http_res.statusCode);
        console.log('HEADERS: ' + JSON.stringify(http_res.headers));
        console.log('------------------------------------');
        http_res.on("data", function (chunk) {
            data += chunk;
        });
        http_res.on('error',function(e){
            console.log("Error: " + e.message); 
            console.log( e.stack );
        });
        http_res.on("end", function () {
            cb(data);
        });
    });
    console.log('ingestNodes:[%s]',newData);
    http_req.write(newData);
    http_req.end();
};

ingestMedia = function (links, target, req, data, cb){
    var options = buildOptions (links, target, 'POST');
    options.headers = {
        'Cookie': fetchCookie(req),
        'Content-Type': 'multipart/form-data',
    };
    ingestNodes(options, data, cb);
};


exports.ingest = function(req, res){
    var query = req.body;
    var target = query.target;
    var links = query.links;
    var data = query.bdata;
    console.log('PushSession: data:[%s] links:[%s] target:[%s]', data, links.length, target);
    console.dir(query);
    ingestMedia(links, target, req, data, function(entities){
        res.send(entities);
    });
};


///



/*

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


*/
