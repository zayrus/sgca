DocManager.module("RequisitionApp.Edit", function(Edit, DocManager, Backbone, Marionette, $, _){
  Edit.Layout = Marionette.LayoutView.extend({
    className: 'row',

    getTemplate: function(){
      return utils.templates.DocumEditLayoutView;
    },
    
    regions: {
      //navbarRegion:  '#navbar-region',
      itemEditRegion: '#itemedit-region',
      headerInfoRegion: '#sidebar1-region',
      itemsInfoRegion: '#sidebar2-region',
      linksRegion:   '#panel-region',
      mainRegion:    '#main-region'
    }
  });


  Edit.Search = DocManager.RequisitionApp.Common.Views.SearchPanel.extend({
    initialize: function(options){
      this.optiones = options;
      var self = this;
    }, 
  });



  Edit.Document = DocManager.RequisitionApp.Common.Views.Form.extend({
    
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

      self.$('#myWizard').on('actionclicked.fu.wizard', function (evt, data) {
        var step = data.step;

        console.log('[%s]: wizard EVENT: step:[%s]  direction:[%s]', self.model.whoami, data.step, data.direction);
        if(data.direction === 'next'){
          if(!self.validateStep(step)){
            evt.preventDefault();
            self.$('#myWizard').wizard('selectedItem', {step: step});
          }else{
            console.log('Validation OK')
          }

        }

      });


      //this.$("#fevento").datepicker('setDate', '+40');

    //this.$('#fevento').datepicker( "dialog", "10/12/2012" );
    },

    validateStep: function(step){
      var self = this,
          valid = true,
          errors = {};

      var check = [['slug', 'fevento'],['organismo','nusuario','eusuario']];
      if(step>2 || step<1) return valid;

      _.each(check[step-1], function(fld){
          var attr = {};
          attr[fld] = self.model.get(fld);
          var err = self.model.validate(attr);
          //console.log('validating: [%s] [%s]',fld, err)
          //console.dir(err)
          _.extend(errors, err)
          if(err) valid = false;
      });
      self.onFormDataInvalid((errors||{}));
      return valid;

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
        console.log('Trying to set step 2: ************** [%s]',self.$('#myWizard').wizard('selectedItem') )
        self.$('#myWizard').wizard('selectedItem', {step: 2});
        console.log('DONE                  **************')
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
  Edit.createInstance = function(view){
        console.log('modal DOCUM NEW');
        var self = view,
            facet = new DocManager.Entities.DocumCoreFacet(),
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
            title: 'Alta rápida nuevo comprobante',
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
            facet.createNewDocument(function(err, model){
              DocManager.trigger("document:edit",model);
            });
        });
  };


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
  Edit.SolicitudDetail = DocManager.RequisitionApp.Common.Views.Form.extend({
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
  Edit.ItemHeader = DocManager.RequisitionApp.Common.Views.Form.extend({
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


  Edit.PTecnicoListItem = DocManager.RequisitionApp.Common.Views.Form.extend({
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