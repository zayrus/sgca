StudioManager.module("MediaApp", function(MediaApp, StudioManager, Backbone, Marionette, $, _){

  MediaApp.Router = Marionette.AppRouter.extend({
    appRoutes: {
      "show/:id": "showMedia",
      "show": "showEmptyMedia",
    }
  });

  var API = {

    listProducts: function(criterion){
      console.log('API: listProducts');
      window.open('/#navegar/productos');
    },

    showMedia: function(id){
      console.log('API: show media')
      MediaApp.Show.Controller.showMedia(id);
      //StudioManager.execute("set:active:header", "show");
    },

    showEmptyMedia: function(){
      console.log('API: show empty media')
      MediaApp.Show.Controller.showMedia();
      //StudioManager.execute("set:active:header", "show");
    },

    cathalogMedia: function(id){
      console.log('API: edit media')
      MediaApp.Edit.Controller.editMedia(id);
      //StudioManager.execute("set:active:header", "catalogacion");
    }
  };

  StudioManager.on("media:show", function(id){
    StudioManager.navigate("show/" + id);
    API.showMedia(id);
  });

  StudioManager.on("media:cathalog", function(id){
    StudioManager.navigate("show/" + id + "/catalogacion");
    API.cathalogtMedia(id);
  });

  StudioManager.on("products:list", function(){
    API.listProducts();
  });


  StudioManager.addInitializer(function(){
    new MediaApp.Router({
      controller: API
    });
  });
});
