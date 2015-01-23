DocManager.module("Entities", function(Entities, DocManager, Backbone, Marionette, $, _){
	Entities.Features = Backbone.Model.extend({
		urlRoot: "/rondas",
		whoami: 'homeFeatures:backboneModel ',
		
		initialize: function () {

		},
		
		defaults: {
			titulo: "Rondas de negocio",
			description: "Productores y artistas tendrán la posibilidad, durante cuatro días, de encontrarse con las principales empresas de Industrias Culturales de todo el mundo y abrir nuevas oportunidades de negocios",
			items: [{
				icon: "class='icons mica-teatro'",
				size: "class='fa fa-4x'",
				tag: "class='fa fa-tags fa-inverse'",
				head: "Artes escénicas",
				text: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Minima maxime quam architecto quo inventore harum ex magni, dicta impedit."},
							{
				icon: "class='icons mica-audiovisual'",
				size: "class='fa fa-4x'",
				tag: "class='fa fa-film fa-inverse'",
				head: "Audiovisual",
				text: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Minima maxime quam architecto quo inventore harum ex magni, dicta impedit."},
							{
				icon: "class='icons mica-diseno'",
				size: "class='fa fa-4x'",
				tag: "class='fa fa-tags fa-inverse'",
				head: "Diseño",
				text: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Minima maxime quam architecto quo inventore harum ex magni, dicta impedit."},
							{
				icon: "class='icons mica-editorial'",
				size: "class='fa fa-4x'",
				tag: "class='fa fa-book fa-inverse'",
				head: "Editorial",
				text: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Minima maxime quam architecto quo inventore harum ex magni, dicta impedit."},
							{
				icon: "class='icons mica-musica'",
				size: "class='fa fa-4x'",
				tag: "class='fa fa-music fa-inverse'",
				head: "Música",
				text: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Minima maxime quam architecto quo inventore harum ex magni, dicta impedit."},
							{
				icon: "class='icons mica-videojuegos'",
				size: "class='fa fa-4x'",
				tag: "class='fa fa-gamepad fa-inverse'",
				head: "Videojuegos y Apps",
				text: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Minima maxime quam architecto quo inventore harum ex magni, dicta impedit."}]
		},
	});
	
	Entities.FeatureCollection = Backbone.Collection.extend({
    whoami: 'Entities.FeaturesCollection:features.js ',
		
		model: Entities.Features
	});
	
	var API = {
		getEntities: function(){
			var accions = new Entities.Features();
			return accions;
		},
	}
	
	DocManager.reqres.setHandler("features:entity", function(){
    return API.getEntities();
  });
});