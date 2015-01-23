MediaManager.module("Entities", function(Entities, MediaManager, Backbone, Marionette, $, _){
  
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
      slug: "",
      estado_alta:'activo',
      nivel_ejecucion: 'enproceso',
      description: "",
      items:[]
    },

    enabled_predicates:['es_relacion_de'],
    
    initBeforeCreate: function(){
      var fealta = new Date(),
          fecomp = utils.dateToStr(fealta),
          documitems = [];

      this.set({fealta:fealta.getTime(), fecomp: fecomp});

      if(dao.docum.isType(this.get('tipocomp'), 'ptecnico')){
          var ptecnico = new Entities.DocumParteTecnico();
          ptecnico.set({
              tipoitem: this.get('tipocomp'),
              slug: this.get('slug'),
              fept: this.get('fecomp'),
          });
          documitems.push(ptecnico.attributes);
          this.set({items: documitems});
      } else if(dao.docum.isType(this.get('tipocomp'), 'pemision')){
          var parte = new Entities.DocumParteEM();
          parte.set({
              tipoitem: this.get('tipocomp'),
              slug: this.get('slug'),
              tipoemis:"tda",
          });
          documitems.push(parte.attributes);
          this.set({items: documitems});
      } else if(dao.docum.isType(this.get('tipocomp'), 'notas')){
          var parte = new Entities.DocumMovimRE(),
              sitems = [];
          parte.set({
              tipoitem: this.get('tipocomp'),
              slug: this.get('slug'),
          });
          documitems.push(parte.attributes);
          this.set({items: documitems});
      }
    },

    beforeSave: function(){
      console.log('initBefore SAVE')
      var feultmod = new Date();
      this.set({feultmod:feultmod.getTime()})
    },

    update: function(cb){
      console.log('update')
      var self = this;
      self.beforeSave();
      var errors ;
      console.log('ready to SAVE');
      if(!self.save(null,{
        success: function(model){
          //console.log('callback SUCCESS')
          cb(null,model);
         }
        })) {
          cb(self.validationError,null);
      }    


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
      npedido:{
        initNew: function(self, attrs){
          var item = new Entities.DocumMovimRE(attrs);
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
    if(attrs.tipoitem==='nentrega')   model = new Entities.DocumMovimRE(attrs);
    if(attrs.tipoitem==='npedido')    model = new Entities.DocumMovimRE(attrs);
    if(attrs.tipoitem==='pemision')   model = new Entities.DocumParteEM(attrs);
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



  var modelSubItemFactory = function(attrs, options){
    //utils.inspect(attrs,1,'modelFactory');
    //console.log('modelSubFactory: [%s]',options.tipoitem)
    var model;
    if(options.tipoitem==='ptecnico')   model = new Entities.DocumParteTecnicoItem(attrs);
    if(options.tipoitem==='nrecepcion') model = new Entities.DocumMovimREItem(attrs);
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
 
    whoami: 'DocumItemCoreFacet:comprobante.js ',

    schema: {
        tipoitem: {type: 'Select',options: utils.tipoDocumItemOptionList, title:'Tipo ítem' },
        slug:     {type: 'Text', title: 'Descripción corta'},
    },

    createNewDocument: function(cb){
      var self = this;
      var docum = new Entities.Comprobante(self.attributes);
      docum.initBeforeCreate();

      docum.save(null, {
        success: function(model){
          cb(null,model);
        }
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

      docum.initBeforeCreate();

      docum.save(null, {
        success: function(model){
          cb(null,model);
        }
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

  var filterFactory = function (documents){
    var fd = MediaManager.Entities.FilteredCollection({
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
    var fd = MediaManager.Entities.FilteredCollection({
        collection: documents,

        filterFunction: function(query){
          return function(document){
            var test = true;
            //console.log('filterfunction:[%s] vs [%s]/[%s]/[%s]',query.tipocomp,document.get("tipocomp"),document.get("cnumber"),(query.tipocomp.indexOf(document.get('tipocomp'))));
            //if((query.tipocomp.trim().indexOf(document.get('tipocomp'))) === -1 ) test = false;
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

        }else if (dao.docum.isType(item.tipoitem, 'pemision')){
          var sitems = item.items;
          _.each(sitems, function(sitem){
            var emisiones = sitem.emisiones;
            _.each(emisiones, function(emision){

              var smodel = new Entities.Comprobante(model.attributes);
              smodel.id = null;
              smodel.set({
                fechagestion: item.fedesde,
                fechagestion_tc: item.fedesde_tc,
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
    console.log('returning ItemCol [%s]',itemCol.length)
    return itemCol;

  };
  var fetchProductDuration = function(col, cb){
    var products = new MediaManager.Entities.ProductCollection();
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
      comprobante.fetch({
        success: function(data){
          defer.resolve(data);
        },
        error: function(data){
          defer.resolve(undefined);
        }
      });
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
    }

  };

  MediaManager.reqres.setHandler("document:entities", function(){
    return API.getEntities();
  });

  MediaManager.reqres.setHandler("document:filtered:entities", function(criteria, cb){
    return API.getFilteredCol(criteria,cb);
  });

  MediaManager.reqres.setHandler("document:query:entities", function(query, cb){
    return API.getFilteredByQueryCol(query,cb);
  });

  MediaManager.reqres.setHandler("document:entity", function(id){
    return API.getEntity(id);
  });

  MediaManager.reqres.setHandler("document:fetchprev", function(model, cb){
    return API.fetchNextPrev('fetchprev',model, cb);
  });

  MediaManager.reqres.setHandler("document:fetchnext", function(model, cb){
    return API.fetchNextPrev('fetchnext',model, cb);
  });

});
