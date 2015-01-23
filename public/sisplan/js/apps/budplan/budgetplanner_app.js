DocManager.module("BudplanApp", function(BudplanApp, DocManager, Backbone, Marionette, $, _){

  BudplanApp.Router = Marionette.AppRouter.extend({
    appRoutes: {
      //"presupuestos(/filter/criterion::criterion)": "budgetPlanner",
      "analizar/presupuesto": "budgetPlanner",
    }
  });

  var API = {

    budgetPlanner: function(){
      console.log('API: budgetAnalyse');
      BudplanApp.List.Controller.budgetPlanner();
      DocManager.execute("set:active:header", "analyser");
    },

  };

  DocManager.on("budget:planner", function(){
    DocManager.navigate("analizar/presupuesto");
    API.budgetPlanner();
  });


  DocManager.addInitializer(function(){
    new BudplanApp.Router({
      controller: API
    });
  });
});
