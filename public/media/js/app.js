var MediaManager = new Marionette.Application();

MediaManager.addRegions({
  headerRegion: "#header-region",
  mainRegion: "#main-region",
  footerRegion: "#footer-region",
  dialogRegion: Marionette.Region.Dialog.extend({
    el: "#dialog-region"
  })
  
});

MediaManager.navigate = function(route,  options){
  console.log('MediaManager.navigate: app.js')
  options || (options = {});
  Backbone.history.navigate(route, options);
};

MediaManager.getCurrentRoute = function(){
  console.log('MediaManager.getCurretnRoute: app.js')
  return Backbone.history.fragment
};

MediaManager.on("initialize:after", function(){
  console.log('MediaManager History start: initialize:after');
  if(Backbone.history){
    Backbone.history.start();

    if(this.getCurrentRoute() === ""){
      MediaManager.trigger("media:show");
    }
  }
});
