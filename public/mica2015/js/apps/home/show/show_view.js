DocManager.module("HomeApp.Show", function(Show, DocManager, Backbone, Marionette, $, _){
	
	Show.HomeLayoutView = Marionette.LayoutView.extend({
		getTemplate: function(){ 
			return utils.templates.HomeShowLayoutView;
		},
		regions: {
			mainRegion: '#main-region',
		  featureRegion: '#feature-block-region',
		  itemsRegion: '#feature-items-region',
		  galleryRegion: '#gallery-grid-region',
		}
	});
	
	Show.RegisterView = Marionette.ItemView.extend({
		whoami: 'RegisterView:show_view.js',

    events: {
			"click .js-insertuser"     : "insertNewUser",     
			"change"	: "change",
		},
		
		insertNewUser: function(e){
			e.preventDefault();
			var self = this;
			
//		Fecha y hora del alta
			var fealta = new Date(),
					fecomp = utils.dateTimeToStr(fealta);
			
			self.model.set({
				fealta:fecomp
			});
			
			self.model.validusername(this.model.get('username'),function(error){
				if(error){
					console.log('error')
				}else{
					var errors = self.model.validate(self.model.attributes, {strict: true});
					if(errors){
						self.displayValidationErrors(errors);
					}else{
						console.log('ok READY TO INSERT')
						
						self.model.addNewUser(function(user){
							console.log('bbbbbBBBBBYYYYYYEEEEE2')
							$('#loginbox').toggleClass('hide show');
							$('#signupbox').toggleClass('hide show');
						});
						
					} 
				}
				
			});
		
		},  
//	end insertNewUser
		
		change: function(event){
			var target = event.target;
			var change = {};
			var error;

			if(target.type==='checkbox'){
					change[target.name] = target.checked;
			}else{
					change[target.name] = target.value;
			}
			
//		cuando cambia el att name lo seteo como displayName
			if (target.id == 'name'){
				this.model.set({
					displayName: target.value
				});
					
//			temporal para el check de termsofuse
				this.model.set({
					termsofuse: true
				});	
			}
			
//		cuando cambia el att password lo seteo como passwordcopia
			if (target.id == 'login-password'){
				this.model.set({
					passwordcopia: target.value
				});
			}
			
//		cuando cambia el att username lo seteo como mail
			if (target.id == 'username'){
				this.model.set({
					mail: target.value
				});
			};
			
			error = this.model.validate(change);

			if(error){
				if(error[target.name]){
					console.log('Validate: Errors[%s]', error[target.name])
					this.addValidationError(target.id, error[target.name], this.el);
				}else{
					this.removeValidationError(target.id, this.el);            
					this.model.set(change);
				}
			}else{
				this.removeValidationError(target.id, this.el);            
				this.model.set(change);    
			}
		}, 
//	Fin change
		
		displayValidationErrors: function (messages) {
			for (var key in messages) {
					if (messages.hasOwnProperty(key)) {
							this.addValidationError(key, messages[key], this.el);
					}
			}
			
    },

    addValidationError: function (field, message, context) {
			console.log('f[%s] [%s]','#' + field,message)
			var controlGroup = $('#' + field, context).parent().parent();
			controlGroup.addClass('has-error');
			$('.help-block', controlGroup).html(message);
    },

    removeValidationError: function (field, context) {
			var controlGroup = $('#' + field, context).parent().parent();
			controlGroup.removeClass('has-error');
			$('.help-block', controlGroup).html('');
    },

    render:function () {
			return this;
    }
	
	});
	
	Show.HomeIntroView = Marionette.ItemView.extend({
		
		getTemplate: function(){
			return utils.templates.HomeShowIntroView;
		},
		
		events: {
      "click .js-ins-but": "loginclick",
      "click #goto-register": "registerclick",
      "click #signinlink": "registerclick",
      "click .js-forgot":  "forgotclick",
    },
		
		registerclick: function(e){
			console.log('intenta registrarse');
			$(this).parent();
			$('#loginbox').toggleClass('hide show');
			$('#signupbox').toggleClass('hide show');
			
			var user = new UserFacet({
				home: 'rondas:form',
				estado_alta: 'activo',
				grupo: 'adherente'
			});
			
			var homeView = new Show.RegisterView({
				model:user, 
				el:'#signupbox',
			});

		},
		
		forgotclick: function(e){
			console.log('muestra el form de forgot');
			$(this).parent();
			$('#loginbox').toggleClass('hide show');
			$('#forgotbox').toggleClass('hide show');

		},

		loginclick: function(e){
			e.preventDefault();
			var self = this;
			var userlog;

			dao.gestionUser.getUser(DocManager, function (user){
				console.log(user.id);
				userlog = user.id;

				if (userlog == null) {
					console.log('no esta logueado');

					$('#loginbox').toggleClass('hide show')
					self.$('#ins-but').toggleClass('hide show');

				}else {
					console.log('esta logueado, tiene que seguir a editar[%s]',self.model.get('items')[0].buttonroute);
					DocManager.trigger(self.model.get('items')[0].buttonroute);
				}


			});
			

		}
	});
	
	Show.FeaturesItemsLayout = Marionette.LayoutView.extend({

		getTemplate: function(){
			return utils.templates.HomeShowFeatureItemDetail;
    },
  }); 	
	
	Show.HomeFeatureView = Marionette.CompositeView.extend({
		getTemplate: function(){
			return utils.templates.HomeShowFeatureItemComposite;
		},
		childView: Show.HomeFeatureItemDetail,
  });
	
	Show.HomeFeatureItems = Marionette.CollectionView.extend({
		childView: Show.FeaturesItemsLayout,	
	});
	
	Show.HomeFeatureItemDetail = Marionette.ItemView.extend({
    getTemplate: function(){
			return utils.templates.HomeShowFeatureItemDetail;
    },
  });
	
	Show.GalleryItemsLayout = Marionette.LayoutView.extend({
//va a buscar la clase del item porque el ultimo debe ser tipo 'gallery-grid last'
		className: function(){
			return this.model.get('imgclass')
		},

		getTemplate: function(){
			return utils.templates.HomeShowGalleryItemsView;
    },
  });
	
	Show.HomeGalleryCollection = Marionette.CollectionView.extend({
		className: 'gallery-wrapper',
		childView: Show.GalleryItemsLayout, 		
		
		onRender: function() {
			// initialize Masonry
			var $container = this.$el.masonry();
			// layout Masonry again after all images have loaded
			$container.imagesLoaded( function() {
				$container.masonry();
			});
		},
		
	});
	
});
