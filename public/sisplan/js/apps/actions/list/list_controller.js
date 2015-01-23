DocManager.module("ActionsApp.List", function(List, DocManager, Backbone, Marionette, $, _){

  var registerHeadersEvents = function(hview, layout){
      hview.on("childview:imprimir:registros", function(childView){
        //DocManager.ActionsApp.Edit.createInstance(this);
        console.log('ImprimirRegistros BUBBLED');
        DocManager.request("print:filtered:actions");

      });



      hview.on("childview:document:new", function(childView){
        DocManager.ActionsApp.Edit.createInstance(this);
      });

      hview.on("childview:report:new", function(childView){
        console.log('Report nuevo comprobante NEW!');
        DocManager.ActionsApp.Report.Edit.createInstance(this);
      });

      hview.on("childview:documents:list", function(childView, model){
        //var trigger = model.get("navigationTrigger");
        //DocManager.trigger(trigger);
        DocManager.request("action:filtered:entities","", function(model){
          console.log('document LIST cb')
        });      
      });

      hview.on('entities:search',function(query, cb){

        DocManager.request("actions:query:search",query, function(model){
          if(model){
            Edit.Session.layout.close();
            DocManager.trigger("action:edit", model);
          }
        });      

      });

      hview.on('document:group:edit',function(){
        var self = this;
        if(!List.Session.selectedActionList.length) return;
        console.log('document:group:edit controller');

        List.groupEditForm(function(qmodel){
          
          var data = qmodel.attributes;
          console.log('Form CLOSE:[%s] [%s]',data.estado_alta, data.nivel_ejecucion);
          updateSelectedActions(data, function(){
            console.log('end-of-story')
          });

        });

        
      });

  };
  var updateSelectedActions = function(data, cb){
    var actual = dao.extractData(data);
    var query = buildQuery(data);
    var update = new DocManager.Entities.ActionsUpdate();
    update.fetch({
        data: query,
        type: 'post',
        success: function() {
          console.log('success!!!!!')
            if(cb) cb();
        }
    });

  };

  var buildQuery = function(data){
    var query = {};

    var list = [];
    List.Session.selectedActionList.each(function(model){
      list.push(model.id || model.get('documid'));
    })
    query.newdata = dao.extractData(data);
    query.nodes = list;
    return query;

  };

  var initNavPanel = function(layout){
      var links = DocManager.request("action:list:entities");

      var headers = new DocManager.ActionsApp.Common.Views.NavPanel({collection: links});
      registerHeadersEvents(headers, layout);

      return headers;
  };

  List.Controller = {
    listActions: function(criterion){

      console.log('ActionsApp.List.Controller.listactions HEY!');
      // indicación de espera:
      //var loadingView = new DocManager.Common.Views.Loading();
      //DocManager.mainRegion.show(loadingView);

      if(!List.Session) List.Session = {};
      List.Session.layout = new List.Layout();
      
      List.Session.navbar = initNavPanel(List.Session.layout);
      
      List.Session.layout.on("show", function(){
        List.Session.layout.navbarRegion.show(List.Session.navbar);
      //List.Session.layout.mainRegion.show(loadingView);
      });
      DocManager.mainRegion.show(List.Session.layout);

      dao.gestionUser.getUser(DocManager, function (user){

        List.Session.query = dao.gestionUser.getActionQuery();

        DocManager.request("action:query:list", new DocManager.Entities.ActionQueryFacet(List.Session.query).attributes);

      });

    },
    reportActions: function(){
      console.log('ActionsApp.List.Controller.reportActions!');

      dao.gestionUser.getUser(DocManager, function (user){

        var query = dao.gestionUser.getActionQuery();

        DocManager.request("action:query:entities", query, function(actions){
          console.log('listaActions cb: [%s]', actions.length)
          printActionReport(actions);
        });

      });
    }
  };

  var printActionReport = function(col){
    //var branding = new DocManager.ActionsApp.Report.Branding(model);
    //var layout = new DocManager.ActionsApp.Report.ActionLayout(model);

    var sortOrder = ['nodo', 'area', 'taccion', 'cnumber'];
    orderCollectionToPrint(col, sortOrder);

    //var header = new DocManager.ActionsApp.Report.Headers();

    var mainLayout = new DocManager.ActionsApp.Report.MainLayout();

    var reportView  = new DocManager.ActionsApp.Report.ReportCollection({
      collection: col
    });
    
    mainLayout.on("show", function(){
      console.log('mainLayout SHOWED!');
      mainLayout.reportRegion.show(reportView);
    });

    DocManager.mainRegion.show(mainLayout);
    //DocManager.headerRegion.show(header);
    //DocManager.headerRegion.empty();
  };

  var registerActionListEvents = function(documentsListView) {
        
        documentsListView.on("childview:action:show", function(childView, model){
          var documid = model.id || model.get('documid');
          DocManager.trigger("action:show", documid);
        });

        documentsListView.on("childview:action:edit", function(childView, model){
          DocManager.trigger("action:edit", model);
        });

        documentsListView.on("childview:action:delete", function(childView, model){
          model.destroy();
        });

        documentsListView.on("action:sort", function(sort){

          console.log('REGISTERDOCUMLISTEVENTS: EVENT SORT [%s] [%s]', sort, this.collection.length);
          
          if(sort === 'fechagestion') sort = 'fechagestion_tc';
          if(sort === 'fecomp') sort = 'fecomp_tc';
          this.collection.sortfield = sort;
          this.collection.sortorder = -this.collection.sortorder;
          this.collection.sort();
          this.render();
        });

        documentsListView.on("childview:actions:related", function(childView, model, cb){
          console.log('documents RELATED BEGIN [%s] [%s]  ',model.get('product'),model.get('productid') );
          List.Session.relatedLayout = null;
          loadProductChilds(childView, model, cb);
        });

        documentsListView.on("childview:action:row:selected", function(childView, mode, model){
          console.log('Row CHECKBOX TOGGLE [%s] [%s]  ',model.get('cnumber'),mode);
          if(mode){
            List.Session.selectedActionList.add(model);
          }else{
            List.Session.selectedActionList.remove(model);

          }
          console.log('Row CHECKBOX TOGGLE [%s] [%s] [%s]  ',model.get('cnumber'),mode, List.Session.selectedActionList.length );
        });
  };

  /*
   *
   * RELATED VIEW
   */
  var loadProductChilds = function(view, model, cb){
    var prId = (model.get('productid')|| model.id);
    if(!prId) return;
    //console.log('loadProductChilds [%s][%s] [%s]',model.get('product'),model.get('productid'),prId);

    var product = new DocManager.Entities.Product({_id: prId});
    product.fetch({
      success:function(){
        //console.log('NODE LOADED: [%s] [%s]',product.get('productcode'),product.get('slug'));

          product.fetch({success: function() {
            product.loadchilds(product,[ {'es_capitulo_de.id': product.id},{'es_instancia_de.id': product.id}],function(products){
              //console.log('LOAD CHILDS SUCCESS: [%s]',products.length)

              product.loaddocuments(function(documents){
                //console.log('LOAD DOCUMENTS SUCCESS: [%s]',documents.length)
                renderRelated(view, product, products, documents, cb);
              });
            });
          }});
      }
    });
  };

  var renderRelated = function(view, product, products, documents, cb){
    console.log('VIEW RELATED products:[%s]',products.length);

    var relatedProductView = new List.ProductHeader({model: product});

    var relatedProductsView = new List.RelatedProducts({collection: products});
    registerRelatedProductEvents(relatedProductsView);
    
    var relatedActionsView = new List.RelatedActions({collection: documents});
    registerRelatedActionEvents(relatedActionsView);

    var relatedLayout = new List.RelatedLayout();


    relatedLayout.on("show", function(){
        relatedLayout.productRegion.show(relatedProductView);
        relatedLayout.productsRegion.show(relatedProductsView);
        relatedLayout.documentsRegion.show(relatedActionsView);
    });

    if(List.Session.relatedLayout){
  
      List.Session.relatedLayout.hookRegion.show(relatedLayout);
      List.Session.relatedLayout = relatedLayout;

    }else{
      var renderId = view.model.get('documid');
      view.$el.after('<tr><td colspan=8 id='+renderId+' ></td></tr>');

      List.Session.layout.addRegion(renderId, view.$('#'+renderId));

      view.layout = List.Session.layout;
      List.Session.layout[renderId].show(relatedLayout);
      List.Session.relatedLayout = relatedLayout;
    }

  };
  
  var registerRelatedProductEvents = function(view){

    view.on("childview:view:related:product", function(childView, model, cb){
      console.log('Te tengo, malvado [%s] [%s]', model.get('productcode'), model.id);
      loadProductChilds(childView, model, cb);
    });

    view.on("childview:edit:related:product", function(childView, model, cb){
      console.log('product EDIT [%s] [%s]', model.get('productcode'), model.id);
      if(!model.id) return;
      window.open('/#productos/'+model.id,'productos/edit');
    });


  };

  var registerRelatedActionEvents = function(view){

    view.on("childview:view:related:document", function(childView, model, cb){
      console.log('Te tengo, malvado [%s] [%s]', model.get('cnumber'), model.id);
      //loadProductChilds(childView, model, cb);

      var documLayout = new DocManager.ActionsApp.Show.Layout();

      var fetchingAction = DocManager.request("document:entity", model.id);
      $.when(fetchingAction).done(function(document){
        var documentView;
        if(document !== undefined){
          var itemCol = new DocManager.Entities.ActionItemsCollection(document.get('items'));

          documentView = new DocManager.ActionsApp.Show.Action({
            model: document
          });
          documentHeader = new DocManager.ActionsApp.Show.Header({
            model: document
          });
          brandingView = new DocManager.ActionsApp.Show.Branding({
              model: document
          });
          documentItems = new DocManager.ActionsApp.Show.ActionItems({
            collection: itemCol
          });
 
          documLayout.on("show", function(){
            documLayout.brandingRegion.show(brandingView);
            documLayout.headerRegion.show(documentHeader);
            documLayout.mainRegion.show(documentItems);
          });
          documentView.on("document:edit", function(model){
            DocManager.trigger("document:edit", model);
          });
        }
        else{
          documentView = new DocManager.Show.MissingAction();
        }

         List.viewAction(documLayout, brandingView, documentHeader, documentItems);
      });
    });

  };

  var API = {
    listActions: function(criterion, cb){
        DocManager.request("action:filtered:entities", criterion, function(documents){
          setColumnTable('docum');

          /*  documNavBar.once("show", function(){
            documNavBar.triggerMethod("set:filter:criterion", criterion);
          });*/
    
          var documentsListView = new List.Actions({
            collection: documents
          });

          List.Session.filteredCol = documents;

          List.Session.selectedActionList = new DocManager.Entities.ActionCollection();
          registerActionListEvents(documentsListView);

          /* documNavBar.on("documents:filter", function(filterCriterion){
            filteredActions.filter(filterCriterion);
            DocManager.trigger("documents:filter", filterCriterion);
          });*/
/*
          List.Session.layout.on("show", function(){
            List.Session.layout.navbarRegion.show(List.Session.navbar);
            List.Session.layout.mainRegion.show(documentsListView);
          });

          DocManager.mainRegion.show(List.Session.layout);
*/
          List.Session.layout.mainRegion.show(documentsListView);

        });

    },
    printActions: function(){
      DocManager.trigger("actions:report");
    },

    listActionItems: function( squery ){
        console.log('callback: [%s] [%s] [%s]', squery.fedesde, squery.taccion, squery.slug);
  
        DocManager.request("action:query:entities", squery, function(documents){
          setColumnTable('docum');

          var documentsListView = new List.Actions({
            collection: documents
          });

          List.Session.filteredCol = documents;
          List.Session.selectedActionList = new DocManager.Entities.ActionCollection();
          registerActionListEvents(documentsListView);
/*
          List.Session.layout.on("show", function(){
            List.Session.layout.navbarRegion.show(List.Session.navbar);
            List.Session.layout.mainRegion.show(documentsListView);
          });

          DocManager.mainRegion.show(List.Session.layout);

*/

          List.Session.layout.mainRegion.show(documentsListView);
        });
    },

    searchActions: function(squery, cb){
      var self = this;
      console.log('LIST CONTROLLER searchActions API called: query:[%s]', squery)
      if(!List.Session.query) List.Session.query = {};
      if(squery) List.Session.query.slug = squery;

      List.queryForm(List.Session.query, function(qmodel){
        
        List.Session.query = qmodel.attributes;
        dao.gestionUser.update(DocManager, 'actionQuery', qmodel.attributes);
        self.listActionItems(List.Session.query);

      });
      //Edit.modalSearchEntities('documents', query, function(model){
      //  cb(model);
      //});
    },

    searchPersons: function(query, cb){
      Edit.modalSearchEntities('persons', query, function(model){
        cb(model);
      });
    },
    searchProducts: function(query, cb){
      Edit.modalSearchEntities('products', query, function(model){
        cb(model);
      });
    },
  };


  var orderCollectionToPrint = function (col, order){
    var orderfield;
    col.each(function(model){
      model.set('sortfield', buildOrderField(model, order));
    })
    col.sortfield = 'sortfield';
    col.sortorder = -1;
    col.sort();
  };

  var buildOrderField = function(model, order){
    var tx = '';
    _.each(order, function(item){
      tx += ('************************' + model.get(item) + '|').substr(-20);
    });
    return tx;
  };

  var setColumnTable = function (op){
    if(op==='docum'){
      utils.documListTableHeader[10].flag=0;
      utils.documListTableHeader[9].flag=0;
      utils.documListTableHeader[7].flag=0;
      utils.documListTableHeader[6].flag=0;
      utils.documListTableHeader[5].flag=0;
      utils.documListTableHeader[3].flag=0;
      
      utils.documListTableHeader[4].flag=1;
      utils.documListTableHeader[2].flag=1;

    }else {
      utils.documListTableHeader[10].flag=1;
      utils.documListTableHeader[9].flag=1;
      utils.documListTableHeader[7].flag=1;
      utils.documListTableHeader[6].flag=1;
      utils.documListTableHeader[5].flag=1;
      utils.documListTableHeader[3].flag=1;

      utils.documListTableHeader[4].flag=0;
      utils.documListTableHeader[2].flag=0;

    }
  };

  DocManager.reqres.setHandler("action:query:list", function(query){
    API.listActionItems(query);
  });

  DocManager.reqres.setHandler("actions:query:search", function(query, cb){
    API.searchActions(query, cb);
  });

  DocManager.reqres.setHandler("print:filtered:actions", function(){
    console.log('aca vamos')
    API.printActions();
  });



  DocManager.reqres.setHandler("document:query:items", function(query, cb){
    API.listActionItems(query, cb);
  });

  DocManager.reqres.setHandler("document:query:list", function(query, cb){
    API.listActions(query, cb);
  });

  DocManager.reqres.setHandler("person:search", function(query, cb){
    API.searchPersons(query, cb);
  });

  DocManager.reqres.setHandler("product:search", function(query, cb){
    API.searchProducts(query, cb);
  });

});
