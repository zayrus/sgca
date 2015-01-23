StudioManager.module("HeaderApp", function(Header, StudioManager, Backbone, Marionette, $, _){
  
  var API = {
    listHeader: function(){
      console.log('HeaderApp API:listHeader');
      Header.List.Controller.listHeader();
    }
  };

  StudioManager.commands.setHandler("set:active:header", function(name){
    StudioManager.HeaderApp.List.Controller.setActiveHeader(name);
  });

  Header.on("start", function(){
    console.log('HeaderApp started');
    API.listHeader();
  });
});
