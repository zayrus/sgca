DocManager.module("HeaderApp.List", function(List, DocManager, Backbone, Marionette, $, _){
  List.Controller = {
    listHeader: function(){
      var links = DocManager.request("header:entities");

      dao.gestionUser.getUser(DocManager, function (user){
        user = (user || new User());

        var headers = new List.Headers({collection: links, model: user});

        headers.on("brand:clicked", function(){
          DocManager.trigger("actions:list");
        });

        headers.on("childview:navigate", function(childView, model){
          var trigger = model.get("navigationTrigger");
          DocManager.trigger(trigger);
        });

        DocManager.headerRegion.show(headers);

      });

    },

    setActiveHeader: function(headerUrl){
      var links = DocManager.request("header:entities");
      var headerToSelect = links.find(function(header){ return header.get("url") === headerUrl; });
      console.log('headerToSolect: [%s] [%s]', headerToSelect.get('url'), headerToSelect.get('name') )
      headerToSelect.select();
      links.trigger("reset");
    }
  };
});
