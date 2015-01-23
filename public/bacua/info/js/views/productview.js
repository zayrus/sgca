window.ProductView = Backbone.View.extend({
    whoami:'ProductBrowseView:productlayout.js',

    initialize:function (options) {
        console.log('initialize [%s]',options)
        this.options = options;

        this.loadSettings();
        this.loadProduct();
    },

    renderCarouselAll:function () {
        this.renderCarousellayout();
        this.renderCarousel();
        this.renderFeaturetteData();
        //this.rendercontent();
    },

    renderJumboAll:function () {
        this.renderJumbolayout();
        this.renderJumboHeader();
        this.renderDescribeData();
        this.renderNotes();
    },

    loadSettings: function(){
    },

    loadProduct: function(){
        var self = this;
        var product = new Product({_id: self.options.productid});
        product.fetch({success: function() {
            console.log('success: [%s',product.id);
            self.product = product;
            self.renderJumboAll();
            //$("#listcontent").html(new ProductView({model: product}).el);

            //product.loadpacapitulos(function(chapters){
            //    console.log('ready to render chapters:main chapters:[%s]',chapters.length);
            //   $("#chapters").html(new ProductChaptersView({model: chapters}).render().el);
            //});
     
        }});
    },


    renderJumbolayout:function () {
        this.$el.html(new ProductViewJumboLayout().el);
        return this;
    },
    renderJumboHeader:function () {
        var self = this,
            selector = '.jumbotron';
        
        new ProductViewJumboHeader1({model: self.product, el: $(selector)});
        return this;
    },

    renderDescribeData:function () {
        var self = this;

        self.renderCoreData(self.product);
        self.renderClasificacion(self.product);
        self.renderPatechfacet(self.product);
        self.renderChapters(self.product);

        return this;
    },

    renderNotes:function () {
        var self = this,
            node = self.product.get('notas'),
            data = [],
            selector = '#maincontent';

        _.each(node, function(note){
            console.log('each NODE [%s]');
            var article = new Article({_id: note.id});
            article.fetch({success: function() {
                console.log('success: [%s]',article.get('slug'));
                var view = new ProductViewNote({ model: article, el:$(selector) });
            }});
        });
        return this;
    },

    renderCoreData: function (product){
        var keys = ['productcode'];
        var data = [];
        var selector = '#coredata';

        _.each(keys, function(elem){
            data.push({key: elem, value: product.get(elem)});
        });
        console.log('render data leng[%s]', data.length);
        var view = new ProductViewCoreData({data: data, el:$(selector), title:product.get('tipoproducto')});

    },
 
    renderClasificacion: function (product){
        var node = product.get('clasification');
        var data = [];
        var selector = '#clasificacion';

        _.each(node, function(value, key){
            data.push({key: key, value: value});
        })
        console.log('CLASIFICATION render data leng[%s]', data.length);
        var view = new ProductViewClasificationData({data: data, el:$(selector), acparent:'clasification', acref:'nodo1', acin:'in',  title:'Clasificación'});

    },

    renderPatechfacet: function (product){
        var node = product.get('patechfacet');
        var data = [];
        var selector = '#clasificacion';

        _.each(node, function(value, key){
            data.push({key: key, value: value});
        })
        console.log('PATECHFACET render data leng[%s]', data.length);
        var view = new ProductViewTechnicalData({data: data, el:$(selector), acparent:'clasification', acref:'nodo2', acin:'',  title:'Datos técnicos'});

    },
    renderChapters: function (product){
        var template = _.template('<div class="panel panel-primary"><div class="panel-heading"><h5 class="panel-title text-center" ><a class="accordion-toggle" data-toggle="collapse" data-parent="#capitulos" href="#<%= acref %>"><%= title %></a></h5></div><div id="<%= acref %>" class="panel-collapse collapse <%= acin %>"><span id="chapcontent"></span></div></div>');
        var selector = '#capitulos';

        product.loadpacapitulos(function(chapters){
            var data ={
                acparent: 'clasification',
                acref: 'nodo3',
                acin: '',
                title: 'Capítulos',
                content:  new ProductChaptersView({model: chapters}).render().el
            };
            $(selector).html(template(data));
            $('#chapcontent', $(selector)).html(data.content);
        });
    },

    renderCarousellayout:function () {
        this.$el.html(new ProductViewLayout().el);
        return this;
    },

    renderFeaturetteData: function () {
        var self = this,
            selector = '#featurette', ///self.settings.get('contenttag')
            active = true,
            deferreds=[],
            defer,
            branding,
            article = new Article();
        
        branding = utils.fetchFilteredEntries(this.product, 'branding', {rolbranding:'principal'});
        self.product.set({featurette: branding[0]});
        new ProductViewFeaturette1({model: self.product, el: $(selector)});
    },

    renderCarousel: function () {
        var self = this,
            selector = '#carouselinner', ///self.settings.get('contenttag')
            active = true,
            deferreds=[],
            defer,
            rendering,
            article = new Article();

        var notas = new Backbone.Collection(utils.fetchFilteredEntries(self.product, 'notas', {tiponota:'portal'}),{
            model: Article
        });
        //console.log('Collection:  [%s]', notas.at(0).get('slug'));

        notas.each(function(entry){
            article = new Article({_id: entry.get('id')});
            console.log('ready to fetch article:  [%s]', entry.get('id'));
            defer = article.fetch({success: function(article) {
                
                article.set({active: (active ? 'active' : '')});
                if(!article.get('slug')) article.set({slug: self.product.get('slug')});
                if(!article.get('description')) article.set({description: self.product.get('description')});
                if(!article.get('url')) article.set({url: 'pa/ver/'+self.product.id});

                //carousel
                rendering = utils.fetchFilteredEntries(article, 'branding', {rolbranding:'carousel'});
                if(rendering.length>0){
                    selector = '#carouselinner';
                    article.set({assetId: rendering[0].assetId});
                    new ProductViewCarouselItem1({model: article, el: $(selector)});
                    if(active) active = false;                    
                }

                //destacados
                rendering = utils.fetchFilteredEntries(article, 'branding', {rolbranding:'destacado'});
                if(rendering.length>0){
                    selector = '.destacados';
                    article.set({assetId: rendering[0].assetId});
                    console.log('DESTACADOS DESTACADOS DESTACADOS');
                    new ProductViewDestacados1({model: article, el: $(selector)});
                }
            }});
            deferreds.push(defer);
        });
    },



    rendercontent:function () {
        var self = this,
            query = self.settings.get('pquery').retrieveData(),
            selector = self.settings.get('contenttag'),
            page = self.settings.get('page');

        self.productlist = new ProductCollection();
        self.productlist.fetch({
            data: query,
            type: 'post',
            success: function() {
                console.log('[%s] fetch SUCCESS [%s]',self.whoami, selector);
                // ProductListView controller: productlist.js
                $(selector).html(new ProductListView({model: self.productlist, page: page}).el);
            }
        });
        return this;
    },

    events: {
        "change .nav-list" : "change",
        "click  .selreset" : "resetselection",
        "click  .prjview"  : "prjview",
        "click  .managetable"   : "managetable",
    },

    managetable: function  () {
        var self = this,
            facet = dao.managetable.init(),
            form = new Backbone.Form({
                model: facet,
            });

        var modal = new Backbone.BootstrapModal({
            content: form,
            title: 'Gestión de Tabla',
            okText: 'aceptar',
            cancelText: 'cancelar',
            animate: false
        });

        modal.open(function(){
            var errors = form.commit();
            dao.managetable.setActualColumns();
            self.renderAll();
        });
    },

});
////// PRODUCT VIEW ENDS //////////////


