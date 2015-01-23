MediaManager.module("MediaApp.Show", function(Show, MediaManager, Backbone, Marionette, $, _){
  Show.MissingMedia = Marionette.ItemView.extend({
    template: _.template('<div class="alert alert-error">Esta media no fue encontrada</div>'),
  });

  Show.Layout = Marionette.Layout.extend({
    //className: 'row row-offcanvas row-offcanvas-left',

    getTemplate: function(){
      return utils.templates.MediaShowLayout;
    },

    events: {
      "click a.js-ciclo": "editCiclo",
      "click a.js-capitulo": "editCapitulo",

      "click a.js-realization": "realization",
      "click a.js-clasification": "clasification",
      "click a.js-paisprov": "paisprov",
      "click a.js-contenido": "contenido",
      "click a.js-curaduria": "curaduria",
      "click a.js-produccion": "produccion",
      "click a.js-slug": "slug",
      "click a.js-editestados": "estado",
    },
    estado: function(e){
      e.preventDefault();
      var target = e.target;
      console.log('estado [%s]', this.$(target).data('key'));
      this.trigger('token:selected', this.$(target).data('key'));

      return false;
    },

    slug: function(e){
      e.preventDefault();
      var target = e.target;
      console.log('slug [%s]', this.$(target).data('key'));
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

    editCiclo: function(e){
      e.preventDefault();
      console.log('Ciclo Clicked');
      this.$('.js-ciclo').closest('li').toggleClass('active',true);
      this.$('.js-capitulo').closest('li').toggleClass('active',false);
      this.trigger('chapter:serie:toggle', 'ciclo');

      return false;

    },

    editCapitulo: function(e){
      e.preventDefault();
      console.log('Capitulo Clicked');
      this.$('.js-ciclo').closest('li').toggleClass('active',false);
      this.$('.js-capitulo').closest('li').toggleClass('active',true);
      this.trigger('chapter:serie:toggle', 'capitulo');
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
      selectorRegion:   '#selector-region',
      brandingRegion:   '#branding-region',
      productRegion:    '#product-region',
      playerRegion:     '#player-region'
    }
  });



  Show.Media = Marionette.ItemView.extend({

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


  Show.StateForm = MediaManager.MediaApp.Common.Views.Form.extend({
    
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

  Show.editProductState = function(product, token){
        console.log('EditProductState [%s] [%s]',product.get('slug'),token);
        var self = this,
            facet = product.getFacet(token);
        
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

            product.setFacet(facet.get('name'),facet);
          }

          if(!(name==='estado_alta'|| name==='nivel_ejecucion' || name==='nivel_importancia')){
            mediaView.changeButton(name);
          }
        });

        mediaView.on('form:close',function(name,value){
          console.log('gotITTTTTTTTTTTTTTTTT');
          if(facet.get('name')==='editestados'){
            product.setFacet(facet.get('name'),facet);
          }
        });

        return mediaView;
  };


  Show.editProduct = function(product, token){
        console.log('EditProduct [%s] [%s]',product.get('slug'),token);
        var self = this,
            //facet = new MediaManager.Entities.ProductTextFacet(),
            facet = product.getFacet(token),
            form = new Backbone.Form({
                model: facet
            }).render();


        // FACETA: contenido
        facet.on('change:cetiquetas', function(facet, cetiquetas) {
            form.setValue({cetiquetas:cetiquetas});
            var errors = form.commit();
            product.setFacet(token, facet);
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
            product.setFacet(token, facet);
            return false;
        });
        
        var mediaView = new Show.Media({
          model:facet,
          form: form
        });

        return mediaView;

  };

  Show.Search = MediaManager.MediaApp.Common.Views.SearchPanel.extend({
    initialize: function(options){
      this.optiones = options;
      var self = this;
    }, 
  });


  // ventana modal
  Show.modalSearchEntities = function(type, query, cb){
        var options = {
          documents: {
            title:'buscar comprobantes',
            collection: new MediaManager.Entities.ComprobanteCollection(),
            model: new Backbone.Model({query:query}),
            searchtrigger:"document:filtered:entities",
            itemViewOptions:{
              itemtype:'documentos'
            }
          },

          persons: {
            title:'buscar personas',
            collection: new MediaManager.Entities.PersonCollection(),
            model: new Backbone.Model({query:query}),
            searchtrigger:"person:filtered:entities",
            itemViewOptions:{
              itemtype:'persons'
            }  
          },

          products: {
            title:'buscar productos',
            collection: new MediaManager.Entities.ProductCollection(),
            model: new Backbone.Model({query:query}),
            searchtrigger:"product:filtered:entities",
            itemViewOptions:{
              itemtype:'products'
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



  Show.HeaderForm = MediaManager.MediaApp.Common.Views.Form.extend({
    
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
