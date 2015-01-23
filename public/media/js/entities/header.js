MediaManager.module("Entities", function(Entities, MediaManager, Backbone, Marionette, $, _){

  Entities.Header = Backbone.Model.extend({
    initialize: function(){
      var selectable = new Backbone.Picky.Selectable(this);
      _.extend(this, selectable);
    }
  });

  Entities.HeaderCollection = Backbone.Collection.extend({
    model: Entities.Header,

    initialize: function(){
      var singleSelect = new Backbone.Picky.SingleSelect(this);
      _.extend(this, singleSelect);
    }
  });

  var initializeHeaders = function(){
    Entities.headeritems = new Entities.HeaderCollection([
      { name: "Procedencias", url: "proyectos", navigationTrigger: "projects:list" },
      { name: "Gestión", url: "comprobantes", navigationTrigger: "documents:list" },
      { name: "Productos", url: "productos", navigationTrigger: "products:list" },
    ]);
  };

  var initdocumheaders = function(){
    Entities.documitems = new Entities.HeaderCollection([
      { name: "Nuevo", url: "nuevo", navigationTrigger: "document:new" },
      { name: "Lista", url: "lista", navigationTrigger: "documents:list" }
    ]);
  };

  var initdocumitemheaders = function(){
    Entities.documedititems = new Entities.HeaderCollection([
      { name: "nuevo", url: "nuevo", navigationTrigger: "document:new" },
      { name: "renglón", url: "nuevorenglon", navigationTrigger: "document:item:new" },
      { name: "lista", url: "lista", navigationTrigger: "documents:list" }
    ]);
  };

  var initmediaheaders = function(){
    Entities.mediaitems = new Entities.HeaderCollection([
      { name: "Productos",  url: "productos", navigationTrigger: "products:list" },
    ]);
  };


  var API = {
    getHeaders: function(){
      if(Entities.headeritems === undefined){
        initializeHeaders();
      }
      return Entities.headeritems;
    },
    getDocumNavCol: function(){
      if(Entities.documitems === undefined){
        initdocumheaders();
      }
      return Entities.documitems;
    },
    getDocumEditCol: function(){
      if(Entities.documedititems === undefined){
        initdocumitemheaders();
      }
      return Entities.documedititems;
    },
    getMediaNavCol: function(){
      if(Entities.mediaitems === undefined){
        initmediaheaders();
      }
      return Entities.mediaitems;
    }
  };

  MediaManager.reqres.setHandler("header:entities", function(){
    return API.getHeaders();
  });
  MediaManager.reqres.setHandler("docum:nav:entities", function(){
    return API.getDocumNavCol();
  });
  MediaManager.reqres.setHandler("docum:edit:entities", function(){
    return API.getDocumEditCol();
  });
  MediaManager.reqres.setHandler("media:nav:entities", function(){
    return API.getMediaNavCol();
  });


});