//// JUMBO
window.ProductViewJumboLayout = Backbone.View.extend({
    whoami:'bacua/productviewlayout:productview.js',

    initialize:function (options) {
        this.options = options;
        this.render();
    },

    render:function () {
        $(this.el).html(this.template());
        return this;
    },

    events: {
        "click [data-toggle=offcanvas]" : "toggleactive",
    },

    toggleactive: function () {
        $('.row-offcanvas').toggleClass('active');
    },

});

window.ProductViewJumboHeader1 = Backbone.View.extend({
    initialize: function (options) {
        this.options = options;

        this.model.bind("change", this.render, this);
        this.model.bind("destroy", this.close, this);
        this.render();
    },

    render: function () {
        //console.log('[%s] rrender item [%s]',self.whoami, this.model.get('slug'));
        this.$el.append(this.template(this.model.toJSON()));
        return this;
    }
});


window.ProductViewClasificationData = Backbone.View.extend({
    initialize: function (options) {
        this.options = options;

        console.log('initialize [%s]', this.options.acref)
        this.buildTemplate();
    },

        //var view = new ProductViewClasificationData({data: data, el:$(selector), acparent:'clasification',acref:'nodo1',acin:tue,  title:'Clasificacion'});

    buildTemplate: function  () {
        var header = _.template('<div class="panel panel-primary"><div class="panel-heading"><h5 class="panel-title text-center" ><a class="accordion-toggle" data-toggle="collapse" data-parent="#clasificacion" href="#<%= acref %>"><%= title %></a></h5></div><div id="<%= acref %>" class="panel-collapse collapse <%= acin %>"><div class="panel-body" ><%= content %></div></div></div>');
        var body = _.template('<dl><dt><%= utils.fetchLabel(utils.clasificationSch, key) %></dt><dd><%= value %></dd></dl>');
        var content = '';

        _.each(this.options.data, function(elem,key){
            content += body(elem);
        });

        this.options.content = content;

        var nodetemplate = header(this.options);
        this.render (nodetemplate);
    },

    render: function (text) {
        //console.log('[%s] rrender item [%s]',self.whoami, this.model.get('slug'));
        this.$el.append(text);
        return this;
    }
});

