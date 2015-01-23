window.RequestListLayoutView = Backbone.View.extend({

    whoami:'RequestListLayoutView',

    tagName: 'section',
    className: 'page-view',

    initialize:function () {
        this.render();
    },

    render:function () {
        $(this.el).html(this.template(this.model.toJSON()));
        return this;
    },

    events: {
        "change":"change",
    },

    change: function (event) {
        var target = event.target;
        var change = {};
        change[target.name] = target.value;
        this.model.set(change);
        //alert("nos vamos?");
        //utils.approuter.navigate('navegar/recursos', true);
        utils.approuter.browseRequests();
    },
});

window.RequestViewLayout = Backbone.View.extend({

    whoami:'RequestViewLayout',
    tagName:'section',
    className:'page-view',

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
        "click .browseprojects" : "browseRequests",
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
        //dao.quotationsQueryData().setRequest(this.model.id,this.model.get('denom'));
  
        utils.approuter.navigate('requisitorias/add', true);
        return false;
    },

    browseQuotations: function () {
        //dao.quotationsQueryData().setRequest(this.model.id,this.model.get('denom'));
        utils.approuter.navigate('navegar/requisitorias', true);
        return false;
    },

    browseRequests: function () {
        //dao.quotationsQueryData().setRequest(this.model.id,this.model.get('denom'));
        utils.approuter.navigate('navegar/proyectos', true);
        return false;
    },

    browseResources: function () {
        //dao.quotationsQueryData().setRequest(this.model.id,this.model.get('denom'));
        utils.approuter.navigate('navegar/recursos', true);
        return false;
    },

    browseProducts: function () {
        //dao.quotationsQueryData().setRequest(this.model.id,this.model.get('denom'));
        utils.approuter.navigate('navegar/productos', true);
        return false;
    },

    addResources: function () {
        //dao.resourcesQueryData().setRequest(this.model.id,this.model.get('denom'));
        utils.approuter.navigate('recursos/add', true);
        return false;
    },

    addProducts: function () {
        //dao.resourcesQueryData().setRequest(this.model.id,this.model.get('denom'));
        utils.approuter.navigate('productos/add', true);
        return false;
    },

});