StudioManager.module("MediaApp.Show", function(Show, StudioManager, Backbone, Marionette, $, _){
  Show.MissingMedia = Marionette.ItemView.extend({
    template: _.template('<div class="alert alert-error">Esta entidad no fue encontrada</div>'),
  });

  Show.Layout = Marionette.Layout.extend({
    //className: 'row row-offcanvas row-offcanvas-left',

    getTemplate: function(){
      return utils.templates.MediaShowLayout;
    },

    events: {
      "click a.js-production": "editProduction",
      "click a.js-asset": "editAsset",

      "click a.js-properties": "properties",

      "click a.js-realization": "realization",
      "click a.js-clasification": "clasification",
      "click a.js-paisprov": "paisprov",
      "click a.js-contenido": "contenido",
      "click a.js-curaduria": "curaduria",
      "click a.js-produccion": "produccion",
      "click a.js-editestados": "estado",
    },

    properties: function(e){
      e.preventDefault();
      var target = e.target;
      console.log('Properties:edit [%s]', this.$(target).data('key'));
      this.trigger('token:selected', this.$(target).data('key'));
      return false;
    },

    estado: function(e){
      e.preventDefault();
      var target = e.target;
      console.log('estado [%s]', this.$(target).data('key'));
      this.trigger('token:selected', this.$(target).data('key'));

      return false;
    },


    produccion: function(e){
      e.preventDefault();
      var target = e.target;
      console.log('Produccion [%s]', this.$(target).data('key'));
      this.trigger('token:selected', this.$(target).data('key'));

      return false;
    },

    curaduria: function(e){
      e.preventDefault();
      var target = e.target;
      console.log('Contenido [%s]', this.$(target).data('key'));
      this.trigger('token:selected', this.$(target).data('key'));

      return false;
    },

    contenido: function(e){
      e.preventDefault();
      var target = e.target;
      console.log('Contenido [%s]', this.$(target).data('key'));
      //this.$(target).button();
      //this.$(target).button('toggle');
      this.trigger('token:selected', this.$(target).data('key'));

      return false;
    },

    paisprov: function(e){
      e.preventDefault();
      var target = e.target;
      console.log('Paisprov [%s]', this.$(target).data('key'));
      //this.$(target).button();
      //this.$(target).button('toggle');
      this.trigger('token:selected', this.$(target).data('key'));

      return false;
    },

    editProduction: function(e){
      e.preventDefault();
      console.log('Production Clicked');
      this.$('.js-production').closest('li').toggleClass('active',true);
      this.$('.js-asset').closest('li').toggleClass('active',false);
      this.trigger('production:serie:toggle', 'production');

      return false;

    },

    editAsset: function(e){
      e.preventDefault();
      console.log('Asset Clicked');
      this.$('.js-production').closest('li').toggleClass('active',false);
      this.$('.js-asset').closest('li').toggleClass('active',true);
      this.trigger('production:serie:toggle', 'asset');
      return false;
    },

    realization: function(e){
      e.preventDefault();
      var target = e.target;
      console.log('Realization [%s]', this.$(target).data('key'));
      //this.$(target).button();
      //this.$(target).button('toggle');
      this.trigger('token:selected', this.$(target).data('key'));

      return false;
    },

    clasification: function(e){
      e.preventDefault();
      var target = e.target;
      console.log('Realization [%s]', this.$(target).data('key'));
      //this.$(target).button();
      //this.$(target).button('toggle');
      this.trigger('token:selected', this.$(target).data('key'));

      return false;
    },

    
    regions: {
      navbarRegion:   '#navbar-region',
      headerRegion:   '#header-region',
      entitiesRegion: '#entities-region',
      selectorRegion: '#selector-region',
      actionRegion:   '#action-region',
      brandingRegion: '#branding-region',
      entityRegion:   '#entity-region',
      playerRegion:   '#player-region'
    }
  });



  Show.Media = Marionette.ItemView.extend({
    //player-region

   getTemplate: function(){
      return utils.templates.MediaDataView;
    },

    initialize: function(options){
      this.options = options;

    },
 
    events: {
      "click a.js-edit": "editClicked"
    },

    editClicked: function(e){
      e.preventDefault();
      this.trigger("media:edit", this.model);
    },

    onRender: function(){
      var self = this;
      console.log('onRender [%s]',$('#player-region'));

      self.$('#bform').html(self.options.form.el);
      $('textarea',self.options.form.el).addClass('input-block-level').attr('rows',"6");


    },

    getFile: function(){
      var chapters = this.model.get('chapters');
      var chapter = chapters[this.model.get('selectedChapter')];
      var url = chapter.branding[0].url;
      console.log('getFIle: [%s]',url);
      return url;
    },
  });


  Show.StateForm = StudioManager.MediaApp.Common.Views.Form.extend({
    
    tagName:'div',

    getTemplate: function(){
      return utils.templates.MediaShowStateForm;
    },

    events: {
        "click .js-pendings": "togglepending",
    
    },

    togglepending: function(event){
        var target = event.target;
        console.log('Button Pendings: [%s] [%s]',target.type, target.id)
        var btnstate = this.model.togglePendings(target);

        this.trigger("form:change", target.name, target.value);
        this.changeButton(target.name)

    },

    changeButton: function(key){
      console.log('ChangeButton!');
      var btnclass = this.model.getButtonType(key);
      this.$('#'+key).toggleClass('btn-info btn-success btn-warning btn-danger btn-default disabled', false);
      this.$('#'+key).toggleClass(btnclass, true);
    },

    initialize: function(options){
      var self = this;
      this.events = _.extend({},this.formevents,this.events);
      this.delegateEvents();
    },
 
  });

  Show.editProductionState = function(production, token){
        console.log('ShowProductionState [%s] [%s]',production.get('slug'),token);
        var self = this,
            facet = production.getFacet(token);
        
        var mediaView = new Show.StateForm({
          model:facet,
        });

        mediaView.on('form:change',function(name, value){
          console.log('Form Change: [%s] [%s]', name, value);
          if(facet.get('name')==='editestados'){
            if(name==='nivel_ejecucion'){
              console.log('ATENCION CAMBIO NIVEL EJECUCION')
              facet.setPendingsFromExecutionState();
              mediaView.render();
            }

            production.setFacet(facet.get('name'),facet);
          }

          if(!(name==='estado_alta'|| name==='nivel_ejecucion' || name==='nivel_importancia')){
            mediaView.changeButton(name);
          }
        });

        mediaView.on('form:close',function(name,value){
          console.log('gotITTTTTTTTTTTTTTTTT');
          if(facet.get('name')==='editestados'){
            production.setFacet(facet.get('name'),facet);
          }
        });

        return mediaView;
  };


  Show.editProduction = function(production, token){
        console.log('EditProduction [%s]',token);
        var self = this,
            //facet = new StudioManager.Entities.ProductionTextFacet(),
            facet = production.getFacet(token),
            form = new Backbone.Form({
                model: facet
            }).render();


        // FACETA: contenido
        facet.on('change:cetiquetas', function(facet, cetiquetas) {
            form.setValue({cetiquetas:cetiquetas});
            var errors = form.commit();
            production.setFacet(token, facet);
        });

        form.$('.js-addcontenido').click(function(e){
            e.stopPropagation();
            e.preventDefault();
            facet.addEtiquetas();

            return false;
        });

        form.on('contenido:tematica:change', function(form, editor, editorContent) {
            var tematica = editor.nestedForm.fields.tematica.getValue(),
              newOptions = utils.subtematicasOptionList[tematica];
            //utils.inspect(editorContent,0,'editorContent',3);
            form.fields.contenido.editor.nestedForm.fields.subtematica.editor.setOptions(newOptions);
        });

        form.on('contenido:subtematica:change', function(form, editor) {
            var stematica = editor.nestedForm.fields.subtematica.getValue();
            //console.log('onchange:SUB TEMATICA key [%s]',stematica);
        });

        form.on('cetiquetas:blur', function(form, editorContent) {
            var errors = form.commit();
            facet.setTagList();
            console.log('cetiquetas:blur [%s]', facet.get('cetiquetas'));
        });


        // FACETA: paisprov
        form.on('paisprod:change', function(form, editorContent) {
            var opt = editorContent.getValue()==='Argentina'? 'Argentina':'nodefinido';
            form.fields.provinciaprod.editor.setOptions( utils.provinciasOptionList[opt]);
        });

        form.on('change', function(form, editorContent) {
            console.log('change');
            var errors = form.commit();
            return false;
        });

        form.on('blur', function(form, editorContent) {
            var errors = form.commit();
            console.log('FORM BLUR [%s]', facet.get('name'));
            production.setFacet(token, facet);
            return false;
        });
        
        var mediaView = new Show.Media({
          model:facet,
          form: form
        });

        return mediaView;

  };

  Show.Search = StudioManager.MediaApp.Common.Views.SearchPanel.extend({
    initialize: function(options){
      this.optiones = options;
      var self = this;
    }, 
  });

  // ventana modal
  // ventana modal
  Show.createIngest = function(production, type){
        console.log('modal  NEW INGEST');
        var self = this,
            facet = new StudioManager.Entities.ProductionNewIngestFacet(),
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
            title: 'Asset Ingest',
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
            facet.createNewIngest(production, function(err, model){
              //StudioManager.trigger("production:edit",model);
            });
        });
  };

  Show.createInstance = function(production, type){
        console.log('modal  NEW USER');
        var self = this,
            facet = new StudioManager.Entities.ProductionNewUserFacet(),
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
            title: 'Alta rápida Usuario',
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
            facet.createNewUser(production, function(err, model){
              //StudioManager.trigger("production:edit",model);
            });
        });
  };



  // ventana modal
  Show.modalSearchEntities = function(type, query, cb){
        var options = {
          documents: {
            title:'buscar comprobantes',
            collection: new StudioManager.Entities.ComprobanteCollection(),
            model: new Backbone.Model({query:query}),
            searchtrigger:"document:filtered:entities",
            itemViewOptions:{
              itemtype:'documentos'
            }
          },

          persons: {
            title:'buscar personas',
            collection: new StudioManager.Entities.PersonCollection(),
            model: new Backbone.Model({query:query}),
            searchtrigger:"person:filtered:entities",
            itemViewOptions:{
              itemtype:'persons'
            }  
          },

          productions: {
            title:'buscar productions',
            collection: new StudioManager.Entities.ProductionCollection(),
            model: new Backbone.Model({query:query}),
            searchtrigger:"production:filtered:entities",
            itemViewOptions:{
              itemtype:'productions'
            }  
          }

        }
        var form = new Show.Search(options[type]);

        form.on('itemview:item:found',function(form,model){
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


  Show.ProductionEntities = StudioManager.MediaApp.Common.Views.Form.extend({
    
    tagName:'div',

    getTemplate: function(){
      return utils.templates.MediaShowEntitiesForm;
    },

    events: {
        "click .js-pendings": "togglepending",    
    },

    initialize: function(options){
      var self = this;
      this.events = _.extend({},this.formevents,this.events);
      this.delegateEvents();
    },
 
  });


  Show.ProductionSelectors = StudioManager.MediaApp.Common.Views.Form.extend({
    
    tagName:'div',
    className: 'panel panel-default',

    getTemplate: function(){
      return utils.templates.MediaShowSelectorForm;
    },

    events: {
        "click .js-pendings": "togglepending",    
    },

    initialize: function(options){
      var self = this;
      this.events = _.extend({},this.formevents,this.events);
      this.delegateEvents();
    },
 
  });


  Show.ProductionHeader = Marionette.ItemView.extend({
    
    tagName:'div',
    className: 'panel panel-default',

    getTemplate: function(){
      return utils.templates.MediaShowHeadView;
    },

    initialize: function(options){
      console.log('productionHeader')
    },

    events: {
    },
    
    onRender: function(){
      console.log('onRender [%s]',$('#header-region'));
    },



   });


  Show.HeaderForm = StudioManager.MediaApp.Common.Views.Form.extend({
    
    tagName:'div',
    className: 'panel panel-default',

    getTemplate: function(){
      return utils.templates.MediaShowHeadForm;
    },

    initialize: function(options){
      var self = this;
      this.events = _.extend({},this.formevents,this.events);
      this.delegateEvents();
   },

    events: {
      "click .js-personsch": "personsearch",
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

});
