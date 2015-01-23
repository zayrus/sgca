window.RequestListView = Backbone.View.extend({

    whoami:'RequestListView',

    paginatorPath: '#navegar/solicitudes/pag/',

    initialize: function (options) {
        this.options  = options;
        this.render();
    },

    render: function () {
        var requests = this.model.models;
        var len = requests.length;
        var startPos = (this.options.page - 1) * 12;
        var endPos = Math.min(startPos + 12, len);


        //$(this.el).html('<div class="col-xs-pull-1 col-xs-push-1 col-xs-12 margin-section row req-list js-hook"></div>');
        $(this.el).html('<div class="row margin-section req-list js-hook"></div>');

        for (var i = startPos; i < endPos; i++) {
            $('.js-hook', this.el).append(new RequestListItemView({model: requests[i]}).render().el);
        }

        //$(this.el).append(new Paginator({model: this.model, paginatorPath: this.paginatorPath, page: this.options.page}).render().el);

        return this;
    }
});

window.RequestListItemView = Backbone.View.extend({

    //tagName: "div",
    //className:'col-xs-pull-1 col-xs-push-1 col-xs-12 margin-section row req-list',
    tagName: "article",
    className:'col-xs-12 col-sm-6 col-md-4 sistema-box',

    
    initialize: function () {
        console.log('requestListItemView')
        this.model.bind("change", this.render, this);
        this.model.bind("destroy", this.close, this);
        this.lookupTitles();
     

    },

    lookupTitles: function(){
        var self = this,
            querymodel = new BrowseProductsQuery(),
            productList = new ProductCollection();
        
        querymodel.setProject(this.model.id,'');
        var query = querymodel.retrieveData();
        
        productList.fetch({
            data: query,
            type: 'post',
            success: function(productList) {
                if(productList.length>0){
                    self.setTitle(productList);
                }
            }
        });

    },

    setTitle: function(list){
        var self = this,
            titles = [],
            title; 
        list.each(function(model){
            titles.push(model.get('productcode')+': '+model.get('slug'));
        });
        title = titles.join('\n');
        self.$('a').attr('title',title);

    },

    render: function () {
        $(this.el).html(this.template(this.model.toJSON()));
        return this;
    }

});