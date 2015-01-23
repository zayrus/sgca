StudioManager.module("Entities", function(Entities, StudioManager, Backbone, Marionette, $, _){


  Entities.EaAssetToken = Backbone.Model.extend({

    whoami: 'AssetToken:eaAssets.js ',

    urlRoot: "/studio/eaassets",

    idAttribute: "_id",

    initialize: function(){
      this.initAfterFetching();
    },

    initAfterFetching: function(){
      console.log('EaAssetToken:Initialize: [%s]',this.get('ea:eaAssetId') )
      this.set('ea_eaAssetId',this.get('ea:eaAssetId') );
      this.set('ea_lastModified',this.get('ea:lastModified') );
      this.set('ea_lastModifiedOfAllSessions',this.get('ea:lastModifiedOfAllSessions') );
      this.set('eaAssetName',this.get('properties').name );
      this.set('eaAssetDescription',this.get('properties').description );

    },

    initBeforeCreate: function(){
      console.log('initBeforeCreate')
    },

    defaults: {
        _id: null,

        'ea:eaAssetId': "",
        'ea:lastModified': "",
        'ea:lastModifiedOfAllSessions': "",
        'ea_eaAssetId': "",
        'ea_lastModified': "",
        'ea_lastModifiedOfAllSessions': "",
        'ea_comitId': "",
        'ea_tag': "",
        eaAssetName: '',
        eaAssetDescription: '',
        properties: {},
        links: [],
    },

 });


  Entities.EaAsset = Backbone.Model.extend({

    whoami: 'EaAsset:eaAssets.js ',

    urlRoot: "/studio/eaassets",

    idAttribute: "_id",

    initialize: function(){
      //this.initAfterFetching();
    },

    initAfterFetching: function(){
      console.log('EaAsset:Initialize: [%s]',this.get('ea:commitId') )
      this.set('ea_eaAssetId',this.get('ea:eaAssetId') );
      this.set('ea_lastModified',this.get('ea:lastModified') );
      this.set('ea_commitId',this.get('ea:commitId') );
      this.set('ea_tag',this.get('ea:tag') );
      this.set('ea_lastModifiedOfAllSessions',this.get('ea:lastModifiedOfAllSessions') );

      this.set('eaAssetName',this.get('properties').properties.name );
      this.set('ea_tag',this.get('properties')['ea:tag'] );
      this.set('eaAssetDescription',this.get('properties').properties.description );

    },

    initBeforeCreate: function(){
      console.log('initBeforeCreate')

    },

    defaults: {
        _id: null,

        'ea:eaAssetId': "",
        'ea:lastModified': "",
        'ea:lastModifiedOfAllSessions': "",
        'ea_eaAssetId': "",
        'ea_lastModified': "",
        'ea_lastModifiedOfAllSessions': "",
        'ea_comitId': "",
        'ea_tag': "",
        eaAssetName: '',
        eaAssetDescription: '',
        properties: {},
        links: [],

        tipoeaAsset:"",
        productcode:"",
 
        slug: "",
        denom: "",

        nivel_importancia: "medio",
        estado_alta: "activo",
        nivel_ejecucion: "planificado",

        project:{},
        patechfacet:{},
        clasification:{},

        notas:[],
        branding:[],
        descripTagList:[],
        contentTagList:[],
        estado_alta: 'alta',
        nivel_ejecucion:'media',
    },

    validate: function(attrs, options) {
      /*
      var errors = {};
      if (! attrs.productcode) {
        errors.productcode = "no puede quedar en blanco";
      }
      if (! attrs.slug) {
        errors.slug = "no puede quedar en blanco";
      }
      else{
        if (attrs.denom.length < 2) {
          errors.denom = "demasiado corto";
        }
      }
      if( ! _.isEmpty(errors)){
        return errors;
      }
      */
    }
  });

  Entities.EaAssetUpdate = Backbone.Model.extend({
    whoami: 'Entities.EaAssetUpdate:eaAsset.js ',

    urlRoot: "/actualizar/eaassets",

  });


  //Entities.configureStorage(Entities.EaAsset);
  Entities.EaAssetCollectionHeader = Backbone.Collection.extend({

    model: Entities.EaAssetToken,

    url: "/studio/eaassets",

    comparator: "ea:lastModified",


  });


  Entities.EaAssetCollection = Backbone.Collection.extend({

    model: Entities.EaAssetToken,

    url: "/studio/eaassets",

    comparator: "ea:lastModified",


  });

  Entities.EaAssetCollectionBuilder = Backbone.Collection.extend({

    model: Entities.EaAssetToken,

    url: "/studio/entities",

  });




  Entities.EaAssetCoreFacet = Backbone.Model.extend({
    //urlRoot: "/comprobantes",
    whoami: 'EaAssetCoreFacet:eaAsset.js ',

    schema: {
        tipoeaAsset: {type: 'Select',options: utils.tipoProduccionOptionList, title:'Tipo Producción' },
        slug:     {type: 'Text', title: 'Nombre'},
        description:  {type: 'Text', title: 'Descripción'},
    },
    //idAttribute: "_id",

    createNewEaAsset: function(cb){
      var self = this;
      var eaAsset = new Entities.EaAsset(self.attributes);

      eaAsset.initBeforeCreate();
      console.log('createNewEaAsset!!');

      var algo = eaAsset.save(null, {
        success: function(model){
          console.log('saveSuccess');
          cb(null,model);
        },
        error: function(event){
          console.log('error');
        }
      });
      //console.dir(algo);
    },

    defaults: {
      _id: null,
      tipoeaAsset: "no_definido",
      slug: "",
      description: ""
    },

  });

////////////////

////////////////


  var filterFactory = function (entities){
    var fd = StudioManager.Entities.FilteredCollection({
        collection: entities,

        filterFunction: function(filterCriterion){
          var criteria = utils.fstr(filterCriterion.toLowerCase());
          return function(document){
            //console.log('filterfunction:[%s]vs [%s]/[%s]/[%s]',criteria,document.get("tipocomp"),document.get("cnumber"),document.get("slug"));
            if(document.get("properties").name.toLowerCase().indexOf(criteria) !== -1
              || document.get("properties").description.toLowerCase().indexOf(criteria) !== -1){
              
              return document;
            }
          }
        }
    });
    return fd;
  };

  var API = {
    getEntities: function(){
      var entities = new Entities.EaAssetCollection();
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

      $.when(fetchingEntities).done(function(master){
        //console.log('getFilteredCol: 3');
        console.log('getFilteredCol DONE: [%s]',master.length, master.at(0).get('eaAssets').length);
        var entities = new Entities.EaAssetCollection(master.at(0).get('eaAssets'));

        var filteredEntities = filterFactory(entities);
        console.log('getFilteredCol: [%s]',criteria);
        if(criteria){
            filteredEntities.filter(criteria);
        }
        if(cb) cb(filteredEntities);
      });
    },

    getEntity: function(entityId){
      var entity = new Entities.EaAsset({_id: entityId});
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

    getProductionAssets: function(production){
      var defer = $.Deferred();
      var links = production.get('links');
      console.log('getProductionAssets [%s]',links.length);

      var eaassetCol = new Entities.EaAssetCollectionBuilder();
      var query = {
        target: 'http://anywhere.adobe.com/assets',
        links: links
      };

      eaassetCol.fetch({
          data: query,
          type: 'post',
          success: function(data) {
            console.log('success: [%s]',data.at(0).get('assets').length);
            var col = new Entities.EaAssetCollection(data.at(0).get('assets'));
            defer.resolve(col);
          }
      });
      return defer.promise();
    }
  };




  StudioManager.reqres.setHandler("eaasset:production:entities", function(model){
    return API.getProductionAssets(model);
  });

  StudioManager.reqres.setHandler("eaasset:entities", function(){
    return API.getEntities();
  });

  StudioManager.reqres.setHandler("eaasset:entity", function(id){
    return API.getEntity(id);
  });

  StudioManager.reqres.setHandler("eaasset:filtered:entities", function(criteria, cb){
    return API.getFilteredCol(criteria,cb);
  });
});

