window.PersonViewLayout = Backbone.View.extend({

    whoami:'PersonViewLayout',

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
