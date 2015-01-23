StudioManager.module("HeaderApp.List", function(List, StudioManager, Backbone, Marionette, $, _){
  List.Controller = {
    listHeader: function(){
      var links = StudioManager.request("header:entities");
      console.log('listHeader BEGINS  [%s]', links.length);
      dao.gestionUser.getUser(StudioManager, function (user){
        console.log('listHeader USER FOUND! [%s]', user.get('username'))
        user = (user || new User());

        var headers = new List.Headers({collection: links, model: user});

        headers.on("brand:clicked", function(){
          StudioManager.trigger("documents:list");
        });

        headers.on("itemview:navigate", function(childView, model){
          var trigger = model.get("navigationTrigger");
          StudioManager.trigger(trigger);
        });

        StudioManager.headerRegion.show(headers);


      });

    },

    setActiveHeader: function(headerUrl){
      //console.log('Set Active Header headerUrl [%s]',headerUrl);
      var links = StudioManager.request("header:entities");
      var headerToSelect = links.find(function(header){ return header.get("url") === headerUrl; });
      headerToSelect.select();
      links.trigger("reset");
    }
  };
});