window.ProductViewTechnicalData = Backbone.View.extend({
    initialize: function (options) {
        this.options = options;

        console.log('initialize [%s]', this.options.acref)
        this.buildTemplate();
    },

        //var view = new ProductViewTechnicalData({data: data, el:$(selector), acparent:'clasification',acref:'nodo1',acin:tue,  title:'Clasificacion'});

    buildTemplate: function  () {
        var header = _.template('<div class="panel panel-primary"><div class="panel-heading"><h5 class="panel-title text-center" ><a class="accordion-toggle" data-toggle="collapse" data-parent="#clasificacion" href="#<%= acref %>"><%= title %></a></h5></div><div id="<%= acref %>" class="panel-collapse collapse <%= acin %>"><ul class="list-group"><%= content %></ul></div></div>');
        //var body = _.template('<dl class="dl-horizontal"><dt><%= key %></dt><dd><%= value %></dd></dl>');
        //var body = _.template('<dl class="dl-horizontal"><dt><%= utils.fetchLabel(utils.technicalSch, key) %></dt><dd><%= value %></dd></dl>');
        var body = _.template('<li class="list-group-item"><strong><%= utils.fetchLabel(utils.technicalSch, key) %></strong> <%= value %></li>');
        var content = '';

        _.each(this.options.data, function(elem,key){
            content += body(elem);
        });

        this.options.content = content;

        var nodetemplate = header(this.options);
        this.render (nodetemplate);
    },

    render: function (text) {
        //console.log('[%s] rrender item [%s]',self.whoami, this.model.get('slug'));
        this.$el.append(text);
        return this;
    }
});

window.ProductViewNote = Backbone.View.extend({
    whoami: 'ProductViewNote',

    initialize: function (options) {
        this.options = options;

        console.log('initialize [%s]', this.whoami)
        this.buildTemplate();
    },

    buildTemplate: function  () {
        var template = _.template('<div class="col-6 col-sm-6 col-lg-4"><h2><%= denom %></h2><p><strong><%= tiponota%>: <%= description%>/ <%= responsable%>/ <%= fecha%></p><p><a class="btn btn-default" href="#">Más información &raquo;</a></p></div>');
        this.render (template(this.model.toJSON()));
    },

    render: function (text) {
        //console.log('[%s] rrender item [%s]',self.whoami, this.model.get('slug'));
        this.$el.append(text);
        return this;
    }
});

