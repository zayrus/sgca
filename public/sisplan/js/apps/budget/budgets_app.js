DocManager.module("BudgetApp", function(BudgetApp, DocManager, Backbone, Marionette, $, _){

  BudgetApp.Router = Marionette.AppRouter.extend({
    appRoutes: {
      "presupuestos(/filter/criterion::criterion)": "listBudgets",
      "presupuestos/:id/edit": "editBudget",
      "presupuestos/:id/edit": "editBudget",
      "presupuestos/:id": "showBudget",
      "costo/accion/:id/edit": "buildBudget",
    }
  });

  var API = {

    listBudgets: function(criterion){
      console.log('API: listBudgets');
      BudgetApp.List.Controller.listBudgets(criterion);
      DocManager.execute("set:active:header", "presupuestos");
    },

    buildBudget: function(id){
      console.log('API: buidlBudget');
      BudgetApp.Build.Controller.buildBudget(id);
      //DocManager.execute("set:active:header", "presupuestos");
    },

    showBudget: function(id){
      console.log('API: show budget')
      BudgetApp.Show.Controller.showBudget(id);
      //DocManager.execute("set:active:header", "presupuestos");
    },

    editBudget: function(id){
      console.log('API: edit budget', id)
      BudgetApp.Edit.Controller.editBudget(id);
      //DocManager.execute("set:active:header", "presupuestos");
    },

  };


  DocManager.on("budget:filter", function(criterion){
    if(criterion){
      DocManager.navigate("presupuestos/filter/criterion:" + criterion);
    }
    else{
      DocManager.navigate("presupuestos");
    }
  });

  DocManager.on("budgets:list", function(){
    DocManager.navigate("presupuestos");
    API.listBudgets();
  });

  DocManager.on("budget:show", function(id){
    DocManager.navigate("presupuestos/" + id);
    API.showBudget(id);
  });

  DocManager.on("budget:edit", function(model){
    var budgetid = model.id;
    DocManager.navigate("presupuestos/" + budgetid + "/edit");
    API.editBudget(budgetid);
  });

  DocManager.on("budget:build", function(model){
    var actionid = model.id;
    DocManager.navigate("costo/accion/" + actionid + "/edit");
    API.buildBudget(actionid);
  });

  DocManager.addInitializer(function(){
    new BudgetApp.Router({
      controller: API
    });
  });
});
