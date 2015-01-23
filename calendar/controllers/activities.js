/*
 *  calentdar activities.js
 *  package: /calendar/controllers
 *  DOC: 'activityos' collection controller
 *       Cada nodo representa un objeto digital-cultural (activityo audiovisual, imagen, audio)
 *       a ser gestionado por el sistema.
 *       Este modulo contiene los 'controllers'
 *       para aplicar los metodos CRUD.
 *  Use:
 *     Exporta el objeto controller de un activityo via 'exports'
 *     metodos exportados:
 *          open(); find(); findById; findAll; add(), update(); delete(); viewId
 */
var path = require('path');
var rootPath = path.normalize(__dirname + '/../..');

var Backbone = require('backbone');
var _ = require('underscore');

var receipt = require(rootPath + '/calendar/controllers/receipts');
var utils = require(rootPath + '/core/util/utils');


var dbi ;
var BSON;
var config = {};
var activitiesCol = 'activities';
var serialCol = 'seriales';
var MSGS = [
    'ERROR: No se pudo insertar el nodo en la base de datos',
    'ERROR: No se pudo borrar el nodo en la base de datos'
];
var ITEM_MAX = 30;

var User = Backbone.Model.extend({

});

var UserCollection = Backbone.Collection.extend({
    model:User
});

var Controller = Backbone.Model.extend({
    defaults:{
        eventname:''
    }
});

var ParteDiario = Backbone.Model.extend({
    setUser: function(user){
        this.user = user;
    },
    getUser: function(){
        return this.user;
    },

    defaults:{
        eventname:'',
        dealDate:'',
        data:{},
        query:{},
    }
});

var Comprobante = Backbone.Model.extend({
    //urlRoot: "/comprobantes",
    whoami: 'Comprobante:activities.js ',
    idAttribute: "_id",

    defaults: {
      _id: null,
      tipocomp: "",
      cnumber: "",
      fecomp: "",
      persona: "",
      slug: "",
      estado_alta:'activo',
      nivel_ejecucion: 'enproceso',
      description: "",
      items:[]
    },

    //enabled_predicates:['es_relacion_de'],
    
    initBeforeCreate: function(attrs){

        var fealta = attrs.dealDate,
            fecomp = utils.dateToStr(fealta),
            documitems = [];



    console.log('initBeforeCreate:[%s] [%s]',attrs.persona, attrs.data.header.tipocomp);
      this.set({fealta:fealta.getTime(), fecomp: fecomp, fecomp_tc:fealta.getTime()});

      this.set('persona',attrs.persona);
      this.set('personaid', attrs.personaid);

      if(attrs.data.header.tipocomp === 'pdiario'){
            var item = attrs.data.item;
            item.fealta = new Date().getTime();
            item.feultmod = new Date().getTime();

            documitems.push(item);
            this.set({items: documitems});
      }
    },

    beforeSave: function(){
        console.log('initBefore SAVE')
        var feultmod = new Date();
        this.set({feultmod:feultmod.getTime()})
    },

    update: function(cb){
        console.log('update')
        var self = this;
        self.beforeSave();
        var errors ;
        console.log('ready to SAVE');
        receipt.createNew(self.attributes, function(result){
            cb(result.model);
        });
    },

});

var dealDate = function(){
    var to = new Date();
    return new Date(to.getFullYear(), to.getMonth(),to.getDate());
};

var controller = new Controller();
var userCol = new UserCollection();

controller.on('user:pdiario', function(pd, cb){
    console.log('controller EVENT CATCHED');
    parteDiarioProcess(pd,cb);

});

/*
controller.on('all', function(event){
    console.log('event Name: [%s]',event);
})
*/

var parteDiarioProcess = function(pd, cb){
    console.log('PROCESO el parteDiario!!! userCol:[%s]', userCol.length);
    var prevDocum = documExists(pd);
    console.log('PROCESO el parteDiario!!! userCol:[%s] prevDOCUM: [%s]', userCol.length, prevDocum);
    if(prevDocum){
        documUpdate(pd, prevDocum, cb);
    }else{
        initNewParteDiario(pd);
        processNewDocum(pd, cb);
    }
};

var documExists = function(pd){
    var user = pd.getUser();
    var documlist = user.get('documlist');
    var query = pd.get('query');
    if(!documlist) documlist = [];
    var prevDocum = _.find(documlist,function(docum){
        if(pd.get('dealDate').getTime() !== docum.dealDate) return false;
        var signature = docum.items[0];
        if(signature){
            console.log('searching docum list: [%s]:::[%s]vs[%s]/[%s] [%s]vs[%s]  [%s]vs[%s]  [%s]vs[%s]', docum.documid, pd.get('dealDate').getTime(),docum.dealDate,pd.get('dealDate')===docum.dealDate,signature.tipoitem, query.tipocomp, signature.tipomov, query.tipomov, signature.activity, query.activity );
            if(signature.tipoitem === query.tipocomp && signature.tipomov === query.tipomov && signature.activity === query.activity ){
                return docum;
            } else {
                return false;
            }
        }else{
            return false;
        }

    });
    return prevDocum;
};

