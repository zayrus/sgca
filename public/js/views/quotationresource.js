window.QuotationResourceView = Backbone.View.extend({
    /**
     *  Constructor en main.js:
     *        new QuotationResourceView({{model: resource})
     *
     */
    whoami:'QuotationResource',

    initialize: function () {
        if(this.model.options){
            utils.viewData.resourceList = this.model.options.quotation.getResourceList();
        }else{            
            utils.viewData.resourceList = [];
        }
        this.render();
    },

    events: {
    },

    render: function () {
        var resources = this.model.models;
        var len = resources.length;

        $(this.el).html('<div class="span7 resourcelist"></div>');

        for (var i = 0; i < len; i++) {
            $('.resourcelist', this.el).append(new QuotationResourceItemView({model: resources[i]}).render().el);
        }
        return this;
    }
});

window.QuotationResourceItemView = Backbone.View.extend({

    tagName: "div",
    
    initialize: function () {
        this.model.bind("change", this.render, this);
        this.model.bind("destroy", this.close, this);
    },

    render: function () {
        $(this.el).html(this.template(this.model.toJSON()));
        return this;
    }

});
