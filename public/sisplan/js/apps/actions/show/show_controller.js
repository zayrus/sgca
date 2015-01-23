DocManager.module("ActionsApp.Show", function(Show, DocManager, Backbone, Marionette, $, _){
  Show.Controller = {

    showAction: function(id){
      console.log('showAcion [%s]',id);
      var showLayout = new Show.Layout();

      var fetchingBudget = DocManager.request("action:entity", id);
      $.when(fetchingBudget).done(function(entity){

        console.log('Fetching [%s]',entity);
        if(entity !== undefined){
          var legacyView = new Show.Document({
            model: entity
          });
          legacyView.on("budget:edit", function(model){
            DocManager.trigger("budget:edit", model);
          });

          var headerView = new Show.Header({
            model: entity
          });

          var brandingView = new Show.Branding({
              model: entity
          });

          brandingView.on('action:edit', function(model){
            DocManager.trigger("action:edit",this.model);
          });

          showLayout.on("show", function(){
            showLayout.brandingRegion.show(brandingView);
            showLayout.headerRegion.show(headerView);
          });

          DocManager.request('action:fetch:budget',entity, null,function(budgetCol){
            console.log('BudgetCol REQUEST CB:[%s][%s]',budgetCol.length, budgetCol.whoami);
            if(budgetCol.length){
              var costoTotal = DocManager.request('action:evaluate:cost',budgetCol);

              var budgetView = new Show.ActionShowBudget({
                model: new Backbone.Model({costo_total: costoTotal}),
                collection: budgetCol
              });
              
              showLayout.on("show", function(){
                showLayout.budgetRegion.show(budgetView);
              });
            }
            DocManager.mainRegion.show(showLayout);

          });

        }
        else{
          console.log('if then else')
          legacyView = new Show.MissingDocument();
        }
      });
    },

    inlineShowAction: function(id, cb){
      console.log('inlineShowAcion [%s]',id);
      var showLayout = new Show.Layout();

      var fetchingBudget = DocManager.request("action:entity", id);
      $.when(fetchingBudget).done(function(entity){

        console.log('Fetching [%s]',entity);
        if(entity !== undefined){
          var legacyView = new Show.Document({
            model: entity
          });
          legacyView.on("budget:edit", function(model){
            DocManager.trigger("budget:edit", model);
          });

          var headerView = new Show.Header({
            model: entity
          });

          var brandingView = new Show.Branding({
              model: entity
          });

          brandingView.on('action:edit', function(model){
            window.open('#acciones/' + model.id + '/edit');
          });

          showLayout.on("show", function(){
            showLayout.brandingRegion.show(brandingView);
            showLayout.headerRegion.show(headerView);
          });

          DocManager.request('action:fetch:budget',entity, null,function(budgetCol){
            console.log('BudgetCol REQUEST CB:[%s][%s]',budgetCol.length, budgetCol.whoami);
            if(budgetCol.length){
              var costoTotal = DocManager.request('action:evaluate:cost',budgetCol);

              var budgetView = new Show.ActionShowBudget({
                model: new Backbone.Model({costo_total: costoTotal}),
                collection: budgetCol
              });
              
              showLayout.on("show", function(){
                showLayout.budgetRegion.show(budgetView);
              });
            }
            
            if(cb)
              cb(showLayout)
          });

        }else{
          console.log('if then else')
          legacyView = new Show.MissingDocument();
        }
      });
    }
 
  }
});
