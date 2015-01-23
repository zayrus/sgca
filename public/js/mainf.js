var AppRouter = Backbone.Router.extend({

    whoami: 'AppRouter: ',

    routes: {
        ""                       : "loginhome",
        "login"                  : "login",
        "home"                   : "home",
        "terminosdeuso"          : "about",

        "ver/proyecto/:id"       : "viewprojectDetails",
        "proyectos"              : "listProjects",
        "navegar/proyectos"      : "browseProjects",
        "navegar/proyectos/pag/:page"  : "browseProjects",
        "proyectos/pag/:page"    : "listProjects",
        "proyectos/add"          : "addProject",
        "proyectos/:id"          : "projectDetails",

        "ver/solicitud/:id"       : "viewrequestDetails",
        "solicitudes"              : "listRequests",
        "navegar/solicitudes"      : "browseRequests",
        "navegar/solicitudes/pag/:page"  : "browseRequests",
        "solicitudes/pag/:page"    : "listRequests",
        "solicitudes/add"          : "addRequest",
        "solicitudes/:id"          : "requestDetails",
        "solicitud/:id/edit"       : "editSolicitud",

        "recursos"               : "browseResources",
        "navegar/recursos"       : "browseResources",
        "navegar/recursos/pag/:page"  : "browseResources",
        "recursos/pag/:page"     : "listResources",
        "recursos/add"           : "addResource",
        "recursos/:id"           : "resourceDetails",

        "requisitorias"          : "browseQuotations",
        "navegar/requisitorias"  : "browseQuotations",
        "navegar/requisitorias/pag/:page"  : "browseQuotations",
        "requisitorias/add"      : "addQuotation",
        "requisitorias/:id"      : "quotationDetails",

        "productos/add"          : "addProduct",
        "navegar/productos"      : "browseProducts",
        "navegar/productos/pag/:page"  : "browseProducts",
        "productos/:id"          : "productDetails",

        "articulos/add"          : "addArticle",
        "navegar/articulos"      : "browseArticles",
        "navegar/articulos/pag/:page"  : "browseArticles",
        "articulos/:id"          : "articleDetails",

        "perfil"                : "editProfile",

        "personas/add"          : "addPerson",
        "navegar/personas"      : "browsePersons",
        "navegar/personas/pag/:page"  : "browsePersons",
        "personas/:id"          : "personDetails",

        "activos/add"            : "assetDetails",
        "activos/:id"            : "assetDetails",
        "navegar/activos"        : "browseAssets",

        "usuarios/add"           : "addUser",
        "usuarios/:id"           : "userDetails",
        "recuperar/usuarios"     : "browseUsers",

        "navegar/comprobantes"   : "gestion"        
    },


    initialize: function () {
        var self = this;
        dao.currentUser.getUser(function(user){
            var theUser = user ? new User(user) : new User();
            if(!self.headerView){
                //console.log('INITIALIZE Header: main.js USER found: [%s]',theUser.get('displayName'));
                self.headerView = new HeaderView({model: theUser});
                $('.header').html(self.headerView.el);
            }
        });
    },

    loginhome: function(){
        var self = this;
        console.log('******* LoginHome');
        window.location = '/index-login.html';
    },


    home: function(){
        var self = this;
        console.log('******* HOME???');
        dao.currentUser.getUser(function(user){
            console.log('HOME Header: main.js USER found: [%s]',user.displayName);
            self.headerView = new HeaderView({model: new User(user)});
            $('.header').html(self.headerView.el);

            if(false){
                app.navigate('navegar/productos', false);
                self.browseProducts();
            } else {
                window.location = '/gestion/#comprobantes';
            }
        });
    },

    login: function () {
        console.log('login:main.js BEGINS');
        //dao.currentUser.getUser(function(user){
        //    console.log('Login:main.js USER found: [%s]',user.username);
        //});

        var userlogin = new UserLogin();
        var user = new User();
        if (!this.homeView) {
            console.log('HomeView: Initialize:main.js ');
            this.homeView = new HomeView({model: userlogin});
        }
        $('#content').html(this.homeView.el);

        if(!this.headerView){
            console.log('LOGIN Header: main.js USER found: [%s]',user.get('displayName'));
            this.headerView = new HeaderView({model: user});
            $('.header').html(this.headerView.el);
        }
        this.headerView.selectMenuItem('home-menu');
    },

    listRequests: function(page) {
        console.log('listRequests:main.js');
        console.log('list:main.js');
        var p = page ? parseInt(page, 10) : 1,
            requestList = new RequestCollection();

        if (!this.requestListLayoutView) {
            this.requestListLayoutView = new RequestListLayoutView();
        }
        $('#content').html(this.requestListLayoutView.el);
        requestList.fetch({success: function() {
            $("#listcontent").html(new RequestListView({model: requestList, page: p}).el);
        }});
        if(this.headerView) this.headerView.selectMenuItem('home-menu');
    },

    browseRequests: function(page) {
        console.log('browseRequests:main.js');
        
        $('#content').html(new RequestListLayoutView({model: dao.requestsQueryData()}).el);

        var p = page ? parseInt(page, 10) : 1,
            query = dao.requestsQueryData().retrieveData(),
            requestList = new RequestCollection();

        requestList.fetch({
            data: query,
            type: 'post',
            //data: $.param({rubro:'tecnica'}),
            //data: JSON.stringify({rubro:'tecnica'}),
            success: function() {
                console.log('requestlist SUCCESS: [%s]',requestList.length);
                $("#listcontent").html(new RequestListView({model: requestList, page: p}).el);
            }
        });
        if(this.headerView) this.headerView.selectMenuItem('browse-menu');
    },



    viewrequestDetails: function (id) {
        
        var self = this;
        //console.log('viewrequestDetails:main.js [%s]', user._id);

        dao.currentUser.getUser(function(user){
            
            //myheader = new HeaderCreateSol({cantsol: '3', user: user.displayName, es_usuario_de: user.es_usuario_de[0].id});
            //$(".header").html(new HeaderCreateSolView({model: myheader}).el);
            
            console.log('viewrequestDetails:main.js [%s]', user._id);
            $('#content').html(new RequestViewLayout({model: dao.resourcesQueryData()}).el);
            requestview(id,user);
            
            if(user){
              $('#content').html(new RequestViewLayout({model: dao.resourcesQueryData()}).el);
              requestview(id,user);

            }
        });
        
        

    },

    requestDetails: function (id) {
        console.log('requestDetails:main.js');
        var request = new Request({ _id: id});
        //
        request.fetch({success: function() {
            utils.currentrequest = request;
            $("#content").html(new RequestView({model: request}).el);
        }});
        if(this.headerView) this.headerView.selectMenuItem();
    },

            
    addRequest: function() {
        var request = new Request();
        $('#content').html(new RequestView({model: request}).el);
        if(this.headerView) this.headerView.selectMenuItem('add-menu');
    },

    gestion: function () {
        console.log('bye')
        window.open('/gestion/#comprobantes');
        return false;
    },
    
    editSolicitud: function(id){
        console.log('editSolicitud', id);
        mysolicitud = new SolicitudA();
     $("#content").html(new SolicitudViewLayout({model: mysolicitud}).el);
    },

    addUser: function() {
        console.log('addUser:main.js');
        $('#content').html(new UserViewLayout().el);
        var user = new User();
        $('#listcontent').html(new UserView({model: user}).el);
    },

    userDetails: function (id) {
        console.log('userDetails:main.js');

        $('#content').html(new UserViewLayout().el);

        var user = new User({_id: id});
        user.fetch({success: function() {
            $("#listcontent").html(new UserView({model: user}).el);     
        }});
    },


    browseUsers: function (page) {

        console.log('browseUsers:main.js');
        var p = page ? parseInt(page, 10) : 1;
        
        var browsepersons = new UserBrowseView({page:p, el:'#content',parenttag:'content'});

    },


    editProfile: function() {

        dao.currentUser.getUser(function(user){
            var theUser = user ? new User(user) : new User();
            console.log('editProfile:main.js');
            $('#content').html(new ProfileViewLayout().el);

            $('#listcontent').html(new ProfileView({model: theUser}).el);
        });



    },


    // User Module
    addPerson: function() {
        console.log('addPerson:main.js');
        $('#content').html(new PersonViewLayout().el);

        var person = new Person();
 
        $('#listcontent').html(new PersonView({model: person}).el);
    },

    personDetails: function (id) {
        console.log('personDetails:main.js');

        $('#content').html(new PersonViewLayout().el);

        var person = new Person({_id: id});
        person.fetch({success: function() {
            $("#listcontent").html(new PersonView({model: person}).el);
            var niced = new nicEditor().panelInstance('description');

        }});
    },

    browsePersons: function(page) {
        console.log('browsePersons:main.js');
        var p = page ? parseInt(page, 10) : 1;
        var browsepersons = new PersonBrowseView({page:p, el:'#content',parenttag:'content'});
    },

    about: function () {
        console.log('about:main.js');
        if (!this.aboutView) {
            this.aboutView = new AboutView();
        }
        $('#content').html(this.aboutView.el);
        if(this.headerView) this.headerView.selectMenuItem('about-menu');
    },

    quotationDetails: function (id) {
        console.log('quotationDetails:main.js');
        //if (!this.quotationListLayoutView) {
        //    alert('create view 2');
        //    this.quotationListLayoutView = new QuotationListLayoutView({model: dao.quotationsQueryData()});
        //}
        $('#content').html(new QuotationListLayoutView({model: dao.quotationsQueryData()}).el);
        var quotation = new Quotation({_id: id});
        quotation.fetch({success: function() {
            $("#listcontent").html(new QuotationView({model: quotation}).el);
        }});
        if(this.headerView) this.headerView.selectMenuItem();
    },

    browseQuotations: function(page) {
        console.log('browseQuotations:main.js');
        //if (!this.quotationListLayoutView) {
        //    alert('create view 1');
        //    this.quotationListLayoutView = new QuotationListLayoutView({model: dao.quotationsQueryData()});
        //}
        $('#content').html(new QuotationListLayoutView({model: dao.quotationsQueryData()}).el);
        //var queryset = _.clone(this.queryQuotationData.attributes);
        var p = page ? parseInt(page, 10) : 1,
            query = dao.quotationsQueryData().retrieveData(),
            quotationList = new QuotationCollection();

        quotationList.fetch({
            data: query,
            type: 'post',
            //data: $.param({rubro:'tecnica'}),
            //data: JSON.stringify({rubro:'tecnica'}),
            success: function() {
                $("#listcontent").html(new QuotationListView({model: quotationList, page: p}).el);
            }
        });
        if(this.headerView) this.headerView.selectMenuItem('browse-menu');
        //console.log("browse quotation end");
    },

    addQuotation: function() {
        console.log('addQuotation:main.js');
        $('#content').html(new QuotationListLayoutView({model: dao.quotationsQueryData()}).el);

        var quotation = new Quotation({project: dao.quotationsQueryData().getProject() });
 
        $('#listcontent').html(new QuotationView({model: quotation}).el);
        //utils.editor.render('description');
        //var myEditor = new nicEditor({fullPanel : true }).panelInstance('description');
        //myEditor.addEvent('add', function() { alert( myEditor.instanceById('myArea2').getContent() );});});
        if(this.headerView) this.headerView.selectMenuItem();
        //if(this.headerView) this.headerView.selectMenuItem('add-menu');
    },

    addProduct: function() {
        console.log('addProduct:main.js');
        $('#content').html(new ProductViewLayout({model: dao.productsQueryData()}).el);

        var product = new Product({project: dao.productsQueryData().getProject() });
 
        $('#listcontent').html(new ProductView({model: product}).el);
        //utils.editor.render('description');
        //var myEditor = new nicEditor({fullPanel : true }).panelInstance('description');
        //myEditor.addEvent('add', function() { alert( myEditor.instanceById('myArea2').getContent() );});});
        //if(this.headerView) this.headerView.selectMenuItem();
        //if(this.headerView) this.headerView.selectMenuItem('add-menu');
    },

    addArticle: function() {
        console.log('addArticle:main.js');
        $('#content').html(new ArticleViewLayout().el);

        var article = new Article();
 
        $('#listcontent').html(new ArticleView({model: article}).el);
    },

    articleDetails: function(id) {
        console.log('articleDetails:main.js');
        $('#content').html(new ArticleViewLayout().el);

        var article = new Article({_id: id});
        article.fetch({success: function() {
            $('#listcontent').html(new ArticleView({model: article}).el);
        }});
    },

    productDetails: function (id) {
        console.log('productDetails:main.js');

        $('#content').html(new ProductViewLayout({model: dao.productsQueryData()}).el);

        var product = new Product({_id: id});
        product.fetch({
            error: function(error, response, options){
                //console.log('ERROR, ');
                //console.dir(response);
                //console.dir(options);

            },
            success: function() {
            $("#listcontent").html(new ProductView({model: product}).el);

            //product.loadpacapitulos(function(chapters){
            //    console.log('ready to render chapters:main chapters:[%s]',chapters.length);
            //   $("#chapters").html(new ProductChaptersView({model: chapters}).render().el);
            //});
     
        }});
    },

    browseProducts: function(page) {
        console.log('browseProducts:main.js');
        var p = page ? parseInt(page, 10) : 1;
        var browseproducts = new ProductBrowseView({page:p, el:'#content',parenttag:'content'});
        /*

        $('#content').html(new ProductListLayoutView({model: dao.productsQueryData()}).el);

        var p = page ? parseInt(page, 10) : 1,
            query = dao.productsQueryData().retrieveData(),
            productList = new ProductCollection();

        productList.fetch({
            data: query,
            type: 'post',
            success: function() {
                // ProductListView controller: productlist.js
                $("#listcontent").html(new ProductListView({model: productList, page: p}).el);
            }
        });
        //if(this.headerView) this.headerView.selectMenuItem('browse-menu');
        */
    },



    listProjects: function(page) {
        console.log('listProjects:main.js');
        //console.log('list:main.js');
        var p = page ? parseInt(page, 10) : 1,
            projectList = new ProjectCollection();

        if (!this.projectListLayoutView) {
            this.projectListLayoutView = new ProjectListLayoutView();
        }
        $('#content').html(this.projectListLayoutView.el);
        projectList.fetch({success: function() {
            $("#listcontent").html(new ProjectListView({model: projectList, page: p}).el);
        }});
        if(this.headerView) this.headerView.selectMenuItem('home-menu');
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
        if(this.headerView) this.headerView.selectMenuItem('browse-menu');
    },

    viewprojectDetails: function (id) {
        console.log('viewprojectDetails:main.js');
        $('#content').html(new ProjectViewLayout({model: dao.resourcesQueryData()}).el);
        projectview(id);
    },

    projectDetails: function (id) {
        var project = new Project({ _id: id});
        project.fetch({success: function() {
            utils.currentproject = project;
            $("#content").html(new ProjectView({model: project}).el);
        }});
        if(this.headerView) this.headerView.selectMenuItem();
    },

    addProject: function() {
        var project = new Project();
        $('#content').html(new ProjectView({model: project}).el);
        if(this.headerView) this.headerView.selectMenuItem('add-menu');
    },

    listResources: function(page) {
        console.log('list:main.js');
        // parseInt(num,radix)// converts a strint to integer in the selected base
        var p = page ? parseInt(page, 10) : 1,
            resourceList = new ResourceCollection();

        if (!this.projectListLayoutView) {
            this.projectListLayoutView = new ProjectListLayoutView();
        }
        $('#content').html(this.projectListLayoutView.el);

        resourceList.fetch({success: function() {
            $("#listcontent").html(new ResourceListView({model: resourceList, page: p}).el);
        }});
        if(this.headerView) this.headerView.selectMenuItem('browse-menu');
    },

    resourceDetails: function (id) {
        console.log('resourceDetails:main.js');
        //if (!this.resourceListLayoutView) {
        //    alert('create view 2');
        //    this.resourceListLayoutView = new ResourceListLayoutView({model: dao.resourcesQueryData()});
        //}
        $('#content').html(new ResourceListLayoutView({model: dao.resourcesQueryData()}).el);
        var resource = new Resource({_id: id});
        resource.fetch({success: function() {
            $("#listcontent").html(new ResourceView({model: resource}).el);
        }});
        if(this.headerView) this.headerView.selectMenuItem();
    },

    browseResources: function(page) {
        console.log('browseResources:main.js');
        //if (!this.resourceListLayoutView) {
        //    alert('create view 1');
        //    this.resourceListLayoutView = new ResourceListLayoutView({model: dao.resourcesQueryData()});
        //}
        //$('#content').html(new ResourceListLayoutView({model: dao.resourcesQueryData()}).el);
        //var queryset = _.clone(this.queryResourceData.attributes);
        var p = page ? parseInt(page, 10) : 1,
            query = dao.resourcesQueryData().retrieveData(),
            resourceList = new ResourceCollection();

        resourceList.fetch({
            data: query,
            type: 'post',
            //data: $.param({rubro:'tecnica'}),
            //data: JSON.stringify({rubro:'tecnica'}),
            success: function() {
                var rlv = new ResourceListView({model: resourceList, page: p});
                $("#content").html(rlv.el);
            }
        });
        if(this.headerView) this.headerView.selectMenuItem('browse-menu');
        //console.log("browse resource end");
    },

    addResource: function() {
        console.log('addResource:main.js');
        $('#content').html(new ResourceListLayoutView({model: dao.resourcesQueryData()}).el);

        var resource = new Resource({project: dao.resourcesQueryData().getProject() });
 
        $('#listcontent').html(new ResourceView({model: resource}).el);
        //utils.editor.render('description');
        //var myEditor = new nicEditor({fullPanel : true }).panelInstance('description');
        //myEditor.addEvent('add', function() { alert( myEditor.instanceById('myArea2').getContent() );});});
        if(this.headerView) this.headerView.selectMenuItem();
        //if(this.headerView) this.headerView.selectMenuItem('add-menu');
    },

    assetDetails: function(id)
    {  
        console.log('assetDetails:main.js');
        
        if (!this.AssetLayoutView) {
            this.AssetLayoutView = new AssetLayoutView();
        }

        $('#content').html(this.AssetLayoutView.el);

        var asset = new Asset({_id: id});
        asset.fetch( {success: function()
        {
            $("#listcontent").html(new AssetView({model: asset}).el);

        }});

        //if(this.headerView) this.headerView.selectMenuItem('browse-menu');
    },

    browseAssets: function()
    {
        console.log('fileList:main.js');
        // FIXME : El proyecto lo harcodeo, se debe pasar en la funcion
        var query = {related: {project: '5228df86c113982b02000001'}};

        //todo: configurar el query que realiza el callback
        fileList = new AssetCollection();
        //todo: 
        fileList.fetch({
            data: query,
            type: 'post',
     
            success: function () {
                
                var lista= new AssetListView({model:fileList});
                $("#content").html(lista.el);
            }

        });
    },
    //Esta funcion tiene que mostrar los datos de los detalles del archivo

});

