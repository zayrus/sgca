DocManager.module("Entities", function(Entities, DocManager, Backbone, Marionette, $, _){
  Entities.Person = Backbone.Model.extend({

    whoami: 'Person:models.js ',
    urlRoot: "/personas",

    idAttribute: "_id",

    defaults: {
        _id: null,
        tipopersona:"",
        name: '',
        displayName: '',
        nickName: '',
        tipojuridico:{
            pfisica: true,
            pjuridica: false,
            pideal: true,
        },
        roles:{
            adherente:false,
            proveedor:false,
        },
        estado_alta: "activo",
        descriptores: "",
        taglist:[],
        description: "",
 
        contactinfo:[],
        notas:[],
        branding:[],
    },


    validate: function(attrs, options) {
      var errors = {}
      if (! attrs.name) {
        errors.firstName = "no puede quedar en blanco";
      }
      if (! attrs.nickName) {
        errors.lastName = "no puede quedar en blanco";
      }
      else{
        if (attrs.displayName.length < 2) {
          errors.lastName = "demasiado corto";
        }
      }
      if( ! _.isEmpty(errors)){
        return errors;
      }
    }
  });

  //Entities.configureStorage(Entities.Person);

  Entities.PersonCollection = Backbone.Collection.extend({

    model: Entities.Person,
    url: "/personas",

    comparator: "nickName"
  });

  var filterFactory = function (entities){
    var fd = DocManager.Entities.FilteredCollection({
        collection: entities,

        filterFunction: function(filterCriterion){
          var criteria = utils.fstr(filterCriterion.toLowerCase());
          return function(document){
            //console.log('filterfunction:[%s]vs [%s]/[%s]/[%s]',criteria,document.get("tipocomp"),document.get("cnumber"),document.get("slug"));
            if(document.get("nickName").toLowerCase().indexOf(criteria) !== -1
              || utils.fstr(document.get("name").toLowerCase()).indexOf(criteria) !== -1
              || document.get("displayName").toLowerCase().indexOf(criteria) !== -1){

              
              return document;
            }
          }
        }
    });
    return fd;
  };

  var API = {
    getEntities: function(){
      var entities = new Entities.PersonCollection();
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
      var entity = new Entities.Person({_id: entityId});
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
    }

  };

  DocManager.reqres.setHandler("person:entities", function(){
    return API.getEntities();
  });

  DocManager.reqres.setHandler("person:entity", function(id){
    return API.getEntity(id);
  });

  DocManager.reqres.setHandler("person:filtered:entities", function(criteria, cb){
    return API.getFilteredCol(criteria,cb);
  });

});

