var DocManager = new Marionette.Application();

DocManager.addRegions({
  headerRegion: "#header-region",
  mainRegion: "#main-region",
  footerRegion: "#footer-region",
  dialogRegion: Marionette.Region.Dialog.extend({
    el: "#dialog-region"
  })
  
});

DocManager.navigate = function(route,  options){
  console.log('DocManager.navigate: app.js')
  options || (options = {});
  Backbone.history.navigate(route, options);
};

DocManager.getCurrentRoute = function(){
  console.log('DoCManager.getCurretnRoute: app.js')
  return Backbone.history.fragment
};

DocManager.on("start", function(){
  console.log('DocManager History start: start');
  if(Backbone.history){
    Backbone.history.start();
  }
});
