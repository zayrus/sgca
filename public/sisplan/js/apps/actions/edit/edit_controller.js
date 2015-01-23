DocManager.module("ActionsApp.Edit", function(Edit, DocManager, Backbone, Marionette, $, _){

  Edit.Controller = {
    editAction: function(id){
      console.log('ActionsApp.Edit.Controller.editAction');

      var fetchingAction = DocManager.request("action:entity", id);
     
      $.when(fetchingAction).done(function(action){

        console.log('ActionsApp.Edit BEGIN', action.get('slug'));
    
        Edit.Session = {};
        Edit.Session.views = {};
        registerActionEntity(action);

        Edit.Session.views.layout = new Edit.Layout();

    
        // ========== Main SECTION ============
        Edit.Session.views.mainLayout = new Edit.MainLayout();
        registerMainLayoutEvents(Edit.Session.views.mainLayout);




        //(action);

        // var actionuiEditView = new Edit.Action({
        //   model: Edit.Session.model
        // });
        // registerActionuiEditEvents(actionuiEditView);
        
        //console.log('READY to create itemView: [%s]',Edit.Session.model.get('tipocomp'));

        // ========== Sidebar MENU ============
        Edit.Session.views.sidebarMenu = new DocManager.ActionsApp.Common.Views.SidebarMenu({});
        registerSidebarMenu(Edit.Session.views.sidebarMenu);


/*
        // ========== Sidebar HEADER ============
        var actionuiSidebarView = new DocManager.ActionsApp.Common.Views.SidebarItem({
          model: Edit.Session.model,
          itemtype: 'nsolheader'
        });
        registerActionuiSidebarView(actionuiSidebarView);
        Edit.Session.views.sidebarView = actionuiSidebarView;

        // ========== Sidebar ITEMS ============
        var actionuiSidebarItemsView = new DocManager.ActionsApp.Common.Views.SidebarCompositePanel({
          //childView: DocManager.ActionsApp.Common.Views.SidebarCompositePanel,
          collection: Edit.Session.items,
          model: Edit.Session.model,
          itemtype: Edit.Session.model.get('tipocomp'),
        });
        registerActionuiSidebarItemsView(actionuiSidebarItemsView);
        Edit.Session.views.sidebarItemsView = actionuiSidebarItemsView;

*/        //var searchItemsView = new Edit.Search();
        //registerActionuiItemsView(actionuiItemsView);

  
        initMainViews();

        Edit.Session.views.layout.on("show", function(){
          Edit.Session.views.layout.sidebarMenuRegion.show(Edit.Session.views.sidebarMenu);
          Edit.Session.views.layout.mainRegion.show(Edit.Session.views.mainLayout);
          //Edit.Session.views.layout.navbarRegion.show(actionuiNavBar);
          //Edit.Session.views.layout.headerInfoRegion.show(actionuiSidebarView);
          //Edit.Session.views.layout.itemsInfoRegion.show(actionuiSidebarItemsView);
        });

        DocManager.mainRegion.show(Edit.Session.views.layout);

            
      });
    }
  };

  //======== INIT views creation at start
  var initMainViews = function(){
    createMainHeaderView()

  };

  //======== MAIN-LAYOUT-EVENTS
  var registerMainLayoutEvents = function(layout){
    layout.on('show',function(view){
      console.log('LAYOUT SHOW');
      layout.headerRegion.show(Edit.Session.views.mainheader);
    });
  };

  //======== BUDGET-VIEW
  var createBudgetView = function(budgetCol){
    Edit.Session.budgetcol = budgetCol;
    Edit.Session.views.budget = new Edit.BudgetPanel({
      collection: Edit.Session.budgetcol
    });
    registerBudgetViewEvents(Edit.Session.views.budget);
    return Edit.Session.views.budget;
  };

  var registerBudgetViewEvents = function(view){
    view.listenTo(view.collection, 'add', function(mdel,col,op){
      budgetViewRender();
    });
    view.on('childview:edit:budget:item', function(view, model){
      console.log('[%s] /[%s] Register BudgetEvent BUBBLE[%s]',view.whoami,model.whoami, arguments.length);
      inlineEditBudgetItem(view, model);

    });
  };
  
  var inlineEditBudgetItem = function (view, model){
    var renderId = view.model.id,
        opt;

    view.$el.after('<tr><td id='+renderId+' class="js-form-hook" colspan=4 ></td></tr>');
    Edit.Session.views.layout.addRegion(renderId, view.$('#'+renderId));

    opt = {
      view: view.parentView,
      model: model,
      facet: model.fetchEditFacet(),
      hook: '#'+renderId,
      captionlabel: 'Edición'
    };
    Edit.inlineedit(opt,function(facet, submit){
      console.log('callback EDICION [%s] submit:[%s]', facet.get('slug'), submit);
      view.parentView.$(opt.hook).closest('tr').remove();
      if(submit){
        facet.updateModel(model);
        updateBudgetModel(model, function(model){
          view.render();
        })
      }
    });
  };


  var budgetViewRender = function(){
    console.log('BudgetRENDER in mainLayout')
    Edit.Session.views.mainLayout.budgetRegion.show(Edit.Session.views.budget);
  };


  //======== MAIN-HEADER-VIEW
  var createMainHeaderView = function(){
    Edit.Session.views.mainheader = new Edit.MainHeader({
      model: Edit.Session.model
    });
    registerMainHeaderViewEvents(Edit.Session.views.mainheader);
  };

  var registerMainHeaderViewEvents = function(view){
    view.on('main:header:edit',function(model){
      console.log('HEADER EDIT');

      var opt = {
        view: view,
        model: model,
        facet: model.mainHeaderFacet(),
        hook: '.js-form-hook',
        captionlabel: 'Edición'
      };
      Edit.inlineedit(opt,function(facet, submit){
        if(submit){
          facet.updateModel(model);
          console.log('callback EDICION');
          updateActionModel(model, function(model){
            view.render();
          })
        }
      });
    });
  };



  //======== SIDE-BAR-MENU
  var registerSidebarMenu = function(view){

    view.on('entity:new',function(view){
      console.log('NEW ENTITY BUBBLE');

      var opt = {
        view: view,
        facet: new DocManager.Entities.ActionCoreFacet(),
        caption:'Alta nueva acción'
      };
      DocManager.ActionsApp.Edit.createInstance(opt, function(facet, submit){
        if(submit){
          facet.createNewAction(function(err, model){
            DocManager.trigger("action:edit",model);
          });
        }
      });
    });

    view.on('budget:new',function(view){
      DocManager.trigger('budget:build', Edit.Session.model);
/*
      console.log('NEW BUDGET BUBBLE');
      var opt = {
        view: view,
        facet: new DocManager.Entities.BudgetCoreFacet({},{formType:'short'}),
        caption:'Alta nuevo pase de presupuesto',
      };
      DocManager.ActionsApp.Edit.createInstance(opt, function(facet, submit){
        if(submit){
          facet.createNewInstance(Edit.Session.model, Edit.Session.currentUser, function(err, model){
            console.log('UPDATE VIEWS NOW');
            registerNewBudgetItem(model);
          });
        }

      });

*/      
    });
  };

  //======== ACTION ENTITY 
  var registerActionEntity = function(model) {
    Edit.Session.solicitud = model;

    Edit.Session.model = model;

    dao.gestionUser.getUser(DocManager, function (user){
      if(user){
        console.log('Dao Get Current user: [%s]', user.get('username'));
        Edit.Session.currentUser = user;
      }else{
        Edit.Session.currentUser = null;        
      }
    });

    DocManager.request('action:fetch:budget',Edit.Session.model, null,function(budgetCol){
      console.log('BudgetCol REQUEST CB:[%s]',budgetCol.length);
      if(budgetCol.length){
        createBudgetView(budgetCol);
        budgetViewRender();        
      }
    });
  };


  //======== BUDGET NEW ITEM
  var registerNewBudgetItem = function(model){
    if(Edit.Session.budgetcol){
      Edit.Session.budgetcol.add(model);
    }else{
      initBudgetCollection(model);
    }

  };
  var initBudgetCollection = function(model){
    var budgetCol = new DocManager.Entities.BudgetNavCollection(model);
    createBudgetView(budgetCol);
  };


  //======== ACTION ENTITY MODEL SAVE UPDATE
  var updateActionModel = function(model, cb){
    model.update(function(err,model){
      if(err){
        view.triggerMethod("form:data:invalid", err);
      }else{
        console.log('UPDATE FINISHED!')
        if(cb) cb(model);
      }
    });
  };

   //======== BUDGET ENTITY MODEL SAVE UPDATE
  var updateBudgetModel = function (model, cb){
    model.update(Edit.Session.model, function(err,model){
      if(err){
        view.triggerMethod("form:data:invalid", err);
      }else{
        console.log('UPDATE FINISHED!')
        if(cb) cb(model);
      }
    });
  };

// =========== old stuff =================


  var registerActionuiSidebarItemsView = function(view){
    //view.collection.bind("add", view.modelChanged, view);
    //view.listenTo(view.model, 'change', view.render);

    view.listenTo(view.collection, 'add', function(mdel,col,op){
      Edit.Session.views.layout.itemsInfoRegion.show(view);
    });
 
  };

  var registerActionuiSidebarView = function(view){
    //Marionette.bindEntityEvents(this, this.model, this.modelEvents)
    //view.model.bind("change", view.modelChanged, view);
    //Marionette.bindEntityEvents(this, this.model, this.modelEvents);
    view.listenTo(view.model, 'change', view.render);

  };

  var registerActionuiItemsView = function(view){
    view.on('item:edit',function(childView, itemmodel){
      console.log('ITEM EDIT BEGINS:[%s] - [%s]',itemmodel.get('tipoitem'),itemmodel.whoami);

        var itemheader = new Edit.ItemHeader({
          model: itemmodel,
          itemtype: itemmodel.get('tipoitem'),
          el: '#nuevo-req-form'

        });

        itemheader.on('person:select',function(query, cb){
          DocManager.request("person:search", query, function(model){
            cb(model);
          });      
        });
        itemHeader.show();


        // itemheader.on("form:submit", function(model){
        //   Edit.Session.model.insertItemCollection(Edit.Session.items);
        //   Edit.Session.model.update(function(err,model){
        //     if(err){
        //       itemheader.triggerMethod("form:data:invalid", err);
        //     }else{
        //       itemheader.close();
        //     }
        //   });
        // });

        // a laburar
        // para cuando selecciona una person desde el item

        // itemlayout.on("show", function(){
        //     itemlayout.ptheaderRegion.show(itemheader);
        //     itemlayout.ptlistRegion.show(sitview);
        // });

        // itemlayout.on("form:submit", function(){
        //   sitview.triggerMethod("form:submit");
        // });

        // Edit.Session.views.layout.itemEditRegion.show(itemlayout);


    }); //view.on item:edit

  };


  //MGO: 
  var registerActionuiItemsViewOld = function(view){
    view.on('childview:item:edit',function(childView, itemmodel){
      console.log('ITEM EDIT BEGINS:[%s] - [%s]',itemmodel.get('tipoitem'),itemmodel.whoami);

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

        // a laburar
        Edit.Session.sitcollection = fetchPTItemsCollection(itemmodel);

        var sitview = subItemFactoryView(itemmodel, Edit.Session.sitcollection);

        // caso particular cuando se trata de un Parte de Emision
        if(itemmodel.get('tipoitem')==='pemision'){
          loadProductChilds(Edit.Session.sitcollection, itemmodel);
        }

        // para cuando selecciona un articulo
        itemheader.on('product:select',function(query, cb){
          DocManager.request("product:search", query, function(product){

            if(itemmodel.get('tipoitem')==='pemision'){
              if(product.get('tipoproducto')==='paudiovisual'){
                addProductsToCollection(Edit.Session.sitcollection, itemmodel, new DocManager.Entities.ProductChildCollection(product) );
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

        // para cuando selecciona una person desde el item
        itemheader.on('person:select',function(query, cb){
          DocManager.request("person:search", query, function(model){
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

        sitview.on("childview:childview:date:select",function(viewp, viewc, model,cb){
          selectDate(model,viewp,cb);
        });

        sitview.on("childview:sit:remove:item",function(view, model){
          removeItemFromCol(model, Edit.Session.sitcollection);
        });

        sitview.on('childview:product:select',function(view, query, cb){
          DocManager.request("product:search", query, function(model){
            cb(model);
          });      
        });


        // Agregar SubItem 
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

        Edit.Session.views.layout.itemEditRegion.show(itemlayout);

      }//tipoitem === ptecnico

    }); //view.on item:edit

  };


  var subItemFactoryView = function(itemmodel, subItemCol){

    if(itemmodel.get('tipoitem')==='pemision'){
      return ( new Edit.PEmisionList({
              collection: subItemCol,
              itemtype: itemmodel.get('tipoitem')
            }));
    }else if(itemmodel.get('tipoitem')==='nsolicitud'){
      return ( new DocManager.ActionsApp.Common.Views.SidebarCompositePanel({
              //childView: DocManager.ActionsApp.Common.Views.SidebarCompositePanel,
              collection: subItemCol,
              model: itemmodel,
              itemtype: 'nsdetails'
            }));
    } else {
      return ( new Edit.PTecnicoList({
              collection: subItemCol,
              itemtype: itemmodel.get('tipoitem')
            }));
    }
  };

  var selectDate = function(model,view, cb){
    //console.log('model SELECT DATE: [%s][%s][%s]',model.get('hourmain'),view.model.get('productid'),model.schema.chapter.options);
    if(view.model.get('productid')){
      var product = new DocManager.Entities.Product({_id: view.model.get('productid')});

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

    var product = new DocManager.Entities.Product({_id: model.get('productid')});

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
          var item = new DocManager.Entities.ActionuiParteEMItem({product:pr.get('productcode'),pslug:pr.get('slug'),productid: pr.id});
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
    //var sitmodel = new DocManager.Entities.ActionuiParteTecnicoItem();
    var sitmodel = model.initNewItem();
    col.add(sitmodel);
  };

  var renderSOLDetails = function (view){
      console.log('editEvents SOL Details RENDER');
        // a laburar
      //Edit.Session.sitcollection = fetchPTItemsCollection(Edit.Session.model);

      var sitview = new DocManager.ActionsApp.Common.Views.SidebarCompositePanel({
        //childView: DocManager.ActionsApp.Common.Views.SidebarCompositePanel,
        collection: Edit.Session.items,
        model: Edit.Session.model,
        itemtype: 'nsdetails',
      });

      sitview.listenTo(sitview.collection, 'add', sitview.render);
      //sitview.listenTo(view, 'render', sitview.render);
      view.$('#soldetails-region').html(sitview.render().el);

  };

  var editReqDetail = function(view, isNew, itemDetail){
      console.log('editReqDetail: BEGIN isNew:[%s] items so far:[%s]', isNew,Edit.Session.items.length);
      if(isNew){
        itemDetail = new Edit.Session.model.initNewItem();
      }

      var subItem = new Edit.SolicitudDetail({
        model: itemDetail,
        itemtype: Edit.Session.model.get('tipocomp'),
      });

      subItem.on('details:form:submit', function(model, cb){
        console.log('Alta BUBLING [%s][%s]', model.get('description'), model.whoami);
        //var error = model.validate();

        if(isNew){
          Edit.Session.items.add(model);
        }        
        console.log('AFTER UPDATING EditSessionItems:  [%s]',Edit.Session.items.length)

        //Edit.Session.views.sidebarItemsView.render();
        renderSOLDetails(Edit.Session.views.mainView);
        view.itemFormBtnShow();
        cb();

      });

      view.$('#nuevo-req-form').html(subItem.render().el);

  };

  var registerActionuiEditEvents = function(view) {
    Edit.Session.views.mainView = view;

    view.on("sitem:edit", function(model){
      editReqDetail(view, true);

    });

    view.on('render', function(){
      console.log('editEvents RENDER: [%s] [%s]')
      renderSOLDetails(view);

    });

    view.on("form:submit", function(model){
      model.update(Edit.Session.solicitud, function(err,model){
        if(err){
          view.triggerMethod("form:data:invalid", err);
        }else{
          console.log('FINISHED!')
          //DocManager.trigger("action:edit", model);
          //volver
          enviarmail(model);
        }
      });
    });

    view.on('person:select',function(query, cb){
      DocManager.request("person:search", query, function(model){
        cb(model);
      });      

    });

    view.on('user:validate',function(view, usermail, cb){
      var msgs = '';
      fetchUserByUsername(usermail, function(user){
        msgs = getUserMessage(user);
        if(cb) cb(user, msgs);
      })

    });

  };
    
var enviarmail = function(model){
    var mailModel = new DocManager.Entities.SendMail({
        from: 'intranet.mcn@gmail.com',
        subject:'Solicitud de Asistencia',
    });

    mailModel.set('to',model.get('items')[0].eusuario);
    if (Edit.Session.currentUser){
        mailModel.set('cc',Edit.Session.currentUser.get('username'))
    }
    
    //todo:ver donde configurar el servidor de produccion
    model.set( 'server','https://localhost:3000');
    var sendMail = new DocManager.ActionsApp.Common.Views.SendMail({
          model: model,
    });
    
    mailModel.set('html',sendMail.getData());
    //console.log(sendMail.getData());
    //console.dir(mailModel.attributes);
    mailModel.sendmail();
};
    
  var getUserMessage = function (user){
    var msgs = '';
    if(user){
      if(Edit.Session.currentUser){
        if(user.get('username') !== Edit.Session.currentUser.get('username')){
          msgs = 'Atención: está usted registrando un mail distinto del propio'
        }else {
          msgs = 'Gracias por registrar un nuevo pedido con su usuario actual'          
        }
      }

    }else{
      msgs = 'Nota: No existe aún un usuario con esta identificación. Lo invitamos a registrarse en la Intranet del MCN'
    }
    return msgs;

  };

  var fetchUserByUsername = function(usermail, cb){
    
    var promise = DocManager.request("user:by:username",usermail);
    
    $.when(promise).done(function (userCol){
      console.log('promise!!![%s]',userCol)
      var userFound = false;
      var user;
      if(userCol){
        if(userCol.length){
          user = new DocManager.Entities.User(userCol.at(0).attributes);
          console.log('userFound: [%s] [%s]', user.get('username'), user.get('displayName'));
        }
      }
      if(cb)
        cb(user);
    });

  };

  var fetchPrevNextAction = function (ename, query, cb){
    var qmodel;
    if(query) qmodel = new DocManager.Entities.Comprobante({cnumber:query});
    else qmodel = Edit.Session.model;
    DocManager.request(ename,qmodel, function(model){
      if(model){
        Edit.Session.views.layout.close();
        DocManager.trigger("action:edit", model);
      }
    });
  };

  var registerHeadersEvents = function(hview){

      hview.on("childview:action:new", function(childView){
        DocManager.ActionsApp.Edit.createInstance(this);
      });

      hview.on("childview:action:item:new", function(childView){
        DocManager.ActionsApp.Edit.createItem(Edit.Session.model);
      });

      hview.on("childview:actions:list", function(childView, model){
        var trigger = model.get("navigationTrigger");
        DocManager.trigger(trigger);
      });

      hview.on('action:search',function(query, cb){
        console.log('edit_controller: action:search EVENT');
        DocManager.request("action:search",query, function(model){
          if(model){
            Edit.Session.views.layout.close();
            DocManager.trigger("action:edit", model);
          }
        });      

      });

      hview.on('action:fetchprev', function(query, cb){
        fetchPrevNextAction("action:fetchprev",query,cb);
      });

      hview.on('action:fetchnext', function(query, cb){
        fetchPrevNextAction("action:fetchnext",query,cb);
      });

  };

  // var initNavPanel = function(){
  //     var links = DocManager.request("actionui:edit:entities");

  //     var headers = new DocManager.ActionsApp.Common.Views.NavPanel({collection: links});
  //     //var headers = new Edit.NavPanel({collection: links});
  //     registerHeadersEvents(headers);

  //     return headers;
  // };



  var API = {
    searchActions: function(query, cb){
      Edit.modalSearchEntities('actions', query, function(model){
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
    createNewAction: function(){
      var opt = {
        facet: new DocManager.Entities.ActionCoreFacet(),
        caption:'Alta nueva acción'
      };      
      DocManager.ActionsApp.Edit.createInstance(opt, function(facet, submit){
        if(submit){
          facet.createNewAction(function(err, model){
            DocManager.trigger("action:edit",model);
          });
        }
      });

    }
  };

  DocManager.reqres.setHandler("action:create:new",  function(){
    API.createNewAction();
  });

  DocManager.reqres.setHandler("action:search", function(query, cb){
    API.searchActions(query, cb);
  });

  DocManager.reqres.setHandler("person:search", function(query, cb){
    API.searchPersons(query, cb);
  });

  DocManager.reqres.setHandler("product:search", function(query, cb){
    API.searchProducts(query, cb);
  });

  DocManager.reqres.setHandler("user:validate", function(usermail, cb){
    API.validateUser(usermail, cb);
  });

});
