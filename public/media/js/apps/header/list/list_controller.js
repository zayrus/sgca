MediaManager.module("HeaderApp.List", function(List, MediaManager, Backbone, Marionette, $, _){
  List.Controller = {
    listHeader: function(){
      var links = MediaManager.request("header:entities");
      console.log('listHeader BEGINS  [%s]', links.length);
      dao.gestionUser.getUser(MediaManager, function (user){
        console.log('listHeader USER FOUND! [%s]', user.get('username'))
        user = (user || new User());

        var headers = new List.Headers({collection: links, model: user});

        headers.on("brand:clicked", function(){
          MediaManager.trigger("documents:list");
        });

        headers.on("itemview:navigate", function(childView, model){
          var trigger = model.get("navigationTrigger");
          MediaManager.trigger(trigger);
        });

        MediaManager.headerRegion.show(headers);


      });

    },

    setActiveHeader: function(headerUrl){
      //console.log('Set Active Header headerUrl [%s]',headerUrl);
      var links = MediaManager.request("header:entities");
      var headerToSelect = links.find(function(header){ return header.get("url") === headerUrl; });
      headerToSelect.select();
      links.trigger("reset");
    }
  };
});
