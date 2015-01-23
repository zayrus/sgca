MediaManager.module("HeaderApp", function(Header, MediaManager, Backbone, Marionette, $, _){
  
  var API = {
    listHeader: function(){
      console.log('HeaderApp API:listHeader');
      Header.List.Controller.listHeader();
    }
  };

  MediaManager.commands.setHandler("set:active:header", function(name){
    MediaManager.HeaderApp.List.Controller.setActiveHeader(name);
  });

  Header.on("start", function(){
    console.log('HeaderApp started');
    API.listHeader();
  });
});
