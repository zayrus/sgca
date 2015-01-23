DocManager.module("Entities", function(Entities, DocManager, Backbone, Marionette, $, _){
  Entities.User = Backbone.Model.extend({

    whoami: 'User:models.js ',
    urlRoot: "/usuarios",

    idAttribute: "_id",

    validate: function(attrs, options) {
      var errors = {}
      if (! attrs.username) {
        errors.username = "no puede quedar en blanco";
      }

      if( ! _.isEmpty(errors)){
        return errors;
      }
    },

    beforeUpdate: function() {
        this.set({feum:new Date().getTime()});
        this.set({username:this.get('mail')});
    },

    update: function(key, data, cb){
        var self = this;
        if(!self.id){
          console.log('NO PUEDO HACER UPDATE: Falta el ID [%s] [%s]',self.id, self.get('username'));
          return;
        }
        self.fetch({
          success: function(model){
            model.beforeUpdate();
            model.set(key, data);
            model.save(null, {
                success: function (model) {
                    console.log('udate user:SUCCESS: [%s] ',model.get('username'));

                    if(cb) cb(model);
                },
                error: function () {
                    console.log('ERROR: Ocurrió un error al intentar actualizar este nodo: [%s]',model.get('username'));
                }
            });          
          }
        });
    },

    defaults : {
        _id: null,
        displayName:'',
        username:'',
        password:'',
        mail:'',
        roles:[],
        fealta:'',
        grupo: '',
        roles: '',
        estado_alta:'pendaprobacion',
        verificado: {
            mail:false,
            feaprobado: null,
            adminuser: '',
        },
        conduso:[]
    }
  });

  //Entities.configureStorage(Entities.User);

  Entities.UserCollection = Backbone.Collection.extend({

    model: Entities.User,
    url: "/usuarios",

    comparator: "nickName"
  });

  Entities.UserFetchCollection = Backbone.Collection.extend({

    model: Entities.User,
    url: "/recuperar/usuarios",

    comparator: "username",

    initialize: function (model, options) {
       if(options) this.options = options;
    },
});



  var API = {

    getUserByUsername: function(username){
      var entity = new Entities.UserFetchCollection(),
          query = {username: username},
          defer = $.Deferred();

      entity.fetch({
        data: query,
        type: 'post',

        success: function(data){
          defer.resolve(data);
        },
        error: function(data){
          defer.resolve(undefined);
        }
      });
      return defer.promise();
    },

    getEntity: function(entityId){
      var entity = new Entities.User({_id: entityId});
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

  DocManager.reqres.setHandler("user:by:username", function(username){
    return API.getUserByUsername(username);
  });

  DocManager.reqres.setHandler("user:entity", function(id){
    return API.getEntity(id);
  });


});
