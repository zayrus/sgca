DocManager.module("Entities", function(Entities, DocManager, Backbone, Marionette, $, _){
  
  Entities.Budget = Backbone.Model.extend({
    urlRoot: "/presupuestos",
    whoami: 'Entities.Budget:budget.js ',

    idAttribute: "_id",





    defaults: {
      _id: null,

      // datos heredados de Action
      owner_id: "",
      owner_type: 'action',
      parent_cnumber: '',
      parent_slug: '',
      program_cnumber: '',
      nodo: "",
      area: "",


      tipomov: "presupuesto",
      slug: "",

      tramita: "MCN",
      origenpresu: "MCN",
      anio_fiscal: "2015",
      trim_fiscal: "1",
      fecha_prev: "",
      description: "",
      presuprog: "",
      presuinciso: "",


      tgasto: "no_definido",
      cgasto: "111.111",
      importe: "0",
      isactive: "1",
      freq: "1",
      umefreq: "global",
      cantidad: "1",
      ume: "global",
      punit: "0",
      monto: "0",
      coldh: "0",
      presuprog: "",
      presuinciso: "",

      nivel_ejecucion: "enevaluacion",
      estado_alta: "activo",
      nivel_importancia: "media",
      useralta: "",
      fealta: "",
      feultmod: "",
      items:[],
    },

    enabled_predicates:['es_relacion_de'],

    updateInheritData: function(action){
      var self = this;
      self.set({
        owner_type: 'action',
        owner_id: action.id,
        parent_cnumber: action.get('cnumber'),
        parent_slug: action.get('slug'),
        nodo: action.get('nodo'),
        area: action.get('area'),
        program_cnumber: action.get('cnumber')
      });
    },

    updateCurrentUsertData: function(cb){
      var self = this,
          person;
      dao.gestionUser.getUser(DocManager, function (user){
        if(!self.get('useralta' || !self.id)){
          self.set('useralta', user.id);
        }
        self.set('userultmod', user.id);

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
    
    initBeforeCreate: function(action, user, cb){
      var self = this,
          fealta = new Date(),
          fecomp = utils.dateToStr(fealta);

      self.set({fealta:fealta.getTime(), fecomp: fecomp});
      //console.log('InitBeforeCreate!!!!!!!!!!!!!!!!!!!!! [%s][%s]', self.get('gasto'),self.get('slug'));
      self.updateInheritData(action);
      self.updateCurrentUsertData(cb);
 
    },

    beforeSave: function(action, cb){
      var self = this;
      var fecha = new Date();
      //console.log('initBefore SAVE')
      if(!self.id || !self.get('feata')){
        self.set({fealta:fecha.getTime()})
        fecomp = utils.dateToStr(fecha);
      }
      self.set({feultmod:fecha.getTime()})
      console.log('********** Merde: T:[%s] ', self.get('tgasto'));
      self.set('cgasto', utils.fetchListKey(utils.tipoBudgetMovimList, self.get('tgasto'))['cgasto'] );

      self.updateInheritData(action);
      self.updateCurrentUsertData(cb);


    },
    
    
    update: function(action, cb){
      console.log('[%s] UPDATE MODEL owner:[%s]',this.whoami, action.get('slug'));
      var self = this;
      self.beforeSave(action, function(docum){
        var errors ;
        //console.log('ready to SAVE');
        if(!self.save(null,{
          success: function(model){
            //console.log('callback SUCCESS')
            
            // log Activity
            //logActivity(model);
            // log Activity

            //Change Product State
            //changeProductState(model);
            //Change Product State

            cb(null,model);

           }
          })) {
            cb(self.validationError,null);
        }            
      });

    },


    partialUpdate: function(token, facet, list){
      //facet: es un model o un hash de claves
      //token: 'content': toma las keys directamente de facet
      //       'estado_alta': solo actualiza esta key en base a facet
      // list: opcional. Un array con la lista de _id de registros a actualizar.
      //
      var self = this;
      var query = {};

      if(list){
        query.nodes = list;
      }else{
        query.nodes = [self.id];
      }

      query.newdata = {};

      if(token==='content'){
        query.newdata = facet;

      }else if(token ==='estado_alta'){
        query.newdata['estado_alta'] = facet;

      }else{
        // no se qué hacer... mejor me voy
        return;
      }

  
      //console.log('partial UPDATE: [%s] [%s]', token, facet);
      var update = new Entities.BudgetUpdate(query);
      update.save({
        success: function() {
        }
      });
      //log ACTIVITY
      //logActivity(token, self, data);
      //
    },

    validate: function(attrs, options) {
      //if(!attrs) return;
      var errors = {}
      //console.log('validate [%s] [%s] [%s]',attrs, _.has(attrs,'taccion'), attrs.taccion);

      if (_.has(attrs,'taccion') && (!attrs.taccion|| attrs.taccion.length==0)) {
        errors.taccion = "No puede ser nulo";
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

    fetchEditFacet: function(){
      return new Entities.BudgetCoreFacet(this.attributes,{formType:'long'});
    },

    saveFromPlanningFacet: function(){

    },
  });


  Entities.BudgetPlanningCollection = Backbone.Collection.extend({
    whoami: 'Entities.BudgetPlanningCollection:budget.js ',
    url: "/navegar/presupuestos",
    model: Entities.BudgetPlanningFacet,
    sortfield: 'tgasto',
    sortorder: -1,

    comparator: function(left, right) {
      var order = this.sortorder;
      var l = left.get(this.sortfield);
      var r = right.get(this.sortfield);

      if (l === void 0) return -1 * order;
      if (r === void 0) return 1 * order;

      return l < r ? (1*order) : l > r ? (-1*order) : 0;
    },

    saveAll: function(action, user, opt){
      var self = this,
          budget;

      console.log('SaveAll BEGINS [%s]', self.length);
      self.each(function (budFacet){
        budget = budFacet.budgetFactory();
        if(budget){
          console.log('BINGO: ready to update[%s] items:[%s]', budget.get('tgasto'), budget.get('items').length)
          budget.update(action, function(error, budget){
            console.log('budget Saved: [%s]', budget.get('tgasto'));
          });

        }
      })
    },

    addBudget: function(budget){
      this.add(budget);
      this.listenTo(budget, 'budget:cost:changed', this.evaluateTotalCost);
      //budget.on('budget:cost:changed', this.evaluateTotalCost, this);
      //this.evaluateTotalCost();
    },

    removeBudget: function(budget){
      this.remove(budget);
    },

    evaluateTotalCost: function(){
      console.log('TOTAL COST BEGINGS')
      if(!this.costoactual){
        this.costoactual = 0;
      }
      var costo_total = 0;

      this.each(function(budget){
        costo_total += budget.evaluateCosto();
      });
      if (this.costoactual !== costo_total){
        console.log('COSTO TOTAL ACCION: [%s] >> [%s]', this.costoactual, costo_total);
        this.trigger('action:cost:changed', costo_total);
      }
      this.costoactual = costo_total;
      return costo_total;
    },

  });



  Entities.BudgetCoreFacet = Backbone.Model.extend({
    //urlRoot: "/comprobantes",
    whoami: 'BudgetCoreFacet:budget.js ',

    initialize: function(attributes, options){
      var self = this;
      self.options = options;
      //console.log('[%s] INITIALIZE  [%s]',self.whoami, arguments.length);

      if(options.formType === 'short'){
        self.schema = self.schema_short;

      }else if(options.formType === 'multiedit'){
        self.schema = self.schema_multiedit;
      
      }else{
        self.schema = self.schema_long;
      }
    },

    schema_short: {
        tgasto:       {type: 'Select',    title:'Tipo de Gasto', options: utils.tipoBudgetMovimList },
        slug:         {type: 'Text',      title: 'Asunto',            editorAttrs:{placeholder:'descripción corta'}},
        importe:      {type: 'Text',      title: 'Importe',           editorAttrs:{placeholder:'importe en pesos FINAL'}},
        trim_fiscal:  {type: 'Number',    title: 'Trimestre fiscal',  editorAttrs:{placeholder:'Indique 1/2/3/4 Trimestre ejecución presupuestaria'}},
        description:  {type: 'TextArea',  title: 'Descripción ejecutiva'},
        cantidad:     {type: 'Number',    title: 'Cantidad',          editorAttrs:{placeholder:'en unidades'}},
        ume:          {type: 'Select',    title: 'Unidad de medida',  editorAttrs:{placeholder:'unidad de medida'},options: utils.umeList },
    },

    schema_long: {
        tgasto:       {type: 'Select',    title:'Tipo de Gasto', options: utils.tipoBudgetMovimList },
        slug:         {type: 'Text',      title: 'Asunto',            editorAttrs:{placeholder:'descripción corta'}},
        cantidad:     {type: 'Number',    title: 'Cantidad',          editorAttrs:{placeholder:'en unidades'}},
        ume:          {type: 'Select',    title: 'Unidad de medida',  editorAttrs:{placeholder:'unidad de medida'},options: utils.umeList },
        importe:      {type: 'Text',      title: 'Importe',           editorAttrs:{placeholder:'importe en pesos FINAL'}},
        fecha_prev:   {type: 'Text',      title: 'Fecha prev ejecución', editorAttrs:{placeholder:'dd/mm/aaaa'}},
        trim_fiscal:  {type: 'Number',    title: 'Trimestre fiscal',  editorAttrs:{placeholder:'Indique 1/2/3/4 Trimestre ejecución presupuestaria'}},
        anio_fiscal:  {type: 'Text',      title: 'Año fiscal',        editorAttrs:{placeholder:'Indique año fiscal (2015)'}},
        origenpresu:  {type: 'Select',    title: 'Origen presupuesto', editorAttrs:{placeholder:'fuente presupuestaria'},options: utils.budgetOriginList },
        tramita:      {type: 'Select',    title: 'Tramitación',  editorAttrs:{placeholder:'unidad ejecutora'},options: utils.budgetTramitaPorList },
        description:  {type: 'TextArea',  title: 'Descripción ejecutiva'},
        presuprog:    {type: 'Text',      title: 'Programa presupuestrio',  editorAttrs:{placeholder:'fuente de crédito presupuestario'}},
        presuinciso:  {type: 'Text',      title: 'Inciso / actividad',  editorAttrs:{placeholder:'fuente de crédito presupuestario'}},
        estado_alta:  {type: 'Select',options: utils.actionAltaOptionList, title:'Estado alta ' },
        nivel_ejecucion: {type: 'Select',options: utils.budgetEjecucionOptionList, title:'Nivel ejecución' },
        nivel_importancia: {type: 'Select',options: utils.actionPrioridadOptionList, title:'Importancia' },
    },

    schema_multiedit: {
        tgasto:       {type: 'Select',    title: 'Tipo Gasto', options: utils.tipoBudgetMovimList },
        trim_fiscal:  {type: 'Number',    title: 'Trim Fiscal',  editorAttrs:{placeholder:'Indique 1/2/3/4 Trimestre ejecución presupuestaria'}},
        origenpresu:  {type: 'Select',    title: 'Orig Presupuesto', editorAttrs:{placeholder:'fuente presupuestaria'},options: utils.budgetOriginList },
        tramita:      {type: 'Select',    title: 'Forma Tramitación',  editorAttrs:{placeholder:'unidad ejecutora'},options: utils.budgetTramitaPorList },
        estado_alta:  {type: 'Select',options: utils.actionAltaOptionList, title:'Estado alta ' },
        nivel_ejecucion: {type: 'Select',options: utils.budgetEjecucionOptionList, title:'Nivel ejecución' },
        nivel_importancia: {type: 'Select',options: utils.actionPrioridadOptionList, title:'Nivel Importancia' },
    },


    //idAttribute: "_id",

    createNewInstance: function(action, user, cb){
      var self = this;
      var budget = new Entities.Budget(self.attributes);

      //console.log('[%s]: createNewBudget',self.whoami);

      budget.initBeforeCreate(action, user, function(budget){
        budget.save(null, {
          success: function(model){
            cb(null,model);
          }
        });
      });
    },

    updateModel: function(model){
      model.set(this.attributes)
      return model;
    },

    partialUdateModel: function(model){
      var self = this;
      model.set(self.attributes)
      var facetData = {
          tgasto:       self.get('tgasto'),
          slug:         self.get('slug'),
          cantidad:     self.get('cantidad'),
          ume:          self.get('ume'),
          importe:      self.get('importe'),
          fecha_prev:   self.get('fecha_prev'),
          trim_fiscal:  self.get('trim_fiscal'),
          anio_fiscal:  self.get('anio_fiscal'),
          origenpresu:  self.get('origenpresu'),
          tramita:      self.get('tramita'),
          description:  self.get('description'),
          presuprog:    self.get('presuprog'),
          presuinciso:  self.get('presuinciso'),
          estado_alta:  self.get('estado_alta'),
          nivel_ejecucion: self.get('nivel_ejecucion'),
          nivel_importancia:self.get('nivel_importancia'),      
      };
      model.partialUpdate('content', facetData);

    },

    multiupdate: function(list){
      console.log('multiupdate BEGIN:[%s]', list);
      var self = this,
          attrlist = _.keys(self.schema_multiedit),
          facetData = {},
          attResult = {},
          selectedModels = 0,
          attribute;

      _.each(attrlist, function(key){
        if(self.get(key) && self.get(key) !== 'no_definido'){
          facetData[key] = self.get(key);
        }
      });
      var model = new Entities.Budget(facetData);
      model.partialUpdate('content',facetData, list);
      return facetData;
    },

    defaults: {
      _id: null,
      owner_id: "",
      owner_type: 'action',
      program_cnumber: '',
      tipomov: "presupuesto",
      slug: "",
      nodo: "",
      area: "",
      parent_cnumber: '',
      parent_slug: '',

      description: "",

      fecha_prev: "01/01/2015",
      anio_fiscal: "2015",
      trim_fiscal: "1",

      tramita: "MCN",
      origenpresu: "MCN",
      presuprog: "",
      presuinciso: "",

      tgasto: "no_definido",
      cgasto: "111.111",
      cantidad: "1",
      punit: "1",
      importe: "",
      ume: "global",
      coldh: "0",

      nivel_ejecucion: "enevaluacion",
      estado_alta: "activo",
      nivel_importancia: "media",
      useralta: "",
      fealta: "",
      feultmod: "",
    },

   });

  Entities.BudgetTypeFacet = Backbone.Model.extend({
    //urlRoot: "/comprobantes",
    whoami: 'BudgetTypeFacet:budget.js ',

    schema: {
      roles:         { type: 'List', itemType: 'Text', title: 'Rubros de Presupuesto' }
    },

    defaults: {
      _id: null,
      roles:['global', 'artistica', 'tecnica','contratos', 'muestras', 'derechos','logistica','impresiones','difusion', 'subsidios'],
      tgasto:'',
    },

   });


  Entities.BudgetHeaderFacet = Backbone.Model.extend({
    //urlRoot: "/comprobantes",
    whoami: 'BudgetHeaderFacet:budget.js ',

    schema: {
        tgasto:       {type: 'Select',    title:'Tipo de Gasto', options: utils.tipoBudgetMovimList },
        slug:         {type: 'Text',      title: 'Asunto',            editorAttrs:{placeholder:'descripción corta'}},
        cantidad:     {type: 'Number',    title: 'Cantidad',          editorAttrs:{placeholder:'en unidades'}},
        ume:          {type: 'Select',    title: 'Unidad de medida',  editorAttrs:{placeholder:'unidad de medida',options: utils.umeList }},
        importe:      {type: 'Text',      title: 'Importe',           editorAttrs:{placeholder:'importe en pesos FINAL'}},
        trim_fiscal:  {type: 'Number',    title: 'Trimestre fiscal',  editorAttrs:{placeholder:'Indique 1/2/3/4 Trimestre ejecución presupuestaria'}},
        description:  {type: 'TextArea',  title: 'Descripción ejecutiva'},
    },
    //idAttribute: "_id",

    updateModel: function(model){
      var self = this.
          area;

      model.set(this.attributes)
      area = model.get('area')
      if(area){
        model.set('nodo', utils.fetchNode(utils.budgetAreasOptionList, area));
      }
      return model;
    },

    defaults: {
      _id: null,

      // datos heredados de Action
      owner_id: "",
      owner_type: 'action',
      parent_cnumber: '',
      parent_slug: '',
      program_cnumber: '',
      nodo: "",
      area: "",

      tipomov: "presupuesto",

      slug: "",
      tramita: "MCN",
      origenpresu: "MCN",
      anio_fiscal: "2015",
      trim_fiscal: "1",
      fecha_prev: "",
      description: "",

      tgasto: "no_definido",
      cgasto: "111.111",
       importe: "",
      isactive: "1",
      freq: "1",
      umefreq: "global",
      cantidad: "",
      ume: "global",
      punit: "",
      monto: "",
      coldh: "0",
      presuprog: "",
      presuinciso: "",

      nivel_ejecucion: "enevaluacion",
      estado_alta: "activo",
      nivel_importancia: "media",
      useralta: "",
      fealta: "",
      feultmod: "",
      items:[],
    },

   });


  Entities.BudgetPlanningFacet = Backbone.Model.extend({
    whoami: 'Entities.BudgetPlanningFacet:budget.js ',

    urlRoot: "/actualizar/presupuestos",

    initialize: function(options){
 
      if(!parseInt(this.get('montomanual'))){
        this.set('montomanual', this.get('importe'));
      }
 
      if(this.get('tgasto') === 'global'){
        this.set('isdetallado', this.get('isdetallado') || '0');
      }else{
        this.set('isdetallado', this.get('isdetallado') || '1');
      }

    },

    schema: {
        slug:         {type: 'Text',      title: 'Descripción ejecutiva',            editorAttrs:{placeholder:'descripción corta'}},
        freq:         {type: 'Number',    title: 'Frecuencia (días/show)',    editorAttrs:{placeholder:'veces que aplica a la cantidad'}},
        umefreq:      {type: 'Select',    title: 'Unidad de frecuencia',  editorAttrs:{placeholder:'unidad de frecuencia (show/día/mes/etc.'},options: utils.umeFreqList },
        cantidad:     {type: 'Number',    title: 'Cantidad',          editorAttrs:{placeholder:'en unidades'}},
        ume:          {type: 'Select',    title: 'Unidad de medida',  editorAttrs:{placeholder:'unidad de medida'},options: utils.umeList },
 
        fecha_prev:   {type: 'Text',      title: 'Fecha prev ejecución', editorAttrs:{placeholder:'dd/mm/aaaa'}},
        trim_fiscal:  {type: 'Number',    title: 'Trimestre fiscal',  editorAttrs:{placeholder:'Indique 1/2/3/4 Trimestre ejecución presupuestaria'}},
        anio_fiscal:  {type: 'Text',      title: 'Año fiscal',        editorAttrs:{placeholder:'Indique año fiscal (2015)'}},
        origenpresu:  {type: 'Select',    title: 'Origen presupuesto', editorAttrs:{placeholder:'fuente presupuestaria'},options: utils.budgetOriginList },
        tramita:      {type: 'Select',    title: 'Tramitación',  editorAttrs:{placeholder:'unidad ejecutora'},options: utils.budgetTramitaPorList },
        description:  {type: 'TextArea',  title: 'Descripción ejecutiva'},
        isdetallado:  {type: 'Number',    title: 'Presupuesto Detallado? (1/0)',  editorAttrs:{placeholder:'1: Detallado - 0: Costo total informado manualmente'}},
        montomanual:  {type: 'Text',      title: 'Costo informado manual',        editorAttrs:{placeholder:'importe en pesos FINAL informado.'}},
        presuprog:    {type: 'Text',      title: 'Programa presupuestrio',  editorAttrs:{placeholder:'fuente de crédito presupuestario'}},
        presuinciso:  {type: 'Text',      title: 'Inciso / actividad',  editorAttrs:{placeholder:'fuente de crédito presupuestario'}},

        estado_alta:  {type: 'Select',options: utils.actionAltaOptionList, title:'Estado alta ' },
        nivel_ejecucion: {type: 'Select',options: utils.budgetEjecucionOptionList, title:'Nivel ejecución' },
        nivel_importancia: {type: 'Select',options: utils.actionPrioridadOptionList, title:'Importancia' },
    },

    addItemBudget: function(item){
      this.itemsCol.add(item);
      this.listenTo(item, 'budgetitem:cost:changed', this.evaluateCosto);
      this.trigger('item:budget:added');
      //this.evaluateCosto();
    },

    trashItem:function(item){
      this.itemsCol.remove(item);
      this.trigger('item:budget:removed');
      this.evaluateCosto();
    },

    trashMe: function(){
      if(this.get('_id')){
        this.set('estado_alta', 'baja');
        this.evaluateCosto();
        return true;
      }else{
        return false;
      }
    },

    cloneMe: function(){
      var self = this;
      var clone = self.budgetFactory();
      return clone;
    },

    evaluateItems: function(){
      var items = this.itemsCol;
      var costodetallado = 0;

      if(items){
        if(items.length){
          items.each(function(item){
            var itemcost = item.evaluateCosto();
            costodetallado += itemcost;
            //console.log('evaluate Items[%s] [%s]', itemcost, costodetallado)
          })
        }
      }
      return costodetallado;
    },

    evaluateCosto: function(){
      //console.log('EvaluateCosto CABECERA BEGIN');
      var previouscost = parseInt(this.get('importe'));
      var isactive = parseInt(this.get('isactive')) === 1 ? 1 : 0;
      var isdetallado = parseInt(this.get('isdetallado')) === 1 ? 1 : 0;
      var isvalid = this.get('estado_alta') === 'activo' ? 1 : 0;
      var freq = parseInt(this.get('freq'));
      var cantidad = parseInt(this.get('cantidad'));
      var montomanual = parseInt(this.get('montomanual'));

      var punit = this.evaluateItems();

      var importe = (isvalid * isactive * isdetallado * freq * cantidad * punit) + (1-isdetallado) * (isvalid * isactive * montomanual);
      //console.log('CABECERA: isactive:[%s] isdetallado:[%s]  freq:[%s] cant:[%s] montomanual:[%s] punit:[%s] importe:[%s] previouscost:[%s]',isactive, isdetallado, freq, cantidad, montomanual, punit, importe, previouscost)

      this.set('punit', punit);
      this.set('importe', importe);

      if(previouscost !== importe){
        console.log(' BUDGET: triggering cost:changed');
        this.trigger('budget:cost:changed');
      }
      return importe;
    },

    fetchBudgetItems: function(stype){
      var items,
          self = this,
          budgetsCol,
          budgetItem,
          type = self.get('tgasto'),
          deflist = utils.budgetTemplate[type];

      if(self.itemsCol) return itemsCol;

      items = self.get('items');

      if(items.length){
        budgetsCol = new DocManager.Entities.BudgetItemsCollection(items);
        self.itemsCol = budgetsCol;

      }else{
        var budgetsCol = new DocManager.Entities.BudgetItemsCollection();
        self.itemsCol = budgetsCol;

        _.each(deflist, function(elem){
          if(elem.val !== 'no_definido'){
            budgetItem = new DocManager.Entities.BudgetItemFacet(self.attributes);

            budgetItem.set({
              sgasto:elem.val,
              cgasto: elem.cgasto,
              slug: '',
              ume:elem.ume,
              importe: 0,
              montomanual: 0,
              punit: 0,
            })
            budgetItem.evaluateCosto();

            self.addItemBudget(budgetItem);
          }
        });        
      }

      return budgetsCol;
    },

    budgetFactory: function(){
      var self = this,
          budget;

      if(self.hasRelevantCost()){
        self.buildItemsArray();
        budget = new Entities.Budget(self.attributes);
        return budget;
      }else{
        return null;
      }
    },

    hasRelevantCost: function(){
      var self = this,
          importe;

      importe = self.evaluateCosto();
      if (importe || !parseInt(this.get('isactive')) ){
        return true;
      }
      return false;
    },

    buildItemsArray: function(){
      var self = this,
          items=[],
          importe;
      
      //console.log('BudgetFactory: building items:[%s]', self.itemsCol.length);

      if(self.itemsCol){
        //console.log('BudgetFactory: building items:[%s]', self.itemsCol.length);
        self.itemsCol.each(function(budgetItem){
          importe = budgetItem.evaluateCosto();
          console.log('BudgetFactory: building items:[%s] [%s]', budgetItem.get('sgasto'), importe);
          if(importe || !parseInt(budgetItem.get('isactive')) ){
            budgetItem.set('cgasto', utils.fetchListKey(utils.budgetTemplate[budgetItem.get('tgasto')], budgetItem.get('sgasto'))['cgasto'] );
            items.push(budgetItem.attributes);
          }
        });
      }
      self.set('items', items);
    },

    defaults: {
      _id: null,

      slug: "",
      tramita: "MCN",
      origenpresu: "MCN",
      anio_fiscal: "2015",
      trim_fiscal: "1",
      fecha_prev: "",
      description: "",

      tgasto: "no_definido",
      cgasto: "111.111",
      montomanual: "0",
      importe: "0",
      isactive: "1",
      freq: "1",
      umefreq: "global",
      cantidad: "1",
      ume: "global",
      punit: "1",
      monto: "0",
      coldh: "0",
      presuprog: "",
      presuinciso: "",

      estado_alta: "activo",
      nivel_ejecucion: "enevaluacion",
      nivel_importancia: "media",

      items:[],
    },
  });

  Entities.BudgetItemFacet = Backbone.Model.extend({
    whoami: 'Entities.BudgetItemFacet:budget.js ',

    urlRoot: "/actualizar/presupuestos",
    initialize: function(options){
      //console.log('[%s] INITIALIZE: Tipo de gasto:[%s]',this.whoami, this.get('tgasto'))
      this.schema = this.buildSchema();

    },

    getOptions: function(){
      return utils.budgetTemplate[this.get('tgasto')];
    },

    buildSchema: function(){
      var self = this;
      var schema = {
          sgasto:       {type: 'Select',    title:'Tipo de Gasto', options: self.getOptions() },

          slug:         {type: 'Text',      title: 'Descripción del gasto',            editorAttrs:{placeholder:'descripción corta'}},
          freq:         {type: 'Number',    title: 'Frecuencia (días/ show)',    editorAttrs:{placeholder:'veces que aplica a la cantidad'}},
          umefreq:      {type: 'Select',    title: 'Unidad de frecuencia',  editorAttrs:{placeholder:'unidad de frecuencia (show/día/mes/etc.'},options: utils.umeFreqList },
          cantidad:     {type: 'Number',    title: 'Cantidad',          editorAttrs:{placeholder:'en unidades'}},
          ume:          {type: 'Select',    title: 'Unidad de medida',  editorAttrs:{placeholder:'unidad de medida'},options: utils.umeList },

          punit:        {type: 'Text',      title: 'Costo unitario',           editorAttrs:{placeholder:'costo/ precio unitario'}},
   
          fecha_prev:   {type: 'Text',      title: 'Fecha prev ejecución', editorAttrs:{placeholder:'dd/mm/aaaa'}},
          trim_fiscal:  {type: 'Number',    title: 'Trimestre fiscal',  editorAttrs:{placeholder:'Indique 1/2/3/4 Trimestre ejecución presupuestaria'}},
          anio_fiscal:  {type: 'Text',      title: 'Año fiscal',        editorAttrs:{placeholder:'Indique año fiscal (2015)'}},
          origenpresu:  {type: 'Select',    title: 'Origen presupuesto', editorAttrs:{placeholder:'fuente presupuestaria'},options: utils.budgetOriginList },
          tramita:      {type: 'Select',    title: 'Tramitación',  editorAttrs:{placeholder:'unidad ejecutora'},options: utils.budgetTramitaPorList },
          description:  {type: 'TextArea',  title: 'Descripción ejecutiva'},
          presuprog:    {type: 'Text',      title: 'Programa presupuestrio',  editorAttrs:{placeholder:'fuente de crédito presupuestario'}},
          presuinciso:  {type: 'Text',      title: 'Inciso / actividad',  editorAttrs:{placeholder:'fuente de crédito presupuestario'}},

          isdetallado:  {type: 'Number',    title: 'Presupuesto Detallado? (1/0)',  editorAttrs:{placeholder:'1: Detallado - 0: Costo total informado manualmente'}},
          montomanual:  {type: 'Text',      title: 'Costo informado manual',        editorAttrs:{placeholder:'importe en pesos FINAL informado.'}},

      };
      return schema;
    },

    toggleActivate: function(){
      this.set('isactive', (1 - this.get('isactive')));
    },

    evaluateCosto: function(){
      var previouscost = parseInt(this.get('importe'));
      var isactive = parseInt(this.get('isactive')) === 1 ? 1 : 0;
      var isdetallado = parseInt(this.get('isdetallado')) === 1 ? 1 : 0;
      var freq = parseInt(this.get('freq'));
      var cantidad = parseInt(this.get('cantidad'));

      var punit = parseInt(this.get('punit'));
      var montomanual = parseInt(this.get('montomanual'));
      
      //console.log('DETALLE: isactive:[%s] isdetallado:[%s]  freq:[%s]  montomanual:[%s] punit:[%s] ',isactive, isdetallado, freq, montomanual, punit)
      var importe = (isactive * isdetallado * freq * cantidad * punit) + (1-isdetallado) * (isactive * montomanual);
      this.set('importe', importe);
      if(previouscost !== importe){
        console.log(' ITEM: triggering cost:changed');
        this.trigger('budgetitem:cost:changed');
      }
      return importe;
    },

    defaults: {
      _id: null,


      slug: "",
      tgasto: "",
      sgasto: "",
      cgasto: "111.111",
      importe: "0",
      montomanual: "0",
      isactive: "1",
      isdetallado: "1",
      freq: "1",
      umefreq: "global",
      cantidad: "0",
      ume: "global",
      punit: "0",
      monto: "0",
      coldh: "0",
      presuprog: "",
      presuinciso: "",
    },
  });

  Entities.BudgetItemsCollection = Backbone.Collection.extend({
    whoami: 'Entities.BudgetItemsCollection:budget.js ',
    url: "/navegar/presupuestos",
    model: Entities.BudgetItemFacet,
    sortfield: 'tgasto',
    sortorder: -1,

    getByCid: function(model){
      return this.filter(function(val) {
        return val.cid === model.cid;
      })
    },

    comparator: function(left, right) {
      var order = this.sortorder;
      var l = left.get(this.sortfield);
      var r = right.get(this.sortfield);

      if (l === void 0) return -1 * order;
      if (r === void 0) return 1 * order;

      return l < r ? (1*order) : l > r ? (-1*order) : 0;
    },
  });


  Entities.BudgetUpdate = Backbone.Model.extend({
    whoami: 'Entities.BudgetUpdate:budget.js ',

    urlRoot: "/actualizar/presupuestos",

  });


  //Accion Collection
  Entities.BudgetCollection = Backbone.Collection.extend({
    whoami: 'Entities.BudgetCollection:accion.js ',
    url: "/presupuestos",
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

    exportRecords: function(){
      var self = this;
      if(!self.length) return;

      //console.log('collection export [%s]',self.length);


      exportFactory.processRequest(exportFactory.fetchCollection(self));
      //

    },
  });

  var exportFactory = {
    exportHeadings: [
        {val:'program_cnumber',   label:'Programa',         itemType: 'Text'},
        {val:'tipomov',           label:'Registro',         itemType: 'Text'},
        {val:'tgasto:',           label:'TipoDeGasto',      itemType: 'Text'},
        {val:'cantidad',          label:'Cantidad',         itemType: 'Number'},
        {val:'importe',           label:'Importe',          itemType: 'Number'},
        {val:'ume',               label:'UME',              itemType: 'Text'},

        {val:'slug',              label:'Descripcion',      itemType: 'Text'},
        {val:'nodo',              label:'Nodo',             itemType: 'Text'},
        {val:'area',              label:'Area',             itemType: 'Text'},
        {val:'parent_cnumber',    label:'Accion',           itemType: 'Text'},
        {val:'parent_slug',       label:'DenomAccion',      itemType: 'Text'},

        {val:'fecha_prev',        label:'FechaEjecucion',   itemType: 'Date'},
        {val:'anio_fiscal',       label:'AnioFiscal',       itemType: 'Number'},
        {val:'trim_fiscal',       label:'TrimFiscal',       itemType: 'Number'},

        {val:'tramita',           label:'TramitaPor',       itemType: 'Text'},
        {val:'origenpresu',       label:'OrigenPresu',      itemType: 'Text'},
        {val:'presuprog',         label:'Preventiva',       itemType: 'Text'},
        {val:'presuinciso',       label:'Inciso',           itemType: 'Text'},

        {val:'nivel_ejecucion',   label:'Ejecucion',        itemType: 'Text'},
        {val:'estado_alta',       label:'Alta',             itemType: 'Text'},
        {val:'nivel_importancia', label:'Relevancia',       itemType: 'Text'},
        {val:'descriptores',      label:'Descriptores',     itemType: 'Text'},
    ],

    fetchCollection: function(collection){
      var self = this,
          colItems = [],
          registro,
          data;

      collection.each(function(model){
        registro = [];
        _.each(self.exportHeadings, function(token){
            data = model.get(token.val)|| 'sin_dato';
            registro.push(data);
          });
        colItems.push(registro);
      });
      return colItems;
    },

    fetchLabels: function(){
      return this.exportHeadings;
    },

    processRequest: function(col){
      var self = this;
      var query = {
          name: 'Items del Presupuesto',
          heading: self.fetchLabels(),
          data: JSON.stringify(col)
      };
      //console.log(JSON.stringify(query));

      $.ajax({
        type: "POST",
        url: "/excelbuilder",
        dataType: "json",
        //contentType:"application/jsonrequest",
        data: query,
        success: function(data){
            //console.dir(data);
            window.open(data.file)

        }
      });


    }
  };

  Entities.BudgetNavCollection = Backbone.Collection.extend({
    whoami: 'Entities.BudgetNavCollection:accion.js ',
    url: "/navegar/presupuestos",
    model: Entities.Budget,
    sortfield: 'cgasto',
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
  
  Entities.BudgetsFindOne = Backbone.Collection.extend({
    whoami: 'Entities.BudgetsFindOne:accion.js ',
    url: "/accion/fetch",
    model: Entities.Budget,
    comparator: "cnumber",
  });

  Entities.BudgetsUpdate = Backbone.Collection.extend({
    whoami: 'Entities.BudgetsUpdate:accion.js ',
    url: "/actualizar/accions",
    model: Entities.Budget,
    comparator: "cnumber",
  });


  /*
   * ******* FACETA PARA CREAR UNA NUEVA ACCION +**********
   */
  Entities.BudgetNewFacet = Backbone.Model.extend({
    whoami: 'BudgetNewFacet:accion.js ',

    validate: function(attrs, options) {
      //if(!attrs) return;
      var errors = {}
      //console.log('validate [%s] [%s] [%s]',attrs, _.has(attrs,'tipoitem'), attrs.tipoitem);

      if (_.has(attrs,'tipoitem') && (!attrs.tipitem )) {
        errors.taccion = "No puede ser nulo";
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

      itemCol.add(model);
      self.insertItemCollection(itemCol);
      return itemCol;
    },

    insertItemCollection: function(itemCol) {
        var self = this;
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
      model.set('items', items);
      model.update(cb);

    },


    defaults: {
      _id: null,
      cnumber: "",
      tregistro:"",
      taccion: "",
      feaccion: "",
      slug: "budgeto nuevoO",
      estado_alta:'media',
      nivel_ejecucion: "enevaluacion",
      nivel_importancia: 'alta',
      description: "",
      items:[]
    },


  });


  Entities.BudgetQueryFacet = Backbone.Model.extend({
    //urlRoot: "/comprobantes",
    whoami: 'ActionQueryFacet:comprobante.js ',

    schema: {
        fedesde:  {type: 'Date',   title: 'Desde', placeholder:'dd/mm/aaaa', yearEnd:2018},
        fehasta:  {type: 'Date',   title: 'HastaA', placeholder:'dd/mm/aaaa', yearEnd:2018},
        tgasto:   {type: 'Select', options: utils.tipoBudgetMovimList, title:'Tipo de Gasto' },
        nodo:     {type: 'Select', options: utils.actionNodosOptionList, title:'Nodo' },
        area:     {type: 'Select', options: utils.actionAreasOptionList, title:'Área/Nodo' },
        slug:     {type: 'Text',   title: 'Denominación'},
        ejecucion:{type: 'Select', options: utils.budgetEjecucionOptionList, title:'Nivel ejecución' },
    },

    defaults: {
      fedesde:'',
      fehasta:'',
      tgasto:'',
      area: '',
      slug: '',
      ejecucion:''
    }
  });


  var filterFactory = function (budgets){
    var fd = DocManager.Entities.FilteredCollection({
        collection: budgets,

        filterFunction: function(filterCriterion){
          var criteria = filterCriterion.toLowerCase();
          return function(budget){
            //console.log('filterfunction:[%s]vs [%s]/[%s]/[%s]',criteria,budget.get("taccion"),budget.get("cnumber"),budget.get("slug"));
            if(budget.get("taccion").toLowerCase().indexOf(criteria) !== -1
              || budget.get("slug").toLowerCase().indexOf(criteria) !== -1
              || budget.get("cnumber").toLowerCase().indexOf(criteria) !== -1){
              
              return budget;
            }
          }
        }
    });
    return fd;
  };

  var queryFactory = function (budgets){
    var fd = DocManager.Entities.FilteredCollection({
        collection: budgets,

        filterFunction: function(query){
          return function(budget){
            var test = true;
            //if((query.taccion.trim().indexOf(budget.get('taccion'))) === -1 ) test = false;
            //console.log('filterfunction:TEST: [%s] [%s] [%s] [%s]',test, query.tgasto,budget.get("tipomov"),budget.get("cnumber"));
            if(query.tgasto && query.tgasto!=='no_definido') {
              if(query.tgasto.trim() !== budget.get('tgasto')) test = false;
            }

            if(query.area && query.area !=='no_definido') {
              if(query.area.trim() !== budget.get('area')) test = false;
            }

            if(query.nodo && query.nodo !=='no_definido') {
              if(query.nodo.trim() !== utils.fetchNode(utils.actionAreasOptionList, budget.get('area'))){
               test = false;
             }
            }

            if(query.ejecucion && query.ejecucion!=='no_definido') {
              if(query.ejecucion.trim() !== budget.get('nivel_ejecucion')) test = false;
            }

            if(query.fedesde.getTime()>budget.get('fealta')) test = false;
            if(query.fehasta.getTime()<budget.get('fealta')) test = false;

            if(query.slug){
              if(utils.fstr(budget.get("slug").toLowerCase()).indexOf(utils.fstr(query.slug)) === -1 && budget.get("cnumber").toLowerCase().indexOf(query.slug.toLowerCase()) === -1) test = false;
            }

            if(test) return budget;
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
            //if((query.taccion.trim().indexOf(report.get('taccion'))) === -1 ) test = false;
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
      var accions = new Entities.BudgetCollection();
      var defer = $.Deferred();
      accions.fetch({
        success: function(data){
          defer.resolve(data);
        }
      });
      var promise = defer.promise();
      return promise;
  };



  var API = {
    getEntities: function(){
      var accions = new Entities.BudgetCollection();
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
      var fetchingBudgets = API.getEntities();

      $.when(fetchingBudgets).done(function(budgets){
        var filteredBudgets = filterFactory(budgets);
        if(criteria){
          filteredBudgets.filter(criteria);
        }
        if(cb) cb(filteredBudgets);
      });
    },

    getFilteredByQueryCol: function(query, cb){
      var fetchingBudgets = queryCollection(query);

      $.when(fetchingBudgets).done(function(budgets){

        var filteredBudgets = queryFactory(budgets);
        if(query){
          filteredBudgets.filter(query);
        }
        if(cb) cb(filteredBudgets);

      });
    },

    getEntity: function(entityId){
      var accion = new Entities.Budget({_id: entityId});
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

      var accions= new Entities.BudgetsFindOne();
      accions.fetch({
          data: query,
          type: 'post',
          success: function() {
              if(cb) cb(accions.at(0));
          }
      });
    },
  }


  DocManager.reqres.setHandler("budget:entities", function(){
    return API.getEntities();
  });

  DocManager.reqres.setHandler("budget:filtered:entities", function(criteria, cb){
    return API.getFilteredCol(criteria,cb);
  });

  DocManager.reqres.setHandler("budget:query:entities", function(query, cb){
    return API.getFilteredByQueryCol(query,cb);
  });

  DocManager.reqres.setHandler("budget:entity", function(id){
    return API.getEntity(id);
  });

  DocManager.reqres.setHandler("budget:fetchprev", function(model, cb){
    return API.fetchNextPrev('fetchprev',model, cb);
  });

  DocManager.reqres.setHandler("budget:fetchnext", function(model, cb){
    return API.fetchNextPrev('fetchnext',model, cb);
  });

});
