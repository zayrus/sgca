DocManager.module("BudgetApp.Common.Views", function(Views, DocManager, Backbone, Marionette, $, _){

  Views.SidebarMenu = Marionette.ItemView.extend({
    //article id="sidebar-region" role="navigation" class="sistema-box" -->
    tagName: "ul",
    className:"context-menu panel",
    attributes: {
      //href:'#'
    },

    initialize: function(options){
      //console.dir(options);
      var self = this;
      this.options = options;
    },

    templates: {
      sidebarmenu:   'ActionEditSidebarMenu',
    },

    getTemplate: function(){
      return utils.templates[this.templates['sidebarmenu']];
    },

    events: {
      "click .js-newentity": "newentity",
      "click .js-newbudget": "newbudget",
    },

    triggers: {
      //"click a": "document:new"
    },

    modelChanged: function(){

      console.log('bind EVENT SIDEBAR ITEM')

    },

    newbudget: function(e){
      e.preventDefault();
      this.trigger('budget:new');
      return false;
    },
 
    newentity: function(e){
      e.preventDefault();
      this.trigger('entity:new');
      return false;
    },

    onRender: function(){
      // if(this.model.selected){
      //   this.$el.addClass("active");
      // };
    }
  });


  Views.SearchItem = Marionette.ItemView.extend({
    templates: {
      documentos: _.template('<strong><%= cnumber %></strong> : <%= slug %>'),
      persons:    _.template('<strong><%= nickName %></strong> : <%= name %>'),
      products:   _.template('<strong><%= productcode %></strong> : <%= slug %>'),
      reports:    _.template('<strong><%= cnumber +":  "+ utils.fetchLabel(utils.tipoInformeOptionList, tipomov) %></strong> : <%= slug %>'),
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
  
    childView: Views.SearchItem,
    childViewContainer: ".list-group",
        
    events: {
      "click .js-filter-by-id" : "documentList",
    },

    documentList: function(){
      var criteria = $('input',this.$el).val(),
          self = this;
      //console.log('filtered list SEARCH [%s]',criteria)

      DocManager.request(this.options.searchtrigger, criteria, function(documents){
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
          /*      this.$(".js-datepicker").datepicker({
                        format: "dd/mm/yyyy"
                    }).on('changeDate',function(ev){
                        console.log('change DATEPICKER');
                        self.change(ev);

                    });
          */      
    },

    change: function (event) {
        //utils.hideAlert();
        console.log('FORM CHANGE')
        var target = event.target;
        var change = {};
        change[target.name] = target.value;
        this.model.set(change);
        //console.log('CHANGE: [%s]: [%s]',target.name, target.value);
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

    onFormNotifications: function(msgs, tstyle){
      var $view = this.$el,
          selector;

      if(!tstyle){
        tstyle = 'warning';
      }
      if(['warning','succes','error'].indexOf(tstyle) === -1){
        tstyle = 'warning';
      }
      
      tstyle = 'has-' + tstyle;
      selector = "." + tstyle;

      console.log('onForm Notifications [%s][%s]', tstyle, selector);

      var clearFormErrors = function(){
        $view.find(selector).each(function(){
          $(this).removeClass(tstyle);
          $('.help-block', $(this)).html("");
        });
      }

      var markErrors = function(value, key){
        var $controlGroup = $view.find("#" + key).closest('.form-group');
        $controlGroup.addClass(tstyle);
        $('.help-block', $controlGroup).html(value);
      }

      clearFormErrors();
      _.each(msgs, markErrors);
    },

    onFormDataInvalid: function(errors){
      //console.log('FORM ON RENDER')
      var $view = this.$el;

      var clearFormErrors = function(){
        //var $view = $view.find("form");
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
    className: "navbar navbar-default",

    childView: Views.NavItem,
    childViewContainer: "ul#taskmenu",
    
    templates: {
      docum:      'DocumNavbar',
      report:     'ReportNavbar',
      budget:     'BudgetNavbar',
    },

    getTemplate: function(){
      var template = this.options.navtemplate || 'budget';
      return utils.templates[this.templates[template]];
    },

    
    events: {
      "click .js-prev": "fetchPrev",
      "click .js-next": "fetchNext",
      "click a.brand": "brandClicked",
      "click .js-filter-by-id" : "entitiesSearch",
      "click .js-groupedit": 'groupEdit',
    },

    groupEdit: function(e){
      e.preventDefault();
      //console.log('GroupEdit');
      this.$('.dropdown-toggle').dropdown('toggle');

      this.trigger('document:group:edit');
      return false;

    },

    fetchPrev: function(){
      //console.log('fetchprev');
      var query = this.$('#search-by-id').val();
      this.trigger('document:fetchprev', query, function(entity){
        console.log('back in fetchprev');
      });
    },

    fetchNext: function(){
      //console.log('fetchNext');
      var query = this.$('#search-by-id').val();
      this.trigger('document:fetchnext', query, function(entity){
        console.log('back in fetchNext');
      });    
    },

    entitiesSearch: function(){
      //console.log('documentList: [%s]',$('input',this.$el).val())
      var self = this,
          query = this.$('#search-by-id').val();
      this.trigger('entities:search', query, function(entity){
        //this.trigger('document:edit',entity);

      });


    },

    brandClicked: function(e){
      e.preventDefault();
      this.trigger("brand:clicked");
    }
  });

  Views.SidebarTableItem = Marionette.ItemView.extend({
    //article id="sidebar-region" role="navigation" class="sistema-box" -->
    tagName: "tr",
    //className:"content",
    attributes: {
      //href:'#'
    },

    initialize: function(options){
      //console.log('SidebarItem');
      //console.dir(options);
      var self = this;
      this.options = options;
    },


    templates: {
      ptecnico:   'DocumEditPTItems',
      nsolicitud: 'DocumEditPSOSItems',
      nsolheader: 'DocumEditPSOHeader',
      nsdetails:  'DocumEditPSOSDetails',
      nrecepcion: 'DocumEditREItems',
      nentrega:   'DocumEditREItems',
      npedido:    'DocumEditREItems',
      pemision:   'DocumEditEMItems',
    },

    getTemplate: function(){
      if(this.options){
        if(this.options.itemtype){
          return utils.templates[this.templates[this.options.itemtype]];
        }
        if(this.options.headertype){
          return utils.templates[this.templates[this.options.itemtype]];          
        }
      }
      return _.template('<%= slug %>');
    },


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


  Views.SidebarItem = Marionette.ItemView.extend({
    //article id="sidebar-region" role="navigation" class="sistema-box" -->
    tagName: "div",
    className:"content",
    attributes: {
      //href:'#'
    },

    initialize: function(options){
      //console.dir(options);
      var self = this;
      this.options = options;
    },


    templates: {
      ptecnico:   'DocumEditPTItems',
      nsolicitud: 'DocumEditPSOSItems',
      nsolheader: 'DocumEditPSOHeader',
      nsdetails:  'DocumEditPSOSDetails',
      nrecepcion: 'DocumEditREItems',
      nentrega:   'DocumEditREItems',
      npedido:    'DocumEditREItems',
      pemision:   'DocumEditEMItems',
    },

    getTemplate: function(){
      if(this.options){
        if(this.options.itemtype){
          return utils.templates[this.templates[this.options.itemtype]];
        }
        if(this.options.headertype){
          return utils.templates[this.templates[this.options.itemtype]];          
        }
      }
      return _.template('<%= slug %>');
    },


    events: {
      "click": "navigate",
    },

    triggers: {
      //"click a": "document:new"
    },

    modelChanged: function(){

      console.log('bind EVENT SIDEBAR ITEM')

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

  Views.SidebarCompositePanel = Marionette.CompositeView.extend({
    tagName: "div",
    className: "content",

    childView: Views.SidebarTableItem,
    childViewContainer: "tbody",



    templates: {
      ptecnico:   'DocumEditPTItems',
      nsolicitud: 'DocumEditPSOItems',
      nsdetails:  'DocumEditPSOSDetailsHeader',
      nrecepcion: 'DocumEditREItems',
      nentrega:   'DocumEditREItems',
      npedido:    'DocumEditREItems',
      pemision:   'DocumEditEMItems',
    },

    getTemplate: function(){
      if(this.options){
        if(this.options.itemtype){
          //console.log('Getting Template:[%s]',this.options.itemtype)
          return utils.templates[this.templates[this.options.itemtype]];
        }
        if(this.options.headertype){
          return utils.templates[this.templates[this.options.itemtype]];
        }
      }
      return _.template('<%= slug %>');
    },

    initialize: function(options){
      var self = this;
      //console.log('SidebarComposite INIT[%s]', this.model.get('slug'), this.model.get('leyendafecha'));
      //console.log('SidebarComposite Collection[%s]',this.collection.length);
      this.options = options;
    },


    childViewOptions: function(model, index) {
      // do some calculations based on the model
      //console.log('SideBar:childViewOptions [%s] [%s]',model.get('slug'),index);
      return {
        itemtype:this.options.itemtype,
      }
    },

    onFormSubmit:function(){
      //console.log('submit form:PTI-LIST');
      this.trigger("sit:form:submit");
    },
  });
    
  Views.SendMail = Marionette.ItemView.extend({
      
      getTemplate: function(){
          return utils.templates["MailTemplateDefault"];
      },
      
       getData: function(){
           return this.getTemplate()(this.model.toJSON());
      },
  })

  Views.SidebarPanel = Marionette.CollectionView.extend({
    //tagName: "div",
    //className: "list-group",

    //childView: Views.SidebarItem,
    //childViewContainer: "article",
    
    initialize: function(options){
      //console.log('SidebarPanel: [%s] [%s]',options,options.itemtype)
      this.options = options;
    },
 
    events: {
      "click a": "brandClicked",
      "click .js-filter-by-id" : "documentList"
    },

    documentList: function(){
      //console.log('documentList: [%s]',$('input',this.$el).val())
      this.trigger("documents:filtered:list",$('input',this.$el).val());
    },

    childViewOptions: function(model, index) {
      //console.log('childViewOptions [%s] [%s] [%s]',model.whoami, model.get('slug'), this.options.itemtype);
      return {
        model: model,
        collection: model.getItems(),
        itemtype:this.options.itemtype,
      }
    },

    modelChanged: function(){

      console.log('bind EVENT SIDE BAR PANEL')

    },

    brandClicked: function(e){
      e.preventDefault();
      //console.log('PANEL event');
      this.trigger("brand:clicked");
    }
    
  });

});
