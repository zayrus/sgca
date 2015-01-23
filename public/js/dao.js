window.dao = {

    whoami:'daoutils',

    docum: {
        actualList:['nrecepcion','npedido', 'nentrega', 'ptecnico', 'pemision', 'pdiario','nsolicitud','inscripcion'],
        ptecnico:['ptecnico'],
        nsolicitud:['nsolicitud'],
        notas:['nrecepcion','npedido', 'nentrega'],
        pemision: ['pemision'],
        pdiario: ['pdiario'], 
				inscripcion: ['inscripcion'],


        isType: function(comp, type){
            return (this[type].indexOf(comp) !== -1 ? true : false);
        },
        initval: function(comp){
            var data = {
                estado_alta: 'media',
                nivel_ejecucion: 'enproceso',
            };
            if(this.ptecnico.indexOf(comp) !== -1){
                data.estado_qc = 'enevaluacion';
                return data;

            }
            if(this.pemision.indexOf(comp) !== -1){
                data.tipoemis = 'tda';
                return data;

            }
            if(this.pdiario.indexOf(comp) !== -1){
                return data;

            }
            if(this.notas.indexOf(comp) !== -1){
                data.tipomov = 'movimiento';
                if(comp==='nentrega')   data.tipomov = 'distribucion';
                if(comp==='nrecepcion') data.tipomov = 'recepcion';
                if(comp==='npedido')    data.tipomov = 'reqadherente';
                return data;
            }
        },

    },
    validatePermissionTo: function(task, module, user, opt){
        // el usuario está adscripto al módulo
        //console.log('validatePermissionTo:[%s] in:[%s] atr:[%s]', task, module, user.get('atributos'));
        var taskreq,
            test;
        var tasks = {
            'chimenea':{
                atributos:['chimenea', 'nodochimenea', 'superchimenea'],
                roles:['supervisor', 'admin']
            },
            'nodochimenea':{
                atributos:['nodochimenea', 'superchimenea'],
                roles:['supervisor', 'admin']
            },
            'superchimenea':{
                atributos:['superchimenea'],
                roles:['supervisor', 'admin']
            },
            'browse:presupuesto':{
                roles:['presugestor'],
            },
            'edit:presupuesto':{
                roles:['presugestor'],
                memberOfArea: function(){
                    return dao.gestionUser.hasPermissionTo('area', module, opt);
                }
            },


            'area':{
                validate: function(){
                    if(!opt && !opt.area) return false;
                    if(user.get('area') === opt.area) return true;
                    if(dao.gestionUser.hasPermissionTo('superchimenea', module)) return true;

                    if(dao.gestionUser.hasPermissionTo('nodochimenea', module)){
                        var areas = [opt.area, user.get('area')];
                        return utils.retrieveNodesFromAreas(areas).length === 1 ? true : false;
                    }
                    return false;
                }
            },
        };
        var hasperm = true;

        if(_.indexOf(user.get('modulos'), module)) return false;
        taskreq = tasks[task];
        if (!taskreq) return false;

        _.each(taskreq, function(aspect, key){
            test = false;
            if(_.isFunction(aspect)){
                test = aspect();
            }else{
                test = _.reduce(aspect, function(test, item){
                            return test || (_.indexOf(user.get(key), item) !== -1)
                        }, test);
            }

            hasperm = hasperm && test;
        });

        return hasperm;
    },

    gestionUser: {
        getUser: function(app, cb){
            if(! this.user){
                this.fetchUser(app, cb);  
            } else {
                //console.log('getUser: currentUser')
                cb(this.user);
            }
        },

        getCurrentUser: function(){
            return this.user;
        },

        hasPermissionTo: function(task, module, opt){
            if(!this.user) return false;

            return dao.validatePermissionTo(task, module, this.user, opt)

        },
        fetchPermitted: function(what, module){
            var list = [],
                full_list;
            if(!this.user) return list;

            if(what === 'AREA'){
                full_list = utils.actionAreasOptionList
            } else {
                full_list = utils.actionNodosOptionList                
            }

            _.each(full_list, function(item){
                if(item.val === 'no_definido'){
                    list.push(item);
                }else{
                    if(dao.gestionUser.hasPermissionTo('area',module,{area: item.val})){
                        list.push(item);
                    }
                }
            });
            //console.log('FETCH Permitted Areas: [%s][%s]',what, list.length);
            return list
        },

        fetchUser: function(app, cb){
            //console.log('fetchUser: currentUser')
            var self = this;
            $.ajax({
                type: 'get',
                url: '/currentUser',
                success: function(data) {
                    self.user = new app.Entities.User(data);
                    //console.log('FETCH USER: [%s]',self.user.id);
                    if(cb) cb( self.user);
                }
            });
        },
        getDocumQuery: function(){
            var query;
            if(this.user){
                query =  this.user.get('documQuery');
                if(query){
                    query.fedesde = new Date(query.fedesde);
                    query.fehasta = new Date(query.fehasta);
                }
            }
            if(!query){
                query = this.getDefaultQueryDocument();
            }
            return query;
        },
        getActionQuery: function(){
            var query;
            if(this.user){
                query =  this.user.get('actionQuery');
                if(query){
                    query.fedesde = new Date(query.fedesde);
                    query.fehasta = new Date(query.fehasta);
                }
            }
            if(!query){
                query = this.getDefaultQueryAction();
            }
            return query;
        },
        getBudgetQuery: function(){
            var query;
            if(this.user){
                query =  this.user.get('budgetQuery');
                if(query){
                    query.fedesde = new Date(query.fedesde);
                    query.fehasta = new Date(query.fehasta);
                }
            }
            if(!query){
                query = this.getDefaultQueryBudget();
            }
            return query;
        },
        getUserGroup: function(){
            var grupo;
            if(this.user){
                grupo =  this.user.get('grupo');
            }
            return grupo || 'produccion';
        },
        getDefaultQueryDocument: function(){
            var to = new Date();
            var fedesde = new Date(to.getFullYear(),to.getMonth(),1,0,0,0,0);
            var fehasta = new Date(to.getFullYear()+1,to.getMonth(),to.getDate(),0,0,0,0);
            var resumen = 'detallado';
            var tipoitem = 'nrecepcion';
            var grupo = this.getUserGroup(); 
            if(grupo === 'tecnica'){
                resumen = 'producto';
                tipoitem = 'nrecepcion';
            }else if(grupo === 'produccion'){
                resumen = 'entidad';
                tipoitem = 'nrecepcion';
            }else if(grupo === 'contenidos'){
                resumen = 'entidad';
                tipoitem = 'nrecepcion';
            }else if(grupo === 'adherentes'){
                resumen = 'producto';
                tipoitem = 'pemision';
            }
            var query = new DocManager.Entities.DocumQueryFacet({
                fedesde: fedesde,
                fehasta: fehasta,
                resumen: resumen,
                tipoitem: tipoitem,
            });
            return query.attributes;
        },
        getDefaultQueryAction: function(){
            var to = new Date();
            var fedesde = new Date(to.getFullYear(),to.getMonth(),1,0,0,0,0);
            var fehasta = new Date(to.getFullYear()+1,to.getMonth(),to.getDate(),0,0,0,0);
            var query = new DocManager.Entities.DocumQueryFacet({
                fedesde: fedesde,
                fehasta: fehasta,
            });
            return query.attributes;
        },
        getDefaultQueryBudget: function(){
            var to = new Date();
            var fedesde = new Date(to.getFullYear(),to.getMonth(),1,0,0,0,0);
            var fehasta = new Date(to.getFullYear()+1,to.getMonth(),to.getDate(),0,0,0,0);
            var query = new DocManager.Entities.DocumQueryFacet({
                fedesde: fedesde,
                fehasta: fehasta,
            });
            return query.attributes;
        },

        getActionListType: function(){
            var grupo = this.getUserGroup();
            console.log('USER: [%s]', grupo);
            var listado = 'documentos';
 
            return listado;
        },
        getBudgetListType: function(){
            var grupo = this.getUserGroup();
            console.log('USER: [%s]', grupo);
            var listado = 'documentos';

            return listado;
        },
        getDocumListType: function(){
            var grupo = this.getUserGroup();
            console.log('USER: [%s]', grupo);
            var listado = 'items';
            if(grupo === 'tecnica'){
                listado = 'items';
            }else if(grupo === 'produccion'){
                listado = 'documentos';
            }else if(grupo === 'contenidos'){
                listado = 'documentos';
            }else if(grupo === 'adherentes'){
                listado = 'documentos';
            }
            return listado;
        },
        update : function(app, key, data){
            var self = this;
            self.getUser(app, function(user){
                if(user){
                    user.update(key, data, function(model){
                        self.user = model;
                    });
                }
            });
        }
    },

    currentUser: {
        getUser: function(cb){
            if(! this.user){
                this.fetchUser(cb);  
            } else {
                console.log('getUser: currentUser')
                cb(this.user);
            }
        },
 
        setUser: function(us){
            self.user = us;
        },
        
        fetchUser: function(cb){
            console.log('fetchUser: currentUser');
            var self = this;
            $.ajax({
                type: 'get',
                url: '/currentUser',
                success: function(data) {
                    //console.log('callback SUCCESS');
                    self.user = data;
                    if(cb) cb( self.user);
                }
            });
        },
        personsList: function(persons){
            if(persons){
                this.persons = persons;
            }else{
                return persons;
            }
        }
    },

    userHome:function(role){

    },

    uploadFile: function(uploadingfile, progressbar, cb){
        var formData = new FormData();
        var folder = 'files';
        //console.log(' uploadFiles BEGINS folder:[%s]', folder);
        
        if(!uploadingfile) return false;

        formData.append('loadfiles', uploadingfile);
        formData.append('folder',folder);

        var xhr = new XMLHttpRequest();

        xhr.open('POST', '/files');

        xhr.onload = function() {
            var srvresponse = JSON.parse(xhr.responseText);
            var asset = new Asset();
            asset.saveAssetData(srvresponse, function(asset){
                //console.log('asset CREATED!: [%s]',srvresponse.name);
                cb(srvresponse, asset);
            });
        };

        xhr.upload.onprogress = function(event) {
            if (event.lengthComputable) {
                var complete = (event.loaded / event.total * 100 | 0);
                $(progressbar).css({'width':complete+'%'});
            }
        };

        xhr.send(formData);    
    },

    quotationsQueryData:function (){
        if (!this.queryQuotationData) {
            this.queryQuotationData = new BrowseQuotationsQuery();
        }
        return this.queryQuotationData;
    },

    personsQueryData:function (){
        if (!this.queryPersonData) {
            this.queryPersonData = new BrowsePersonsQuery();
        }
        return this.queryPersonData;
    },

    productsQueryData:function (){
        if (!this.queryProductData) {
            this.queryProductData = new BrowseProductsQuery();
        }
        return this.queryProductData;
    },

    solQueryData:function (){
        if (!this.querySolData) {
            this.querySolData = new BrowseSolQuery();
        }
        return this.querySolData;
    },
    
    productsCol:{
        
        get: function (){
            if (!this.productsCollectionRef) {
                this.productsCollectionRef = new ProductCollection();
            }
            return this.productsCollectionRef;
        },
        set: function(col){
            this.productsCollectionRef = col;
        }
    },

    documentsCol:{
        get: function (){
            if (!this.docsCol) {
                this.docsCol = new ComprobanteCollection();
            }
            return this.docsCol;
        },
        set: function(col){
            this.docsCol = col;
        }
    },

    extractData: function(model){
        var qobj = {};
        _.each(model,function(value,key){
            //console.log('1key:[%s] value:[%s]',key,value);
            if(! (value==null || value==="" || value === "0")){
                qobj[key]=value;
                //console.log('2key:[%s] value:[%s]',key,value);
            }
        });
        return qobj;
    },   

    addinstancefacet: {
        init: function(product){
            //console.log('add instancce facet init');
 
            var builder = {};
            builder.slug = product.get('slug');
            builder.denom = product.get('denom');
            this.data = new AddInstanceFacet(builder);
            this.asset = null;
            this.form = null;
            //console.log('add instancce facet init OK');
            return this.data;
        },
        reset: function(){
            this.asset = null;
        },
        setContent: function  (data) {
            this.data.set(data);
        },
        getContent: function(){
            //console.log('addinstancefacet: [%s]',this.data.get('slug'));
            return this.data.retrieveData();
        },
        setAsset: function(asset) {
            this.asset = asset;
        },
        getAsset: function() {
            return this.asset;
        },
        setForm:function(form){
            this.form = form;
        },
        getForm: function(){
            return this.form;
        }
    },

   brandingfacet: {
        init: function(product){
            //console.log('branding facet init');
            this.data = new BrandingFacet();
            this.asset = null;
            this.form = null;
             return this.data;
        },
        setContent: function  (data) {
            this.data.set(data);
        },
        getContent: function(){
            if(this.form) this.form.commit(); 
            return this.data.retrieveData();
        },
        setAsset: function(asset) {
            this.asset = asset;
        },
        getAsset: function() {
            return this.asset;
        },
        setForm:function(form){
            this.form = form;
        },
        getForm: function(){
            return this.form;
        }
    },

    pacapitulosfacet: {
        init: function(product){
            var builder = {};
            builder.durnominal = product.get('patechfacet') && product.get('patechfacet').durnominal;
            builder.tipoproducto = product.get('tipoproducto');
            builder.cantcapitulos = 0;
            this.data = new PaCapitulosFacet(builder);
            return this.data;
        },
        getContent: function(){
            return this.data.retrieveData();
        }
    },

    patechfacet: {
        init: function(product){
            this.data = new PaTechFacet(product.get('patechfacet'));
            return this.data;
        },
        getContent: function(){
            return this.data.retrieveData();
        }
    },

    userfacet: {
        init: function(user){
            this.data = new User(user);
            this.addToCol();
            return this.data;
        },
        addToCol: function(){
            this.col.add(this.data);
        },
        setFacet: function(facet){
            this.data = facet;
            return this.data;
        },
        getFacet: function(){
            return this.data;
        },       
        setCol: function(colection){
            this.col = colection;
            return this.col;
        },
        getCol: function(){
            return this.col;
        },       
        getContent: function(){
            return this.data.retrieveData();
        }
    },

    intechfacet: {
        init: function(product){
            //console.log('intechfacet: [%s]',product.get('slug'));
            this.data = new PaInstanceFacet(product.get('painstancefacet'));
            return this.data;
        },
        getContent: function(){
            return this.data.retrieveData();
        }
    },

    contactfacet: {
        init: function(contact){
            this.data = new ContactFacet(contact);
            this.addToCol();
            return this.data;
        },
        addToCol: function(){
            this.col.add(this.data);
        },
        setFacet: function(facet){
            this.data = facet;
            return this.data;
        },
        getFacet: function(){
            return this.data;
        },       
        setCol: function(colection){
            this.col = colection;
            return this.col;
        },
        getCol: function(){
            return this.col;
        },       
        getContent: function(){
            return this.data.retrieveData();
        }
    },

    parealizfacet: {
        init: function(product){
            //console.log('parealizfacet: [%s]',product.get('slug'));
            this.data = new PaRealizationFacet(product.get('realization'));
            return this.data;
        },
        getContent: function(){
            return this.data.retrieveData();
        }
    },

    curaduriafacet: {
        init: function(product){
            //console.log('curaduriafacet: [%s]',product.get('slug'));
            this.data = new CuraduriaFacet(product.get('curaduria'));
            return this.data;
        },
        getContent: function(){
            return this.data.retrieveData();
        }
    },

    notasfacet: {
        init: function(ancestor){
            //console.log('notasfacet: [%s]',ancestor.get('slug'));
            this.data = new Article();
            return this.data;
        },
        getContent: function(){
            return this.data;
        }
    },

    comprobantefacet: {
        init: function(ancestor){
            //console.log('notasfacet: [%s]',ancestor.get('slug'));
            this.data = new Comprobante();
            return this.data;
        },
        getContent: function(){
            return this.data;
        }
    },

    managetable: {
        init: function(product){
            this.data = new ManageTable({
                columnById:this.getActualColumns()
            });
            //console.log('managetable: begins');
            return this.data;
        },
        setActualColumns: function () {
            var display = [];
            this.resetColumns();

            _.each(this.get('columnById'),function(element){
                utils.productListTableHeader[element].flag = 1;
            });
        },
        resetColumns: function  () {
            _.each(utils.productListTableHeader,function(element){
                if(element.id<2) element.flag = 1;
                else element.flag = 0;
            });
        },
        getActualColumns: function () {
            var display = [];
            _.each(utils.productListTableHeader,function(element){
                if(element.flag) display.push(element.id);
            });
            //console.log('getActualColumns:[%s]',display[0]);
            return display;
        },
        getContent: function(){
            return this.data.retrieveData();
        },
        get: function(item){
            return this.data.get(item);
        }
    },

    paclasificationfacet: {
        init: function(product){
            this.data = new PaClasificationFacet(product.get('clasification'));
            this.buildTagList();
            return this.data;
        },
        getContent: function(){
            return this.data.retrieveData();
        },
        getContentTags:function(){
            return this.etqs;
        },
        getDescripTags:function(){
            var tags = [],
                separator = ';',
                descr = this.data.get('descriptores');
            if(descr.indexOf('|') !== -1) separator = '|';
            tags = dao.buildTagList(descr, separator);
            return tags;
        },

        buildTagList: function(){
            this.etqs = dao.buildTagList(this.data.get('cetiquetas'), '|');
            this.buildContentLabel()
        },

        buildContentLabel: function(){
            var self = this;
            var labels = self.etqs.join(' | ');
            self.data.set({cetiquetas: labels});
        },

        addEtiquetas: function(){
            var self = this;
            var test=false;
            if(self.data.get('contenido').genero){
                if(self.data.get('contenido').genero !== 'nodefinido'){
                    test=_.find(self.etqs,function(el) {return el===self.data.get('contenido').genero;});
                    if(!test) self.etqs.push(self.data.get('contenido').genero);
               }
            }
            if(self.data.get('contenido').tematica){
                if(self.data.get('contenido').tematica !== 'nodefinido'){
                    test=_.find(self.etqs,function(el) {return el===self.data.get('contenido').tematica;});
                    if(!test) self.etqs.push(self.data.get('contenido').tematica);
                }
            }
            if(self.data.get('contenido').subtematica){
                if(self.data.get('contenido').subtematica !== 'nodefinido'){
                    test=_.find(self.etqs,function(el) {return el===self.data.get('contenido').subtematica;});
                    if(!test) self.etqs.push(self.data.get('contenido').subtematica);
                }
            }
            self.buildContentLabel();
        },
    },

    buildTagList: function(stringData, separator){
        var list = [];
        if(stringData){
            list = _.filter(_.map(stringData.split(separator),function(str){return $.trim(str)}),function(str){return str});
        }
        return list;
    },

    productViewFactory: function(spec) {

        //console.log('model factory called');

        var loadChilds = function(cb){
            spec.product.loadpacapitulos(cb);
        };
        var loadRelated = function(cb){
            spec.product.loadrelated(cb);
        };
        var loadPersonsFromUser = function(cb){
            spec.product.loadPersons(cb);
        };
        var loadProfile = function(cb){
            spec.product.fetchProfileData(cb);
        };
        var loadContacts = function(cb){
            spec.product.loadcontacts(cb);
        };
        var loadNotas = function(cb){
            spec.product.loadnotas(cb);
        };
        var loadDocuments = function(cb){
            spec.product.loaddocuments(cb);
        };
        var loadUsers = function(cb){
            spec.product.loadusers(cb);
        };
        var loadBranding = function(cb){
            dao.loadbranding(spec.product, cb);
        };
        var loadInstances = function(cb){
            spec.product.loadpacapitulos(cb);
        };
        var loadAssets = function(cb){
            spec.product.loadassets(cb);
        };
        var loadAncestors = function(cb){
            spec.ancestors = spec.product.loadpaancestors(cb);
        };
        var loadPersonAncestors = function(cb){
            spec.ancestors = spec.product.loadancestors(cb);
        };
        var profileRender = function(branding){
            //console.log('PROFILE renderview:callback: [%s] length:[%s]',spec.perfilselector, branding.length);
            if(branding) spec.perfil = branding.at(0);
            //console.log('PROFILERENDER: [%s]',spec.perfil.get('slug'));
            spec.perfilview = new ProfileImageView({model:spec.perfil});
            $(spec.perfilselector).html(spec.perfilview.render().el);
        };
        var assetsRender = function(assets){
            //console.log('ASSETS renderview:callback: [%s] length:[%s]',spec.asselector, assets.length);
            if(assets) spec.assets = assets.models;
            $(spec.asselector, spec.context).html("");
            _.each(spec.assets,function(asset){
                spec.asview = new AssetAccordionView({model:asset});
                $(spec.asselector, spec.context).append(spec.asview.render().el);
            });
        };
        var brandingRender = function(items){
            //console.log('BRANDING renderview:callback: [%S]',spec.brandingselector);
            if(items) spec.brands = items;

            $(spec.brandingselector, spec.context).html("");
            spec.brands.each(function(branding){
                //console.log('BRANDING EACH renderview:callback: [%s]',branding.get('slug'));
                spec.brandingview = new BrandingEditView({model:branding, viewController: viewController});
                $(spec.brandingselector, spec.context).append(spec.brandingview.render().el);
            });
        };
        var contactsRender = function(items){
            //console.log('CONTACTS renderview:callback: [%s]',spec.contactsselector);
            if(items) spec.contacts = items;
            spec.contactsview = new ContactsView({model:spec.contacts});
            $(spec.contactsselector, spec.context).html(spec.contactsview.render().el);
        };
        var usersRender = function(items){
            //console.log('USERS renderview:callback: [%s]',spec.usersselector);
            if(items) spec.users = items;
            spec.usersview = new UsersView({model:spec.users});
            $(spec.usersselector, spec.context).html(spec.usersview.render().el);
        };
        var documentsRender = function(items){
            //console.log('DOCUM renderview:callback: [%s]',spec.documentsselector);
            if(items) spec.documents = items;
            console.log('antes de crear Documents view');
            spec.documview = new DocumentsView({collection:spec.documents});
            console.log('doppo de crear Documents view');
            $(spec.documentsselector, spec.context).html(spec.documview.render().el);
        };
        var notasRender = function(items){
            //console.log('NOTAS renderview:callback: [%s]',spec.notasselector);
            if(items) spec.notas = items;
            spec.notasview = new NotasView({model:spec.notas});
            $(spec.notasselector, spec.context).html(spec.notasview.render().el);
        };
        var ancestorRender = function(ancestors){
            if(ancestors) spec.ancestors = ancestors;
            //console.log('ancestorRender:begins [%s] length:[%s]', spec.anselector, spec.ancestors.length)
            spec.anview = new AncestorView({model:spec.ancestors});
            $(spec.anselector,spec.context).html(spec.anview.render().el);
        };
        var personancestorRender = function(ancestors){
            if(ancestors) spec.ancestors = ancestors;
            //console.log('ancestorRender:begins [%s] length:[%s]', spec.anselector, spec.ancestors.length)
            spec.anview = new PersonAncestorView({model:spec.ancestors});
            $(spec.anselector,spec.context).html(spec.anview.render().el);
        };
        var personsfromuserRender = function(persons){
            if(persons) spec.persons = persons;
            console.log('personsfromuserRender:begins [%s] length:[%s]', spec.personsselector, spec.persons.length)
            spec.anview = new PersonsFromUserView({model:spec.persons});
            $(spec.personsselector,spec.context).html(spec.anview.render().el);
        };
        var relatedRender = function(related){
            //console.log('renderview:callback: [%S]',spec.chselector);
            if(related) spec.related = related;
            //if(!spec.chview) spec.chview = new ProductChaptersView({model:spec.related});
            spec.relview = new ModelRelatedView({model:spec.related});
            $(spec.relselector, spec.context).html(spec.relview.render().el);
        };
        var childsRender = function(chapters){
            //console.log('renderview:callback: [%S]',spec.chselector);
            if(chapters) spec.chapters = chapters;
            //if(!spec.chview) spec.chview = new ProductChaptersView({model:spec.chapters});
            spec.chview = new ProductChaptersView({model:spec.chapters});
            $(spec.chselector, spec.context).html(spec.chview.render().el);
        };
        var instancesRender = function(instances){
            //console.log('instancerenderview:callback: [%S]',spec.inselector);
            if(instances) spec.instances = instances;
            //if(!spec.chview) spec.chview = new ProductChaptersView({model:spec.chapters});
            spec.chview = new ProductChaptersView({model:spec.instances});
            $(spec.inselector, spec.context).html(spec.chview.render().el);
        };

        var buildBrandingList= function (branding) {
            //var branding = model.relatedController.getBrands();
            var brands = [];

            if(!(branding && branding.length>0)) return;

            branding.each(function(brand){
            //console.log('brands iterate:[%s]',brand.get('slug'));
                brands.push(brand.attributes);
            });
            //console.log('brands length:[%s]',brands.length);
            spec.product.set({branding:brands});
        };


        var viewController = {
            fetchInstances: function(cb){
                loadInstances(cb);
            },
            fetchChapters: function(cb){
                loadChilds(cb);
            },
            fetchRelated: function(cb){
                loadRelated(cb);
            },
            fetchPersonsRelated: function() {
                loadPersonsFromUser(cb);
            },
            fetchAncestors: function(cb){
                loadAncestors(cb);
            },
            fetchAssets: function(cb){
                loadAssets(cb);
            },
            fetchNotas: function(cb){
                loadNotas(cb);
            },
            contactsrender: function() {
                loadContacts(contactsRender);
            },
            usersrender: function() {
                loadUsers(usersRender);
            },
            notasrender: function() {
                loadNotas(notasRender);
            },
            brandingrender: function() {
                loadBranding(brandingRender);
            },
            asrender: function() {
                loadAssets(assetsRender);
            },
            chrender: function() {
                loadChilds(childsRender);
            },
            documrender: function() {
                loadDocuments(documentsRender);
            },
            relrender: function() {
                loadRelated(relatedRender);
            },
            inrender: function() {
                loadInstances(instancesRender);
            },
            anrender: function() {
                loadAncestors(ancestorRender);
            },
            personanrender: function() {
                loadPersonAncestors(personancestorRender);
            },
            personsformuserrender: function() {
                loadPersonsFromUser(personsfromuserRender);
            },
            profilerender: function() {
                loadProfile(profileRender);
            },
            getBrands: function () {
                return spec.brands;
            },
            getProduct: function () {
                return spec.product;
            },
            buildBrandingList: function(){
                buildBrandingList(spec.brands);
            },
            setModel: function(pr,cb){
                spec.product = pr;
                loadChilds(cb);
            },
            refresh:function(){
                if(!spec.chapters) {
                    loadchapters(childsRender);
                }else{
                    childsRender();
                }
            },
        }
        return viewController;
    },

    loadbranding:function (model, cb) {
   
        //console.log('mdel:loadbranding');

        var brands = this.fetchBrandingEntries(model, {});
        cb(brands);
    },

    fetchBrandingEntries: function (model, query){
        //console.log('filtered: begins [%s] [%s]', model.get('slug'),model.get('branding').length);

        var filtered = _.filter(model.get('branding'),function(elem){

            //console.log('filtered: [%s]', elem.assetName);

            var filter = _.reduce(query, function(memo, value, key){
                //console.log('value: [%s]  key:[%s] elem.key:[%s]',value,key,elem[key]);
                if(value != elem[key]) return memo && false;
                return memo  && true;
            },true);
            return filter;

        });

        var brandingCollection = new Backbone.Collection(filtered,{
            model: BrandingFacet

        });
        //console.log('Collection:  [%s]', brandingCollection.at(0).get('tc'));
        return brandingCollection;
    },

    resourcesQueryData:function (){
        if (!this.queryResourceData) {
            this.queryResourceData = new BrowseResourcesQuery();
        }
        return this.queryResourceData;
    },

    projectsQueryData:function (){
        if (!this.queryProjectData) {
            this.queryProjectData = new BrowseProjectsQuery();
        }
        return this.queryProjectData;
    },

    requestsQueryData:function (){
        if (!this.queryRequestData) {
            this.queryRequestData = new BrowseRequestsQuery();
        }
        return this.queryRequestData;
    },

    invertedAttributeList: function  (ancestor, products) {
        var self = this,
            data = {name: ancestor.get('productcode'), children:[]},
            entries = ['tipoproducto','nivel_importancia','nivel_ejecucion','patechfacet','clasification','realization'],
            whoami;

        //console.log('Inverted attribute BEGIN PRODUCTS :[%s]', products.length);

        products.each(function(product){
            //console.log('PRODUCTS each iteration :[%s]', product.get('slug'));
            whoami = {name:product.get('productcode'), size: 1};
            self.parseProduct(entries, data, product,  whoami);
            //console.log(JSON.stringify(data));
        });
        return data;
    },

    parseProduct: function (list, node, model, whoami){
        var self = this,
            entry_node, 
            local_node;
        //console.log('parseProduct: list:[%s] node:[%s] whoami:[%s]', list[0], node.name, whoami.name);

        _.each(list, function(entry, index){
            entry_node = self.fetchEntryNode(node, entry);

            if(_.isString(model.get(entry))){
                local_node = self.fetchEntryNode(entry_node, model.get(entry));
                local_node.children.push(whoami);

            }else if ( _.isArray(model.get(entry)) ){
                var list = model.get(entry);
                _.each(list, function(elem){
                    local_node = self.fetchEntryNode(entry_node, elem);
                    local_node.children.push(whoami);
                });

            }else if (_.isObject(model.get(entry))){
                var entries = _.keys(model.get(entry));
                self.parseProduct(entries, entry_node, new Backbone.Model(model.get(entry)),  whoami);
            }
        });
    },

    fetchEntryNode: function (node, entry){
        var enode = _.filter(node.children,function(elem){
            if(elem.name === entry) return true; else return false;
        });
        if(enode && enode.length>0){
            return enode[0];
        }else {
            var newentry = {name:entry, children:[]};
            node.children.push(newentry);
            return newentry;
        }
    },


};

