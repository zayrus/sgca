DocManager.module("Entities", function(Entities, DocManager, Backbone, Marionette, $, _){
  
  Entities.Comprobante = Backbone.Model.extend({
    urlRoot: "/comprobantes",
    whoami: 'Entities.Comprobante:comprobante.js ',

    idAttribute: "_id",

    defaults: {
      _id: null,
      tipocomp: "",
      cnumber: "",
      fecomp: "",
      persona: "",
      slug: "documento nuevoO",
      estado_alta:'media',
      nivel_ejecucion: 'enproceso',
      description: "",
      items:[]
    },

    enabled_predicates:['es_relacion_de'],
    
    initBeforeCreate: function(cb){
      var self = this,
          fealta = new Date(),
          fecomp = utils.dateToStr(fealta),
          documitems = [];

      self.set({fealta:fealta.getTime(), fecomp: fecomp});
      console.log('alo!!!!!!!!!!!!!!!!!!!!! [%s][%s]', self.get('tipocomp'),dao.docum.isType(self.get('tipocomp'), 'nsolicitud'));

      if(dao.docum.isType(self.get('tipocomp'), 'ptecnico')){
          var ptecnico = new Entities.DocumParteTecnico();
          ptecnico.set({
              tipoitem: self.get('tipocomp'),
              slug: self.get('slug'),
              fept: self.get('fecomp'),
              estado_qc: dao.docum.initval(self.get('tipocomp')).estado_qc,
          });
          documitems.push(ptecnico.attributes);
          self.set({items: documitems});

      } else if(dao.docum.isType(self.get('tipocomp'), 'nsolicitud')){
        console.log('alo!!!!!!!!!!!!!!!!!!!!!')

          var parte = new Entities.DocumMovimSO();
          parte.set({
              tipoitem: self.get('tipocomp'),
              slug: self.get('slug'),
              //tipomov: dao.docum.initval(self.get('tipocomp')).tipomov,
          });
          documitems.push(parte.attributes);
          self.set({items: documitems});
      } else if(dao.docum.isType(self.get('tipocomp'), 'pemision')){
          var parte = new Entities.DocumParteEM();
          parte.set({
              tipoitem: self.get('tipocomp'),
              slug: self.get('slug'),
              tipoemis:dao.docum.initval(self.get('tipocomp')).tipoemis,
          });
          documitems.push(parte.attributes);
          self.set({items: documitems});
      } else if(dao.docum.isType(self.get('tipocomp'), 'notas')){
          var parte = new Entities.DocumMovimRE(),
              sitems = [];
          parte.set({
              tipoitem: self.get('tipocomp'),
              slug: self.get('slug'),
              tipomov: dao.docum.initval(self.get('tipocomp')).tipomov,
          });
          documitems.push(parte.attributes);
          self.set({items: documitems});
      } else if(dao.docum.isType(self.get('tipocomp'), 'pdiario')){
          var parte = new Entities.DocumParteDI(),
              sitems = [];
          parte.set({
              tipoitem: self.get('tipocomp'),
              slug: self.get('slug'),
              tipomov: dao.docum.initval(self.get('tipocomp')).tipomov,
          });
          documitems.push(parte.attributes);
          self.set({items: documitems});
      }

      dao.gestionUser.getUser(DocManager, function (user){
        self.set({useralta: user.id, userultmod: user.id});
        var person;
        var related = user.get('es_usuario_de');
        if(related){
          person = related[0];
          if(person){
            self.set({persona: person.code,personaid: person.id })
          }
        } 
        if(cb) cb(self);
      });
    },

    beforeSave: function(cb){
      var self = this;
      console.log('initBefore SAVE')
      var feultmod = new Date();
      self.set({feultmod:feultmod.getTime()})
      dao.gestionUser.getUser(DocManager, function (user){
        if (! self.get('useralta')) self.set({useralta: user.id});
        self.set({userultmod: user.id});
        if(cb) cb(self);
      });

    },
    
    documSolicitudFacetFactory: function(){
      var self = this,
          data,
          fealta = new Date();

      if(!self.get('tipocomp')){
        self.set('tipocomp', 'nsolicitud');
        self.set('fecomp', utils.dateToStr(fealta));
      }

      if(!self.id){
        self.set('slug', 'Nueva Solicitud');
      }

      data = _.clone(self.attributes);
      data = _.extend(data,self.get('items')[0]);
      return new Entities.DocumSolicitudFacet(data);
    },
    
    update: function(cb){
      console.log('update')
      var self = this;
      self.beforeSave(function(docum){
        var errors ;
        console.log('ready to SAVE');
        if(!self.save(null,{
          success: function(model){
            //console.log('callback SUCCESS')
            
            // log Activity
            logActivity(model);
            // log Activity

            //Change Product State
            changeProductState(model);
            //Change Product State

            cb(null,model);

           }
          })) {
            cb(self.validationError,null);
        }            
      });

    },

    itemTypes: {
      ptecnico:{
        initNew: function(self, attrs){
          var ptecnico = new Entities.DocumParteTecnico(attrs);
          //console.log('initNew PARTE TECNICO [%s]',ptecnico.get('slug'));
          //do some initialization
          return ptecnico;
        }
      },
      nentrega:{
        initNew: function(self, attrs){
          var item = new Entities.DocumMovimRE(attrs);
          return item;
        }
      },
      nrecepcion:{
        initNew: function(self, attrs){
          var item = new Entities.DocumMovimRE(attrs);
          return item;
        }
      },
      nsolicitud:{
        initNew: function(self, attrs){
          var item = new Entities.DocumMovimSO(attrs);
          return item;
        }
      },
      npedido:{
        initNew: function(self, attrs){
          var item = new Entities.DocumMovimRE(attrs);
          return item;
        }
      },
      pdiario:{
        initNew: function(self, attrs){
          var item = new Entities.DocumParteDI(attrs);
          return item;
        }
      },
      pemision:{
        initNew: function(self, attrs){
          var item = new Entities.DocumParteEM(attrs);
          return item;
        }
      },
    },

    validate: function(attrs, options) {
      //if(!attrs) return;
      var errors = {}
      //console.log('validate [%s] [%s] [%s]',attrs, _.has(attrs,'tipocomp'), attrs.tipocomp);

      if (_.has(attrs,'tipocomp') && (!attrs.tipocomp|| attrs.tipocomp.length==0)) {
        errors.tipocomp = "No puede ser nulo";
      }
      if (_.has(attrs,'slug') && ! attrs.slug) {
        errors.slug = "No puede ser nulo";
      }
      if (_.has(attrs,'fecomp')){
        var fecomp_tc = utils.buildDateNum(attrs['fecomp']);
        if(Math.abs(fecomp_tc-(new Date().getTime()))>(1000*60*60*24*30*6) ){
          //errors.fecomp = 'fecha no valida';
        }
        this.set('fecomp_tc',fecomp_tc);
      }

      if( ! _.isEmpty(errors)){
        return errors;
      }
    },

    insertItemCollection: function(itemCol) {
        var self = this;
        self.set({items: itemCol.toJSON()});
    },

    initNewItem: function(item){
      var self = this;
      var itemModel = self.itemTypes[item.get('tipoitem')].initNew(self, item.attributes);
      return itemModel;
    },

  });

  //Comprobante Collection
  Entities.ComprobanteCollection = Backbone.Collection.extend({
    whoami: 'Entities.ComprobanteCollection:comprobante.js ',
    url: "/comprobantes",
    model: Entities.Comprobante,

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
/*
    comparator: function(model) {
      return model.get(this.sortfield);
    },
*/
  });

  Entities.DocumentCollection = Backbone.Collection.extend({
    whoami: 'Entities.DocumentCollection:comprobante.js ',

    model: Entities.Comprobante,

    url: "/navegar/comprobantes",

    sortfield: 'cnumber',
    sortorder: 1,
    comparator: function(left, right) {
      var order = this.sortorder;
      var l = left.get(this.sortfield);
      var r = right.get(this.sortfield);

      if (l === void 0) return -1 * order;
      if (r === void 0) return 1 * order;

      return l < r ? (1*order) : l > r ? (-1*order) : 0;
    },
  });

  Entities.ComprobanteFindOne = Backbone.Collection.extend({
    whoami: 'Entities.ComprobanteFindOne:comprobante.js ',
    url: "/comprobante/fetch",
    model: Entities.Comprobante,
    comparator: "cnumber",
  });

  Entities.DocumentsUpdate = Backbone.Collection.extend({
    whoami: 'Entities.DocumentsUpdate:comprobante.js ',
    url: "/actualizar/comprobantes",
    model: Entities.Comprobante,
    comparator: "cnumber",
  });



  var modelFactory = function(attrs, options){
    //utils.inspect(attrs,1,'modelFactory');
    var model;
    if(attrs.tipoitem==='ptecnico')   model = new Entities.DocumParteTecnico(attrs);
    if(attrs.tipoitem==='nrecepcion') model = new Entities.DocumMovimRE(attrs);
    if(attrs.tipoitem==='nsolicitud') model = new Entities.DocumMovimSO(attrs);
    if(attrs.tipoitem==='nentrega')   model = new Entities.DocumMovimRE(attrs);
    if(attrs.tipoitem==='npedido')    model = new Entities.DocumMovimRE(attrs);
    if(attrs.tipoitem==='pemision')   model = new Entities.DocumParteEM(attrs);
    if(attrs.tipoitem==='pdiario')    model = new Entities.DocumParteDI(attrs);
    return model;
  };

  Entities.DocumItemsCollection = Backbone.Collection.extend({
    whoami: 'Entities.DocumItemsCollection:comprobante.js ',

    model: function(attrs, options){
      return modelFactory(attrs, options);
    },

  });


  /*
   * ******* Parte TECNICO +**********
   */
  Entities.DocumParteTecnico = Backbone.Model.extend({
    whoami: 'DocumParteTecnico:comprobante.js ',

    schema: {
        tipoitem: {type: 'Select',options: utils.tipoDocumItemOptionList, title:'Tipo Item' },
        slug:     {type: 'Text', title: 'Descripción corta'},
    },

    validate: function(attrs, options) {
      //if(!attrs) return;
      var errors = {}
      //console.log('validate [%s] [%s] [%s]',attrs, _.has(attrs,'tipoitem'), attrs.tipoitem);

      if (_.has(attrs,'tipoitem') && (!attrs.tipitem )) {
        errors.tipocomp = "No puede ser nulo";
      }
      if (_.has(attrs,'slug') && ! attrs.slug) {
        errors.slug = "No puede ser nulo";
      }

      if (_.has(attrs,'fept')){
        var fept_tc = utils.buildDateNum(attrs['fept']);
        if(Math.abs(fept_tc-(new Date().getTime()))>(1000*60*60*24*30*6) ){
          //errors.fept = 'fecha no valida';
        }
        this.set('fept_tc',fept_tc);
      }

      if( ! _.isEmpty(errors)){
        return errors;
      }
    },

    insertItemCollection: function(itemCol) {
        var self = this;
        self.set({items: itemCol.toJSON()});
    },

    initNewItem: function(){
      return new Entities.DocumParteTecnicoItem();
    },

    getItems: function(){
      var items = this.get('items');
      return new Entities.PTecnicoItems(items);
    },

    productSelected: function(pr){
      // fetching a product success. 

    },

    defaults: {
      tipoitem: "",
      slug: "",
      fept: "",
      revision:1,
      product: "",
      pslug:"",
      persona:"",
      sopoentrega:"",
      vbloques:"",
      estado_alta:"",
      nivel_ejecucion:"",
      estado_qc:"ddd",
      resolucion:"",
      framerate:"",
      aspectratio:"",
      rolinstancia:"",
      formatoorig:"",
      au1_content:"",
      au1_channel:"",
      au1_piclevel:"",
      au2_content:"",
      au2_channel:"",
      au2_piclevel:"",
      au3_content:"",
      au3_channel:"",
      au3_piclevel:"",
      au4_content:"",
      au4_channel:"",
      au4_piclevel:"",
      description: "",
      items:[]

    },

  });
  Entities.DocumParteTecnicoItem = Backbone.Model.extend({
    whoami: 'DocumParteTecnicoItem:comprobante.js ',

 
    validate: function(attrs, options) {
      //if(!attrs) return;
      var errors = {}
      //console.log('validate [%s] [%s] [%s]',attrs, _.has(attrs,'ptitcbco'), attrs.ptitcbco);
      //utils.inspect(attrs,1,'pti');

      if (_.has(attrs,'pticaso') && (!attrs.pticaso )) {
        errors.pticaso = "No puede ser nulo";
      }
      if (_.has(attrs,'ptitcbco') && ! attrs.ptitcbco) {
        errors.ptitcbco = "No puede ser nulo";
      }
      if (_.has(attrs,'ptitcbco')){
        this.set('ptitcbco',utils.parseTC(attrs.ptitcbco));
        if(this.get('ptitcbco') === "00:00:00:00") errors.ptitcbco = "error de time-code";
        this.trigger('tc:change','ptitcbco');
      }
      if (_.has(attrs,'ptiduracion')){
        this.set('ptiduracion',utils.parseTC(attrs.ptiduracion));
        if(this.get('ptiduracion') === "00:00:00:00") errors.ptiduracion = "error de time-code";
        this.trigger('tc:change','ptiduracion');
      }
      if (_.has(attrs,'ptitcabs')){
        this.set('ptitcabs',utils.parseTC(attrs.ptitcabs));
        if(this.get('ptitcabs') === "00:00:00:00") errors.ptitcabs = "error de time-code";
        this.trigger('tc:change','ptitcabs');
      }

      if( ! _.isEmpty(errors)){
        return errors;
      }
    },

    defaults: {
      pticaso: '',
      ptiseveridad: '',
      ptidescription: '',
      ptitcbco: '',
      ptiduracion: '',
      pticanal: '',
      ptitcabs: ''
    },

  });

  Entities.PTecnicoItems = Backbone.Collection.extend({
    whoami: 'Entities.PTecnicoItems:comprobante.js ',
    model: Entities.DocumParteTecnicoItem,
    comparator: "ptitcbco",
  });


  /*
   * ******* Movim Recepcion Entrega +**********
   */
  Entities.DocumMovimRE = Backbone.Model.extend({
    whoami: 'DocumMovimRE:comprobante.js ',

    validate: function(attrs, options) {
      //if(!attrs) return;
      var errors = {}
      //console.log('validate [%s] [%s] [%s]',attrs, _.has(attrs,'tipoitem'), attrs.tipoitem);

      if (_.has(attrs,'tipoitem') && (!attrs.tipitem )) {
        errors.tipocomp = "No puede ser nulo";
      }
      if (_.has(attrs,'slug') && ! attrs.slug) {
        errors.slug = "No puede ser nulo";
      }

      if( ! _.isEmpty(errors)){
        return errors;
      }
    },
    insertItemCollection: function(itemCol) {
        var self = this;
        self.set({items: itemCol.toJSON()});
    },

    getItems: function(){
      var itemCol = new Entities.MovimREItems(this.get('items'));
      return itemCol;
    },

    initNewItem: function(){
      return new Entities.DocumMovimREItem();
    },

    productSelected: function(pr){
      // fetching a product success. 

    },

    defaults: {
      tipoitem: "",
      slug: "",
      tipomov: "",
      persona: "",
      mediofisico: "",
      soporte_slug: "",
      soporte_id: "",
      description:"",
      items:[]
    },

  });

  Entities.DocumMovimREItem = Backbone.Model.extend({
    whoami: 'DocumMovimREItem:comprobante.js ',

 
    validate: function(attrs, options) {
      var errors = {}

      if (_.has(attrs,'product') && (!attrs.product )) {
        errors.pticaso = "No puede ser nulo";
      }
      if( ! _.isEmpty(errors)){
        return errors;
      }
    },

    defaults: {
      product: '',
      pslug:'',
      comentario: '',
      durnominal:'',
    },
  });

  Entities.MovimREItems = Backbone.Collection.extend({
    whoami: 'Entities.MovimREItems:comprobante.js ',
    model: Entities.DocumMovimREItem,
    comparator: "product",
  });

// fin Movim Recepcion entrega

  /*
   * ******* Movim Solicitud de municipios +**********
   */
  Entities.DocumSolicitudFacet = Backbone.Model.extend({
    whoami: 'DocumSolicitudFacet:comprobante.js ',

    validate: function(attrs, options) {
      //if(!attrs) return;
      var errors = {}
      //console.log('validate [%s] [%s] [%s]',attrs, _.has(attrs,'tipoitem'), attrs.tipoitem);

      if (_.has(attrs,'tipoitem') && (!attrs.tipitem )) {
        errors.tipocomp = "No puede ser nulo";
      }
      if (_.has(attrs,'eusuario') && (!attrs.eusuario )) {
        errors.eusuario = "No puede ser nulo";
      }
      if (_.has(attrs,'slug') && ! attrs.slug) {
        errors.slug = "No puede ser nulo";
      }

      if( ! _.isEmpty(errors)){
        return errors;
      }
    },

    addItemCollection: function(model){
      var self = this,
          itemCol = self.getItems();

      console.log('AddItem [%s] items before Insert:[%s]', model.get('description'), itemCol.length);

      itemCol.add(model);
      console.log('AddItem [%s] items after Insert:[%s]', model.get('description'), itemCol.length);
      self.insertItemCollection(itemCol);
      return itemCol;
    },

    insertItemCollection: function(itemCol) {
        var self = this;
        console.log('INSERT ITEM COLLECTION!!!!!!!!!!! [%s]', itemCol.length);
        self.set({items: itemCol.toJSON()});
        //console.dir(itemCol.toJSON());
    },

    getItems: function(){
      var itemCol = new Entities.MovimSOItems(this.get('items'));
      return itemCol;

    },

    beforeUpdate: function(){

    },

    update: function(model, cb){
      var self = this,
          attrs = self.attributes,
          items = [];
      console.log('Facet Update: model:[%s]', model.whoami);
      self.beforeUpdate();

      model.set('fecomp',             this.get('fecomp'));
      model.set('tipocomp',           this.get('tipocomp'));
      model.set('cnumber',            this.get('cnumber'));
      model.set('persona',            this.get('persona'));
      model.set('slug',               this.get('slug'));
      model.set('estado_alta:',       this.get('estado_alta'));
      model.set('nivel_ejecucion',    this.get('nivel_ejecucion'));
      model.set('description',        this.get('description'));

      delete attrs.fecomp;
      delete attrs.tipocomp;
      delete attrs.cnumber;
      delete attrs.persona;
      delete attrs.estado_alta;
      delete attrs.nivel_ejecucion;
      delete attrs.description;
      //console.dir(attrs);

      items.push(attrs);

      model.set('items', items);
      model.update(cb);

    },

    initNewItem: function(){
      var sitem = new Entities.DocumMovimSOItem();

      sitem.set({
          requeridopor: 'requirente',
          acargode: 'organismo',
          trequerim: '',
          itemaprob: 'pendiente',
          itemaprobreq: 'aprobado',

          description: '',
          lugarfecha: '',
          comentario: ''
      });

      return sitem;
    },

    productSelected: function(pr){
      // fetching a product success. 

    },

    defaults: {
     _id: null,

     //Docum Header
    tipocomp: "",
    cnumber: "",
    fecomp: "",
    persona: "",
    slug: "",
    estado_alta:'media',
    nivel_ejecucion: 'enproceso',
    description: "",

    // Docum Items[]
    tipoitem: "",
    organismo: "Encuentro",
    slug: "",
    tipomov: "",
    tipo_evento: "",
    devento: "",
    fevento: "",
    leyendafecha: "",
    lugar: "",
    airelibre: "",

    provevento: "",
    locevento: "",
    cpevento: "",
    
    nsolicitante: "",
    esolicitante: "",
    tsolicitante: "",

    nusuario:"Juan Gomez",
    eusuario:"jgomez@elmunicipio.org",
    tusuario:"",
    rolusuario:"Secretaria privada",

    ntecnico: "",
    etecnico: "",
    ttecnico: "",
    
    aasignada: "",
    rasignado: "",
    rmail: "",
    rtelef: "",
    eavance: "",
    eaprob: "",
    ncriti: "",
    resoluc: "",

    items:[]
    },

  });





  Entities.DocumMovimSO = Backbone.Model.extend({
    whoami: 'DocumMovimSO:comprobante.js ',

    validate: function(attrs, options) {
      //if(!attrs) return;
      var errors = {}
      //console.log('validate [%s] [%s] [%s]',attrs, _.has(attrs,'tipoitem'), attrs.tipoitem);

      if (_.has(attrs,'tipoitem') && (!attrs.tipitem )) {
        errors.tipocomp = "No puede ser nulo";
      }
      if (_.has(attrs,'slug') && ! attrs.slug) {
        errors.slug = "No puede ser nulo";
      }

      if( ! _.isEmpty(errors)){
        return errors;
      }
    },

    addItemCollection: function(model){
      var self = this,
          itemCol = self.getItems();

      itemCol.add(model);
      self.insertItemCollection(itemCol);
      return itemCol;
    },


    insertItemCollection: function(itemCol) {
        var self = this;
        console.log('INSERT ITEM COLLECTION!!!!!!!!!!!');
        self.set({items: itemCol.toJSON()});
    },

    getItems: function(){
      var itemCol = new Entities.MovimSOItems(this.get('items'));
      console.log('getItems: [%s]',itemCol.length)
      return itemCol;
    },

    initNewItem: function(){
      return new Entities.DocumMovimSOItem();
    },

    productSelected: function(pr){
      // fetching a product success. 

    },

    defaults: {
      tipoitem: "",
      slug: "",
      tipomov: "",
      tipo_evento: "",
      devento: "",
      fevento: "",
      leyendafecha: "",
      lugar: "",
      airelibre: "",
      provevento: "",
      locevento: "",
      cpevento: "",
      nsolicitante: "",
      esolicitante: "",
      tsolicitante: "",
      ntecnico: "",
      etecnico: "",
      ttecnico: "",
      aasignada: "",
      rasignado: "",
      rmail: "",
      rtelef: "",
      eavance: "",
      eaprob: "",
      ncriti: "",
      resoluc: "",

      items:[]
    },

  });

  Entities.DocumMovimSOItem = Backbone.Model.extend({
    whoami: 'DocumMovimSOItem:comprobante.js ',

 
    validate: function(attrs, options) {
      var errors = {}

      if (_.has(attrs,'description') && (!attrs.description )) {
        errors.description = "No puede ser nulo";
      }
      if( ! _.isEmpty(errors)){
        return errors;
      }
    },

    defaults: {
      requeridopor: 'requirente',
      acargode: 'organismo',
      trequerim: '',
      itemaprob: '',
      itemaprobreq: '',

      description: 'complete su pedido',
      lugarfecha: '',
      comentario: ''
    },
  });

  Entities.MovimSOItems = Backbone.Collection.extend({
    whoami: 'Entities.MovimSOItems:comprobante.js ',
    model: Entities.DocumMovimSOItem,
    comparator: "trequerim",
  });

// fin Movim Recepcion entrega
  /*
   * ******* Parte de Emisión +**********
   */
  Entities.DocumParteEM = Backbone.Model.extend({
    whoami: 'DocumParteEM:comprobante.js ',

    validate: function(attrs, options) {
      //if(!attrs) return;
      var errors = {}
      //console.log('validate [%s] [%s] [%s]',attrs, _.has(attrs,'tipoitem'), attrs.tipoitem);

      if (_.has(attrs,'tipoitem') && (!attrs.tipitem )) {
        errors.tipoitem = "No puede ser nulo";
      }
      if (_.has(attrs,'slug') && ! attrs.slug) {
        errors.slug = "No puede ser nulo";
      }

      if (_.has(attrs,'fedesde')){
        var fecha = utils.buildDate(attrs['fedesde']);
        var fehasta = new Date(fecha.getFullYear(), fecha.getMonth(), fecha.getDate()+6, 0, 0, 0, 0);
        this.set('fedesde_tc',fecha.getTime());
        this.set('fehasta_tc', fehasta.getTime());
        this.set('fehasta', utils.dateToStr(fehasta));
        if(fecha.getDay()!==1) errors.fedesde = "La fecha debe corresponder a un día lunes";
      }
      if (_.has(attrs,'fehasta')){
        var fecha = utils.buildDateNum(attrs['fehasta']);
        this.set('fehasta_tc',fecha);
      }

      if( ! _.isEmpty(errors)){
        return errors;
      }
    },
    insertItemCollection: function(itemCol) {
        var self = this;
        var col = this.buildItemCollection(itemCol);
        self.set({items: col.toJSON()});
    },
    buildItemCollection: function(col){
      var itemCol = new Entities.ParteEMItems();
      col.each(function(item){
        if(item.hasData()){
          itemCol.add(item);
        }
      });
      return itemCol;
    },

    getItems: function(){
      var itemCol = new Entities.ParteEMItems(this.get('items'));
      this.initDatesArray(itemCol)
      return itemCol;
    },

    initDatesArray: function(col){
      col.each(function(model){
        var datecol = model.get('emisiones');
        var emisiones = new Entities.ParteEMemisiones();
        for (var i=0; i<7; i++){
          var emision = _.find(datecol,function(elem){
            return (elem.dayweek===i);
          });
          if(!emision) emision={
            dayweek:i,
          };
          emisiones.add(new Entities.DocumParteEMItemDate(emision));
        }
        model.set({emisiones: emisiones});
      });
    },
    findEmision: function(col){


    },

    initNewItem: function(){
      return new Entities.DocumParteEMItem();
    },


    defaults: {
      tipoitem: "",
      tipoemis:"",
      slug: "",
      fedesde:"",
      fehasta:"",
      cobertura:"",
      product:"",
      pslug:"",
      fuente:"",
      persona: "",
      description:"",
      items:[]
    },

  });

  Entities.DocumParteEMItem = Backbone.Model.extend({
    whoami: 'DocumParteEMItem:comprobante.js ',

 
    validate: function(attrs, options) {
      //if(!attrs) return;
      var errors = {}
      //console.log('validate [%s] [%s] [%s]',attrs, _.has(attrs,'ptitcbco'), attrs.ptitcbco);
      //utils.inspect(attrs,1,'pti');

      if (_.has(attrs,'product') && (!attrs.product )) {
        errors.product = "No puede ser nulo";
      }
      if( ! _.isEmpty(errors)){
        return errors;
      }
    },
    hasData: function(){
      var emisiones = this.get('emisiones');
      var hasmovim = false;
      var filtered = new Entities.ParteEMemisiones();

      emisiones.each(function(elem){
        if(elem.get('isActive')){
          hasmovim=true;
          filtered.add(elem);
        }
      });
      this.set({emisiones: filtered.toJSON()});
      return hasmovim;
    },

    initDatesArray: function(){
        var emisiones = new Entities.ParteEMemisiones();
        for (var i=0; i<7; i++){
          var emision={
            dayweek:i,
          };
          emisiones.add(new Entities.DocumParteEMItemDate(emision));
        }
        return emisiones;
    },

    defaults: {
      product: '',
      pslug:'',
      durnominal:'',
      emisiones:[],
    },
  });

  Entities.DocumParteEMItemDate = Backbone.Model.extend({
    whoami: 'DocumParteEMItem:comprobante.js ',

    schema: {
        hourmain: {type: 'Select',options: utils.hourOptionList ,title:'Horario emisión'},
        repite:  {type: 'Text', title: 'Repite',placeholder:'dia / hora repetición'},
        chapter: {type: 'Select',options: ['cap1','cap2'] ,title:'Capítulo'},
        comentario:     {type: 'Text', title: 'Comentario'},
    },
 
    validate: function(attrs, options) {
      //if(!attrs) return;
      var errors = {}
      //console.log('validate [%s] [%s] [%s]',attrs, _.has(attrs,'ptitcbco'), attrs.ptitcbco);
      //utils.inspect(attrs,1,'pti');

      if (_.has(attrs,'product') && (!attrs.product )) {
        errors.product = "No puede ser nulo";
      }
      if( ! _.isEmpty(errors)){
        return errors;
      }
    },
    updateData: function(){
      if(this.get('hourmain')==='noem') this.set('isActive',false);
      else this.set('isActive',true);
    },

    defaults: {
      dayweek:'',
      isActive:false,
      chapter:'',
      hourmain:'noem',
      repite:'',
      comentario: '',
      qnopt:"",
      qpt:"",
    },
  });



  Entities.ParteEMItems = Backbone.Collection.extend({
    whoami: 'Entities.ParteEMItems:comprobante.js ',
    model: Entities.DocumParteEMItem,
    comparator: "product",
  });
  Entities.ParteEMemisiones = Backbone.Collection.extend({
    whoami: 'Entities.ParteEMIemisiones:comprobante.js ',
    model: Entities.DocumParteEMItemDate,
    comparator: "dayweek",
  });
// fin Parte de emisión



  /*
   * ******* Parte Diario +**********
   */
  Entities.DocumParteDI = Backbone.Model.extend({
    whoami: 'DocumParteDI:comprobante.js ',

    validate: function(attrs, options) {
      //if(!attrs) return;
      var errors = {}
      //console.log('validate [%s] [%s] [%s]',attrs, _.has(attrs,'tipoitem'), attrs.tipoitem);

      if (_.has(attrs,'tipoitem') && (!attrs.tipitem )) {
        errors.tipocomp = "No puede ser nulo";
      }
      if (_.has(attrs,'slug') && ! attrs.slug) {
        errors.slug = "No puede ser nulo";
      }

      if( ! _.isEmpty(errors)){
        return errors;
      }
    },
    insertItemCollection: function(itemCol) {
        var self = this;
        self.set({items: itemCol.toJSON()});
    },

    getItems: function(){
      var itemCol = new Entities.MovimREItems(this.get('items'));
      return itemCol;
    },

    initNewItem: function(){
      return new Entities.DocumMovimREItem();
    },

    productSelected: function(pr){
      // fetching a product success. 

    },

    defaults: {
      tipoitem: "",
      slug: "",
      tipomov: "",
      activity:"",
      entitytype:"",
      entity:"",
      docum:"",
      result:"",
      items:[],
    },

  });


// fin Movim Parte Diario



  var modelSubItemFactory = function(attrs, options){
    //utils.inspect(attrs,1,'modelFactory');
    //console.log('modelSubFactory: [%s]',options.tipoitem)
    var model;
    if(options.tipoitem==='ptecnico')   model = new Entities.DocumParteTecnicoItem(attrs);
    if(options.tipoitem==='nrecepcion') model = new Entities.DocumMovimREItem(attrs);
    if(options.tipoitem==='nsolicitud') model = new Entities.DocumMovimSOItem(attrs);
    if(options.tipoitem==='nentrega')   model = new Entities.DocumMovimREItem(attrs);
    if(options.tipoitem==='npedido')    model = new Entities.DocumMovimREItem(attrs);
    if(options.tipoitem==='pemision')   model = new Entities.DocumParteEMItem(attrs);
    return model;
  };

  Entities.DocumSubItemsCollection = Backbone.Collection.extend({
    whoami: 'Entities.DocumSubItemsCollection:comprobante.js ',
    initialize: function(options){
      this.options = options;
    },
    comparator: 'product',

    model: function(attrs, options){
      return modelSubItemFactory(attrs, options);
    },

  });




  /*
   * ******* ItemCoreFacet +**********
   */

  Entities.DocumItemCoreFacet = Backbone.Model.extend({
    //REVISAR ESTO URGENTE MGO. 18.11.2014
    //Entiendo que esto debe crear un nuevo item a un comprobante existente,
    // pero lo que está haciendo es crear un nuevo comprobante de cero.
 
    whoami: 'DocumItemCoreFacet:comprobante.js ',

    schema: {
        tipoitem: {type: 'Select',options: utils.tipoDocumItemOptionList, title:'Tipo ITEM' },
        slug:     {type: 'Text', title: 'Descripción corta'},
    },

    createNewDocument: function(cb){
      var self = this;
      var docum = new Entities.Comprobante(self.attributes);
      docum.initBeforeCreate(function(docum){
          docum.save(null, {
            success: function(model){
              cb(null,model);
            }
          });
      });
    },

    defaults: {
      tipoitem: "",
      slug: "",
    },

   });


  // fin ItemCoreFacet

  /*
   * ******* QueryFacet +**********
   */
  Entities.DocumQueryFacet = Backbone.Model.extend({
    //urlRoot: "/comprobantes",
    whoami: 'DocumQueryFacet:comprobante.js ',

    schema: {
        fedesde:  {type: 'Date', title: 'Desde', placeholder:'dd/mm/aaaa'},
        fehasta:  {type: 'Date', title: 'Hasta', placeholder:'dd/mm/aaaa'},
        resumen: {type: 'Select', options:[
            {val:'detallado', label:'Detallado'},
            {val:'producto', label:'Resumen por producto'},
            {val:'entidad', label:'Resumen por entidad / adherente'},
          ], title: 'Resumen'},
        tipoitem: {type: 'Select',options: utils.tipoDocumItemOptionList, title:'Comprobante' },
        tipomov:  {type: 'Select',options: utils.tipomovqueryOptionList, title:'Movimiento' },
        slug:     {type: 'Text', title: 'Asunto'},
        estado:   {type: 'Select',options: utils.estadodocumOptionList, title:'Estado' },
    },

    defaults: {
      fedesde:'',
      fehasta:'',
      resumen:'detallado',
      tipoitem: '',
      tipomov: '',
      slug: '',
      estado:''
    }
  });

  Entities.DocumCoreFacet = Backbone.Model.extend({
    //urlRoot: "/comprobantes",
    whoami: 'Comrpobante:comprobante.js ',

    schema: {
        tipocomp: {type: 'Select',options: utils.tipoComprobanteOptionList, title:'Tipo comprobante' },
        slug:     {type: 'Text', title: 'Asunto'},
        description:  {type: 'Text', title: 'Descripción'},
    },
    //idAttribute: "_id",

    createNewDocument: function(cb){
      var self = this;
      var docum = new Entities.Comprobante(self.attributes);

      console.log('CREATENEW DOCUMENT!!!!!!!!!!!')

      docum.initBeforeCreate(function(docum){
        docum.save(null, {
          success: function(model){
            cb(null,model);
          }
        });
      });

    },

    defaults: {
      _id: null,
      tipocomp: "no_definido",
      cnumber: "",
      slug: "",
      description: ""
    },

   });

  Entities.DocumGropuEditFacet = Backbone.Model.extend({
    //urlRoot: "/comprobantes",
    whoami: 'DocumGroupEditFacet:comprobante.js ',

    schema: {
        estado_alta: {type: 'Select',options: utils.estadodocumOptionList, title:'Prioridad' },
        nivel_ejecucion: {type: 'Select',options: utils.documexecutionOptionList, title:'Nivel de Ejecución' },
    },
    //idAttribute: "_id",

    defaults: {
      estado_alta: '',
      nivel_ejecucion: '',
    },

   });


  //Entities.configureStorage(Entities.Comprobante);


  //Entities.configureStorage(Entities.ComprobanteCollection);
/*
  var initializeComprobantes = function(){
    comprobantes = new Entities.ComprobanteCollection([
      { id: 1, firstName: "Alice", lastName: "Arten", phoneNumber: "555-0184" },
      { id: 2, firstName: "Bob", lastName: "Brigham", phoneNumber: "555-0163" },
      { id: 3, firstName: "Charlie", lastName: "Campbell", phoneNumber: "555-0129" }
    ]);
    comprobantes.forEach(function(comprobante){
      comprobante.save();
    });
    return comprobantes.models;
  };
*/

  var logActivity = function(docum){
    var tipocomp = docum.get('tipocomp');
    var entity = {
      type:'producto',
      code:'VARIOS',
      id: null,
    };
    var result='ok';
    var slug = 'alta / edición  de comprobantes';
    var activity = 'alta/edición';

    if(docum.get('items').length){
      slug = docum.get('items')[0].slug;
      
      if(dao.docum.isType(tipocomp, 'ptecnico')){
        entity.code = docum.get('items')[0].product;
        entity.id = docum.get('items')[0].productid;
        result = docum.get('items')[0].estado_qc || result;
        activity = docum.get('cnumber') + ' Rev: ' + docum.get('items')[0].revision ;

      }else{
        activity = docum.get('cnumber') + ' Rev: ' + docum.get('items')[0].tipomov ;
      }

    }

    var activity = new DocManager.Entities.Activity({
        eventname:'user:pdiario',
        data:{
            header:{
            },
            item:{
                tipoitem: 'pdiario',
                slug: slug,
                tipomov: tipocomp,
                activity: activity,

                entitytype: entity.type,
                entity: entity.code,
                entitiyid: entity.id,
                
                docum: docum.get('cnumber'),
                documid: docum.id,
                documslug: docum.get('slug'),
                
                result: result,
            },
        },
        query:{
            tipocomp: 'pdiario',
            tipomov: tipocomp,
            activity: activity,
        }
    });
    activity.save();

  };


  var changeProductState = function(model){
    var comprobantes = new Entities.ComprobanteCollection(model);

    var docitems = fetchDocumentItemlist(comprobantes);

    console.log('changeProductsState: [%s] items:[%s]', comprobantes.length, docitems.length);

    docitems.each(function(item){
      console.log('Iterating: item:[%s]  [%s]=[%s]  mov:[%s] [%s]', item.get('product'), item.get('tipocomp'), item.get('tipoitem'), item.get('tipomov'), item.get('productid'));
      if(item.get('productid'))
        var prid = item.get('productid');

        if(dao.docum.isType(item.get('tipoitem'), 'notas')){
          if(item.get('tipoitem')==='nrecepcion' && item.get('tipomov')==='recepcion' ){
            console.log('Procesando NRECEPCION - movimiento: RECEPCION')
            var product = new DocManager.Entities.Product({_id: prid});

            product.fetch({success: function(model){
                changeREState(product, item);
            }});
        
          }else if(item.get('tipoitem')==='nsolicitud' && item.get('tipomov')==='municipio' ){
            console.log('Procesando NSOLICITUD - movimiento: MUNICIPIO')
            var product = new DocManager.Entities.Product({_id: prid});

            product.fetch({success: function(model){
                changeRSState(product, item);
            }});

          }else if(item.get('tipoitem')==='nentrega' && item.get('tipomov')==='distribucion' ){
            console.log('Procesando NENTREGA - movimiento: DISTRIBUCION')
            var product = new DocManager.Entities.Product({_id: prid});

            product.fetch({success: function(model){
                changeRSState(product, item);
            }});

          }else if(item.get('tipoitem')==='npedido' && item.get('tipomov')==='reqadherente' ){
            console.log('Procesando NPEDIDO - movimiento: REQ ADHERENTE');
            var product = new DocManager.Entities.Product({_id: prid});

            product.fetch({success: function(model){
                changePEState(product, item);
            }});

          }

        }else if (dao.docum.isType(item.get('tipoitem'), 'pemision')){
          console.log('Procesando EMISIÓN - movimiento: ')
          var product = new DocManager.Entities.Product({_id: prid});

          product.fetch({success: function(model){
              changeEMState(product, item);
          }});

        }else if (dao.docum.isType(item.get('tipoitem'), 'pdiario')){

        }else if (dao.docum.isType(item.get('tipoitem'), 'ptecnico')){
          var product = new DocManager.Entities.Product({_id: prid});

          product.fetch({success: function(model){
              changePTState(product, item);


          }});
        
        }

    });

  };

  var moveForwardExecution = function(product, avance){
    if(utils.paexecutionOrderList.indexOf(product.get('nivel_ejecucion')) < utils.paexecutionOrderList.indexOf(avance)){
      product.set('nivel_ejecucion', avance);
    }
  };

  var changePEState = function(product, item){
    console.log('Iterating: item:[%s]  [%s]  [%s] = [%s]  [%s]', item.get('product'), product.get('slug'), item.get('tipocomp'), item.get('tipoitem'), product.id );
    var token = 'editestados';
 
    var avance = 'requisicion';
    moveForwardExecution(product, avance);
    
    var facet = product.getFacet(token);


    console.log('Product Colection:[%s]  estado:[%s] nivel_ejecucion:[%s] prioridad:[%s]',product.get('productcode'),product.get('estado_alta'), product.get('nivel_ejecucion'),product.get('nivel_importancia'));

    _.each(facet.get('pendientes'),function(pend,key){
        console.log('Facet: [%s]: estado:[%s] prioridad:[%s]', key, pend.estado, pend.prioridad);

    });

    product.setFacet(token, facet);


  };  

  var changeEMState = function(product, item){
    console.log('Iterating: item:[%s]  [%s]  [%s] = [%s]  [%s]', item.get('product'), product.get('slug'), item.get('tipocomp'), item.get('tipoitem'), product.id );
    var token = 'editestados';
 
    var avance = 'emision';
    moveForwardExecution(product, avance);
    
    var facet = product.getFacet(token);


    console.log('Product Colection:[%s]  estado:[%s] nivel_ejecucion:[%s] prioridad:[%s]',product.get('productcode'),product.get('estado_alta'), product.get('nivel_ejecucion'),product.get('nivel_importancia'));

    _.each(facet.get('pendientes'),function(pend,key){
        console.log('Facet: [%s]: estado:[%s] prioridad:[%s]', key, pend.estado, pend.prioridad);

    });

    product.setFacet(token, facet);


  };  

  var changeRSState = function(product, item){
    console.log('Iterating: item:[%s]  [%s]  [%s] [%s]', item.get('product'), product.get('slug'), item.get('tipocomp'), item.get('tipoitem'), item.get('tipomov'), item.get('productid'), product.id );
    var token = 'editestados';
 
    var avance = 'distribucion';
    moveForwardExecution(product, avance);
    
    var facet = product.getFacet(token);


    console.log('Product Colection:[%s]  estado:[%s] nivel_ejecucion:[%s] prioridad:[%s]',product.get('productcode'),product.get('estado_alta'), product.get('nivel_ejecucion'),product.get('nivel_importancia'));

    _.each(facet.get('pendientes'),function(pend,key){
        console.log('Facet: [%s]: estado:[%s] prioridad:[%s]', key, pend.estado, pend.prioridad);

    });

    product.setFacet(token, facet);


  };

  var changePTState = function(product, item){
    console.log('Iterating: item:[%s]  [%s]  [%s] [%s]', item.get('product'), product.get('slug'), item.get('tipocomp'), item.get('tipoitem'), item.get('tipomov'), item.get('productid'), product.id );
    var token = 'editestados';
    var estado_qc = item.get('tipomov');

    var avance = 'chequeado';
    if(estado_qc === 'aprobado' || estado_qc === 'aprobconobs' || estado_qc === 'rechazado'){
      avance = 'qcalidad';
    }
    moveForwardExecution(product, avance);
    

    var facet = product.getFacet(token);


    console.log('Product Colection:[%s]  estado:[%s] nivel_ejecucion:[%s] prioridad:[%s]',product.get('productcode'),product.get('estado_alta'), product.get('nivel_ejecucion'),product.get('nivel_importancia'));

    _.each(facet.get('pendientes'),function(pend,key){
        console.log('Facet: [%s]: estado:[%s] prioridad:[%s]', key, pend.estado, pend.prioridad);

    });

    product.setFacet(token, facet);


  };

  var changeREState = function(product, item){
    console.log('Iterating: item:[%s]  [%s]  [%s] [%s]', item.get('product'), product.get('slug'), item.get('tipocomp'), item.get('tipoitem'), item.get('tipomov'), item.get('productid'), product.id );
    var token = 'editestados';
 
    var avance = 'recibido';
    moveForwardExecution(product, avance);
    
    var facet = product.getFacet(token);


    console.log('Product Colection:[%s]  estado:[%s] nivel_ejecucion:[%s] prioridad:[%s]',product.get('productcode'),product.get('estado_alta'), product.get('nivel_ejecucion'),product.get('nivel_importancia'));

    _.each(facet.get('pendientes'),function(pend,key){
        console.log('Facet: [%s]: estado:[%s] prioridad:[%s]', key, pend.estado, pend.prioridad);

    });

    product.setFacet(token, facet);


  };



  var filterFactory = function (documents){
    var fd = DocManager.Entities.FilteredCollection({
        collection: documents,

        filterFunction: function(filterCriterion){
          var criteria = filterCriterion.toLowerCase();
          return function(document){
            //console.log('filterfunction:[%s]vs [%s]/[%s]/[%s]',criteria,document.get("tipocomp"),document.get("cnumber"),document.get("slug"));
            if(document.get("tipocomp").toLowerCase().indexOf(criteria) !== -1
              || document.get("slug").toLowerCase().indexOf(criteria) !== -1
              || document.get("cnumber").toLowerCase().indexOf(criteria) !== -1){
              
              return document;
            }
          }
        }
    });
    return fd;
  };

  var queryFactory = function (documents){
    var fd = DocManager.Entities.FilteredCollection({
        collection: documents,

        filterFunction: function(query){
          return function(document){
            var test = true;
            //if((query.tipocomp.trim().indexOf(document.get('tipocomp'))) === -1 ) test = false;
            console.log('filterfunction:TEST: [%s] [%s] [%s] [%s]',test, query.tipoitem,document.get("tipoitem"),document.get("cnumber"));
            if(query.tipoitem && query.tipoitem!=='no_definido') {
              if(query.tipoitem.trim() !== document.get('tipoitem')) test = false;
            }
            if(query.tipomov && query.tipomov !=='no_definido') {
              if(query.tipomov.trim() !== document.get('tipomov')) test = false;
            }
            if(query.estado && query.estado!=='no_definido') {
              if(query.estado.trim() !== document.get('estado_alta')) test = false;
            }
            if(query.fedesde.getTime()>document.get('fechagestion_tc')) test = false;
            if(query.fehasta.getTime()<document.get('fechagestion_tc')) test = false;

            if(query.slug){
              if(utils.fstr(document.get("slug").toLowerCase()).indexOf(utils.fstr(query.slug)) === -1 && document.get("cnumber").toLowerCase().indexOf(query.slug.toLowerCase()) === -1) test = false;
            }

            if(test) return document;
          }
        }
    });
    return fd;
  };

  var reportQueryFactory = function (reports){
    var fd = DocManager.Entities.FilteredCollection({
        collection: reports,

        filterFunction: function(query){
          return function(report){
            var test = true;
            //if((query.tipocomp.trim().indexOf(report.get('tipocomp'))) === -1 ) test = false;
            //console.log('filterfunction:TEST: [%s] [%s] [%s] [%s]',test, query.tipoitem,report.get("tipoitem"),report.get("cnumber"));

            if(query.estado) {
              if(query.estado.trim() !== report.get('estado_alta')) test = false;
            }

            if(query.slug){
              if(utils.fstr(report.get("pslug").toLowerCase()).indexOf(utils.fstr(query.slug)) === -1 && report.get("cnumber").toLowerCase().indexOf(query.slug.toLowerCase()) === -1) test = false;
            }

            if(test) return report;
          }
        }
    });
    return fd;
  };

  var queryCollection = function(query){
      var comprobantes = new Entities.ComprobanteCollection();
      var defer = $.Deferred();
      comprobantes.fetch({
        success: function(data){
          defer.resolve(data);
        }
      });
      var promise = defer.promise();
      return promise;
  };

  var fetchDocumentItemlist = function(documents){
    var itemCol = new Entities.ComprobanteCollection();
    documents.each(function(model){
      var items = model.get('items');
      model.set({documid: model.id});
      //console.log('Iterando doc:[%s] itmes[%s]',model.get('cnumber'),model.get('tipocomp'),items.length);
      _.each(items, function(item){
        if(dao.docum.isType(item.tipoitem, 'notas')){
          var sitems = item.items;
          _.each(sitems, function(sitem){

            var smodel = new Entities.Comprobante(model.attributes);
            smodel.id = null;
            smodel.set({
              fechagestion: model.get('fecomp'),
              fechagestion_tc: model.get('fecomp_tc'),
              tipoitem: item.tipoitem,
              tipomov: item.tipomov||item.tipoitem,
              product: sitem.product,
              productid: sitem.productid,
              pslug: sitem.pslug,
              tcomputo: sitem.durnominal
            })
            itemCol.add(smodel);

          });

        }else if (dao.docum.isType(item.tipoitem, 'nsolicitud')){
          var sitems = item.items;
          _.each(sitems, function(sitem){

            var smodel = new Entities.Comprobante(model.attributes);
            smodel.id = null;

            smodel.set({
              fechagestion: model.get('fecomp'),
              fechagestion_tc: model.get('fecomp_tc'),
              tipoitem: item.tipoitem,
              tipomov: item.tipomov||item.tipoitem,
              product: sitem.trequerim,
              productid: "",
              pslug: sitem.description,
              tcomputo: ''
            })
            itemCol.add(smodel);

          });

        }else if (dao.docum.isType(item.tipoitem, 'pemision')){
          var sitems = item.items;
          _.each(sitems, function(sitem){
            var emisiones = sitem.emisiones;
            _.each(emisiones, function(emision){

              var smodel = new Entities.Comprobante(model.attributes);
              var feg = utils.addOffsetDay(item.fedesde_tc,emision.dayweek);
              smodel.id = null;
              smodel.set({
                fechagestion: feg.date,
                fechagestion_tc: feg.tc,
                tipoitem: item.tipoitem,
                tipomov: item.tipoitem,
                product: sitem.product,
                productid: sitem.productid,
                pslug: sitem.pslug,
                tcomputo: sitem.durnominal
              })
              itemCol.add(smodel);

            });
          });

        }else if (dao.docum.isType(item.tipoitem, 'pdiario')){
            var smodel = new Entities.Comprobante(model.attributes);
            smodel.id = null;
            smodel.set({
              fechagestion: model.get('fecomp'),
              fechagestion_tc: model.get('fecomp_tc'),
              tipoitem: item.tipoitem,
              tipomov: item.activity,
              product: item.entity,
              productid: item.entityid,
              pslug: item.slug,
              tcomputo: ( (item.feultmod - item.fealta) /1000*60)
            })
            itemCol.add(smodel);

        }else if (dao.docum.isType(item.tipoitem, 'ptecnico')){

          var smodel = new Entities.Comprobante(model.attributes);
          smodel.id = null;
          smodel.set({
            fechagestion: item.fept,
            fechagestion_tc: item.fept_tc,
            tipoitem: item.tipoitem,
            tipomov: item.estado_qc,
            product: item.product,
            productid: item.productid,
            pslug: item.pslug,
            tcomputo: item.durnominal
          })
          itemCol.add(smodel);

        }
      })

    });
    //console.log('returning ItemCol [%s]',itemCol.length)
    return itemCol;

  };
  
  var isValidDocum = function(docum, query){
    if(query.tcompList.indexOf(docum.get('tipocomp')) === -1) return false;
    return true;
  };

  var isValidNota = function(docum,item, query){
    if(query.tcompList.indexOf(docum.get('tipocomp')) === -1) return false;
    if(query.tmovList[docum.get('tipocomp')].indexOf(item.tipomov) === -1) return false;
    if(query.fedesde > docum.get('fecomp_tc')) return false;
    if(query.fehasta < docum.get('fecomp_tc')) return false;
    return true;
  };
  var isValidPE = function(reportItem, query){
    if(query.tcompList.indexOf(reportItem.get('tipocomp')) === -1) return false;
    if(query.fedesde > reportItem.get('fechagestion_tc')) return false;
    if(query.fehasta < reportItem.get('fechagestion_tc')) return false;
    return true;
  };
  var isvalidPT = function(reportItem, query){
    if(query.tcompList.indexOf(reportItem.get('tipocomp')) === -1) return false;
    if(query.fedesde > reportItem.get('fechagestion_tc')) return false;
    if(query.fehasta < reportItem.get('fechagestion_tc')) return false;
    return true;
  };


  var fetchReportItems = function(docum, query, reportCol){
      var items = docum.get('items');
      //console.log('Iterando doc:[%s] itmes[%s]',docum.get('cnumber'),docum.get('tipocomp'),items.length);
 
      _.each(items, function(item){
        if(dao.docum.isType(item.tipoitem, 'notas')){
          if(isValidNota(docum,item, query)){
            var sitems = item.items;
            _.each(sitems, function(sitem){
              var reportItem = new Entities.ReportItem();
              reportItem.set({
                fechagestion: docum.get('fecomp'),
                fechagestion_tc: docum.get('fecomp_tc'),
                tipocomp: docum.get('tipocomp'),
                tipoitem: item.tipoitem,
                cnumber: docum.get('cnumber'),
                documid: docum.id,
                tipomov: item.tipomov||item.tipoitem,
                product: sitem.product,
                productid: sitem.productid,
                pslug: sitem.pslug,
                tcomputo: sitem.durnominal,
                persona: docum.get('persona'),
                personaid: docum.get('personaid'),
                estado_alta: 'alta',
              });

              reportCol.add(reportItem);
            });
          }

        }else if (dao.docum.isType(item.tipoitem, 'pemision')){
          var sitems = item.items;
          _.each(sitems, function(sitem){
            var emisiones = sitem.emisiones;
            _.each(emisiones, function(emision){
              var feg = utils.addOffsetDay(item.fedesde_tc,emision.dayweek);
              var reportItem = new Entities.ReportItem();
              reportItem.set({
                fechagestion: feg.date,
                fechagestion_tc: feg.tc,
                tipocomp: docum.get('tipocomp'),
                tipoitem: item.tipoitem,
                cnumber: docum.get('cnumber'),
                documid: docum.id,
                tipomov: item.tipoitem,
                product: sitem.product,
                productid: sitem.productid,
                pslug: sitem.pslug,
                tcomputo: sitem.durnominal,
                persona: docum.get('persona'),
                personaid: docum.get('personaid'),
                estado_alta: 'alta',
              });

              if(isValidPE(reportItem, query)){
                reportCol.add(reportItem);
              }

            });
          });

        }else if (dao.docum.isType(item.tipoitem, 'ptecnico')){
          var reportItem = new Entities.ReportItem();
          reportItem.set({
            fechagestion: item.fept,
            fechagestion_tc: item.fept_tc,
            tipocomp: docum.get('tipocomp'),
            tipoitem: item.tipoitem,
            cnumber: docum.get('cnumber'),
            documid: docum.id,
            tipomov: item.estado_qc,
            product: item.product,
            productid: item.productid,
            pslug: item.pslug,
            tcomputo: item.durnominal,
            persona: docum.get('persona'),
            personaid: docum.get('personaid'),
            estado_alta: 'alta',
          });

          if(isvalidPT(reportItem, query)){
            reportCol.add(reportItem);
          }

        }
      })

  };

  var buildReportItemList = function(documents, query){
    var itemCol = new Entities.ReportItemCollection();
    documents.each(function(model){
      if(isValidDocum(model, query)){
        fetchReportItems(model, query, itemCol);
      }

    });


    //console.log('returning ItemCol [%s]',itemCol.length)
    return itemCol;

  };


  var fetchProductDuration = function(col, cb){
    var products = new DocManager.Entities.ProductCollection();
    products.fetch({success: function() {
      col.each(function(model){

        var pr = products.find(function(produ){
          //console.log('testing: [%s] vs [%s] / [%s] [%s]',produ.id, model.get('productid'), produ.get('productcode'),model.get('product'))
          return produ.id===model.get('productid');
        });

        if(pr){
          //console.log('pr:[%s] model:[%s]',pr.get('productcode'),model.get('product'));
          var dur = pr.get('patechfacet').durnominal;
          if(!dur ) dur = "0";
          if(parseInt(dur,10)===NaN) dur="0";
          model.set({tcomputo: dur});
        }else{
          model.set({tcomputo: '0'});
        }
      });

      if(cb) cb();
    }});
  };
  var groupByResults = function(query,col){
    //console.log('groupByResults [%s] fecha:[%s]/[%s]',query.resumen,query.fedesde,query.fehasta);
    var grupos = [];
    if(query.resumen){
      if(query.resumen==='producto'){
        //console.log('groupByResults: PRODUCTO');
        col.each(function(item){
          var gr = _.find(grupos,function(elem){
            //return (elem.productid == item.get('productid')&& elem.persona=== item.get('persona')&& elem.tipomov ===item.get('tipomov'));
            return (elem.productid == item.get('productid') && elem.tipoitem ===item.get('tipoitem') && elem.tipomov ===item.get('tipomov'));
          })
          if(gr){
            gr.tcomputo = utils.addTC(gr.tcomputo, item.get('tcomputo'));
            //(parseInt(item.get('tcomputo'),10)==NaN) ? 0 : parseInt(item.get('tcomputo'),10) ;
          }else{
            var res = {
              cnumber: 'resumen',
              productid: item.get('productid'),
              product: item.get('product'),
              persona: '',
              //persona: item.get('persona'),
              tipomov: item.get('tipomov'),
              tipoitem:item.get('tipoitem'),
              tipocomp:item.get('tipocomp'),
              tcomputo: utils.addTC('00', item.get('tcomputo')),
               //tcomputo: (parseInt(item.get('tcomputo'),10)==NaN) ? 0 : parseInt(item.get('tcomputo'),10)
            }
            grupos.push(res);
          }
        });
        //console.log('GROUBY TERMINADO: [%s]',grupos.length)

      } else if(query.resumen==='entidad'){
        //console.log('groupByResults: ENTIDAD');
        var grupos = [];
        col.each(function(item){
          var gr = _.find(grupos,function(elem){
            return (elem.persona == item.get('persona') && elem.tipoitem ===item.get('tipoitem') && elem.tipomov ===item.get('tipomov'));
          })
          if(gr){
            //gr.tcomputo += (parseInt(item.get('tcomputo'),10)===NaN) ? 0 : parseInt(item.get('tcomputo'),10) ;
            gr.tcomputo = utils.addTC(gr.tcomputo, item.get('tcomputo'));
          }else{
            var res = {
              cnumber: 'resumen',
              persona: item.get('persona'),
              product:'',
              productid:'',
              tipoitem:item.get('tipoitem'),
              tipocomp:item.get('tipocomp'),
              tipomov: item.get('tipomov'),
              tcomputo: utils.addTC('00', item.get('tcomputo')),
              //tcomputo: (parseInt(item.get('tcomputo'),10)===NaN) ? 0 : parseInt(item.get('tcomputo'),10)
            }
            grupos.push(res);
          }
        });
        //console.log('GROUBY TERMINADO: [%s]',grupos.length)
        //for (i in grupos){
          //console.log('grupos:[%s] [%s] [%s] [%s] ',i,grupos[i].persona,grupos[i].tipomov,grupos[i].tcomputo);
        //}
      }
    }
    if(grupos.length){
      _.each(grupos, function(item){
        var docResumen = new Entities.Comprobante(item);
        docResumen.set({fechagestion:'',});
        col.add(docResumen);
      })
    }
  };

  var API = {
    getEntities: function(){
      var comprobantes = new Entities.ComprobanteCollection();
      var defer = $.Deferred();
      comprobantes.fetch({
        success: function(data){
          defer.resolve(data);
        }
      });
      var promise = defer.promise();
      return promise;
    },

    getFilteredCol: function(criteria, cb){
      var fetchingDocuments = API.getEntities();

      $.when(fetchingDocuments).done(function(documents){
        var filteredDocuments = filterFactory(documents);
        console.log('getQuery')
        if(criteria){
          filteredDocuments.filter(criteria);
        }
        if(cb) cb(filteredDocuments);
      });
    },

    getFilteredByQueryCol: function(query, cb){
      var fetchingDocuments = queryCollection(query);

      $.when(fetchingDocuments).done(function(documents){
        var docitems = fetchDocumentItemlist(documents);

        var filteredDocuments = queryFactory(docitems);
        if(query){
          filteredDocuments.filter(query);
        }
        fetchProductDuration(filteredDocuments,function(){
          groupByResults(query,filteredDocuments);
          if(cb) cb(filteredDocuments);
        })
      });
    },

    getEntity: function(entityId){
      var comprobante = new Entities.Comprobante({_id: entityId});
      var defer = $.Deferred();
      if(entityId){
        comprobante.fetch({
          success: function(data){
            defer.resolve(data);
          },
          error: function(data){
            defer.resolve(undefined);
          }
       });
      }else{
        defer.resolve(comprobante);
      }
      return defer.promise();
    },

    fetchNextPrev: function(type, model, cb){
      var query = {};
      if(type === 'fetchnext') query.cnumber = { $gt : model.get('cnumber')}
      if(type === 'fetchprev') query.cnumber = { $lt : model.get('cnumber')}

      var comprobantes= new Entities.ComprobanteFindOne();
      comprobantes.fetch({
          data: query,
          type: 'post',
          success: function() {
              if(cb) cb(comprobantes.at(0));
          }
      });
    },

    buildReportData: function(report, cb){
      console.log('buildReportData, ready to BEGIN');
      var query = getQueryParameters(report);
      //console.dir(query);


      var fetchingDocuments = queryCollection(query);

      $.when(fetchingDocuments).done(function(documents){
        console.log('Documents  FETCHED [%s]',documents.length);
        var docitems = buildReportItemList(documents, query);
        console.log('Docu items FETCHED [%s]',docitems.length);

        var filteredDocuments = reportQueryFactory(docitems);
        if(query){
          filteredDocuments.filter(query);
        }
        console.log('Docu Items FILTERED [%s]',filteredDocuments.length);

        fetchProductDuration(filteredDocuments,function(){
          console.log('Docu Items DURATION [%s]',filteredDocuments.length);
          //groupByResults(query,filteredDocuments);
          if(cb) cb(filteredDocuments);
        })

      });

    }

  };
  var getQueryParameters = function(report){
    var query = {};
    
    query.fedesde = utils.buildDateNum(report.get('fedesde'));
    query.fehasta = utils.buildDateNum(report.get('fehasta'));
    /*
     * Tipos de Movimiento:    tipomovqueryOptionList    / tipomovOptionList
     * Tipos de Comprobantes:  tipoComprobanteOptionList / tipoDocumItemOptionList
     *
     *
     *
     *
     */

    if(report.get('tipomov')==='esitseniales'){
      query.tipoinforme = report.get('tipomov');
      query.tcompList = ['npedido', 'pemision', 'nentrega'];
      query.tmovList ={
        npedido:['reqadherente'],
        pemision:['pemision'],
        nentrega:['distribucion']
      };
      query.estado = 'alta';
      query.slug = 'historia';
    }

    return query;
  };

  DocManager.reqres.setHandler("document:entities", function(){
    return API.getEntities();
  });

  DocManager.reqres.setHandler("document:filtered:entities", function(criteria, cb){
    return API.getFilteredCol(criteria,cb);
  });

  DocManager.reqres.setHandler("document:query:entities", function(query, cb){
    return API.getFilteredByQueryCol(query,cb);
  });

  DocManager.reqres.setHandler("document:entity", function(id){
    return API.getEntity(id);
  });

  DocManager.reqres.setHandler("document:fetchprev", function(model, cb){
    return API.fetchNextPrev('fetchprev',model, cb);
  });

  DocManager.reqres.setHandler("document:fetchnext", function(model, cb){
    return API.fetchNextPrev('fetchnext',model, cb);
  });


  DocManager.reqres.setHandler("report:buildData", function(model, cb){
    return API.buildReportData(model, cb);
  });


});
