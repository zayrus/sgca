DocManager.module("DocsApp", function(DocsApp, DocManager, Backbone, Marionette, $, _){

  DocsApp.Router = Marionette.AppRouter.extend({
    appRoutes: {
      "comprobantes(/filter/criterion::criterion)": "listDocuments",
      "comprobantes/:id": "showDocument",
      "comprobantes/:id/edit": "editDocument"
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

    listDocuments: function(criterion){
      console.log('API: listDocuments');
      DocsApp.List.Controller.listDocuments(criterion);
      DocManager.execute("set:active:header", "comprobantes");
    },

    showDocument: function(id){
      console.log('API: show document')
      DocsApp.Show.Controller.showDocument(id);
      DocManager.execute("set:active:header", "comprobantes");
    },

    editDocument: function(id){
      console.log('API: edit document')
      DocsApp.Edit.Controller.editDocument(id);
      DocManager.execute("set:active:header", "comprobantes");
    }
  };

  DocManager.on("documents:filter", function(criterion){
    if(criterion){
      DocManager.navigate("comprobantes/filter/criterion:" + criterion);
    }
    else{
      DocManager.navigate("comprobantes");
    }
  });


  DocManager.on("products:list", function(){
    API.listProducts();
  });

  DocManager.on("projects:list", function(){
    API.listProjects();
  });


  DocManager.on("documents:list", function(){
    DocManager.navigate("comprobantes");
    API.listDocuments();
  });

  DocManager.on("document:show", function(id){
    DocManager.navigate("comprobantes/" + id);
    API.showDocument(id);
  });

  DocManager.on("document:edit", function(model){
    var documid = model.id || model.get('documid');
    DocManager.navigate("comprobantes/" + documid + "/edit");
    API.editDocument(documid);
  });

  DocManager.addInitializer(function(){
    new DocsApp.Router({
      controller: API
    });
  });
});
