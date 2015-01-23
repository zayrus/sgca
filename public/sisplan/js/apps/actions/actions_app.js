DocManager.module("ActionsApp", function(ActionsApp, DocManager, Backbone, Marionette, $, _){

  ActionsApp.Router = Marionette.AppRouter.extend({
    appRoutes: {
      "acciones(/filter/criterion::criterion)": "listActions",
      "acciones/informe": "reportActions",
      "acciones/:id/edit": "editAction",
      "acciones/:id": "showAction",
    }
  });

  var API = {
    editAction: function(id){
      console.log('API: edit accion', id)
      ActionsApp.Edit.Controller.editAction(id);
      DocManager.execute("set:active:header", "acciones");
    },
    reportActions: function(col, opt){
      console.log('API: reportActions');
      ActionsApp.List.Controller.reportActions();
      //DocManager.execute("set:active:header", "acciones");
    },
    listActions: function(criterion){
      console.log('API: listActions');
      ActionsApp.List.Controller.listActions(criterion);
      DocManager.execute("set:active:header", "acciones");
    },
    createNewAction: function(){
      console.log('API: createNewAction');
      DocManager.execute("set:active:header", "nuevaaccion");
      DocManager.request("action:create:new");
    },
    showAction: function(id){
      console.log('API: show action')
      ActionsApp.Show.Controller.showAction(id);
      //DocManager.execute("set:active:header", "presupuestos");
    },
  };

  DocManager.on("action:show", function(id){
    DocManager.navigate("acciones/" + id);
    API.showAction(id);
  });

  DocManager.on("action:new", function(){
    DocManager.navigate("acciones/nueva");
    API.createNewAction();
  });

  DocManager.on("actions:list", function(){
    DocManager.navigate("acciones");
    API.listActions();
  });

  DocManager.on("actions:report", function(){
    console.log('actions_app')
    DocManager.navigate("acciones/informe");
    API.reportActions();
  });

  DocManager.on("action:edit", function(model){
    var entityid = model.id;
    DocManager.navigate("acciones/" + entityid + "/edit");
    API.editAction(entityid);
  });

  DocManager.addInitializer(function(){
    new ActionsApp.Router({
      controller: API
    });
  });
});
