MediaManager.module("MediaApp.Common.Views", function(Views, MediaManager, Backbone, Marionette, $, _){

  Views.SearchItem = Marionette.ItemView.extend({
    templates: {
      documentos: _.template('<strong><%= cnumber %></strong> : <%= slug %>'),
      persons:    _.template('<strong><%= nickName %></strong> : <%= name %>'),
      products:   _.template('<strong><%= productcode %></strong> : <%= slug %>'),
    },

    getTemplate: function(){
      return this.templates[this.options.itemtype];
    },

    tagName: "a",
    attributes: {
      href:'#'
    },
    className:"list-group-item",

    events: {
      "click": "navigate",
    },
    initialize: function(options){
      this.options = options;
    },

    navigate: function(e){
      e.preventDefault();
      this.trigger('item:found',this.model);
    },

    onRender: function(){
      if(this.model.selected){
        this.$el.addClass("active");
      };
    }
  });

  Views.SearchPanel = Marionette.CompositeView.extend({
    tagName: "div",

    getTemplate: function(){
      return utils.templates.SearchEntitiesForm;
    },
  
    itemView: Views.SearchItem,
    itemViewContainer: ".list-group",
        
    events: {
      "click .js-filter-by-id" : "documentList",
    },

    documentList: function(){
      var criteria = $('input',this.$el).val(),
          self = this;
      console.log('filtered list SEARCH [%s]',criteria)

      MediaManager.request(this.options.searchtrigger, criteria, function(documents){
          console.log('Filtered CALLBACK: [%s]',documents.length);
          self.collection = documents;
          self.render();
      });
    },
  });


  Views.Form = Marionette.ItemView.extend({

    formevents: {
      "click button.js-submit": "submitClicked",
      "click button.js-cancel": "cancelClicked",
      "change": "change"
    },

    onRender: function(){
      var self = this;
      this.$(".js-datepicker").datepicker({
              format: "dd/mm/yyyy"
          }).on('changeDate',function(ev){
              console.log('change DATEPICKER');
              self.change(ev);

          });
    },
    onBeforeClose: function(){
      console.log('¡¡¡¡ ME CERRARON   !!');
      this.trigger("form:close");
    },

    change: function (event) {
        //utils.hideAlert();
        console.log('change event!!')
        var target = event.target;
        var change = {};

        if(target.type==='checkbox'){
            console.log('change!! checkbox: name:[%s] value:[%s] check:[%s]',target.name, target.value,target.checked);
            this.model.process(target);
        }else{
            change[target.name] = target.value;
            console.log('change!! normal: name:[%s] value:[%s] ',target.name, target.value);
            this.model.set(change);
        }

        this.trigger("form:change", target.name, target.value);
        var err = this.model.validate(change);
        this.onFormDataInvalid((err||{}));
    },
/*        if(this.model.isValid()){
           console.log('validación ok')
        }else{
           console.log('validación failed [%s]',this.model.validationError)
        }
*/ 
    submitClicked: function(e){
      e.preventDefault();
      //var data = Backbone.Syphon.serialize(this);
      console.log('FORM SUBMITTED');
      this.trigger("form:submit", this.model);
    },

    cancelClicked: function(e){
      e.preventDefault();
      this.close()
    },

    onFormDataInvalid: function(errors){
      var $view = this.$el;

      var clearFormErrors = function(){
        //var $form = $view.find("form");
        var $form = $view;
        $form.find(".has-error").each(function(){
          $(this).removeClass("has-error");
          $('.help-block', $(this)).html("");
        });
      }

      var markErrors = function(value, key){
        var $controlGroup = $view.find("#" + key).closest('.form-group');
        $controlGroup.addClass("has-error");
        $('.help-block', $controlGroup).html(value);
      }

      clearFormErrors();
      _.each(errors, markErrors);
    }
  });

  Views.NavItem = Marionette.ItemView.extend({
    template: _.template('<a href="#<%= url %>" title="<%= navigationTrigger %>"><%= name %></a>'),
    tagName: "li",

    events: {
      "click a": "navigate",
    },

    triggers: {
      //"click a": "document:new"
    },

    navigate: function(e){
      e.preventDefault();
      e.stopPropagation();
      this.trigger(this.model.get('navigationTrigger'), this.model);
      return false;
    },

    onRender: function(){
      if(this.model.selected){
        this.$el.addClass("active");
      };
    }
  });

  Views.NavPanel = Marionette.CompositeView.extend({
    tagName: "nav",
    className: "navbar navbar-inverse",

    itemView: Views.NavItem,
    itemViewContainer: "ul#taskmenu",
    
    getTemplate: function(){
      return utils.templates.MediaNavbar;
    },
    
    events: {
      "click .js-prev": "fetchPrev",
      "click .js-next": "fetchNext",
      "click a.brand": "brandClicked",
      "click .js-filter-by-id" : "documentSearch",
      "click .js-groupedit": 'groupEdit',
    },

    groupEdit: function(e){
      e.preventDefault();
      console.log('GroupEdit');
      this.$('.dropdown-toggle').dropdown('toggle');

      this.trigger('document:group:edit');
      return false;

    },

    fetchPrev: function(){
      console.log('fetchprev');
      var query = this.$('#search-by-id').val();
      this.trigger('document:fetchprev', query, function(entity){
        console.log('back in fetchprev');
      });
    },

    fetchNext: function(){
      console.log('fetchNext');
      var query = this.$('#search-by-id').val();
      this.trigger('document:fetchnext', query, function(entity){
        console.log('back in fetchNext');
      });    
    },

    documentSearch: function(){
      //console.log('documentList: [%s]',$('input',this.$el).val())
      var self = this,
          query = this.$('#search-by-id').val();
      this.trigger('document:search', query, function(entity){
        this.trigger('document:edit',entity);

      });


    },

    brandClicked: function(e){
      e.preventDefault();
      this.trigger("brand:clicked");
    }
  });

  Views.SidebarItem = Marionette.ItemView.extend({
    template: _.template('<%= slug %>'),
    tagName: "a",
    attributes: {
      href:'#'
    },
    className:"list-group-item",

    events: {
      "click": "navigate",
    },

    triggers: {
      //"click a": "document:new"
    },

    navigate: function(e){
      //console.log('navigate event');
      e.preventDefault();
      this.trigger('item:edit', this.model);
      return false;
    },

    onRender: function(){
      if(this.model.selected){
        this.$el.addClass("active");
      };
    }
  });

  Views.SidebarPanel = Marionette.CollectionView.extend({
    tagName: "div",
    className: "list-group",

    itemView: Views.SidebarItem,
    itemViewContainer: "a",
    
    
    events: {
      "click a": "brandClicked",
      "click .js-filter-by-id" : "documentList"
    },

    documentList: function(){
      console.log('documentList: [%s]',$('input',this.$el).val())
      this.trigger("documents:filtered:list",$('input',this.$el).val());
    },

    brandClicked: function(e){
      e.preventDefault();
      console.log('PANEL event');
      this.trigger("brand:clicked");
    }
  });



});