window.ProductViewCoreData = Backbone.View.extend({
    initialize: function (options) {
        this.options = options;

        console.log('initialize [%s]', this.options.data.length)
        this.buildTemplate();
    },

    buildTemplate: function  () {
        var header = _.template('<div class="panel-heading"><h5 class=text-center ><%= title %></h5></div><div class="panel-body" ><%= content %></div>');
        var body = _.template('<p class="lead text-center" ><strong><%= value %></strong></p>');
        var content = '';

        _.each(this.options.data, function(elem,key){
            content += body(elem);
            console.log('bluid temp4 [%s]', content);
        });
        this.options.content = content;

        var nodetemplate = header(this.options);
        this.render (nodetemplate);
    },

    render: function (text) {
        //console.log('[%s] rrender item [%s]',self.whoami, this.model.get('slug'));
        this.$el.html(text);
        return this;
    }
});


window.ProductViewDescribeData = Backbone.View.extend({
    initialize: function (options) {
        this.options = options;

        this.model.bind("change", this.render, this);
        this.model.bind("destroy", this.close, this);
        this.render();
    },

    render: function () {
        //console.log('[%s] rrender item [%s]',self.whoami, this.model.get('slug'));
        this.$el.append(this.template(this.model.toJSON()));
        return this;
    }
});



//// CAROUSEL
window.ProductViewDestacados1 = Backbone.View.extend({
    initialize: function (options) {
        this.options = options;

        this.model.bind("change", this.render, this);
        this.model.bind("destroy", this.close, this);
        this.render();
    },

    render: function () {
        console.log('[%s] render destacados',self.whoami);
        this.$el.append(this.template(this.model.toJSON()));
        return this;
    }
});

window.ProductViewCarouselItem1 = Backbone.View.extend({
    initialize: function (options) {
        this.options = options;

        this.model.bind("change", this.render, this);
        this.model.bind("destroy", this.close, this);
        this.render();
    },

    render: function () {
        //console.log('[%s] rrender item [%s]',self.whoami, this.model.get('slug'));
        this.$el.append(this.template(this.model.toJSON()));
        return this;
    }
});

window.ProductViewFeaturette1 = Backbone.View.extend({
    initialize: function (options) {
        this.options = options;

        this.model.bind("change", this.render, this);
        this.model.bind("destroy", this.close, this);
        this.render();
    },

    render: function () {
        //console.log('[%s] rrender item [%s]',self.whoami, this.model.get('slug'));
        this.$el.append(this.template(this.model.toJSON()));
        return this;
    }
});


window.ProductViewLayout = Backbone.View.extend({
    whoami:'bacua/productviewlayout:productview.js',

    initialize:function () {
        this.render();
    },

    render:function () {
        $(this.el).html(this.template());
        return this;
    },

    events: {
    },
});


/// OLD STUFF
window.ProductListView = Backbone.View.extend({
    whoami:'ProductListView:productlayout.js',

    paginatorPath: '#navegar/productos/pag/',

    initialize: function () {
        this.render();
    },

    events: {
    },


    render: function () {
        var products = this.model.models;
        var len = products.length;
        var startPos = (this.options.page - 1) * 12;
        var endPos = Math.min(startPos + 12, len);
        console.log('[%s] render  BEGIN len:[%s]',this.whoami,len);
        
        var html  = '<table class="table table-bordered">';
            html +=  utils.buildTableHeader(utils.productListTableHeader);
            html += "<tbody class='tableitems'></tbody></table>";

        $(this.el).html(html);

        for (var i = startPos; i < endPos; i++) {
            $('.tableitems', this.el).append(new ProductRowItemView({model: products[i]}).render().el);
            //$('.thumbnails', this.el).append(new ChapterInlineView({model: products[i]}).render().el);
        }

        $(this.el).append(new Paginator({model: this.model, paginatorPath: this.paginatorPath, page: this.options.page}).render().el);

        return this;
    }
});

