DocManager.module("Entities", function(Entities, DocManager, Backbone, Marionette, $, _){
	Entities.Home = Backbone.Model.extend({
		urlRoot: "/rondas",
		whoami: 'homeRondas:backboneModel ',
		
		initialize: function () {
			
		},
		
		defaults: {
			volanta: "RONDAS DE NEGOCIO",
			titulo: "MICA 2015",
			slug: "MERCADO DE INDUSTRIAS CULTURALES ARGENTINAS",
			items: [{
				buttontext:'INSCRIBITE A LAS RONDAS DE NEGOCIOS',
				buttonroute:'document:add',
			}]
		},		
	});
	
	var API = {
		getEntities: function(){
			var accions = new Entities.Home();
			return accions;
		},
	}
	
	DocManager.reqres.setHandler("home:entity", function(){
    return API.getEntities();
  });
});