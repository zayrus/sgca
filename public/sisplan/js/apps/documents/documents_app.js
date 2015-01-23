DocManager.module("DocsApp", function(DocsApp, DocManager, Backbone, Marionette, $, _){

  DocsApp.Router = Marionette.AppRouter.extend({
    appRoutes: {
      "comprobantes(/filter/criterion::criterion)": "listDocuments",
      "comprobantes/:id": "showDocument",
      "comprobantes/:id/edit": "editDocument",
      "solicitudes/nueva": "editDocument",
      "reportes(/filter/criterion::criterion)": "listReports",
      "reportes/:id": "showReport",
      "reportes/:id/edit": "editReport"    }
  });

  var API = {

    listProducts: function(criterion){
      console.log('API: listProducts');
      window.open('/#navegar/productos');
    },
    listSol: function(criterion){
      console.log('API: listSol');
      window.open('/#navegar/solicitudes');
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
      console.log('API: edit document', id)
      //elige el layout normal o el de solicitudes
            // console.log('es tipo nsolicitud')
            //  DocsApp.SolEdit.Controller.editDocument(id);
            //  DocManager.execute("set:active:header", "comprobantes");
      DocsApp.Edit.Controller.editDocument(id);
      DocManager.execute("set:active:header", "comprobantes");
    },

    listReports: function(criterion){
      console.log('API: listReports');
      DocsApp.Report.List.Controller.listReports(criterion);
      DocManager.execute("set:active:header", "comprobantes");
    },

    showReport: function(id){
      console.log('API: show document')
      DocsApp.Report.Show.Controller.showReport(id);
      DocManager.execute("set:active:header", "comprobantes");
    },

    editReport: function(id){
      console.log('API: edit document')
      DocsApp.Report.Edit.Controller.editReport(id);
      DocManager.execute("set:active:header", "comprobantes");
    }

  };


  DocManager.on("products:list", function(){
    API.listProducts();
  });
   DocManager.on("sol:list", function(){
    API.listSol();
  });

  DocManager.on("projects:list", function(){
    API.listProjects();
  });

  DocManager.on("documents:filter", function(criterion){
    if(criterion){
      DocManager.navigate("comprobantes/filter/criterion:" + criterion);
    }
    else{
      DocManager.navigate("comprobantes");
    }
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
    //agrego tipo de comprobante para filtrar los nsolicitud y q se editen con un layout diferente al resto
    //var tcompro = model.tipocomp || model.get('tipocomp');
    //agregue tcompro
    DocManager.navigate("comprobantes/" + documid + "/edit");
    API.editDocument(documid);
  });

  DocManager.on("reports:list", function(){
    DocManager.navigate("reportes");
    API.listReports();
  });

  DocManager.on("report:show", function(id){
    DocManager.navigate("reportes/" + id);
    API.showReport(id);
  });

  DocManager.on("report:edit", function(model){
    var reportid = model.id || model.get('reportid');
    DocManager.navigate("reportes/" + reportid + "/edit");
    API.editReport(reportid);
  });


  DocManager.addInitializer(function(){
    new DocsApp.Router({
      controller: API
    });
  });
});
