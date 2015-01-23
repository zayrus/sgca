window.utils = {

    whoami:'utils!',

    // Asynchronously load templates located in separate .html files
    loadTemplate: function(views, callback) {
        // $.get loads data from the server
        //    returns an jqXHR object
        // $.when is executed when deferreds ends loading data
        //jQuery.get( url [, data ] [, success(data, textStatus, jqXHR) ] [, dataType ] );
        //
        //_.template compiles a template using underscore
        //
        var self = this;
        var deferreds = [];
        self.templates = {};
        $.each(views, function(index, view) {
            if (window[view]) {
                //$.get restorna un 'deferred'
                deferreds.push($.get('tpl/' + view + '.html', function(data) {
                    window[view].prototype.template = _.template(data);
                }));
            } else {
                //console.log('WARINING: Marionette template. tpl/' + view + '.html' + " not FOUND!!");
                deferreds.push($.get('tpl/' + view + '.html', function(data) {
                    self.templates[view] = _.template(data);
                }));

            }
        });
        //$.when: Provides a way to execute callback functions based on one or more objects, 
        //usually Deferred objects that represent asynchronous events.
        // esta forma de invocacion de apply es par acuando se trata de un array de 'defereds'.
        // el metodo apply espera en su segundo parametro un array.
        $.when.apply(null, deferreds).done(callback);
    },

    displayValidationErrors: function (messages) {
        for (var key in messages) {
            if (messages.hasOwnProperty(key)) {
                this.addValidationError(key, messages[key]);
            }
        }
        this.showAlert('Warning!', 'Fix validation errors and try again', 'alert-warning');
    },

    addValidationError: function (field, message) {
        console.log('f[%s] [%s]','#' + field,message)
        var controlGroup = $('#' + field).parent();
        controlGroup.addClass('has-error');
        $('.help-block', controlGroup).html(message);
    },

    removeValidationError: function (field) {
        var controlGroup = $('#' + field).parent();
        controlGroup.removeClass('has-error');
        $('.help-block', controlGroup).html('');
    },

    showAlert: function(title, text, klass) {
        $('.alert').removeClass("alert-error alert-warning alert-success alert-info");
        $('.alert').addClass(klass);
        $('.alert').html('<strong>' + title + '</strong> ' + text);
        $('.alert').show();
    },

    hideAlert: function() {
        $('.alert').hide();
    },

    displayDate: function (d) {
        var di = ('000'+d.getDate());
        var me = ('000'+(d.getMonth()+1));
        di = di.substr(di.length-2,2);
        me = me.substr(me.length-2,2);
        return di+'/'+me+'/'+d.getFullYear();
    },

    fetchFilteredEntries: function (model, entry,query){
        console.log('fetchfilteredEntries/utils: begins [%s]', model.get(entry).length);
        var filtered = [];

        filtered = _.filter(model.get(entry),function(elem){
           var filter = _.reduce(query, function(memo, value, key){
                console.log('value: [%s]  key:[%s] elem.key:[%s]',value,key,elem[key]);
                if(value != elem[key]) return memo && false;
                return memo  && true;
            },true);
            return filter;
        });
        return filtered;
    },

    maprender: {
        init: function(selector, lon, lat){
            this.map = new OpenLayers.Map((selector||'showmap'));
            // Capa base que muestra el mapa de openstreetmap
            this.map.addLayer(new OpenLayers.Layer.OSM());
            // Capa markers
            this.map.setCenter(new OpenLayers.LonLat((lon||-58.39688441711421),(lat||-34.60834737727606))
              .transform(
                new OpenLayers.Projection("EPSG:4326"), // de WGS 1984
                new OpenLayers.Projection("EPSG:900913") // a Proyección Esférica Mercator
              ), 13 // Nivel de zum
            );

            this.markers = new OpenLayers.Layer.Markers( "Markers" );
            this.map.addLayer(this.markers);            
            //this.template = _.template("<div class='popup-content' style='font-size:.8em;width:150px;height:150px;'><h4><%= name %></h4> <%= direccion %></div>");
            this.template = _.template("<h4><%= name %></h4><%= direccion %>");
            this.size = new OpenLayers.Size(21,25);
            this.offset = new OpenLayers.Pixel(-(this.size.w/2), -this.size.h);

            //self.map.setCenter(lonlat, 16 );
        },
        
        addPlace: function (address) {
            var self = this;
            if(!self.map) self.initMap();
 
            console.log('maprender: [%s] [%s] [%s]',address.nombre,address.latitud,address.longitud);
            self.lonlat = new OpenLayers.LonLat(address.longitud,address.latitud).transform(
                    new OpenLayers.Projection("EPSG:4326"),
                    new OpenLayers.Projection("EPSG:900913"));

            self.map.setCenter(self.lonlat, 15 );

            self.icon = new OpenLayers.Icon('lib/img/marker.png', self.size, self.offset);
            self.markers.addMarker(new OpenLayers.Marker(self.lonlat, self.icon));
        },

        addPopupPlace: function (address) {
            var self = this;
            this.addPlace(address);

            var htmltext = self.template({name:address.nombre, direccion:address.displayAddress})
            var popup = new  OpenLayers.Popup.FramedCloud(
                    address.nombre,
                    self.lonlat,
                    new OpenLayers.Size(121,125), 
                    htmltext,
                    self.icon,
                    true
            );
            popup.minSize = new OpenLayers.Size(10,100);
            self.map.addPopup(popup);
        },

        getMap: function(){
            return this.map;
        }
    },
    retrieveNodesFromAreas: function(areas){
        var nodes = [],
            node;
        _.each(areas, function(area){
            var node = utils.fetchNode(utils.actionAreasOptionList, area);
            if(_.indexOf(nodes, node) === -1) nodes.push(node);
        });
        return nodes;
    },
    //========= BUDGET TEMPLATE =========================
    tipoBudgetMovimList: [
        {val:'no_definido',      cgasto:'000.000',  template:'',  label:'Tipo de movimiento'},
        {val:'global',           cgasto:'100.000',  template:'tecnica',   label:'Global'},
        {val:'artistica',        cgasto:'101.000',  template:'artistica', label:'Artística'},
        {val:'tecnica',          cgasto:'105.000',  template:'tecnica',   label:'Técnica'},
        {val:'contratos',        cgasto:'111.000',  template:'tecnica',   label:'Contratos'},
        {val:'logistica',        cgasto:'115.000',  template:'tecnica',   label:'Logística'},
        {val:'difusion',         cgasto:'121.000',  template:'tecnica',   label:'Difusión'},
        {val:'impresiones',      cgasto:'125.000',  template:'tecnica',   label:'Impresiones'},
        {val:'muestras',         cgasto:'131.000',  template:'tecnica',   label:'Muestras'},
        {val:'derechos',         cgasto:'135.000',  template:'tecnica',   label:'Derechos'},
        {val:'subsidios',        cgasto:'141.000',  template:'tecnica',   label:'Subsidios'},


        {val:'evento',           cgasto:'141.000',  template:'tecnica',  label:'Eventos'},
        {val:'tecnologia',       cgasto:'141.000',  template:'tecnica',  label:'Tecnología'},
        {val:'biendeuso',        cgasto:'141.000',  template:'tecnica',  label:'Bienes de Uso'},
        {val:'bconsumible',      cgasto:'141.000',  template:'tecnica',  label:'Bienes Consumibles'},
        {val:'compras',          cgasto:'141.000',  template:'tecnica',  label:'Otras compras'},
        {val:'publicaciones',    cgasto:'141.000',  template:'tecnica',  label:'Publicaciones'},
        {val:'capacitacion',     cgasto:'141.000',  template:'tecnica',  label:'Capacitación'},
        {val:'alquileres',       cgasto:'141.000',  template:'tecnica',  label:'Alquileres'},
        {val:'servicios',        cgasto:'141.000',  template:'tecnica',  label:'Otros servicios'},
        {val:'pasajes',          cgasto:'141.000',  template:'tecnica',  label:'Pasajes'},
        {val:'viaticos',         cgasto:'141.000',  template:'tecnica',  label:'Viáticos'},
        {val:'estadias',         cgasto:'141.000',  template:'tecnica',  label:'Estadías'},
        {val:'catering',         cgasto:'141.000',  template:'tecnica',  label:'Catering'},
        {val:'traslados',        cgasto:'141.000',  template:'tecnica',  label:'Traslados'},
        {val:'conectividad',     cgasto:'141.000',  template:'tecnica',  label:'Conectividad'},
        {val:'servbasicos',      cgasto:'141.000',  template:'tecnica',  label:'Servicios Básicos'},
        {val:'infraestructura',  cgasto:'141.000',  template:'tecnica',  label:'Infraestructura'},
    ],

    budgetTemplateList:['global', 'artistica', 'tecnica','contratos', 'muestras', 'derechos','logistica','impresiones','difusion', 'subsidios'],
    // ART

    budgetTemplate:{
        global:[
            {val:'no_definido', label:'Subtipo de Gasto',  ume:'',  cgasto:'100.000',  template:'1', classattr:'info'},
        ],
        artistica:[
            {val:'no_definido', label:'Subtipo de Artistica',    ume:'',         cgasto:'101.000',  template:'1', classattr:'info'},
            {val:'artista-a',   label:'Artista A',               ume:'artista',  cgasto:'101.101',  template:'1', classattr:'info'},
            {val:'artista-b',   label:'Artista B',               ume:'artista',  cgasto:'101.103',  template:'1', classattr:'info'},
            {val:'artista-c',   label:'Artista C',               ume:'artista',  cgasto:'101.105',  template:'1', classattr:'info'},
            {val:'artista-d',   label:'Artista D',               ume:'artista',  cgasto:'101.107',  template:'1', classattr:'info'},
            {val:'artista-e',   label:'Artista E',               ume:'artista',  cgasto:'101.109',  template:'1', classattr:'info'},
            {val:'artista-f',   label:'Artista F',               ume:'artista',  cgasto:'101.111',  template:'1', classattr:'info'},
        ],
        tecnica:[
            {val:'no_definido', label:'Subtipo de Técnica',      ume:'',             cgasto:'105.000',  template:'1', classattr:'info'},
            {val:'tecnica-a',   label:'Asistencia Técnica A',    ume:'asistencia',   cgasto:'105.101',  template:'1', classattr:'info'},
            {val:'tecnica-b',   label:'Asistencia Técnica B',    ume:'asistencia',   cgasto:'105.103',  template:'1', classattr:'info'},
            {val:'tecnica-c',   label:'Asistencia Técnica C',    ume:'asistencia',   cgasto:'105.105',  template:'1', classattr:'info'},
            {val:'tecnica-d',   label:'Asistencia Técnica D',    ume:'asistencia',   cgasto:'105.107',  template:'1', classattr:'info'},
            {val:'tecnica-e',   label:'Asistencia Técnica E',    ume:'asistencia',   cgasto:'105.109',  template:'1', classattr:'info'},
            {val:'tecnica-f',   label:'Asistencia Técnica F',    ume:'asistencia',   cgasto:'105.111',  template:'1', classattr:'info'},
            {val:'escenario',   label:'Escenario y vallados',    ume:'escenario',    cgasto:'105.113',  template:'1', classattr:'info'},
            {val:'lucese',      label:'Luces escenario',         ume:'lucese',       cgasto:'105.115',  template:'1', classattr:'info'},
            {val:'videoe',      label:'Video escenario',         ume:'pantallae',    cgasto:'105.117',  template:'1', classattr:'info'},
            {val:'sonidoe',     label:'Sonido escenario',        ume:'sonidoe',      cgasto:'105.119',  template:'1', classattr:'info'},
            {val:'energiae',    label:'Energía escenario',       ume:'energiae',     cgasto:'105.121',  template:'1', classattr:'info'},
            {val:'backline',    label:'Back line',               ume:'backline',     cgasto:'105.123',  template:'1', classattr:'info'},
        ],
        contratos:[
            {val:'no_definido', label:'Subtipo de Contratos',   ume:'',         cgasto:'111.000',  template:'1', classattr:'info'},
            {val:'locobra',     label:'Locaciones de Obra',     ume:'contrato', cgasto:'111.101',  template:'1', classattr:'info'},
            {val:'otros',       label:'Otros',                  ume:'otros',    cgasto:'111.103',  template:'1', classattr:'info'},
        ],
        logistica:[
            {val:'no_definido',   label:'Subtipo de Logística',          ume:'',            cgasto:'115.000',  template:'1', classattr:'info'},
            {val:'pasajes',       label:'Pasajes',                       ume:'pasaje',      cgasto:'115.101',  template:'1', classattr:'info'},
            {val:'transpcarga',   label:'Transp de Carga',               ume:'trnscarga',   cgasto:'115.103',  template:'1', classattr:'info'},
            {val:'transpersonas', label:'Transp de Pasajeros',           ume:'trnspjero',   cgasto:'115.105',  template:'1', classattr:'info'},
            {val:'alojamientos',  label:'Alojamientos',                  ume:'alojamiento', cgasto:'115.107',  template:'1', classattr:'info'},
            {val:'comidas',       label:'Comidas/ Catering',             ume:'catering',    cgasto:'115.109',  template:'1', classattr:'info'},
            {val:'seguridad',     label:'Seguridad',                     ume:'seguridad',   cgasto:'115.111',  template:'1', classattr:'info'},
            {val:'limpieza',      label:'Limpieza',                      ume:'limpieza',    cgasto:'115.113',  template:'1', classattr:'info'},
            {val:'comunicacion',  label:'Alq equipos comunicación',      ume:'eqcomunic',   cgasto:'115.115',  template:'1', classattr:'info'},
            {val:'baniosquim',    label:'Alq baños químicos',            ume:'banioquim',   cgasto:'115.117',  template:'1', classattr:'info'},
            {val:'carpas',        label:'Alq de carpas',                 ume:'carpa',       cgasto:'115.119',  template:'1', classattr:'info'},
            {val:'seguros',       label:'Seguros acc pers y resp civil', ume:'seguro',      cgasto:'115.121',  template:'1', classattr:'info'},
            {val:'otros',         label:'Otros',                         ume:'otros',       cgasto:'115.123',  template:'1', classattr:'info'},
        ],
        difusion:[
            {val:'no_definido', label:'Subtipo de Difusión',  ume:'',               cgasto:'121.000',  template:'1', classattr:'info'},
            {val:'varios',      label:'Merchandising',        ume:'merchandising',  cgasto:'121.101',  template:'1', classattr:'info'},
            {val:'otros',       label:'Otros',                ume:'otros',          cgasto:'121.103',  template:'1', classattr:'info'},
        ],
        impresiones:[
            {val:'no_definido',   label:'Subtipo de Impresiones', ume:'',            cgasto:'125.000',  template:'1', classattr:'info'},
            {val:'banners',       label:'Banners',                ume:'banners',     cgasto:'125.101',  template:'1', classattr:'info'},
            {val:'carteleria',    label:'Cartelería y gráfica',   ume:'cartel',      cgasto:'125.103',  template:'1', classattr:'info'},
            {val:'folletos',      label:'Gráfica de mano',        ume:'folleto',     cgasto:'125.105',  template:'1', classattr:'info'},
            {val:'publicaciones', label:'Publicaciones',          ume:'publicacion', cgasto:'125.107',  template:'1', classattr:'info'},
            {val:'otros',         label:'Otros',                  ume:'otros',       cgasto:'125.109',  template:'1', classattr:'info'},
        ],
        muestras:[
            {val:'no_definido',    label:'Subtipo de Muestras',  ume:'',             cgasto:'131.000',  template:'1', classattr:'info'},
            {val:'seguros',        label:'Seguros de Obras',     ume:'seguro',       cgasto:'131.101',  template:'1', classattr:'info'},
            {val:'construcciones', label:'Construcción en seco', ume:'constseco',    cgasto:'131.103',  template:'1', classattr:'info'},
            {val:'mobiliario',     label:'Mobiliario',           ume:'mobiliario',   cgasto:'131.105',  template:'1', classattr:'info'},
            {val:'transporte',     label:'Transporte Obra',      ume:'trnsobra',     cgasto:'131.107',  template:'1', classattr:'info'},
            {val:'marcos',         label:'Marcos',               ume:'marco',        cgasto:'131.109',  template:'1', classattr:'info'},
            {val:'montaje',        label:'Montaje',              ume:'montaje',      cgasto:'131.111',  template:'1', classattr:'info'},
            {val:'reproducciones', label:'Reproducciones',       ume:'reproduccion', cgasto:'131.113',  template:'1', classattr:'info'},
            {val:'otros',          label:'Otros',                ume:'otros',        cgasto:'131.115',  template:'1', classattr:'info'},
        ],
        derechos:[
            {val:'no_definido', label:'Subtipo de Derechos', ume:'',           cgasto:'135.000',  template:'1', classattr:'info'},
            {val:'sadaic',      label:'SADAIC',              ume:'sadaic',     cgasto:'135.101',  template:'1', classattr:'info'},
            {val:'argentores',  label:'ARGENTORES',          ume:'argentores', cgasto:'135.103',  template:'1', classattr:'info'},
            {val:'cesiones',    label:'Cesión derechos',     ume:'derecho',    cgasto:'135.105',  template:'1', classattr:'info'},
            {val:'otros',       label:'Otros',               ume:'otros',      cgasto:'135.107',  template:'1', classattr:'info'},
        ],
        subsidios:[
            {val:'no_definido', label:'Subtipo de Derechos', ume:'',           cgasto:'141.000',  template:'1', classattr:'info'},
            {val:'sprivado',    label:'Sector privado',      ume:'subsidios',  cgasto:'141.101',  template:'1', classattr:'info'},
            {val:'spublico',    label:'Sector público',      ume:'subsidios',  cgasto:'141.103',  template:'1', classattr:'info'},
            {val:'otros',       label:'Otros',               ume:'otros',      cgasto:'141.107',  template:'1', classattr:'info'},
        ],
    },
    //        {val:'',  label:'',          code:'101.101',  classattr:'info'},

    //========= ACTIONS =========================
    umeList: [
        {val:'no_definido'  , label:'Unidad de Medida'},
        {val:'global'       , label:'(unitario)'},
        {val:'hora'         , label:'hora'},
        {val:'contrato'     , label:'contratos'},
        {val:'artista'      , label:'artista(s)'},
        {val:'no_definido'  , label:'-------------'},        
        {val:'asistencia'   , label:'asistencia(s)'},
        {val:'persona'      , label:'persona(s)'},
        {val:'dia'          , label:'día'},
        {val:'hora'         , label:'hora'},
        {val:'alquiler'     , label:'alquiler'},
        {val:'unidad'       , label:'unidad'},
        {val:'equipo'       , label:'equipo(s)'},
        {val:'tecnica'      , label:'técnica(s)'},
        {val:'escenario'    , label:'escenario(s)'},
        {val:'lucese'       , label:'luces Esc'},
        {val:'energiae'     , label:'energía Esc'},
        {val:'pantallae'    , label:'pantalla Esc'},
        {val:'sonidoe'      , label:'sonido Esc'},
        {val:'backline'     , label:'back line'},
        {val:'proyector'    , label:'proyector'},
        {val:'no_definido'  , label:'-------------'},
        {val:'seguro'       , label:'seguros'},
        {val:'constseco'    , label:'constr en seco'},
        {val:'mobiliario'   , label:'mobiliario'},
        {val:'trnsobra'     , label:'transporte obra arte'},
        {val:'trnscarga'    , label:'transporte carga'},
        {val:'trnspjero'    , label:'transporte pasajero'},
        {val:'marco'        , label:'marcos'},
        {val:'montaje'      , label:'montajes'},
        {val:'reproduccion' , label:'reproducciones'},
        {val:'no_definido'  , label:'-------------'},
        {val:'sadaic'       , label:'SADAIC'},
        {val:'argentores'   , label:'ARGENTORES'},
        {val:'derechos'     , label:'Derechos'},
        {val:'no_definido'  , label:'-------------'},
        {val:'pasaje'       , label:'pasajes'},
        {val:'alojamiento'  , label:'alojamientos'},
        {val:'catering'     , label:'catering'},
        {val:'seguridad'    , label:'seguridad'},
        {val:'limpieza'     , label:'limpieza'},
        {val:'eqcomunic'    , label:'eq de comunicación'},
        {val:'banioquim'    , label:'baño quím'},
        {val:'carpa'        , label:'carpa'},
        {val:'no_definido'  , label:'-------------'},
        {val:'banner'       , label:'banners'},
        {val:'cartel'       , label:'cartelería'},
        {val:'folleto'      , label:'folletos'},
        {val:'publicacion'  , label:'publicación'},
        {val:'no_definido'  , label:'-------------'},
        {val:'merchandising', label:'merchandising'},
        {val:'no_definido'  , label:'-------------'},
        {val:'grafica'      , label:'gráfica'},
        {val:'buso'         , label:'bienes de uso'},
        {val:'consumible'   , label:'consumible'},
        {val:'instalacion'  , label:'instalación'},
        {val:'obraartistica', label:'obra artística'},
        {val:'ciclo'        , label:'ciclo'},
        {val:'produccion'   , label:'producción'},
        {val:'presentacions', label:'presentaciones'},
        {val:'cubierto'     , label:'cubierto'},
        {val:'viaje'        , label:'viaje'},
        {val:'habitacion'   , label:'habitación'},
        {val:'funcion'      , label:'función'},
        {val:'congreso'     , label:'congreso'},
        {val:'litro'        , label:'litro'},
        {val:'metro'        , label:'metro'},
        {val:'kilo'         , label:'kilo'},
        {val:'otros'        , label:'otros'},
    ],

    umeFreqList: [
        {val:'no_definido'  , label:'Unidad de Frecuencia'},
        {val:'global'       , label:'global'},
        {val:'dia'          , label:'días'},
        {val:'hora'         , label:'horas'},
        {val:'mes'          , label:'meses'},
        {val:'show'         , label:'shows'},
        {val:'funcion'      , label:'funciones'},
        {val:'congreso'     , label:'congresos'},
        {val:'otros'         , label:'unidades'},
    ],

    tipoActionEntityList: [
        {val:'no_definido'   , label:'Tipo de Entidad'},
        {val:'programa'      , label:'Programa'},
        {val:'accion'        , label:'Acción'},
        {val:'actividad'     , label:'Actividad'},
    ],

    tipoActionIniciativeList: [
        {val: 'no_definido',         label: 'Tipo de Acción'},
        {val: 'actividadcentral',    label: 'Actividades centrales'},
        {val: 'campania',            label: 'Campaña'},
        {val: 'congreso',            label: 'Congreso'},
        {val: 'encuentrointl',       label: 'Encuentro Internacional'},
        {val: 'encuentroregional',   label: 'Encuentro Regional'},
        {val: 'evento',              label: 'Evento'},
        {val: 'eventoic',            label: 'Evento IC'},
        {val: 'ciclos',              label: 'Ciclos, extensión cultural'},
        {val: 'fiestacarnaval',      label: 'Festejos Carnaval'},
        {val: 'fiestanacional',      label: 'Fiesta Nacional'},
        {val: 'fiestapopular',       label: 'Fiesta Popular'},
        {val: 'festivales',          label: 'Festivales'},
        {val: 'feriadellibro',       label: 'Feria del Libro'},
        {val: 'foro',                label: 'Foro'},
        {val: 'inclusion',           label: 'Inclusión'},
        {val: 'participacion',       label: 'Actividades participativas'},
        {val: 'fortalecimiento',     label: 'Fortalecimiento'},
        {val: 'subsidios',           label: 'Becas, ayudas, subsidios'},       
        {val: 'mejoragestion',       label: 'Mejora en la Gestión'},
        {val: 'concurso',            label: 'Concursos'},
        {val: 'muestra',             label: 'Muestra'},
        {val: 'generacionxxi',       label: 'Generación XXI'},
        {val: 'coro',                label: 'Coros'},
        {val: 'banda',               label: 'Bandas'},
        {val: 'ballet',              label: 'Ballet'},
        {val: 'danza',               label: 'Danza'},
        {val: 'teatro',              label: 'Teatro'},
        {val: 'orquesta',            label: 'Orquesta'},
        {val: 'gestioncultural',     label: 'Gestión Cultural'},
        {val: 'artesvisuales',       label: 'Difusión de las Artes Visuales'},
        {val: 'museos',              label: 'Museos'},
        {val: 'patrimoniohistorico', label: 'Patrimonio Histórico'},
        {val: 'patrimonioedilicio',  label: 'Patrimonio Edilicio'},
        {val: 'exposicion',          label: 'Exposiciones'},
        {val: 'expoitinerante',      label: 'Exposiciones Itinerantes'},
        {val: 'audiovisual',         label: 'Producción Audiovisual TV/ Radio/ Digital'},
        {val: 'infraestructuraedil', label: 'Infraestructura Edilicia'},
        {val: 'infraestructurainfo', label: 'Infraestructura Tecnológica'},
        {val: 'sistemasgestion',     label: 'Sistemas de Gestión'},
        {val: 'platoformadigital',   label: 'Plataforma Digital'},
        {val: 'educacion',           label: 'Educación'},
        {val: 'infancia',            label: 'Infancia'},
        {val: 'industricacultural',  label: 'Industria Cultural'},
        {val: 'fomentointl',         label: 'Fomento Internacional'},
        {val: 'legislacioncultural', label: 'Legislación Cultural'},
        {val: 'derechosculturales',  label: 'Derechos culturales'},
        {val: 'matra',               label: 'Matra'},
        {val: 'conabip',             label: 'CONABIP'},
        {val: 'mnba',                label: 'MNBA'},
        {val: 'bn',                  label: 'Biblioteca Nacional'},
        {val: 'articulacioninstitu', label: 'Articulación Institucional'},
        {val: 'organismosintl',      label: 'Organismos Internacionales'},
        {val: 'ferianacional',       label: 'Feria Nacional'},
        {val: 'feriaintl',           label: 'Feria Internacional'},
        {val: 'mantenimientogral',   label: 'Mantenimiento General'},
        {val: 'seguridad',           label: 'Seguridad'},
        {val: 'limpieza',            label: 'Limpieza'},
        {val: 'flotaautomotores',    label: 'Flota automotores'},
        {val: 'recalculando',        label: 'Recalculando'},
        {val: 'micsur',              label: 'MICSUR'},
        {val: 'paec',                label: 'PAEC'},
        {val: 'sinca',               label: 'SinCA'},
        {val: 'musicologia',         label: 'Inst Nac de Musicología'},
        {val: 'memorarconar',        label: 'Memorar Conar'},
        {val: 'palacionacartes',     label: 'Palacio Nacional de Artes'},
        {val: 'museos',              label: 'Museos'},
        {val: 'culturadigital',      label: 'Cultura Digital'},
        {val: 'publicaciones',       label: 'Publicaciones'},
        {val: 'premiosnacionales',   label: 'Premios Nacionales'},
    ],

    actionAltaOptionList:[
        {val:'no_definido',  label:'Estado de Alta'},
        {val:'activo',       label:'activo'},
        {val:'observado',    label:'observado'},
        {val:'suspendido',   label:'suspendido'},
        {val:'cerrado',      label:'cerrado'},
        {val:'media',        label:'corregir'},
        {val:'baja',         label:'baja'},
    ],

    actionEjecucionOptionList:[
        {val:'no_definido'   , label:'Nivel de ejecución', classattr:'info'},
        {val:'enpreparacion' , label:'en preparación',     classattr:'info'},
        {val:'enevaluacion'  , label:'en evaluacion',      classattr:'info'},
        {val:'aprobarea'     , label:'aprob Area',         classattr:'info'},
        {val:'aprobnodo'     , label:'aprob Nodo',         classattr:'warning'},
        {val:'aprobdga'      , label:'aprob DGA',          classattr:'success'},
        {val:'aprobum'       , label:'aprob UM',           classattr:'warning'},
        {val:'enejecucion'   , label:'en ejecución',       classattr:'danger'},
        {val:'terminada'     , label:'terminada',          classattr:'info'},
        {val:'suspendido'    , label:'suspendida',         classattr:'danger'},
        {val:'cerrado'       , label:'cerrado',            classattr:'danger'},
        {val:'archivo'       , label:'archivado',          classattr:'info'}
    ],

    budgetOriginList:[
        {val:'no_definido'      , label:'Origen de fondos',         classattr:'info'},
        {val:'MCN'              , label:'MCN',                      classattr:'info'},
        {val:'presidencia'      , label:'Presidencia',              classattr:'info'},
        {val:'planificacion'    , label:'Minplan',                  classattr:'info'},
        {val:'otrospublicos'    , label:'Otros organismos públicos',  classattr:'info'},
        {val:'otrosprivados'    , label:'Otras fuentes privadas',   classattr:'info'},
    ],

    budgetTramitaPorList:[
        {val:'no_definido'      , label:'Forma de Tramitación', classattr:'info'},
        {val:'MCN'              , label:'MCN',              classattr:'info'},
        {val:'unsam'            , label:'UNSAM',            classattr:'info'},
        {val:'untref'           , label:'UNTREF',           classattr:'info'},
        {val:'minplan'          , label:'Minplan',          classattr:'info'},
        {val:'presidencia'      , label:'Presidencia',      classattr:'info'},
        {val:'unobs'            , label:'UNOBS',            classattr:'info'},
        {val:'oei'              , label:'OEI',              classattr:'info'},
        {val:'desconcentrado'   , label:'Org desconcen',    classattr:'info'},
        {val:'descentralizado'  , label:'Org descentr',     classattr:'info'},
    ],

    budgetEjecucionOptionList:[
        {val:'no_definido'   , label:'Nivel de Ejecución', classattr:'info'},
        {val:'enpreparacion' , label:'en preparación',     classattr:'info'},
        {val:'enevaluacion'  , label:'en evaluacion',      classattr:'info'},
        {val:'aprobarea'     , label:'aprob Area',         classattr:'info'},
        {val:'aprobnodo'     , label:'aprob Nodo',         classattr:'warning'},
        {val:'aprobdga'      , label:'aprob DGA',          classattr:'success'},
        {val:'aprobum'       , label:'aprob UM',           classattr:'warning'},
        {val:'enejecucion'   , label:'en ejecución',       classattr:'danger'},
        {val:'terminada'     , label:'terminada',          classattr:'info'},
        {val:'suspendido'    , label:'suspendida',         classattr:'danger'},
        {val:'cerrado'       , label:'cerrado',            classattr:'danger'},
        {val:'archivo'       , label:'archivado',          classattr:'info'}
    ],

    actionPrioridadOptionList:[
        {val:'no_definido', label:'Nivel de Prioridad'},
        {val:'media'  ,     label:'media'},
        {val:'alta'   ,     label:'alta'},
        {val:'baja'   ,     label:'baja'},
        {val:'urgente',     label:'urgente'}
    ],
    actionNodosOptionList:[
        {val:'no_definido'  ,nodo:'no_definido' , label:'Lista de NODOS'},
        {val: 'CASAS'       ,nodo:'UM'      , label:'CASAS'},
        {val: 'CCNK'        ,nodo:'UM'      , label:'Centro Cultural Nestor Kirchner'},
        {val: 'DPD'         ,nodo:'UM'      , label:'DI de Prensa y Difusión'},
        {val: 'DNPA'        ,nodo:'UM'      , label:'DN de Planificación y Articulación'},
        {val: 'MNBA'        ,nodo:'UM'      , label:'Museo Nacional de Bellas Artes'},
        {val: 'ORGANISMOS'  ,nodo:'UM'      , label:'ORGANISMOS'},
        {val: 'PNIC'        ,nodo:'UM'      , label:'PN Igualdad Cultural'},
        {val: 'SCCG'        ,nodo:'UM'      , label:'SCCG'},
        {val: 'SCEPN'       ,nodo:'UM'      , label:'SCEPN'},
        {val: 'SGC'         ,nodo:'UM'      , label:'SGC'},
        {val: 'SPSC'        ,nodo:'UM'      , label:'SPSC'},
        {val: 'BN'          ,nodo:'UM'      , label:'Biblioteca Nacional'},
        {val: 'INCAA'       ,nodo:'UM'      , label:'INCAA'},
        {val: 'INT'         ,nodo:'UM'      , label:'Instituto Nacional de Teatro'},
        {val: 'INAMU'       ,nodo:'UM'      , label:'Inst Nacional de Música'},
        {val: 'FNA'         ,nodo:'UM'      , label:'Fondo Nacional de las Artes'},
        {val: 'TNC'         ,nodo:'UM'      , label:'Teatro Nacional Cervantes'},
        {val: 'UM'          ,nodo:'UM'      , label:'UM'},
    ],

    actionAreasOptionList:[
        {val:'no_definido'  ,nodo:'no_definido' , label:'Lista de ÁREAS'},
        {val: 'DNA'         ,nodo:'SGC'     , label:'DN de Artes'},
        {val: 'DNIC'        ,nodo:'SGC'     , label:'DN de Industrias Culturales'},
        {val: 'DNPM'        ,nodo:'SGC'     , label:'DN de Patrimonio y Museos'},
        {val: 'DNPCCI'      ,nodo:'SGC'     , label:'DN de Políticas Culturales y Cooperación Internacional'},
        {val: 'CNB'         ,nodo:'SGC'     , label:'Casa Nacional del Bicentenario'},
        {val: 'CCV21'       ,nodo:'SPSC'    , label:'Centro Cultural Villa 21'},
        {val: 'CCV31'       ,nodo:'SPSC'    , label:'Centro Cultural Villa 31'},
        {val: 'DNPOP'       ,nodo:'SPSC'    , label:'DN de Participación y Organización Popular'},
        {val: 'DNAF'        ,nodo:'SPSC'    , label:'DN de Acción Federal'},
        {val: 'DNPDCDC'     ,nodo:'SPSC'    , label:'DN de Promoción de los Derechos Culturales y Diversidad Cultural'},
        {val: 'DNPAL'       ,nodo:'SCEPN'   , label:'DN de Pensamiento Argentino y Latinoamericano'},
        {val: 'DNPA'        ,nodo:'DNPA'    , label:'DN de Planificación y Articulación'},
        {val: 'DPD'         ,nodo:'UM'      , label:'DI de Prensa'},
        {val: 'PNIC'        ,nodo:'UM'      , label:'PN Igualdad Cultural'},
        {val: 'CASAS'       ,nodo:'UM'      , label:'CASAS'},
        {val: 'CCNK'        ,nodo:'UM'      , label:'Centro Cultural Nestor Kirchner'},
        {val: 'ORGANISMOS'  ,nodo:'UM'      , label:'ORGANISMOS'},
        {val: 'DGA'         ,nodo:'SCCG'    , label:'DG de Administración (DGA)'},
        {val: 'DJG'         ,nodo:'SCCG'    , label:'DG de Jurídicos (DGJ)'},
        {val: 'DGTS'        ,nodo:'SCCG'    , label:'DG de Tecnología y Sistemas (DGTS)'},
        {val: 'MNBA'        ,nodo:'MNBA'    , label:'Museo Nacional de Bellas Artes'},
        {val: 'BN'          ,nodo:'BN'      , label:'Biblioteca Nacional'},
        {val: 'FNA'         ,nodo:'FNA'     , label:'Fondo Nacional de las Artes'},
        {val: 'INCAA'       ,nodo:'INCAA'   , label:'INCAA'},
        {val: 'INT'         ,nodo:'INT'     , label:'INT'},
        {val: 'INAMU'       ,nodo:'INAMU'   , label:'INAMU'},
        {val: 'MUSEOS'      ,nodo:'SGC'     , label:'MUSEOS'},
        {val: 'SCCG'        ,nodo:'SCCG'    , label:'SCCG'},
        {val: 'SCEPN'       ,nodo:'SCEPN'   , label:'SCEPN'},
        {val: 'SGC'         ,nodo:'SGC'     , label:'SGC'},
        {val: 'SPSC'        ,nodo:'SPSC'    , label:'SPSC'},
        {val: 'SSPDCPP'     ,nodo:'SPSC'    , label:'SSPDCPP'},
        {val: 'UM'          ,nodo:'UM'      , label:'UM'},
    ],

    //========= ACTIONS END =========================

    userPredicateList: [
        {val:'no_definido'      , label:'Tipo de comprobante'},
        {val:'es_usuario_de'    , label:'Mis datos personales'},
        {val:'es_miembro_de'    , label:'miembro/ integrante/relacionado'},
        {val:'es_responsable_de', label:'responsable/ coordinador/ enlace'},
    ],

    tipoDocumItemOptionList: [
        {val:'no_definido'    , label:'tipo de comprobante'},
        {val:'ptecnico'       , label:'P/Técnico'},
        {val:'nrecepcion'     , label:'N/Recepción'},
        {val:'nsolicitud'     , label:'N/Solicitud'},
        {val:'nentrega'       , label:'N/Entrega'},
        {val:'npedido'        , label:'N/Pedido'},
        {val:'pemision'       , label:'P/Emisión'},
        {val:'pdiario'        , label:'P/Diario'},
    ],

    paOptionList: [
        {val:'no_definido'  , label:'Nivel de ejecución'},
        {val:'enproceso'    , label:'en proceso'},
        {val:'completado'   , label:'completado'},
        {val:'suspendido'   , label:'suspendido'},
        {val:'archivo'      , label:'archivado'}
    ],

    documexecutionOptionList: [
        {val:'no_definido'  , label:'Nivel de ejecución', classattr:'info'},
        {val:'enpreparacion', label:'en preparación',     classattr:'info'},
        {val:'pendiente', label:'en preparación',     classattr:'info'},
        {val:'completado'   , label:'completado',         classattr:'info'},
        {val:'enevaluacion' , label:'en evaluación',      classattr:'warning'},
        {val:'aprobado'     , label:'aprobado',           classattr:'success'},
        {val:'suspendido'   , label:'suspendido',         classattr:'warning'},
        {val:'rechazado'    , label:'rechazado',          classattr:'danger'},
        {val:'archivo'      , label:'archivado',          classattr:'info'}
    ],
/*
    casosqcOptionList: [
        {val:'AAnodefinido',   label:'Seleccione tipo de hallazgo'},
        {val:'Aartefactos',    label:'A: Artefactos producidos por compresión / branding'},
        {val:'Adropanalogico', label:'A: Drop de video analógico'},
        {val:'Adropdigital',   label:'A: Drop de video digital'},
        {val:'Agraficaaccion', label:'A: Gráfica fuera del margen de seguridad de acción'},
        {val:'Agraficatexto',  label:'A: Gráfica fuera del margen de seguridad de texto'},
        {val:'Amoirealiasing', label:'A: Moire / Aliasing'},
        {val:'Anegrobloque',   label:'A: Negro entre bloques'},
        {val:'Apconvframes',   label:'A: Problemas de conversión (repite frames)'},
        {val:'Apconvgeneral',  label:'A: Problemas de conversión general'},
        {val:'Apedicionvideo', label:'A: Problemas de edición de video'},
        {val:'Apescaneo',      label:'A: Problemas de Escaneo'},
        {val:'Apfocoplano',    label:'A: Problemas de foco en plano'},
        {val:'Apposicionimg',  label:'A: Problemas de posición de imagen'},
        {val:'Approcesam',     label:'A: Problemas de procesamiento generales'},
        {val:'Apresolimagen',  label:'A: Problemas de resolución de imagen'},
        {val:'Avalexcedido',   label:'A: Valores de video/chroma/hue exceden margen legal'},
        {val:'Avarabruptacol', label:'A: Variación abrupta de corrección de color'},
        {val:'Bdsinccanales',  label:'B: Descincronización entre canales de audio'},
        {val:'Bdropanalogico', label:'B: Drop de audio analógico'},
        {val:'Bdropdigital',   label:'B: Drop de audio digital'},
        {val:'Bpedicionau',    label:'B: Problema de edición de audio'},
        {val:'Bpasigcanlau',   label:'B: Problemas en asiganción de canales de audio'},
        {val:'Bpmzclaruido',   label:'B: Problemas en mezcla (piso de ruido)'},
        {val:'Bpmzcladial',    label:'B: Problemas en mezcla / diálogos bajs (-200dB FS)'},
        {val:'Bpnivrelmzcla',  label:'B: Problemas en niveles relativos de mezcla'},
        {val:'Clipsync',       label:'C: Descincronización de diálogo (lip-sync)'},
        {val:'Dplacasinst',    label:'D: Placas institucionales no correspondientes'},
        {val:'Dplanoseg',      label:'D: Plano de seguridad faltante (TCA:xx:xx:xx//xx:xx:xx)'},
        {val:'Dplanosegerror', label:'D: Plano de seguridad no corresponde a capítulo'},
        {val:'Dportografia',   label:'D: Problemas en paquete gráfico (error ortográfico)'},
        {val:'Dptipografia',   label:'D: Problemas en paquete grafico (tipografía ilegible)'},
        {val:'Dsaltotc',       label:'D: Salto en Timecode continuo'},
    ],
*/
/* solicitudes municipios */
   tipofiestaOptionList: [
        {val:'no_definido', label:'Tipo de evento'},
        {val:'fpopular', label:'Fiesta popular'},
        {val:'fnacional'    , label:'Fiesta nacional'},
        {val:'fregional' , label:'Fiesta regional'},
        {val:'carnaval'   , label:'Carnaval'},
    ],

   tiporequerimOptionList: [
        {val:'no_definido', label:'Tipo de requerimiento'},
        {val:'artistica', label:'Artística'},
        {val:'tecnica', label:'Técnica'},
        {val:'movilidad', label:'Movilidad'},
        {val:'alojamiento', label:'Alojamiento'},
        {val:'pasajes', label:'Pasajes'},
        {val:'seguridad', label:'Seguridad'},
        {val:'escenario', label:'Escenario'},
        {val:'catering', label:'Catering'},
        {val:'banios', label:'Baños'},
    ],
   requeridoporOptionList: [
        {val:'no_definido', label:'Requerido por...'},
        {val:'requirente', label:'Requirente'},
        {val:'organismo', label:'MCN'},
    ],
   acargodeOptionList: [
        {val:'no_definido', label:'A cargo de...'},
        {val:'requirente', label:'Requirente'},
        {val:'organismo', label:'MCN'},
    ],
   itemaprobOptionList: [
        {val:'no_definido', label:'MCN: Estado aprobación', classattr:'info'},
        {val:'aprobado',    label:'Aprobado'  , classattr:'success' },
        {val:'rechazado',   label:'Rechazado' , classattr:'danger'  },
        {val:'observado',   label:'Observado' , classattr:'warning' },
        {val:'pendiente',   label:'Pendiente' , classattr:'warning' },
    ],
   itemaprobreqOptionList: [
        {val:'no_definido', label:'REQ: Estado aceptación', classattr:'info'},
        {val:'aprobado',    label:'Aprobado' , classattr:'success' },
        {val:'rechazado',   label:'Rechazado', classattr:'danger'  },
        {val:'observado',   label:'Observado', classattr:'warning' },
        {val:'pendiente',   label:'Pendiente', classattr:'warning' },
    ],

    estadosolicitudOptionList: [
        {val:'no_definido', label:'Estado del parte técnico'},
        {val:'enevaluacion', label:'EN EVALUACIÓN'},
        {val:'aprobado'    , label:'APROBADO'},
        {val:'aprobconobs' , label:'APROB C/OBSERVACIONES'},
        {val:'rechazado'   , label:'RECHAZADO'},
    ],

/* Estados de la solicitud */
   
   estadoavanceOptionList: [
        {val:'no_definido', label:'Estado'},
        {val:'aprobado',    label:'Aprobado'},
        {val:'rechazado',   label:'Rechazado'},
        {val:'observado',   label:'Observado'},
        {val:'pendiente',   label:'Pendiente'},
    ],


    casosqcOptionList: [
        {val:'nodefinido',        label:'-------  Seleccione tipo de hallazgo-------------------------------------'},
        {val:'vvideo',            label:'------------- V I D E O -------------------------------------------------'},
        {val:'vausvideo',         label:'Ausencia de video/media offline'},
        {val:'vartefactos',       label:'Artefactos producidos por compresión/ banding'},
        {val:'vdropanalogico',    label:'Drop de video analógico'},
        {val:'vdropdigital',      label:'Drop de video digital'},
        {val:'vflickering',       label:'Parpadeo (flickering)'},
        {val:'vgraffseguraccion', label:'Gráfica fuera del margen de seguridad de acción'},
        {val:'vgraffsegurtexto',  label:'Gráfica fuera del margen de seguridad de texto'},
        {val:'vmoire',            label:'Moire / Aliasing'},
        {val:'vconvgerepite',     label:'Problema de conversión general (repite cuadros'},
        {val:'vconvgeneral',      label:'Problema de conversión general'},
        {val:'vprobedicionvideo', label:'Problema de edición de video'},
        {val:'vprobescaneo',      label:'Problema de escaneo'},
        {val:'vprobfocoplano',    label:'Problema de foco en plano'},
        {val:'vprobposimagen',    label:'Problema de posición de imagen'},
        {val:'vprobprocgeneral',  label:'Problema de procesamiento general'},
        {val:'vprobchromakey',    label:'Problema de recorte /chroma key'},
        {val:'vprobresollimg',    label:'Problema de resolución de imagen'},
        {val:'vvaloresexcedenlegal', label:'Valores de video/ chroma/ hue/ exceden margen legal'},
        {val:'vvarabrupta',       label:'Variación abrupta de corrección de color / exposición'},
        {val:'vvarcorreccion',    label:'Variación de corrección de color entre planos'},
        {val:'vpixelquemado',     label:'Pixel quemado'},
        {val:'aaudio',            label:'------------- A U D I O -----------------------------------------------'},
        {val:'aausencia',         label:'Ausencia de audio'},
        {val:'adesinccanales',    label:'Descincronización entre canales de audio'},
        {val:'adropanalogico',    label:'Drop de audio analógico'},
        {val:'adropdigital',      label:'Drop de audio digital'},
        {val:'aprobedicion',      label:'Problema de edición de audio'},
        {val:'aprobasignacion',   label:'Problema en asignación de canales de audio'},
        {val:'aprobmezcla',       label:'Problema en mezcla (piso de ruido)'},
        {val:'aprobdialogos',     label:'Problema en mezcla/ diálogos bajos'},
        {val:'aprobnivelesre',    label:'Problema en niveles relativos de mezcla'},
        {val:'alipsync',          label:'Desincronicación de dialogo (Lip-sync)'},
        {val:'ggrafica',          label:'---------- G R A F I C A -----------------------------------------------'},
        {val:'gplacasinstitucional', label:'Placas institucionales no correspondientes'},
        {val:'gplanoseguridad',   label:'Plano de seguridad faltante (TC:xx:xx:xx:xx)'},
        {val:'gplanonocorresp',   label:'Plano de seguridad no correspondiente'},
        {val:'gprobpaqgrafico',   label:'Problema en paquete gráfico (ortografía/ gramática)'},
        {val:'gprobtipografia',   label:'Problema en paquete gráfico (tipografía ilegible)'},
        {val:'ootros',            label:'----------- O T R O S --------------------------------------------------'},
        {val:'osaltotc',          label:'Salto de TC continuo'},
        {val:'otcnocorresp',      label:'TC no correspondiente'},
    ],

    mediofisicoOptionList: [
        {val:'no_definido', label:'Medio fisico'},
        {val:'sopfisico'  , label:'Soporte fisico'},
        {val:'transfer'   , label:'Transferencia'},
    ],

    coberturaOptionList: [
        {val:'no_definido'  , label:'Región'},
        {val:'tda'          , label:'TDA'},
        {val:'AMBA'         , label:'AMBA'},
        {val:'mesopotamia'  , label:'Mesopotamia'},
        {val:'noroeste'     , label:'Noroeste'},
        {val:'cuyo'         , label:'Cuyo'},
        {val:'patagonia'    , label:'Patagonia'},
        {val:'centro'       , label:'Centro'},
    ],

    tipoemisOptionList: [
        {val:'no_definido', label:'Tipo de emisión'},
        {val:'tda'        , label:'TDA'},
        {val:'cable'      , label:'Cable'},
        {val:'satelite'   , label:'Satélite'},
        {val:'ott'        , label:'OTT'},
     ],

    fuenteOptionList: [
        {val:'no_definido', label:'Fuente de información'},
        {val:'senial'     , label:'señal'},
        {val:'propia'     , label:'propia'},
        {val:'externo'    , label:'externo'},
     ],

    tipomovOptionList: [
        {val:'no_definido'  , label:'Tipo de movimiento'},
        {val:'nopentrada'   , label:'------ E N T R A D A S ------'},
        {val:'recepcion'    , label:'Recepción Productos para chequeo'},
        {val:'entrada'      , label:'Recepciones varias'},
        {val:'nopsalida'    , label:'------  S A L I D A S ------'},
        {val:'distribucion' , label:'Distribución'},
        {val:'entrega'      , label:'Entregas'},
        {val:'noppedido'    , label:'------  P E D I D O S  ------'},
        {val:'nsolicitud'   , label:'Solicitudes de Municipios'},
        {val:'reqadherente' , label:'Requerimiento de adherente'},
    ],
 
    tipomovpdiarioOptionList: [
        {val:'no_definido'    , label:'Tipo de movimiento'},
        {val:'recepcion'      , label:'Recepción Producto Audiovisual'},
        {val:'rsolicitud'     , label:'Solicitud de Municipios'},
        {val:'tecnica'        , label:'Técnica'},
        {val:'ptecnico'       , label:'Parte Técnico'},
        {val:'visualizacion'  , label:'Visualización'},
    ],

    tipoactividadOptionList: [
        {val:'no_definido'    , label:'Tipo de movimiento'},
        {val:'catalogacion'   , label:'Catalogación'},
        {val:'verificacion'   , label:'Visualización'},
    ],
    
    tipomovqueryOptionList: [
        {val:'no_definido'  , label:'Tipo de movimiento'},
        {val:'nopentrada'   , label:'------ E N T R A D A S ------'},
        {val:'recepcion'    , label:'Recepción Producto Audiovisual'},
        {val:'entrada'      , label:'Recepciones varias'},
        {val:'nopentrada'   , label:'------  S A L I D A S ------'},
        {val:'distribucion' , label:'Distribución'},
        {val:'entrega'      , label:'Entregas'},
        {val:'nopentrada'   , label:'------  P E D I D O S ------'},
        {val:'reqmunicipio' , label:'Requerimiento de municipio'},
        {val:'reqadherente' , label:'Requerimiento de adherente'},
        {val:'nopentrada'   , label:'------  PARTE TECNICO ------'},
        {val:'enevaluacion' , label:'En evaluación'},
        {val:'aprobado'     , label:'Aprobado'},
        {val:'aprobconobs'  , label:'Aprob c/observaciones'},
        {val:'rechazado'    , label:'Rechazado'},
        {val:'nopentrada'   , label:'------  PARTE EMISION ------'},
        {val:'pemision'     , label:'Parte de emision'},
    ],

    tipomovEntregaOptionList: [
        {val:'no_definido', label:'Tipo de movimiento'},
        {val:'distribucion' , label:'Distribución'},
        {val:'entrega'      , label:'Entregas'},
    ],

    tipomovRecepcionOptionList: [
        {val:'no_definido', label:'Tipo de movimiento'},
        {val:'recepcion'  , label:'Recepción Producto Audiovisual'},
        {val:'entrada'    , label:'Recepciones varias'},
    ],

    tipomovPedidoOptionList: [
        {val:'no_definido'  , label:'Tipo de movimiento'},
        {val:'nsolicitud'   , label:'Nota de solicitud de Municipio'},
        {val:'reqadherente' , label:'Requerimiento de adherente'},
    ],

    estadoqcOptionList: [
        {val:'no_definido', label:'Estado del parte técnico'},
        {val:'enevaluacion', label:'EN EVALUACIÓN'},
        {val:'aprobado'    , label:'APROBADO'},
        {val:'aprobconobs' , label:'APROB C/OBSERVACIONES'},
        {val:'rechazado'   , label:'RECHAZADO'},
    ],

    severidadptOptionList: [
        {val:'no_definido',  label:'Severidad'},
        {val:'baja'  , label:'baja'},
        {val:'media' , label:'media'},
        {val:'alta'  , label:'alta'},
    ],

    canalptOptionList: [
        {val:'no_definido',  label:'Canal'},
        {val:'V1'  , label:'video'},
        {val:'A1'  , label:'audio - 1'},
        {val:'A2'  , label:'audio - 2'},
        {val:'A3'  , label:'audio - 3'},
        {val:'A4'  , label:'audio - 4'},
    ],

    tipoInformeOptionList: [
        {val:'no_definido'    , label:'tipo de informe'},
        {val:'esitseniales'   , label:'Estado de Situación (ES-1)'},
    ],

    tipoReporteOptionList: [
        {val:'no_definido'  , label:'tipo de reporte'},
        {val:'resxsenial'   , label:'Resumido x Señal'},
    ],

    tipoComprobanteOptionList: [
        {val:'no_definido'    , label:'tipo de comprobante'},
        {val:'ptecnico'       , label:'P/Técnico'},
        {val:'nrecepcion'     , label:'N/Recepción'},
        {val:'nentrega'       , label:'N/Entrega'},
        {val:'nsolicitud'     , label:'N/Solicitud'},
        {val:'npedido'        , label:'N/Pedido'},
        {val:'pemision'       , label:'P/Emisión'},
        {val:'pdiario'        , label:'P/Diario'},
     ],
    
    tipoProduccionOptionList: [
        {val:'no_definido'    , label:'tipo de producción'},
        {val:'anyw'           , label:'Anywhere'},
    ],
        
    userGroupsOptionList:[
        {val:'no_definido'     , label:'Grupo principal'},
        {val:'tecnica'         , label:'Técnica'},
        {val:'produccion'      , label:'Producción'},
        {val:'coordinacion'    , label:'Coordinación'},
        {val:'administracion'  , label:'Administración'},
        {val:'contenidos'       , label:'Contenidos'},
        {val:'direccion'        , label:'Dirección'},
        {val:'adherente'     , label:'Adherente'},
    ],

    userHomeOptionList:[
        {val:'no_definido'                  , label:'Locación de Inicio'},
        {val:'procedencias:list'            , label:'navegar/procedencias'},
        {val:'solicitudes:list'             , label:'navegar/solicitudes'},
        {val:'productos:list'               , label:'navegar/productos'},
        {val:'gestion:comprobantes:list'    , label:'gestion/comprobantes'},
        {val:'sisplan:acciones:list'        , label:'sisplan/acciones'},
        {val:'studio:producciones:list'     , label:'studio/producciones'},
        {val:'mica:rondas'				     , label:'mica2015/rondas'},
    ],

    userStatusOptionList:[
        {val:'activo'        , label:'activo'},
        {val:'pendaprobacion', label:'pend aprobacion'},
        {val:'pendmail'      , label:'pend verif mail'},
        {val:'suspendido'    , label:'suspendido'},
        {val:'inactivo'      , label:'inactivo'},
        {val:'baja'          , label:'baja'},
    ],

    userRolesOptionList: [
        {val:'no_definido'    , label:'Roles'},
        {val:'administrador'  , label:'administrador'},
        {val:'productor'      , label:'productor'},
        {val:'tecnico'        , label:'tecnico'},
        {val:'catalogador'    , label:'catalogador'},
        {val:'visualizador'   , label:'visualizador'},
        {val:'adherente'      , label:'adherente'},
    ],

    tipoBrandingOptionList: [
        {val:'no_definido'      , label:'tipo de archivo'},
        {val:'imagen_web'       , label:'Imagen Web'},
        {val:'proxy_video'      , label:'Proxy video'},
    ],
    
    rolBrandingOptionList: [
        {val:'no_definido'      , label:'destino'},
        {val:'principal'        , label:'principal'},
        {val:'carousel'         , label:'carousel'},
        {val:'destacado'        , label:'destacado'},
        {val:'perfil'           , label:'perfil'},
        {val:'visualizacion'    , label:'visualizacion'},
    ],

    notasexecutionOptionList: [
        {val:'no_definido' , label:'Nivel de ejecución'},
        {val:'planificada' , label:'planificada'},
        {val:'preparada'   , label:'preparada'},
        {val:'publicada'   , label:'publicada'},
        {val:'archivo'     , label:'archivada'},
    ],
    
    notasOptionList: [
        {val:'nota'          , label:'nota'},
        {val:'visualizacion' , label:'visualización'},
        {val:'premio'        , label:'premio'},
        {val:'gacetilla'     , label:'gacetilla'},
        {val:'publicacion'   , label:'publicación'},
        {val:'informacion'   , label:'información'},
        {val:'portal'        , label:'portal'},
    ],

    contactoOL: [
        {val:'mail'        , label:'email'},
        {val:'telefono'    , label:'teléfono'},
        {val:'direccion'   , label:'dirección'},
        {val:'web'         , label:'web'},
        {val:'informacion' , label:'información'},
    ],

    tipocontactoOL:{
        mail: [
            {val:'principal'  , label:'principal'},
            {val:'trabajo'    , label:'trabajo'},
            {val:'personal'   , label:'personal'},
            {val:'otro'       , label:'otro'},
        ],
        telefono: [
            {val:'principal'   , label:'principal'},
            {val:'celular'     , label:'celular'},
            {val:'trabajo'     , label:'trabajo'},
            {val:'fax'         , label:'fax'},
            {val:'particular'  , label:'particular'},
            {val:'pager'       , label:'pager'},
            {val:'skype'       , label:'skype'},
            {val:'googlevoice' , label:'googlevoice'},
            {val:'otro'        , label:'otro'},
        ],
        direccion: [
            {val:'principal'  , label:'principal'},
            {val:'trabajo'    , label:'trabajo'},
            {val:'sede'       , label:'sede'},
            {val:'deposito'   , label:'depósito'},
            {val:'sala'       , label:'sala'},
            {val:'pagos'      , label:'pagos'},
            {val:'cobranza'   , label:'cobranza'},
            {val:'particular' , label:'particular'},
            {val:'locacion'   , label:'locación'},
            {val:'otro'       , label:'otro'},
        ],
        web: [
            {val:'principal'  , label:'principal'},
            {val:'trabajo'    , label:'trabajo'},
            {val:'perfil'     , label:'perfil'},
            {val:'blog'       , label:'blog'},
            {val:'personal'   , label:'personal'},
            {val:'otro'       , label:'otro'},
        ],
        informacion: [
            {val:'cumple'      , label:'cumpleaños'},
            {val:'aniversario' , label:'aniversario'},
            {val:'cierre'      , label:'cierre'},
            {val:'otro'        , label:'otro'},
        ],
    },

    versionOptionList: [
    ],

    resolucionOptionList: [
        {val:'no_definido' , label:'Resolución'},
        {val:'1920x1080'   , label:'1920x1080'},
        {val:'1440x1080'   , label:'1440x1080'},
        {val:'1280x720'    , label:'1280x720'},
        {val:'1280x720p'   , label:'1280x720p'},
        {val:'1024x576'    , label:'1024x576'},
        {val:'720x576'     , label:'720x576'},
        {val:'720x480'     , label:'720x480'},
        {val:'Otro'        , label:'Otro'},
    ],

    sopentregaOptionList: [
        {val:'no_definido' , label:'Soporte de entrega'},
        {val:'HD'          , label:'HD externo'},
        {val:'Blue-ray'    , label:'Blue-ray'},
        {val:'Tape'        , label:'Tape'},
        {val:'DVD'         , label:'DVD'},
        {val:'ftp'         , label:'ftp'},
        {val:'transfer'    , label:'Transfer'},
        {val:'Otro'        , label:'Otro'},
    ],

    aspectratioOptionList: [
        {val:'no_definido' , label:'Relación de aspecto'},
        {val:'16_9'        , label:'16:9'},
        {val:'4_3'         , label:'4:3'},
        {val:'2_1'         , label:'2:1'},
        {val:'240_1'       , label:'2.40:1'},
        {val:'Otro'        , label:'Otro'},
    ],

    audiocontentOptionList: [
        {val:'no_definido'    , label:'Contenido'},
        {val:'fullmix'        , label:'Full Mix'},
        {val:'musicayefectos' , label:'Musica y Efectos'},
        {val:'musica'         , label:'Música'},
        {val:'efectos'        , label:'Efectos'},
        {val:'dialogos'       , label:'Diálogos'},
        {val:'voiceover'      , label:'Voice Over'},
        {val:'mudo'           , label:'Mudo'},
        {val:'mixminus'       , label:'Mix Minus'},
    ],
    audiocanalOptionList: [
        {val:'no_definido'  , label:'Canal'},
        {val:'mono'         , label:'Mono'},
        {val:'stereoder'    , label:'Stereo Der'},
        {val:'stereoizq'    , label:'Stereo Izq'},
    ],

    formatooriginalOptionList: [
        {val:'no_definido'  , label:'formato original'},
        {val:'QuickTime'    , label:'QuickTime'},
        {val:'MXFOP1A'      , label:'MXF op1A'},
        {val:'HDCAM'        , label:'HDCAM'},
        {val:'DigiBeta'     , label:'Digi Beta'},
        {val:'XDCAMBD'      , label:'XDCAM-BD'},
        {val:'ArchDigital'  , label:'Archivo digital'},
        {val:'MiniDV'       , label:'Mini DV'},
        {val:'HDV'          , label:'HDV'},
        {val:'Otro'         , label:'Otro'},
    ],
 
    codecOptionList: [
        {val:'no_definido'       , label:'no_definido'},
        {val:'AVC-Intra100422'   , label:'AVC-Intra 100 High 422'},
        {val:'AvidMPEG30'        , label:'Avid MPEG 30'},
        {val:'AppleProRes422HQ'  , label:'Apple ProRes 422 SQ'},
        {val:'AppleProRes422SQ'  , label:'Apple ProRes 422 HQ'},
        {val:'IMX30'             , label:'IMX30'},
        {val:'XDCAMHD50'         , label:'XDCAM HD 50'},
        {val:'DnxHD120'          , label:'Dnx HD 120'},
        {val:'DnxHD185'          , label:'Dnx HD 185'},
    ],

    framerateOptionList: [
        {val:'no_definido' , label:'Frame Rate'},
        {val:'24p'     , label:'24p'},
        {val:'25p'     , label:'25p'},
        {val:'30p'     , label:'30p'},
        {val:'50i'     , label:'50i'},
        {val:'60i'     , label:'60i'},
        {val:'23976p'  , label:'29.76p'},
        {val:'2997p'   , label:'29.97p'},
    ],

    tipovideoOptionList: [
        {val:'no_definido'      , label:'tipo de instancia'},
        {val:'high_res'         , label:'alta resolución'},
        {val:'low_res'          , label:'baja resolución'},
    ],

    tipoproductoOptionList:[
        {val:'nodefinido',   label:'tipo de producto'},
        {val:'paudiovisual', label:'producto audiovisual'},
        {val:'micro',        label:'micro'},
        {val:'catalogo',     label:'catálogo'},
        {val:'promo',        label:'promo'},
        {val:'imagen',       label:'imagen'},
        {val:'video',        label:'video'},
        {val:'audio',        label:'audio'},
        {val:'documento',    label:'documento'},
     ],

    rolinstanciasOptionList: [
        {val:'no_definido'      , label:'versión'},
        {val:'masteraire'        , label:'Master Aire'},
        {val:'mastertextless'    , label:'Master Text-less'},
        {val:'matpromocion'      , label:'Material de promoción'},
        {val:'grafica'           , label:'Gráfica'},
        {val:'planosdeseguridad' , label:'Planos de seguridad'},
        {val:'capituloprueba'    , label:'Capitulos de prueba'},
        {val:'trailer'           , label:'trailer'},
        {val:'audio_principal'   , label:'audio principal'},
        {val:'audio_ambiente'    , label:'audio ambiente'},
        {val:'audio_descripcion' , label:'audio descripcion'},
        {val:'branding'          , label:'branding'},
        {val:'script'            , label:'script'},
    ],

    tipoinstanciaOptionList:[
        {val:'no_definido',  label:'Ingrese opción'},
        {val:'video',        label:'video'},
        {val:'imagen',       label:'imagen'},
        {val:'audio',        label:'audio'},
        {val:'documento',    label:'documento'},
    ],
    rolinstanciasGroup: {
        no_definido:[
            {val:'no_definido'       , label:'Ingrese opción'},
        ],
        video: [
            {val:'masteraire'        , label:'Master Aire'},
            {val:'mastertextless'    , label:'Master Text-less'},
            {val:'matpromocion'      , label:'Material de promoción'},
            {val:'planosdeseguridad' , label:'Planos de seguridad'},
            {val:'capituloprueba'    , label:'Capitulos de prueba'},
            {val:'trailer'           , label:'trailer'},
            {val:'branding'          , label:'branding'},
        ],
        imagen: [
            {val:'grafica'           , label:'Gráfica'},
            {val:'matpromocion'      , label:'Material de promoción'},
        ],
        audio:[
            {val:'audio_principal'   , label:'audio principal'},
            {val:'audio_ambiente'    , label:'audio ambiente'},
            {val:'audio_descripcion' , label:'audio descripcion'},
        ],
        documento:[
            {val:'script'            , label:'script'},
        ]
    },

    nivelimportanciaOptionList:[
        {val:'bajo',    label:'bajo'},
        {val:'medio',   label:'medio'},
        {val:'alto',    label:'alto'},
        {val:'critico', label:'crítico'},
    ],

    estadoaltaOptionList:[
        {val:'activo',       label:'activo'},
        {val:'distribucion', label:'activo p/distribución'},
        {val:'suspendido',   label:'suspendido'},
        {val:'cerrado',      label:'cerrado'},
        {val:'baja',         label:'baja'},
    ],

    emphasisDocumOptionList:[
        {val:'no_definido',  label:''},
        {val:'baja'      , label:'text-success'},
        {val:'media'     , label:'text-info'},
        {val:'alta'      , label:'text-warning'},
        {val:'urgente'   , label:'text-danger'},
        {val:'cumplido'  , label:'text-muted'},
        {val:'suspendido', label:'text-muted'},
        {val:'anulado'   , label:'text-muted'},
    ],

    getUrgenciaButtonType: function(cumplido, prioridad, estado){
        if(cumplido) return 'disabled';
        if(estado==='noaplica'|| estado === 'ok' || estado === 'failed') return 'disabled';

        return this.urgenciaButtonType[prioridad];
    },

    urgenciaButtonType:{
        baja:     'btn-info',
        media:    'btn-success',
        alta:     'btn-warning',
        urgente:  'btn-danger',
    },

    urgenciaTextColor:{
        //primary: 006dcc
        baja:     'color:#3a87ad;', // 
        media:    'color:#468847;', //#468847;
        alta:     'color:#c09853;', //  color: #c09853; #faa732
        urgente:  'color:#da4f49;', // da4f49
    },

    urgenciaList:['baja', 'media', 'alta', 'urgente'],

    urgenciaOptionList:[
        {val:'no_requerido',  label:'No requerida'},
        {val:'todas'     , label:'Todas'},
        {val:'baja'      , label:'Baja'},
        {val:'media'     , label:'Media'},
        {val:'alta'      , label:'Alta'},
        {val:'urgente'   , label:'Urgente'},
    ],
    
    estadodocumOptionList: [
        {val:'no_definido',  label:'Estado - prioridad'},
        {val:'baja'      , label:'Baja'},
        {val:'media'     , label:'Media'},
        {val:'alta'      , label:'Alta'},
        {val:'urgente'   , label:'Urgente'},
        {val:'cumplido'  , label:'CUMPLIDO'},
        {val:'suspendido', label:'Suspenedido'},
        {val:'anulado'   , label:'Anulado'},
    ],

    videotecaOptionList:[
        {val:'nodefinido',     label:'Videoteca'},
        {val:'fomInca2010',    label:'Fomento Inca 2010'},
        {val:'fomInca2011',    label:'Fomento Inca 2011'},
        {val:'cesInca',        label:'Fomento Inca Termin'},
        {val:'cesEncuentro', label:'Fomento Encuentro Termin'},
        {val:'coprodEncuentro', label:'Fomento Encuentro Coprod'},
        {val:'fomCIN',       label:'Fomento CIN'},
        {val:'polos',        label:'Polos audiov tecnológicos'},
        {val:'acuaf',        label:'Acua Federal'},
        {val:'acuam',        label:'Acua Mayor'},
        {val:'cda',          label:'CDA'},
        {val:'icultural',    label:'Igualdad Cultural'},
        {val:'cesiones',     label:'Cesiones recibidas'}, 
        {val:'adquisiciones',label:'Adquisiciones'},
        {val:'ppropia',      label:'Producción propia'},
        {val:'coproduccion', label:'Coproducción'},
        {val:'pademanda',    label:'Producción por demanda'},
        {val:'nocedida',     label:'No cedida'},
        {val:'vinstitucional',label:'Video Institucional'},
        {val:'promo',        label:'Mat Promociones'},
        {val:'branding',     label:'Mat Branding'},
        {val:'catalogo',     label:'Catálogo BACUA'},
    ],

    paimportanciaOptionList:[
        {val:'no_definido',  label:'Nivel de relevancia'},
        {val:'baja'      , label:'Baja'},
        {val:'media'     , label:'Media'},
        {val:'alta'      , label:'Alta'},
        {val:'urgente'   , label:'Urgente'},
    ],
    paexecutionOrderList:[
        'no_definido',
        'planificado',
        'gestion',
        'recibido',
        'chequeado',
        'qcalidad',
        'catalogacion',
        'observado',
        'rechazado',
        'aprobado',
        'preservado', 
        'requisicion',
        'distribucion',
        'emision',
    ],

    paexecutionOptionList:[
        {val:'no_definido', label:'-nivel de ejecución-', pending: 'no_definido', result:'ok'},
        {val:'planificado', label:'planificado',  pending: 'no_definido',    result:'ok'},
        {val:'gestion',     label:'en gestión',   pending: 'no_definido',    result:'ok'},
        {val:'recibido',    label:'recibido',     pending: 'recepcion',    result:'ok'},
        {val:'chequeado',   label:'chequeado',    pending: 'chequeo',      result:'ok'},
        {val:'qcalidad',    label:'ctrl calidad', pending: 'qcalidad',     result:'ok'},
        {val:'catalogacion',label:'catalogacion', pending: 'catalogacion', result:'ok'},
        {val:'observado',   label:'observado',    pending: 'aprobacion',   result:'failed'},
        {val:'rechazado',   label:'rechazado',    pending: 'aprobacion',   result:'failed'},
        {val:'aprobado',    label:'aprobado',     pending: 'aprobacion',   result:'ok'},
        {val:'preservado',  label:'preservado',   pending: 'preservacion', result:'ok'},
        {val:'requisicion', label:'requisición',  pending: 'requisicion',  result:'ok'},
        {val:'distribucion',label:'distribución', pending: 'distribucion', result:'ok'},
        {val:'emision',     label:'emisión',      pending: 'emision',      result:'ok'},
     ],

    papendingsOptionList:[
        {val:'recepcion',    label:'Recepción'},
        {val:'chequeo',      label:'Chequeo'},
        {val:'qcalidad',     label:'CtrlCalidad'},
        {val:'catalogacion', label:'Catalog'},
        {val:'aprobacion',   label:'Aprobación'},
        {val:'preservacion', label:'Preservacion'},
        {val:'requisicion',  label:'Requisición'},
        {val:'distribucion', label:'Distribución'},
        {val:'emision',      label:'Emisión'},
    ],

    papendingsLabels:{
        recepcion:    'Recepción',
        chequeo:      'Chequeo',
        qcalidad:     'CtrlCalidad',
        catalogacion: 'Catalog',
        aprobacion:   'Aprobación',
        preservacion: 'Preservacion',
        requisicion:  'Requisición',
        distribucion: 'Distribución',
        emision:      'Emisión',
    },

    pendingsDependsOn:{
        recepcion:[],
        chequeo: ['recepcion'],
        qcalidad: ['recepcion'],
        catalogacion: ['recepcion', 'chequeo'],
        aprobacion: ['recepcion', 'chequeo', 'qcalidad'],
        preservacion: ['recepcion', 'chequeo', 'qcalidad'],
        requisicion: ['aprobacion'],
        distribucion: ['aprobacion'],
        emision: ['distribucion'],
    },
    //pageneros:['animacion', 'biografia', 'curso', 'ficcion', 'docuficcion', 'documental', 'entretenimiento', 'entrevistas', 'telenovela', 'reality', 'recital', 'periodistico', 'noticiero',],
    generoOptionList:[
        {val:'nodefinido',   label:'Género'},
        {val:'animacion',    label:'Animación'},
        {val:'biografia',    label:'Biografía'},
        {val:'crossmedia',   label:'Crossmedia'},
        {val:'curso',        label:'Curso'},
        {val:'debate',       label:'Debate'},
        {val:'deportivo',    label:'Deportivo'},
        {val:'didactico',    label:'Didáctico'},
        {val:'docuficcion',  label:'Docuficción'},
        {val:'documental',   label:'Documental'},
        {val:'educativo',    label:'Educativo'},
        {val:'entretenimiento', label:'Entretenimiento'},
        {val:'entrevista',   label:'Entrevista'},
        {val:'experimental', label:'Experimental'},
        {val:'ficcion',      label:'Ficción'},
        {val:'infantil',     label:'Infantil'},
        {val:'informativo',  label:'Informativo'},
        {val:'musical',      label:'Musical'},
        {val:'noticiero',    label:'Noticiero'},
        {val:'periodistico', label:'Periodístico'},
        {val:'reality',      label:'Reality'},
        {val:'telenovela',   label:'Telenovela'},
        {val:'videoclip',    label:'Videoclip'},
        {val:'videoregistro',label:'Videoregistro'},
        {val:'crudos',       label:'Crudos'},
    ],

    //patematicas: ['artecultura','cienciaTecnologia','cienciasSociales','deporte','educacionTrabajo','historia','infancia','juventud','sociedad','ficcion'],
    tematicasOptionList:[
        {val:'nodefinido',   label:'Temáticas'},
        {val:'artecultura',  label:'Arte y cultura'},
        {val:'gastronomia',  label:'Gastronomía'},
        {val:'ecologia',     label:'Ecología'},
        {val:'educacion',    label:'Educación'},
        {val:'deporte',      label:'Deporte'},
        {val:'historia',     label:'Historia'},
        {val:'humor',        label:'Humor'},
        {val:'viajes',       label:'Viajes'},
        {val:'infancia',     label:'Infancia'},
        {val:'sociedad',     label:'Sociedad'},
        {val:'cienciaTecnologia', label:'Ciencia y Tecnología'},
        {val:'cienciasSociales',  label:'Ciencias Sociales'},
    ],
/* 
   pasubtematica: {
        artecultura: ['musica', 'plastica', 'fotografia', 'arteDigital', 'video', 'teatro', 'animacion', 'otros' ],
        cienciaTecnologia: ['astronomia', 'fisica', 'matematica', 'quimica','otros'],
        cienciasSociales: ['antropologia', 'historia', 'sociologia', 'economia', 'politica', 'otros'],
        deporte: ['historiaDeporte', 'actualidadDeporte', 'deporteAmateur', 'deporteProfesional','otros'],
        educacionTrabajo:['educSexual', 'primerosAuxilios', 'educRural', 'oficios', 'debateEducativo','otros' ],
        historia: ['universal', 'ArgentinaSXX', 'ArgentinaSXiX', 'biografia','otros'],
        infancia: ['pedagogia', 'recreacion', 'curricula','otros'],
        juventud: ['pedagogia', 'recreacion', 'curricula','otros'],
        sociedad: ['gastronomia', 'ddhh', 'familia', 'respSocial', 'salud','otros' ],
        ficcion: ['novela', 'thriller', 'drama', 'comedia', 'accion','otros' ],
    },
*/
    subtematicasOptionList:{        
        artecultura:[
            {val:'nodefinido',     label:'No definido'},
            {val:'literatura',     label:'Literatura'},
            {val:'musica',         label:'Música'},
            {val:'plastica',       label:'Plástica'},
            {val:'arquitectura',   label:'Arquitectura'},
            {val:'disenio',        label:'Diseño'},
            {val:'danza',          label:'Danza'},
            {val:'areadigital',    label:'Área digital'},
            {val:'fotografia',     label:'Fotografía'},
            {val:'cinematografia', label:'Cinematografía'},
            {val:'video',          label:'Video'},
            {val:'teatro',         label:'Teatro'},
            {val:'animacion',      label:'Animación'},
            {val:'historieta',     label:'Historieta'},
            {val:'artesvisuales',  label:'Artesvisuales'},
            {val:'ocio',           label:'Ocio'},
            {val:'religion',       label:'Religión'},
            {val:'museos',         label:'Museos'},
            {val:'artesescenicas', label:'Artes escénicas'},
        ],
        gastronomia:[
            {val:'nodefinido',     label:'No definido'},
            {val:'cocina',  label:'Cocina'},
            {val:'recetas', label:'Recetas'},
        ],
        ecologia:[
            {val:'nodefinido',     label:'No definido'},
            {val:'medioambiente',        label:'Medio ambiente'},
            {val:'polucion',             label:'Polución'},
            {val:'recursosnaturales',    label:'Recursos naturales'},
            {val:'energiasalternativas', label:'Energías alternativas'},
        ],
        educacion:[
            {val:'nodefinido',     label:'No definido'},
            {val:'edudistancia',   label:'Educ a distancia'},
            {val:'edurural',       label:'Educ rural'},
            {val:'edusexual',      label:'Educ sexual'},
            {val:'edutecnica',     label:'Educ técnica'},
            {val:'eduvial',        label:'Educ vial'},
            {val:'seguridadsalud', label:'Seguridad y salud'},
            {val:'primauxilios',   label:'Primeros auxilios'},
            {val:'aprendizaje',    label:'Aprendizaje'},
            {val:'oficios',        label:'Oficios'},
            {val:'escuelas',       label:'Escuelas'},
            {val:'debateeducativo',label:'Debate Educativo'},
            {val:'politicaeducativa',label:'Política Educativa'},
            {val:'ensenyformacion',label:'Enseñanza y Formación'},
            {val:'idiomas',        label:'Idiomas'},
        ],
        deporte:[
            {val:'nodefinido',     label:'No definido'},
            {val:'historiadep',    label:'Historia del deporte'},
            {val:'actualdep',      label:'Actualidad deportiva'},
            {val:'depamateur',     label:'Deporte amateur'},
            {val:'depprofesional', label:'Deporte profesional'},
        ],
        historia:[
            {val:'nodefinido',     label:'No definido'},
            {val:'biografias', label:'Biografías'},
            {val:'huniversal', label:'Historia universal'},
            {val:'hlatinoamericana', label:'Historia latinoamericana'},
            {val:'hargentina', label:'Historia argentina'},
            {val:'hpolitica',  label:'Historia política'},
            {val:'heconomica', label:'Historia económica'},
        ],
        humor:[
            {val:'nodefinido',     label:'No definido'},
            {val:'humoristico', label:'Humorístico'},
        ],
        viajes:[
            {val:'nodefinido',     label:'No definido'},
            {val:'turismo', label:'Turismo'},
        ],
        infancia:[
            {val:'nodefinido',     label:'No definido'},
            {val:'pedagogia',  label:'Pedagogía'},
            {val:'recreacion', label:'Recreación'},
            {val:'curricula',  label:'Currícula'},
        ],
        sociedad:[
            {val:'nodefinido',     label:'No definido'},
            {val:'derhumanos', label:'Derechos humanos'},
            {val:'familia',    label:'Familia'},
            {val:'respsocial', label:'Responsabilidad Social'},
            {val:'salud',      label:'Salud'},
            {val:'inclusion',  label:'Inclusión'},
            {val:'genero',     label:'Género'},
            {val:'etnicas',    label:'Cuestiones Étnicas'},
            {val:'relinternacionales', label:'Rel Internacionales'},
            {val:'bienestar',  label:'Acción Social - Bienestar'},
            {val:'gobierno',   label:'Gobierno'},
            {val:'vcotidiana', label:'Vida Cotidiana'},
        ],
        cienciaTecnologia:[
            {val:'nodefinido',     label:'No definido'},
            {val:'astronomia',    label:'Astronomía'},
            {val:'fisica',        label:'Física'},
            {val:'matematicas',   label:'Matemática'},
            {val:'estadistica',   label:'Estadística'},
            {val:'quimica',       label:'Química'},
            {val:'tecnologia',    label:'Tecnología'},
            {val:'tic',           label:'Tecnol Inform y Comunicación'},
            {val:'innovacion',    label:'Innovación'},
            {val:'nuevastecnol',  label:'Nuevas tecnologías'},
            {val:'ciencia',       label:'Ciencia'},
            {val:'cientierra',    label:'Cs de la tierra'},
            {val:'ciennaturales', label:'Cs Naturales'},
            {val:'cienmedicas',   label:'Cs Médicas'},
            {val:'cienambientales', label:'Cs Ambientales'},
            {val:'meteorologia',  label:'Meteorología'},
            {val:'catastrofes',   label:'Catástrofes'},
            {val:'biologia',      label:'Biología'},
            {val:'geologia',      label:'Geología'},
            {val:'ingenieria',    label:'Ingeniería'},
            {val:'industria',     label:'Industria'},
            {val:'agricultura',   label:'Agricultura'},
        ],
        cienciasSociales:[
            {val:'nodefinido',     label:'No definido'},
            {val:'derecho',      label:'Derecho'},
            {val:'antropologia', label:'Antropología'},
            {val:'cieninformacion', label:'Cs de la Información'},
            {val:'filosofia',    label:'Filosofía'},
            {val:'comunicacion', label:'Comunicación'},
            {val:'medios',       label:'Medios'},
            {val:'sociologia',   label:'Sociología'},
            {val:'economia',     label:'Economía'},
            {val:'psicologia',   label:'Psicología'},
            {val:'geografia',    label:'Geografía'},
            {val:'oceanografia', label:'Oceanografía'},
            {val:'politica',     label:'Política'},
            {val:'arqueologia',  label:'Arqueología'},
        ],
    },

    //paformatos:['serie', 'serie-programas', 'unitario', 'videoclip', 'promo', 'miniserie', 'micro', 'micro-recital', 'cortometraje', 'largometraje', 'backstage','trailer',  'noticiero', 'periodistico', 'especial', ],
    formatoOptionList:[
        {val:'nodefinido',    label:'Formato'},
        {val:'serie',         label:'Serie'},
        {val:'micros',        label:'Serie de micros'},
        {val:'unitario',      label:'Unitario'},
        {val:'cortometraje',  label:'Cortometraje'},
        {val:'largometraje',  label:'Largometraje'},
        {val:'micro',         label:'Micro'},
        {val:'backstage',     label:'Backstage'},
        {val:'promo',         label:'Promo'},
        {val:'recital',       label:'Recital'},
        {val:'videoclip',     label:'Videoclip'},
        {val:'videoregistro', label:'Videoregistro'},
    ],
    //etarios:['infantil', 'jovenes','adolescentes', 'adulto', 'mayores',],
    etarioOptionList:[
        {val:'nodefinido',   label:'Tipo de audiencia'},
        {val:'infantil',     label:'Infantil'},
        {val:'jovenes',      label:'Jóvenes'},
        {val:'adolescentes', label:'Adolescentes'},
        {val:'adulto',       label:'Adultos'},
        {val:'mayores',      label:'Tercera edad'},
        {val:'general',      label:'Público en general'},
        {val:'soloadultos',  label:'Sólo adultos'},
    ],

    dayweek:[ 'Lunes','Martes','Miércoles','Jueves','Viernes','Sábado','Domingo'],

    hourOptionList:[
        {val:'horario', label:'Horario emisión'},
        {val:'noem', label:'No se emite'},
        {val:'04:00', label:'04:00'},
        {val:'04:30', label:'04:30'},
        {val:'05:00', label:'05:00'},
        {val:'05:30', label:'05:30'},
        {val:'06:00', label:'06:00'},
        {val:'06:30', label:'06:30'},
        {val:'07:00', label:'07:00'},
        {val:'07:30', label:'07:30'},
        {val:'08:00', label:'08:00'},
        {val:'08:30', label:'08:30'},
        {val:'09:00', label:'09:00'},
        {val:'09:30', label:'09:30'},
        {val:'10:00', label:'10:00'},
        {val:'10:30', label:'10:30'},
        {val:'11:00', label:'11:00'},
        {val:'11:30', label:'11:30'},
        {val:'12:00', label:'12:00'},
        {val:'12:30', label:'12:30'},
        {val:'13:00', label:'13:00'},
        {val:'13:30', label:'13:30'},
        {val:'14:00', label:'14:00'},
        {val:'14:30', label:'14:30'},
        {val:'15:00', label:'15:00'},
        {val:'15:30', label:'15:30'},
        {val:'16:00', label:'16:00'},
        {val:'16:30', label:'16:30'},
        {val:'17:00', label:'17:00'},
        {val:'17:30', label:'17:30'},
        {val:'18:00', label:'18:00'},
        {val:'18:30', label:'18:30'},
        {val:'19:00', label:'19:00'},
        {val:'19:30', label:'19:30'},
        {val:'20:00', label:'20:00'},
        {val:'20:30', label:'20:30'},
        {val:'21:00', label:'21:00'},
        {val:'21:30', label:'21:30'},
        {val:'22:00', label:'22:00'},
        {val:'22:30', label:'22:30'},
        {val:'23:00', label:'23:00'},
        {val:'23:30', label:'23:30'},
        {val:'00:00', label:'00:00'},
        {val:'00:30', label:'00:30'},
        {val:'01:00', label:'01:00'},
        {val:'01:30', label:'01:30'},
        {val:'02:00', label:'02:00'},
        {val:'02:30', label:'02:30'},
        {val:'03:00', label:'03:00'},
        {val:'03:30', label:'03:30'},
    ],
    paisesOptionList: [
        {val:'nodefinido'    , label:'PAIS PRODUCTOR'},
        {val:'Argentina'     , label:'Argentina'},
        {val:'Bolivia'       , label:'Bolivia'},
        {val:'Brasil'        , label:'Brasil'},
        {val:'Chile'         , label:'Chile'},
        {val:'Colombia'      , label:'Colombia'},
        {val:'Uruguay'       , label:'Uruguay'},
        {val:'Venezuela'     , label:'Venezuela'},
        {val:'Ecuador'       , label:'Ecuador'},
        {val:'Peru'          , label:'Peru'},
        {val:'Paraguay'      , label:'Paraguay'},
        {val:'Mexico'        , label:'Mexico'},
        {val:'Estadosunidos' , label:'Estados unidos'},
        {val:'Canada'        , label:'Canada'},
        {val:'Espana'        , label:'España'},
        {val:'Francia'       , label:'Francia'},
        {val:'Europa'        , label:'Europa'},
    ],

    provinciasOptionList:{
        Argentina: [
            {val:'CABA'       , label:'CABA'},
            {val:'BuenosAires', label:'Buenos Aires'},
            {val:'Cordoba'    , label:'Córdoba'},
            {val:'SantaFe'    , label:'Santa Fe'},
            {val:'Corrientes' , label:'Corrientes'},
            {val:'Misiones'   , label:'Misiones'},
            {val:'EntreRios'  , label:'Entre Rios'},
            {val:'SantiagoDelEstero'  , label:'Santiago del Estero'},
            {val:'Formosa'    , label:'Formosa'},
            {val:'Chaco'      , label:'Chaco'},
            {val:'Tucuman'    , label:'Tucumán'},
            {val:'Jujuy'      , label:'Jujuy'},
            {val:'Salta'      , label:'Salta'},
            {val:'LaRioja'    , label:'La Rioja'},
            {val:'Catamarca'  , label:'Catamarca'},
            {val:'SanJuan'    , label:'San Juan'},
            {val:'Mendoza'    , label:'Mendoza'},
            {val:'SanLuis'    , label:'San luis'},
            {val:'LaPampa'    , label:'La Pampa'},
            {val:'RioNegro'   , label:'Rio Negro'},
            {val:'Neuquen'    , label:'Neuquen'},
            {val:'Chubut'     , label:'Chubut'},
            {val:'SantaCruz'  , label:'Santa Cruz'},
            {val:'TierraDelFuego', label:'Tierra del Fuego'},
        ],
        nodefinido: [
            {val:'nodefinido'  , label:'Estado/provincia'},
        ]
    },   
	
		paisesOptionList:{
        Paises: [
						{val:'AR' , label:'Argentina'},
						{val:'AF' , label:'Afganistán'},
						{val:'AL' , label:'Albania'},
						{val:'DE' , label:'Alemania'},
						{val:'AD' , label:'Andorra'},
						{val:'AO' , label:'Angola'},
						{val:'AI' , label:'Anguilla'},
						{val:'AQ' , label:'Antártida'},
						{val:'AG' , label:'Antigua y Barbuda'},
						{val:'AN' , label:'Antillas Holandesas'},
						{val:'SA' , label:'Arabia Saudí'},
						{val:'DZ' , label:'Argelia'},
						{val:'AM' , label:'Armenia'},
						{val:'AW' , label:'Aruba'},
						{val:'AU' , label:'Australia'},
						{val:'AT' , label:'Austria'}, 
						{val:'AZ' , label:'Azerbaiyán'}, 
						{val:'BS' , label:'Bahamas'}, 
						{val:'BH' , label:'Bahrein'}, 
						{val:'BD' , label:'Bangladesh'}, 
						{val:'BB' , label:'Barbados'}, 
						{val:'BE' , label:'Bélgica'}, 
						{val:'BZ' , label:'Belice'}, 
						{val:'BJ' , label:'Benin'}, 
						{val:'BM' , label:'Bermudas'}, 
						{val:'BY' , label:'Bielorrusia'}, 
						{val:'MM' , label:'Birmania'}, 
						{val:'BO' , label:'Bolivia'}, 
						{val:'BA' , label:'Bosnia y Herzegovina'}, 
						{val:'BW' , label:'Botswana'}, 
						{val:'BR' , label:'Brasil'}, 
						{val:'BN' , label:'Brunei'}, 
						{val:'BG' , label:'Bulgaria'}, 
						{val:'BF' , label:'Burkina Faso'}, 
						{val:'BI' , label:'Burundi'}, 
						{val:'BT' , label:'Bután'}, 
						{val:'CV' , label:'Cabo Verde'}, 
						{val:'KH' , label:'Camboya'}, 
						{val:'CM' , label:'Camerún'}, 
						{val:'CA' , label:'Canadá'}, 
						{val:'TD' , label:'Chad'}, 
						{val:'CL' , label:'Chile'}, 
						{val:'CN' , label:'China'}, 
						{val:'CY' , label:'Chipre'}, 
						{val:'VA' , label:'Ciudad del Vaticano (Santa Sede)'}, 
						{val:'CO' , label:'Colombia'}, 
						{val:'KM' , label:'Comores'}, 
						{val:'CG' , label:'Congo'}, 
						{val:'CD' , label:'Congo, República Democrática del'}, 
						{val:'KR' , label:'Corea'}, 
						{val:'KP' , label:'Corea del Norte'}, 
						{val:'CI' , label:'Costa de Marfíl'}, 
						{val:'CR' , label:'Costa Rica'}, 
						{val:'HR' , label:'Croacia (Hrvatska)'}, 
						{val:'CU' , label:'Cuba'}, 
						{val:'DK' , label:'Dinamarca'}, 
						{val:'DJ' , label:'Djibouti'}, 
						{val:'DM' , label:'Dominica'}, 
						{val:'EC' , label:'Ecuador'}, 
						{val:'EG' , label:'Egipto'}, 
						{val:'SV' , label:'El Salvador'}, 
						{val:'AE' , label:'Emiratos Árabes Unidos'}, 
						{val:'ER' , label:'Eritrea'}, 
						{val:'SI' , label:'Eslovenia'}, 
						{val:'ES' , label:'España'}, 
						{val:'US' , label:'Estados Unidos'}, 
						{val:'EE' , label:'Estonia'}, 
						{val:'ET' , label:'Etiopía'}, 
						{val:'FJ' , label:'Fiji'}, 
						{val:'PH' , label:'Filipinas'}, 
						{val:'FI' , label:'Finlandia'}, 
						{val:'FR' , label:'Francia'}, 
						{val:'GA' , label:'Gabón'}, 
						{val:'GM' , label:'Gambia'}, 
						{val:'GE' , label:'Georgia'}, 
						{val:'GH' , label:'Ghana'}, 
						{val:'GI' , label:'Gibraltar'}, 
						{val:'GD' , label:'Granada'}, 
						{val:'GR' , label:'Grecia'}, 
						{val:'GL' , label:'Groenlandia'}, 
						{val:'GP' , label:'Guadalupe'}, 
						{val:'GU' , label:'Guam'}, 
						{val:'GT' , label:'Guatemala'}, 
						{val:'GY' , label:'Guayana'}, 
						{val:'GF' , label:'Guayana Francesa'}, 
						{val:'GN' , label:'Guinea'}, 
						{val:'GQ' , label:'Guinea Ecuatorial'}, 
						{val:'GW' , label:'Guinea-Bissau'}, 
						{val:'HT' , label:'Haití'}, 
						{val:'HN' , label:'Honduras'}, 
						{val:'HU' , label:'Hungría'}, 
						{val:'IN' , label:'India'}, 
						{val:'ID' , label:'Indonesia'}, 
						{val:'IQ' , label:'Irak'}, 
						{val:'IR' , label:'Irán'}, 
						{val:'IE' , label:'Irlanda'}, 
						{val:'BV' , label:'Isla Bouvet'}, 
						{val:'CX' , label:'Isla de Christmas'}, 
						{val:'IS' , label:'Islandia'}, 
						{val:'KY' , label:'Islas Caimán'}, 
						{val:'CK' , label:'Islas Cook'}, 
						{val:'CC' , label:'Islas de Cocos o Keeling'}, 
						{val:'FO' , label:'Islas Faroe'}, 
						{val:'HM' , label:'Islas Heard y McDonald'}, 
						{val:'FK' , label:'Islas Malvinas'}, 
						{val:'MP' , label:'Islas Marianas del Norte'}, 
						{val:'MH' , label:'Islas Marshall'}, 
						{val:'UM' , label:'Islas menores de Estados Unidos'}, 
						{val:'PW' , label:'Islas Palau'}, 
						{val:'SB' , label:'Islas Salomón'}, 
						{val:'SJ' , label:'Islas Svalbard y Jan Mayen'}, 
						{val:'TK' , label:'Islas Tokelau'}, 
						{val:'TC' , label:'Islas Turks y Caicos'}, 
						{val:'VI' , label:'Islas Vírgenes (EE.UU.)'}, 
						{val:'VG' , label:'Islas Vírgenes (Reino Unido)'}, 
						{val:'WF' , label:'Islas Wallis y Futuna'}, 
						{val:'IL' , label:'Israel'}, 
						{val:'IT' , label:'Italia'}, 
						{val:'JM' , label:'Jamaica'}, 
						{val:'JP' , label:'Japón'}, 
						{val:'JO' , label:'Jordania'}, 
						{val:'KZ' , label:'Kazajistán'}, 
						{val:'KE' , label:'Kenia'}, 
						{val:'KG' , label:'Kirguizistán'}, 
						{val:'KI' , label:'Kiribati'}, 
						{val:'KW' , label:'Kuwait'}, 
						{val:'LA' , label:'Laos'}, 
						{val:'LS' , label:'Lesotho'}, 
						{val:'LV' , label:'Letonia'}, 
						{val:'LB' , label:'Líbano'}, 
						{val:'LR' , label:'Liberia'}, 
						{val:'LY' , label:'Libia'}, 
						{val:'LI' , label:'Liechtenstein'}, 
						{val:'LT' , label:'Lituania'}, 
						{val:'LU' , label:'Luxemburgo'}, 
						{val:'MK' , label:'Macedonia, Ex-República Yugoslava de'}, 
						{val:'MG' , label:'Madagascar'}, 
						{val:'MY' , label:'Malasia'}, 
						{val:'MW' , label:'Malawi'}, 
						{val:'MV' , label:'Maldivas'}, 
						{val:'ML' , label:'Malí'}, 
						{val:'MT' , label:'Malta'}, 
						{val:'MA' , label:'Marruecos'}, 
						{val:'MQ' , label:'Martinica'}, 
						{val:'MU' , label:'Mauricio'}, 
						{val:'MR' , label:'Mauritania'}, 
						{val:'YT' , label:'Mayotte'}, 
						{val:'MX' , label:'México'}, 
						{val:'FM' , label:'Micronesia'}, 
						{val:'MD' , label:'Moldavia'}, 
						{val:'MC' , label:'Mónaco'}, 
						{val:'MN' , label:'Mongolia'}, 
						{val:'MS' , label:'Montserrat'}, 
						{val:'MZ' , label:'Mozambique'}, 
						{val:'NA' , label:'Namibia'}, 
						{val:'NR' , label:'Nauru'}, 
						{val:'NP' , label:'Nepal'}, 
						{val:'NI' , label:'Nicaragua'}, 
						{val:'NE' , label:'Níger'}, 
						{val:'NG' , label:'Nigeria'}, 
						{val:'NU' , label:'Niue'}, 
						{val:'NF' , label:'Norfolk'}, 
						{val:'NO' , label:'Noruega'}, 
						{val:'NC' , label:'Nueva Caledonia'}, 
						{val:'NZ' , label:'Nueva Zelanda'}, 
						{val:'OM' , label:'Omán'}, 
						{val:'NL' , label:'Países Bajos'}, 
						{val:'PA' , label:'Panamá'}, 
						{val:'PG' , label:'Papúa Nueva Guinea'}, 
						{val:'PK' , label:'Paquistán'}, 
						{val:'PY' , label:'Paraguay'}, 
						{val:'PE' , label:'Perú'}, 
						{val:'PN' , label:'Pitcairn'}, 
						{val:'PF' , label:'Polinesia Francesa'}, 
						{val:'PL' , label:'Polonia'}, 
						{val:'PT' , label:'Portugal'}, 
						{val:'PR' , label:'Puerto Rico'}, 
						{val:'QA' , label:'Qatar'}, 
						{val:'UK' , label:'Reino Unido'}, 
						{val:'CF' , label:'República Centroafricana'}, 
						{val:'CZ' , label:'República Checa'}, 
						{val:'ZA' , label:'República de Sudáfrica'}, 
						{val:'DO' , label:'República Dominicana'}, 
						{val:'SK' , label:'República Eslovaca'}, 
						{val:'RE' , label:'Reunión'}, 
						{val:'RW' , label:'Ruanda'}, 
						{val:'RO' , label:'Rumania'}, 
						{val:'RU' , label:'Rusia'}, 
						{val:'EH' , label:'Sahara Occidental'}, 
						{val:'KN' , label:'Saint Kitts y Nevis'}, 
						{val:'WS' , label:'Samoa'}, 
						{val:'AS' , label:'Samoa Americana'}, 
						{val:'SM' , label:'San Marino'}, 
						{val:'VC' , label:'San Vicente y Granadinas'}, 
						{val:'SH' , label:'Santa Helena'}, 
						{val:'LC' , label:'Santa Lucía'}, 
						{val:'ST' , label:'Santo Tomé y Príncipe'}, 
						{val:'SN' , label:'Senegal'}, 
						{val:'SC' , label:'Seychelles'}, 
						{val:'SL' , label:'Sierra Leona'}, 
						{val:'SG' , label:'Singapur'}, 
						{val:'SY' , label:'Siria'}, 
						{val:'SO' , label:'Somalia'}, 
						{val:'LK' , label:'Sri Lanka'}, 
						{val:'PM' , label:'St. Pierre y Miquelon'}, 
						{val:'SZ' , label:'Suazilandia'}, 
						{val:'SD' , label:'Sudán'}, 
						{val:'SE' , label:'Suecia'}, 
						{val:'CH' , label:'Suiza'}, 
						{val:'SR' , label:'Surinam'}, 
						{val:'TH' , label:'Tailandia'}, 
						{val:'TW' , label:'Taiwán'}, 
						{val:'TZ' , label:'Tanzania'}, 
						{val:'TJ' , label:'Tayikistán'}, 
						{val:'TF' , label:'Territorios franceses del Sur'}, 
						{val:'TP' , label:'Timor Oriental'}, 
						{val:'TG' , label:'Togo'}, 
						{val:'TO' , label:'Tonga'}, 
						{val:'TT' , label:'Trinidad y Tobago'}, 
						{val:'TN' , label:'Túnez'}, 
						{val:'TM' , label:'Turkmenistán'}, 
						{val:'TR' , label:'Turquía'}, 
						{val:'TV' , label:'Tuvalu'}, 
						{val:'UA' , label:'Ucrania'}, 
						{val:'UG' , label:'Uganda'}, 
						{val:'UY' , label:'Uruguay'}, 
						{val:'UZ' , label:'Uzbekistán'}, 
						{val:'VU' , label:'Vanuatu'}, 
						{val:'VE' , label:'Venezuela'}, 
						{val:'VN' , label:'Vietnam'}, 
						{val:'YE' , label:'Yemen'}, 
						{val:'YU' , label:'Yugoslavia'}, 
						{val:'ZM' , label:'Zambia'}, 
						{val:'ZW' , label:'Zimbabue'},
        ],
        nodefinido: [
            {val:'nodefinido'  , label:'Pais'},
        ]
    },

    tipocompSch: [
        {val:'ptecnico'    , label:'Parte Técnico: '},
        {val:'nentrega'    , label:'Nota de Entrega: '},
        {val:'nrecepcion'  , label:'Nota de Recepción: '},
        {val:'nsolicitud'  , label:'Nota de Solicitud: '},
        {val:'npedido'     , label:'Nota de Pedido: '},
        {val:'pemision'    , label:'Parte de Emisión: '},
        {val:'pdiario'     , label:'Parte Diario: '},
    ],
    clasificationSch: [
        {val:'genero'        , label:'Género:'},
        {val:'cetiquetas'    , label:'Contenido:'},
        {val:'formato'       , label:'Formato:'},
        {val:'videoteca'     , label:'Procedencia:'},
        {val:'etario'        , label:'Tipo de audiencia:'},
        {val:'descripcion'   , label:'Sinopsis:'},
        {val:'descriptores'  , label:'Descriptores: '},
    ],
    technicalSch: [
        {val:'durnominal'     , label:'Duración Nominal (minutos):'},
        {val:'productora'     , label:'Casa productora:'},
        {val:'fecreacion'     , label:'Año de Producción:'},
        {val:'cantcapitulos'  , label:'Cantidad de capítulos / unitarios:'},
        {val:'cantbloques'    , label:'Cantidad de bloques:'},
        {val:'lugares'        , label:'Lugar de producción'},
        {val:'locaciones'     , label:'Locaciones: '},
        {val:'temporada'      , label:'Temporada: '},
     ],

    fetchListKey:function(list, key){
        var node = _.find(list, function(data){return data.val === key;});
        return node;
    },
    fetchLabel:function(list, key){
        var node = _.find(list, function(data){return data.val === key;});
        //console.log('LABEL: [%s] - [%s] [%s]',list, key, node ? node.label: key);
        return node ? node.label: key;
    },
    fetchClass:function(list, key){
        var node = _.find(list, function(data){return data.val === key;});
        //console.log('LABEL: [%s] - [%s] [%s]',list, key, node ? node.label: key);
        return node ? node.classattr: "";
    },

    fetchNode:function(list, key){
        var node = _.find(list, function(data){return data.val === key;});
        //console.log('LABEL: [%s] - [%s] [%s]',list, key, node ? node.label: key);
        return node ? node.nodo : "";
    },

    validateInstance: function(pr){
        // true if tipoproducto es una INSTANCIA 
        var isInstance = false;
        isInstance = _.find(this.tipoinstanciaOptionList, function(data){
            return data.val === pr.get('tipoproducto');
        })
        return isInstance;
    },

    buildSelectOptions: function(varname, data, actualvalue){
        var template = _.template("<option value='<%= val %>' <%= selected %> ><%= label %></option>");
        var optionStr = '';
        _.each(data,function(element, index, list){
            element.selected = (actualvalue == element.val ? 'selected' : '');
            optionStr += template(element);
        });
        return optionStr;
    },

    buildDatalistOptions: function(varname, data){
        var template = _.template("<option value='<%= val %>' label='<%= label %>' >");
        var optionStr = '';
        _.each(data,function(element, index, list){
            optionStr += template(element);
        });
        return optionStr;
    },

    productionsListTableHeader:[
        {id:0, tt:'th', flag:1, tclass:'col0', tmpl: 'template2', val:'select',            label:'#'},
        {id:1, tt:'th', flag:1, tclass:'col1', tmpl: 'template3', val:'ea_productionId',      label:'Id'},
        {id:2, tt:'th', flag:1, tclass:'col2', tmpl: 'template1', val:'ea_lastModified',      label:'Fe Ult Mod'},
        {id:3, tt:'th', flag:1, tclass:'col3', tmpl: 'template6', val:'productionName',        label:'Nombre'},
        {id:4, tt:'th', flag:1, tclass:'col4', tmpl: 'template1', val:'productionDescription', label:'Descripcion'},
    ], 

    userListTableHeader:[
        {id:0, tt:'th', flag:1, tclass:'col0', tmpl: 'template2', val:'select',            label:'#'},
        {id:1, tt:'th', flag:1, tclass:'col1', tmpl: 'template3', val:'mail',              label:'identificador'},
        {id:2, tt:'th', flag:1, tclass:'col2', tmpl: 'template1', val:'username',          label:'tipo'},
        {id:3, tt:'th', flag:1, tclass:'col3', tmpl: 'template1', val:'estado_alta',       label:'estado'},
    ], 

    personListTableHeader:[
        {id:0, tt:'th', flag:1, tclass:'col0', tmpl: 'template2', val:'select',            label:'#'},
        {id:1, tt:'th', flag:1, tclass:'col1', tmpl: 'template3', val:'nickName',          label:'identificador'},
        {id:2, tt:'th', flag:1, tclass:'col2', tmpl: 'template1', val:'tipopersona',       label:'tipo'},
        {id:3, tt:'th', flag:1, tclass:'col3', tmpl: 'template1', val:'name',              label:'denominación'},
        {id:4, tt:'th', flag:1, tclass:'col4', tmpl: 'template1', val:'tipojuridico',      label:'juridico'},
        {id:5, tt:'th', flag:1, tclass:'col5', tmpl: 'template1', val:'roles',             label:'roles'},
        {id:6, tt:'th', flag:1, tclass:'col6', tmpl: 'template1', val:'estado_alta',       label:'importancia'},
        {id:7, tt:'th', flag:1, tclass:'col7', tmpl: 'template4', val:'acciones',          label:'acciones'}
    ],

    productListTableHeader:[
        {id:0, tt:'th', flag:1, tclass:'col0', tmpl: 'template2', val:'select',            label:'#'},
        {id:1, tt:'th', flag:1, tclass:'col1', tmpl: 'template3', val:'productcode',       label:'código'},
        {id:2, tt:'th', flag:1, tclass:'col2', tmpl: 'template1', val:'tipoproducto',      label:'tipo'},
        {id:3, tt:'th', flag:1, tclass:'col3', tmpl: 'template1', val:'slug',              label:'denominación'},
        {id:4, tt:'th', flag:0, tclass:'col4', tmpl: 'template1', val:'project',           label:'proyecto'},
        {id:5, tt:'th', flag:1, tclass:'col5', tmpl: 'template1', val:'nivel_ejecucion',   label:'ejecución'},
        {id:6, tt:'th', flag:0, tclass:'col6', tmpl: 'template1', val:'nivel_importancia', label:'importancia'},
        {id:7, tt:'th', flag:1, tclass:'col7', tmpl: 'template1', val:'pendientes',        label:'pendientes'},
        {id:8, tt:'th', flag:1, tclass:'col8', tmpl: 'template4', val:'acciones',          label:'acciones'}
    ],

    documListTableHeader:[
        {id:0 , tt:'th', flag:1, tclass:'order', tmpl: 'template2', val:'select',        label:'#'},
        {id:1 , tt:'th', flag:1, tclass:'col1', tmpl: 'template6', val:'cnumber',       label:'comprob'},
        {id:2 , tt:'th', flag:1, tclass:'col2', tmpl: 'template1', val:'fecomp',        label:'fecha'},
        {id:3 , tt:'th', flag:0, tclass:'col3', tmpl: 'template1', val:'fechagestion',  label:'fecha'},
        {id:4 , tt:'th', flag:1, tclass:'col4', tmpl: 'template1', val:'tipocomp',      label:'tipo'},
        {id:5 , tt:'th', flag:0, tclass:'col5', tmpl: 'template1', val:'tipoitem',      label:'tipo'},
        {id:6 , tt:'th', flag:0, tclass:'col6', tmpl: 'template1', val:'tipomov',       label:'movimiento'},
        {id:7 , tt:'th', flag:0, tclass:'col7', tmpl: 'template1', val:'estado_alta',   label:'prioridad'},
        {id:8 , tt:'th', flag:1, tclass:'col8', tmpl: 'template1', val:'persona',       label:'persona'},
        {id:9 , tt:'th', flag:0, tclass:'col9', tmpl: 'template1', val:'product',       label:'producto'},
        {id:10, tt:'th', flag:0, tclass:'cola', tmpl: 'template1', val:'tcomputo',      label:'tiempo'},
        {id:11, tt:'th', flag:1, tclass:'colb', tmpl: 'template1', val:'slug',          label:'a s u n t o   -   d e s c r i p c i ó n'},
        {id:12, tt:'th', flag:1, tclass:'actions', tmpl: 'template5', val:'acciones',      label:'acciones'}
    ],

    actionListTableHeader:[
        {id:0 , tt:'th', flag:1, tclass:'order', tmpl: 'template2', val:'select',      label:'#'},
        {id:1 , tt:'th', flag:1, tclass:'col1', tmpl: 'template6',  val:'cnumber',     label:'acción'},
        {id:2 , tt:'th', flag:1, tclass:'col2', tmpl: 'template1',  val:'taccion',     label:'Tipo'},
        {id:3 , tt:'th', flag:1, tclass:'col2', tmpl: 'template1',  val:'area',        label:'Área'},
        {id:4 , tt:'th', flag:1, tclass:'col3', tmpl: 'template1',  val:'fecomp',      label:'fecha alta'},
        {id:5 , tt:'th', flag:0, tclass:'col4', tmpl: 'template1',  val:'faccion',     label:'fecha acción'},
        {id:6 , tt:'th', flag:1, tclass:'col5', tmpl: 'template1',  val:'tregistro',   label:'registro'},
        {id:7 , tt:'th', flag:0, tclass:'col6', tmpl: 'template1',  val:'taccion',     label:'tipo'},
        {id:11, tt:'th', flag:1, tclass:'colb', tmpl: 'template1',  val:'slug',        label:'a s u n t o   -   d e s c r i p c i ó n'},
        {id:12, tt:'th', flag:1, tclass:'actions', tmpl: 'template8', val:'acciones',      label:'acciones'}
    ],

    budgetListTableHeader:[
        {id:0 , tt:'th', flag:1, tclass:'order', tmpl: 'template2', val:'select',       label:'#'},
        {id:1,  tt:'th', flag:1, tclass:'colb',  tmpl: 'template1', val:'slug',         label:'a s u n t o   -   d e s c r i p c i ó n'},
        {id:2 , tt:'th', flag:1, tclass:'col2',  tmpl: 'template6', val:'parent_cnumber', label:'Acción'},
        {id:3 , tt:'th', flag:1, tclass:'col3',  tmpl: 'templatea', val:'cnumber',      label:'Presupuesto'},
        {id:4 , tt:'th', flag:1, tclass:'col4',  tmpl: 'template1', val:'tgasto',       label:'Tipo Gasto'},
        {id:5 , tt:'th', flag:1, tclass:'col5',  tmpl: 'template1', val:'area',         label:'Área'},
        {id:6,  tt:'th', flag:1, tclass:'col6',  tmpl: 'template1', val:'origenpresu',  label:'Fuente'},
        {id:7,  tt:'th', flag:1, tclass:'col7',  tmpl: 'template1', val:'tramita',      label:'Tramita'},
        {id:8 , tt:'th', flag:1, tclass:'col8',  tmpl: 'template1', val:'trim_fiscal',  label:'Trim'},
        {id:9 , tt:'th', flag:0, tclass:'col9',  tmpl: 'template1', val:'cantidad',     label:'Cant'},
        {id:10, tt:'th', flag:1, tclass:'col10', tmpl: 'template1', val:'ume',          label:'UME'},
        {id:11, tt:'th', flag:1, tclass:'col11', tmpl: 'template7', val:'importe',      label:'Importe'},
        {id:12, tt:'th', flag:1, tclass:'actions', tmpl: 'template9', val:'acciones',  label:'acciones'}
    ],

    buildTableHeader: function(data){
        var template1 = _.template("<<%= tt %> data-name='<%= val %>' class='<%= tclass %> js-sortcolumn' ><button name='<%= val %>' type='button' class='btn btn-link btn-xs'><%= label %> <span class='glyphicon glyphicon-sort-by-attributes'></span></button></<%= tt %> >");
        var template2 = _.template("<<%= tt %> data-name='<%= val %>' class='<%= tclass %>' ><%= label %></<%= tt %> >");
        var tabledata = '';
        _.each(data,function(element, index, list){
            if(element.flag){
                if(element.tclass === 'order' || element.tclass === 'actions') tabledata += template2(element);
                else tabledata += template1(element);
            }
        });
        //console.log('<thead><tr>'+tabledata+'</tr></thead>');
        return '<thead><tr>'+tabledata+'</tr></thead>';
    },

    buildTableRowTemplates:{
        template1 : _.template("<td data-name='<%= val %>' class='<%= tclass %>' ><%= value %></td>"),
        template2 : _.template("<td data-name='<%= val %>' class='<%= tclass %>' ><input name=tselect type=checkbox class=tselect ></td>"),
        template3 : _.template("<td data-name='<%= val %>' class='<%= tclass %>' ><button class='btn-link tlink' title='editar item'><%= value %></button></td>"),
        template4 : _.template("<td data-name='<%= val %>' class='<%= tclass %>' ><button class='btn-link tedit' title='no implementado aun'><span class='glyphicon glyphicon-edit'></span></button><button class='btn-link tzoom' title='ver entidades relacionadas' ><span class='glyphicon glyphicon-zoom-in'></span></button></button></td>"),
        template6 : _.template("<td data-name='<%= val %>' class='<%= tclass %>' ><button class='btn-link js-show' title='explorar   '><%= value %></button></td>"),
        template7 : _.template("<td data-name='<%= val %>' class='<%= tclass %>' ><span class='pull-right'><%= value %></span></td>"),
        template7 : _.template("<td data-name='<%= val %>' class='<%= tclass %>' ><span class='pull-right'><%= value %></span></td>"),
        //template7 : _.template("<td data-name='<%= val %>' class='<%= tclass %>' ><button class='btn-link js-show' title='editar item'><%= value %></button></td>"),
        template5 : _.template("<td data-name='<%= val %>' class='<%= tclass %>' ><button class='btn-link js-edit'  title='editar'><span class='glyphicon glyphicon-edit'></span></button><button class='btn-link js-zoom' title='entidades relacionadas' ><span class='glyphicon glyphicon-zoom-in'></span></button></td>"),
        template8 : _.template("<td data-name='<%= val %>' class='<%= tclass %>' ><button class='btn-link js-edit'  title='editar'><span class='glyphicon glyphicon-edit'></span></button></td>"),
        template9 : _.template("<td data-name='<%= val %>' class='<%= tclass %>' ><button class='btn-link js-trash' title='observar'><span class='glyphicon glyphicon-ok'></span></button></td>"),
        templatea : _.template("<td data-name='<%= val %>' class='<%= tclass %>' ><button class='btn-link js-edit'  title='editar  '><%= value %></button></td>"),
        //template3 : _.template("<td data-name='<%= val %>' class='<%= tclass %>' ><button class='btn-link tlink'   title='editar item'><%= value %></button></td>"),
    },

    buildTableRow: function(data,model){
        var self = this;
        var tabledata = '';
        _.each(data,function(element, index, list){
            //console.log('******* 2 *********');
            if(element.flag){
                element.value = (model.displayItem(element.val)||'#');
                tabledata += self.buildTableRowTemplates[element.tmpl](element);
            }
        });
        //console.log(tabledata);
        return tabledata;
    },

    buildRowRenderTemplate: function(lista, templates){
        var items =[];
        _.each(lista, function(data,index){
            //console.log('******* 3 *********');
          if(data.flag){
            data.value = '<%= '+data.val+' %>';
            if(data.tmpl === 'template7'){
                data.value = '<%= accounting.formatNumber('+data.val+') %>';
            }
            items.push(templates[data.tmpl](data));
          }          
        });
        return items.join();  
    },

    selectedUsers:{
        list:[],
        select: function  () {
            this.suser = this.first() || this.suser;
        },
        unselect: function() {
            this.suser = null;
        },
        getSelected: function() {
            return this.suser;
        },
        getSelectedLabel: function() {
            if(!this.getSelected()) return 'Sin selección';
            else return this.getSelected().get('nickName');
        },
        add: function  (user) {
            for (var i = this.list.length - 1; i >= 0; i--) {
                if(this.list[i]===user) return this.list;
            }
            this.list.push(user);
            return this.list;
        },
        getList: function() {
            return this.list;
        },
        remove: function (user) {
            for (var i = this.list.length - 1; i >= 0; i--) {
                if(this.list[i]===user) this.list.splice(i,1);
            }
            return this.list;
        },
        reset: function() {
            this.list = [];
        },
        first: function  () {
            if(this.list.length) return this.list[0];
            else return null;
        }
    },

    selectedPersons:{
        list:[],
        select: function  () {
            this.sperson = this.first() || this.sperson;
        },
        unselect: function() {
            this.sperson = null;
        },
        getSelected: function() {
            return this.sperson;
        },
        getSelectedLabel: function() {
            if(!this.getSelected()) return 'Sin selección';
            else return this.getSelected().get('nickName');
        },
        add: function  (person) {
            for (var i = this.list.length - 1; i >= 0; i--) {
                if(this.list[i]===person) return this.list;
            }
            this.list.push(person);
            return this.list;
        },
        getList: function() {
            return this.list;
        },
        remove: function (person) {
            for (var i = this.list.length - 1; i >= 0; i--) {
                if(this.list[i]===person) this.list.splice(i,1);
            }
            return this.list;
        },
        reset: function() {
            this.list = [];
        },
        first: function  () {
            if(this.list.length) return this.list[0];
            else return null;
        }
    },

    selectedProducts:{
        list:[],
        select: function  () {
            this.sproduct = this.first() || this.sproduct;
        },
        unselect: function() {
            this.sproduct = null;
        },
        getSelected: function() {
            return this.sproduct;
        },
        getSelectedLabel: function() {
            if(!this.getSelected()) return 'Sin selección';
            else return this.getSelected().get('productcode');
        },
        add: function  (product) {
            for (var i = this.list.length - 1; i >= 0; i--) {
                if(this.list[i]===product) return this.list;
            }
            this.list.push(product);
            return this.list;
        },
        getList: function() {
            return this.list;
        },
        remove: function (product) {
            for (var i = this.list.length - 1; i >= 0; i--) {
                if(this.list[i]===product) this.list.splice(i,1);
            }
            return this.list;
        },
        reset: function() {
            this.list = [];
        },
        first: function  () {
            if(this.list.length) return this.list[0];
            else return null;
        }
    },

    editor:{
        render: function(nicpanel, target, text){
            this.get().setPanel(nicpanel);
            this.get().addInstance(target);
            this.get().instanceById(target).setContent((text||'ingrese el pedido de cotización'));
        },
        get: function(){
            if(!this.editorInstance){
                this.editorInstance = new nicEditor();
            }
            return (this.editorInstance);
        },
        getContent: function(target){
            //alert('alo'); //instanceById(target)
            //var ed = ;
            return this.get().instanceById(target).getContent();
        }
    },
    
    viewData:{
        emp:{
            depart:'CePia - Centro de producción e investigación audiovisual',
            division:'Secretaría de Cultura de la Nación',
            address:'Vera 745 - CABA'
        },
        currentProject:'proyecto',
        resource: {
            rubroText: {no_definido:' ', talentos:'Art', tecnica:'Tec', infraestructura:'Inf', seguridad:'Seg',hospitality:'Hos',transmision:'Tx',prensa:'Pre'},
            eventFillColor: {no_definido:'lime',bajo:'green',medio:'blue',alto:'magenta',critico:'red'},
            fillOpacity:{no_definido:.1,planificado:.4,rfi:.6,tdr:.8,compras:.9,adjudicado:.9,a_entregar:1,entregado:1,cumplido:1}
        },
        product: {
            tprText: {no_definido:' ', paudiovisual:'PA', micro:'Micro', promo:'Promo', imagen:'Img', curaduria:'Cur', catalogo: 'Cat'},
            eventFillColor: {no_definido:'lime',bajo:'green',medio:'blue',alto:'magenta',critico:'red'},
            fillOpacity:{no_definido:.1,planificado:.3,gestion:.6,recibido:.8,ingestado:.9,controlado:.9,aprobado:1,observado:1,archivado:1}
        },
        //add sol
        sol: {
            eventFillColor: {no_definido:'lime',bajo:'green',medio:'blue',alto:'magenta',critico:'red'},
            fillOpacity:{no_definido:.1,planificado:.3,gestion:.6,recibido:.8,ingestado:.9,controlado:.9,aprobado:1,observado:1,archivado:1}
        },
        project: { eventText: {no_definido:' ',concurso: 'Conc',convenio: 'Cnv', cesiones: 'Ces', 
                    producciones: 'Pro', adhesiones:'Adh',produccion:'Pro',cesion:'Ces', infantil:'Inf', 
                    musica:'Mus', teatro:'Tea', musical:'Tmu',
                    circo:'Cir',cine:'Cin',festival:'Fes',fpopular:'FPo', danza:'Dza',congreso:'Con'
            },
            eventFillColor: {no_definido:'lime',bajo:'green',medio:'blue',alto:'magenta',critico:'red'},
            ispropioText: {'1':'BACUA','0':'Ax'},
            fillOpacity:{no_definido:1,planificado:.4,produccion:1,posproduccion:.7,demorado:.4,reprogramado:.4,suspendido:.1,cumplido:.1},
        },

        request: { eventText: {no_definido:' ',solicitud:'SOLICITUDES TÉCNICO ARTÍSTICAS',concurso: 'Conc',convenio: 'Cnv', cesiones: 'Ces', 
                    producciones: 'Pro', adhesiones:'Adh',produccion:'Pro',cesion:'Ces', infantil:'Inf', 
                    musica:'Mus', teatro:'Tea', musical:'Tmu',
                    circo:'Cir',cine:'Cin',festival:'Fes',fpopular:'FPo', danza:'Dza',congreso:'Con'
            },
            eventFillColor: {no_definido:'lime',bajo:'green',medio:'blue',alto:'magenta',critico:'red'},
            ispropioText: {'1':'MCN','0':'Ax'},
            fillOpacity:{no_definido:1,planificado:.4,produccion:1,posproduccion:.7,demorado:.4,reprogramado:.4,suspendido:.1,cumplido:.1},
        },

        resourcelist:[]
    },

    inspect: function  (target, deep, whoami,maxdeep) {
        //console.log('inspect usage: inspect(target, initial_deep, whoami, maxdeep');
        //console.log('    suggested: inspect(oo, 0, myname,3');
        var deep = deep+=1 || 1;
        var stop = maxdeep|| 3;
        var self = this;
        console.log('[%s]:inspect CALLED: key to inspect:[%s]: object:[%s]',deep, whoami, target);
        _.each(target, function(value, key){
            console.log('[%s]:inspecting each: [%s]: [%s] ',deep, key,value);
            if( (_.isObject(value) && !_.isFunction(value)) && deep<stop ){
                //if(key==='fields'||key==='contenido'||key==='subtematica'||key==='editor'||key==='nestedForm'||key==='rolinstancia'||key==='tipoproducto'){
                //if(key==='fields'||key==='contenido'||key==='subtematica'||key==='editor'||key==='nestedForm'||key==='rolinstancia'||key==='tipoproducto'||key==='tematica'){
                if(true){
                    self.inspect(value, deep,key, maxdeep);
                }
            }
        });
    },
    
    rendertree: function(settings){
        var root = utils.d3treegraph;

        var diameter = 960;
        var tree = d3.layout.tree()
            .size([360, diameter / 2 - 120])
            .separation(function(a, b) { return (a.parent == b.parent ? 1 : 2) / a.depth; });

        var diagonal = d3.svg.diagonal.radial()
            .projection(function(d) { return [d.y, d.x / 180 * Math.PI]; });

        var svg = d3.select(settings.selector).append("svg")
            .attr("width", diameter)
            .attr("height", diameter - 150)
            .append("g")
            .attr("transform", "translate(" + diameter / 2 + "," + diameter / 2 + ")");


        //d3.json('flare.json', function(error, root) {
          var nodes = tree.nodes(root),
              links = tree.links(nodes);

          var link = svg.selectAll(".link")
            .data(links)
            .enter().append("path")
            .attr("class", "link")
            .attr("d", diagonal);

          var node = svg.selectAll(".node")
            .data(nodes)
            .enter().append("g")
            .attr("class", "node")
            .attr("transform", function(d) { return "rotate(" + (d.x - 90) + ")translate(" + d.y + ")"; });

          node.append("circle")
              .attr("r", 4.5);

          node.append("text")
              .attr("dy", ".31em")
              .attr("text-anchor", function(d) { return d.x < 180 ? "start" : "end"; })
              .attr("transform", function(d) { return d.x < 180 ? "translate(8)" : "rotate(180)translate(-8)"; })
              .text(function(d) { return d.name; });
        //});

        d3.select(self.frameElement).style("height", diameter - 150 + "px");
    },

    parseTC: function(str){
        var frames = 25;
        var tc = ["00","00","00","00"];
        var offset = 0;
        if(!str) return tc.join(":");

        var tokens = str.split(":");
        if(tokens.length===1){
            if(str.length===2) str="00"+str+"0000";
            if(str.length===4) str="00"+str+"00";
            if(str.length===6) str="00"+str;
            if(str.length!==8) return tc.join(":");
            for(var i=0; i<8; i=i+2) tc[i/2] = str.substr(i,2);
            return utils.validateTC(tc);
        }else{
            if(tokens.length>4) return tc.join(":");
            if(tokens.length<4) offset=1;
            for(var j=0;j<tokens.length;j+=1) tc[j+offset]=("00"+tokens[j]).substr(-2);
            return utils.validateTC(tc);
        }
        return tc.join(':');
    },

    validateTC: function(tc){
        var error = "00:00:00:00";
        var divisor = [99, 60, 60, 25];
        //var tc = t.split(":");
        for (var i = 0 ; i< tc.length;i+=1 ){
            if(isNaN(tc[i])) return error;
            var n= parseInt(tc[i],10);
            if(isNaN(n)) return error;
            if(n % 1) return error;
            if((n / divisor[i])>=1) return error;
            if(n<0) return error;
        }
        return tc.join(":");
    },
    tc2Minutes: function(tc){
        var min = 0,
            tokens = tc.split(":");
        if(tokens.length===1){
            min =  this.valint(tc);
        } else if(tokens.length === 2){
            min = this.valint(tokens[0]) + ((this.valint(tokens[1]) > 30) ? 1 : 0);
        } else if(tokens.length === 3){
            min = this.valint(tokens[0]) + ((this.valint(tokens[1]) > 30) ? 1 : 0);
        } else if(tokens.length === 4){
            min = this.valint(tokens[0]) * 60 + this.valint(tokens[1]) + ((this.valint(tokens[2]) > 30) ? 1 : 0);
        }
        return min;
    },
    min2TC: function(min){
        var tokens = [0,0,0,0],
            val = this.valint(min);

        tokens[1] = val % 60;
        tokens[0] = Math.floor(val / 60);
        return tokens.join(":");
    },

    addTC: function(memo, val){
        var acum = this.tc2Minutes(memo) + this.tc2Minutes(val);
        return this.min2TC(acum);
    },

    valint: function (s){
        var n = 0;
        if(parseInt(s,10) !== NaN) n = parseInt(s,10);
        return n;
    },

/*
    parseTC: function(str){
          var frames = 25;
          var tc = [0,0,0,0];
          if(!str) return "00:00:00:00";
          //var tokens = str.split(/(?:(\:))/gm);
          var tokens = str.split(":");
          if(tokens.length===1){
            tc[1]=parseInt(tokens[0],10);

          }
          if(tokens.length===2){
            tc[1]=parseInt(tokens[0],10);
            tc[2]=parseInt(tokens[1],10);

          }
          if(tokens.length===3){
            tc[1]=parseInt(tokens[0],10);
            tc[2]=parseInt(tokens[1],10);
            tc[3]=parseInt(tokens[2],10);
          }
          if(tokens.length===4){
            tc[0]=parseInt(tokens[0],10);
            tc[1]=parseInt(tokens[1],10);
            tc[2]=parseInt(tokens[2],10);
            tc[3]=parseInt(tokens[3],10);
          }
          if((tc[3]/frames)>1){
            tc[2] += Math.floor(tc[3]/frames);
            tc[3] = tc[3] % frames;
          }
           
          return this.normalizeTC(tc).join(':');
    },

    normalizeTC : function(tc){
          var divisor = 60;
      for (var i = tc.length-2; i>0;i-=1 ){
        if((tc[i]/divisor)>1){
          tc[i-1] += Math.floor(tc[i]/divisor);
          tc[i] = tc[i] % divisor;
        }
        
      }
      return tc;
    },

*/
    es_cutoff : {
        "á" : "a",
        "Á" : "A",
        "é" : "e",
        "É" : "E",
        "í" : "i",
        "Í" : "I",
        "ó" : "o",
        "Ó" : "O",
        "ú" : "u",
        "Ú" : "U",
        "ñ" : "n"
    },

    fstr : function(strinput){
        var self = this,
            str = strinput;
        str = str.split(' ').join('_');
        str = str.replace(/[áÁéÉíÍóÓúÚñ]/g,function(c) { return self.es_cutoff[c]; });
        return str;
    },

    buildDateNum: function(str){
        console.log('buildDateNUM BEGIN [%s]',str)
        return this.parseDateStr(str).getTime();
    },

    buildDate: function(str){
        console.log('buildDate BEGIN [%s]',str)
        return this.parseDateStr(str);
    },

    dateToStr: function(date) {
        var da = date.getDate();
        var mo = date.getMonth()+1;
        var ye = date.getFullYear();
        return da+"/"+mo+"/"+ye;
    },  
		
		dateTimeToStr: function(date) {
        var da = date.getDate();
        var mo = date.getMonth()+1;
        var ye = date.getFullYear();
        var hh = date.getHours();
        var mm = date.getMinutes();
        var ss = date.getSeconds();
        return da+"/"+mo+"/"+ye+":"+hh+":"+mm+":"+ss;
    },

    addOffsetDay: function(numdate, offset){
        var fe = {};
        var date = new Date(numdate);
        var da = date.getDate()+offset;

        var ndate = new Date(date.getFullYear(), date.getMonth(), da, 0,0,0);
        fe.date = utils.dateToStr(ndate);
        fe.tc = ndate.getTime();
        
        return fe;
    },

    parseDateStr: function(str) {
    console.log('parseDate BEGIN [%s]',str)

        var mx = str.match(/(\d+)/g);
        var ty = new Date();
        if(mx.length === 0) return ty;
        if(mx.length === 1){
            if(mx[0]<0 || mx[0]>31) return null;
            else return new Date(ty.getFullYear(),ty.getMonth(),mx[0]);
        }
        if(mx.length === 2){
            if(mx[0]<0 || mx[0]>31) return null;
            if(mx[1]<0 || mx[1]>12) return null;
            else return new Date(ty.getFullYear(),mx[1]-1,mx[0]);
        }
        if(mx.length === 3){
            if(mx[0]<0 || mx[0]>31) return null;
            if(mx[1]<0 || mx[1]>12) return null;
            if(mx[2]<1000 || mx[2]>2020) return null;
            else return new Date(mx[2],mx[1]-1,mx[0]);
        }
        if(mx.length === 4){
            if(mx[0]<0 || mx[0]>31) return null;
            if(mx[1]<0 || mx[1]>12) return null;
            if(mx[2]<1000 || mx[2]>2020) return null;
            if(mx[3]<0 || mx[3]>24) return null;
            else return new Date(mx[2],mx[1]-1,mx[0],mx[3],0);
        }
        if(mx.length === 5){
            if(mx[0]<0 || mx[0]>31) return null;
            if(mx[1]<0 || mx[1]>12) return null;
            if(mx[2]<1000 || mx[2]>2020) return null;
            if(mx[3]<0 || mx[3]>24) return null;
            if(mx[4]<0 || mx[4]>60) return null;
            else return new Date(mx[2],mx[1]-1,mx[0],mx[3],mx[4]);
        }
    }
};