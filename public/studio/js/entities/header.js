StudioManager.module("Entities", function(Entities, StudioManager, Backbone, Marionette, $, _){

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
      { name: "Producciones", url: "producciones", navigationTrigger: "productions:list" },
    ]);
  };

  var initproductionsheaders = function(){
    Entities.documitems = new Entities.HeaderCollection([
      { name: "Nuevo", url: "nuevo", navigationTrigger: "production:new" },
      { name: "Lista", url: "lista", navigationTrigger: "productions:list" },
      { name: "Productos", url: "productos", navigationTrigger: "product:list" }
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
      //{ name: "Producciones",  url: "producciones", navigationTrigger: "producciones:list" },
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
    getProductionsNavCol: function(){
      if(Entities.documitems === undefined){
        initproductionsheaders();
      }
      return Entities.documitems;
    },
    getDocumEditCol: function(){
      if(Entities.documedititems === undefined){
        initdocumitemheaders();
      }
      return Entities.documedititems;
    },
    getProductionEditCol: function(){
      if(Entities.documedititems === undefined){
        initproductionsheaders();
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

  StudioManager.reqres.setHandler("header:entities", function(){
    return API.getHeaders();
  });
  StudioManager.reqres.setHandler("productions:nav:entities", function(){
    return API.getProductionsNavCol();
  });
  StudioManager.reqres.setHandler("docum:edit:entities", function(){
    return API.getDocumEditCol();
  });
  StudioManager.reqres.setHandler("production:edit:entities", function(){
    return API.getProductionEditCol();
  });
  StudioManager.reqres.setHandler("media:nav:entities", function(){
    return API.getMediaNavCol();
  });


});
