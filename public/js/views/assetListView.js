window.AssetListView = Backbone.View.extend({


    whoami:'AssetListView',

    paginatorPath: '#navegar/recursos/pag/',

    initialize: function (options) {
        this.options = options;
        this.render();
    },

    events: {
    },

    render: function () {
       // alert("ddddd");
        var assets = this.model.models;
        var len = assets.length;
        var startPos = (this.options.page - 1) * 12;
        var endPos = Math.min(startPos + 12, len);

        //$(this.el).html('<div class="row-fluid"><div class="span9"><div>Hello!</div><ul class="thumbnails span8"></ul></div></div>');

        /*      for (var i = startPos; i < endPos; i++) {
            $('.thumbnails', this.el).append(new ResourceListItemView({model: resources[i]}).render().el);
        }

        $(this.el).append(new Paginator({model: this.model, paginatorPath: this.paginatorPath, page: this.options.page}).render().el);

        return this;*/

        /*for (var i = 0; i < len; i++) {
            $('.thumbnail', this.el).append(new FilesListItemView({model: assets[i]}).render().el);
        }*/

        for (var i = 0; i < len; i++){
            //$('.thumbnails', this.el).append(new AssetListItemView({model: assets[i]}).render().el);
            $(this.el).append(new AssetListItemView({model: assets[i]}).render().el);
        }

        $(this.el).append(new Paginator({model: this.model, paginatorPath: this.paginatorPath, page: this.options.page}).render().el);

        return this;
    }
});

window.AssetListItemView = Backbone.View.extend({
    
    initialize: function () {
        this.model.bind("change", this.render, this);
        this.model.bind("destroy", this.close, this);
    },

    render: function () {
        $(this.el).html(this.template(this.model.toJSON()));
        return this;
    }

});