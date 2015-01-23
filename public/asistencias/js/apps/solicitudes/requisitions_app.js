DocManager.module("RequisitionApp", function(RequisitionApp, DocManager, Backbone, Marionette, $, _){

  RequisitionApp.Router = Marionette.AppRouter.extend({
    appRoutes: {
      "solicitudes/nueva": "addRequisition",
      "solicitudes/:id/edit": "editRequisition",
      "solicitudes/:id": "showRequisition",



      "solicitudes(/filter/criterion::criterion)": "listRequisitions",
      "reportes(/filter/criterion::criterion)": "listReports",
      "reportes/:id": "showReport",
      "reportes/:id/edit": "editReport"    }
  });

  var API = {

    editRequisition: function(id){
      console.log('API: edit requisition [%s]', id)
      RequisitionApp.Edit.Controller.editRequisition(id);
      //DocManager.execute("set:active:header", "solicitudes");
    },

    addRequisition: function(){
      console.log('API: add requisition')
      RequisitionApp.Edit.Controller.addRequisition();
      //DocManager.execute("set:active:header", "solicitudes");
    },

    showRequisition: function(id){
      console.log('API: show requisition')
      RequisitionApp.Show.Controller.showRequisition(id);
      //DocManager.execute("set:active:header", "solicitudes");
    },



    //old stuff
    listSol: function(criterion){
      console.log('API: listSol');
      window.open('/#navegar/solicitudes');
    },

    listRequisitions: function(criterion){
      console.log('API: listRequisitions');
      RequisitionApp.List.Controller.listRequisitions(criterion);
      DocManager.execute("set:active:header", "solicitudes");
    },

 
    listReports: function(criterion){
      console.log('API: listReports');
      RequisitionApp.Report.List.Controller.listReports(criterion);
      DocManager.execute("set:active:header", "solicitudes");
    },

    showReport: function(id){
      console.log('API: show requisition')
      RequisitionApp.Report.Show.Controller.showReport(id);
      DocManager.execute("set:active:header", "solicitudes");
    },

    editReport: function(id){
      console.log('API: edit requisition')
      RequisitionApp.Report.Edit.Controller.editReport(id);
      DocManager.execute("set:active:header", "solicitudes");
    }

  };



  DocManager.on("requisition:show", function(id){
    DocManager.navigate("solicitudes/" + id);
    API.showRequisition(id);
  });

  DocManager.on("requisition:edit", function(model){
    var documid = model.id || model.get('documid');
    DocManager.navigate("solicitudes/" + documid + "/edit");
    API.editRequisition(documid);
  });

  DocManager.on("requisition:add", function(){
    DocManager.navigate("solicitudes/nueva");
    API.addRequisition();
  });



  //old stuff
  DocManager.on("requisitions:list", function(){
    DocManager.navigate("solicitudes");
    API.listRequisitions();
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

  DocManager.on("products:list", function(){
    API.listProducts();
  });
  
  DocManager.on("sol:list", function(){
    API.listSol();
  });
  
  DocManager.on("projects:list", function(){
    API.listProjects();
  });

  DocManager.on("requisitions:filter", function(criterion){
    if(criterion){
      DocManager.navigate("solicitudes/filter/criterion:" + criterion);
    }
    else{
      DocManager.navigate("solicitudes");
    }
  });





  DocManager.addInitializer(function(){
    new RequisitionApp.Router({
      controller: API
    });
  });
});
