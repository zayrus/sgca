window.processreqview = function(id){
    console.log('processview:reqviewctrl.js [%s]',id);
    utils.reqmodel = {};
 
    utils.reqmodel.quotation = new Quotation({_id: id});
    utils.reqmodel.project = new Project();

    var reqHeaderView = new ReqHeaderView({model:utils.reqmodel.quotation, project:utils.reqmodel.project});
    $('.header').html(reqHeaderView.el); 
    
    utils.reqmodel.quotation.fetch({success: quotationsuccess}); 
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

var projectsuccess = function(prj){
    //utils.reqmodel.project = prj;
//
    console.log('end projectsuccess [%s]',prj.get('slug'))
};

var resourcesuccess = function(res){
    console.log('resource success: [%s]',res.get('slug'));

    var reqResListView = new ReqResListView({model:res});
    $('#reslist').append(reqResListView.render().el);

    var reqResDetailView = new ReqResDetailView({model:res});
    $('#resdetail').append(reqResDetailView.render().el);
}

window.ReqHeaderView = Backbone.View.extend({

    initialize: function () {
        this.project = this.options.project;
        this.listenTo(this.model, "change", this.render);
        this.listenTo(this.project,"change", this.render);
    },

    render: function () {
        //alert(JSON.stringify(this.model.toJSON()));
        $(this.el).html(this.template({req: this.model.toJSON(),prj:this.project.toJSON()}));
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

window.ReqResDetailView = Backbone.View.extend({

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
