DocManager.module("BudgetApp.List", function(List, DocManager, Backbone, Marionette, $, _){

  var registerHeadersEvents = function(hview, layout){
      hview.on("childview:budget:new", function(childView){
        DocManager.BudgetApp.Edit.createInstance(this);
      });

      hview.on("childview:report:new", function(childView){
        console.log('Report nuevo budget NEW!');
        DocManager.BudgetApp.Report.Edit.createInstance(this);
      });

      hview.on("childview:exportar:registros", function(childView){
        console.log('Exportar registros TRIGGER!', List.Session.budgetCol.length, List.Session.budgetCol.whoami);
        List.Session.budgetCol.exportRecords();
        console.log('me fui')
        //budgetedititems

        //DocManager.BudgetApp.Report.Edit.createInstance(this);
      });



      hview.on("childview:budgets:list", function(childView, model){
        //var trigger = model.get("navigationTrigger");
        //DocManager.trigger(trigger);
        DocManager.request("budget:filtered:entities","", function(model){
          console.log('budget LIST cb')
        });      
      });

      hview.on('entities:search',function(query, cb){

        DocManager.request("budget:query:search",query, function(model){
          if(model){
            Edit.Session.layout.close();
            DocManager.trigger("budget:edit", model);
          }
        });      

      });

      hview.on('budget:group:edit',function(){
        var self = this;
        if(!List.Session.selectedBudgetList.length) return;
        console.log('budget:group:edit controller');

        List.groupEditForm(function(qmodel){
          
          var data = qmodel.attributes;
          console.log('Form CLOSE:[%s] [%s]',data.estado_alta, data.nivel_ejecucion);
          updateSelectedBudgets(data, function(){
            console.log('end-of-story')
          });

        });

        
      });

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

  var initNavPanel = function(layout){
      var links = DocManager.request("budget:nav:entities");

      var headers = new DocManager.BudgetApp.Common.Views.NavPanel({collection: links});
      registerHeadersEvents(headers, layout);

      return headers;
  };

  List.Controller = {
    listBudgets: function(criterion){
      console.log('BudgetApp.List.Controller.listbudgets HEY!!!!');
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
        var query;

        List.Session.query = dao.gestionUser.getBudgetQuery();

        DocManager.request("budget:query:list", new DocManager.Entities.BudgetQueryFacet(List.Session.query).attributes);

        // if(tipolistado === 'items'){
        //   DocManager.request("budget:query:items",query, function(model){
        //     console.log('query lista CALLBACK - END');
        //   });

        // }else {
        //   DocManager.request("budget:query:list","", function(model){
        //     console.log('query lista CALLBACK - END');
        //   });
        //}


      });// currentUser

    }
  };


  var registerBudgetListEvents = function(budgetsListView) {
        
        budgetsListView.on("childview:budget:show", function(childView, model){
          var budgetid = model.id || model.get('budgetid');
          DocManager.trigger("budget:show", budgetid);
        });

        budgetsListView.on("childview:budget:edit", function(childView, model){
          DocManager.trigger("budget:edit", model);
        });

        budgetsListView.on("childview:budget:delete", function(childView, model){
          model.destroy();
        });

        budgetsListView.on("budget:sort", function(sort){

          console.log('REGISTERDOCUMLISTEVENTS: EVENT SORT [%s] [%s]', sort, this.collection.length);
          
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

      var budgetLayout = new DocManager.BudgetApp.Show.Layout();

      var fetchingBudget = DocManager.request("budget:entity", model.id);
      $.when(fetchingBudget).done(function(budget){
        var budgetView;
        if(budget !== undefined){
          var itemCol = new DocManager.Entities.BudgetItemsCollection(budget.get('items'));

          budgetView = new DocManager.BudgetApp.Show.Budget({
            model: budget
          });
          budgetHeader = new DocManager.BudgetApp.Show.Header({
            model: budget
          });
          brandingView = new DocManager.BudgetApp.Show.Branding({
              model: budget
          });
          budgetItems = new DocManager.BudgetApp.Show.BudgetItems({
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

          List.Session.budgetCol = budgets;
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
      utils.budgetListTableHeader[2].flag=1;

    }else {
      utils.budgetListTableHeader[6].flag=1;
      utils.budgetListTableHeader[5].flag=1;
      utils.budgetListTableHeader[4].flag=1;
      utils.budgetListTableHeader[3].flag=1;
      utils.budgetListTableHeader[2].flag=1;

    }
  };

  DocManager.reqres.setHandler("budget:query:list", function(query){
    API.listBudgetItems(query);
  });

  DocManager.reqres.setHandler("budget:query:search", function(query, cb){
    API.searchBudgets(query, cb);
  });

  DocManager.reqres.setHandler("person:search", function(query, cb){
    API.searchPersons(query, cb);
  });

  DocManager.reqres.setHandler("product:search", function(query, cb){
    API.searchProducts(query, cb);
  });

});
