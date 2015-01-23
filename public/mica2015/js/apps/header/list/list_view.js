DocManager.module("HeaderApp.List", function(List, DocManager, Backbone, Marionette, $, _){

  List.Header = Marionette.ItemView.extend({
    template: _.template('<a href="#<%= url %>" title="<%= navigationTrigger %>"><%= name %></a>'),

    tagName: "li",

    events: {
      "click a": "navigate"
    },

    navigate: function(e){
      e.preventDefault();
      this.trigger("navigate", this.model);
    },

    onRender: function(){
      if(this.model.selected){
        // add class so Bootstrap will highlight the active entry in the navbar
        this.$el.addClass("active");
      };
    }
  });

  List.Headers = Marionette.CompositeView.extend({
    //template: "#header-template",
    //tagName: "nav",
    //className: "navbar navbar-inverse navbar-fixed-top", 

    childView: List.Header,
    childViewContainer: "ul#taskmenu",
    
    getTemplate: function(){
      return utils.templates.HeaderView;
    },
		
		initialize: function(){
			//
			var userlog;
			dao.gestionUser.getUser(DocManager, function (user){
//				console.log(user.id);
				userlog = user.id;
			})
			//
		},
    
    events: {
      "click a.brand": "brandClicked",
      "click #entrarh": "enterhClicked",
    },

    enterhClicked: function(){
      console.log('evento')
			$('#loginbox').toggleClass('hide show');
			$('#ins-but').toggleClass('hide show');
      
    },  
		
		brandClicked: function(e){
      e.preventDefault();
      this.trigger("brand:clicked");
    },
		
		onRender: function(userlog){
			if (userlog.model.id != null){
//				console.log('usuario logueado',userlog.model.id);
				this.$('#menuhome').hide();
				this.$('#notification').show();
			//	this.$('#menuuser').show();
				
			}
			else{
//				console.log('no esta logueado')
				this.$('#notification').hide();
				this.$('#menuuser').hide();
			}
		}
  });
});



