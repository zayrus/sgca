window.projectview = function(id){
    console.log('projectview:prjviewctrl.js [%s]',id);
    
    utils.prjmodel = {};
    utils.prjmodel.project = new Project({_id: id});
    //utils.prjmodel.quotation = new Quotation();

    var prjHeaderView = new PrjHeaderView({model:utils.prjmodel.project});
    $('#prjheader').html(prjHeaderView.el);
    
    utils.prjmodel.project.fetch({success: projectviewsuccess}); 
};

window.requestview = function(id, user){
    console.log('requestview:requestviewctrl.js [%s]',id);
    
    utils.requestmodel = {};
    utils.requestmodel.request = new Request({_id: id});
    dao.solQueryData().setUser(user._id);
    //utils.requestmodel.quotation = new Quotation();

    
    utils.requestmodel.request.fetch({success: requestviewsuccess}); 
};

var requestviewsuccess = function(request){
    console.log('projectviewsuccess [%s]',request.get('slug'))
    dao.resourcesQueryData().setProject(request.id,request.get('denom'));
    dao.quotationsQueryData().setProject(request.id,request.get('denom'));
    dao.productsQueryData().setProject(request.id,request.get('denom'));
    
    resourceview();
    assetsview();
    productview();
    solview();
};

var projectviewsuccess = function(prj){
    console.log('projectviewsuccess [%s]',prj.get('slug'))
    dao.resourcesQueryData().setProject(prj.id,prj.get('denom'));
    dao.quotationsQueryData().setProject(prj.id,prj.get('denom'));
    dao.productsQueryData().setProject(prj.id,prj.get('denom'));
   
    resourceview();
    assetsview();
    productview();
};

window.productview = function(){
    console.log('productview:prjviewctrl.js ');
    var query = dao.productsQueryData().retrieveData(),
        productList = new ProductCollection();
    
    $('#productlist').html('');
    productList.fetch({
        data: query,
        type: 'post',
        success: function(productList) {
            if(productList.length>0){
                //$('#reslist').append('<h3>recursos</h3>');
                productList.each(productviewsuccess);   
            }
        }
    });
};

window.solview = function(){
    var query = dao.solQueryData().retrieveData(),
        solList = new DocumentCollection();
    $('#sollist').html('');
    solList.fetch({
        data: query,
        type: 'post',
        success: function(solList) {
            console.log('SOLVIEW [%s]',solList.length)
            if(solList.length>0){
                //$('#reslist').append('<h3>recursos</h3>');
                solList.each(solviewsuccess);   
            }
        }
    });
};


var productviewsuccess = function(product){
    console.log('productviewsuccess: [%s]',product.get('slug'));

    var productListView = new ProductListItemView({model:product,tagName:'div'});
    $('#productlist').append(productListView.render().el);  

    //var reqResDetailView = new ReqResDetailView({model:product});
    //$('#productlist').append(reqResDetailView.render().el);
    // todo: listar los files del resource

};

var solviewsuccess = function(model){
    console.log('solviewsuccess: [%s]',model.get('slug'));

    var solListView = new SolListItemView({model:model});
    $('#listcontent').append(solListView.render().el);  



};


window.resourceview = function(){
    console.log('resourceview:prjviewctrl.js ');
    var query = dao.resourcesQueryData().retrieveData(),
        resourceList = new ResourceCollection();
    
    $('#reslist').html('');
    resourceList.fetch({
        data: query,
        type: 'post',
        success: function(resourceList) {
            if(resourceList.length>0){
                //$('#reslist').append('<h3>recursos</h3>');
                resourceList.each(resourceviewsuccess);   
            }
        }
    });
};

var resourceviewsuccess = function(res){
    //console.log('resourceviewsuccess: [%s]',res.get('slug'));

    var reqResListView = new ResourceListItemView({model:res,tagName:'div'});
    $('#reslist').append(reqResListView.render().el);  

    var reqResDetailView = new ReqResDetailView({model:res});
    $('#reslist').append(reqResDetailView.render().el);
    // todo: listar los files del resource

};

var resourcelist = function(res){
    utils.prjmodel.resource = res;
    
    console.log('resourceviewsuccess: [%s]',res.get('slug'));

    var reqResListView = new ResourceListItemView({model:res,tagName:'div'});
    $('#reslist').append(reqResListView.render().el);  

    var reqResDetailView = new ReqResDetailView({model:res});
    $('#reslist').append(reqResDetailView.render().el);
    // todo: listar los files del resource

};

window.resourceassetlist = function(res){
    var query = {'es_asset_de.id': res.id },
        assetList = new AssetCollection();

    assetList.fetch({
        data: query,
        type: 'post',
        success: function(assetList) {
            resourcelist();

            if(assetList.length>0){
                $('#reslist').append('<h5>archivos</h5>');
                assetList.each(resassetviewsuccess);   
            }
        }
    });
};

var resassetviewsuccess = function(asset){
    console.log('assetviewsuccess: [%s]',asset.get('slug'));

    var assetAccordionView = new AssetAccordionView({model:asset,tagName:'div', className:'span8'});
    $('#reslist').append(assetAccordionView.render().el);  
};


window.assetsview = function(){
    console.log('assetsview:prjviewctrl.js [' + dao.resourcesQueryData().getProject()+']');
    var query = {'es_asset_de.id': dao.resourcesQueryData().getProjectId()},
        assetList = new AssetCollection();

    assetList.fetch({
        data: query,
        type: 'post',
        success: function(assetList) {
            if(assetList.length>0){
                $('#assets').append('<h4>archivos</h4>');
                assetList.each(assetviewsuccess);   
            }
        }
    });
};

