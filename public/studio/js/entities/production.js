StudioManager.module("Entities", function(Entities, StudioManager, Backbone, Marionette, $, _){

  var realization =       ['directores', 'productores', 'coproductores', 'realizadores', 'guionistas', 'reparto', 'conduccion', 'fotografia', 'camaras', 'edicion', 'animacion', 'sonido', 'musicos', 'escenografia', 'vocesoff' ];
  var realizationTitles = ['Director',    'Productor', 'Coproductor',    'Realizador',   'Guionistas', 'Actores', 'Conducción', 'Director de fotografía', 'Cámaras', 'Edición', 'Animación', 'Sonido', 'Música original', 'Arte', 'Voces off relator locutor' ];

  var clasification = ['vocesautorizadas', 'descripcion' ];
  var clasificationTitles = ['Voces autorizadas', 'Sinopsis' ];

  Entities.ProductionToken = Backbone.Model.extend({

    whoami: 'ProductionToken:productions.js ',

    urlRoot: "/studio/producciones",

    idAttribute: "_id",

    initialize: function(){
      this.initAfterFetching();
    },

    initAfterFetching: function(){
      //console.log('ProductionToken:Initialize: [%s]',this.get('ea:productionId') )
      this.set('ea_productionId',this.get('ea:productionId') );
      this.set('ea_lastModified',this.get('ea:lastModified') );
      this.set('ea_lastModifiedOfAllSessions',this.get('ea:lastModifiedOfAllSessions') );
      this.set('productionName',this.get('properties').name );
      this.set('productionDescription',this.get('properties').description );
    },

    initBeforeCreate: function(){
      //console.log('initBeforeCreate');

    },

    defaults: {
        _id: null,
        'ea:productionId': "",
        'ea:lastModified': "",
        'ea:lastModifiedOfAllSessions': "",
        'ea_productionId': "",
        'ea_lastModified': "",
        'ea_lastModifiedOfAllSessions': "",
        'ea_comitId': "",
        'ea_tag': "",
        productionName: '',
        productionDescription: '',
        properties: {},
        links: [],
    },

  });

  Entities.Session = Backbone.Model.extend({
    whoami: 'Session:productions.js ',

    urlRoot: "/studio/producciones",

    idAttribute: "_id",

    initialize: function(){
      //this.initAfterFetching();
    },

    retrieve: function(production){
      var that = this;

      that.fetch({
        data: query,
        type: 'POST',
        success: function(data){
          defer.resolve(data);
        },
        error: function(data){
          defer.resolve(undefined);
        }
      });

    },
    create: function(production){
      var that = this;

      that.fetch({
        data: query,
        type: 'POST',
        success: function(data){
          defer.resolve(data);
        },
        error: function(data){
          defer.resolve(undefined);
        }
      });

    },

  });

  Entities.EaUser = Backbone.Model.extend({    
    initialize: function(){
      //console.log(' initialize');
      //this.initAfterFetching();
    },

    defaults: {
      _id: null,
      properties:{},
      links:[]
    }
  });

  Entities.EaUserCollection = Backbone.Collection.extend({

    model: Entities.EaUser,
    url: "/studio/entities",

  });


  Entities.Production = Backbone.Model.extend({

    whoami: 'Production:productions.js ',

    urlRoot: "/studio/producciones",

    idAttribute: "_id",

    initialize: function(){
      //console.log(' initialize');
    },

    initAfterFetching: function(cb){
      //console.log('Production:Initialize: [%s]',this.get('ea:commitId') )
      this.set('ea_productionId',this.get('ea:productionId') );
      this.set('ea_lastModified',this.get('ea:lastModified') );
      this.set('ea_commitId',this.get('ea:commitId') );
      this.set('ea_tag',this.get('ea:tag') );
      this.set('ea_lastModifiedOfAllSessions',this.get('ea:lastModifiedOfAllSessions') );

      this.set('productionName',this.get('properties').properties.name );
      this.set('ea_tag',this.get('properties')['ea:tag'] );
      this.set('productionDescription',this.get('properties').properties.description );
      this.fetchSessions(function(){
        if(cb) cb();
      });
    },

    initBeforeCreate: function(){
      //console.log('initBeforeCreate')

    },

    fetchUsers: function(cb){
      //console.log('fetchProductionUsers BEGIN');
      var that = this;

      var usersPromise = StudioManager.request("fetch:production:users", that);
     
      $.when(usersPromise).done(function(data){
        //console.log('fetchProductionAssets RETURN [%s]',data.get('users')[0].properties.firstname);
        that.set({access: data.attributes});
        cb(that);
      });
    },

    fetchSessions: function(cb){
      console.log('fetchSessions BEGIN');
      var that = this;

      dao.gestionUser.getUser(StudioManager, function (user){
        var sessionsPromise = StudioManager.request("fetch:production:sessions", that);
       
        $.when(sessionsPromise).done(function(data){
          //console.log('fetchProductionSessions RETURN [%s]',data.get('sessions')[0].properties.name);
          that.set({easessions: data.attributes});
          that.set({currentuser: user.get('displayName')});
          that.userSessionLookUp(user, data, function(){
            cb(that);
          })
        });
      });
    },
    
    userSessionLookUp: function(user, sessionCol, cb){
      var that = this;
      var sessList = sessionCol.get('sessions');
      var usersession = _.find(sessList, function(se){
        console.log('Finding UserSession [%s]vs[%s]',se['ea:owner'], user.get('displayName'));
        return (se['ea:owner'] === user.get('displayName'));
      });
      if(usersession){
        var sessionsPromise = StudioManager.request("fetch:user:session", usersession);
        $.when(sessionsPromise).done(function(data){
          console.log('fetchUsrSession RETURN [%s]',data.get('ea:sessionId'));
          that.set({currentsession: data.attributes, currentsessionId: data.get('ea:sessionId')});
          if(cb) cb();
        });
      }else{
        if(cb) cb();
      }
    },

    createSession: function(cb){
      var that = this;
      //var session = new Entities.Session(that);
      console.log('createSession');
      var currentsession = that.get('currentsession');
      if(currentsession){
        console.log('EXISTE una session Previa');
        cb(that);

      }else{
        console.log('NO EXISTE una session Previa');
        var usersPromise = StudioManager.request("create:production:sessions", that);
       
        $.when(usersPromise).done(function(data){
          console.log('fetchProductionAssets RETURN [%s]',data.get('ea:sessionId'), data.get('ea:owner'));
          that.set({currentsession: data.attributes, currentsessionId: data.get('ea:sessionId')});
         cb(that);
        });

      }

    },

    pushSession: function(cb){
      var that = this;
      //var session = new Entities.Session(that);
      console.log('createSession');
      var currentsession = that.get('currentsession');
      if(currentsession){
        console.log('EXISTE una session Previa');

        var usersPromise = StudioManager.request("push:production:session", currentsession);
       
        $.when(usersPromise).done(function(data){
          console.log('fetchProductionAssets RETURN [%s]',data.get('ea:sessionId'), data.get('ea:owner'));
          //that.set({currentsession: data.attributes, currentsessionId: data.get('ea:sessionId')});
         cb(that);
        });


      }else{

      }

    },


    update: function(cb){
      //console.log('Update/Productions');

      cb(null, this);

    },

    defaults: {
        _id: null,

        'ea:productionId': "",
        'ea:lastModified': "",
        'ea:lastModifiedOfAllSessions': "",
        'ea_productionId': "",
        'ea_lastModified': "",
        'ea_lastModifiedOfAllSessions': "",
        'ea_comitId': "",
        'ea_tag': "",
        productionName: '',
        productionDescription: '',
        currentsessionId:'',
        properties: {},
        links: [],

        tipoproduction:"",
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
        estado_alta: 'alta',
        nivel_ejecucion:'media',
    },

    loadchilds: function(ancestor, predicates, cb){
        var self = this,
            querydata = [],
            products= new Entities.ProductionChildCollection(),
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
      console.log('getFacet:[%s]',token);
      var self = this;
      var facet ;


      if(token === 'properties'){

        facet = new Entities.ProductionPropertiesFacet(
            { key:'properties',
              slug: self.get('properties').properties['name'],
              description: self.get('properties').properties['description'],
              datatitle: 'Properties',
              name: token
            }
        );
      }

      return facet;
    },

    getFacetOld: function(token){

      if(realization.indexOf(token)!= -1){
        if(!self.get('realization')){
          self.set('realization',{});
        }
        facet = new Entities.ProductionTextFacet(
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
        facet = new Entities.ProductionTextFacet(
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
        facet = new Entities.ProductionPaisFacet(
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
        facet = new Entities.ProductionContenidoFacet(
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
        facet = new Entities.ProductionStateFacet({
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
        facet = new Entities.ProductionCuraduriaFacet(
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
        facet = new Entities.ProductionTextFacet(
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
        facet = new Entities.ProductionTechFacet(
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
      var data;


      if(token==='properties'){
        data = {};
        data['name'] = facet.get('slug');
        data['description'] = facet.get('description');
        console.log('ready to update PRODUCTION');
        var session = self.get('currentsession').properties;
        console.log('currentSession: [%s] [%s]',session['ea:etag'], session.links.length)
        //
        var proper = StudioManager.request("update:production:properties", session, data);

      }

    },

    setFacetOld: function(token, facet){
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
      var update = new Entities.ProductionUpdate(query);
      update.save({
        success: function() {
        }
      });
      //log ACTIVITY
      logActivity(token, self, data);
      //

    },

    validate: function(attrs, options) {
      /*
      var errors = {};
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
      */
    }
  });

  Entities.ProductionUpdate = Backbone.Model.extend({
    whoami: 'Entities.ProductionUpdate:production.js ',

    urlRoot: "/actualizar/productions",

  });


  //Entities.configureStorage(Entities.Production);
  Entities.ProductionCollectionHeader = Backbone.Collection.extend({

    model: Entities.ProductionToken,

    url: "/studio/productions",

    comparator: "ea:lastModified",


  });

  Entities.AnywCollectionCreator = Backbone.Collection.extend({

    //model: Entities.EaAssetToken,

    url: "/studio/createentities",

  });

  Entities.AnywCollectionIngest = Backbone.Collection.extend({

    //model: Entities.EaAssetToken,

    url: "/studio/ingest",

  });

  Entities.AnywCollectionPushSession = Backbone.Collection.extend({

    //model: Entities.EaAssetToken,

    url: "/studio/pushsession",

  });

  Entities.AnywCollectionBuilder = Backbone.Collection.extend({

    //model: Entities.EaAssetToken,

    url: "/studio/entities",

  });

  Entities.ProductionCollection = Backbone.Collection.extend({

    model: Entities.ProductionToken,

    url: "/studio/productions",

    comparator: "ea:lastModified",


  });

  Entities.ProductionChildCollection = Backbone.Collection.extend({

    model: Entities.Production,

    url: "/navegar/productions",

    comparator: "productcode",
  });

  Entities.AssetVideoUrl = Backbone.Model.extend({
    whoami: 'AssetVideoUrl:production.js ',
    urlRoot: "/asset/render/video",

    idAttribute: "_id",
    
  });

  Entities.ProductionCoreFacet = Backbone.Model.extend({
    //urlRoot: "/comprobantes",
    whoami: 'ProductionCoreFacet:production.js ',

    schema: {
        tipoproduction: {type: 'Select',options: utils.tipoProduccionOptionList, title:'Tipo Producción' },
        slug:     {type: 'Text', title: 'Nombre'},
        description:  {type: 'Text', title: 'Descripción'},
    },
    //idAttribute: "_id",

    createNewProduction: function(cb){
      var self = this;
      var production = new Entities.Production(self.attributes);

      production.initBeforeCreate();
      console.log('createNewProduction!!');

      var algo = production.save(null, {
        success: function(model){
          console.log('saveSuccess');
          cb(null,model);
        },
        error: function(event){
          console.log('error');
        }
      });
      //console.dir(algo);
    },

    defaults: {
      _id: null,
      tipoproduction: "no_definido",
      slug: "",
      description: ""
    },

   });


  Entities.ProductionNewIngestFacet = Backbone.Model.extend({
    //urlRoot: "/comprobantes",
    whoami: 'ProductionNewIngestFacet:production.js ',
    //destination
    // mediaPaths[eamedia://media/folder/file.xxx]
    // comment
    //name: job name
    // mountpoint
    // bin y xmp mediadata

    schema: {
        name:     {type: 'Text', title: 'Nombre'},
        comment:     {type: 'Text', title: 'Descripción'},
        mediaPaths:  {type: 'Text', title: 'Media path'},

    },
    //idAttribute: "_id",

    createNewIngest: function(production, cb){
      var self = this;
      var param = {};
      var data = {};
      var mp = [];
      data.name = self.get('name');
      data.mediaPaths = mp.push(self.get('mediaPaths'));
      data.comment = self.get('comment');
      param[':parameters'] = data;

      console.log('createNewIngest!!!!![%s] rel:[%s]', self.get('name'), production.get('access').links[0].rel);
      var access = StudioManager.request("add:production:ingest", production.get('access'), param);

      //console.dir(algo);
    },

    defaults: {
      _id: null,
      name: 'Job ingest',    
      comment:  'Testing job ingest',
      mediaPaths:'eamedia://Presentacion03.mp4'
    },

   });


  Entities.ProductionNewUserFacet = Backbone.Model.extend({
    //urlRoot: "/comprobantes",
    whoami: 'ProductionNewUserFacet:production.js ',

    schema: {
        slug:     {type: 'Text', title: 'Nombre'},
    },
    //idAttribute: "_id",

    createNewUser: function(production, cb){
      var self = this;
      console.log('createNewUser!!!!![%s] rel:[%s]', self.get('slug'), production.get('access').links[0].rel);
      var access = StudioManager.request("add:production:user", production.get('access'), self.get('slug'));

      //console.dir(algo);
    },

    defaults: {
      _id: null,
      slug: "",
    },

   });


  Entities.ProductionPropertiesFacet = Backbone.Model.extend({
      whoami:'properties:production',

      retrieveData: function(){
          var data = {};
          data.name = this.get('name');
          data.description = this.get('description');
          return data;
      },

      schema: {
          slug:  {type: 'Text', editorAttrs:{placeholder : 'denominación'}, title: 'Nombre' },
          description: {type: 'TextArea', editorAttrs:{placeholder : 'descripción'},title: 'Descrip'},
      },

      defaults: {
          slug: '',
          description: '',
      }
  });



/////////

  Entities.ProductionStateFacet = Backbone.Model.extend({
      whoami:'ProductionTechFacet:production.js',
      
      retrieveData: function(){
          return dao.extractData(this.attributes);
      },

      process: function(target){
        if(target.type==='checkbox'){
          console.log('PROCESS:production ProductionStateFacet [%s] [%s] [%s]o[%s]', target.name, target.checked, (target.checked===false), (target.checked===true));
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

  Entities.ProductionPaisFacet = Backbone.Model.extend({
    //urlRoot: "/comprobantes",
    whoami: 'ProductionPaisFacet:production.js ',

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
  
  Entities.ProductionContenidoFacet = Backbone.Model.extend({
    // ******************* BROWSE PRODUCTS ***************
    whoami:'ProuctContenidoFacet:production.js',

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

  Entities.ProductionCuraduriaFacet = Backbone.Model.extend({
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


  Entities.ProductionTechFacet = Backbone.Model.extend({
      // ******************* BROWSE PRODUCTS ***************
      whoami:'ProductionTechFacet:production.js',
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

  Entities.ProductionTextFacet = Backbone.Model.extend({
    //urlRoot: "/comprobantes",
    whoami: 'ProductionTextFacet:production.js ',

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

  var logActivity = function(result, production, data){

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

                entitytype: 'production',
                entity: production.get('productcode'),
                entitiyid: production.id,
                
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
            if(document.get("properties").name.toLowerCase().indexOf(criteria) !== -1){
              //|| document.get("properties").description.toLowerCase().indexOf(criteria) !== -1){
              
              return document;
            }
          }
        }
    });
    return fd;
  };

  var API = {
    getEntities: function(){
      var entities = new Entities.ProductionCollection();
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

      $.when(fetchingEntities).done(function(master){
        //console.log('getFilteredCol: 3');
        console.log('getFilteredCol DONE: [%s]',master.length, master.at(0).get('productions').length);
        var entities = new Entities.ProductionCollection(master.at(0).get('productions'));

        var filteredEntities = filterFactory(entities);
        console.log('getFilteredCol: [%s]',criteria);
        if(criteria){
            filteredEntities.filter(criteria);
        }
        if(cb) cb(filteredEntities);
      });
    },

    getEntity: function(entityId){
      var entity = new Entities.Production({_id: entityId});
      var defer = $.Deferred();

      entity.fetch({
        success: function(data){
          data.initAfterFetching(function(){
            defer.resolve(data);
          });
        },
        error: function(data){
          defer.resolve(undefined);
        }
      });
      return defer.promise();
    },

    getProductionUsers: function(production){
      var defer = $.Deferred();
      var links = production.get('links');
      //console.log('getProductionAssets [%s]',links.length);

      var eaassetCol = new Entities.AnywCollectionBuilder();
      var query = {
        target: 'http://anywhere.adobe.com/productions/production#access',
        links: links
      };

      eaassetCol.fetch({
          data: query,
          type: 'post',
          success: function(data) {
            //console.log('success: [%s]',data.at(0).get('users')[0].properties.firstname);
            var access = data.at(0);
            defer.resolve(access);
          }
      });
      return defer.promise();
    },

    getProductionSessions: function(production){
      var defer = $.Deferred();
      var links = production.get('links');
      //console.log('getProductionAssets [%s]',links.length);

      var eaassetCol = new Entities.AnywCollectionBuilder();
      var query = {
        target: 'http://anywhere.adobe.com/sessions',
        links: links
      };

      eaassetCol.fetch({
          data: query,
          type: 'post',
          success: function(data) {
            //console.log('success: [%s]',data.at(0).get('sessions')[0].properties['ea:owner']);
            var access = data.at(0);
            defer.resolve(access);
          }
      });
      return defer.promise();
    },

    createProductionSessions: function(production){
      var defer = $.Deferred();
      var sessCol = production.get('easessions');
      var links = sessCol.links;
      var isTemp = {};
      isTemp[':isTemporary'] = false;

      console.log('createProductSessions LINKS [%s]',links.length);

      var eaassetCol = new Entities.AnywCollectionCreator();
      var query = {
        target: 'create',
        links: links,
        bdata:isTemp
      };

      eaassetCol.fetch({
          data: query,
          type: 'post',
          success: function(data) {
            //console.log('success: [%s]',data.at(0).get('sessCol')[0].properties['ea:owner']);
            var access = data.at(0);
            defer.resolve(access);
          }
      });
      return defer.promise();
    },

    fetchUserSessions: function(session){
      var defer = $.Deferred();
      var links = session.links;
      //console.log('getProductionAssets [%s]',links.length);

      var eaassetCol = new Entities.AnywCollectionBuilder();
      var query = {
        target: 'self',
        links: links
      };

      eaassetCol.fetch({
          data: query,
          type: 'post',
          success: function(data) {
            //console.log('success: [%s]',data.at(0).get('sessions')[0].properties['ea:owner']);
            var access = data.at(0);
            defer.resolve(access);
          }
      });
      return defer.promise();
    },

    addProductionUser: function(access, userId){
      var defer = $.Deferred();
      var links = access.links;
      var data = {};
      console.log('AddProductionUser [%s]',links.length, userId);

      var eaassetCol = new Entities.AnywCollectionCreator();
      data[':userId'] = userId;
      data[':groupId'] = 'DISNEY';

      var query = {
        target: 'create',
        links: links,
        bdata: data
      };

      eaassetCol.fetch({
          data: query,
          type: 'post',
          success: function(data) {
            //console.log('success: [%s]',data.at(0).get('accesss')[0].properties['ea:owner']);
            var access = data.at(0);
            defer.resolve(access);
          }
      });
      return defer.promise();
    },

    updateProductionProperties: function(session, data){

      //"href": "http://186.137.141.82:60138/content/ea/git/productions/4025f611-9221-4ff8-963b-6a2fec67b364/HEAD/properties/properties.v1.json",
      //"href": "http://186.137.141.82:60138/content/ea/git/productions/4025f611-9221-4ff8-963b-6a2fec67b364/HEAD/properties/properties.v1.json",
      var defer = $.Deferred();
      var links = session.links;
      console.log('updateProductionPropertis [%s]',links.length);

      var eaassetCol = new Entities.AnywCollectionCreator();
      //data[':userId'] = userId;
      //data[':groupId'] = 'DISNEY';

      var query = {
        target: 'edit',
        links: links,
        ifmatch: session['ea:etag'],
        bdata: data
      };

      eaassetCol.fetch({
          data: query,
          type: 'put',
          success: function(data) {
            //console.log('success: [%s]',data.at(0).get('sessions')[0].properties['ea:owner']);
            var session = data.at(0);
            defer.resolve(session);
          }
      });
      return defer.promise();
    },

    pushSession: function(session){

      //"href": "http://186.137.141.82:60138/content/ea/git/productions/4025f611-9221-4ff8-963b-6a2fec67b364/HEAD/properties/properties.v1.json",
      //"href": "http://186.137.141.82:60138/content/ea/git/productions/4025f611-9221-4ff8-963b-6a2fec67b364/HEAD/properties/properties.v1.json",
      var defer = $.Deferred();
      var links = session.links;
      var data = {};
      data['ea:commitMessage'] = 'push data';

      console.log('pushsession [%s]',links.length);

      var eaassetCol = new Entities.AnywCollectionPushSession();
      //data[':userId'] = userId;
      //data[':groupId'] = 'DISNEY';

      var query = {
        target: 'http://anywhere.adobe.com/sessions/session#push',
        links: links,
        bdata: data
      };

      eaassetCol.fetch({
          data: query,
          type: 'post',
          success: function(data) {
            //console.log('success: [%s]',data.at(0).get('sessions')[0].properties['ea:owner']);
            var session = data.at(0);
            defer.resolve(session);
          }
      });
      return defer.promise();
    },

    newIngestJob: function(session, data){
      //"href": "http://186.137.141.82:60138/content/ea/git/productions/4025f611-9221-4ff8-963b-6a2fec67b364/HEAD/properties/properties.v1.json",
      //"href": "http://186.137.141.82:60138/content/ea/git/productions/4025f611-9221-4ff8-963b-6a2fec67b364/HEAD/properties/properties.v1.json",
      // Production -> jobs:

      var defer = $.Deferred();
      //var links = session.links;
      var link = {
          title: "Create Com.adobe.ea.jobs.ingest",
          rel: "http://anywhere.adobe.com/jobs/ingest#create",
          href: "http://186.137.141.82:60138/content/ea/api/productions/a0703cae-493d-4528-a084-01dd020c9f6c/jobs/ingest.v1.json",
          type: "application/json"

      };
      var links = [];
      links.push(link);
 
      console.log('ingest job BEGIN [%s]',links.length);

      var eaassetCol = new Entities.AnywCollectionIngest();
      //data[':userId'] = userId;
      //data[':groupId'] = 'DISNEY';

      var query = {
        target: 'http://anywhere.adobe.com/jobs/ingest#create',
        links: links,
        bdata: data
      };

      eaassetCol.fetch({
          data: query,
          type: 'post',
          success: function(data) {
            //console.log('success: [%s]',data.at(0).get('sessions')[0].properties['ea:owner']);
            var session = data.at(0);
            defer.resolve(session);
          }
      });
      return defer.promise();
    }

  };
////////////////



////////////////
  StudioManager.reqres.setHandler("add:production:ingest", function(session, data){
    //console.log('addProductionUser: STOP!!!')
    return API.newIngestJob(session, data);
  });

  StudioManager.reqres.setHandler("push:production:session", function(session){
    //console.log('addProductionUser: STOP!!!')
    return API.pushSession(session);
  });

  StudioManager.reqres.setHandler("update:production:properties", function(session, data){
    //console.log('addProductionUser: STOP!!!')
    return API.updateProductionProperties(session, data);
  });

  StudioManager.reqres.setHandler("add:production:user", function(access, user){
    //console.log('addProductionUser: STOP!!!')
    return API.addProductionUser(access, user);
  });

  StudioManager.reqres.setHandler("fetch:user:session", function(model){
    return API.fetchUserSessions(model);
  });

  StudioManager.reqres.setHandler("create:production:sessions", function(model){
    return API.createProductionSessions(model);
  });

  StudioManager.reqres.setHandler("fetch:production:sessions", function(model){
    return API.getProductionSessions(model);
  });

  StudioManager.reqres.setHandler("fetch:production:users", function(model){
    return API.getProductionUsers(model);
  });

  StudioManager.reqres.setHandler("production:entities", function(){
    return API.getEntities();
  });

  StudioManager.reqres.setHandler("production:entity", function(id){
    return API.getEntity(id);
  });

  StudioManager.reqres.setHandler("production:filtered:entities", function(criteria, cb){
    return API.getFilteredCol(criteria,cb);
  });

});

