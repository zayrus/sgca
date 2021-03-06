StudioManager.module("Entities", function(Entities, StudioManager, Backbone, Marionette, $, _){

  var realization =       ['directores', 'productores', 'coproductores', 'realizadores', 'guionistas', 'reparto', 'conduccion', 'fotografia', 'camaras', 'edicion', 'animacion', 'sonido', 'musicos', 'escenografia', 'vocesoff' ];
  var realizationTitles = ['Director',    'Productor', 'Coproductor',    'Realizador',   'Guionistas', 'Actores', 'Conducción', 'Director de fotografía', 'Cámaras', 'Edición', 'Animación', 'Sonido', 'Música original', 'Arte', 'Voces off relator locutor' ];

  var clasification = ['vocesautorizadas', 'descripcion' ];
  var clasificationTitles = ['Voces autorizadas', 'Sinopsis' ];


  Entities.Product = Backbone.Model.extend({

    whoami: 'Product:models.js ',
    urlRoot: "/productos",

    idAttribute: "_id",

    defaults: {
        _id: null,
        tipoproducto:"",
        productcode:"",
 
        slug: "",
        denom: "",

        nivel_importancia: "medio",
        estado_alta: "activo",
        nivel_ejecucion: "planificado",

        project:{},
        patechfacet:{},
        clasification:{},

        notas:[],
        branding:[],
        descripTagList:[],
        contentTagList:[],
    },

    loadchilds: function(ancestor, predicates, cb){
        var self = this,
            querydata = [],
            products= new Entities.ProductChildCollection(),
            query = {};

        console.log('loadchilds:models.js BEGINS [%s] : [%s]',ancestor.get('productcode'),predicates);
        if(!_.isArray(predicates))
            if(_.isObject(predicates)) querydata.push(predicates);
            else return null;
        else querydata = predicates;

        query = {$or: querydata };

        products.fetch({
            data: query,
            type: 'post',
            success: function() {
                if(cb) cb(products);
            }
        });
    },

    loaddocuments:function (cb) {
        var self = this;
        //console.log('loadpacapitulos:models.js begins es_capitulo_de: [%s]',self.get('productcode'));
        //var query = {$or: [{'es_capitulo_de.id':self.id},{'es_instancia_de.id':self.id}, {'es_coleccion_de.id':self.id}]};
        //var query = {cnumber: 'T100006'};
        //var query = {'items.productid': '5252a139a8907e8901000003'};
        var query = {$or: [{'items.items.productid': self.id}, {'items.productid': self.id}]};

        var documCol= new StudioManager.Entities.DocumentCollection();
        //console.log('loadpacapitulos:models.js query  [%s] ',query['es_capitulo_de.id']);

        documCol.fetch({
            data: query,
            type: 'post',
            success: function() {
                if(cb) cb(documCol);
            }
        });
    },

    getFacet: function(token){
      var self = this;
      var facet ;

      if(realization.indexOf(token)!= -1){
        if(!self.get('realization')){
          self.set('realization',{});
        }
        facet = new Entities.ProductTextFacet(
            { key:'realization',
              datafield: self.get('realization')[token],
              datatitle: realizationTitles[realization.indexOf(token)],
              name: token
            }
        );
      }

      if(clasification.indexOf(token)!= -1){
        if(!self.get('clasification')){
          self.set('clasification',{});
        }
        facet = new Entities.ProductTextFacet(
            { key:'clasification',
              datafield: self.get('clasification')[token],
              datatitle: clasificationTitles[clasification.indexOf(token)],
              name: token
            }
        );
      }// endif
      
      if(token === 'paisprov'){
        if(!self.get('realization')){
          self.set('realization',{});
        }
        facet = new Entities.ProductPaisFacet(
            { key: 'realization',
              paisprod: self.get('realization')['paisprod'],
              provinciaprod: self.get('realization')['provinciaprod'],
              datatitle: 'País/ Prov productora',
              name: token
            }
        );
      }

      if(token === 'contenido'){
        if(!self.get('clasification')){
          self.set('clasification',{});
        }
        facet = new Entities.ProductContenidoFacet(
            { key: 'clasification',
              cetiquetas: self.get('clasification')['cetiquetas'],
              formato: self.get('clasification')['formato'],
              etario: self.get('clasification')['etario'],
              descriptores: self.get('clasification')['descriptores'],
              datatitle: 'Contenido',
              name: token
            }
        );
      }// endif

      if(token === 'editestados'){
/*
        if(!self.get('pendientes')){
          self.initPendientes();
        }

*/        
        facet = new Entities.ProductStateFacet({
              key: 'estado',
              estado_alta: self.get('estado_alta'),
              nivel_ejecucion: self.get('nivel_ejecucion'),
              nivel_importancia: self.get('nivel_importancia'),
              pendientes: self.get('pendientes'),
              datatitle: 'Estados',
              name: token
        });
        facet.initPendientes();

      }

      if(token === 'curaduria'){
        if(!self.get('curaduria')){
          self.set('curaduria',{});
        }
        facet = new Entities.ProductCuraduriaFacet(
            { key: 'curaduria',
              visualizador: self.get('curaduria')['visualizador'],
              calificacion: self.get('curaduria')['calificacion'],
              aprobado: self.get('curaduria')['aprobado'],
              observaciones: self.get('curaduria')['observaciones'],
              datatitle: 'Curaduría',
              name: token
            }
        );
      }// endif

      if(token === 'slug'){
        facet = new Entities.ProductTextFacet(
            { key:'slug',
              datafield: self.get('slug'),
              datatitle: 'Denominación',
              name: token
            }
        );
      }// endif

      if(token === 'produccion'){
        if(!self.get('patechfacet')){
          self.set('patechfacet',{});
        }
        facet = new Entities.ProductTechFacet(
            { key: 'patechfacet',
              durnominal: self.get('patechfacet')['durnominal'],
              cantbloques: self.get('patechfacet')['cantbloques'],
              fecreacion: self.get('patechfacet')['fecreacion'],
              temporada: self.get('patechfacet')['temporada'],
              productora: self.get('patechfacet')['productora'],
              lugares:    self.get('patechfacet')['lugares'],
              locaciones: self.get('patechfacet')['locaciones'],
              datatitle: 'Producción',
              name: token
            }
        );
      }// endif

      return facet;
    },

    setFacet: function(token, facet){
      var self = this;
      var query = {};
      var list = [];

      var key = facet.get('key');
      var data = self.get(key) || {};

      list.push(self.id );
      query.nodes = list;
      query.newdata = {};

      if(token==='paisprov'){
        data['paisprod'] = facet.get('paisprod');
        data['provinciaprod'] = facet.get('provinciaprod');

        query.newdata[key] = data;

      }else if(token ==='contenido'){
        var ndata = facet.retrieveData();
        data['cetiquetas'] = ndata['cetiquetas'];
        data['formato'] = ndata['formato'];
        data['etario'] = ndata['etario'];
        data['descriptores'] = ndata['descriptores'];

        query.newdata[key] = data;
        query.newdata['descripTagList'] = facet.getDescripTagList();
        query.newdata['contentTagList'] = facet.getContentTagList();


      }else if(token ==='editestados'){
        query.newdata['estado_alta'] = facet.get('estado_alta');
        query.newdata['nivel_ejecucion'] = facet.get('nivel_ejecucion');
        query.newdata['nivel_importancia'] = facet.get('nivel_importancia');
        query.newdata.pendientes = facet.get('pendientes');
        //console.log('SAVING editestados [%s] [%s]', query.newdata.pendientes.qcalidad.cumplido,query.newdata.pendientes.qcalidad.cumplido===true);

      }else if(token ==='curaduria'){
        var ndata = facet.retrieveData();
        data['visualizador'] = ndata['visualizador'];
        data['calificacion'] = ndata['calificacion'];
        data['aprobado'] = ndata['aprobado'];
        data['observaciones'] = ndata['observaciones'];

        query.newdata[key] = data;

      }else if(token ==='slug'){
        query.newdata.slug  = facet.get('datafield');
        query.newdata.denom = facet.get('datafield');

      }else if(token ==='produccion'){
        var ndata = facet.retrieveData();
        data['durnominal'] = ndata['durnominal'];
        data['cantbloques'] = ndata['cantbloques'];
        data['fecreacion'] = ndata['fecreacion'];
        data['temporada'] = ndata['temporada'];
        data['productora'] = ndata['productora'];
        data['lugares'] = ndata['lugares'];
        data['locaciones'] = ndata['locaciones'];

        query.newdata[key] = data;

      }else{
        data[facet.get('name')] = facet.get('datafield');

        query.newdata[key] = data;
      }

      
 
      console.log('UPDATE: [%s] [%s]', key, token)
      var update = new Entities.ProductUpdate(query);
      update.save({
        success: function() {
        }
      });
      //log ACTIVITY
      logActivity(token, self, data);
      //

    },

    validate: function(attrs, options) {
      var errors = {}
      if (! attrs.productcode) {
        errors.productcode = "no puede quedar en blanco";
      }
      if (! attrs.slug) {
        errors.slug = "no puede quedar en blanco";
      }
      else{
        if (attrs.denom.length < 2) {
          errors.denom = "demasiado corto";
        }
      }
      if( ! _.isEmpty(errors)){
        return errors;
      }
    }
  });

  Entities.ProductUpdate = Backbone.Model.extend({
    whoami: 'Entities.ProductUpdate:product.js ',

    urlRoot: "/actualizar/productos",

  });


  //Entities.configureStorage(Entities.Product);

  Entities.ProductCollection = Backbone.Collection.extend({

    model: Entities.Product,

    url: "/productos",

    comparator: "productcode"
  });

  Entities.ProductChildCollection = Backbone.Collection.extend({

    model: Entities.Product,

    url: "/navegar/productos",

    comparator: "productcode",
  });

  Entities.AssetVideoUrl = Backbone.Model.extend({
    whoami: 'AssetVideoUrl:product.js ',
    urlRoot: "/asset/render/video",

    idAttribute: "_id",
    
  });

  Entities.ProductStateFacet = Backbone.Model.extend({
      whoami:'ProductTechFacet:product.js',
      
      retrieveData: function(){
          return dao.extractData(this.attributes);
      },

      process: function(target){
        if(target.type==='checkbox'){
          console.log('PROCESS:product ProductStateFacet [%s] [%s] [%s]o[%s]', target.name, target.checked, (target.checked===false), (target.checked===true));
          this.get('pendientes')[target.name].cumplido = target.checked;
        }

      },

      togglePendings: function(target){
        var newstate = this.changeState(this.get('pendientes')[target.name].prioridad);
        this.get('pendientes')[target.name].prioridad = newstate;

      },

      getButtonType: function(key){
        return utils.getUrgenciaButtonType(this.get('pendientes')[key].cumplido, this.get('pendientes')[key].prioridad,this.get('pendientes')[key].estado );
      },

      changeState: function(state){
        var ind = utils.urgenciaList.indexOf(state)+1;
        return utils.urgenciaList[((ind < utils.urgenciaList.length) ? ind : 0)];
      },


      //class="btn <%= utils.urgenciaButtonType[value.prioridad] %>"
      //class="btn-group" data-toggle="buttons"
      validate: function(attrs, options) {
        var errors = {}
/*
        if (! attrs.productcode) {
          errors.productcode = "no puede quedar en blanco";
        }
        if (! attrs.slug) {
          errors.slug = "no puede quedar en blanco";
        }
        else{
          if (attrs.denom.length < 2) {
            errors.denom = "demasiado corto";
          }
        }
        
        if( ! _.isEmpty(errors)){
          return errors;
        }*/
      },
      initPendientes: function(){
        //this.set('pendientes', null) ;
        this.setPendingsFromExecutionState();
    
      },

      setPendingsFromExecutionState: function(){
        var nejecucion = this.get('nivel_ejecucion');
        var pendientes = this.get('pendientes');
        console.log('Nivel de ejecucion: [%s]',nejecucion);

        //validacion-1
        if(!pendientes){
          pendientes = {};
          _.each(utils.papendingsOptionList,function(token){
            pendientes[token.val] = {
                    cumplido: false,
                    prioridad: 'media',
                    estado:'noaplica'
            };
          });
        }
        //validacion-2
        if(true){
          _.each(utils.papendingsOptionList,function(token){
            if(!pendientes[token.val]){
              pendientes[token.val] = {
                      cumplido: false,
                      prioridad: 'media',
                      estado:'noaplica'
              };
            }
            if(!pendientes[token.val].cumplido) pendientes[token.val].cumplido = false;
            if(!pendientes[token.val].prioridad) pendientes[token.val].prioridad = 'media';
            if(!pendientes[token.val].estado) pendientes[token.val].estado = 'noaplica';
          });
        }


        var cumplido = true;
        //console.log('iterando en paexecutionOptionList')
        _.each(utils.paexecutionOptionList, function(action){
           //console.log('PRocessing paexecutionOptionList [%s]', action.pending);
           if(!(action.pending === 'no_definido')){
              //console.log('PRocessing paexecutionOptionList [%s]', action.pending);
   
              var pendiente = pendientes[action.pending];
              if(cumplido){
                pendiente.cumplido = true;
                pendiente.estado = action.result;
              }

            }
            // de acá en más no está cumplida la siguiente etapa
            if(action.val === nejecucion) cumplido = false;
        });

        if(nejecucion !== 'no_definido'){
          this.revisePendingList(pendientes);
        }
        this.set('pendientes', pendientes);
      },

      revisePendingList: function(pendientes){
        _.each(utils.pendingsDependsOn, function(lista, key){
          //console.log('revisePendingList: key[%s] lista:[%s]', key, lista)
          var pendiente = pendientes[key];

          //console.log('Revs PendingList: key:[%s]  cumplido:[%s]', key, pendiente.cumplido);
          if(!pendiente.cumplido){
            var required = _.every(lista, function(el){
              return pendientes[el].cumplido;
            });
            //console.log('Revis PendingList Key: [%s] required:[%s]', key, required);

            if(required){
              pendiente.estado = 'pendiente';

            }else{
              pendiente.estado = 'noaplica';
            }
          }
        });
      },


      defaults: {
          estado_alta:'',
          nivel_ejecucion: '',
          nivel_importancia: '',
          pendientes:{},
          name:"",
          key:"",
      }
  });

  Entities.ProductPaisFacet = Backbone.Model.extend({
    //urlRoot: "/comprobantes",
    whoami: 'ProductPaisFacet:product.js ',

    initialize: function () {
        if(this.get('paisprod')){
            if(this.get('paisprod')==='Argentina'){
                this.schema.provinciaprod.options = utils.provinciasOptionList['Argentina'];
            }else{
                this.schema.provinciaprod.options = utils.provinciasOptionList['nodefinido'];
            }

        }
    },

    schema: {
        paisprod: {type: 'Select',options: utils.paisesOptionList, title: 'País' },
        provinciaprod: {type: 'Select',options: utils.provinciasOptionList['nodefinido'], title: 'Provincia' },
    },
    //idAttribute: "_id",

    defaults: {
      paisprod: "",
      provinciaprod:"",
      name:"",
      key:"",
      datatitle:"",

    },

  });
  
  Entities.ProductContenidoFacet = Backbone.Model.extend({
    // ******************* BROWSE PRODUCTS ***************
    whoami:'ProuctContenidoFacet:product.js',

    retrieveData: function(){
        var data = {};
        data.cetiquetas = this.get('cetiquetas');
        data.formato = this.get('formato');
        data.etario = this.get('etario');
        data.descriptores = this.get('descriptores');
        return data;
    },
    initialize: function(){
      this.set('etqs', this.buildTagList(this.get('cetiquetas'),"|"));
    },

    schema: {
        contenido:{
            type:'Object', title:'Selector',
            template: _.template('\
                <div class="form-group field-<%= key %>">\
                  <label class="control-label" for="<%= editorId %>"><%= title %></label>\
                  <div class="input-group input-block-level">\
                    <span  class="input-block-level" data-editor></span>\
                    <div><button class="btn btn-link js-addcontenido">agregar</button></div>\
                    <div class="help-inline" data-error></div>\
                    <div class="help-block"><%= help %></div>\
                  </div>\
                </div>\
                '),
            subSchema:{
                genero:      {type: 'Select',options: utils.generoOptionList, title: 'Género'},
                tematica:    {type: 'Select',options: utils.tematicasOptionList , title:'Temática'},
                subtematica: {type: 'Select',options: utils.subtematicasOptionList.artecultura, title:'SubTemática'},
        }},
        cetiquetas:   {type: 'Text',title:'Contenido:'},
        formato:      {type: 'Select',options: utils.formatoOptionList, title: 'Formato'},
        etario:       {type: 'Select',options: utils.etarioOptionList, title:'Tipo de audiencia'},
        descriptores:  {type: 'TextArea',editorAttrs:{placeholder:'palabras claves separadas por ;'},title:'Palabras claves:'},
    },

    addEtiquetas: function(){
        var self = this;
        var test=false;
        if(self.get('contenido').genero){
            if(self.get('contenido').genero !== 'nodefinido'){
                test=_.find(self.get('etqs'),function(el) {return el===self.get('contenido').genero;});
                if(!test) self.get('etqs').push(self.get('contenido').genero);
           }
        }
        if(self.get('contenido').tematica){
            if(self.get('contenido').tematica !== 'nodefinido'){
                test=_.find(self.get('etqs'),function(el) {return el===self.get('contenido').tematica;});
                if(!test) self.get('etqs').push(self.get('contenido').tematica);
            }
        }
        if(self.get('contenido').subtematica){
            if(self.get('contenido').subtematica !== 'nodefinido'){
                test=_.find(self.get('etqs'),function(el) {return el===self.get('contenido').subtematica;});
                if(!test) self.get('etqs').push(self.get('contenido').subtematica);
            }
        }
        self.buildContentLabel();
    },
    setTagList: function(){
      this.set('etqs', this.buildTagList(this.get('cetiquetas'),"|"));
      this.buildContentLabel();
    },

    getContentTagList: function(){
      return this.get('etqs');
    },

    getDescripTagList: function(){
      return this.buildDescripTagList();
    },

    buildTagList: function(stringData, separator){
        var list = [];
        if(stringData){
            list = _.filter(_.map(stringData.split(separator),function(str){return $.trim(str)}),function(str){return str});
        }
        return list;
    },

    buildDescripTagList: function(){
      var tags = [],
          separator = ';',
          descr = this.get('descriptores');
      if(descr.indexOf('|') !== -1) separator = '|';

      tags = this.buildTagList(descr, separator);

      //console.log('buildDescripTagList: [%s] [%s] [%s]', descr, separator, tags);
      this.set('descriptores', tags.join(separator));
      return tags;
    },

    buildContentLabel: function(){
        var self = this;
        var labels = self.get('etqs').join(' | ');
        self.set({cetiquetas: labels});
    },

    defaults: {
        contenido:{
            genero:'',
            tematica:'',
            subtematica:''
        },
        cetiquetas:'',
        formato:'',
        etario:'',
        etqs: [],
        name:"",
        key:"",
        datatitle:"",
    }
  });

  Entities.ProductCuraduriaFacet = Backbone.Model.extend({
      // ******************* BROWSE PRODUCTS ***************
      whoami:'curaduriafacet',

      retrieveData: function(){
          var data = {};
          data.visualizador = this.get('visualizador');
          data.calificacion = this.get('calificacion');
          data.aprobado = this.get('aprobado');
          data.observaciones = this.get('observaciones');
          return data;
      },

      schema: {
          visualizador:  {type: 'Text', editorAttrs:{placeholder : 'visualizador'}, title: 'Visualizador' },
          calificacion:  {type: 'Select', options: ['regular','bueno','muy bueno','excelente'] , title:'Calificación'},
          aprobado:      {type: 'Select', options: ['SI','NO'] , title:'Aprobado'},
          observaciones: {type: 'TextArea', editorAttrs:{placeholder : 'observaciones'},title: 'Observaciones'},
      },

      defaults: {
          visualizador: '',
          calificacion: 'bueno',
          aprobado: 'NO',
          observaciones: '',
          name:"",
          key:"",
          datatitle:"",
      }
  });


  Entities.ProductTechFacet = Backbone.Model.extend({
      // ******************* BROWSE PRODUCTS ***************
      whoami:'ProductTechFacet:product.js',
      retrieveData: function(){
          return dao.extractData(this.attributes);
      },

      schema: {
          durnominal: {type: 'Text', title: 'Duración nominal', editorAttrs:{placeholder : 'duracion mm:ss'}},
          cantbloques: {type: 'Number', title: 'Cantidad bloques'},
          fecreacion: {type: 'Text', title: 'Año de producción'},
          temporada: {type: 'Number', title: 'Temporada Nro'},
          productora: {type: 'Text', title: 'Casa productora',editorAttrs:{placeholder:'casa productora'}},
          lugares: {type: 'Text',editorAttrs:{placeholder : 'lugares'}, title: 'Lugar rodaje' },
          locaciones: {type: 'Text',editorAttrs:{placeholder : 'locaciones'} },
      },

      defaults: {
          durnominal:'',
          cantbloques:1,
          fecreacion:'',
          temporada:'',
          productora:'',
          lugares:'',
          locaciones:'',
      }
  });

  Entities.ProductTextFacet = Backbone.Model.extend({
    //urlRoot: "/comprobantes",
    whoami: 'ProductTextFacet:product.js ',

    schema: {
        datafield:  {type: 'TextArea', title: ''},
    },
    //idAttribute: "_id",

    defaults: {
      datafield: "",
      name:"",
      key:"",
      datatitle:"",

    },

  });

  var logActivity = function(result, product, data){

    var activity = new StudioManager.Entities.Activity({
        eventname:'user:pdiario',
        data:{
            header:{
            },
            item:{
                tipoitem: 'pdiario',
                slug:'modificación de datos',
                tipomov: 'visualizacion',
                activity: 'catalogacion',

                entitytype: 'producto',
                entity: product.get('productcode'),
                entitiyid: product.id,
                
                docum: 'NONE',
                documid: null,
                documslug: null,
                
                result: result,
            },
        },
        query:{
            tipocomp: 'pdiario',
            tipomov: 'visualizacion',
            activity: 'catalogacion',
        }
    });
    activity.save();

  };


  var filterFactory = function (entities){
    var fd = StudioManager.Entities.FilteredCollection({
        collection: entities,

        filterFunction: function(filterCriterion){
          var criteria = utils.fstr(filterCriterion.toLowerCase());
          return function(document){
            //console.log('filterfunction:[%s]vs [%s]/[%s]/[%s]',criteria,document.get("tipocomp"),document.get("cnumber"),document.get("slug"));
            if(document.get("productcode").toLowerCase().indexOf(criteria) !== -1
              || document.get("denom").toLowerCase().indexOf(criteria) !== -1
              || utils.fstr(document.get("slug").toLowerCase()).indexOf(criteria) !== -1){
              
              return document;
            }
          }
        }
    });
    return fd;
  };

  var API = {
    getEntities: function(){
      var entities = new Entities.ProductCollection();
      var defer = $.Deferred();

      entities.fetch({
        success: function(data){
          defer.resolve(data);
        }
      });

      var promise = defer.promise();
      return promise;
    },

    getFilteredCol: function(criteria, cb){
      //console.log('getFilteredCol: 1');
      var fetchingEntities = API.getEntities();
      //console.log('getFilteredCol: 2');

      $.when(fetchingEntities).done(function(entities){
        //console.log('getFilteredCol: 3');
        var filteredEntities = filterFactory(entities);
        console.log('getFilteredCol: [%s]',criteria);
        if(criteria){
            filteredEntities.filter(criteria);
        }
        if(cb) cb(filteredEntities);
      });
    },

    getEntity: function(entityId){
      var entity = new Entities.Product({_id: entityId});
      var defer = $.Deferred();

      entity.fetch({
        success: function(data){
          defer.resolve(data);
        },
        error: function(data){
          defer.resolve(undefined);
        }
      });
      return defer.promise();
    }

  };

  StudioManager.reqres.setHandler("product:entities", function(){
    return API.getEntities();
  });

  StudioManager.reqres.setHandler("product:entity", function(id){
    return API.getEntity(id);
  });

  StudioManager.reqres.setHandler("product:filtered:entities", function(criteria, cb){
    return API.getFilteredCol(criteria,cb);
  });

});

