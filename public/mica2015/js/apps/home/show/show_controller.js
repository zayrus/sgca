DocManager.module("HomeApp.Show", function(Show, DocManager, Backbone, Marionette, $, _){
	
	Show.Controller = {
		
		showHome: function(){
			
      var homeLayout = new Show.HomeLayoutView();
			var home = DocManager.request("home:entity");
			
			var feature = DocManager.request("features:entity");
			var itemFeature = new DocManager.Entities.FeatureCollection(feature.get('items'));
			
			var gallery = DocManager.request("gallery:entity"); 
			var itemGallery = new DocManager.Entities.GalleryCollection(gallery.get('items'));
			
			var homeView = new Show.HomeIntroView({
				model: home
			});	
			
//			var user = new UserFacet();
//			var userView = new Show.UserView({
//				model:user, 
//				el:'#signupbox'
//			});
			
			var featureHeading = new Show.HomeFeatureView({
				model: feature
			});
			
			var featureItems = new Show.HomeFeatureItems({
				collection: itemFeature
			});
			
			var galleryView = new Show.HomeGalleryCollection({
				collection: itemGallery
			});
		
			homeLayout.on("show", function(){
				homeLayout.mainRegion.show(homeView);
				homeLayout.featureRegion.show(featureHeading);
				homeLayout.itemsRegion.show(featureItems);
				homeLayout.galleryRegion.show(galleryView);
			});		
			DocManager.mainRegion.show(homeLayout);
		}
	}
});
