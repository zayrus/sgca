var AppRouter = Backbone.Router.extend({

    whoami: 'bacua AppRouter:bacua/main.js ',

    routes: {
        ""                       : "home",
        "login"                  : "browseProjects",
        "about"                  : "about",
        "pa/ver/:id"             : "viewproduct",

    },

    initialize: function () {
        this.headerView = new HeaderView();
        $('.header').html(this.headerView.el);
    },

    viewproduct: function(id) {
        console.log('[%s] viewproduct BEGIN',this.whoami);

        var viewproduct = new ProductView({el:'#content', productid:id, parenttag:'content'});
 
    },

    home: function () {
        console.log('home:main.js');
        if (!this.homeView) {
            this.homeView = new HomeView();
        }
        $('#content').html(this.homeView.el);
        this.headerView.selectMenuItem('home-menu');
    },

    about: function () {
        console.log('about:main.js');
        if (!this.aboutView) {
            this.aboutView = new AboutView();
        }
        $('.marketing').html(this.aboutView.el);
        this.headerView.selectMenuItem('about-menu');
    },

    browseProjects: function(page) {
        console.log('browseProjects:main.js');
        $('#content').html(new ProjectListLayoutView({model: dao.projectsQueryData()}).el);

        var p = page ? parseInt(page, 10) : 1,
            query = dao.projectsQueryData().retrieveData(),
            projectList = new ProjectCollection();

        projectList.fetch({
            data: query,
            type: 'post',
            //data: $.param({rubro:'tecnica'}),
            //data: JSON.stringify({rubro:'tecnica'}),
            success: function() {
                $("#listcontent").html(new ProjectListView({model: projectList, page: p}).el);
            }
        });
        this.headerView.selectMenuItem('browse-menu');
    },


});
 
utils.loadTemplate(['HomeView', 'HeaderView', 'AboutView', 'ProductViewLayout', 'ProductViewCarouselItem1',
     'ProductViewFeaturette1', 'ProductViewDestacados1', 'ProductViewJumboLayout', 'ProductViewJumboHeader1'], function() {
    app = new AppRouter();
    utils.approuter = app;
    Backbone.history.start();
});
