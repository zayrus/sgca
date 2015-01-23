
window.HeaderCreateSolView = Backbone.View.extend({
initialize:function () {
         console.log('Vista creada');
        this.render();
    },

    render:function () {
        this.$el.html(this.template(this.model.toJSON()));
        return this;
    },

});

window.HeaderView = Backbone.View.extend({
    whoami:'HeaderView:header.js#16',

    initialize: function () {
        // model: User
        //console.log('headerView INIT');
        this.render();
    },

    templates: {
        logged:   'HeaderViewLogged',
        unlogged: 'HeaderViewNotLogged',
        visitor:  'HeaderViewVisitor',
        solpub:   'HeaderViewPub',
    },

    getTemplate: function(){
        var menu = 'unlogged';

        if(this.model.get('displayName')){
            menu = 'logged'
            var roles = this.model.get('roles');
            var home = this.model.get('home');
            if (home === "solicitudes:list"){
                menu = 'solpub';  //vista publica de solicitudes con nueva cabecera
            }
            else{
               if(roles){
                   if(_.indexOf(roles,'adherente') != -1){
                       menu = 'visitor';
                   }
               }
            }
            
        }
        console.log('[%s] MenuSelected: [%s]',this.whoami, menu);
        //console.log('displayName:[%s] [%s]',menu, this.model.get('displayName'))
        return utils.templates[this.templates[menu] ]; //'HeaderViewLogged'
    },

    render: function () {
        var self = this;
        var template = self.getTemplate();

        //console.log('HeaderView F:[%s]  O:[%s]', _.isFunction(template),_.isObject(template));
        //console.log('HeaderView [%s]', _.isFunction(template(self.model.toJSON()));
        //$(this.el).html((self.model.toJSON()));
        $(this.el).html(template(this.model.toJSON()));
        return this;
    },

    selectMenuItem: function (menuItem) {
        $('.nav li').removeClass('active');
        if (menuItem) {
            $('.' + menuItem).addClass('active');
        }
    }

});