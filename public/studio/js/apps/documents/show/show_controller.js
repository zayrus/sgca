StudioManager.module("DocsApp.Show", function(Show, StudioManager, Backbone, Marionette, $, _){
  Show.Controller = {

    showDocument: function(id){
      console.log('showDocument [%s]',id);
      var documLayout = new Show.Layout();

      var fetchingDocument = StudioManager.request("document:entity", id);
      $.when(fetchingDocument).done(function(document){
        var documentView;
        if(document !== undefined){
          var itemCol = new StudioManager.Entities.DocumItemsCollection(document.get('items'));

/*          if(document.get('tipocomp') === 'ptecnico'){
            itemCol = new StudioManager.Entities.PTecnicoItems(document.get('items'));
            //console.log('Tipcomp= ptecnico [%s]',itemCol.length);
          } else if(document.get('tipocomp') === 'nrecepcion' || document.get('tipocomp') === 'nentrega'){
            itemCol = new StudioManager.Entities.MovimREItems(document.get('items'));
          } else if(document.get('tipocomp') === 'pemision'){
            itemCol = new StudioManager.Entities.MovimREItems(document.get('items'));
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
            StudioManager.trigger("document:edit", model);
          });
        }
        else{
          documentView = new Show.MissingDocument();
        }

        StudioManager.mainRegion.show(documLayout);
      });
    }
  }
});