var testexcel = function(){
    var heading = ['ID', 'Name', 'Age', 'Birthdate', 'Balance', 'Active?'];
    var stringraro = 'pedro "toto" mendez';
    var data =([
        ['1', stringraro, 31, '2012-01-01T01:35:33Z', 55.34, 1],
        ['2', 'John Dow', 34, '2013-02-03T01:35:33Z', 12.0002, 0],
        ['3', 'John Doh', 33, '2014-03-06T01:35:33Z', 78.901, 1]
    ]);

    //var options = ('D5', ['Total:', '=SUM(E2:E4)'], { font: { bold: true }, alignment: 'right' });
      var options = (['Total:', '=SUM(E2:E4)']);
    var name = "ejemplo1";

    var query = {
        heading:heading,
        data:data,
        options:options,
        name:name
    };

    $.ajax({
            type: "POST",
            url: "/excelbuilder",
            dataType: "json",
            data: query,
            success: function(data){
                console.dir(data);
                window.open(data.file)
            }
    });
};

utils.loadTemplate(['HomeView', 'AboutView', 
    'HeaderViewNotLogged','HeaderViewLogged','HeaderViewVisitor','HeaderViewPub', 'HeaderCreateSolView',
    'ProjectListLayoutView', 'ProjectView','ProjectListItemView', 'ProjectViewLayout', 'PrjHeaderView',
    'RequestListLayoutView', 'RequestView','RequestListItemView', 'RequestViewLayout', 'RequestHeaderView',
    'ResourceView', 'ResourceListItemView', 
    'ResourceListLayoutView', 'ResourceQuoteView',
    'QuotationListLayoutView', 'QuotationView', 'QuotationResourceItemView', 'QuotationListItemView',
    'ReqResDetailView','AssetListItemView',
    'AssetAccordionView','AssetVersionListItemView','AssetView','AssetLayoutView',
    'ProductListLayoutView','ProductView','ProductListItemView','ProductPaTechFacetView',
    'ProductViewLayout','SolListItemView','SolicitudViewLayout','ArticleView', 'ArticleViewLayout','BrandingEditView',
    'ProfileView','ProfileViewLayout', 'ProfilePersonView',
    'PersonView','PersonViewLayout','PersonTableLayoutView',
    'UserTableLayoutView','UserView','UserViewLayout'
    ], function() {
    app = new AppRouter();
    utils.approuter = app;

    Backbone.history.start();
    testexcel();
});
