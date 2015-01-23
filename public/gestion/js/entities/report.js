DocManager.module("Entities", function(Entities, DocManager, Backbone, Marionette, $, _){
  Entities.Report = Backbone.Model.extend({

    whoami: 'Report:report.js ',
    urlRoot: "/reportes",

    idAttribute: "_id",

    defaults: {
        _id: null,
        tipocomp:"reporte",
        tipomov:'',
        tiporeporte:'',
        cnumber: '',
        slug: '',
        title: '',
        description: '',
        fereporte: '',
        persona: '',
        user: '',

        // criterios de seleccion
        fedesde:'',
        fehasta:'',

        estado_alta: "activo",
        items:[],
    },

    initBeforeCreate: function(){
      var fealta = new Date(),
          fereporte = utils.buildDateNum(this.get('fereporte'));

      this.set({fealta:fealta.getTime(), fereporte_tc: fereporte});

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
      if(!self.save(null,{
        success: function(model){
          //console.log('callback SUCCESS')
          
          // log Activity
          //logActivity(model);
          // log Activity

          //Change Product State
          //changeProductState(model);
          //Change Product State

          cb(null,model);

         }
        })) {
          cb(self.validationError,null);
      }    

    },

    validate: function(attrs, options) {
      var errors = {}
      if (! attrs.slug) {
        errors.firstName = "no puede quedar en blanco";
      }
      if( ! _.isEmpty(errors)){
        return errors;
      }
    }
  });

  Entities.ReportItem = Backbone.Model.extend({

    whoami: 'Report:report.js ',
    //urlRoot: "/reportes",

    idAttribute: "_id",

    defaults: {
        _id: null,

        //header
        fechagestion:'',
        fechagestion_tc:'',
        tipocomp:'',
        cnumber:'',
        documid:'',

        //item
        tipomov:'',

        //producto
        productcode:'',
        productid:'',
        productslug:'',
        chapters: '',
        tcomputo: '',

        // persona
        personname:'',
        personid:'',

    },

  });



  Entities.ReportItemCollection = Backbone.Collection.extend({

    model: Entities.ReportItem,
    //url: "/reportes",

    sortfield: 'personname',
    sortorder: 1,
    comparator: function(left, right) {
      var order = this.sortorder;
      var l = left.get(this.sortfield);
      var r = right.get(this.sortfield);

      if (l === void 0) return -1 * order;
      if (r === void 0) return 1 * order;

      return l < r ? (1*order) : l > r ? (-1*order) : 0;
    },

  });


  //Entities.configureStorage(Entities.Report);

  Entities.ReportCollection = Backbone.Collection.extend({

    model: Entities.Report,
    url: "/reportes",

    sortfield: 'cnumber',
    sortorder: 1,
    comparator: function(left, right) {
      var order = this.sortorder;
      var l = left.get(this.sortfield);
      var r = right.get(this.sortfield);

      if (l === void 0) return -1 * order;
      if (r === void 0) return 1 * order;

      return l < r ? (1*order) : l > r ? (-1*order) : 0;
    },

  });

  Entities.ReportFindOne = Backbone.Collection.extend({
    whoami: 'Entities.ReportFindOne:reporte.js ',
    url: "/reporte/fetch",
    model: Entities.Report,
    comparator: "cnumber",
  });


  Entities.ReportCoreFacet = Backbone.Model.extend({
    //urlRoot: "/reportes",
    whoami: 'Reporte:report.js ',

    schema: {
        tipomov: {type: 'Select',options: utils.tipoInformeOptionList, title:'Tipo de informe: ' },
        slug:     {type: 'Text', title: 'Título: '},
        fereporte:  {type: 'Text', title: 'Fecha informe: '},
    },
    //idAttribute: "_id",

    createNewReport: function(cb){
      var self = this;
      var report = new Entities.Report(self.attributes);

      report.initBeforeCreate();

      report.save(null, {
        success: function(model){
          cb(null,model);
        }
      });
    },

    defaults: {
      _id: null,
      tipomov:"no_definido",
      slug: '',
      fereporte: '',
    },

   });






  var filterFactory = function (entities){
    var fd = DocManager.Entities.FilteredCollection({
        collection: entities,

        filterFunction: function(filterCriterion){
          var criteria = utils.fstr(filterCriterion.toLowerCase());
          return function(document){
            //console.log('filterfunction:[%s]vs [%s]/[%s]/[%s]',criteria,document.get("tipomov"),document.get("cnumber"),document.get("slug"));
            if(document.get("slug").toLowerCase().indexOf(criteria) !== -1
              || utils.fstr(document.get("title").toLowerCase()).indexOf(criteria) !== -1
              || document.get("tipomov").toLowerCase().indexOf(criteria) !== -1){

              
              return document;
            }
          }
        }
    });
    return fd;
  };

  var API = {
    getEntities: function(){
      var entities = new Entities.ReportCollection();
      var defer = $.Deferred();

      entities.fetch({
        success: function(data){
          defer.resolve(data);
        }
      });

      var promise = defer.promise();
      return promise;
    },

    getFilteredCol: function(criteria, cb){
      //console.log('getFilteredCol: 1');
      var fetchingEntities = API.getEntities();
      //console.log('getFilteredCol: 2');

      $.when(fetchingEntities).done(function(entities){
        //console.log('getFilteredCol: 3');
        var filteredEntities = filterFactory(entities);
        console.log('getFilteredCol: [%s]',criteria);
        if(criteria){
            filteredEntities.filter(criteria);
        }
        if(cb) cb(filteredEntities);
      });
    },

    getEntity: function(entityId){
      var entity = new Entities.Report({_id: entityId});
      var defer = $.Deferred();

      entity.fetch({
        success: function(data){
          defer.resolve(data);
        },
        error: function(data){
          defer.resolve(undefined);
        }
      });
      return defer.promise();
    },

    fetchNextPrev: function(type, model, cb){
      var query = {};
      if(type === 'fetchnext') query.cnumber = { $gt : model.get('cnumber')}
      if(type === 'fetchprev') query.cnumber = { $lt : model.get('cnumber')}

      var reporte= new Entities.ReportFindOne();
      reporte.fetch({
          data: query,
          type: 'post',
          success: function() {
              if(cb) cb(reporte.at(0));
          }
      });
    }

  };

  DocManager.reqres.setHandler("report:entities", function(){
    return API.getEntities();
  });

  DocManager.reqres.setHandler("report:entity", function(id){
    return API.getEntity(id);
  });

  DocManager.reqres.setHandler("report:filtered:entities", function(criteria, cb){
    return API.getFilteredCol(criteria,cb);
  });



  DocManager.reqres.setHandler("report:fetchprev", function(model, cb){
    return API.fetchNextPrev('fetchprev',model, cb);
  });

  DocManager.reqres.setHandler("report:fetchnext", function(model, cb){
    return API.fetchNextPrev('fetchnext',model, cb);
  });


});
//http://localhost:3000/gestion/#reportes/530524dc8fb9efc80b083ecb/edit
//http://localhost:3000/gestion/#reportes/53057f3fde1c0b7d19576276/edit
//http://localhost:3000/gestion/#reportes/53057ce0de1c0b7d19576275/edit

