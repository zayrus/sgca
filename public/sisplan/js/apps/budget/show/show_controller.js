DocManager.module("BudgetApp.Show", function(Show, DocManager, Backbone, Marionette, $, _){
  Show.Controller = {

    showBudget: function(id){
      console.log('showBudget [%s]',id);
      var documLayout = new Show.Layout();

      var fetchingBudget = DocManager.request("budget:entity", id);
      $.when(fetchingBudget).done(function(document){
        var budgetView;

        if(document !== undefined){
          //var itemCol = new DocManager.Entities.DocumItemsCollection(document.get('items'));
          budgetView = new Show.Document({
            model: document
          });
          documentHeader = new Show.Header({
            model: document
          });

          brandingView = new Show.Branding({
              model: document
          });

          // documentItems = new Show.DocumentItems({
          //   collection: itemCol
          // });
console.log('cinco')
 
          documLayout.on("show", function(){
            documLayout.brandingRegion.show(brandingView);
            documLayout.headerRegion.show(documentHeader);
            //documLayout.mainRegion.show(documentItems);
          });


          budgetView.on("budget:edit", function(model){
            DocManager.trigger("budget:edit", model);
          });
        }
        else{
          budgetView = new Show.MissingDocument();
        }

        DocManager.mainRegion.show(documLayout);
      });
    }
  }
});
