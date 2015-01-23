window.ProductViewLayout = Backbone.View.extend({

    whoami:'ProductViewLayout',

    initialize:function () {
        this.render();
    },

    render:function () {
        $(this.el).html(this.template(this.model.toJSON()));
        return this;
    },

    events: {
        "click  .prjview"  : "prjview",
        "click  .testview" : "testview",
    },

    testview: function(){
        console.log('ProductViewLayout:productlayout: CLICK');

    },

    prjview: function(){
        utils.approuter.navigate('ver/proyecto/'+dao.productsQueryData().getProjectId(), true);
        return false;
    },

});

window.ModelRelatedView = Backbone.View.extend({
    whoami: 'ModelRelatedView',

    initialize: function () {
        //console.log('[%s] INIT',this.whoami);

        this.listenTo(this.model, "change", this.changeevent,this);
        this.model.bind("change", this.changeevent, this);
        this.model.bind("destroy", this.destroyevent, this);
    },

    events: {
        "click  .relateditem" : "relateditem",
    },
    
    tagName:'ul',
    className:'nav nav-list',

    changeevent: function(){
        //console.log('[%s]:changeevent  CHANGE', this.whoami);
        this.render();

    },
    destroyevent: function () {
        //console.log('[%s]:changeevent  DESTROY', this.whoami);
        this.close();
    },

    relateditem:function(){
        //console.log('[%s] relateditem CLICK',this.whoami);
    },

    render: function () {
        //console.log('[%s] render BEGIN',this.whoami);
        var that = this;
        var items = this.model;
        var len = items.length;

        items.each(function(element){
            //console.log('each: element: [%s]',element.get('productcode'));
            $(that.el).append(new ModelInlineView({model: element}).render().el);
        });
        return this;
    }
});

window.ModelInlineView = Backbone.View.extend({
    whoami: 'ModelInlineView',

    tagName: "li",    
    template: _.template("<button class='btn-block btn-link relateditem' title='<%= displayName %>'><%= nickName %></button>"),

    events: {
        "click  .relateditem" : "relateditem",
    },

    relateditem:function(){
        //console.log('[%s]: relateditem CLICK',this.whoami);
        utils.approuter.navigate('personas/'+this.model.id, true);
    },

    initialize: function () {
        this.model.bind("change", this.changeevent, this);
        this.model.bind("destroy", this.destroyevent, this);
    },

    render: function () {
        //console.log('each2: element: [%s]',this.model.get('productcode'));
        $(this.el).html(this.template(this.model.toJSON()));
        return this;
    },

    changeevent: function(){
        //console.log('[%s]: change EVENT',this.whoami);
        this.render();

    },
    destroyevent: function () {
        //console.log('[%s]: destroy EVENT',this.whoami);
        this.close();
    },
});

window.ProductChaptersView = Backbone.View.extend({

    initialize: function () {

        //$("#chapters").html(new ProductChaptersView({model: chapters}).render().el);
        //$("#chapters").html(new ProductChaptersView({model: chapters}).render().el);

        //console.log('ProductChaptersView:INIT');
        this.listenTo(this.model, "change", this.changeevent,this);
        this.model.bind("change", this.changeevent, this);
        this.model.bind("destroy", this.destroyevent, this);
    },

    events: {
        "click  .chapteritem" : "chapteritem",
        "click  .testview" : "testview",
    },
    
    tagName:'ul',
    
    className:'nav nav-list',

    changeevent: function(){
        //console.log('changeevent:ChapterInlineView:productlist CHANGE');
        this.render();

    },
    destroyevent: function () {
        //console.log('destroyevent:ChapterInlineView:productlist DESTROY');
        this.close();
    },

    chapteritem:function(){
        //console.log('productChaptersView: CLICK');

    },

    testview: function(){
        //console.log('ProductChaptersView:productlist: CLICK');

    },

    render: function () {
        //console.log('ProductChaptersView: render BEGIN');
        var that = this;
        var products = this.model.models;
        var len = products.length;
        //$(this.el).html('<ul class="nav nav-list"></ul>');

        _.each(products,function(element){
            //console.log('each: element: [%s]',element.get('productcode'));
            $(that.el).append(new ChapterInlineView({model: element}).render().el);
        });
        return this;
    }
});

