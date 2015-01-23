DocManager.module("HomeApp", function(HomeApp, DocManager, Backbone, Marionette, $, _){
	HomeApp.Router = Marionette.AppRouter.extend({
		appRoutes: {
			"rondas": "showHome",
			"logout": "showHome",
    }
	});

  var API = {

	showHome: function(){
			console.log('API: showHome');
	  	HomeApp.Show.Controller.showHome();
    },
		
	};

  DocManager.on("home:show", function(){
    DocManager.navigate("rondas");
    API.showHome(); 
  });

  DocManager.addInitializer(function(){
		new HomeApp.Router({
			controller: API
    });
  });
});