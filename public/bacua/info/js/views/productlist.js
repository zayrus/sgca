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
        "click  .testview"    : "testview",
    },

    testview: function(){
        console.log('ProductViewLayout:productlayout: CLICK');

    },

    prjview: function(){
        utils.approuter.navigate('ver/proyecto/'+dao.productsQueryData().getProjectId(), true);
        return false;
    },

});


window.ProductChaptersView = Backbone.View.extend({

    initialize: function () {

        //$("#chapters").html(new ProductChaptersView({model: chapters}).render().el);
        //$("#chapters").html(new ProductChaptersView({model: chapters}).render().el);

        console.log('ProductChaptersView:INIT');
        this.listenTo(this.model, "change", this.changeevent,this);
        this.model.bind("change", this.changeevent, this);
        this.model.bind("destroy", this.destroyevent, this);
    },

    events: {
        "click  .chapteritem" : "chapteritem",
        "click  .testview" : "testview",
    },
    
    tagName:'ul',
    
    className:'list-group',

    changeevent: function(){
        console.log('changeevent:ChapterInlineView:productlist CHANGE');
        this.render();

    },
    destroyevent: function () {
        console.log('destroyevent:ChapterInlineView:productlist DESTROY');
        this.close();
    },

    chapteritem:function(){
        console.log('productChaptersView: CLICK');

    },

    testview: function(){
        console.log('ProductChaptersView:productlist: CLICK');

    },

    render: function () {
        console.log('ProductChaptersView: render BEGIN');
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
    className:"list-group-item",
    
    template: _.template("<button class='btn-block btn-link chapteritem' title='<%= slug %>' ><strong><%= productcode %></strong> <%= slug %></button>"),

    events: {
        "click  .chapteritem" : "chapteritem",
        "click  .testview" : "testview",
    },

    testview: function(){
        console.log('ChapterInLineView:productlist: CLICK');

    },

    chapteritem:function(){
        console.log('ChapterINLINEView: CLICK');
        utils.approuter.navigate('pa/ver/'+this.model.id, true);
    },
//http://localhost:3000/bacua/info/#pa/ver/5252a038a8907e8901000001
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
        console.log('changeevent:ChapterInlineView:productlist CHANGE');
        this.render();

    },
    destroyevent: function () {
        console.log('destroyevent:ChapterInlineView:productlist DESTROY');
        this.close();
    },
});


window.BrandingEditView = Backbone.View.extend({
    whoami: 'BrandingEditView:productlist.js',

    initialize: function () {
        console.log('[%s] initialize',this.whoami);
    },

    events: {
    },
    
    tagName:'div',    
    className:'accordion-group',

    changeevent: function(){
        console.log('[%s] CHANGE',this.whoami);
        this.render();
    },
    destroyevent: function () {
        console.log('[%s] DESTROY',this.whoami);
        this.close();
    },
    notaitem:function(){
        console.log('[%s] NOTAITEM',this.whoami);
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
            console.log('form change!!:key editor');
        });

        form.on('blur', function(form) {
            var errors = form.commit();
            self.buildBrandingList();
            console.log('form blur editBranding!!:key editor');
        });

        $(this.el).html(this.template(this.model.toJSON()));
        $('.brndedithook',this.el).html(form.el);
        return this;
    },

});


window.NotasView = Backbone.View.extend({
    whoami: 'NotasView:productlist.js',

    initialize: function () {
        console.log('[%s] initialize',this.whoami);
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
        console.log('[%s] DESTROY',this.whoami);
        this.close();
    },
    notaitem:function(){
        console.log('[%s] NOTAITEM',this.whoami);
    },

    render: function () {
        console.log('[%s] RENDER',this.whoami);
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
        console.log('[%s] NOTAITEM',this.whoami);
        utils.approuter.navigate('productos/'+this.model.id, true);
    },

    initialize: function () {
        this.model.bind("change", this.changeevent, this);
        this.model.bind("destroy", this.destroyevent, this);
    },

    render: function () {
        console.log('[%s] RENDER',this.whoami);
        $(this.el).html(this.template(this.model.toJSON()));
        return this;
    },
    changeevent: function(){
        console.log('[%s] changeevent',this.whoami);
        this.render();

    },
    destroyevent: function () {
        console.log('[%s] destroyevent',this.whoami);
        this.close();
    },
});



window.AncestorView = Backbone.View.extend({

    initialize: function () {
    },

    events: {
    },
    
    tagName:'ul',
    
    className:'nav nav-list',

    render: function () {
        console.log('AncestorView: render BEGIN');
        var that = this;
        var products = this.model;
        var len = products.length;
        //$(this.el).html('<ul class="nav nav-list"></ul>');

        _.each(products,function(element){
            console.log('each: ELEMENT: [%s]',element.get('slug'));
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
        console.log('ancestorView: CLICK');
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