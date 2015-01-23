window.QuotationListView = Backbone.View.extend({


    whoami:'QuotationListView',

    paginatorPath: '#navegar/requisitorias/pag/',

    initialize: function (options) {
        this.options = options;
        this.render();
    },

    events: {
    },

    render: function () {
        var quotations = this.model.models;
        var len = quotations.length;
        var startPos = (this.options.page - 1) * 12;
        var endPos = Math.min(startPos + 12, len);


        $(this.el).html('<ul class="thumbnails"></ul>');

        for (var i = startPos; i < endPos; i++) {
            var quot = quotations[i];
            $('.thumbnails', this.el).append(new QuotationListItemView({model: quot}).render().el);
            //this.listresources(quot);
        }

        $(this.el).append(new Paginator({model: this.model, paginatorPath: this.paginatorPath, page: this.options.page}).render().el);

        return this;
    },

    listresources: function(quot){
        var rlist = quot.getResourceList();
        if(!(rlist && rlist.length>0)) return;
        //
        for (var j = 0; j < rlist.length; j++) {
            var resid = rlist[j];
            var resource = new Resource({_id: id});
            resource.fetch({success: function() {
                $('.thumbnails', this.el).append(new ResourceQuotationView({model: resource}).render().el);
            }});
        }
    }
});

window.ResourceQuotationView = Backbone.View.extend({

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

window.QuotationListItemView = Backbone.View.extend({

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