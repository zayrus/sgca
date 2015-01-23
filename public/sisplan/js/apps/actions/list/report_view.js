DocManager.module("ActionsApp.Report", function(Report, DocManager, Backbone, Marionette, $, _){
  Report.MainLayout = Marionette.LayoutView.extend({
    //className: 'row row-offcanvas row-offcanvas-left',

    getTemplate: function(){
      return utils.templates.ActionReportLayoutView;
    },
    regions: {
      reportRegion:    '#report-hook'
    }
  });



  Report.BudgetItem = Marionette.ItemView.extend({
    tagName: 'tr',
    whoami:'ActionReportBudgetItem',
    //className: 'success',

    getTemplate: function(){
      return utils.templates.ActionReportBudgetItem;
    },
    initialize: function(options){
      console.log('[%s] INIT [%s]',this.whoami, this.model.get('slug'));
      this.options = options;
    },
 
    events: {
      "click a.js-edit": "editClicked"
    },

    editClicked: function(e){
      e.preventDefault();
      this.trigger("action:edit", this.model);
    }
  });

  Report.BudgetComposite = Marionette.CompositeView.extend({
    tagName:'div',
    className:"col-xs-12 col-md-12",
    whoami:'BudgetComposite',

    initialize: function(options){
      console.log('[%s]: [%s] options:[%s]',this.whoami, this.collection.length, options);
      this.options = options;
    },

    getTemplate: function(){
      return utils.templates.ActionReportBudgetComposite;
    },

    childView: Report.BudgetItem,
    childViewContainer: "tbody",
        
    events: {
    },

    childViewOptions: function(model, index) {
      // do some calculations based on the model
      console.log('childViewOptions [%s]',model.whoami);
      return {tpl: this.options.tpl};
    }
  });



  Report.Branding = Marionette.ItemView.extend({
   getTemplate: function(){
      return utils.templates.ActionReportBranding;
    }, 
    events: {
    },

  });


  Report.ActionLayout = Marionette.LayoutView.extend({
    className: 'row well',
    //
    onShow:function(){
      var self = this;

      console.log('onSHOW!!!!!!!!!!!!!!!!!!')
      //for (var i in arguments){console.log("[%s]: [%s]",i,arguments[i])}

      var branding = new Report.Branding({
        model: self.model
      });

      this.brandingRegion.show(branding);
      loadBudgets(self.model, self)
    },

    getTemplate: function(){
      return utils.templates.ActionReportItemLayout;
    },
    
    regions: {
      brandingRegion:   '#branding-region',
      budgetRegion:     '#budget-region',
    }
  });

  Report.ReportCollection = Marionette.CollectionView.extend({
    tagName: "div",
    //className: "list-group",

    childView: Report.ActionLayout,

    initialize: function(){
      console.log('ReportCollection View: INIT')
    },

  });

  var loadBudgets = function(entity, layoutview){
      DocManager.request('action:fetch:budget',entity, null,function(budgetCol){
        console.log('BudgetCol REQUEST CB:[%s][%s]',budgetCol.length, budgetCol.whoami);
        if(budgetCol.length){
          var costoTotal = DocManager.request('action:evaluate:cost',budgetCol);

          var budgetView = new Report.BudgetComposite({
            model: new Backbone.Model({costo_total: costoTotal}),
            collection: budgetCol
          });
          layoutview.budgetRegion.show(budgetView)
        }

      });
  };

  Report.Headers = Marionette.ItemView.extend({
    //childView: List.Header,
    //childViewContainer: "ul#taskmenu",
    
    getTemplate: function(){
      return utils.templates.ActionReportHeader;
    },
    
    events: {
      "click a.brand": "brandClicked"
    },

    brandClicked: function(e){
      e.preventDefault();
      this.trigger("brand:clicked");
    }
  });














  Report.Header = Marionette.ItemView.extend({
   getTemplate: function(){
      return utils.templates.ActionReportHeader;
    },
 
    events: {
      "click a.js-edit": "editClicked"
    },

    editClicked: function(e){
      e.preventDefault();
      this.trigger("actionedit", this.model);
    }
  });

  Report.ActionReportBudgetItem = Marionette.ItemView.extend({
    tagName: 'tr',
    whoami:'ActionReportBudgetItem',
    //className: 'success',

    getTemplate: function(){
      return utils.templates.ActionReportBudgetItem;
    },
    initialize: function(options){
      console.log('[%s] INIT [%s]',this.whoami, this.model.get('slug'));
      this.options = options;
    },
 
    events: {
      "click a.js-edit": "editClicked"
    },

    editClicked: function(e){
      e.preventDefault();
      this.trigger("action:edit", this.model);
    }
  });

  Report.ActionReportBudget = Marionette.CompositeView.extend({
    tagName:'div',
    className:'panel',
    whoami:'ActionReportBudget',

    initialize: function(options){
      console.log('[%s]: [%s] options:[%s]',this.whoami, this.collection.length, options);
      this.options = options;
    },

    getTemplate: function(){
      return utils.templates.ActionReportBudgetComposite;
    },

    childView: Report.ActionReportBudgetItem,
    childViewContainer: "tbody",
        
    events: {
    },

    childViewOptions: function(model, index) {
      // do some calculations based on the model
      console.log('childViewOptions [%s]',model.whoami);
      return {tpl: this.options.tpl};
    }
  });







  Report.Action = Marionette.ItemView.extend({
    tagName: "tr",

    getTemplate: function(){
      return _.template(utils.buildRowRenderTemplate(utils.actionReportTableHeader,utils.buildTableRowTemplates));
    },

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
      if(event.target.checked)  this.trigger("action:row:selected", true, this.model);
      if(!event.target.checked) this.trigger("action:row:selected", false, this.model);
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
      this.trigger("action:show", this.model);
    },

    editClicked: function(e){
      e.preventDefault();
      e.stopPropagation();
      this.trigger("action:edit", this.model);
    },

    deleteClicked: function(e){
      e.stopPropagation();
      this.trigger("action:delete", this.model);
    },

    remove: function(){
      var self = this;
      this.$el.fadeOut(function(){
        Marionette.ItemView.prototype.remove.call(self);
      });
    }
  });




  var NoActionsView = Marionette.ItemView.extend({
    template: _.template('<td colspan="3">No hay comprobantes para mostrar</td>'),
    tagName: "tr",
    className: "alert"
  });




  Report.Actions = Marionette.CompositeView.extend({
    tagName: "table",
    className: "table table-bordered table-hover table-condensed",

    getTemplate: function(){
      //console.log(utils.buildTableHeader(utils.documReportTableHeader));
      return _.template(utils.buildTableHeader(utils.actionReportTableHeader)+'<tbody></tbody>');
    },


    emptyView: NoActionsView,
    childView: Report.Action,
    childViewContainer: "tbody",

    events: {
      "click .js-sortcolumn": "changeOrder",
    },

    changeOrder: function(event){

      var target = event.target;
      console.log('CLICKKKKKKKK!!!! [%s] [%s]',target,target.name);
      this.trigger("action:sort", target.name);
    },

    initialize: function(){
      this.listenTo(this.collection, "reset", function(){
        this.appendHtml = function(collectionView, childView, index){
          collectionView.$el.append(childView.el);
        }
      });
    },

    onRenderCollection: function(){
      this.appendHtml = function(collectionView, childView, index){
        collectionView.$el.prepend(childView.el);
      }
    }
  });







  Report.RelatedAction = Marionette.ItemView.extend({
    tagName: "div",
    //className: 'item-group',

    getTemplate: function(){
      return utils.templates.ActionRelatedDOC;
    },
    initialize: function(){
      console.log('RelatedActions ITEM View: INIT')
    },

    events: {
      "click .js-docview": "viewAction",
    },

    viewAction: function(){
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

  Report.ProductHeader = Marionette.ItemView.extend({
    tagName: "div",
    //className: 'item-group',

    getTemplate: function(){
      return utils.templates.ActionRelatedPRHeader;
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

  Report.RelatedProduct = Marionette.ItemView.extend({
    tagName: "div",

    getTemplate: function(){
      return utils.templates.ActionRelatedPR;
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

  Report.RelatedProducts = Marionette.CollectionView.extend({
    tagName: "div",
    //className: "list-group",

    childView: Report.RelatedProduct,

    initialize: function(){
      console.log('RelatedProducts View: INIT')
    },

  });

  Report.RelatedActions = Marionette.CollectionView.extend({
    tagName: "div",
    className: "list-group",

    childView: Report.RelatedAction,

    initialize: function(){
      console.log('RelatedActions View: INIT')
    },

  });


  Report.RelatedLayout = Marionette.LayoutView.extend({

    getTemplate: function(){
      return utils.templates.ActionRelatedLayout;
    },
    
    regions: {
      productRegion:   '#product-region',
      productsRegion:  '#products-region',
      documentsRegion: '#documents-region',
      hookRegion:      '#hook-region'
    }
  });


  // ventana modal
  Report.queryForm = function(query, cb){
        var facet = new DocManager.Entities.ActionQueryFacet(query ),
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
            title: 'Filtrar Acciones',
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
  Report.viewAction = function(view, cb){


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
  Report.groupEditForm = function(cb){
        var facet = new DocManager.Entities.ActionGropuEditFacet(),
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
  Report.Panel = Marionette.ItemView.extend({
    template: "#document-list-panel",

    triggers: {
      "click button.js-new": "action:new"
    },

    events: {
      "submit #filter-form": "filterActions"
    },

    ui: {
      criterion: "input.js-filter-criterion"
    },

    filterActions: function(e){
      e.preventDefault();
      var criterion = this.$(".js-filter-criterion").val();
      this.trigger("documents:filter", criterion);
    },

    onSetFilterCriterion: function(criterion){
      this.ui.criterion.val(criterion);
    }
  });
*/

