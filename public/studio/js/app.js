var StudioManager = new Marionette.Application();

StudioManager.addRegions({
  headerRegion: "#header-region",
  mainRegion: "#main-region",
  footerRegion: "#footer-region",
  dialogRegion: Marionette.Region.Dialog.extend({
    el: "#dialog-region"
  })
  
});

StudioManager.navigate = function(route,  options){
  console.log('StudioManager.navigate: app.js')
  options || (options = {});
  Backbone.history.navigate(route, options);
};

StudioManager.getCurrentRoute = function(){
  console.log('StudioManager.getCurretnRoute: app.js')
  return Backbone.history.fragment
};

StudioManager.on("initialize:after", function(){
  console.log('StudioManager History start: initialize:after');
  if(Backbone.history){
    Backbone.history.start();

    if(this.getCurrentRoute() === ""){
      StudioManager.trigger("productions:list");
    }
  }
});
