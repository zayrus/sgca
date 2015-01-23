window.ProjectListView = Backbone.View.extend({

    whoami:'ProjectListView',

    paginatorPath: '#navegar/proyectos/pag/',

    initialize: function (options) {
        this.options  = options;
        this.render();
    },

    render: function () {
        var projects = this.model.models;
        var len = projects.length;
        var startPos = (this.options.page - 1) * 12;
        var endPos = Math.min(startPos + 12, len);


        $(this.el).html('<div class="row js-hook"></div>');

        for (var i = startPos; i < endPos; i++) {
            $('.js-hook', this.el).append(new ProjectListItemView({model: projects[i]}).render().el);
        }

        $(this.el).append(new Paginator({model: this.model, paginatorPath: this.paginatorPath, page: this.options.page}).render().el);

        return this;
    }
});

window.ProjectListItemView = Backbone.View.extend({

    tagName: "div",
    className:'col-md-4',
    
    initialize: function () {
        console.log('projectListItemView')
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