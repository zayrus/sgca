MediaManager.module("MediaApp", function(MediaApp, MediaManager, Backbone, Marionette, $, _){

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
      //MediaManager.execute("set:active:header", "show");
    },

    showEmptyMedia: function(){
      console.log('API: show empty media')
      MediaApp.Show.Controller.showMedia();
      //MediaManager.execute("set:active:header", "show");
    },

    cathalogMedia: function(id){
      console.log('API: edit media')
      MediaApp.Edit.Controller.editMedia(id);
      //MediaManager.execute("set:active:header", "catalogacion");
    }
  };

  MediaManager.on("media:show", function(id){
    MediaManager.navigate("show/" + id);
    API.showMedia(id);
  });

  MediaManager.on("media:cathalog", function(id){
    MediaManager.navigate("show/" + id + "/catalogacion");
    API.cathalogtMedia(id);
  });

  MediaManager.on("products:list", function(){
    API.listProducts();
  });


  MediaManager.addInitializer(function(){
    new MediaApp.Router({
      controller: API
    });
  });
});
