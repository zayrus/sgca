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
        this.$el.addClass("active");
      };
    }
  });

  List.Headers = Marionette.CompositeView.extend({

    childView: List.Header,
    childViewContainer: "ul#taskmenu",
    
    getTemplate: function(){
      return utils.templates.HeaderView;
    },
    
    events: {
      "click a.brand": "brandClicked"
    },

    brandClicked: function(e){
      e.preventDefault();
      this.trigger("brand:clicked");
    }
  });
});