window.ChapterInlineView = Backbone.View.extend({

    tagName: "li",
    
    template: _.template("<button class='btn-block btn-link chapteritem' title='<%= slug %>'><%= productcode %></button>"),

    events: {
        "click  .chapteritem" : "chapteritem",
        "click  .testview" : "testview",
    },

    testview: function(){
        //console.log('ChapterInLineView:productlist: CLICK');

    },

    chapteritem:function(){
        //console.log('ChapterINLINEView: CLICK');
        utils.approuter.navigate('productos/'+this.model.id, true);
    },

    initialize: function () {
        this.model.bind("change", this.changeevent, this);
        this.model.bind("destroy", this.destroyevent, this);
    },

    render: function () {
        //console.log('each2: element: [%s]',this.model.get('productcode'));
 
        $(this.el).html(this.template(this.model.toJSON()));
        return this;
    },
    changeevent: function(){
        //console.log('changeevent:ChapterInlineView:productlist CHANGE');
        this.render();

    },
    destroyevent: function () {
        //console.log('destroyevent:ChapterInlineView:productlist DESTROY');
        this.close();
    },
});


window.DocumentsView = Backbone.View.extend({

    initialize: function () {
        //this.listenTo(this.model, "change", this.changeevent,this);
        //this.model.bind("change", this.changeevent, this);
        //this.model.bind("destroy", this.destroyevent, this);
    },

    events: {
        "click  .chapteritem" : "chapteritem",
        "click  .testview" : "testview",
    },
    
    tagName:'ul',    
    className:'nav nav-list',

    changeevent: function(){
        this.render();
    },
    destroyevent: function () {
        this.close();
    },
    chapteritem:function(){
    },

    testview: function(){
    },

    render: function () {
        console.log('DocumentsView: render BEGIN');
        var that = this;
        var documents = this.collection;

        documents.each(function(element){
            console.log('each: element: [%s]',element.get('cnumber'));
            $(that.el).append(new DocumentInlineView({model: element}).render().el);
        });
        return this;
    }
});

window.DocumentInlineView = Backbone.View.extend({

    tagName: "li",    
    template: _.template("<button class='btn-block btn-link docitem' title='<%= slug %> [<%= fecomp %>][<%= nivel_ejecucion %>]'><%= cnumber %></button>"),

    events: {
        "click  .docitem" : "docitem",
        "click  .testview" : "testview",
    },

    docitem:function(){
        console.log('ChapterINLINEView: CLICK');
        window.open('/gestion/#comprobantes/'+this.model.id+'/edit');
    },

    initialize: function () {
        this.model.bind("change", this.changeevent, this);
        this.model.bind("destroy", this.destroyevent, this);
    },

    render: function () {
        //console.log('each2: element: [%s]',this.model.get('productcode'));
        $(this.el).html(this.template(this.model.toJSON()));
        return this;
    },
    changeevent: function(){
        this.render();
    },
    destroyevent: function () {
        this.close();
    },
});

window.BrandingEditView = Backbone.View.extend({
    whoami: 'BrandingEditView:productlist.js',

    initialize: function () {
        //console.log('[%s] initialize',this.whoami);
    },

    events: {
    },
    
    tagName:'div',    
    className:'accordion-group',

    changeevent: function(){
        //console.log('[%s] CHANGE',this.whoami);
        this.render();
    },
    destroyevent: function () {
        //console.log('[%s] DESTROY',this.whoami);
        this.close();
    },
    notaitem:function(){
        //console.log('[%s] NOTAITEM',this.whoami);
    },

    render: function () {
        var self = this,
            facet = self.model,
            form = new Backbone.Form({
                model: facet,
            }).render();

        console.log('[%s] accordion-form-branding BEGINS',self.whoami);
        
        form.on('change', function(form) {
            var errors = form.commit();
            //console.log('form change!!:key editor');
        });

        form.on('blur', function(form) {
            var errors = form.commit();
            console.log('form BLUR!!:KEY editor');
            //self.options.viewController.buildBrandingList();
        });

        $(this.el).html(this.template(this.model.toJSON()));
        $('.brndedithook',this.el).html(form.el);
        return this;
    },

});


window.UsersView = Backbone.View.extend({
    whoami: 'UsersView:productlist.js',

    initialize: function () {
        //console.log('[%s] initialize',this.whoami);
        //this.listenTo(this.model, "change", this.changeevent,this);
        //this.model.bind("change", this.changeevent, this);
        //this.model.bind("destroy", this.destroyevent, this);
    },

    events: {
    },
    
    tagName:'ul',    
    className:'nav nav-list',

    changeevent: function(){
        console.log('[%s] CHANGE',this.whoami);
        this.render();
    },
    destroyevent: function () {
        //console.log('[%s] DESTROY',this.whoami);
        this.close();
    },

    render: function () {
        console.log('[%s] RENDER',this.whoami);
        var that = this;
        var itemlist = this.model;
        var len = itemlist.length;
        //console.log('[%s] RENDER len:[%s]',this.whoami, len);

        itemlist.each(function(element){
            //console.log('each: element: [%s]',element.get('username'));
            $(that.el).append(new UserInlineView({model: element}).render().el);
        });
        return this;
    }
});

