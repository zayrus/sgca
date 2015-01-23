DocManager.module("DocsApp.Show", function(Show, DocManager, Backbone, Marionette, $, _){
  Show.MissingDocument = Marionette.ItemView.extend({
    template: _.template('<div class="alert alert-error">This contact does not exist</div>'),
  });



  Show.Layout = Marionette.Layout.extend({
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
      if(this.options.tpl==='ptecnico'){
        return utils.templates.DocumShowItemPTDetail;
      }else if(this.options.tpl==='nrecepcion' || this.options.tpl==='nentrega'){
        return utils.templates.DocumShowItemREDetail;
      }else if(this.options.tpl==='pemision'){
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
    templates: {
      //pemision:   'DocumEditEMItem',
    },

    initialize: function(options){
      console.log('COMPOSITE DocumentItems [%s] options:[%s]',this.collection.length, options);
      this.options = options;
    },

    getTemplate: function(){
      if(this.options.tpl === 'ptecnico'){
        return utils.templates.DocumShowItemPTComposite;
      }else if(this.options.tpl === 'nrecepcion' || this.options.tpl==='nentrega'){
        return utils.templates.DocumShowItemREComposite;
      }else if(this.options.tpl === 'pemision'){
        return utils.templates.DocumShowItemPEComposite;
      }
    },

    tagName:'table',
    className:'table table-bordered table-hover',

 
    itemView: Show.DocumentSubItem,
    itemViewContainer: "tbody",
        
    events: {
    },

    itemViewOptions: function(model, index) {
      // do some calculations based on the model
      console.log('itemViewOptions [%s]',model.whoami);
      return {tpl: this.options.tpl};
    }
  });


  Show.DocumentItemHeader = Marionette.ItemView.extend({
   getTemplate: function(){
      if(this.model.get('tipoitem')==='ptecnico'){
        return utils.templates.DocumShowItemPTHeader;
      } else if(this.model.get('tipoitem')==='nrecepcion' || this.model.get('tipoitem')==='nentrega'){
        return utils.templates.DocumShowItemREHeader;
      } else if(this.model.get('tipoitem')==='pemision'){
        return utils.templates.DocumShowItemPEHeader;
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
  Show.DocumentItemsLayout = Marionette.Layout.extend({
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

/*      
      if(this.model.get('tipoitem')==='ptecnico'){
        items = new Show.DocumentSubitems({
          collection: new DocManager.Entities.PTecnicoItems(this.model.get('items')),
          tpl: 'ptecnico'
        });
      } else if(this.model.get('tipoitem')==='nrecepcion' || this.model.get('tipoitem')==='nentrega'){
        items = new Show.DocumentSubitems({
          collection: new DocManager.Entities.MovimREItems(this.model.get('items')),
          tpl: 'nrecepcion'
        });
      }

*/      
      this.itemHeaderRegion.show(itemHeader);
      this.itemMainRegion.show(items);
    },

    getTemplate: function(){
      return utils.templates.DocumShowItemLayoutView;
    },

    itemViewOptions: function(model, index) {
      // do some calculations based on the model
      console.log('LAYOUT itemViewOptions [%s]',model.whoami);
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

    itemView: Show.DocumentItemsLayout,
        
    events: {
    },
    
    initialize: function(options){
      console.log('DocumentItems [%s]',this.collection.length);
      this.options = options;
    },

    itemViewOptions: function(model, index) {
      // do some calculations based on the model
      console.log('itemViewOptions [%s]',model.whoami);
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
