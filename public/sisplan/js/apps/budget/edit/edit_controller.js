DocManager.module("BudgetApp.Edit", function(Edit, DocManager, Backbone, Marionette, $, _){

  Edit.Controller = {
    editBudget: function(id){
      console.log('BudgetApp.Edit.Controller.editBudget');

      var fetchingBudget = DocManager.request("budget:entity", id);
     
      $.when(fetchingBudget).done(function(action){

        console.log('BudgetApp.Edit BEGIN', action.get('slug'));
    
        Edit.Session = {};
        Edit.Session.views = {};
        registerBudgetEntity(action);

        Edit.Session.views.layout = new Edit.Layout();

    
        // ========== Main SECTION ============
        Edit.Session.views.mainLayout = new Edit.MainLayout();
        registerMainLayoutEvents(Edit.Session.views.mainLayout);


        // ========== Sidebar MENU ============
        Edit.Session.views.sidebarMenu = new DocManager.BudgetApp.Common.Views.SidebarMenu({});
        registerSidebarMenu(Edit.Session.views.sidebarMenu);
  
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
        facet: model.fetchEditFacet(),
        hook: '.js-form-hook',
        captionlabel: 'Edición'
      };
      Edit.inlineedit(opt,function(facet, submit){
        if(submit){
          facet.updateModel(model);
          console.log('callback EDICION');
          updateMainEntityModel(model, function(model){
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
      DocManager.BudgetApp.Edit.createInstance(opt, function(facet, submit){
        if(submit){
          facet.createNewAction(function(err, model){
            DocManager.trigger("budget:edit",model);
          });
        }
      });
    });

    view.on('budget:new',function(view){
      console.log('NEW BUDGET BUBBLE');
      var opt = {
        view: view,
        facet: new DocManager.Entities.BudgetCoreFacet({},{formType:'short'}),
        caption:'Alta nuevo pase de presupuesto',
      };
      DocManager.BudgetApp.Edit.createInstance(opt, function(facet, submit){
        if(submit){
          facet.createNewInstance(Edit.Session.model, Edit.Session.currentUser, function(err, model){
            console.log('UPDATE VIEWS NOW');
            registerNewBudgetItem(model);
          });
        }

      });
    });
  };

  //======== ACTION ENTITY 
  var registerBudgetEntity = function(model) {
    var fetchingAction;
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

    fetchingAction = DocManager.request('action:entity',Edit.Session.model.get('owner_id'));
    $.when(fetchingAction).done(function(action){
      console.log('action:entity REQUEST CB:[%s]',action.get('slug'));
      if(action){
        Edit.Session.owner = action;
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
    createBudgetView(budgetcol);
  };


  //======== ACTION ENTITY MODEL SAVE UPDATE
  var updateMainEntityModel = function(model, cb){
    model.update(Edit.Session.owner, function(err,model){
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
    model.update(Edit.Session.owner, function(err,model){
      if(err){
        view.triggerMethod("form:data:invalid", err);
      }else{
        console.log('UPDATE FINISHED!')
        if(cb) cb(model);
      }
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
    var sendMail = new DocManager.BudgetApp.Common.Views.SendMail({
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
        DocManager.trigger("budget:edit", model);
      }
    });
  };

  var registerHeadersEvents = function(hview){

      hview.on("childview:budget:new", function(childView){
        DocManager.BudgetApp.Edit.createInstance(this);
      });

      hview.on("childview:budget:item:new", function(childView){
        DocManager.BudgetApp.Edit.createItem(Edit.Session.model);
      });

      hview.on("childview:budgets:list", function(childView, model){
        var trigger = model.get("navigationTrigger");
        DocManager.trigger(trigger);
      });

      hview.on('budget:search',function(query, cb){
        console.log('edit_controller: budget:search EVENT');
        DocManager.request("budget:search",query, function(model){
          if(model){
            Edit.Session.views.layout.close();
            DocManager.trigger("budget:edit", model);
          }
        });      

      });

      hview.on('budget:fetchprev', function(query, cb){
        fetchPrevNextAction("budget:fetchprev",query,cb);
      });

      hview.on('budget:fetchnext', function(query, cb){
        fetchPrevNextAction("budget:fetchnext",query,cb);
      });

  };

  // var initNavPanel = function(){
  //     var links = DocManager.request("actionui:edit:entities");

  //     var headers = new DocManager.BudgetApp.Common.Views.NavPanel({collection: links});
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
    searchProducts: function(query, cb){
      Edit.modalSearchEntities('products', query, function(model){
        cb(model);
      });
    },
  };

  DocManager.reqres.setHandler("budget:search", function(query, cb){
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