var initNewParteDiario = function (pd){
    var header = pd.get('data').header;
    header.tipocomp = header.tipocomp||'pdiario';
    header.slug = header.slug||'parte diario de usuario';
    header.estado_alta = header.estado_alta||'cerrado';
    header.nivel_ejecucion = header.nivel_ejecucion||'cumplido';
    pd.get('data').header = header;
    pd.get('data').item.tipoitem = 'pdiario';
};


var documUpdate = function (pd, docum, cb){
    console.log('documUpdate');
    var data = {};
    console.log('')
    data.nodes = [docum.documid];
    data.newdata = {};
    var entity = pd.get('data').item.entity;
    var items = docum.items;
    
    var sameitem = _.find(items,function(item){
        return _.reduce(pd.get('data').item, function(memo,value, key){
            return memo && value === item[key];
        }, true);
    });

    if (sameitem){
        sameitem.feultmod = new Date().getTime();
    }else{
        var newItem = pd.get('data').item;
        newItem.fealta = new Date().getTime();
        newItem.feultmod = new Date().getTime();
        items.push(newItem);
    }
    
    data.newdata.items = items;
    console.log('BEFORE PARTIAL UPDATE: ITEMS: [%s] nodes:[%s] documid:[%s]', data.newdata.items.length, data.nodes[0], docum.documid);
    receipt.partialupdate(null, null, data, function(result){
        cb('parteDiario:triggered/partial update', pd.attributes, docum, null, pd.getUser().attributes);

    });
};

var processNewDocum = function(pd, cb){
    console.log('processNewDocum');
    var docum = new Comprobante(pd.get('data').header);
    console.log('Before initCreate: [%s]',pd.get('data').header.slug);
    docum.initBeforeCreate(pd.attributes);
    docum.update(function(model){
        console.log('is the Same???: [%s] [%s]vs[%s] [%s]', docum===model, docum.get('_id'), model._id, docum.get('id')===model._id);
        userInsertNewDocum(pd, model);

        cb('parteDiario:triggered new document', pd.attributes, docum.attributes, model, pd.getUser().attributes);
    });
};

var userInsertNewDocum = function(pd, model){
    var user = pd.getUser();
    var documlist = user.get('documlist');
    if(!documlist) documlist = [];

    var docum = {
        documid: model._id.toHexString(),
        dealDate: model.fecomp_tc,
        items:[model.items[0]]
    }
    documlist.push(docum);
    user.set('documlist', documlist);
};

var fetchUser = function(req){
    var ureq = req.user;
    if(!ureq) return;
    console.log('fetchUser BEGINS: [%s]',userCol.length);
    var exists = userCol.find(function(user){
        return (user.get('username')===ureq.username);
    })
    if(!exists){
        var user = new User(ureq);
        userCol.add(user);
        console.log('fetchUser NEW USER IN COL: [%s]',userCol.length);
        return user;
    }else{
        console.log('fetchUser ALREADY EXISTING USER IN COL: [%s]',userCol.length);
        return exists;
    }
};

var checkIfOutdated = function (user){
    var documlist = user.get('documlist');
    var today = dealDate().getTime();

    if(!documlist) return;

    var filteredList = _.filter(documlist, function(docum){
        if(docum.dealDate < today) return false;
        if(docum.items.length>ITEM_MAX) return false;
        return true;
    });
    user.set('documlist',filteredList);
};

var processRequest = function(req, res, cb){
    console.log('processRequest');
    var data = req.body.data,
        query = req.body.query,
        eventname = req.body.eventname,
        parteDiario;

    var user = fetchUser(req);
    if(!user){
        cb('no encontramos al usuario')

    }else{
        checkIfOutdated(user);

        console.log('processRequest [%s]',eventname);
        parteDiario = new ParteDiario({
            eventname:eventname,
            dealDate: dealDate(),
            data:data,
            query:query,
            persona: user.get('es_usuario_de')[0].code,
            personaid: user.get('es_usuario_de')[0].id,
        });
        parteDiario.setUser(user);
        controller.trigger(eventname, parteDiario, cb);
    }

};



exports.controller = function(req, res) {
    console.log('activitycontroller');
    processRequest(req,res, function(result,pd, docum, model, user){
        //console.log('End processing: [%s] [%s]',pd.persona, pd.data.header.slug);
        console.log('================  END PROCESSING ====================');
        res.send({
            process: result,
            pd:pd,
            docum:docum,
            model: model,
            user:user
        });        
    });
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
