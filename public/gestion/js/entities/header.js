DocManager.module("Entities", function(Entities, DocManager, Backbone, Marionette, $, _){

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
      { name: "Solicitudes", url: "navegar/solicitudes", navigationTrigger: "sol:list" },
      { name: "Gestión", url: "comprobantes", navigationTrigger: "documents:list" },
      { name: "Productos", url: "productos", navigationTrigger: "products:list" },
      { name: "Acerca de", url: "about", navigationTrigger: "about:show" }
    ]);
  };

  var initdocumheaders = function(){
    Entities.documitems = new Entities.HeaderCollection([
      { name: "Documento", url: "nuevo", navigationTrigger: "document:new" },
      { name: "Informe", url: "reporte", navigationTrigger: "report:new" },
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


  var initreportheaders = function(){
    Entities.reportitems = new Entities.HeaderCollection([
      { name: "Nuevo", url: "nuevo", navigationTrigger: "report:new" },
      { name: "Lista", url: "lista", navigationTrigger: "reports:list" }
    ]);
  };

  var initreportitemheaders = function(){
    Entities.reportedititems = new Entities.HeaderCollection([
      { name: "nuevo", url: "nuevo", navigationTrigger: "report:new" },
      { name: "lista", url: "lista", navigationTrigger: "reports:list" }
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

    getReportEditCol: function(){
      if(Entities.reportedititems === undefined){
        initreportitemheaders();
      }
      return Entities.reportedititems;
    }    
  };

  DocManager.reqres.setHandler("header:entities", function(){
    return API.getHeaders();
  });
  DocManager.reqres.setHandler("docum:nav:entities", function(){
    return API.getDocumNavCol();
  });
  DocManager.reqres.setHandler("docum:edit:entities", function(){
    return API.getDocumEditCol();
  });

  DocManager.reqres.setHandler("report:edit:entities", function(){
    return API.getReportEditCol();
  });


});
