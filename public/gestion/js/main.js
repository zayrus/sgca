utils.loadTemplate(['HomeView', 'HeaderView', 'AboutView','DocumEditLayoutView','DocumEditSolLayoutView', 'DocumListLayoutView', 'DocumNavbar',
    'DocumEditMin', 'DocumShowDef','DocumEditCore','DocumEditCoreSol','DocumEditPT', 'SearchEntitiesForm','DocumEditPTLayout','DocumEditPTItem',
    'DocumEditRE', 'DocumEditREItem','DocumEditEM','DocumEditEMItem','DocumEditEMHeader', 'DocumShowLayoutView',
    'DocumShowBranding', 'DocumShowHeader', 'DocumShowItemPTHeader', 'DocumShowItemLayoutView','DocumShowItemPTComposite',
    'DocumShowItemPTDetail','DocumShowItemREHeader','DocumShowItemREComposite','DocumShowItemREDetail', 
    'DocumShowItemPEHeader', 'DocumShowItemPEComposite', 'DocumShowItemPEDetail',
    'DocumRelatedLayout', 'DocumRelatedPRHeader', 'DocumRelatedPR', 'DocumRelatedDOC',
    'DocumShowItemPDHeader', 'DocumShowItemPDComposite',
    'DocumEditSO','DocumEditSOItem','DocumEditSOLayout',
    'DocumShowItemSODetail','DocumShowItemSOComposite','DocumShowItemSOHeader',
    'ReportEditLayoutView', 'ReportEditCore', 'ReportNavbar' ], function() {

    $('[data-toggle=offcanvas]').click(function() {
        $('.row-offcanvas').toggleClass('active');
    });
    console.log('main: DocManager.start')
    DocManager.start();
});



/*
var AppRouter = Backbone.Router.extend({

    whoami: 'AppRouter: ',

    routes: {
        ""                       : "home",
        "login"                  : "browseProjects",
        "about"                  : "about",

        
    },


    initialize: function () {
        this.headerView = new HeaderView();
        $('.header').html(this.headerView.el);
    },


    home: function () {
        console.log('home:main.js');
        var user = new User();
        if (!this.homeView) {
            this.homeView = new HomeView({model: user});
        }
        $('#content').html(this.homeView.el);
        this.headerView.selectMenuItem('home-menu');
    },

    about: function () {
        console.log('about:main.js');
        if (!this.aboutView) {
            this.aboutView = new AboutView();
        }
        $('#content').html(this.aboutView.el);
        this.headerView.selectMenuItem('about-menu');
    },


});
*/