window.UserInlineView = Backbone.View.extend({
    whoami: 'UserInLineView:productlist.js',
    tagName: "li",

    template: _.template("<a class='useritem' title='<%= displayName %>'><%= username %></a>"),

    events: {
        "click  .useritem" : "editItem",
        "click  .testview" : "testview",
    },

    editItem:function(){
        //console.log('[%s] EDITITEM',this.whoami);
        dao.userfacet.setFacet(this.model);
        //utils.approuter.navigate('productos/'+this.model.id, true);
    },

    initialize: function () {
        this.model.bind("change", this.changeevent, this);
        this.model.bind("destroy", this.destroyevent, this);
    },

    render: function () {
        //console.log('[%s] RENDER',this.whoami);
        $(this.el).html(this.template(this.model.toJSON()));
        return this;
    },
    changeevent: function(){
        //console.log('[%s] changeevent',this.whoami);
        this.render();

    },
    destroyevent: function () {
        //console.log('[%s] destroyevent',this.whoami);
        this.close();
    },
});


window.ContactsView = Backbone.View.extend({
    whoami: 'ContactosView:productlist.js',

    initialize: function () {
        //console.log('[%s] initialize',this.whoami);
        //this.listenTo(this.model, "change", this.changeevent,this);
        //this.model.bind("change", this.changeevent, this);
        //this.model.bind("destroy", this.destroyevent, this);
    },

    events: {
    },
    
    tagName:'ul',    
    className:'nav nav-list',

    changeevent: function(){
        //console.log('[%s] CHANGE',this.whoami);
        this.render();
    },
    destroyevent: function () {
        //console.log('[%s] DESTROY',this.whoami);
        this.close();
    },

    render: function () {
        ////console.log('[%s] RENDER',this.whoami);
        var that = this;
        var itemlist = this.model;
        var len = itemlist.length;
        //console.log('[%s] RENDER len:[%s]',this.whoami, len);

        itemlist.each(function(element){
            //console.log('each: element: [%s]',element.get('contactdata'));
            $(that.el).append(new ContactInlineView({model: element}).render().el);
        });
        return this;
    }
});

window.ContactInlineView = Backbone.View.extend({
    whoami: 'ContactInLineView:productlist.js',
    tagName: "li",

template: _.template("<a class='contactitem' title='<%= tipocontacto %> <%= subcontenido %>'><%= contactdata %></a>"),

    events: {
        "click  .contactitem" : "editItem",
        "click  .testview" : "testview",
    },

    editItem:function(){
        //console.log('[%s] EDITITEM',this.whoami);
        dao.contactfacet.setFacet(this.model);
        //utils.approuter.navigate('productos/'+this.model.id, true);
    },

    initialize: function () {
        this.model.bind("change", this.changeevent, this);
        this.model.bind("destroy", this.destroyevent, this);
    },

    render: function () {
        //console.log('[%s] RENDER',this.whoami);
        $(this.el).html(this.template(this.model.toJSON()));
        return this;
    },
    changeevent: function(){
        //console.log('[%s] changeevent',this.whoami);
        this.render();

    },
    destroyevent: function () {
        //console.log('[%s] destroyevent',this.whoami);
        this.close();
    },
});

window.ProfileImageView = Backbone.View.extend({
    whoami: 'ProfileImageView:productlist.js',
    tagName: "li",

    template: _.template(
"<img src='/asset/render/img/<%= assetId%>' class='profile' title='<%= slug%>' alt='<%= slug%>'>"
    ),
    
    initialize: function () {
        //console.log('[%s] RENDER [%s]',this.whoami, this.model.get('slug'));
    },

    render: function () {
        //console.log('[%s] RENDER',this.whoami);
        $(this.el).html(this.template(this.model.toJSON()));
        return this;
    },
});


window.NotasView = Backbone.View.extend({
    whoami: 'NotasView:productlist.js',

    initialize: function () {
        //console.log('[%s] initialize',this.whoami);
        //this.listenTo(this.model, "change", this.changeevent,this);
        //this.model.bind("change", this.changeevent, this);
        //this.model.bind("destroy", this.destroyevent, this);
    },

    events: {
    },
    
    tagName:'ul',    
    className:'nav nav-list',

    changeevent: function(){
        //console.log('[%s] CHANGE',this.whoami);
        this.render();
    },
    destroyevent: function () {
        //console.log('[%s] DESTROY',this.whoami);
        this.close();
    },
    notaitem:function(){
        //console.log('[%s] NOTAITEM',this.whoami);
    },

    render: function () {
        //console.log('[%s] RENDER',this.whoami);
        var that = this;
        var itemlist = this.model;
        var len = itemlist.length;

        _.each(itemlist,function(element){
            //console.log('each: element: [%s]',element.get('productcode'));
            $(that.el).append(new NotaInlineView({model: element}).render().el);
        });
        return this;
    }
});

