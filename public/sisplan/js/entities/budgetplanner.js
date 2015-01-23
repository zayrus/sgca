DocManager.module("Entities", function(Entities, DocManager, Backbone, Marionette, $, _){
  
  Entities.BudgetPlanner = Backbone.Model.extend({
    whoami: 'Entities.BudgetPlanner:budgetplanner.js ',

    idAttribute: "_id",

    defaults: {
      _id: null,

      tregistro:"",
      taccion: "",
      tipomov:"",

      estado_alta:'media',
      nivel_ejecucion: 'enproceso',
      nivel_importancia: 'alta',
      descriptores: "",
      nodo:"",
      area:"",
      tgasto:"",
      taccion:"",
      areaopt:true,
      nodoopt:true,
      tgastoopt:true,
      taccionopt:true,
      tipomovopt:true,
      contraparte:"",
      costo_total:0,
      vista_actual:'',
    },
    
    initBeforeCreate: function(cb){
    },

    resetFilteredCol: function(){
      var self = this;
      self.filteredCol = filterActionBudgetCol(self.dbaseCol, self);
      //console.log('**********  reseted col[%s]', self.filteredCol.length);
      //scanCollection(self.filteredCol);
      return self.filteredCol;
    },

    getFilteredCol: function(){
      var self = this;
      if(self.filteredCol)
        return self.filteredCol;
      else
        return self.resetFilteredCol();
    },

    getSummaryCol: function(type){
      var self = this;
      if(self.summaryCol)
        return self.summaryCol;
      else
        return self.buildSummaryCol(type);
    },

    showD3Pie: function(selector){
      var self = this;
      var opt = buildOptForD3(self);

      if(!self.d3pie){
        self.d3pie = d3PieFactoryView(opt, this.d3Array, selector);
      }else{
        self.d3pie.destroy();
        self.d3pie = d3PieFactoryView(opt, this.d3Array, selector);
        //d3PieRedraw( self.d3pie, opt, self.d3Array, selector);
      }
      
    },

    buildSummaryCol: function(type){
      console.log('building summary col')
      var self = this,
          d3Array = [];
      var summaryQuery = buildSummaryQuery(type);

      self.summaryCol = summaryColFactory(summaryQuery, self.getFilteredCol());

      self.set('costo_total', getCostoTotal(self.summaryCol));
      self.set('vista_actual', type);
      self.d3Array = d3ArrayFactory(self.summaryCol);
      //debug_showSummaryCol(self.summaryCol);

      return self.summaryCol;
    },

    fetchData: function(query, opt, cb){
      var self = this;
      DocManager.request('budgetplanner:load:records', query, opt, function(col){
        //console.log('estoy de vuelta en ListController [%s]',col.length);
        self.dbaseCol = new Entities.ActionBudgetCol(col);
        
        cb(self.resetFilteredCol())
      })
    },

  });

/*  Entities.ActionBudget = Backbone.Model.extend({
    whoami: 'Entities.ActionBudget:budgetplanner.js ',

    idAttribute: "_id",

    defaults: {
    },
    
    initBeforeCreate: function(cb){
    },


  });
*/
  Entities.SummaryModel = Backbone.Model.extend({
    whoami: 'Entities.SummaryModel:budgetplanner.js ',

    idAttribute: "_id",

    defaults: {
      slug: '',
      origenpresu: '',
      tramita: '',
      trim_fiscal: '',
      costo_total: 0,
    },
    
    initBeforeCreate: function(cb){
    },

  });

  Entities.ActionBudgetCol = Backbone.Collection.extend({
    whoami: 'Entities.ActionBudgetCol:budgetplanner.js ',
    url: "/acciones",
    model: Entities.Budget,
    sortfield: 'cnumber',
    sortorder: -1,

    comparator: function(left, right) {
      var order = this.sortorder;
      var l = left.get(this.sortfield);
      var r = right.get(this.sortfield);

      if (l === void 0) return -1 * order;
      if (r === void 0) return 1 * order;

      return l < r ? (1*order) : l > r ? (-1*order) : 0;
    },
  });

  Entities.SummaryCol = Backbone.Collection.extend({
    whoami: 'Entities.SummaryCol:budgetplanner.js ',
    sortfield: 'costo_total',
    sortorder: 1,
    model: Entities.SummaryModel,

    comparator: function(left, right) {
      var order = this.sortorder;
      var l = left.get(this.sortfield);
      var r = right.get(this.sortfield);

      if (l === void 0) return -1 * order;
      if (r === void 0) return 1 * order;

      return l < r ? (1*order) : l > r ? (-1*order) : 0;
    },
  });
  

// ================ INTERNAL API =================

  var buildSummaryQuery = function(type){
    if(!type){
      type = 'nodo'
    }
    var query = {};
    query.type = type
    return query;
  };
  
  var getCostoTotal = function(col){
    var total = 0;
    col.each(function(model){
      total += model.get('costo_total');
    })
    return total;
  };

  var d3ArrayFactory = function(col){
    var d3Array = [],
        colorIdx = 0,
        item;
    col.each(function(model, index){
      colorIdx = (colorIdx < colorArray.length) ? colorIdx : 0;
      item = {
        label: model.get('slug'),
        value: model.get('costo_total'),
        //color: colorArray[Math.floor(Math.random() * colorArray.length)].color
        color: colorArray[colorIdx].color
      }
      colorIdx += 1;
      d3Array.push(item);
    });
    return d3Array;
  };

  var summaryColFactory = function(query, masterCol){
    var token,
        costo;
    //console.dir(query);

    var summaryCol = new Entities.SummaryCol();


    masterCol.each(function(model){
      if(model.get('estado_alta') === 'activo'){
        token = {
          slug: fetchIndicator(query.type, model),
          origenpresu: model.get('origenpresu'),
          tramita: model.get('tramita'),
          anio: parseInt(model.get('anio_fiscal'))
        };
        costo = {
          type: query.type,
          slug: model.get('slug'),
          importe: model.get('importe'),
          trimestre: model.get('trim_fiscal')
        };
        //console.log('ready to insert token: anio:[%s] /[%s] tim:[%s] /[%s]',model.get('anio_fiscal'), token.anio, model.get('trim_fiscal'), costo.trim);

        insertTokenInSummaryCol(token, costo, summaryCol);        
      }else{
        //console.log('registro excluido por no estar Activo:[%s]', model.get('cnumber'));
      }

    });
    //console.log('summarColFctory ended:[%s]', summaryCol.length)
    summaryCol.sort();
    return summaryCol;
  };

  var fetchIndicator = function(type, model){
    var indicator = '';
    if(!type) type = 'nodo';

    if(type === 'nodo'){
      indicator = utils.fetchNode(utils.actionAreasOptionList, model.get('parent_action')['area']);
    }else if(type === 'area'){
      indicator = model.get('parent_action')['area'];
    }else if(type === 'tregistro'){
      indicator = model.get('tregistro');
    }else if(type === 'lineaaccion'){
      indicator = model.get('parent_action')['lineaaccion']
    }else if(type === 'taccion'){
      indicator = model.get('parent_action')['taccion']
    }else if(type === 'tgasto'){
      indicator = model.get('tgasto');
    }else{
      indicator = 'NO-PREVISTO';
    }
    if(!indicator){
      indicator = 'VALORES-NULOS: ' + model.get('parent_action')['cnumber']+': '+model.get('cnumber');

    }
    return indicator;
  };
  var debug_showSummaryCol= function(col){
    col.each(function(model){
      //console.log('SummaryCol: [%s] costo:[%s] 1:[%s] 2:[%s] 3:[%s] 4:[%s]',model.get('slug'), model.get('costo_total'),model.get('trim')[0],model.get('trim')[1],model.get('trim')[2],model.get('trim')[2])
    })

  };

  var insertTokenInSummaryCol = function(token, costo, col){
    //console.log('Inserting token:[%s] [%s] [%s]col:[%s]',token.slug, costo.slug, costo.importe, col.length)
    var matching = col.findWhere(token);
    if(matching){
      acumCosto(matching, costo);

    }else{
      col.add(createNewToken(token, costo));

    }
    //console.log('insertTocken[%s]',col.length);
  };

  var createNewToken = function(token, costo){
    var smodel = new Entities.SummaryModel(token);
    //console.dir(token)
    //console.log('New Token: orig:[%s] tram:[%s] ani:[%s] slug:[%s] ', token.origenpresu, token.tramita, token.anio, token.slug);

    smodel.set('trim', [0,0,0,0]);
    smodel.set('costo_total', 0);
    acumCosto(smodel,costo);
    return smodel;
  };

  var acumCosto = function(model, costo){
    var importe = parseInt(costo.importe), 
        costoacum = (model.get('costo_total') + importe),
        trimIndex = parseInt(costo.trimestre) - 1;

    if(trimIndex == NaN) trimIndex = 0;
    if(trimIndex>3 || trimIndex<0) trimIndex = 0;

    var trimArray = model.get('trim');
    model.set('costo_total', costoacum);
    trimArray[trimIndex] += importe;
    //console.log('AcumCosto: [%s]  importe:[%s] acumtrim:[%s] trim:[%s]:[%s]  ', model.get('slug'),           importe,   trimArray[trimIndex],costo.trimestre, trimIndex);
 
  };

  var scanCollection = function(col){
    var newdata = {};
    // revisión de datos importados. esta función es auxiliar
    col.each(function(model){



      if(model.get('parent_action')['cnumber'] !== $.trim(model.get('parent_action')['cnumber'])){
        console.log('cnumber')
        newdata.cnumber = $.trim(model.get('parent_action')['cnumber']);
      }
      if(model.get('parent_action')['slug'] !== $.trim(model.get('parent_action')['slug'])){
        console.log('slug')
        newdata.slug = $.trim(model.get('parent_action')['slug']);
      }
      if(model.get('parent_action')['tregistro'] !== $.trim(model.get('parent_action')['tregistro'])){
        console.log('tregistro')
        newdata.tregistro = $.trim(model.get('parent_action')['tregistro']);
      }
      if(model.get('parent_action')['taccion'] !== $.trim(model.get('parent_action')['taccion'])){
        console.log('taccion')
        newdata.taccion = $.trim(model.get('parent_action')['taccion']);
      }
      if(model.get('parent_action')['tipomov'] !== $.trim(model.get('parent_action')['tipomov'])){
        console.log('tipomov')
        newdata.tipomov = $.trim(model.get('parent_action')['tipomov']);
      }
      if(model.get('parent_action')['estado_alta'] !== $.trim(model.get('parent_action')['estado_alta'])){
        console.log('estado_alta')
        newdata.estado_alta = $.trim(model.get('parent_action')['estado_alta']);
      }
      if(model.get('parent_action')['nivel_ejecucion'] !== $.trim(model.get('parent_action')['nivel_ejecucion'])){
        console.log('nivel_ejecucion')
        newdata.nivel_ejecucion = $.trim(model.get('parent_action')['nivel_ejecucion']);
      }
      if(model.get('parent_action')['nivel_importancia'] !== $.trim(model.get('parent_action')['nivel_importancia'])){
        console.log('nivel_importancia')
        newdata.nivel_importancia = $.trim(model.get('parent_action')['nivel_importancia']);
      }
      if(model.get('parent_action')['nodo'] !== $.trim(model.get('parent_action')['nodo'])){
        console.log('nodo')
        newdata.nodo = $.trim(model.get('parent_action')['nodo']);
      }
      if(model.get('parent_action')['area'] !== $.trim(model.get('parent_action')['area'])){
        console.log('area')
        newdata.area = $.trim(model.get('parent_action')['area']);
      }

    });
    

  };

  var filterActionBudgetCol = function(dbaseCol, queryModel){
      var query = buildQuery(queryModel);
      var filteredActions = queryFactory(dbaseCol);
      if(query){
        filteredActions.filter(query);
      }
      return filteredActions
  };

  var buildQuery = function(queryModel){
    var query = {};
    if(queryModel.get('areaopt')){
      if(queryModel.get('area') && queryModel.get('area')!== 'no_definido' ){
        query.area = queryModel.get('area');
      }
    }
    if(queryModel.get('nodoopt')){
      if(queryModel.get('nodo') && queryModel.get('nodo')!== 'no_definido' ){
        query.nodo = queryModel.get('nodo');
      }
    }
    if(queryModel.get('tregistroopt')){
      if(queryModel.get('tregistro') && queryModel.get('tregistro')!== 'no_definido' ){
        query.tregistro = queryModel.get('tregistro');
      }
    }
    if(queryModel.get('taccionopt')){
      if(queryModel.get('taccion') && queryModel.get('taccion')!== 'no_definido' ){
        query.taccion = queryModel.get('taccion');
      }
    }
    if(queryModel.get('lineaaccion')){
      if(queryModel.get('lineaaccion') && queryModel.get('lineaaccion')!== 'no_definido' ){
        query.lineaaccion = queryModel.get('lineaaccion');
      }
    }
    if(queryModel.get('tgastoopt')){
      if(queryModel.get('tgasto') && queryModel.get('tgasto')!== 'no_definido' ){
        query.tgasto = queryModel.get('tgasto');
      }
    }
    //console.dir(query)
    return query;
  };
    
  var colorArray = [
      {"color": "#2484c1"},
      {"color": "#0c6197"},
      {"color": "#4daa4b"},
      {"color": "#90c469"},
      {"color": "#daca61"},
      {"color": "#e4a14b"},
      {"color": "#e98125"},
      {"color": "#cb2121"},
      {"color": "#830909"},
      {"color": "#923e99"},
      {"color": "#ae83d5"},
      {"color": "#bf273e"},
      {"color": "#ce2aeb"},
      {"color": "#bca44a"},
      {"color": "#618d1b"},
      {"color": "#1ee67b"},
      {"color": "#b0ec44"},
      {"color": "#a4a0c9"},
      {"color": "#322849"},
      {"color": "#86f71a"},
      {"color": "#d1c87f"},
      {"color": "#7d9058"},
      {"color": "#44b9b0"},
      {"color": "#7c37c0"},
      {"color": "#cc9fb1"},
      {"color": "#e65414"},
      {"color": "#8b6834"},
      {"color": "#248838"},
  ];// total 28 variantes.

  var buildOptForD3 = function(model){
    var opt = {};
    var headerTpl = _.template('Distribución por <%= vista %>');
    var textTpl = _.template('Distribución porcentual al <%= fecha %>');
    opt.header = {
      title: headerTpl({vista: model.get('vista_actual')}),
      text: textTpl({fecha: utils.dateToStr(new Date())})
    }

    return opt;
  };

  var d3PieRedraw = function( d3pie, opt, data, selector){
    d3pie.header.title.text = opt.header.title;
    d3pie.header.subtitle.text = opt.header.text;
    d3pie.data.content = data;
    console.log('pie REDRAW!!!')
    d3pie.redraw();
  }


  var d3PieFactoryView = function(opt, data, selector){
      var pie = new d3pie(selector, {
        "header": {
          "title": {
            "text": opt.header.title, //"Lots of Programming Languages",
            "fontSize": 24,
            "font": "open sans"
          },
          "subtitle": {
            "text": opt.header.text, //"A full pie chart to show off label collision detection and resolution.",
            "color": "#999999",
            "fontSize": 12,
            "font": "open sans"
          },
          "titleSubtitlePadding": 9
        },
        "footer": {
          "color": "#999999",
          "fontSize": 10,
          "font": "open sans",
          "location": "bottom-left"
        },
        "size": {
          "canvasWidth": 590
        },
        "data": {
          "sortOrder": "value-desc",
          "content": data,
        },
        "labels": {
          "outer": {
            "pieDistance": 32
          },
          "inner": {
            "hideWhenLessThanPercentage": 3
          },
          "mainLabel": {
            "fontSize": 11
          },
          "percentage": {
            "color": "#ffffff",
            "decimalPlaces": 0
          },
          "value": {
            "color": "#adadad",
            "fontSize": 11
          },
          "lines": {
            "enabled": true
          }
        },
        "effects": {
          "pullOutSegmentOnClick": {
            "effect": "linear",
            "speed": 400,
            "size": 8
          }
        },
        "misc": {
          "gradient": {
            "enabled": true,
            "percentage": 100
          }
        }
      });
      return pie;

  };


  var queryFactory = function (actions){
    var fd = DocManager.Entities.FilteredCollection({
        collection: actions,

        filterFunction: function(query){
          return function(action){
            var test = true;
            //if((query.taccion.trim().indexOf(action.get('taccion'))) === -1 ) test = false;
            //console.log('filterfunction:TEST: [%s] [%s] [%s] [%s]',test, query.taccion,action.get("taccion"),action.get("cnumber"));
            if(query.area && query.area !=='no_definido') {
              if(query.area.trim() !== action.get('parent_action')['area']) test = false;
            }

            if(query.nodo && query.nodo !=='no_definido') {
              if(query.nodo.trim() !== utils.fetchNode(utils.actionAreasOptionList, action.get('parent_action')['area'])) test = false;
            }

            if(query.tregistro && query.tregistro !=='no_definido') {
              if(query.tregistro.trim() !== action.get('tregistro')) test = false;
            }

            if(query.taccion && query.taccion!=='no_definido') {
              if(query.taccion.trim() !== action.get('parent_action')['taccion']) test = false;
            }

            if(query.tgasto && query.tgasto!=='no_definido') {
              if(query.tgasto.trim() !== action.get('tgasto')) test = false;
            }


            if(query.ejecucion && query.ejecucion!=='no_definido') {
              if(query.ejecucion.trim() !== action.get('nivel_ejecucion')) test = false;
            }
            //if(query.fedesde.getTime()>action.get('fealta')) test = false;
            //if(query.fehasta.getTime()<action.get('fealta')) test = false;

            if(query.slug){
              if(utils.fstr(action.get("slug").toLowerCase()).indexOf(utils.fstr(query.slug)) === -1 && 
                            action.get("cnumber").toLowerCase().indexOf(query.slug.toLowerCase()) === -1) 
                            test = false;
            }

            if(test) return action;
          }
        }
    });
    return fd;
  };

/*  var timeDelay1 = function(array){
    setTimeout(function(){
      console.log("BudgetPlanner: Execution for processFile[%s] ", array.length);
    }, 1500);
  };

*/
  

  var API = {
    loadRecords: function(query, opt, cb){
      DocManager.request('action:fetch:actionbudget:col',query, opt, function(budgetArray){
        //console.log('BINGO: [%s]',budgetArray.length);
        cb(budgetArray);

      });

    },


    getEntities: function(){
      var accions = new Entities.ActionCollection();
      var defer = $.Deferred();
      accions.fetch({
        success: function(data){
          defer.resolve(data);
        }
      });
      var promise = defer.promise();
      return promise;
    },

    getFilteredCol: function(criteria, cb){
      var fetchingActions = API.getEntities();

      $.when(fetchingActions).done(function(actions){
        var filteredActions = filterFactory(actions);
        console.log('getQuery')
        if(criteria){
          filteredActions.filter(criteria);
        }
        if(cb) cb(filteredActions);
      });
    },

    getFilteredByQueryCol: function(query, cb){
      var fetchingActions = queryCollection(query);

      $.when(fetchingActions).done(function(actions){
          console.log('getFiltered PROMISE OK');

        //var docitems = fetchActionItemlist(actions);
        //var filteredActions = queryFactory(actions);

        var filteredActions = queryFactory(actions);
        if(query){
          filteredActions.filter(query);
        }
        //fetchProductDuration(filteredActions,function(){
        //  if(cb) cb(filteredActions);
        //})
        if(cb) cb(filteredActions);
      });
    },

    getEntity: function(entityId){
      var accion = new Entities.Action({_id: entityId});
      var defer = $.Deferred();
      if(entityId){
        accion.fetch({
          success: function(data){
            defer.resolve(data);
          },
          error: function(data){
            defer.resolve(undefined);
          }
       });
      }else{
        defer.resolve(accion);
      }
      return defer.promise();
    },

    fetchNextPrev: function(type, model, cb){
      var query = {};
      if(type === 'fetchnext') query.cnumber = { $gt : model.get('cnumber')}
      if(type === 'fetchprev') query.cnumber = { $lt : model.get('cnumber')}

      var accions= new Entities.ActionsFindOne();
      accions.fetch({
          data: query,
          type: 'post',
          success: function() {
              if(cb) cb(accions.at(0));
          }
      });
    },
    fetchBudget: function(model, opt, cb){
      var query = {};
      query.owner_id = model.id;

      var budgetCol = new Entities.BudgetNavCollection();
      budgetCol.fetch({
          data: query,
          type: 'post',
          success: function() {
              if(cb) cb(budgetCol);
          }
      });

    },
    determinActionCost: function(col){
      var costo = 0;
      if (!col.length) return costo;
      col.each(function(model){
        costo += parseInt(model.get('importe'));
      });
      return costo;
    },

  };


  DocManager.reqres.setHandler("budgetplanner:load:records", function(query, opt, cb){
    API.loadRecords(query, opt, cb);
  });


});