var assetviewsuccess = function(asset){
    //console.log('assetviewsuccess: [%s]',asset.get('slug'));

    var assetAccordionView = new AssetAccordionView({model:asset,tagName:'div'});
    $('#assets').append(assetAccordionView.render().el);  
};
    

var quotationsuccess = function(quo){
    utils.reqmodel.project.set({_id: quo.get('project')._id});
    utils.reqmodel.project.fetch({success: projectsuccess});

    var resourcesid = quo.get('resources');
    var resources = [];
    for (var i =0; i<resourcesid.length; i++){
        var res = new Resource({_id: resourcesid[i]}).fetch({success: resourcesuccess});
        resources.push(res);

    }
    utils.reqmodel.resources = resources;
};

window.RequestHeaderView = Backbone.View.extend({

    initialize: function () {
        this.listenTo(this.model, "change", this.render);
        //this.listenTo(this.project,"change", this.render);
    },

    render: function () {
        //alert(JSON.stringify(this.model.toJSON()));
        $(this.el).html(this.template({prj: this.model.toJSON()}));
        return this;
    },
});


window.PrjHeaderView = Backbone.View.extend({

    initialize: function () {
        this.listenTo(this.model, "change", this.render);
        //this.listenTo(this.project,"change", this.render);
    },

    render: function () {
        //alert(JSON.stringify(this.model.toJSON()));
        $(this.el).html(this.template({prj: this.model.toJSON()}));
        return this;
    },
});

window.ReqResListView = Backbone.View.extend({

    initialize: function () {
        this.listenTo(this.model, "change", this.render);
        this.model.bind("change", this.render, this);
        this.model.bind("destroy", this.close, this);
    },

    render: function () {

        //alert(JSON.stringify(this.model.toJSON()));
        $(this.el).html(this.template(this.model.toJSON()));
        return this;
    },
});

window.AssetAccordionView = Backbone.View.extend({
    /*
        <input type='text' placeholder='nombre corto' name='slug' value='<%= slug %>' >
        <input type='text' placeholder='denominación' name='denom' value='<%= denom %>' >
    */

    events: {
        "change"            : "change",
    },

    initialize: function () {
        //this.listenTo(this.model, "change", this.render);
        this.model.bind("change", this.render, this);
        //this.model.bind("destroy", this.close, this);
    },

    render: function () {
        $(this.el).html(this.template(this.model.toJSON()));

        this.$('.nailthumb-container').nailthumb();
        return this;
    },
    
    change: function(event){
        this.model.set(event.target.name,event.target.value);
        this.model.save(null, {
            success: function (model) {
                utils.showAlert('Success!', 'Node saved successfully', 'alert-success');
            },
            error: function () {
                utils.showAlert('Error', 'An error occurred while trying to delete this item', 'alert-error');
            }
        });
    }
});


window.ReqResDetailView = Backbone.View.extend({
    tagName:'div',
    className:'span10',

    initialize: function () {
        this.listenTo(this.model, "change", this.render);
        this.model.bind("change", this.render, this);
        this.model.bind("destroy", this.close, this);
    },

    render: function () {

        //alert(JSON.stringify(this.model.toJSON()));
        $(this.el).html(this.template(this.model.toJSON()));
        return this;
    },
});

window.SolicitudViewLayout = Backbone.View.extend({
    //entry point para ver Solicitud

    initialize:function () {
         console.log('View created');
        console.log('ver: [%s]', this.model.get('slug'));
        this.render();
    },

    render:function () {
        this.$el.html(this.template(this.model.toJSON()));
        return this;
    },

})

window.ProjectViewLayout = Backbone.View.extend({

    whoami:'ProjectViewLayout',

    initialize:function () {
        this.render();
    },

    render:function () {
        $(this.el).html(this.template(this.model.toJSON()));
        return this;
    },

    events: {
        "click .addresources" : "addResources",
        "click .addproducts"  : "addProducts",
        "click .addquotation" : "addQuotation",
        "click .browsequotations" : "browseQuotations",
        "click .browseproducts" : "browseProducts",
        "click .browseresources" : "browseResources",
        "click .browseprojects" : "browseProjects",
        "change"           : "change"
    },

    change: function (event) {
        var target = event.target;
        var change = {};
        change[target.name] = target.value;
        this.model.set(change);
        resourceview();
    },

    addQuotation: function () {
        //dao.quotationsQueryData().setProject(this.model.id,this.model.get('denom'));
  
        utils.approuter.navigate('requisitorias/add', true);
        return false;
    },

    browseQuotations: function () {
        //dao.quotationsQueryData().setProject(this.model.id,this.model.get('denom'));
        utils.approuter.navigate('navegar/requisitorias', true);
        return false;
    },

    browseProjects: function () {
        //dao.quotationsQueryData().setProject(this.model.id,this.model.get('denom'));
        utils.approuter.navigate('navegar/proyectos', true);
        return false;
    },

    browseResources: function () {
        //dao.quotationsQueryData().setProject(this.model.id,this.model.get('denom'));
        utils.approuter.navigate('navegar/recursos', true);
        return false;
    },

    browseProducts: function () {
        //dao.quotationsQueryData().setProject(this.model.id,this.model.get('denom'));
        utils.approuter.navigate('navegar/productos', true);
        return false;
    },

    addResources: function () {
        //dao.resourcesQueryData().setProject(this.model.id,this.model.get('denom'));
        utils.approuter.navigate('recursos/add', true);
        return false;
    },

    addProducts: function () {
        //dao.resourcesQueryData().setProject(this.model.id,this.model.get('denom'));
        utils.approuter.navigate('productos/add', true);
        return false;
    },

});

