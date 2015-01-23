
  Product = Backbone.Model.extend({

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


    getFacet: function(token){
      var self = this;
      var facet ;


      if(token === 'editestados'){

        facet = new ProductStateFacet({
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

      //console.log('RETURN FACET: [%s] [%s]',name,facet.get('key'));
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

      }else if(token ==='editestados'){
        query.newdata['estado_alta'] = facet.get('estado_alta');
        query.newdata['nivel_ejecucion'] = facet.get('nivel_ejecucion');
        query.newdata['nivel_importancia'] = facet.get('nivel_importancia');
        query.newdata.pendientes = facet.get('pendientes');
        //console.log('SAVING editestados [%s] [%s]', query.newdata.pendientes.qcalidad.cumplido,query.newdata.pendientes.qcalidad.cumplido===true);
      }

      
 
      //console.log('UPDATE: [%s] [%s]', key, token)
      var update = new ProductUpdate(query);
      update.save({
        success: function() {
        }
      });

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

  ProductUpdate = Backbone.Model.extend({
    whoami: 'ProductUpdate:product.js ',

    urlRoot: "/actualizar/productos",

  });


  //configureStorage(Product);

  ProductCollection = Backbone.Collection.extend({

    model: Product,

    url: "/productos",

    comparator: "productcode"
  });

  ProductChildCollection = Backbone.Collection.extend({

    model: Product,

    url: "/navegar/productos",

    comparator: "productcode",
  });


  ProductStateFacet = Backbone.Model.extend({
      whoami:'ProductTechFacet:product.js',
      
      retrieveData: function(){
          return dao.extractData(this.attributes);
      },

      process: function(target){
        if(target.type==='checkbox'){
          //console.log('PROCESS:product ProductStateFacet [%s] [%s] [%s]o[%s]', target.name, target.checked, (target.checked===false), (target.checked===true));
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
        this.set('pendientes', null);
        this.setPendingsFromExecutionState();
    
  /*
        var pendientes = {};
        _.each(utils.papendingsOptionList,function(token){
          pendientes[token.val] = {
                  cumplido: false,
                  prioridad: 'media'
          };
        });      
        this.set('pendientes',pendientes);
  */      
      },
      setPendingsFromExecutionState: function(){
        var nejecucion = this.get('nivel_ejecucion');
        var pendientes = this.get('pendientes');

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
          var pendiente = pendientes[key];

          //console.log('Revs PendingList: key:[%s]  cumplido:[%s]', key, pendiente.cumplido);
          if(!pendiente.cumplido){
            var required = _.every(lista, function(el){
              return pendientes[el].cumplido;
            });

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

var ejecucion = ['no_definido','planificado','gestion','recibido','chequeado','qcalidad','catalogacion','observado','rechazado','aprobado','preservado','requisicion','distribucion','emision'];

$(function(){
/*
    setTimeout(function(){
    
    }, 500);

*/    
    var nej;

    var productCol = new ProductCollection();
    productCol.fetch({
        success: function(){
                var val = 0;

            productCol.each(function(model){

                if(ejecucion.indexOf(model.get('nivel_ejecucion')) === -1){
                    nej = 'chequeado';
                    model.set('nivel_ejecucion', nej);
                } else {
                    nej = model.get('nivel_ejecucion');
                }

                if(model.get('es_capitulo_de')) {
                  model.set('nivel_ejecucion','no_definido');

                }
                model.set('nivel_importancia', 'alta');
                model.set('estado_alta', 'activo');

                var facet = model.getFacet('editestados');

                /*
                console.log('Product Colection:[%s]  estado:[%s] nivel_ejecucion:[%s] prioridad:[%s]',model.get('productcode'),model.get('estado_alta'), model.get('nivel_ejecucion'),model.get('nivel_importancia'));
                _.each(facet.get('pendientes'),function(pend,key){
                    if(val<0){
                        val+=1;
                        console.log('Facet: [%s]: estado:[%s] prioridad:[%s]', key, pend.estado, pend.prioridad);
                    }

                });
                */
                
                model.setFacet('editestados', facet);


            });
        }
    })

});
/*
function showOffsetPos (sId) {
  var nLeft = 0, nTop = 0;

  for (var oItNode = document.getElementById(sId); 
         oItNode; 
         nLeft += oItNode.offsetLeft, 
         nTop += oItNode.offsetTop, 
         oItNode = oItNode.offsetParent
         );
  alert("Offset position of \"" + sId + "\" element:\n left: " + nLeft + "px;\n top: " + nTop + "px;");
}
*/