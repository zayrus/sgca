
var Activity = Backbone.Model.extend({
    urlRoot: "/activities/controller",
    whoami: 'activity:backboneModel ',
    idAttribute: "_id",

   initialize: function () {
    },

    defaults: {
        _id: null,
        eventname:'',
        data:{},
        query:{},
    }
});

var ActivityCollection = Backbone.Collection.extend({

    model: Activity,
    
    initialize: function (model, options) {
    },

    url: "/activities"

});



$(function(){

    setTimeout(function(){
    console.log('========UNO=========');

    var activity = new Activity({
        eventname:'user:pdiario',
        data:{
            header:{
/*
                tipocomp:'pdiario',
                slug:'parte diario usuario',
                estado_alta:'completado',
                nivel_ejecucion:'completado',

*/            },

            item:{
                tipoitem: 'pdiario',
                slug:'alta parte diario',
                tipomov: 'ptecnico',
                activity: 'verificacion',

                entitytype: 'product',
                entity: 'M100003',
                entitiyid:'132412412341234123',
                
                docum: 'T100001',
                documid: '12341241241',
                
                result: 'APROBADO',

            },
        },

        query:{
            tipocomp: 'pdiario',
            tipomov: 'ptecnico',
            activity: 'verificacion',
        }
    });
    activity.save();
    }, 500);

    setTimeout(function(){
    console.log('========DOS=========');
    var activity = new Activity({
        eventname:'user:pdiario',
        data:{
            header:{
                tipocomp:'pdiario',
                slug:'catalogación producto audiovisual',
                estado_alta:'completado',
                nivel_ejecucion:'completado',
            },

            item:{
                tipoitem: 'pdiario',
                slug:'catalogacion',
                tipomov: 'visualizacion',
                activity: 'catalogacion',

                entitytype: 'product',
                entity: 'M100003',
                entitiyid:'132412412341234123',
                
                docum: 'NONE',

                result: 'Atributos modificados',
            },
        },

        query:{
            tipocomp: 'pdiario',
            tipomov: 'catalogacion',
            activity: 'visualizacion',
        }
    });
    activity.save();
    }, 1500);


    setTimeout(function(){
    console.log('========TRES=========');
    var activity = new Activity({
        eventname:'user:pdiario',
        data:{
            header:{
/*
                tipocomp:'pdiario',
                slug:'parte diario usuario',
                estado_alta:'completado',
                nivel_ejecucion:'completado',

*/            },

            item:{
                tipoitem: 'pdiario',
                slug:'alta parte diario',
                tipomov: 'ptecnico',
                activity: 'verificacion',

                entitytype: 'product',
                entity: 'M100005',
                entitiyid:'dfasdfasd112341234123',
                
                docum: 'T100001',
                documid: '12341241241',
                
                result: 'RECHAZADO',

            },
        },

        query:{
            tipocomp: 'pdiario',
            tipomov: 'ptecnico',
            activity: 'verificacion',
        }
    });
    activity.save();
    }, 2500);


    setTimeout(function(){
    console.log('======== CUATRO =========');
    var activity = new Activity({
        eventname:'user:pdiario',
        data:{
            header:{
/*
                tipocomp:'pdiario',
                slug:'parte diario usuario',
                estado_alta:'completado',
                nivel_ejecucion:'completado',

*/            },

            item:{
                tipoitem: 'pdiario',
                slug:'alta parte diario',
                tipomov: 'ptecnico',
                activity: 'verificacion',

                entitytype: 'product',
                entity: 'M100005',
                entitiyid:'dfasdfasd112341234123',
                
                docum: 'T100001',
                documid: '12341241241',
                
                result: 'RECHAZADO',

            },
        },

        query:{
            tipocomp: 'pdiario',
            tipomov: 'ptecnico',
            activity: 'verificacion',
        }
    });
    activity.save();
    }, 3500);    

});
