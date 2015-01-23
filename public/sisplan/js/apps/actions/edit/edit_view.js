DocManager.module("ActionsApp.Edit", function(Edit, DocManager, Backbone, Marionette, $, _){
  Edit.Layout = Marionette.LayoutView.extend({
    className: 'row',

    getTemplate: function(){
      return utils.templates.ActionEditLayout;
    },
    
    regions: {
      //navbarRegion:  '#navbar-region',
      mainRegion:        '#main-region',
      sidebarMenuRegion: '#sidebarmenu-region',

      headerInfoRegion:  '#sidebar1-region',
      itemsInfoRegion:   '#sidebar2-region',

      itemEditRegion: '#itemedit-region',
      linksRegion:   '#panel-region',
    }
  });

  Edit.MainLayout = Marionette.LayoutView.extend({
    className:'row js-mainlayout',

    getTemplate: function(){
      return utils.templates.ActionEditMainLayout;
    },
    
    regions: {
      headerRegion:  '#main-header-region',
      budgetRegion:  '#budget-region',
      contextRegion: '#main-context-region',
    }
  });

  Edit.InlineForm = Marionette.ItemView.extend({
    tagName:'div',
    className:'js-InLineForm',

    getTemplate: function(){
       return utils.templates.ActionInlineFormHook;
    },

    initialize: function(options){
      var self = this;
      this.options = options;
    },

    events: {
      "click .js-inlineFormSubmit": "formsubmit",
      "click .js-inlineFormCancel": "formcancel",
    },

    formsubmit: function(e){
      e.preventDefault();
      e.stopPropagation();
      var self = this;
      console.log('FormSubmit CLICKED');
      self.trigger('form:submit',self.model);
    },

    formcancel: function(e){
      e.preventDefault();
      e.stopPropagation();
      var self = this;
      console.log('FormSubmit CLICKED');
      self.trigger('form:cancel',self.model);
    },

    triggers: {
      //"click a": "document:new"
    },

    onRender: function(){
      this.$('#inner-form-hook').html(this.options.form.render().el);
    }
  });



  Edit.inlineedit = function(opt, cb){
        // #js-form.hook: lo provee la view
        var formHook = opt.hook || '.js-form-hook';
        console.log('inlineEdit[%s]',formHook);

        var submitform = true,
            form = new Backbone.Form({
                model: opt.facet
            }),
            fcontainer = new Backbone.Model({
              caption: opt.captionlabel,
              submit: 'Aceptar',
              cancel: 'Cancelar',
              content: 'aForm'
            });

        form.on('change', function(form, editorContent) {
            var errors = form.commit();
            return false;
        });
        form.on('blur', function(form, editorContent) {
            return false;
        });        

        var formContainer = new Edit.InlineForm({
          model:fcontainer,
          form: form
        });
        formContainer.on('form:submit', function(theModel){
          var errors = form.commit();
          console.log('FormClose!!!  [%s]',opt.facet.get('description'));
          formCleanClose();
        });
        formContainer.on('form:cancel', function(theModel){
          console.log('FormCancel');
          submitform = false;
          formCleanClose();
        });

        opt.view.$(formHook).html(formContainer.render().el);
        if(opt.chview){
          opt.chview.on('close:inline:edit:form', function(){
            console.log('close edit form BUBBLED: Ready to destroy form');
            submitform = false;
            formCleanClose();

          });
        }
        
        var formCleanClose = function(){
          formContainer.destroy();
          cb(opt.facet, submitform);
        };

  };


  Edit.modaledit = function(view, model, facet, captionlabel, cb){
        console.log('modal EDIT');
        var self = view,
            form = new Backbone.Form({
                model: facet
            });

        form.on('change', function(form, editorContent) {
            var errors = form.commit();
            return false;
        });

        form.on('blur', function(form, editorContent) {
            return false;
        });

        var modal = new Backbone.BootstrapModal({
            content: form,
            title: captionlabel,
            okText: 'aceptar',
            cancelText: 'cancelar',
            enterTriggersOk: false,
            animate: false
        });

        modal.on('ok',function(){
          console.log('MODAL ok FIRED');
        });

        modal.open(function(){
            console.log('modal CLOSE');
            var errors = form.commit();
            cb(facet);
        });
  };

  Edit.createInstance = function(opt, cb){
        console.log('modal ACTION NEW');
        console.log('opt.facet: [%s]',opt.facet.whoami)

        var facet = opt.facet,
            form = new Backbone.Form({
                model: facet
            });


        form.on('change', function(form, editorContent) {
            console.log('change');
            var errors = form.commit();
            return false;
        });

        form.on('blur', function(form, editorContent) {
            console.log('blur');
            //var errors = form.commit();
            return false;
        });

        var modal = new Backbone.BootstrapModal({
            content: form,
            title: opt.caption,
            okText: 'aceptar',
            cancelText: 'cancelar',
            enterTriggersOk: false,
            animate: false
        });

        modal.on('ok',function(){
          console.log('MODAL ok FIRED');
          //modal.preventClose();

        });

        modal.open(function(){
            console.log('modal CLOSE');
            var errors = form.commit();
            if(cb)
              cb(facet, true);
        });
  };


  Edit.MainHeader = DocManager.ActionsApp.Common.Views.Form.extend({
    whoami:'Edit.MainHeader: edit_views.js',
    tagName: 'div',
    className: 'panel',

    getTemplate: function(){
      return utils.templates.ActionMainHeader;
    },

    initialize: function(options){
      console.log('[%s] BEGINS',this.whoami);
      var self = this;
      this.events = _.extend({},this.formevents,this.events);
      this.delegateEvents();
    },

    onRender: function(){
      var self = this;
      this.$("#fealta").datepicker({
            inline: true,
            dateFormat: 'dd/mm/yy',
            minDate: 0,
            //defaultDate: self.model.get('items')[0].fevento,
            altField: "#fealta"
      });
    },

    events: {
      "click .js-editMainHeader": "mainheaderedit",

      "click .js-personsch": "personsearch",
      "click .js-organismosch": "organismosearch",
      "click #fevento": "dateselector",
      "click #nuevo-req-btn": "editDetailForm",
      "change #eusuario": "uservalidation",
    },

    mainheaderedit: function(e){
      e.preventDefault();
      e.stopPropagation();

      this.trigger('main:header:edit', this.model);
    },

  });


  Edit.BudgetPanelItem = Marionette.ItemView.extend({
    whoami: 'Edit.BudgetPanelITEM:edit_views',
    tagName: "tr",

    templates: {
      budget:      'ActionBudgetItem'
    },

    getTemplate: function(){
      return utils.templates[this.templates['budget']];
    },

    initialize: function(options){
      console.log('[%s] BEGINS',this.whoami);
      var self = this;
      this.options = options;
      this.parentView = options.parentView;
    },

    events: {
      "click a": "navigate",
      "click .js-editbudget": "edititem",
    },

    triggers: {
    },

    edititem: function(e){
      console.log('BudgetITEM edit')
      e.preventDefault();
      e.stopPropagation();
      this.trigger('edit:budget:item', this.model);
      return false;
    },

    navigate: function(e){
      e.preventDefault();
      e.stopPropagation();
      this.trigger(this.model.get('navigationTrigger'), this.model);
      return false;
    },

    onRender: function(){
      // if(this.model.selected){
      //   this.$el.addClass("active");
      // };
    }
  });


  Edit.BudgetPanel = Marionette.CompositeView.extend({
    whoami: 'Edit.BudgetPanel:edit_views',
    tagName: "div",
    className: "panel",

    childView: Edit.BudgetPanelItem,
    childViewContainer: "tbody#budget-table",
    
    templates: {
      budget:      'ActionBudgetHeader'
    },

    initialize: function(options){
      console.log('[%s] BEGINS [%s]',this.whoami, this.collection.length);
      var self = this;
      this.options = options;
    },
    
    childViewOptions: function(model, index) {
        return {parentView: this};
    },


    getTemplate: function(){
      //var template = this.options.navtemplate || 'docum';
      return utils.templates[this.templates['budget']];
    },

    
    events: {
    },

    brandClicked: function(e){
      e.preventDefault();
      this.trigger("brand:clicked");
    }
  });





  Edit.Search = DocManager.ActionsApp.Common.Views.SearchPanel.extend({
    initialize: function(options){
      this.optiones = options;
      var self = this;
    }, 
  });



  Edit.Document = DocManager.ActionsApp.Common.Views.Form.extend({
    
    // tagName:'form',
    // className: 'form-horizontal',

    getTemplate: function(){
      return utils.templates.DocumEditCore;
    },

    initialize: function(options){
      console.log('Edit.DOCUMENT BEGINS')
      var self = this;
      this.events = _.extend({},this.formevents,this.events);
      this.delegateEvents();


    },

    onRender: function(){
      var self = this;
      this.$("#fevento").datepicker({
            inline: true,
            dateFormat: 'dd/mm/yy',
            minDate: 40,
            //defaultDate: self.model.get('items')[0].fevento,
            altField: "#fevento"
      });
      //this.$("#fevento").datepicker('setDate', '+40');

    //this.$('#fevento').datepicker( "dialog", "10/12/2012" );
    },


    events: {
      "click .js-personsch": "personsearch",
      "click .js-organismosch": "organismosearch",
      "click #fevento": "dateselector",
      "click #nuevo-req-btn": "editDetailForm",
      "change #eusuario": "uservalidation",

    },

    dateselector:function(){

    },

    uservalidation: function(e){
      e.preventDefault();
      e.stopPropagation();

      this.change(e);
      
      var self = this,
          usermail = self.model.get('eusuario'),
          post;

      console.log('User validation: [%s]', usermail);
      this.trigger('user:validate', self, usermail, function(user, msgs){
        if(user){
          console.log('UserValidation CB [%s]',user.get('username[%s]'),msgs); 
        }else{
          console.log('UserValidation CB el usuario NO EXISTE [%s]',msgs);
        }
        post = msgs ? {'eusuario': msgs} : {};
        self.onFormNotifications(post);
      });

    },

    itemFormBtnShow: function(e){
      this.$('#itemFormBtn').prop('disabled', false);
    },


    editDetailForm: function(e){
      e.preventDefault();
      console.log('Toggle REQ FORM');
      this.trigger('sitem:edit', this.model);
      this.$('#itemFormBtn').prop('disabled', true);

      return false;
    },

    organismosearch: function(){
      var self = this,
          query = this.$('#organismosch').val();

      console.log('organismosearch [%s]',query);
      this.trigger('person:select', query, function(entity){
        self.model.set({organismo:entity.get('nickName')});
        self.model.set({organismoid:entity.id});
        self.render();
      });
    },

    personsearch: function(){
      var self = this,
          query = this.$('#personsch').val();

      console.log('personsearch [%s]',query);
      this.trigger('person:select', query, function(entity){
        self.model.set({persona:entity.get('nickName')});
        self.model.set({personaid:entity.id});
        self.render();
      });
    },
  });



  // ventana modal
  Edit.modalSearchEntities = function(type, query, cb){
        var options = {
          documents: {
            title:'buscar comprobantes',
            collection: new DocManager.Entities.ComprobanteCollection(),
            model: new Backbone.Model({query:query}),
            searchtrigger:"document:filtered:entities",
            childViewOptions:{
              itemtype:'documentos'
            }
          },

          persons: {
            title:'buscar personas',
            collection: new DocManager.Entities.PersonCollection(),
            model: new Backbone.Model({query:query}),
            searchtrigger:"person:filtered:entities",
            childViewOptions:{
              itemtype:'persons'
            }  
          },

          products: {
            title:'buscar productos',
            collection: new DocManager.Entities.ProductCollection(),
            model: new Backbone.Model({query:query}),
            searchtrigger:"product:filtered:entities",
            childViewOptions:{
              itemtype:'products'
            }  
          }

        }
        var form = new Edit.Search(options[type]);

        form.on('childview:item:found',function(form,model){
          if(cb) cb(model);
          modal.close();
        });
            
        var modal = new Backbone.BootstrapModal({
            content: form,
            title: options[type].title,
            okText: 'aceptar',
            cancelText: 'cancelar',
            animate: false
        });

        modal.open(function(){
            console.log('ME CERRARON [%s]');
        });
  };

  // ventana modal

  // ventana modal Edición del horario de Emision
  Edit.pemisHourEdit = function(model, cb){
        console.log('Modal Parte de Emisión');
        var form = new Backbone.Form({
                model: model,
            });

        form.on('change', function(form, editorContent) {
            var errors = form.commit();
        });
            
        var modal = new Backbone.BootstrapModal({
            content: form,
            title: 'Horario de emisión',
            okText: 'aceptar',
            cancelText: 'cancelar',
            animate: false
        });

        modal.open(function(){
            var errors = form.commit();            
            if(cb) cb(model);
        });
  };



  // ventana modal
  Edit.createItem = function(model){
        console.log('Modal ITEM NEW');
        var facet = new DocManager.Entities.DocumItemCoreFacet({
                tipoitem: model.get('tipocomp'),
                slug: model.get('slug'),
            }),
            form = new Backbone.Form({
                model: facet,
            });

        form.on('change', function(form, editorContent) {
            var errors = form.commit();
        });
            
        var modal = new Backbone.BootstrapModal({
            content: form,
            title: 'Nuevo renglón de comprobante',
            okText: 'aceptar',
            cancelText: 'cancelar',
            animate: false
        });

        modal.open(function(){
            var errors = form.commit();
            var item = model.initNewItem(facet);
            Edit.Session.items.add(item);
        });
  };

  //Edición del SubItem de comprobante SOLICITUD
  Edit.SolicitudDetail = DocManager.ActionsApp.Common.Views.Form.extend({
    whoami:'SolicitudDetail:edit_view.js',
    
    // tagName:'form',
    // className: 'form-horizontal',

    templates: {
      nsolicitud: 'DocumEditPSO',
    },

    getTemplate: function(){
      return utils.templates[this.templates[this.options.itemtype]];
    },

    initialize: function(options){
      console.log('Nuevo Requerimiento [%s]',options.itemtype);
      var self = this;
      this.events = _.extend({},this.formevents,this.events);
      this.delegateEvents();
      this.options = options;
    },
 
    events: {
      "click .js-newSolDetail": "altarequerim",
      "click .js-productsch": "productsearch",
      "click .js-personsch": "personsearch",
    },

    altarequerim: function(){
      var self = this;
      console.log('alta requerim BEGINS!!!!');
      this.trigger('details:form:submit', this.model, function(entity){
        console.log('alta requerim: Cerrar esta ventana!!!!');
        self.destroy();

      });

    },

    personsearch: function(){
      var self = this,
          query = this.$('#personsch').val();

      this.trigger('person:select', query, function(entity){
        self.model.set({persona:entity.get('nickName')});
        self.model.set({personaid:entity.id});
        self.render();
      });
    },

    productsearch: function(){
      var self = this,
          query = this.$('#product').val();

      this.trigger('product:select', query, function(entity){
        console.log('callback: [%s] [%s]',self.whoami,entity.get('slug'));
        var duracion="";
        if(entity.get('patechfacet')){
          duracion = entity.get('patechfacet').durnominal;
        }

        self.model.set({product:entity.get('productcode'), productid: entity.id,pslug:entity.get('slug'), durnominal: duracion});
        self.render();
      });
    },

  });



  // Cabecera del itam
  Edit.ItemHeader = DocManager.ActionsApp.Common.Views.Form.extend({
    whoami:'ItemHeader:edit_view.js',
    
    // tagName:'form',
    // className: 'form-horizontal',

    templates: {
      ptecnico:   'DocumEditPT',
      nsolicitud: 'DocumEditPSO',
      nrecepcion: 'DocumEditRE',
      nentrega:   'DocumEditRE',
      npedido:    'DocumEditRE',
      pemision:   'DocumEditEM',
    },

    getTemplate: function(){
      return utils.templates[this.templates[this.options.itemtype]];
    },

    initialize: function(options){
      var self = this;
      this.events = _.extend({},this.formevents,this.events);
      this.delegateEvents();
      this.options = options;
    },
 
    events: {
      "click .js-productsch": "productsearch",
      "click .js-personsch": "personsearch",
    },

    personsearch: function(){
      var self = this,
          query = this.$('#personsch').val();

      this.trigger('person:select', query, function(entity){
        self.model.set({persona:entity.get('nickName')});
        self.model.set({personaid:entity.id});
        self.render();
      });
    },

    productsearch: function(){
      var self = this,
          query = this.$('#product').val();

      this.trigger('product:select', query, function(entity){
        console.log('callback: [%s] [%s]',self.whoami,entity.get('slug'));
        var duracion="";
        if(entity.get('patechfacet')){
          duracion = entity.get('patechfacet').durnominal;
        }

        self.model.set({product:entity.get('productcode'), productid: entity.id,pslug:entity.get('slug'), durnominal: duracion});
        self.render();
      });
    },

  });

  Edit.ItemLayout = Marionette.LayoutView.extend({
    className: 'row',

    getTemplate: function(){
      return utils.templates.DocumEditPTLayout;
    },
    
    events: {
      "click button.js-submit": "submitClicked",
      "click button.js-cancel": "cancelClicked",
      "click button.js-addItem": "addItem",
    },

    submitClicked: function(e){
      e.preventDefault();
      this.trigger("form:submit");
    },

    cancelClicked: function(e){
      e.preventDefault();
      this.close()
    },

    addItem: function(e){
      e.preventDefault();
      this.trigger("sit:add:item");
    },
    
    regions: {
      ptheaderRegion: '#itemheader-region',
      ptlistRegion:   '#itemlist-region'
    }
  });


  Edit.PTecnicoListItem = DocManager.ActionsApp.Common.Views.Form.extend({
    templates: {
      ptecnico:   'DocumEditPTItem',
      nsolicitud: 'DocumEditSOItem',
      nrecepcion: 'DocumEditREItem',
      nentrega:   'DocumEditREItem',
      npedido:    'DocumEditREItem',
      pemision:   'DocumEditEMItem',
    },

    getTemplate: function(){
      console.log('getTEMPLATES: [%s]',this.templates[this.options.itemtype]);
      return utils.templates[this.templates[this.options.itemtype]];
    },

    tagName:'form',
    className: 'form-horizontal list-group-item',
 
    //tagName: "li",
    //className:"list-group-item",
    initialize: function(options){
      var self = this;
      this.events = _.extend({},this.formevents,this.events);
      this.delegateEvents();
      this.options = options;
      this.model.bind("tc:change", this.tcChange, this);
    },

    events: {
      "click .js-sitremove": "sitremove",
      "click .js-productsch": "productsearch",
    },

    tcChange: function(key){
      console.log('tcChange: [%s]',key);
      this.$('#'+key).val(this.model.get(key));
    },

    productsearch: function(){
      var self = this,
          query = this.$('#product').val();

      this.trigger('product:select', query, function(entity){
        console.log('callback: [%s] [%s]',entity.get('patechfacet'),entity.get('patechfacet').durnominal);
        var duracion="";
        if(entity.get('patechfacet')){
          duracion = entity.get('patechfacet').durnominal;
        }
        self.model.set({product:entity.get('productcode'), productid: entity.id,pslug:entity.get('slug'), durnominal: duracion});
        self.render();
      });
    },



    triggers: {
      //"click a": "document:new"
    },

    sitremove: function(){
      this.trigger('sit:remove:item', this.model);
    },

    onRender: function(){
    }
  });

  Edit.PTecnicoList = Marionette.CollectionView.extend({
    tagName: "div",
    className: "list-group",

    childView: Edit.PTecnicoListItem,
        
    events: {
    },
    
    initialize: function(options){
      this.options = options;
    },

    childViewOptions: function(model, index) {
      // do some calculations based on the model
      console.log('childViewOptions [%s]',model.whoami);
      return {
        itemtype:this.options.itemtype,
      }
    },

    onFormSubmit:function(){
      console.log('submit form:PTI-LIST');
      this.trigger("sit:form:submit");

    },

  });



  Edit.PEmisionDateItem = Marionette.ItemView.extend({
 
    getTemplate: function(){
      if(this.model.get('isActive')){
        return _.template('<button class="btn btn-info js-date" title="Repite: <%= repite %>  <%= comentario %> "><%= hourmain %></button>');
      }else{
        return _.template('<button class="btn btn-link js-date" title="ingrese horario <%= utils.dayweek[dayweek ]%>"><%= hourmain %></button>');
      }
    },

    tagName:'td',
    //className: 'col-sm-1',
 
    //tagName: "li",
    //className:"list-group-item",
    initialize: function(options){
      var self = this;
      this.options = options;
    },

    events: {
      "click .js-sitremove": "sitremove",
      "click .js-productsch": "productsearch",
      "click .js-date": "dateItem",

    },

    dateItem: function(){
      var self = this;
      console.log('dateItem CLICKED [%s]',self.model.get('dayweek'));
      self.trigger('date:select',self.model,function(entity){
        console.log('dateItem BACK');
        self.render();
      });
    },

    productsearch: function(){
      var self = this,
          query = this.$('#product').val();

      this.trigger('product:select', query, function(entity){
        console.log('callback: [%s] [%s]',entity.get('patechfacet'),entity.get('patechfacet').durnominal);
        var duracion="";
        if(entity.get('patechfacet')){
          duracion = entity.get('patechfacet').durnominal;
        }
        self.model.set({product:entity.get('productcode'), productid: entity.id,pslug:entity.get('slug'), durnominal: duracion});
        self.render();
      });
    },

    triggers: {
      //"click a": "document:new"
    },

    sitremove: function(){
      this.trigger('sit:remove:item', this.model);
    },

    onRender: function(){
    }
  });


  Edit.PEmisionListItem = Marionette.CompositeView.extend({
    templates: {
      pemision:   'DocumEditEMItem',
    },

    getTemplate: function(){
      return utils.templates[this.templates[this.options.itemtype]];
    },

    tagName:'tr',
    //className: 'list-group-item',
    
    childView: Edit.PEmisionDateItem,
    //childViewContainer: "tr",

    //tagName: "li",
    //className:"list-group-item",
    initialize: function(options){
      console.log('PEmisionListItem: COMPOSITE INITIALIZE [%s]',options.itemtype);
      var self = this;
      this.options = options;
      //this.collection = model.get('emisiones');
      //console.log('PEmisionListItem: COMPOSITE INITIALIZE [%s]',this.collection.length);
    },

    events: {
      "click .js-sitremove": "sitremove",
      "click .js-productsch": "productsearch",
    },

    productsearch: function(){
      var self = this,
          query = this.$('#product').val();

      this.trigger('product:select', query, function(entity){
        console.log('callback: [%s] [%s]',entity.get('patechfacet'),entity.get('patechfacet').durnominal);
        var duracion="";
        if(entity.get('patechfacet')){
          duracion = entity.get('patechfacet').durnominal;
        }
        self.model.set({product:entity.get('productcode'), productid: entity.id,pslug:entity.get('slug'), durnominal: duracion});
        self.render();
      });
    },



    triggers: {
      //"click a": "document:new"
    },

    onFormDataInvalid: function(errors){

    },

    sitremove: function(){
      this.trigger('sit:remove:item', this.model);
    },

    onRender: function(){
      console.log('on render PEmisionListItem: COMPOSITE INITIALIZE');
    }
  });

  Edit.PEmisionList = Marionette.CompositeView.extend({
    tagName: "table",
    className: "table table-bordered table-hover table-condensed hours",

    getTemplate: function(){
      return utils.templates['DocumEditEMHeader'];
    },

    childView: Edit.PEmisionListItem,
    childViewContainer: "tbody",

    initialize: function(options){
      console.log('PEmisionList:INITIALIZE');
      
      this.options = options;
    },

    childViewOptions: function(model, index) {
      // do some calculations based on the model
      console.log('PEmisionList:childViewOptions [%s] [%s]',model.get('pslug'),index);
      return {
        collection: model.get('emisiones'),
        itemtype:this.options.itemtype,
      }
    },

    onFormSubmit:function(){
      console.log('submit form:PTI-LIST');
      this.trigger("sit:form:submit");
    },
  });


});