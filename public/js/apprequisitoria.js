var ReqviewerAppRouter = Backbone.Router.extend({

    whoami: 'ReqviewerAppRouter: ',

    routes: {
        ""                      : "home",
        "req/:id"               : "requestview"
    },

    requestview: function (id){
        console.log('requestview:main.js');
        processreqview(id);
    },

    vvvvvvv: function (id){
        console.log('quotationDetails:main.js');

        this.reqHeaderView = new ReqHeaderView();
        $('.header').html(this.reqHeaderView.el);
        alert('vistarequisitoria: '+id);
        //if (!this.quotationListLayoutView) {
        //    alert('create view 2');
        //    this.quotationListLayoutView = new QuotationListLayoutView({model: dao.quotationsQueryData()});
        //}
        $('#content').html(new QuotationListLayoutView({model: dao.quotationsQueryData()}).el);
        var quotation = new Quotation({_id: id});
        quotation.fetch({success: function() {
            $("#listcontent").html(new QuotationView({model: quotation}).el);
        }});
        this.headerView.selectMenuItem();


    },

    initialize: function () {
    }

});

utils.loadTemplate(['ReqHeaderView','ReqResListView','ReqResDetailView'], function() {

    utils.reqviewerapp = new ReqviewerAppRouter();
    Backbone.history.start();

});
