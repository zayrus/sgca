DocManager.module("BudplanApp.List", function(List, DocManager, Backbone, Marionette, $, _){

	List.Controller = {
		budgetPlanner: function(){
			console.log('BudplanApp.List.Controller.budgetPlanner BEGIN');
			// indicación de espera:
			//var loadingView = new DocManager.Common.Views.Loading();
			//DocManager.mainRegion.show(loadingView);

			List.Session = {};

     	dao.gestionUser.getUser(DocManager, function (user){
        if(user){
          List.Session.user = user;
          initModuleViews();
          
          DocManager.mainRegion.show(List.Session.layout);
          console.log('INICIANDO LIST CONTROLLER[%s]',List.Session.detailedview)

          loadRecordsFromDB(function(status){
            console.log('BudgetPlanner:[%s]', status);
          });      
        }else{
          console.log('vuelve a edición de ACTION')
          //DocManager.trigger('actions:list');
        }
      });
    }
  };

	//================== LayoutView builder ==================
	var initModuleViews = function(){
			initFilterView();
  		buildAnalyseView();
      buildMultieditView();
  		buildLayoutView();
	};

	var buildLayoutView = function(){
			List.Session.layout = new List.Layout();
			registerLayoutViewEvents (List.Session.layout);
	};

	var registerLayoutViewEvents = function(layoutview){
			layoutview.on("show", function(){

				console.log('LAYOUT SHOW [%s]',List.Session.filterview.whoami)
				layoutview.filterRegion.show(List.Session.filterview);
				layoutview.analyseRegion.show(List.Session.analyseview);
        layoutview.multieditRegion.show(List.Session.multieditview);
				layoutview.detailRegion.show(List.Session.detailedview);
			});

		  layoutview.on("data:reloaded:from:server", function(){
				console.log('LAYOUT: NUEVA COLECCION')

				buildDetailedView();
				layoutview.detailRegion.show(List.Session.detailedview);
				buildSummaryView('nodo');
				layoutview.summaryRegion.show(List.Session.summaryview);
			});
			

	};


	var initFilterView = function(){
			List.Session.filtermodel = new DocManager.Entities.BudgetPlanner();
			List.Session.filterview  = new List.FilterView({model: List.Session.filtermodel});
			registerFilterViewEvents (List.Session.filterview);
			registerFilterModelEvents(List.Session.filtermodel, List.Session.filterview);
	};

	var registerFilterViewEvents = function(view){
	};


	var registerFilterModelEvents = function(model, view){
		model.on('change:filter', function(){
			console.log('Bublle Model Changed!!!');
			model.resetFilteredCol();
			buildDetailedView();
			//layoutview.detailRegion.show(List.Session.detailedview);
			List.Session.detailedview.render();
      model.trigger('new:filterd:col');



		});

	};

	var buildSummaryView = function(type){
      if(!List.Session.summaryview){
        List.Session.summaryview = new List.SummaryPanel({
          collection: List.Session.filtermodel.getSummaryCol(type),
          model: List.Session.filtermodel
        });
        registerSummaryViewEvents (List.Session.filtermodel, List.Session.summaryview);

      }else{
        console.log('Refresco de la Summary View')
        List.Session.summaryview.collection = List.Session.filtermodel.buildSummaryCol(type);
        List.Session.summaryview.model = List.Session.filtermodel;
        List.Session.summaryview.render();
        //List.Session.layout.summaryRegion.show(List.Session.summaryview);
      }
      List.Session.filtermodel.showD3Pie(List.Session.layout.$('#d3-region')[0]);
	};

	var registerSummaryViewEvents = function(model, view){

      model.on('new:filterd:col', function(){
        console.log('Bubble: ready to update summary view');
        buildSummaryView(model.get('vista_actual'));
      });
  };

	var buildAnalyseView = function(){
			List.Session.analyseview = new List.AnalyseView();
			registerAnalyseViewEvents (List.Session.analyseview);
	};
  var registerAnalyseViewEvents = function(view){
    view.on('render:summary:by', function(type, cb){
      console.log('RENDER BUBBLE: [%s]',type);
      buildSummaryView(type);
    });

  };

  var buildMultieditView = function(){
      List.Session.multieditview = new List.MultieditView();
      registerMultieditViewEvents (List.Session.multieditview);
  };

	var registerMultieditViewEvents = function(view){
    view.on('multi:edit:selected', function(){
      //var budgetCol = fetchSelectedModels();
      inlineEditSelected(view)
    });

	};

  var inlineEditSelected = function (view, col){
    var opt,
        updateList = [],
        updateData;

    var actualAttrs = fetchCommonAttrs(List.Session.filtermodel.getFilteredCol(), updateList);

    //Edit.Session.views.layout.addRegion(renderId, view.$('#'+renderId));
    opt = {
      view: view,
      //model: model,
      collection: col,
      facet: new DocManager.Entities.BudgetCoreFacet(actualAttrs,{formType: 'multiedit'}),
      hook: '.js-form-hook',
      captionlabel: ''
    };

    if(!actualAttrs){
      view.$(opt.hook).html('debe seleccionar al menos un presupuesto de la tabla detallada');
      return;
    }

    DocManager.ActionsApp.Edit.inlineedit(opt,function(facet, submit){
      console.log('callback EDICION [%s] submit:[%s]', facet.get('tgasto'), submit);
      view.$(opt.hook).empty();
      if(submit){
        updateData = facet.multiupdate(updateList);
        updateSelectedList(List.Session.filtermodel.getFilteredCol(), updateData);
        buildSummaryView(List.Session.filtermodel.get('vista_actual'));
      }
    });
  };

  var updateSelectedList = function(col, data){
    var parent;
    col.each(function(model){
      if(model.get('selectedxedit')){
        model.set(data);
        parent = model.get('parent_action');
        _.extend(parent, data);
      }
    });
  };

  var fetchCommonAttrs = function(col, ulist){
    var facet = new DocManager.Entities.BudgetCoreFacet(null,{formType: 'multiedit'}),
        attrlist = _.keys(facet.schema_multiedit),
        attrobject = {},
        attResult = {},
        selectedModels = 0,
        attribute;

    _.each(attrlist, function(key){
      attrobject[key] = [];
    });
    
    col.each(function(model){
      if(model.get('selectedxedit')){
        selectedModels += 1;
        ulist.push(model.id);
        _.each(attrlist, function(key){
          attribute = model.get(key);
          if(_.indexOf(attrobject[key],attribute) === -1){
              attrobject[key].push(attribute);
          }
        });
      }
    });

    _.each(attrlist, function(key){
      if(attrobject[key].length === 1){
        attResult[key] = attrobject[key][0];
      }else{
        attResult[key] = '';
      }
    });

    if(selectedModels){
      return attResult;
    }
  };


	var buildDetailedView = function(){
			if(!List.Session.detailedview){
				List.Session.detailedview = new List.DetailedCompositeView({
				  collection: List.Session.filtermodel.getFilteredCol()
				});
				registerDetailedViewEvents (List.Session.detailedview);
			}else{
				List.Session.detailedview.collection = List.Session.filtermodel.getFilteredCol();
			}
	};

	var registerDetailedViewEvents = function(view){
      view.on('childview:budget:edit', function(chview, model){
        console.log('EDIT bublled [%s] [%s]', chview.whoami, model.whoami);
        inlineEditBudgetItem(chview, view, model);

      });

      view.on('childview:budget:show', function(chview, model){
        console.log('SHOW bublled [%s] [%s]', chview.whoami, model.whoami);
        inlineShowAction(chview, view, model);

      });

      view.on('childview:budget:row:selected', function(chview, checked, model){
        console.log('CHECKED bublled [%s] [%s]', chview.whoami, model.whoami);
        model.set('selectedxedit', checked);
      });

      view.on("budget:sort", function(sort){
        console.log('Col Sort: EVENT SORT [%s] [%s]', sort, this.collection.length);
        
        if(sort === 'fechagestion') sort = 'fechagestion_tc';
        if(sort === 'fecomp') sort = 'fecomp_tc';
        if(sort === 'importe') sort = 'importe_num'
        this.collection.sortfield = sort;
        this.collection.sortorder = -this.collection.sortorder;
        this.collection.sort();
        this.render();
      });

      view.on('childview:trash:budget:onoff', function(chview, model, cb){
        console.log('TRASH bublled [%s] [%s] ', chview.whoami, model.whoami);

        if(model.get('estado_alta') === 'activo'){
          model.set('estado_alta', 'observado');
          model.partialUpdate('estado_alta', 'observado');
        }else{
          model.set('estado_alta', 'activo');
          model.partialUpdate('estado_alta', 'activo');
        }
        //inlineEditBudgetItem(chview, view, model);
        buildSummaryView(model.get('vista_actual'));


      });

	};

//================== LOAD DATA from database ==================
var loadRecordsFromDB = function(cb){
  var query = buildAreaList();

	List.Session.filtermodel.fetchData(query, null, function(col){
		List.Session.layout.trigger('data:reloaded:from:server');
		cb('ready');
	});
};

var buildAreaList = function(){
  var query = {};
  query.areas = _.map(dao.gestionUser.fetchPermitted('AREA', 'sisplan'), function(item){
    return item.val;
  })
  return query;
};


//================== INLINE BUDGET EDIT ==================
  var inlineShowAction = function (chview, view, model){
    var renderId = model.id,
        opt;

    chview.$el.after('<tr><td id='+renderId+' class="js-show-hook" colspan=8 >Algo</td></tr>');
    //Edit.Session.views.layout.addRegion(renderId, view.$('#'+renderId));

    opt = {
      view: view,
      chview: chview,
      model: model,
      hook: '#'+renderId,
      captionlabel: 'Vista Acción'
    };
 
    DocManager.ActionsApp.Show.Controller.inlineShowAction(model.get('owner_id'), function(showLayout){
      console.log('Ready to render layout:[%s] ', opt.hook)
      List.Session.layout.addRegion(renderId, chview.$(opt.hook));
      List.Session.layout[renderId].show(showLayout);

      chview.on('close:inline:show:view', function(){
        console.log('close show form BUBBLED: Ready to destroy view');
        showLayout.destroy();
        view.$(opt.hook).closest('tr').remove();
      });

    });



    // DocManager.ActionsApp.Edit.inlineedit(opt, function(facet, submit){
    //   console.log('callback EDICION [%s] submit:[%s]', facet.get('slug'), submit);
    //   //view.$(opt.hook).closest('tr').fadeOut(400, function(){this.remove()});
    //   view.$(opt.hook).closest('tr').remove();
    //   if(submit){
    //     facet.partialUdateModel(model);
    //     timeDelay(function(){

    //       buildSummaryView(model.get('vista_actual'));
    //       chview.render();
    //     });
    //   }
    // });


  };

//================== INLINE BUDGET EDIT ==================
  var inlineEditBudgetItem = function (chview,view, model){
    var renderId = model.id,
        opt;

    chview.$el.after('<tr><td id='+renderId+' class="js-form-hook" colspan=8 ></td></tr>');
    //Edit.Session.views.layout.addRegion(renderId, view.$('#'+renderId));

    opt = {
      view: view,
      chview: chview,
      model: model,
      facet: model.fetchEditFacet(),
      hook: '#'+renderId,
      captionlabel: 'Edición ítem presupuesto'
    };
    DocManager.ActionsApp.Edit.inlineedit(opt, function(facet, submit){
      console.log('callback EDICION [%s] submit:[%s]', facet.get('slug'), submit);
      //view.$(opt.hook).closest('tr').fadeOut(400, function(){this.remove()});
      view.$(opt.hook).closest('tr').remove();
      if(submit){
        facet.partialUdateModel(model);
        timeDelay(function(){

          buildSummaryView(model.get('vista_actual'));
          chview.render();
        });
      }
    });
  };

  var timeDelay = function(cb){
    setTimeout(function(){
      cb();
    }, 1000);
  };






  var updateSelectedBudgets = function(data, cb){
    var actual = dao.extractData(data);
    var query = buildQuery(data);
    var update = new DocManager.Entities.BudgetsUpdate();
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
    List.Session.selectedBudgetList.each(function(model){
      list.push(model.id || model.get('budgetid'));
    })
    query.newdata = dao.extractData(data);
    query.nodes = list;
    return query;

  };


  var registerBudgetListEvents = function(budgetsListView) {
        
        budgetsListView.on("childview:budget:show", function(childView, model){
          //deprecated
          var budgetid = model.id || model.get('budgetid');
          DocManager.trigger("budget:sh", budgetid);
        });

        budgetsListView.on("childview:budget:edit", function(childView, model){
          //deprecated
          DocManager.trigger("budget:ed", model);
        });

        budgetsListView.on("childview:budget:delete", function(childView, model){
          model.destroy();
        });

        budgetsListView.on("budget:sort", function(sort){

          console.log('deprecated: REGISTERDOCUMLISTEVENTS: EVENT SORT [%s] [%s]', sort, this.collection.length);
          
          if(sort === 'fechagestion') sort = 'fechagestion_tc';
          if(sort === 'fecomp') sort = 'fecomp_tc';
          this.collection.sortfield = sort;
          this.collection.sortorder = -this.collection.sortorder;
          this.collection.sort();
          this.render();
        });

        budgetsListView.on("childview:dcuments:related", function(childView, model, cb){
          console.log('budgets RELATED BEGIN [%s] [%s]  ',model.get('product'),model.get('productid') );
          List.Session.relatedLayout = null;
          loadProductChilds(childView, model, cb);
        });

        budgetsListView.on("childview:budget:row:selected", function(childView, mode, model){
          console.log('Row CHECKBOX TOGGLE [%s] [%s]  ',model.get('cnumber'),mode);
          if(mode){
            List.Session.selectedBudgetList.add(model);
          }else{
            List.Session.selectedBudgetList.remove(model);

          }
          console.log('Row CHECKBOX TOGGLE [%s] [%s] [%s]  ',model.get('cnumber'),mode, List.Session.selectedBudgetList.length );
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

              product.loadbudgets(function(budgets){
                //console.log('LOAD DOCUMENTS SUCCESS: [%s]',budgets.length)
                renderRelated(view, product, products, budgets, cb);
              });
            });
          }});
      }
    });
  };

  var renderRelated = function(view, product, products, budgets, cb){
    console.log('VIEW RELATED products:[%s]',products.length);

    var relatedProductView = new List.ProductHeader({model: product});

    var relatedProductsView = new List.RelatedProducts({collection: products});
    registerRelatedProductEvents(relatedProductsView);
    
    var relatedBudgetsView = new List.RelatedBudgets({collection: budgets});
    registerRelatedBudgetEvents(relatedBudgetsView);

    var relatedLayout = new List.RelatedLayout();


    relatedLayout.on("show", function(){
        relatedLayout.productRegion.show(relatedProductView);
        relatedLayout.productsRegion.show(relatedProductsView);
        relatedLayout.budgetsRegion.show(relatedBudgetsView);
    });

    if(List.Session.relatedLayout){
  
      List.Session.relatedLayout.hookRegion.show(relatedLayout);
      List.Session.relatedLayout = relatedLayout;

    }else{
      var renderId = view.model.get('budgetid');
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

  var registerRelatedBudgetEvents = function(view){

    view.on("childview:view:related:budget", function(childView, model, cb){
      console.log('Te tengo, malvado [%s] [%s]', model.get('cnumber'), model.id);
      //loadProductChilds(childView, model, cb);

      var budgetLayout = new DocManager.BudplanApp.Show.Layout();

      var fetchingBudget = DocManager.request("budget:entity", model.id);
      $.when(fetchingBudget).done(function(budget){
        var budgetView;
        if(budget !== undefined){
          var itemCol = new DocManager.Entities.BudgetItemsCollection(budget.get('items'));

          budgetView = new DocManager.BudplanApp.Show.Budget({
            model: budget
          });
          budgetHeader = new DocManager.BudplanApp.Show.Header({
            model: budget
          });
          brandingView = new DocManager.BudplanApp.Show.Branding({
              model: budget
          });
          budgetItems = new DocManager.BudplanApp.Show.BudgetItems({
            collection: itemCol
          });
 
          budgetLayout.on("show", function(){
            budgetLayout.brandingRegion.show(brandingView);
            budgetLayout.headerRegion.show(budgetHeader);
            budgetLayout.mainRegion.show(budgetItems);
          });
          budgetView.on("budget:edit", function(model){
            DocManager.trigger("budget:edit", model);
          });
        }
        else{
          budgetView = new DocManager.Show.MissingBudget();
        }

         List.viewBudget(budgetLayout, brandingView, budgetHeader, budgetItems);
      });
    });

  };

  var API = {
    listBudgets: function(criterion, cb){
      console.log('============= aca ===============');
        DocManager.request("budget:filtered:entities", criterion, function(budgets){
          setColumnTable('budget');

          /*  budgetNavBar.once("show", function(){
            budgetNavBar.triggerMethod("set:filter:criterion", criterion);
          });*/
    
          var budgetsListView = new List.Budgets({
            collection: budgets
          });
          List.Session.budgetCol = budgets;

          List.Session.selectedBudgetList = new DocManager.Entities.BudgetCollection();
          registerBudgetListEvents(budgetsListView);

          /* budgetNavBar.on("budgets:filter", function(filterCriterion){
            filteredBudgets.filter(filterCriterion);
            DocManager.trigger("budgets:filter", filterCriterion);
          });*/
/*
          List.Session.layout.on("show", function(){
            List.Session.layout.navbarRegion.show(List.Session.navbar);
            List.Session.layout.mainRegion.show(budgetsListView);
          });

          DocManager.mainRegion.show(List.Session.layout);
*/
          List.Session.layout.mainRegion.show(budgetsListView);

        });

    },

    listBudgetItems: function( squery ){
        console.log('callback: [%s] [%s] [%s]', squery.fedesde, squery.resumen, squery.tipocomp);
  
        DocManager.request("budget:query:entities", squery, function(budgets){
          setColumnTable('budgetitems');

          var budgetsListView = new List.Budgets({
            collection: budgets
          });

          List.Session.selectedBudgetList = new DocManager.Entities.BudgetNavCollection();
          registerBudgetListEvents(budgetsListView);
/*
          List.Session.layout.on("show", function(){
            List.Session.layout.navbarRegion.show(List.Session.navbar);
            List.Session.layout.mainRegion.show(budgetsListView);
          });

          DocManager.mainRegion.show(List.Session.layout);

*/

          List.Session.layout.mainRegion.show(budgetsListView);
        });
    },

    searchBudgets: function(squery, cb){
      var self = this;
      console.log('LIST CONTROLLER searchBudgets API called: query:[%s]', squery)
      if(!List.Session.query) List.Session.query = {};
      if(squery) List.Session.query.slug = squery;

      List.queryForm(List.Session.query, function(qmodel){
        
        List.Session.query = qmodel.attributes;
        dao.gestionUser.update(DocManager, 'budgetQuery', qmodel.attributes);
        self.listBudgetItems(List.Session.query);

      });
      //Edit.modalSearchEntities('budgets', query, function(model){
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

  var setColumnTable = function (op){
    if(op==='budget'){
      utils.budgetListTableHeader[6].flag=1;
      utils.budgetListTableHeader[5].flag=1;
      utils.budgetListTableHeader[4].flag=1;
      utils.budgetListTableHeader[3].flag=1;      
      utils.budgetListTableHeader[2].flag=0;

    }else {
      utils.budgetListTableHeader[6].flag=1;
      utils.budgetListTableHeader[5].flag=1;
      utils.budgetListTableHeader[4].flag=1;
      utils.budgetListTableHeader[3].flag=1;
      utils.budgetListTableHeader[2].flag=0;

    }
  };

/*
  DocManager.reqres.setHandler("budget:query:list", function(query, cb){
    API.listBudgets(query, cb);
  });
  DocManager.reqres.setHandler("budget:query:search", function(query, cb){
    API.searchBudgets(query, cb);
  });

 DocManager.reqres.setHandler("budget:query:items", function(query, cb){
    API.listBudgetItems(query, cb);
  });
*/ 
});