window.ProductListItemView = Backbone.View.extend({

    tagName: "li",

    initialize: function () {
        this.model.bind("change", this.render, this);
        this.model.bind("destroy", this.close, this);
    },

    render: function () {
        $(this.el).html(this.template(this.model.toJSON()));
        return this;
    }

});

window.ProductRowItemView = Backbone.View.extend({

    whoami:'ProductRowItemView:productlayout.js',

    tagName: "tr",

    events: {
        //"select .tselect"  : "checkproductbox",
        //"select "  : "checkproductbox",
        "change .tselect"  : "checkproductbox",
        "click .col1"      : "editproduct",
        "click .tzoom"     : "vercapitulos",
        "click"  : "click",
    },

    initialize: function () {
        this.model.bind("change", this.render, this);
        this.model.bind("destroy", this.close, this);
    },

    areChaptersVisible: false,

    render: function () {
        var data = utils.buildTableRow(utils.productListTableHeader,this.model);
        $(this.el).html(data);
        return this;
    },

    click: function(event){
        console.log('[%s] CLICK [%S]   ',this.whoami,this.model.get('productcode'));

    },

    checkproductbox: function (event) {
        //console.log('[%s] SELECT [%S]   ',this.whoami,this.model.get('productcode'));
        //console.log('[%s] targetname: [%S]   target:value:[%s]',this.whoami,event.target.name,event.target.checked);
        if(event.target.checked)  utils.selectedProducts.add(this.model);
        if(!event.target.checked) utils.selectedProducts.remove(this.model);
        //console.log('[%s] array:[%s]',this.whoami,utils.selectedProducts.list);
        //_.each(utils.selectedProducts.list,function(element){
        //   console.log(' array:[%s]; ',element.get('productcode'));
        //});
    },

    editproduct: function(event){
        console.log('[%s] CLICK editproduct [%S]   ',this.whoami,this.model.get('productcode'));
        utils.approuter.navigate('productos/'+this.model.id , true);

    },
    vercapitulos: function (event) {
        var self=this;
        console.log('[%s] CLICK vercapitulos [%S]',self.whoami,self.model.get('productcode'));
        if (self.areChaptersVisible){
            //console.log('[%s] vercapitulos remove [%S]',self.whoami,self.viewchapters.whoami);
            self.viewchapters.removechilds();
        }else {
            var chctrl = dao.productViewFactory( {product:self.model, chselector:'#chapters1',anselector:'#ancestor1', context:this.el});
            chctrl.fetchChapters(function(chapters){
                //console.log('[%s] evercapituls callback [%S]   ',self.whoami,chapters.length);
                self.viewchapters = new ChaptersApendView({model: chapters, el:self.el});
                //self.$el.append(self.viewchapters.render().el )
                //$(self.el).after(self.viewchapters.render().el );
                //'#myTable tr:last').after
            });            
        }
        self.areChaptersVisible = !self.areChaptersVisible;
    } 

});

window.ChaptersApendView = Backbone.View.extend({
    whoami:'ChaptersApend:productlayout.js',

    initialize: function () {
        this.render();
    },

    chaptersArray:[],
    
    removechilds: function(){
        for (var i = 0; i < this.chaptersArray.length; i++) {
            this.chaptersArray[i].remove();
        }
    },

    render: function () {
        var products = this.model.models;
        var len = products.length;
        console.log('[%s] render  BEGIN len:[%s]',this.whoami,len);
        
        for (var i = 0; i < len; i++) {
            var onerow = new ProductRowItemView({model: products[i],className:'success'});
            this.chaptersArray.push(onerow);
            this.$el.after(onerow.render().el);
            //$('.thumbnails', this.el).append(new ChapterInlineView({model: products[i]}).render().el);
        }
        return this;
    }
});

