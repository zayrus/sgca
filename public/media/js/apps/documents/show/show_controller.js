DocManager.module("DocsApp.Show", function(Show, DocManager, Backbone, Marionette, $, _){
  Show.Controller = {

    showDocument: function(id){
      console.log('showDocument [%s]',id);
      var documLayout = new Show.Layout();

      var fetchingDocument = DocManager.request("document:entity", id);
      $.when(fetchingDocument).done(function(document){
        var documentView;
        if(document !== undefined){
          var itemCol = new DocManager.Entities.DocumItemsCollection(document.get('items'));

/*          if(document.get('tipocomp') === 'ptecnico'){
            itemCol = new DocManager.Entities.PTecnicoItems(document.get('items'));
            //console.log('Tipcomp= ptecnico [%s]',itemCol.length);
          } else if(document.get('tipocomp') === 'nrecepcion' || document.get('tipocomp') === 'nentrega'){
            itemCol = new DocManager.Entities.MovimREItems(document.get('items'));
          } else if(document.get('tipocomp') === 'pemision'){
            itemCol = new DocManager.Entities.MovimREItems(document.get('items'));
          }
*/
          documentView = new Show.Document({
            model: document
          });
          documentHeader = new Show.Header({
            model: document
          });

          brandingView = new Show.Branding({
              model: document
          });

          documentItems = new Show.DocumentItems({
            collection: itemCol
          });
 
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
