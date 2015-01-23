DocManager.module("DocsApp.Show", function(Show, DocManager, Backbone, Marionette, $, _){
  Show.Controller = {

    showDocument: function(id){
      console.log('showDocument [%s]',id);
      var documLayout = new Show.Layout();

      var fetchingDocument = DocManager.request("document:entity", id);
      $.when(fetchingDocument).done(function(document){
        var documentView;
console.log('cero')
        if(document !== undefined){
          var itemCol = new DocManager.Entities.DocumItemsCollection(document.get('items'));
console.log('uno')
          documentView = new Show.Document({
            model: document
          });
console.log('dos')
          documentHeader = new Show.Header({
            model: document
          });

console.log('tres')
          brandingView = new Show.Branding({
              model: document
          });
console.log('cuatro')

          documentItems = new Show.DocumentItems({
            collection: itemCol
          });
console.log('cinco')
 
          documLayout.on("show", function(){
            documLayout.brandingRegion.show(brandingView);
            documLayout.headerRegion.show(documentHeader);
            documLayout.mainRegion.show(documentItems);
          });


          documentView.on("document:edit", function(model){
            DocManager.trigger("document:edit", model);
          });
        }
        else{
          documentView = new Show.MissingDocument();
        }

        DocManager.mainRegion.show(documLayout);
      });
    }
  }
});
