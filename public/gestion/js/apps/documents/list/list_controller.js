DocManager.module("DocsApp.List", function(List, DocManager, Backbone, Marionette, $, _){

  var registerHeadersEvents = function(hview, layout){
      hview.on("itemview:document:new", function(childView){
        DocManager.DocsApp.Edit.createInstance(this);
      });

      hview.on("itemview:report:new", function(childView){
        console.log('Report nuevo comprobante NEW!');
        DocManager.DocsApp.Report.Edit.createInstance(this);
      });

      hview.on("itemview:documents:list", function(childView, model){
        //var trigger = model.get("navigationTrigger");
        //DocManager.trigger(trigger);
        DocManager.request("document:query:list","", function(model){
          console.log('document LIST cb')
        });      
      });
      /*
      hview.on("documents:filtered:list", function(criteria){
        console.log('filtered list [%s]',criteria)

        DocManager.request("document:filtered:entities", criteria, function(documents){
          console.log('Filtered CALLBACK: [%s]',documents.length);
          var documentsListView = new List.Documents({
            collection: documents
          });
          registerDocumListEvents(documentsListView);
            layout.mainRegion.show(documentsListView);
          });
      });
      */
      hview.on('document:search',function(query, cb){

        DocManager.request("document:query:search",query, function(model){
          if(model){
            Edit.Session.layout.close();
            DocManager.trigger("document:edit", model);
          }
        });      

      });

      hview.on('document:group:edit',function(){
        var self = this;
        if(!List.Session.selectedDocumentList.length) return;
        console.log('document:group:edit controller');

        List.groupEditForm(function(qmodel){
          
          var data = qmodel.attributes;
          console.log('Form CLOSE:[%s] [%s]',data.estado_alta, data.nivel_ejecucion);
          updateSelectedDocuments(data, function(){
            console.log('end-of-story')
          });

        });

        
      });
      
      hview.on('document:exportar:excel',function(){
        var self = this;
          //si no se selecciono nada retorna
        if(!List.Session.selectedDocumentList.length) return;
        console.log('document:exportar:excel controller');
          var listcomp = ([]);
          var listaux  = [];

          List.Session.selectedDocumentList.each(function(model){
                listaux.push(model.get('cnumber'));
                listaux.push(model.get('fecomp'));
                listaux.push(model.get('tipocomp'));
                listaux.push(model.get('persona'));
                listaux.push(model.get('slug')); 
                
                listcomp.push(listaux);
                listaux  = [];
           })
          //
          generarexcel(listcomp);

        
      });

  };

var generarexcel = function(listcomp){

    var heading = ['Comprob', 'fecha', 'tipo', 'persona', 'asunto-descripcion'];
    var data =(listcomp);

    //var options = ('D5', ['Total:', '=SUM(E2:E4)'], { font: { bold: true }, alignment: 'right' });
     // var options = (['Total:', '=SUM(E2:E4)']);
    var name = "ListaComprobantes";

    var query = {
        heading:heading,
        data:data,
        name:name
    };

    $.ajax({
            type: "POST",
            url: "/excelbuilder",
            dataType: "json",
            data: query,
            success: function(data){
                console.dir(data);
                window.open(data.file)
            }
    });
};
    
  var updateSelectedDocuments = function(data, cb){
    var actual = dao.extractData(data);
    var query = buildQuery(data);
    var update = new DocManager.Entities.DocumentsUpdate();
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
    List.Session.selectedDocumentList.each(function(model){
      list.push(model.id || model.get('documid'));
    })
    query.newdata = dao.extractData(data);
    query.nodes = list;
    return query;

  };

  var initNavPanel = function(layout){
      var links = DocManager.request("docum:nav:entities");

      var headers = new DocManager.DocsApp.Common.Views.NavPanel({collection: links});
      registerHeadersEvents(headers, layout);

      return headers;
  };

  List.Controller = {
    listDocuments: function(criterion){
      console.log('DocsAPP.List.Controller.listdocuments');
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

        if(List.Session.query){
          query = List.Session.query;
        }else{
          query = dao.gestionUser.getDocumQuery();
          List.Session.query = query;
        }

        var tipolistado = dao.gestionUser.getDocumListType();

        if(tipolistado === 'items'){
          DocManager.request("document:query:items",query, function(model){
            console.log('query lista CALLBACK - END');
          });

        }else {
          DocManager.request("document:query:list","", function(model){
            console.log('query lista CALLBACK - END');
          });

        }


      });// currentUser

    }
  };


  var registerDocumListEvents = function(documentsListView) {
        
        documentsListView.on("itemview:document:show", function(childView, model){
          var documid = model.id || model.get('documid');
          DocManager.trigger("document:show", documid);
        });

        documentsListView.on("itemview:document:edit", function(childView, model){
          DocManager.trigger("document:edit", model);
        });

        documentsListView.on("itemview:document:delete", function(childView, model){
          model.destroy();
        });

        documentsListView.on("document:sort", function(sort){

          console.log('REGISTERDOCUMLISTEVENTS: EVENT SORT [%s] [%s]', sort, this.collection.length);
          
          if(sort === 'fechagestion') sort = 'fechagestion_tc';
          if(sort === 'fecomp') sort = 'fecomp_tc';
          this.collection.sortfield = sort;
          this.collection.sortorder = -this.collection.sortorder;
          this.collection.sort();
          this.render();
        });

        documentsListView.on("itemview:dcuments:related", function(childView, model, cb){
          console.log('documents RELATED BEGIN [%s] [%s]  ',model.get('product'),model.get('productid') );
          List.Session.relatedLayout = null;
          loadProductChilds(childView, model, cb);
        });

        documentsListView.on("itemview:document:row:selected", function(childView, mode, model){
          console.log('Row CHECKBOX TOGGLE [%s] [%s]  ',model.get('cnumber'),mode);

          if(mode){
            List.Session.selectedDocumentList.add(model);
          }else{
            List.Session.selectedDocumentList.remove(model);

          }

          console.log('Row CHECKBOX TOGGLE [%s] [%s] [%s]  ',model.get('cnumber'),mode, List.Session.selectedDocumentList.length );

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
    
    var relatedDocumentsView = new List.RelatedDocuments({collection: documents});
    registerRelatedDocumentEvents(relatedDocumentsView);

    var relatedLayout = new List.RelatedLayout();


    relatedLayout.on("show", function(){
        relatedLayout.productRegion.show(relatedProductView);
        relatedLayout.productsRegion.show(relatedProductsView);
        relatedLayout.documentsRegion.show(relatedDocumentsView);
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

    view.on("itemview:view:related:product", function(childView, model, cb){
      console.log('Te tengo, malvado [%s] [%s]', model.get('productcode'), model.id);
      loadProductChilds(childView, model, cb);
    });

    view.on("itemview:edit:related:product", function(childView, model, cb){
      console.log('product EDIT [%s] [%s]', model.get('productcode'), model.id);
      if(!model.id) return;
      window.open('/#productos/'+model.id,'productos/edit');
    });


  };

  var registerRelatedDocumentEvents = function(view){

    view.on("itemview:view:related:document", function(childView, model, cb){
      console.log('Te tengo, malvado [%s] [%s]', model.get('cnumber'), model.id);
      //loadProductChilds(childView, model, cb);

      var documLayout = new DocManager.DocsApp.Show.Layout();

      var fetchingDocument = DocManager.request("document:entity", model.id);
      $.when(fetchingDocument).done(function(document){
        var documentView;
        if(document !== undefined){
          var itemCol = new DocManager.Entities.DocumItemsCollection(document.get('items'));

          documentView = new DocManager.DocsApp.Show.Document({
            model: document
          });
          documentHeader = new DocManager.DocsApp.Show.Header({
            model: document
          });
          brandingView = new DocManager.DocsApp.Show.Branding({
              model: document
          });
          documentItems = new DocManager.DocsApp.Show.DocumentItems({
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
          documentView = new DocManager.Show.MissingDocument();
        }

         List.viewDocument(documLayout, brandingView, documentHeader, documentItems);
      });
    });

  };

  var API = {
    listDocuments: function(criterion, cb){
        DocManager.request("document:filtered:entities", criterion, function(documents){
          setColumnTable('docum');

          /*  documNavBar.once("show", function(){
            documNavBar.triggerMethod("set:filter:criterion", criterion);
          });*/
    
          var documentsListView = new List.Documents({
            collection: documents
          });

          List.Session.selectedDocumentList = new DocManager.Entities.ComprobanteCollection();
          registerDocumListEvents(documentsListView);

          /* documNavBar.on("documents:filter", function(filterCriterion){
            filteredDocuments.filter(filterCriterion);
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

    listDocumentItems: function( squery ){
        console.log('callback: [%s] [%s] [%s]', squery.fedesde, squery.resumen, squery.tipocomp);
  
        DocManager.request("document:query:entities", squery, function(documents){
          setColumnTable('documitems');

          var documentsListView = new List.Documents({
            collection: documents
          });

          List.Session.selectedDocumentList = new DocManager.Entities.ComprobanteCollection();
          registerDocumListEvents(documentsListView);
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

    searchDocuments: function(squery, cb){
      var self = this;
      console.log('LIST CONTROLLER searchDocuments API called: query:[%s]', squery)
      if(!List.Session.query) List.Session.query = {};
      if(squery) List.Session.query.slug = squery;

      List.queryForm(List.Session.query, function(qmodel){
        
        List.Session.query = qmodel.attributes;
        dao.gestionUser.update(DocManager, 'documQuery', qmodel.attributes);
        self.listDocumentItems(List.Session.query);

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

  DocManager.reqres.setHandler("document:query:search", function(query, cb){
    API.searchDocuments(query, cb);
  });

  DocManager.reqres.setHandler("document:query:list", function(query, cb){
    API.listDocuments(query, cb);
  });

  DocManager.reqres.setHandler("document:query:items", function(query, cb){
    API.listDocumentItems(query, cb);
  });

  DocManager.reqres.setHandler("person:search", function(query, cb){
    API.searchPersons(query, cb);
  });

  DocManager.reqres.setHandler("product:search", function(query, cb){
    API.searchProducts(query, cb);
  });

});

/*

          var view = new DocManager.DocsApp.Edit.Document({
            model: model
          });

          view.on("form:submit", function(data){
            if(model.save(data)){
              childView.render();
              view.trigger("dialog:close");
              childView.flash("success");
            }
            else{
              view.triggerMethod("form:data:invalid", model.validationError);
            }
          });

          DocManager.dialogRegion.show(view);


*/

/*
  var setActiveHeader = function(headerUrl){
      console.log('Set Active Header headerUrl [%s]',headerUrl);
      var links = DocManager.request("header:entities");
      var headerToSelect = links.find(function(header){ return header.get("url") === headerUrl; });
      headerToSelect.select();
      links.trigger("reset");
  };
*/

/*
      headers.on("itemview:document:new", function(childView){
        console.log('initNavPanel BUBLING');
        //var trigger = model.get("navigationTrigger");
        //DocManager.trigger(trigger);

          var newDocument = new DocManager.Entities.Comprobante();

          var view = new DocManager.DocsApp.New.Document({
            model: newDocument
          });

          view.on("form:submit", function(data){
            var highestId = documents.max(function(c){ return c.id; }).get("id");
            data.id = highestId + 1;
            if(newDocument.save(data)){
              documents.add(newDocument);
              view.trigger("dialog:close");
              var newDocumentView = documentsListView.children.findByModel(newDocument);
              // check whether the new document view is displayed (it could be
              // invisible due to the current filter criterion)
              if(newDocumentView){
                newDocumentView.flash("success");
              }
            }
            else{
              view.triggerMethod("form:data:invalid", newDocument.validationError);
            }
          });
          DocManager.dialogRegion.show(view);
      });
*/

/*        documNavBar.on("document:new", function(){
          var newDocument = new DocManager.Entities.Document();

          var view = new DocManager.DocsApp.New.Document({
            model: newDocument
          });

          view.on("form:submit", function(data){
            var highestId = documents.max(function(c){ return c.id; }).get("id");
            data.id = highestId + 1;
            if(newDocument.save(data)){
              documents.add(newDocument);
              view.trigger("dialog:close");
              var newDocumentView = documentsListView.children.findByModel(newDocument);
              // check whether the new document view is displayed (it could be
              // invisible due to the current filter criterion)
              if(newDocumentView){
                newDocumentView.flash("success");
              }
            }
            else{
              view.triggerMethod("form:data:invalid", newDocument.validationError);
            }
          });

          DocManager.dialogRegion.show(view);
        });
*/

/*
      headers.on("brand:clicked", function(){
        console.log('initNavPanel: brand:clicked');
        //DocManager.trigger("documents:list");
      });

      headers.on("itemview:navigate", function(childView, model){
        var trigger = model.get("navigationTrigger");
        DocManager.trigger(trigger);
      });
*/      
/*            productmodel.insertCapitulos(dao.pacapitulosfacet.getContent(),function(){
                self.beforeSave();
                console.log('formcapitulos:productdetails, ready to RELOAD CHAPTERS [%s]','productos/' + productmodel.id);
                self.renderChilds();
                //utils.approuter.navigate('productos/' + productmodel.id, {trigger: true, replace: false});
            });
*/


