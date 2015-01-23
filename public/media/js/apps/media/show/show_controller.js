MediaManager.module("MediaApp.Show", function(Show, MediaManager, Backbone, Marionette, $, _){

  Show.Controller = {

    showMedia: function(id){
      console.log('showMedia [%s]',id);

      if(!Show.Session) Show.Session = {};
      Show.Session.layout = new Show.Layout();
      Show.Session.currentView = 'ciclo';
      Show.Session.currentToken = 'directores';


      registerLayoutEvents(Show.Session.layout);
      if(id){
        var fetchingMedia = MediaManager.request("product:entity", id);
        $.when(fetchingMedia).done(function(media){
          var mediaView;

          if(media !== undefined){
            renderBrandingRegion(media);
          }
          else{
            mediaView = new Show.MissingMedia();
          }

          MediaManager.mainRegion.show(Show.Session.layout);
        });

      }else{
          MediaManager.mainRegion.show(Show.Session.layout);
      }
    }
  }

  var initNavPanel = function(layout){
      var links = MediaManager.request("media:nav:entities");

      var headers = new MediaManager.MediaApp.Common.Views.NavPanel({collection: links});
      registerHeadersEvents(headers, layout);

      return headers;
  };

  var registerLayoutEvents = function(layout){
    layout.on('chapter:serie:toggle', function(op){
      console.log('op layout:[%s]',op);
      if(Show.Session.currentView !== 'op'){
        changeView(op);
        renderMediaForm();

      }

    });

    layout.on('token:selected', function(token){
      console.log('TOKEN:[%s]',token);
      Show.Session.currentToken = token;
      renderMediaForm();
    });

  }

  var renderBrandingRegion = function(media){

    loadChapters(media, function(chCol){

      Show.Session.chapterCol = chCol;
      Show.Session.selProduct = media;
      initChapterLoad();
      changeChapter(0);

      
      var chapterForm = new Show.HeaderForm({
        model:Show.Session.selProduct
      });



      Show.Session.layout.brandingRegion.show(chapterForm);
      renderMediaForm();


      chapterForm.on('form:change', function(name, value){
        console.log('FORM CHANGE [%s] [%s] ', name, value);
        var index = getIndexOf(value, Show.Session.selProduct.get('optionlist'));
        changeChapter(index);

        console.log('MODEL CHANGE [%s] [%s]',Show.Session.selProduct.get('schapter'), index);

        chapterForm.render();
        renderMediaForm();

        //Show.Session.layout.brandingRegion.show(chapterForm);

      });
    });
  };

  var initChapterLoad = function(){
    Show.Session.selProduct.set({chapters: Show.Session.chapterCol.toJSON()});

    var optionList = buildOptionsArrayList(Show.Session.chapterCol);
    Show.Session.selProduct.set({optionlist: optionList, currentView: Show.Session.currentView, currentToken: Show.Session.currentToken});

  };

  var changeChapter = function(selectedChap ){
    var optionList = Show.Session.selProduct.get('optionlist');
    Show.Session.selProduct.set({selectedChapter: selectedChap, schapter: optionList[selectedChap].val});
    changeView(Show.Session.currentView);
    loadPlayer(Show.Session.chapterCol.at(selectedChap));

  };

  var loadPlayer = function(chapter){
    getURL(chapter, function(url){
      if(url){
        jwplayer('player-region').setup({
          flashplayer: "jwplayer/player.swf",
          file: url,
          height: 315,
          width: 560,
          //image: "/files/assets/preview.jpg"
        });      
      } else {
        jwplayer('player-region').remove();
      }
    });
  };

  var getURL = function(chapter, cb){
    var url;
    if(!chapter.get('branding')){
      cb(null) ;
      return;
    } 
    if(!chapter.get('branding').length){
      cb(null) ;
      return;
    }

    var brand = _.find(chapter.get('branding'),function(brand){
      return ((brand.tipobranding === 'proxy_video') && (brand.rolbranding === 'visualizacion') && (brand.estado_alta === 'activo'));
    });
    if(!brand) return null;
    if(brand.assetId){
      var asset = new MediaManager.Entities.AssetVideoUrl({_id : brand.assetId});
      asset.fetch({
        success: function(){
          console.log('ASSET CALLBACK: [%s]',asset.get('url'));
          cb(asset.get('url'));

        }
      });
      return null;
    }else{
      cb(brand.url);
    }
  };

  var changeView = function(view){
    Show.Session.currentView = view;
    if(Show.Session.currentView === 'ciclo'){
      Show.Session.currentEditing = Show.Session.selProduct;
    } else {
      var chIndex = Show.Session.selProduct.get('selectedChapter');
      Show.Session.currentEditing  = Show.Session.chapterCol.at(chIndex);
    }

  };
 
  var renderMediaForm = function(){
    console.log('CURRENT EDITING: [%s]', Show.Session.currentEditing.get('slug'));
    var mediaView;

    if(Show.Session.currentToken === 'editestados'){
      mediaView = Show.editProductState(Show.Session.currentEditing, Show.Session.currentToken );

    }else{
      mediaView = Show.editProduct(Show.Session.currentEditing, Show.Session.currentToken );
    }

    Show.Session.layout.productRegion.show(mediaView);

  };

  var getIndexOf = function (id, list){
    for (var i =0; i<list.length;i++){
      //console.log('getIndexOf: [%s] [%s]',list[i].val, id);
      if(list[i].val === id) return i;
    }
    return -1;
  };

  var buildOptionsArrayList = function(col){
    var list = [];
    col.each(function(elem){
      var option = {};
      option.val = elem.id;
      option.label = elem.get('slug');
      //console.log('buildOptionsArrayList:[%s] [%s]',option.val, option.label);
      list.push(option);

    });
    return list;
  };

  var loadChapters = function(product, cb){
    product.loadchilds(product,[ {'es_capitulo_de.id': product.id}],function(products){
      console.log('loadChapters cb: [%s]',products.length );
      if(cb) cb(products);
    });



  };
  
  var registerHeadersEvents = function(hview, layout){

      hview.on('document:search',function(query, cb){
        console.log('document SEARCH')
/*
        MediaManager.request("document:query:search",query, function(model){
          if(model){
            Show.Session.layout.close();
            MediaManager.trigger("document:edit", model);
          }
        });      
*/

      });
  };




  var API = {
    searchProducts: function(query, cb){
      Show.modalSearchEntities('products', query, function(model){
        console.log('producto encontrado: [%s] [%s]', model.get('slug'), model.id);
        MediaManager.navigate("show/" + model.id );
        renderBrandingRegion(model);

        //cb(model);
      });
    },
  };


  MediaManager.reqres.setHandler("product:search", function(query, cb){
    console.log('productsearch: [%s]',query)
    API.searchProducts(query, cb);
  });

});
