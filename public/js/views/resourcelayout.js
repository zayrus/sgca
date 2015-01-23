window.ResourceListLayoutView = Backbone.View.extend({

    whoami:'ResourceListLayoutView',

    initialize:function () {
        this.render();
    },

    render:function () {
        $(this.el).html(this.template(this.model.toJSON()));
        return this;
    },

    events: {
        "change .nav-list"  : "change",
        "click  .selreset"  : "resetselection",
        "click  .prjview"   : "prjview",
    },

    prjview: function (event){
        utils.approuter.navigate('ver/proyecto/'+dao.resourcesQueryData().getProjectId(), true);
        return false;
    },

    resetselection: function (event) {
        dao.resourcesQueryData().setProject('','proyecto no seleccionado');
        utils.approuter.browseResources();
    },

    change: function (event) {
        var target = event.target;
        var change = {};
        change[target.name] = target.value;
        this.model.set(change);
        //alert("nos vamos?");
        //utils.approuter.navigate('navegar/recursos', true);
        utils.approuter.browseResources();
    },

});