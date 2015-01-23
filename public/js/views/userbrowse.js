window.UserBrowseModel = Backbone.Model.extend({
    // ******************* BROWSE PRODUCTS ***************
    whoami:'UserBrowseModel:userlayout.js',

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
        pquery: dao.personsQueryData(),
        numcapprefix: 100,
        tipopersono:'paudiovisual',
        durnominal:'',
        descriptores:'',
    }
});

window.UserBrowseView = Backbone.View.extend({
    whoami:'UserBrowseView:userlayout.js',

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
        if(!this.settings) this.settings = new UserBrowseModel();


        console.log(this.settings);

        if(this.options.page) this.settings.set({page:this.options.page});
        if(this.options.parenttag) this.settings.set({parenttag:this.options.parenttag});
        utils.selectedUsers.reset();
    },

    renderlayout:function () {
        this.$el.html(new UserTableLayoutView({model: dao.personsQueryData()}).el);
        return this;
    },
    
    rendercontent:function () {
        var self = this,
            query = self.settings.get('pquery').retrieveData(),
            selector = self.settings.get('contenttag'),
            page = self.settings.get('page');

        self.personlist = new UserCollection();
        self.personlist.fetch({
            data: query,
            type: 'post',
            success: function() {
                console.log('[%s] fetch SUCCESS [%s]',self.whoami, selector);
                // UserListView controller: personlist.js
                $(selector).html(new UserListView({model: self.personlist, page: page}).el);
            }
        });
        return this;
    },

    events: {
        "change .nav-list" : "change",
        "click  .selreset" : "resetselection",
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

window.UserTableLayoutView = Backbone.View.extend({

    whoami:'UserTableLayoutView:userlayout.js',

    initialize:function () {
        this.render();
    },

    render:function () {
        $(this.el).html(this.template(this.model.toJSON()));
        return this;
    },

    events: {
        "change .nav-list"       : "change",
        "click  .selperson"      : "selectUserFromList",
        "click  .dselperson"     : "deselectUserFromList",
        "click  .dselproject"    : "resetselection",
        "click  .addmembers"     : "linkmembers",
        "click  .addassociated"  : "linkcassociated",
        "click  .managetableNOT" : "managetable",
        "click  .buildtree"      : "buildtree",
    },

    buildtree: function  () {

        var windowObjectReference;
        var strWindowFeatures = "menubar=yes,location=yes,resizable=yes,scrollbars=yes,status=yes";
        var target = '/bacua/d3rendertree.html'
        var title = 'grafo'

        console.log('[%s] buildtree:BEGIN ',this.whoami);
        var self = this,
            ancestor = utils.selectedUsers.getSelected();

        ancestor.loadchilds(ancestor, {'es_coleccion_de.id': ancestor.id}, function(persons){
            console.log('[%s] collection CALLBACK [%S]',self.whoami, persons.length);
            var tree = dao.invertedAttributeList(ancestor, persons);
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


    linkchilds: function (predicate) {
        console.log('[%s] linkchilds:BEGIN predicate:[%s]',this.whoami, predicate);
        var self = this,
            ancestor = utils.selectedUsers.getSelected(),
            childs = utils.selectedUsers.getList();

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
        this.linkchilds('es_relacion_de');
    },

    linkmembers: function () {
        console.log('[%s] linkmembers:BEGIN ',this.whoami);
        this.linkchilds('es_miembro_de');
    }, 


    selectUserFromList: function(event){
        console.log('[%s] CLICK [%S]   ',this.whoami,event.target.name);
        utils.selectedUsers.select();
        $('.prselected').html(utils.selectedUsers.getSelectedLabel());
    },

    deselectUserFromList: function(event){
        console.log('[%s] CLICK [%S]   ',this.whoami,event.target.name);
        utils.selectedUsers.unselect();
        $('.prselected').html('deseleccionado');
    },
    prjview: function(){
        utils.approuter.navigate('ver/proyecto/'+dao.personsQueryData().getProjectId(), true);
        return false;
    },

    resetselection: function (event) {
        dao.personsQueryData().setProject('','proyecto no seleccionado');
        utils.approuter.browseUsers();
    },

    change: function (event) {
        var target = event.target;
        var change = {};
        change[target.name] = target.value;
        this.model.set(change);
        //alert("nos vamos?");
        //utils.approuter.navigate('navegar/requisitorias', true);
        utils.approuter.browseUsers();
    },

});

window.UserListView = Backbone.View.extend({
    whoami:'UserListView:userlayout.js',

    paginatorPath: '#recuperar/usuarios/pag/',

    initialize: function (options) {
        this.options = options;
        this.render();
    },

    events: {
    },


    render: function () {
        
        var users = this.model.models;
        var len = users.length;
        var startPos = (this.options.page - 1) * 12;
        var endPos = Math.min(startPos + 12, len);

        
        console.log('[%s] render  BEGIN len:[%s]',this.whoami,len);
        
        
        var html  = '<table class="table table-bordered">';
            html +=  utils.buildTableHeader(utils.userListTableHeader);
            html += "<tbody class='tableitems'></tbody></table>";

        
        $(this.el).html(html);

        for (var i = startPos; i < endPos; i++) 
        {
            $('.tableitems', this.el).append(new UserRowItemView({model: users[i]}).render().el);
            //$('.thumbnails', this.el).append(new ChapterInlineView({model: persons[i]}).render().el);
        }

        $(this.el).append(new Paginator({model: this.model, paginatorPath: this.paginatorPath, page: this.options.page}).render().el);

        return this;
    }
});

window.UserListItemView = Backbone.View.extend({

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

window.UserRowItemView = Backbone.View.extend({

    whoami:'UserRowItemView:userlayout.js',

    tagName: "tr",

    events: {
        //"select .tselect"  : "checkpersonbox",
        //"select "  : "checkpersonbox",
        "change .tselect"  : "checkpersonbox",
        "click .col1"      : "editperson",
        "click .tzoom"     : "verrelated",
        "click"  : "click",
    },

    initialize: function () {
        this.model.bind("change", this.render, this);
        this.model.bind("destroy", this.close, this);
    },

    areRelatedVisible: false,

    render: function () {
        var data = utils.buildTableRow(utils.userListTableHeader,this.model);
        $(this.el).html(data);
        return this;
    },

    click: function(event){
        console.log('[%s] CLICK [%S]   ',this.whoami,this.model.get('personcode'));

    },

    checkpersonbox: function (event) {
        //console.log('[%s] SELECT [%S]   ',this.whoami,this.model.get('personcode'));
        //console.log('[%s] targetname: [%S]   target:value:[%s]',this.whoami,event.target.name,event.target.checked);
        if(event.target.checked)  utils.selectedUsers.add(this.model);
        if(!event.target.checked) utils.selectedUsers.remove(this.model);
        //console.log('[%s] array:[%s]',this.whoami,utils.selectedUsers.list);
        //_.each(utils.selectedUsers.list,function(element){
        //   console.log(' array:[%s]; ',element.get('personcode'));
        //});
    },

    edituser: function(event){
        console.log('[%s] CLICK editperson [%s]   ',this.whoami,this.model.get('nickName'));
        utils.approuter.navigate('usuarios/'+this.model.id , true);

    },

    verrelated: function (event) {
        var self=this;
        console.log('[%s] CLICK verrelated [%S]',self.whoami,self.model.get('nickName'));
        if (self.areRelatedVisible){
            //console.log('[%s] verrelated remove [%S]',self.whoami,self.relatedList.whoami);
            self.relatedList.removechilds();
        }else {
            var chctrl = dao.productViewFactory( {product:self.model, chselector:'#chapters1',anselector:'#ancestor1', context:this.el});
            chctrl.fetchRelated(function(items){
                //console.log('[%s] evercapituls callback [%S]   ',self.whoami,items1.length);
                self.relatedList = new RelatedInlineView({model: items, el:self.el});
                //self.$el.append(self.relatedList.render().el )
                //$(self.el).after(self.relatedList.render().el );
                //'#myTable tr:last').after
            });            
        }
        self.areRelatedVisible = !self.areRelatedVisible;
    } 

});

window.RelatedInlineView = Backbone.View.extend({
    whoami:'ChaptersApend:userlayout.js',

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
        var self = this;
        var persons = self.model;
        var len = persons.length;
        console.log('[%s] render  BEGIN len:[%s]',self.whoami,len);
        
        persons.each(function(person){
            var onerow = new UserRowItemView({model: person,className:'success'});
            self.chaptersArray.push(onerow);
            self.$el.after(onerow.render().el);
            //$('.thumbnails', self.el).append(new ChapterInlineView({model: persons[i]}).render().el);
        });
        return self;
    }
});

