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
      { name: "Acciones",     url: "acciones",    navigationTrigger: "actions:list" },
      { name: "Presupuestos", url: "presupuestos", navigationTrigger: "budgets:list" },
      { name: "Analizar presupuesto", url: "analyser", navigationTrigger: "budget:planner" },
      { name: "Nueva Acción", url: "nuevaaccion", navigationTrigger: "action:new" }
    ]);
  };

  var initactionlistheaders = function(){
    Entities.actionlistitems = new Entities.HeaderCollection([
      { name: "imprimir", url: "imprimir", navigationTrigger: "imprimir:registros" },
    ]);
  };
  var initactioneditheaders = function(){
    Entities.actionedititems = new Entities.HeaderCollection([
      //{ name: "nuevo", url: "nuevo", navigationTrigger: "action:new" },
    ]);
  };

  var initbudgeteditheaders = function(){
    Entities.budgetedititems = new Entities.HeaderCollection([
      { name: "exportar", url: "exportar", navigationTrigger: "exportar:registros" },
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

    getActionListCol: function(){
      if(Entities.actionlistitems === undefined){
        initactionlistheaders();
      }
      return Entities.actionlistitems;
    },
    getActionEditCol: function(){
      if(Entities.actionedititems === undefined){
        initactioneditheaders();
      }
      return Entities.actionedititems;
    },
    getBudgetEditCol: function(){
      if(Entities.budgetedititems === undefined){
        initbudgeteditheaders();
      }
      return Entities.budgetedititems;
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

  DocManager.reqres.setHandler("action:edit:entities", function(){
    return API.getActionEditCol();
  });
  DocManager.reqres.setHandler("action:list:entities", function(){
    return API.getActionListCol();
  });


  DocManager.reqres.setHandler("budget:nav:entities", function(){
    return API.getBudgetEditCol();
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
