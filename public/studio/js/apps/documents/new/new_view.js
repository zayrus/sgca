StudioManager.module("DocsApp.New", function(New, StudioManager, Backbone, Marionette, $, _){
  New.Document = StudioManager.DocsApp.Common.Views.Form.extend({
    title: "Nuevo Documento",

    onRender: function(){
      this.$(".js-submit").text("Alta rápida documento");
    }
  });
});
