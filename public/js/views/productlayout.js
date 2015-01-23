window.ProductBrowseModel = Backbone.Model.extend({
    // ******************* BROWSE PRODUCTS ***************
    whoami:'ProductBrowseModel:productlayout.js',

    retrieveData: function(){
        var qobj = {};
        var keys = _.keys(this.attributes);
        for (var k=0;k<keys.length;k++){
            var data = this.get(keys[k]);
            if(! (data==null || data=="" || data == "0")){
                qobj[keys[k]] = data;
            }
        }
        return qobj;
    },


    defaults: {
        parenttag:'#content',
        contenttag:'#listcontent',
        page:1,
        pquery: dao.productsQueryData(),
        numcapprefix: 100,
        tipoproducto:'paudiovisual',
        durnominal:'',
    }
});

window.ProductBrowseView = Backbone.View.extend({
    whoami:'ProductBrowseView:productlayout.js',

    initialize:function (options) {
        this.options = options;
        this.loadSettings();
        this.renderAll();
    },

    renderAll:function () {
        this.renderlayout();
        this.rendercontent();
    },

    loadSettings: function(){
        if(!this.settings) this.settings = new ProductBrowseModel();
        if(this.options.page) this.settings.set({page:this.options.page});
        if(this.options.parenttag) this.settings.set({parenttag:this.options.parenttag});
        utils.selectedProducts.reset();
    },

    renderlayout:function () {
        this.$el.html(new ProductListLayoutView({model: dao.productsQueryData()}).el);
        return this;
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

window.ProductListLayoutView = Backbone.View.extend({

    whoami:'ProductListLayoutView:productlayout.js',

    initialize:function () {
        this.render();
    },

    render:function () {
        $(this.el).html(this.template(this.model.toJSON()));
        return this;
    },

    events: {
        "change .nav-list"       : "change",
        "click  .prjview"        : "prjview",
        "click   .selproduct"    : "selectProductFromList",
        "click  .dselproduct"    : "deselectProductFromList",
        "click  .dselproject"    : "resetselection",
        "click  .addchapters"    : "linkchapters",
        "click  .addassociated"  : "linkcassociated",
        "click  .managetableNOT" : "managetable",
        "click  .buildtree"      : "buildtree",
        "click  .showmedia"      : 'showmedia',
    },

    buildtree: function  () {

        var windowObjectReference;
        var strWindowFeatures = "menubar=yes,location=yes,resizable=yes,scrollbars=yes,status=yes";
        var target = '/bacua/d3rendertree.html'
        var title = 'grafo'

        console.log('[%s] buildtree:BEGIN ',this.whoami);
        var self = this,
            ancestor = utils.selectedProducts.getSelected();

        ancestor.loadchilds(ancestor, {'es_coleccion_de.id': ancestor.id}, function(products){
            console.log('[%s] collection CALLBACK [%S]',self.whoami, products.length);
            var tree = dao.invertedAttributeList(ancestor, products);
            //console.log(JSON.stringify(tree));
            //console.log(JSON.stringify(JSON.parse(JSON.stringify(tree))));
            utils.d3treegraph = JSON.parse(JSON.stringify(tree));
            windowObjectReference = window.open(target);
        });

    },

    rendertree: function(root){

        //var target = window.open("/bacua/d3demo.html");
        $('#d3grafo').html('');
        var diameter = 960;
        var tree = d3.layout.tree()
            .size([360, diameter / 2 - 120])
            .separation(function(a, b) { return (a.parent == b.parent ? 1 : 2) / a.depth; });

        var diagonal = d3.svg.diagonal.radial()
            .projection(function(d) { return [d.y, d.x / 180 * Math.PI]; });

        var svg = d3.select("#d3grafo").append("svg")
            .attr("width", diameter)
            .attr("height", diameter - 150)
            .append("g")
            .attr("transform", "translate(" + diameter / 2 + "," + diameter / 2 + ")");


        //d3.json('flare.json', function(error, root) {
          var nodes = tree.nodes(root),
              links = tree.links(nodes);

          var link = svg.selectAll(".link")
            .data(links)
            .enter().append("path")
            .attr("class", "link")
            .attr("d", diagonal);

          var node = svg.selectAll(".node")
            .data(nodes)
            .enter().append("g")
            .attr("class", "node")
            .attr("transform", function(d) { return "rotate(" + (d.x - 90) + ")translate(" + d.y + ")"; });

          node.append("circle")
              .attr("r", 4.5);

          node.append("text")
              .attr("dy", ".31em")
              .attr("text-anchor", function(d) { return d.x < 180 ? "start" : "end"; })
              .attr("transform", function(d) { return d.x < 180 ? "translate(8)" : "rotate(180)translate(-8)"; })
              .text(function(d) { return d.name; });
        //});

        d3.select(self.frameElement).style("height", diameter - 150 + "px");
    },

    showmedia: function(){
        var target = utils.selectedProducts.first();
        if(target){
            window.open('/media/#show/'+target.id, 'showmedia');
        }else{
            window.open('/media/#show', 'showmedia');
        }
    },

    linkchilds: function (predicate) {
        console.log('[%s] linkchilds:BEGIN predicate:[%s]',this.whoami, predicate);
        var self = this,
            ancestor = utils.selectedProducts.getSelected(),
            childs = utils.selectedProducts.getList();

        if(ancestor){
            if(childs.length>0){
                ancestor.linkChildsToAncestor(childs,predicate, function(){
                });
            }
        }else{

        }
        return false;
    },

    linkcassociated: function () {
        console.log('[%s] linkassociated:BEGIN ',this.whoami);
        this.linkchilds('es_coleccion_de');
    },

    linkchapters: function () {
        console.log('[%s] linkchapters:BEGIN ',this.whoami);
        this.linkchilds('es_capitulo_de');
    }, 


    selectProductFromList: function(event){
        console.log('[%s] CLICK [%S]   ',this.whoami,event.target.name);
        utils.selectedProducts.select();
        $('.prselected').html(utils.selectedProducts.getSelectedLabel());
    },

    deselectProductFromList: function(event){
        console.log('[%s] CLICK [%S]   ',this.whoami,event.target.name);
        utils.selectedProducts.unselect();
        $('.prselected').html('deseleccionado');
    },
    prjview: function(){
        utils.approuter.navigate('ver/proyecto/'+dao.productsQueryData().getProjectId(), true);
        return false;
    },

    resetselection: function (event) {
        dao.productsQueryData().setProject('','proyecto no seleccionado');
        utils.approuter.browseProducts();
    },

    change: function (event) {
        var target = event.target;
        var change = {};
        change[target.name] = target.value;
        this.model.set(change);
        //alert("nos vamos?");
        //utils.approuter.navigate('navegar/requisitorias', true);
        utils.approuter.browseProducts();
    },

});

window.ProductListView = Backbone.View.extend({
    whoami:'ProductListView:productlayout.js',

    paginatorPath: '#navegar/productos/pag/',

    initialize: function (options) {
        this.options = options;
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

window.SolListItemView = Backbone.View.extend({

    tagName: "article",
    className: "col-xs-12 col-sm-6 col-md-4 margin-section req-list sistema-box",



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

