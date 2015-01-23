window.ResourceListView = Backbone.View.extend({


    whoami:'ResourceListView',

    paginatorPath: '#navegar/recursos/pag/',

    initialize: function (options) {
        this.options = options;
        this.render();
    },

    events: {
    },

    render: function () {
        var resources = this.model.models;
        var len = resources.length;
        var startPos = (this.options.page - 1) * 12;
        var endPos = Math.min(startPos + 12, len);


        $(this.el).html('<ul class="thumbnails"></ul>');

        for (var i = startPos; i < endPos; i++) {
            $('.thumbnails', this.el).append(new ResourceListItemView({model: resources[i]}).render().el);
        }

        $(this.el).append(new Paginator({model: this.model, paginatorPath: this.paginatorPath, page: this.options.page}).render().el);

        return this;
    }
});

window.ResourceListItemView = Backbone.View.extend({

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