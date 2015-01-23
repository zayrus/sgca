window.Paginator = Backbone.View.extend({

    whoami:'Paginator',

    tagName:'nav',

    //className: "pagination pagination-centered",

    initialize:function (options) {
        this.options = options;
        this.model.bind("reset", this.render, this);
        this.render();
    },

    render:function () {

        var items = this.model.models;
        var len = items.length;
        var pageCount = Math.ceil(len / 12);

        //chancho:
        if(pageCount > 10) pageCount = 10;

        $(this.el).html('<ul class="pagination"></ul>');

        for (var i=0; i < pageCount; i++) {
            if((i + 1) === this.options.page){
                active = ' class="active" ';
                spanlabel = 'página corriente';
            }else{
                active = '';
                spanlabel = '';            
            }
            //$('ul', this.el).append("<li" + ((i + 1) === this.options.page ? " class='active' ><span class='sr-only' >(selección activada)</span> " : ">") + "<a href='"+this.options.paginatorPath+(i+1)+"'>" + (i+1) + "</a></li>");
            $('ul', this.el).append("<li" + active +  ">" + "<a href='"+this.options.paginatorPath+(i+1)+"'><span class='sr-only'>" + spanlabel + "</span> " + (i+1) + "</a></li>");
        }

        return this;
    }
});
