window.HomeView = Backbone.View.extend({
	whoami: 'homeview:home.js',

    initialize:function () {
        console.log('HomeView initialize [%s] [%s] [%s] ', this.model.get('mail2'), this.model.get('description'), this.model.get('mail'));
        this.render();
    },

  	events: {
        "click .altausuario"       : "formuser",
        "click .js-login-submit"   : 'loginuser',
        "click .js-newUser"   : 'newuser',
        "change": "change",
    },

    newuser: function(){
        var self = this;
        console.log('New User');
        self.formuser();
    },
    
    loginuser: function(event){
        var e = event.originalEvent;
        //event.stopPropagation();
        //event.preventDefault();
        //e.stopPropagation();
        //e.preventDefault();

        var self = this;

        console.log('********  LOGIN user submit: [%s] [%s]', this.model.get('username'), this.model.get('password'));

 /*       var usercol = new Backbone.Collection(this.model.attributes,{
            url: "/login",
            model: User
        })
*/
/*
        $.ajax({
            data: {username:self.model.get('username'),password:self.model.get('password')},
            //username: self.model.get('username'),
            //password: self.model.get('password'),
            username: self.model.get('username'),
            password: self.model.get('password'),
            type: 'post',
            url: '/login',
            success: function() {
                console.log('callback SUCCESS');
            }
        });
*/
/*
        this.model.save(null, {
            success: function (model) {
                console.log('Login Callback success[%s]', model);
            },
            error: function () {
                console.log('Login Callback error');
            }
        });
*/
    },

    change: function(event){
        var target = event.target;
        var change = {};
        change[target.name] = target.value;
        this.model.set(change);
    },


    formuser: function () {
    	console.log('[%s] formuser BEGIN [%s][%s] [%s]', this.whoami, this.model.get('displayName'), this.model.get('mail'), this.model.get('description'));
        Backbone.Form.validators.errMessages.required = 'Dato requerido';
        Backbone.Form.validators.errMessages.email = 'No es un correo válido';
        Backbone.Form.validators.errMessages.match = 'El dato no coincide';
        var self = this,
            //usermodel = this.model,
            userfacet = new UserFacet(self.model),
            form = new Backbone.Form({
                model: userfacet,
            });

        form.on('termsofuse:change', function(form, editorContent) {
            //var errors = form.commit({validate:true});
            //console.log('***Blur:key: [%s] [%s]  ', editorContent.key, editorContent.getValue() );

            //var errors = form.commit({validate:true});
            //console.log('change: errors: [%s]', errors);
        });

        form.on('username:blur', function(form, editorContent) {
            console.log('***Blur:key: [%s] value:[%s]', editorContent.key,editorContent.getValue());

            userfacet.validusername(editorContent.getValue(),function(error){
                if(error){
                    form.fields[editorContent.key].setError('Ya existe este usuario en la base de datos');
                    //var errors = form.commit({validate:true});
                }else{
                    form.fields[editorContent.key].clearError();
                    form.fields[editorContent.key].validate();
                }
            });
        });
 
        form.on('termsofuse:blur passwordcopia:blur username:blur mail:blur displayName:blur', function(form, editorContent) {
            //var errors = form.fields[editorContent.key].validate();
            //var errors = form.commit();
        });

        var modal = new Backbone.BootstrapModal({
            content: form,
            title: 'Alta de nuevo usuario',
            okText: 'aceptar',
            cancelText: 'cancelar',
            animate: false
        });

        modal.open(function(){
            var errors = form.commit({validate:true});
            modal.preventClose();

            if(errors){
                //console.log('hay errores [%s]', userfacet.get('username'));
            }else{
                userfacet.validusername(userfacet.get('username'),function(error){
                    if(error){
                        var errors = form.commit({validate:true});
                    }else{
                        userfacet.addNewUser();
                        modal.close();
                    }
                });

            }

        });
    },


    render:function () {
        $(this.el).html(this.template(this.model.toJSON()));
        return this;
    }

});