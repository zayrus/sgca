StudioManager.module("DocsApp", function(DocsApp, StudioManager, Backbone, Marionette, $, _){

  DocsApp.Router = Marionette.AppRouter.extend({
    appRoutes: {
      "producciones(/filter/criterion::criterion)": "listProductions",
      "producciones/:id": "showDocument",
      "producciones/:id/edit": "editProduction"
    }
  });

  var API = {

    listProducts: function(criterion){
      console.log('API: listProducts');
      window.open('/#navegar/productos');
    },

    listProjects: function(criterion){
      console.log('API: listProjects');
      window.location = '/#navegar/proyectos';
    },

    listProductions: function(criterion){
      console.log('API: listProductions');
      DocsApp.List.Controller.listDocuments(criterion);
      StudioManager.execute("set:active:header", "producciones");
    },

    showDocument: function(id){
      console.log('API: show document')
      DocsApp.Show.Controller.showDocument(id);
      StudioManager.execute("set:active:header", "producciones");
    },

    editProduction: function(id){
      console.log('API: edit production')
      DocsApp.Edit.Controller.editProduction(id);
      StudioManager.execute("set:active:header", "producciones");
    },

    editDocument: function(id){
      console.log('API: edit document')
      DocsApp.Edit.Controller.editDocument(id);
      StudioManager.execute("set:active:header", "producciones");
    }
  };

  StudioManager.on("documents:filter", function(criterion){
    if(criterion){
      StudioManager.navigate("producciones/filter/criterion:" + criterion);
    }
    else{
      StudioManager.navigate("producciones");
    }
  });


  StudioManager.on("product:list", function(){
    API.listProducts(); 
  });

  StudioManager.on("projects:list", function(){
    API.listProjects();
  });


  StudioManager.on("productions:list", function(){
    StudioManager.navigate("producciones");
    API.listProductions();
  });

  StudioManager.on("production:show", function(id){
    StudioManager.navigate("producciones/" + id);
    API.showDocument(id);
  });

  StudioManager.on("production:edit", function(model){
    var documid = model.id || model.get('ea_productionId');
    StudioManager.navigate("producciones/" + documid + "/edit");
    API.editProduction(documid);
  });

  StudioManager.addInitializer(function(){
    new DocsApp.Router({
      controller: API
    });
  });
});
