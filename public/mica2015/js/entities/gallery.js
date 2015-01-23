DocManager.module("Entities", function(Entities, DocManager, Backbone, Marionette, $, _){
	Entities.Gallery = Backbone.Model.extend({
		urlRoot: "/rondas",
		whoami: 'homeGallery:backboneModel ',
		
		initialize: function () {
			
		},
		
		defaults: {
			items: [{
				imgclass:"gallery-grid",
				idimg:"images/8646245150_83430a4270_z.jpg"}, 
							{
				imgclass:"gallery-grid",
				idimg:"images/8269739789_00112e3047_z.jpg"},
							{
				imgclass:"gallery-grid",
				idimg:"images/8645141079_4e89ed32d0_z.jpg"},
							{
				imgclass:"gallery-grid",
				idimg:"images/8645145125_a2614482e5_z.jpg"},
							{
				imgclass:"gallery-grid",
				idimg:"images/8646241750_ea018212a5_z.jpg"},
							{
				imgclass:"gallery-grid",
				idimg:"images/8646243720_907f0e5649_z.jpg"},
							{
				imgclass:"gallery-grid",
				idimg:"images/8645142847_0f477dc9d5_z.jpg"},
							{
				imgclass:"gallery-grid",
				idimg:"images/8645143069_0721d7401d_z.jpg"},
							{
				imgclass:"gallery-grid last",
				idimg:"images/8645141679_d228620356_z.jpg"},
						 ]
		},
	});
	
	Entities.GalleryCollection = Backbone.Collection.extend({
		whoami: 'Entities.GalleryCollection:gallery.js ',
		
		model: Entities.Gallery
	});
	
	var API = {
		getEntities: function(){
			var accions = new Entities.Gallery();
			return accions;
		},
	}
	
	DocManager.reqres.setHandler("gallery:entity", function(){
    return API.getEntities();
  });
});