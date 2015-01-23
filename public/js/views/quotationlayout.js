window.QuotationListLayoutView = Backbone.View.extend({

    whoami:'QuotationListLayoutView',

    initialize:function () {
        this.render();
    },

    render:function () {
        $(this.el).html(this.template(this.model.toJSON()));
        return this;
    },

    events: {
        "change .nav-list" : "change",
        "click  .selreset" : "resetselection",
        "click  .prjview"  : "prjview",
    },

    prjview: function(){
        utils.approuter.navigate('ver/proyecto/'+dao.quotationsQueryData().getProjectId(), true);
        return false;
    },

    resetselection: function (event) {
        dao.quotationsQueryData().setProject('','proyecto no seleccionado');
        utils.approuter.browseQuotations();
    },

    change: function (event) {
        var target = event.target;
        var change = {};
        change[target.name] = target.value;
        this.model.set(change);
        //alert("nos vamos?");
        //utils.approuter.navigate('navegar/requisitorias', true);
        utils.approuter.browseQuotations();
    },

});