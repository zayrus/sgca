StudioManager.module("MediaApp.Show", function(Show, StudioManager, Backbone, Marionette, $, _){
  //localhost:3000/studio/#show/790321ea-bcd6-4b50-a508-8ca5b86fdb1f

  //MATEO1:
  //localhost:3000/studio/#show/cb8e710f-eb64-4525-bb0e-0163903ded18
  // 6c9d98a775ddebdd23b7926ae2accc52f83cba16

  Show.Controller = {

    showMedia: function(id){
      console.log('showMedia [%s]',id);

      if(!Show.Session) Show.Session = {};
      Show.Session.layout = new Show.Layout();
      Show.Session.currentView = 'production';
      Show.Session.currentToken = 'properties';
      Show.Session.currentEditing = '';

      registerLayoutEvents(Show.Session.layout);

      if(id){
        var fetchingMedia = StudioManager.request("production:entity", id);

        $.when(fetchingMedia).done(function(media){
          console.log('MEDIA: [%s]',media.get('properties').properties.name)
          var mediaView, navbarView;

          StudioManager.mainRegion.show(Show.Session.layout);

          if(media !== undefined){
            navbarView = initNavPanel(Show.Session.layout);
            renderProductionHeader(media);
            loadEntities(media);
            loadAssets(media);
            Show.Session.selProduction = media;
            changeView(Show.Session.currentView);
            // oJo renderProduction(media);
          }
          else{
            mediaView = new Show.MissingMedia();
          }

 
        });

      }else{
          StudioManager.mainRegion.show(Show.Session.layout);
      }
    }
  }

  var initNavPanel = function(layout){
      var links = StudioManager.request("media:nav:entities");
      //console.log('initNavPanel: [%s]', links.length);

      var headers = new StudioManager.MediaApp.Common.Views.NavPanel({collection: links});
      registerSubmenuEvents(headers, layout);
      layout.navbarRegion.show(headers);

      return headers;
  };

  var registerLayoutEvents = function(layout){
    layout.on('production:serie:toggle', function(op){
      console.log('op layout:[%s]',op);
      if(Show.Session.currentView !== 'op'){
        changeView(op);
        renderMediaForm();
      }

    });

    layout.on('token:selected', function(token){
      //console.log('TOKEN:[%s]',token);
      Show.Session.currentToken = token;
      renderMediaForm();
    });

  }
  
  var loadAssets = function(media){

    var assetCol = StudioManager.request("eaasset:production:entities", media);
   
    $.when(assetCol).done(function(assets){
      //assets.initAfterFetching();
      //console.log('1.1  [%s]:[%s]', assets.get('ea:assetsId') , production.get('productionName') );
      //Edit.Session = {};
      console.log('loadAssets: [%s][%s]', assets, assets.length)
      if(assets.length){
        var optlist = buildAssetsList(assets);
        Show.Session.currentAsset = assets.at(0);
        Show.Session.assets = assets;

        var currAsset = Show.Session.currentAsset.attributes;
        media.set({assetsOptionList: optlist,assets: assets.toJSON});
        media.set({currentasset: currAsset});
        renderAssetItems(media);

      }else{

      }
    });
  };

  var renderAssetItems = function(media){
    //console.log('renderAssetItems: [%s]',media.get('currentasset').properties.properties.description)

    var assetListView =  new Show.ProductionSelectors({
        model: media
    });
    registerAssetListViewEvents(assetListView);
    Show.Session.layout.selectorRegion.show(assetListView);


  };

  var registerAssetListViewEvents = function(view){

    view.on('form:change', function(name, value){
      //console.log('FORM CHANGE [%s] [%s] ', name, value);
      var currAsset = Show.Session.assets.find(function(as){
        //console.log('find: [%s][%s]',value, as.get('ea:assetId'));
        return (as.get('ea:assetId') === value);
      });
      Show.Session.currentAsset = currAsset;
      view.model.set({currentasset: currAsset.attributes})
      Show.Session.layout.selectorRegion.show(view);

/*
      var index = getIndexOf(value, Show.Session.selProduction.get('optionlist'));
      changeChapter(index);

      console.log('MODEL CHANGE [%s] [%s]',Show.Session.selProduction.get('schapter'), index);

      chapterForm.render();
      renderMediaForm();

      //Show.Session.layout.brandingRegion.show(chapterForm);
*/
    });
  };

  var buildAssetsList = function (assets){
    var optionList = [];
    //console.log('build ASSETS [%s]',assets.length)

    assets.each(function(pr){
      var name = pr.get('properties').properties.name ;
      optionList.push({
          val:pr.get('ea:assetId'), label: name
      });
    })
    return optionList;
  };

  var loadEntities = function(media){
    //console.log('loadEntities')
    //header-region descripción de la producción
    var entitiesView = new Show.ProductionEntities({
      model: media
    });


    media.fetchUsers(function(production){
      //console.log('****** RENDER ENTITIES CB [%s]', production.get('access').users.length);
      production.set( {usersOptionList: buildUsersList(production)});
      production.set( {groupsOptionList: buildGroupsList(production)});
      production.set( {sessionsOptionList: buildSessionsList(production)});
      renderEntities(entitiesView);
    })

  };
  var buildSessionsList = function (production){
    var optionList = [{val:'nodefinido', label:'Sesiones abiertas' }];
    var easessions = production.get('easessions').sessions;
    console.log('BUILD easessions [%s]',easessions.length);

    _.each(easessions, function(pr){
      optionList.push({
          val:pr['ea:sessionId'], label: pr['ea:owner']
      });
    })
    //console.log('commitOptionList:[%s]',optionList.length)
    return optionList;
  };
  var buildCommitList = function (production){
    var optionList = [];
    var commits = production.get('properties').links;
    //console.log('BUILD commits [%s]',commits.length);

    _.each(commits, function(pr){
      var name = pr.rel;
      optionList.push({
          val:name, label: name
      });
    })
    //console.log('commitOptionList:[%s]',optionList.length)
    return optionList;
  };

  var buildUsersList = function (production){
    var optionList = [{val:'nodefinido', label:'Usuarios' }];
    var users = new StudioManager.Entities.EaUserCollection(production.get('access').users);
    //console.log('BUILD users [%s]',users.length)

    users.each(function(pr){
      var name = pr.get('ea:userId') + ': ' + pr.get('properties').firstname + " " + pr.get('properties').lastname;
      optionList.push({
          val:pr.get('ea:userId'), label: name
      });
    })
    return optionList;
  };
  var buildGroupsList = function (production){
    var optionList = [{val:'nodefinido', label:'Grupos' }];
    var groups = new StudioManager.Entities.EaUserCollection(production.get('access').groups);
    //console.log('BUILD groups [%s]',groups.length)

    groups.each(function(pr){
      var name = pr.get('ea:groupId');
      optionList.push({
          val:name, label: name
      });
    })
    return optionList;
  };

  var renderEntities = function(view){
    //console.log('renderEntities ready to show')
    Show.Session.layout.entitiesRegion.show(view);

  };

  var renderProductionHeader = function(media){
    //console.log('renderProductionHeader')
    //header-region descripción de la producción
    media.set({commitsOptionList: buildCommitList(media)});

    var headerView = new Show.ProductionHeader({
      model: media
    });
    //console.log('renderProductionHeader ready to show')
    Show.Session.headerView = headerView;
    Show.Session.layout.headerRegion.show(Show.Session.headerView);

  };

  var renderProduction = function(media){

    loadChapters(media, function(chCol){

      Show.Session.assets = chCol;
      Show.Session.selProduction = media;
      initChapterLoad();
      changeChapter(0);

      
      var chapterForm = new Show.HeaderForm({
        model:Show.Session.selProduction
      });



      Show.Session.layout.brandingRegion.show(chapterForm);
      renderMediaForm();


      chapterForm.on('form:change', function(name, value){
        //console.log('FORM CHANGE [%s] [%s] ', name, value);
        var index = getIndexOf(value, Show.Session.selProduction.get('optionlist'));
        changeChapter(index);

        //console.log('MODEL CHANGE [%s] [%s]',Show.Session.selProduction.get('schapter'), index);

        chapterForm.render();
        renderMediaForm();

        //Show.Session.layout.brandingRegion.show(chapterForm);

      });
    });
  };

  var initChapterLoad = function(){
    Show.Session.selProduction.set({chapters: Show.Session.assets.toJSON()});

    var optionList = buildOptionsArrayList(Show.Session.assets);
    Show.Session.selProduction.set({optionlist: optionList, currentView: Show.Session.currentView, currentToken: Show.Session.currentToken});

  };

  var changeChapter = function(selectedChap ){
    var optionList = Show.Session.selProduction.get('optionlist');
    Show.Session.selProduction.set({selectedChapter: selectedChap, schapter: optionList[selectedChap].val});
      (Show.Session.currentView);
    loadPlayer(Show.Session.assets.at(selectedChap));

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
      var asset = new StudioManager.Entities.AssetVideoUrl({_id : brand.assetId});
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
    if(Show.Session.currentView === 'production'){
      Show.Session.currentEditing = Show.Session.selProduction;
    } else {
      var chIndex = Show.Session.selProduction.get('selectedChapter');
      Show.Session.currentEditing  = Show.Session.assets.at(chIndex);
    }

  };
 
  var renderMediaForm = function(){
    console.log('CURRENT EDITING: ');
    var mediaView;

    mediaView = Show.editProduction(Show.Session.currentEditing, Show.Session.currentToken );

    Show.Session.layout.entityRegion.show(mediaView);

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

  var loadChapters = function(production, cb){
    production.loadchilds(production,[ {'es_capitulo_de.id': production.id}],function(productions){
      console.log('loadChapters cb: [%s]',productions.length );
      if(cb) cb(productions);
    });



  };
  
  var registerSubmenuEvents = function(hview, layout){
    console.log('registerNavHeaders');

      hview.on('production:session:begin',function(){
        console.log('session BEGIN BUBBLE')
        Show.Session.selProduction.createSession(function(){
          console.log('SESSION CB')
          Show.Session.layout.headerRegion.show(Show.Session.headerView);
        });
      });

      hview.on('production:session:push',function(){
        console.log('session push BEGIN BUBBLE');
        Show.Session.selProduction.pushSession(function(){
          console.log('PUSH SESSION CB');
          //Show.Session.layout.headerRegion.show(Show.Session.headerView);
          StudioManager.trigger("media:show", Show.Session.selProduction.get('ea_productionId'));
        });
      });

      hview.on('production:new:user',function(){
        console.log('newUser BEGIN BUBBLE')
        StudioManager.request("production:new:user", function(){
          console.log('SubMenu CB END')
        });      
      });
 
      hview.on('production:new:ingest',function(){
        console.log('new INGEST BEGIN BUBBLE')
        StudioManager.request("production:new:ingest", function(){
          console.log('SubMenu CB END')
        });      
      });


/*        Show.Session.selProduction.createSession(function(){
          console.log('SESSION CB')
          Show.Session.layout.headerRegion.show(Show.Session.headerView);
        });
*/



      hview.on('production:search',function(query, cb){
        console.log('document SEARCH')
        StudioManager.request("production:search",query, function(model){
          console.log('callback MINGA');
          if(model){
            Show.Session.layout.close();
            StudioManager.trigger("document:edit", model);
          }
        });      
      });
  };




  var API = {
    searchProductions: function(query, cb){
      Show.modalSearchEntities('productions', query, function(model){
        console.log('production encontrada: [%s] [%s]', model.get('properties').name, model.get('ea_productionId'));
        StudioManager.trigger("media:show",  model.get('ea_productionId') );

        //StudioManager.navigate("show/" + model.get('ea_productionId') );
        //oJo: renderProduction(model);

        //cb(model);
      });
    },
    newUser: function(cb){
      StudioManager.MediaApp.Show.createInstance(Show.Session.selProduction);
      //if(cb) cb();
    },
    newIngest: function(cb){
      StudioManager.MediaApp.Show.createIngest(Show.Session.selProduction);
      //if(cb) cb();
    },
  };

  StudioManager.reqres.setHandler("production:new:ingest", function(cb){
    console.log('Production:new:ingest')
    API.newIngest(cb);
  });


  StudioManager.reqres.setHandler("production:new:user", function(cb){
    console.log('Production:new:user')
    API.newUser(cb);
  });

  StudioManager.reqres.setHandler("media:production:search", function(query, cb){
    console.log('MEDIA:productionsearch: [%s]',query)
    API.searchProductions(query, cb);
  });

});
