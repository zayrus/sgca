DocManager.module("HeaderApp", function(Header, DocManager, Backbone, Marionette, $, _){
  
  var API = {
    listHeader: function(){
      console.log('listHeader');
      Header.List.Controller.listHeader();
    }
  };

  DocManager.commands.setHandler("set:active:header", function(name){
    DocManager.HeaderApp.List.Controller.setActiveHeader(name);
  });

  Header.on("start", function(){
    //console.log('header app started');
    API.listHeader();
  });
});
