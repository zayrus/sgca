window.ProductPaTechFacetView = Backbone.View.extend({
    /**
     *  Constructor en productdetails.js:
     *        new ProductPaTechFacetView({{model: patechfacet})
     *
     */
    whoami:'ProductPaTechFacetView',

    initialize: function () {
        //this.render();
        //console.log('initialize:[%s] [%s]',this.model.get('fecreacion'),$('#fecreacion').val());
    },

    render: function () {
        $(this.el).html(this.template(this.model.toJSON()));
        return this;
    },

    events: {
        "change"  : "change",
    },


    change: function (event) {
        //console.log('change:fproductpatechfact FIRED');
        utils.hideAlert();

        var target = event.target;
        var change = {};
        change[target.name] = target.value;
        this.model.set(change);
        //console.log(change);
        //console.log('change : target:[%s] now:[%s] [%s]',target.name,this.model.get(target.name),this.model.whoami);

        // Run validation rule (if any) on changed item
        /*
        var check = this.model.validateItem(target.id);
        if (check.isValid === false) {
            utils.addValidationError(target.id, check.message);
        } else {
           utils.removeValidationError(target.id);
        }
        */
        return false;
    },

});