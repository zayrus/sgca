window.UserViewLayout = Backbone.View.extend({

    whoami:'UserViewLayout',

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