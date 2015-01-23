DocManager.module("DocsApp.List", function(List, DocManager, Backbone, Marionette, $, _){
  List.Layout = Marionette.Layout.extend({
    className: 'row row-offcanvas row-offcanvas-left',

    getTemplate: function(){
      return utils.templates.DocumListLayoutView;
    },
    
    regions: {
      navbarRegion:  '#navbar-region',
      sidebarRegion: '#sidebar-region',
      linksRegion:   '#panel-region',
      mainRegion:    '#main-region'
    }
  });

  List.Document = Marionette.ItemView.extend({
    tagName: "tr",

    getTemplate: function(){
      return _.template(utils.buildRowRenderTemplate(utils.documListTableHeader,utils.buildTableRowTemplates));
    },
/*
    template: _.template(
      '<td><%= cnumber %></td>' +
      '<td><%= tipocomp %></td>'  +
      '<td><%= slug %></td>'  +
      '<td>' +
       ' <a href="#comprobantes/<%= _id %>" class="btn btn-xs js-show" role="button">' +
        '  Show' +
        '</a>' +
        '<a href="#comprobantes/<%= _id %>/edit" class="btn btn-xs js-edit" role="button" >' +
         ' Edit' +
        '</a>' +
        '<button type="link" class="btn btn-warning btn-xs js-delete">' +
         ' Delete' +
        '</button>' +
      '</td>'
    ),

*/
    events: {
      "click": "highlightName",
      "click td a.js-show": "showClicked",
      "click td a.js-edit": "editClicked",
      "click button.js-delete": "deleteClicked",
      "click button.js-show": "showClicked",
      "click button.js-edit": "editClicked",
      "click .js-zoom" : 'viewRelated',
      "change .tselect"  : "checkbox",
    },

    flash: function(cssClass){
      var $view = this.$el;
      $view.hide().toggleClass(cssClass).fadeIn(800, function(){
        setTimeout(function(){
          $view.toggleClass(cssClass)
        }, 500);
      });
    },

    checkbox: function(event){
      if(event.target.checked)  this.trigger("document:row:selected", true, this.model);
      if(!event.target.checked) this.trigger("document:row:selected", false, this.model);
    },

    areRelatedVisible: false,

    viewRelated: function(){
      var self = this;
      console.log('View Related');
      if(self.areRelatedVisible){
        console.log('ready to REMOVE DOCUMENTS:RELATED');

          self.layout.removeRegion(self.model.get('documid'));

          var tr = $('#'+self.model.get('documid')).closest('tr');
          //tr.css("background-color","#FF3700");
          tr.remove();
          
          /*tr.fadeOut(400, function(){
              tr.remove();
          });*/

      }else{
        console.log('ready to trigger DOCUMENTS:RELATED');

        this.trigger('dcuments:related',this.model, function(){
          //no hay callbacl. futuros usos
        });

      }
      self.areRelatedVisible = !self.areRelatedVisible;

      return false;
    },

    highlightName: function(e){
      this.$el.toggleClass("warning");
    },

    showClicked: function(e){
      console.log('showCLICKED in ITEM VIESW [%s]',this.model.get('slug'));
      e.preventDefault();
      e.stopPropagation();
      this.trigger("document:show", this.model);
    },

    editClicked: function(e){
      e.preventDefault();
      e.stopPropagation();
      this.trigger("document:edit", this.model);
    },

    deleteClicked: function(e){
      e.stopPropagation();
      this.trigger("document:delete", this.model);
    },

    remove: function(){
      var self = this;
      this.$el.fadeOut(function(){
        Marionette.ItemView.prototype.remove.call(self);
      });
    }
  });




  var NoDocumentsView = Marionette.ItemView.extend({
    template: _.template('<td colspan="3">No hay comprobantes para mostrar</td>'),
    tagName: "tr",
    className: "alert"
  });




  List.Documents = Marionette.CompositeView.extend({
    tagName: "table",
    className: "table table-bordered table-hover table-condensed",

    getTemplate: function(){
      //console.log(utils.buildTableHeader(utils.documListTableHeader));
      return _.template(utils.buildTableHeader(utils.documListTableHeader)+'<tbody></tbody>');
    },

    //template: _.template()
      //'<thead><tr><td>comprob</td><td>tipo</td><td>Descripción</td><td>Acciones</td></tr></thead><tbody></tbody>'
      //'<thead><tr><th>comprob</th><th>tipo</th><th>Descripción</th><th>Acciones</th></tr></thead><tbody></tbody>'
    //),

    emptyView: NoDocumentsView,
    itemView: List.Document,
    itemViewContainer: "tbody",

    events: {
      "click .js-sortcolumn": "changeOrder",
    },

    changeOrder: function(event){

      var target = event.target;
      console.log('CLICKKKKKKKK!!!! [%s] [%s]',target,target.name);
      this.trigger("document:sort", target.name);
    },

    initialize: function(){
      this.listenTo(this.collection, "reset", function(){
        this.appendHtml = function(collectionView, itemView, index){
          collectionView.$el.append(itemView.el);
        }
      });
    },

    onCompositeCollectionRendered: function(){
      this.appendHtml = function(collectionView, itemView, index){
        collectionView.$el.prepend(itemView.el);
      }
    }
  });







  List.RelatedDocument = Marionette.ItemView.extend({
    tagName: "div",
    //className: 'item-group',

    getTemplate: function(){
      return utils.templates.DocumRelatedDOC;
    },
    initialize: function(){
      console.log('RelatedDocuments ITEM View: INIT')
    },

    events: {
      "click .js-docview": "viewDocument",
    },

    viewDocument: function(){
      console.log('clie View DOCUMENT!')

      this.trigger('view:related:document',this.model, function(){
        //no hay callbacl. futuros usos
      });
    },


    remove: function(){
      var self = this;
      this.$el.fadeOut(function(){
        Marionette.ItemView.prototype.remove.call(self);
      });
    }
  });

  List.ProductHeader = Marionette.ItemView.extend({
    tagName: "div",
    //className: 'item-group',

    getTemplate: function(){
      return utils.templates.DocumRelatedPRHeader;
    },

    initialize: function(){
      console.log('RelatedProducts ITEM View: INIT')
    },

    events: {
    },

    remove: function(){
      var self = this;
      this.$el.fadeOut(function(){
        Marionette.ItemView.prototype.remove.call(self);
      });
    }
  });

  List.RelatedProduct = Marionette.ItemView.extend({
    tagName: "div",

    getTemplate: function(){
      return utils.templates.DocumRelatedPR;
    },

    initialize: function(){
      console.log('RelatedProducts ITEM View: INIT')
    },

    events: {
      "click .js-productbrowse": "viewProduct",
      "click .js-productedit": "editProduct",
    },

    editProduct: function(){
      console.log('clie Edit PRODUCT!')

      this.trigger('edit:related:product',this.model, function(){
          //no hay callbacl. futuros usos
      });


    },

    viewProduct: function(){
      console.log('clie View PRODUCT!')

      this.trigger('view:related:product',this.model, function(){
          //no hay callbacl. futuros usos
      });


    },

    remove: function(){
      var self = this;
      this.$el.fadeOut(function(){
        Marionette.ItemView.prototype.remove.call(self);
      });
    }
  });

  List.RelatedProducts = Marionette.CollectionView.extend({
    tagName: "div",
    //className: "list-group",

    itemView: List.RelatedProduct,

    initialize: function(){
      console.log('RelatedProducts View: INIT')
    },

  });

  List.RelatedDocuments = Marionette.CollectionView.extend({
    tagName: "div",
    className: "list-group",

    itemView: List.RelatedDocument,

    initialize: function(){
      console.log('RelatedDocuments View: INIT')
    },

  });


  List.RelatedLayout = Marionette.Layout.extend({

    getTemplate: function(){
      return utils.templates.DocumRelatedLayout;
    },
    
    regions: {
      productRegion:   '#product-region',
      productsRegion:  '#products-region',
      documentsRegion: '#documents-region',
      hookRegion:      '#hook-region'
    }
  });


  // ventana modal
  List.queryForm = function(query, cb){
        var facet = new DocManager.Entities.DocumQueryFacet(query ),
            form = new Backbone.Form({
                model: facet
            });


        form.on('change', function(form, editorContent) {
            //console.log('change');
            var errors = form.commit();
            return false;
        });

        form.on('blur', function(form, editorContent) {
            //console.log('blur');
            //var errors = form.commit();
            return false;
        });

        var modal = new Backbone.BootstrapModal({
            content: form,
            title: 'Consulta comprobantes',
            okText: 'aceptar',
            cancelText: 'cancelar',
            enterTriggersOk: false,
            animate: false
        });

        modal.on('ok',function(){
          //console.log('MODAL ok FIRED');
          //modal.preventClose();

        });

        modal.open(function(){
            //console.log('modal CLOSE');
            var errors = form.commit();
            if(cb) cb(facet);
        });
  };

  // ventana modal
  List.viewDocument = function(view, cb){


    var modal = new Backbone.BootstrapModal({
        content: view,
        title: 'Vista comprobante',
        okText: 'aceptar',
        cancelText: 'cancelar',
        enterTriggersOk: false,
        animate: true
    });

    modal.on('shown', function(){
      console.log('shown')
      view.trigger('show');
    });

    modal.on('ok',function(){
      console.log('yew, ok')
    });

    modal.open(function(){
      console.log('open callback yew, ok')
    });
  };

  // ventana modal
  List.groupEditForm = function(cb){
        var facet = new DocManager.Entities.DocumGropuEditFacet(),
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
            title: 'Edición de comprobantes seleccionados',
            okText: 'aceptar',
            cancelText: 'cancelar',
            enterTriggersOk: false,
            animate: false
        });

        modal.on('ok',function(){
        });

        modal.open(function(){
            var errors = form.commit();
            if(cb) cb(facet);
        });
  };


});



/*
  List.Panel = Marionette.ItemView.extend({
    template: "#document-list-panel",

    triggers: {
      "click button.js-new": "document:new"
    },

    events: {
      "submit #filter-form": "filterDocuments"
    },

    ui: {
      criterion: "input.js-filter-criterion"
    },

    filterDocuments: function(e){
      e.preventDefault();
      var criterion = this.$(".js-filter-criterion").val();
      this.trigger("documents:filter", criterion);
    },

    onSetFilterCriterion: function(criterion){
      this.ui.criterion.val(criterion);
    }
  });
*/