window.NotaInlineView = Backbone.View.extend({
    whoami: 'NotaInLineView:productlist.js',

    tagName: "li",    
template: _.template("<a href='#articulos/<%= id %>' class='notaitem' title='<%= tiponota %>: <%= description %>'><%= fecha %>: <%= slug %></a>"),

    events: {
        "click  .chapteritem" : "chapteritem",
        "click  .testview" : "testview",
    },

    notaitem:function(){
        //console.log('[%s] NOTAITEM',this.whoami);
        utils.approuter.navigate('productos/'+this.model.id, true);
    },

    initialize: function () {
        this.model.bind("change", this.changeevent, this);
        this.model.bind("destroy", this.destroyevent, this);
    },

    render: function () {
        //console.log('[%s] RENDER',this.whoami);
        $(this.el).html(this.template(this.model.toJSON()));
        return this;
    },
    changeevent: function(){
        //console.log('[%s] changeevent',this.whoami);
        this.render();

    },
    destroyevent: function () {
        //console.log('[%s] destroyevent',this.whoami);
        this.close();
    },
});

window.PersonsFromUserView = Backbone.View.extend({
    //tagName:'ul',    
    //className:'nav nav-list',

    render: function () {
        var self = this;
        var persons = this.model;
        console.log('PersonFromUserView: render BEGIN [%s]',persons.length);
        _.each(persons,function(person){
            $.when(person).done(function(person){
               console.log('PersonFromUserView: iteration BEGIN [%s][%s]',person.id, person.options.predicate);
               person.set('predicate',person.options.predicate );
                //person.fetch({success: function() {
                    //$("#listcontent").html(new PersonView({model: person}).el);
                $(self.el).append(new ProfilePersonView({model: person}).render().el);
            //}});

            })

        });
        return this;
    }
});

window.ProfilePersonView = Backbone.View.extend({
    //tagName: "li",
    //template: _.template("<button class='btn-block btn-link ancestorpa'><%= slug %></button>"),

    events: {
        "click  .ancestorpa" : "ancestorpa",
    },

    ancestorpa:function(){
        utils.approuter.navigate('personas/'+this.model.id, true);
    },

    initialize: function () {
        this.model.bind("change", this.render, this);
        this.model.bind("destroy", this.close, this);
    },

    render: function () {
        console.log('PeronITEM RENDER **********')
        $(this.el).html(this.template(this.model.toJSON()));
        return this;
    }
});

window.PersonAncestorView = Backbone.View.extend({
    tagName:'ul',    
    className:'nav nav-list',

    render: function () {
        //console.log('PersonAncestorView: render BEGIN');
        var that = this;
        var products = this.model;
        products.each(function(element){
            $(that.el).append(new PersonAncestorInLineView({model: element}).render().el);
        });
        return this;
    }
});

window.PersonAncestorInLineView = Backbone.View.extend({
    tagName: "li",
    template: _.template("<button class='btn-block btn-link ancestorpa'><%= nickName %></button>"),

    events: {
        "click  .ancestorpa" : "ancestorpa",
    },

    ancestorpa:function(){
        utils.approuter.navigate('personas/'+this.model.id, true);
    },

    initialize: function () {
        this.model.bind("change", this.render, this);
        this.model.bind("destroy", this.close, this);
    },

    render: function () {
        $(this.el).html(this.template(this.model.toJSON()));
        return this;
    }
});

window.AncestorView = Backbone.View.extend({

    initialize: function () {
    },

    events: {
    },
    
    tagName:'ul',
    
    className:'nav nav-list',

    render: function () {
        //console.log('AncestorView: render BEGIN');
        var that = this;
        var products = this.model;
        var len = products.length;
        //$(this.el).html('<ul class="nav nav-list"></ul>');

        _.each(products,function(element){
            //console.log('each: ELEMENT: [%s]',element.get('slug'));
            $(that.el).append(new AncestorInLineView({model: element}).render().el);
        });
        return this;
    }
});

window.AncestorInLineView = Backbone.View.extend({

    tagName: "li",
    
    template: _.template("<button class='btn-block btn-link ancestorpa'><%= productcode %></button>"),

    events: {
        "click  .ancestorpa" : "ancestorpa",
    },

    ancestorpa:function(){
        //console.log('ancestorView: CLICK');
        utils.approuter.navigate('productos/'+this.model.id, true);
    },

    initialize: function () {
        this.model.bind("change", this.render, this);
        this.model.bind("destroy", this.close, this);
    },

    render: function () {
        $(this.el).html(this.template(this.model.toJSON()));
        return this;
    }
});