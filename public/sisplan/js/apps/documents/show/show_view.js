DocManager.module("DocsApp.Show", function(Show, DocManager, Backbone, Marionette, $, _){
  Show.MissingDocument = Marionette.ItemView.extend({
    template: _.template('<div class="alert alert-error">This contact does not exist</div>'),
  });



  Show.Layout = Marionette.LayoutView.extend({
    className: 'row row-offcanvas row-offcanvas-left',

    getTemplate: function(){
      return utils.templates.DocumShowLayoutView;
    },
    
    regions: {
      brandingRegion:    '#branding-region',
      navbarRegion:      '#navbar-region',
      headerRegion:     '#heading-region',
      mainRegion:        '#main-region',
      footerRegion:      '#footer-region',
    }
  });


  Show.Document = Marionette.ItemView.extend({
   getTemplate: function(){
      return utils.templates.DocumShowDef;
    },
 
    events: {
      "click a.js-edit": "editClicked"
    },

    editClicked: function(e){
      e.preventDefault();
      this.trigger("document:edit", this.model);
    }
  });

   /*
   *
   * DOCUMENT ITEM DETAL (SUBITEM)
   *
   */
 Show.DocumentSubItem = Marionette.ItemView.extend({
    tagName: 'tr',
    //className: 'success',

    getTemplate: function(){
      console.log('getTEMPLATE [%s]',this.options.tpl)
      if(dao.docum.isType(this.options.tpl, 'ptecnico')){
        return utils.templates.DocumShowItemPTDetail;
      }else if(dao.docum.isType(this.options.tpl, 'notas')){
        return utils.templates.DocumShowItemREDetail;
      }else if(dao.docum.isType(this.options.tpl, 'nsolicitud')){
        return utils.templates.DocumShowItemSODetail;
      }else if(dao.docum.isType(this.options.tpl, 'pemision')){
        return utils.templates.DocumShowItemPEDetail;
      }
    },
    initialize: function(options){
      console.log('ITEM SUB ITEM INIT [%s]',this.model.get('pticaso'));
      this.options = options;
    },
 
    events: {
      "click a.js-edit": "editClicked"
    },

    editClicked: function(e){
      e.preventDefault();
      this.trigger("document:edit", this.model);
    }
  });

  /*
   *
   * DOCUMENT ITEMS COMPOSITE
   *
   */
  Show.DocumentSubitems = Marionette.CompositeView.extend({
 
    initialize: function(options){
      console.log('COMPOSITE DocumentItems [%s] options:[%s]',this.collection.length, options);
      this.options = options;
    },

    getTemplate: function(){
      if(dao.docum.isType(this.options.tpl, 'ptecnico')){
        return utils.templates.DocumShowItemPTComposite;
      }else if(dao.docum.isType(this.options.tpl, 'notas')){
        return utils.templates.DocumShowItemREComposite;
      }else if(dao.docum.isType(this.options.tpl, 'nsolicitud')){
        return utils.templates.DocumShowItemSOComposite;
      }else if(dao.docum.isType(this.options.tpl, 'pemision')){
        return utils.templates.DocumShowItemPEComposite;
      }else if(dao.docum.isType(this.options.tpl, 'pdiario')){
        return utils.templates.DocumShowItemPDComposite;
      }
    },

    tagName:'table',
    className:'table table-bordered table-hover',

 
    childView: Show.DocumentSubItem,
    childViewContainer: "tbody",
        
    events: {
    },

    childViewOptions: function(model, index) {
      // do some calculations based on the model
      console.log('childViewOptions [%s]',model.whoami);
      return {tpl: this.options.tpl};
    }
  });


  Show.DocumentItemHeader = Marionette.ItemView.extend({
   getTemplate: function(){
      if(dao.docum.isType(this.model.get('tipoitem'), 'ptecnico')){
        return utils.templates.DocumShowItemPTHeader;
      } else if(dao.docum.isType(this.model.get('tipoitem'), 'notas')){
        return utils.templates.DocumShowItemREHeader;
      } else if(dao.docum.isType(this.model.get('tipoitem'), 'nsolicitud')){
        return utils.templates.DocumShowItemSOHeader;
      } else if(dao.docum.isType(this.model.get('tipoitem'), 'pemision')){
        return utils.templates.DocumShowItemPEHeader;
      } else if(dao.docum.isType(this.model.get('tipoitem'), 'pdiario')){
        return utils.templates.DocumShowItemPDHeader;
      }
    },
    initialize: function(){
      console.log('ITEMHADER INIT [%s]',this.model.get('fept'));
    },
 
    events: {
      "click a.js-edit": "editClicked"
    },

    editClicked: function(e){
      e.preventDefault();
      this.trigger("document:edit", this.model);
    }
  });


  /*
   *
   * DOCUMENT ITEMS LAYOUT
   *
   */
  Show.DocumentItemsLayout = Marionette.LayoutView.extend({
    className: 'row',
    initialize: function(options){
    },
    onShow:function(){
      console.log('onSHOW!!!!!!!!!!!!!!!!!!')
      //for (var i in arguments){console.log("[%s]: [%s]",i,arguments[i])}

      itemHeader = new Show.DocumentItemHeader({
        model: this.model
      });

      items = new Show.DocumentSubitems({
          collection: new DocManager.Entities.DocumSubItemsCollection(this.model.get('items'),{
            tipoitem: this.model.get('tipoitem'),
          }),
          tpl: this.model.get('tipoitem'),
      });

      this.itemHeaderRegion.show(itemHeader);
      this.itemMainRegion.show(items);
    },

    getTemplate: function(){
      return utils.templates.DocumShowItemLayoutView;
    },

    childViewOptions: function(model, index) {
      // do some calculations based on the model
      console.log('LAYOUT childViewOptions [%s]',model.whoami);
      return {};
    },

    
    regions: {
      itemHeaderRegion: '#itemheader-region',
      itemMainRegion:   '#itemsmain-region',
    }
  });

  Show.DocumentItems = Marionette.CollectionView.extend({
    tagName: "div",
    //className: "list-group",

    childView: Show.DocumentItemsLayout,
        
    events: {
    },
    
    initialize: function(options){
      console.log('DocumentItems [%s]',this.collection.length);
      this.options = options;
    },

    childViewOptions: function(model, index) {
      // do some calculations based on the model
      console.log('childViewOptions [%s]',model.whoami);
      return {};
    }
  });

  Show.Branding = Marionette.ItemView.extend({
   getTemplate: function(){
      return utils.templates.DocumShowBranding;
    },
 
    events: {
      "click a.js-edit": "editClicked"
    },

    editClicked: function(e){
      e.preventDefault();
      this.trigger("document:edit", this.model);
    }
  });

  Show.Header = Marionette.ItemView.extend({
   getTemplate: function(){
      return utils.templates.DocumShowHeader;
    },
 
    events: {
      "click a.js-edit": "editClicked"
    },

    editClicked: function(e){
      e.preventDefault();
      this.trigger("document:edit", this.model);
    }
  });


});
