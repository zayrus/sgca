DocManager.module("DocsApp.New", function(New, DocManager, Backbone, Marionette, $, _){
  New.Document = DocManager.DocsApp.Common.Views.Form.extend({
    title: "Nuevo Documento",

    onRender: function(){
      this.$(".js-submit").text("Alta rápida documento");
    }
  });
});
