StudioManager.module("DocsApp.Edit", function(Edit, StudioManager, Backbone, Marionette, $, _){

  Edit.Controller = {
    editProduction: function(id){
      console.log('DocsAPP.Edit.Controller.editProduction');

      var productionLayout = new Edit.Layout();
      var productionNavBar = initNavPanel();
      var fetchingProduction = StudioManager.request("production:entity", id);
     
      $.when(fetchingProduction).done(function(production){
        production.initAfterFetching();
        console.log('1.1  [%s]:[%s]', production.get('ea:productionId') , production.get('productionName') );
        Edit.Session = {};
    
        Edit.Session.model = production;
        registerProductionEntity(production);

        console.log('1.2');
        var productionEditView = new Edit.Production({
          model: production
        });
        registerDocumEditEvents(productionEditView);


/*        var productionItemsView = new StudioManager.DocsApp.Common.Views.SidebarPanel({
          itemView: StudioManager.DocsApp.Common.Views.SidebarItem,
          collection: Edit.Session.items 
        });
        registerDocumItemsView(productionItemsView);
*/
        //var searchItemsView = new Edit.Search();

        Edit.Session.layout = productionLayout;
        productionLayout.on("show", function(){
          productionLayout.navbarRegion.show(productionNavBar);
          productionLayout.mainRegion.show(productionEditView);
          //productionLayout.sidebarRegion.show(productionItemsView);
        });

        // ASSETS
        fetchProductionAssets();

        StudioManager.mainRegion.show(productionLayout);
            
      });
    }
  };


  var fetchProductionAssets = function(){
    console.log('fetchProductionAssets BEGIN');

    var assetCol = StudioManager.request("eaasset:production:entities", Edit.Session.model);
   
    $.when(assetCol).done(function(assets){
      //console.log('fetchProductionAssets RETURN CB: [%s]', assets.length, assets.at(0).get('ea:assetId'));
      //assets.initAfterFetching();
      //console.log('1.1  [%s]:[%s]', assets.get('ea:assetsId') , production.get('productionName') );
      //Edit.Session = {};
      renderAssetItems(assets);
    });
  


  };


  var renderAssetItems = function(assets){
    var itemlayout = new Edit.ItemLayout();

    var assetListView =  new Edit.AssetList({
        collection: assets,
        itemtype: 'assets'
    });
/*    
    var itemheader = new Edit.ItemHeader({
      model: itemmodel,
      itemtype: itemmodel.get('tipoitem')
    });
*/    

    itemlayout.on("show", function(){
        //itemlayout.ptheaderRegion.show(itemheader);
        itemlayout.ptlistRegion.show(assetListView);
    });

    Edit.Session.layout.itemEditRegion.show(itemlayout);
  };

  var registerDocumItemsView = function(view){
    view.on('itemview:item:edit',function(childView, itemmodel){
      console.log('ITEM EDIT BEGINS:[%s] - [%s]',itemmodel.get('tipoitem'),itemmodel.whoami);

      //if(itemmodel.get('tipoitem')==='ptecnico'){
      if(true){
        var itemlayout = new Edit.ItemLayout();
        var itemheader = new Edit.ItemHeader({
          model: itemmodel,
          itemtype: itemmodel.get('tipoitem')
        });


        itemheader.on("form:submit", function(model){
          Edit.Session.model.insertItemCollection(Edit.Session.items);
          Edit.Session.model.update(function(err,model){
            if(err){
              itemheader.triggerMethod("form:data:invalid", err);
            }else{
              itemheader.close();
            }
          });
        });

        Edit.Session.sitcollection = fetchPTItemsCollection(itemmodel);

        var sitview = subItemFactoryView(itemmodel, Edit.Session.sitcollection);

        if(itemmodel.get('tipoitem')==='pemision'){
          loadProductChilds(Edit.Session.sitcollection, itemmodel);
        }

        itemheader.on('product:select',function(query, cb){
          StudioManager.request("product:search", query, function(product){

            if(itemmodel.get('tipoitem')==='pemision'){
              if(product.get('tipoproducto')==='paudiovisual'){
                addProductsToCollection(Edit.Session.sitcollection, itemmodel, new StudioManager.Entities.ProductChildCollection(product) );
              }

              product.loadchilds(product, {'es_coleccion_de.id': product.id},function(products){
                addProductsToCollection(Edit.Session.sitcollection, itemmodel, products );
                cb(product);
              });
            }else{
              cb(product);
            }
          });      
        });

        itemheader.on('person:select',function(query, cb){
          StudioManager.request("person:search", query, function(model){
            cb(model);
          });      
        });

        sitview.on("sit:form:submit",function(){
          //console.log('sit:form:submit');

          var siterr = false;
          sitview.children.each(function (view){
            var err = view.model.validate(view.model.attributes);
            view.onFormDataInvalid((err||{}));
            if(err) siterr = true;
          });

          if(!siterr){
            itemmodel.insertItemCollection(Edit.Session.sitcollection);
            Edit.Session.model.insertItemCollection(Edit.Session.items);

            Edit.Session.model.update(function(err,model){
              if(err){
                itemheader.triggerMethod("form:data:invalid", err);
              }else{
                itemlayout.close();
              }
            });
          }
        });

        sitview.on("itemview:itemview:date:select",function(viewp, viewc, model,cb){
          selectDate(model,viewp,cb);
        });

        sitview.on("itemview:sit:remove:item",function(view, model){
          removeItemFromCol(model, Edit.Session.sitcollection);
        });

        sitview.on('itemview:product:select',function(view, query, cb){
          StudioManager.request("product:search", query, function(model){
            cb(model);
          });      
        });



        itemlayout.on("sit:add:item", function(){
          addEmptyItemToCol(itemmodel, Edit.Session.sitcollection);
        });

        itemlayout.on("show", function(){
            itemlayout.ptheaderRegion.show(itemheader);
            itemlayout.ptlistRegion.show(sitview);
        });

        itemlayout.on("form:submit", function(){
          sitview.triggerMethod("form:submit");
        });

        Edit.Session.layout.itemEditRegion.show(itemlayout);

      }//tipoitem === ptecnico

    }); //view.on item:edit

  };

  var subItemFactoryView = function(itemmodel, subItemCol){

    if(itemmodel.get('tipoitem')==='pemision'){
      return ( new Edit.PEmisionList({
              collection: subItemCol,
              itemtype: itemmodel.get('tipoitem')
            }));
    }else {
      return ( new Edit.PTecnicoList({
              collection: subItemCol,
              itemtype: itemmodel.get('tipoitem')
            }));
    }
  };

  var selectDate = function(model,view, cb){
    //console.log('model SELECT DATE: [%s][%s][%s]',model.get('hourmain'),view.model.get('productid'),model.schema.chapter.options);
    if(view.model.get('productid')){
      var product = new StudioManager.Entities.Product({_id: view.model.get('productid')});

      product.fetch({success: function(product) {           
        //console.log('product FETCH OK , [%s]',product.id,product.get('slug'));
        product.loadchilds(product, {'es_capitulo_de.id': product.id},function(products){
          //console.log('product loadchilds, [%s]',products.length);
          model.schema.chapter.options = buildChaptersOpstionList(products);
          loadModalForm(model,view,cb)
          //addProductsToCollection(sitcol, model, products );
        });
      }});
    }else{
      loadModalForm(model,view,cb)
    }
  };
  var buildChaptersOpstionList = function(list){
    var optionList = [];
    list.each(function(pr){
      optionList.push({
          val:pr.get('productcode'),label:pr.get('slug')    
      });
    })
    return optionList;
  };

  var loadModalForm = function(model,view,cb){

      Edit.pemisHourEdit(model,function(model){
        model.updateData();
        if(cb) cb(model);
      });
  }


  var loadProductChilds = function(sitcol,model){
    if(!model.get('productid'))return;
    //console.log('loadProductChilds [%s][%s]',model.get('product'),model.get('productid'));

    var product = new StudioManager.Entities.Product({_id: model.get('productid')});

    product.fetch({success: function() {           
      product.loadchilds(product, {'es_coleccion_de.id': product.id},function(products){
        addProductsToCollection(sitcol, model, products );
      });
    }});
  };

  var addProductsToCollection = function (sitcol, model, products ){
    //console.log('addProductToCollectin: [%s]',products.length);
    if(products.length){
      products.each(function(pr){
        var found = sitcol.find(function(sit){
          return sit.get('productid')===pr.id;
        })
        if(!found){
          var item = new StudioManager.Entities.DocumParteEMItem({product:pr.get('productcode'),pslug:pr.get('slug'),productid: pr.id});
          item.set({emisiones: item.initDatesArray()});
          sitcol.add(item);          
        }
      });
      //inspectCol(sitcol);
    }
  };
  var inspectCol = function(col){
    console.log('========= INSPECT COL =============')
    col.each(function(model){
      console.log('Collection: [%s] [%s]',model.get('pslug'),model.get('emisiones').length);

    });
  };

  var fetchPTItemsCollection = function(model){
    return model.getItems();
  };


  var removeItemFromCol = function(model, col){
    col.remove(model);
  };

  var addEmptyItemToCol = function(model, col){
    //var sitmodel = new StudioManager.Entities.DocumParteTecnicoItem();
    var sitmodel = model.initNewItem();
    col.add(sitmodel);
  };

  var registerProductionEntity = function(model) {
    Edit.Session.items = new StudioManager.Entities.DocumItemsCollection (model.get('items'));
    Edit.Session.items.on('add',function(model, collection){
      Edit.Session.model.insertItemCollection(collection);
    });


  };

  var registerDocumEditEvents = function(view) {

    view.on("form:submit", function(model){
      model.update(function(err,model){
/*
        if(err){
          view.triggerMethod("form:data:invalid", err);
        }else{
          StudioManager.trigger("production:edit", model);
        }
*/        
      });
    });

    view.on('person:select',function(query, cb){
      StudioManager.request("person:search", query, function(model){
        cb(model);
      });      

    });

  };

  var fetchPrevNextProduction = function (ename, query, cb){
    var qmodel;
    if(query) qmodel = new StudioManager.Entities.Comprobante({cnumber:query});
    else qmodel = Edit.Session.model;
    StudioManager.request(ename,qmodel, function(model){
      if(model){
        Edit.Session.layout.close();
        StudioManager.trigger("production:edit", model);
      }
    });
  };

  var registerHeadersEvents = function(hview){

      hview.on("itemview:production:new", function(childView){
        StudioManager.DocsApp.Edit.createInstance(this);
      });

      hview.on("itemview:production:item:new", function(childView){
        StudioManager.DocsApp.Edit.createItem(Edit.Session.model);
      });

      hview.on("itemview:productions:list", function(childView, model){
        var trigger = model.get("navigationTrigger");
        StudioManager.trigger(trigger);
      });

      hview.on("itemview:product:list", function(childView, model){
        var trigger = model.get("navigationTrigger");
        StudioManager.trigger(trigger);
      });


      hview.on('production:search',function(query, cb){
        console.log('edit_controller: production:search EVENT');
        StudioManager.request("production:search",query, function(model){
          if(model){
            Edit.Session.layout.close();
            StudioManager.trigger("production:edit", model);
          }
        });      

      });

      hview.on('production:fetchprev', function(query, cb){
        fetchPrevNextProduction("production:fetchprev",query,cb);
      });

      hview.on('production:fetchnext', function(query, cb){
        fetchPrevNextProduction("production:fetchnext",query,cb);
      });

  };

  var initNavPanel = function(){
      var links = StudioManager.request("production:edit:entities");

      var headers = new StudioManager.DocsApp.Common.Views.NavPanel({collection: links});
      //var headers = new Edit.NavPanel({collection: links});
      registerHeadersEvents(headers);

      return headers;
  };

  var API = {
    searchProductions: function(query, cb){
      Edit.modalSearchEntities('productions', query, function(model){
        cb(model);
      });
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

  StudioManager.reqres.setHandler("production:search", function(query, cb){
    API.searchProductions(query, cb);
  });

  StudioManager.reqres.setHandler("person:search", function(query, cb){
    API.searchPersons(query, cb);
  });

  StudioManager.reqres.setHandler("product:search", function(query, cb){
    API.searchProducts(query, cb);
  });

});
