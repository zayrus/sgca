/*
 * View-controller
 *  Para controlar la vista se definen tres objetos:
 *   (a) TableView: responsable del conjunto
 *   (b) TableHeaderView: renderiza la cabecera de la tabla
 *   (c) TableRowView: renderiza cada fila del cuerpo de la tabla
 *
**/
var TableView = Backbone.View.extend({

    initialize: function (options) {
        this.models = options.models;
        //this.models.bind("add", this.render, this);
    },

    events: {
    },

    template: _.template("<table class='table table-condensed table-striped contactos' ><thead class='contactos-header' ></thead><tbody class='contactos-body' ></tbody></table> "),

    render: function () {
        console.log('render');
        var self = this;

        self.$el.html(self.template());
        var headNode = $('thead',self.el);
        
        var tableHeader = new TableHeaderView({el:headNode});

        //var queryview = new QueryView({model: query, el: $('.tablequery') });
        
        this.models.each(function(element){
            console.log('TableView each:[%s]',element.get('ea:productionId'));
            //
            element.set('prop:name',element.get('properties').name);
            element.set('prop:description',element.get('properties').description);
            //
            $('tbody',self.el).append(new TableRowView({model:element}).render().el);
        });
      
        return self;
    }
});

var TableHeaderView = Backbone.View.extend({
  
    headerSpec:[
        {tt:'th', flag:1, tclass:'col0', tmpl: 'template1', val:'ea:productionId',  label:'Id'},
        {tt:'th', flag:1, tclass:'col0', tmpl: 'template1', val:'ea:lastModified',  label:'Fe Ult Mod'},
        {tt:'th', flag:1, tclass:'col0', tmpl: 'template1', val:'prop:name',        label:'Nombre'},
        {tt:'th', flag:1, tclass:'col0', tmpl: 'template1', val:'prop:description', label:'Descripcion'},
    ],
    
    headerSpec2:[
        {tt:'th', flag:1, tclass:'col0', tmpl: 'template6', val:'descripcion',  label:'Descr'},
        {tt:'th', flag:1, tclass:'col0', tmpl: 'template1', val:'eventid',      label:'eventid'},
        {tt:'th', flag:1, tclass:'col0', tmpl: 'template5', val:'youtube',      label:'youtube'},
        {tt:'th', flag:1, tclass:'col1', tmpl: 'template1', val:'parentevent',  label:'parent'},
        {tt:'th', flag:1, tclass:'col1', tmpl: 'template1', val:'title',        label:'evento'},
        {tt:'th', flag:1, tclass:'col2', tmpl: 'template1', val:'status',       label:'estado'},
        {tt:'th', flag:1, tclass:'col3', tmpl: 'template1', val:'feinicio',     label:'desde'},
        {tt:'th', flag:1, tclass:'col3', tmpl: 'template1', val:'fefinal',      label:'hasta'},
        {tt:'th', flag:1, tclass:'col3', tmpl: 'template1', val:'tipoevento',   label:'tipo'},
        {tt:'th', flag:1, tclass:'col3', tmpl: 'template1', val:'lugares',      label:'lugares'},
        {tt:'th', flag:1, tclass:'col3', tmpl: 'template4', val:'edit',         label:'mapa'}
    ],
    

    template: _.template("<<%= tt %> name='<%= val %>' class='<%= tclass %>' ><%= label %></<%= tt %> >"),
    //template: _.template("<<%= tt %> name='<%= val %>' class='<%= tclass %>' ><%= label %></<%= tt %> >"),

    events: {
    },

    initialize: function () {
        this.render();
    },

    render: function () {
        var self = this;
        var tabledata = '';      
        _.each(self.headerSpec,function(element, index, list){
            //console.log('render: [%s] [%s]', element.get('ea:productionId'), element.get('ea:lastModified'));
            if(element.flag){
                tabledata += self.template(element);
            }
        });
        this.$el.html('<tr>'+tabledata+'</tr>');
        return this;
    }
});

var TableRowView = Backbone.View.extend({

    tagName: "tr",

    rowSpec:[
        {tt:'th', flag:1, tclass:'col0', tmpl: 'template1', val:'ea:productionId',  label:'Id'},
        {tt:'th', flag:1, tclass:'col1', tmpl: 'template1', val:'ea:lastModified',  label:'Fe Ult Mod'},
        {tt:'th', flag:1, tclass:'col2', tmpl: 'template1', val:'prop:name',        label:'Nombre'},
        {tt:'th', flag:1, tclass:'col3', tmpl: 'template1', val:'prop:description', label:'Descripcion'},
    ],

    rowSpec2:[
        {tt:'th', flag:1, tclass:'col0', tmpl: 'template6', val:'descripcion',  label:'Descr'},
        {tt:'th', flag:1, tclass:'col0', tmpl: 'template1', val:'eventid',      label:'eventid'},
        {tt:'th', flag:1, tclass:'col0', tmpl: 'template5', val:'youtube',      label:'youtube'},
        {tt:'th', flag:1, tclass:'col1', tmpl: 'template1', val:'parentevent',  label:'parent'},
        {tt:'th', flag:1, tclass:'col1', tmpl: 'template1', val:'title',        label:'evento'},
        {tt:'th', flag:1, tclass:'col2', tmpl: 'template1', val:'status',       label:'estado'},
        {tt:'th', flag:1, tclass:'col3', tmpl: 'template1', val:'feinicio',     label:'desde'},
        {tt:'th', flag:1, tclass:'col3', tmpl: 'template1', val:'fefinal',      label:'hasta'},
        {tt:'th', flag:1, tclass:'col3', tmpl: 'template1', val:'tipoevento',   label:'tipo'},
        {tt:'th', flag:1, tclass:'lugares', tmpl: 'template1', val:'lugares',   label:'lugares'},
        {tt:'th', flag:1, tclass:'col3', tmpl: 'template4', val:'edit',         label:'editar'}
    ],

    buildTableRowTemplates:{
        template5 : _.template("<td name='<%= val %>' class='<%= tclass %>' ><a href='<%= value %>'><%= value %></a></td>"),
        template1 : _.template("<td name='<%= val %>' class='<%= tclass %>' ><%= value %></td>"),
        template2 : _.template("<td name='<%= val %>' class='<%= tclass %>' ><input name=tselect type=checkbox class=tselect ></td>"),
        template3 : _.template("<td name='<%= val %>' class='<%= tclass %>' ><button class='btn-link tlink' title='editar item'><%= value %></button></td>"),
        template4 : _.template("<td name='<%= val %>' class='<%= tclass %>' ><button type='button' class='btn btn-default btn-sm tsearch' title='buscar lugar'><span class='glyphicon glyphicon-globe'></span></button></td>"),
        template6 : _.template("<td name='<%= val %>' class='<%= tclass %>' ><button type='button' class='btn btn-default btn-sm details' title='<%= value %>'><span class='glyphicon glyphicon-zoom-in'></span></button></td>")
    },

    events: {
        'change'        : 'change',
        'click .tsearch'  : 'searchPlaces',
        'click .map'  : 'buttonclick',
    },
    buttonclick: function(){
        console.log('sonamo');

    },

    searchPlaces: function () {
        var self = this;
        var places = self.model.get('places');
        $('.lugares', self.el).html('');
        //$('.searchplaces').html('');
        console.log('places:[%s]',self.model.get('places'));
        _.each(places, function(elem){
            $('.lugares', self.el).append(new LocacionView({model: new Locacion({nombre: elem } ) }).el);
        });
        return false;
    },

    change: function (event) {
        console.log('change');
        var target = event.target;
        var change = {};
        change[target.name] = target.value;
        this.model.set(change);
    },

    initialize: function () {
        //this.model.bind("change", this.changeevent, this);
        //this.model.bind("destroy", this.destroyevent, this);
    },

    render: function () {    
        var self = this;
        var tabledata = '';
        _.each(self.rowSpec,function(element, index, list){
            if(element.flag){
                element.value = (self.model.get(element.val)||'#');
                tabledata += self.buildTableRowTemplates[element.tmpl](element);
            }
        });
        //console.log(tabledata);
        $(self.el).html(tabledata);
        return self;
    }
});

var QueryView = Backbone.View.extend({
      
    template: _.template(
        '<hr/><h3>Parametros de consulta</h3>' +
        '<form role="form" class="form-inline core">'+
            '<div class="form-group">'+
                '<label class="sr-only" for="feinicio">Fecha Desde</label>'+
                '<input type="text" class="form-control" id="feinicio" name="feinicio" '+
                    'placeholder="fecha desde" value="<%= feinicio %>"/>'+
            '</div>'+
            '<div class="form-group">'+
                '<label class="sr-only" for="fefinal">Fecha Desde</label>'+
                '<input type="text" class="form-control" id="fefinal" name="fefinal" '+
                    'placeholder="fecha hasta" value="<%= fefinal %>" >'+
            '</div>'+
            '<div class="form-group">'+
                '<label class="sr-only" for="tipoevento">Tipo de evento</label>'+
                '<input type="text" class="form-control" id="tipoevento" name="tipoevento" '+
                    'placeholder="tipo de evento" value="<%= tipoevento %>" >'+
            '</div>'+
            '<div class="form-group">'+
                '<label class="sr-only" for="descripcion">Titulo</label>'+
                '<input type="text" class="form-control" id="title" name="title" '+
                    'placeholder="Titulo" value="<%= title %>" >'+
            '</div>'+
            '<div class="form-group">'+
                '<label class="sr-only" for="eventid">Id Evento</label>'+
                '<input type="text" class="form-control" id="eventid" name="eventid" '+
                    'placeholder="Id evento" value="<%= eventid %>" >'+
            '</div>'+
            '<div class="form-group">'+
                '<label class="sr-only" for="address">Address</label>'+
                '<input type="text" class="form-control" id="address" name="address" '+
                    'placeholder="Dirección" value="<%= address %>" >'+
            '</div>'+
            '<a href="#" class="btn btn-primary search">Buscar</a>' +
        '</form>'
    ),


    events: {
        'change'         : 'change',
        'click .search'  : 'search',
    },

    search: function () {
        if(query.get('address')){
            this.fetchAddress();
        }else{
            fetchEntries();
        }
    },

    fetchAddress: function  () {
        var querydata = this.model.toJSON();
        var self = this;
        console.log('fetchAddress [%s]',this.model.get('address'));
 
        $.ajax({
            type: "GET",
            url: "/geocode",
            dataType: "json",
            data: querydata,
            success: function(data){
                var location = data.results[0];
                console.log('fetchAddress [%s] [%s]',location.formatted_address,location.geometry.location.lat);

                var item = {};
                item.lugarid = '';
                item.nombre = 'ubicación requerida';
                item.direccion = location.formatted_address;
                item.longitud = location.geometry.location.lng;
                item.latitud = location.geometry.location.lat;
                self.showMap(item);


            }
        });
    },

    showMap: function(place){
        addPlace(place.nombre, place.direccion,place.latitud,place.longitud);
    },


    change: function (event) {
        console.log('change');
        var target = event.target;
        var change = {};
        change[target.name] = target.value;
        this.model.set(change);
    },

    initialize: function () {
        this.render();
    },

    render: function () {
        var self = this;
        this.$el.html(this.template(this.model.toJSON()));
        return this;
    }
});

var LocacionView = Backbone.View.extend({
    tagName: 'div',


    template: _.template(
        "<button class='btn-link map' title='<%= nombre %>' ><span class='glyphicon glyphicon-map-marker'><%= nombre %></span></button>"
    ),


    events: {
        'click .map'  : 'search',
    },

    search: function () {
      console.log('clic!!!!  [%s]', this.model.get('nombre'));
      this.fetchEntries();
      return false;
    },

    fetchEntries: function  () {
        var querydata = this.model.toJSON();
        var self = this;

        $.ajax({
            type: "GET",
            url: "/lugaresagenda",
            dataType: "xml",
            data: querydata,
            success: function(xml){
                var coll = [];
                $(xml).find("Item").each(function(){
                    var item = {};
                    item.lugarid = $(this).find('IdLugar').text();
                    item.nombre = $(this).find('Nombre').text();
                    item.direccion = $(this).find('Direccion').text();
                    item.longitud = $(this).find('Longitud').text();
                    item.latitud = $(this).find('Latitud').text();
             
                    console.log('id:[%s] tit:[%s] ',item.lugarid, item.direccion);
                    coll.push(item);
                    self.showMap(item);
                });
                console.log('parsexml END length:[%s] ',coll.length);
            },
            error:verError
        });
    },
    showMap: function(place){
        addPlace(place.nombre, place.direccion,place.latitud,place.longitud);
        //if(!utils.maprender.getMap()) utils.maprender.init('showmap',200,400);
        //utils.maprender.addPlace(place);
    },

    initialize: function () {
        console.log('locacion view[%s]', this.model.get('nombre'));
        this.render();
    },

    render: function () {
        var self = this;
        console.log('locacion view[%s]', this.model.get('nombre'));
        $(this.el).attr('title',this.model.get('nombre'));

        $(this.el).html(this.template(this.model.toJSON()));
        //this.$el.append(this.template(this.model.toJSON()));
        return this;
    }
});


/*
 * Model
 *  El modelo es el EVENTO CULTURAL, con toda su información :
 *
**/
var Agenda = Backbone.Model.extend({
    urlRoot: "/agendaculturl",
    whoami: 'Model: evento',
    idAttribute: "_id",

    initialize: function () {
    },

    defaults: {
        _id: null,
        eventid:'',
        title:'',
        status:'',
        resumen:'',
        feinicio:'',
        fefinal:'',
        image:'',
        parentevent:'',
        tipoevento:'',
        address:'',
        places:[],
        lugares:''

        // estado: 1:nuevo 2:publicado 3:suspendido
    }
});

var Production = Backbone.Model.extend({
    urlRoot: "/studio/productions",
    whoami: 'Production model',
    idAttribute: "_id",

    initialize: function () {
    },

    defaults: {
        _id: null,
        "ea:productionId":"",
        "ea:lastModified":"",
        "ea:lastModifiedOfAllSessions":"",
        properties:{},
        links:[],
        // estado: 1:nuevo 2:publicado 3:suspendido
    }
});

var ProductionCollection = Backbone.Collection.extend({

    model: Production,
    
    initialize: function (model, options) {
    },

    url: "/studio/productions"

});




var Geocode = Backbone.Model.extend({
    urlRoot: "/geocode",
    whoami: 'Model: geocode',
    idAttribute: "_id",

    initialize: function () {
    },

    defaults: {
        _id: null,
        eventid:'',
        title:'',
        status:'',
        resumen:'',
        descripcion:'',
        feinicio:'',
        fefinal:'',
        image:'',
        parentevent:'',
        tipoevento:'',
        places:[],
        lugares:''

        // estado: 1:nuevo 2:publicado 3:suspendido
    }
});


var Locacion = Backbone.Model.extend({
    urlRoot: "/locacion",
    whoami: 'Model: locacion',
    idAttribute: "_id",

    initialize: function () {
    },

    defaults: {
        _id: null,
        nombre:'',
        nombreurl:'',
        direccion:'',
        latitud:'',
        longitud:''
        // estado: 1:nuevo 2:publicado 3:suspendido
    }
});


var AgendaCollection = Backbone.Collection.extend({

    model: Agenda,
    
    initialize: function (model, options) {
    },

    url: "/eventos"

});

var producciones;
var query;

/*
 * Registro de eventos relacionados con la interfaz de usuario
 *
**/



/*
 * Listo para la accion!!
 *
**/
var renderTable = function(){
    console.log('render table BEGINS');

    var tableview = new TableView({models: producciones, el: $('#build-table') });

    tableview.render();

};

var map;
var markers;


var initMap = function () {

    map = new OpenLayers.Map("showmap");
    // Creación de la capa que muestra el mapa de openstreetmap
    var mapnik = new OpenLayers.Layer.OSM();
    // Añadir la capa al mapa
    map.addLayer(mapnik);   
    //centramos el mapa
    map.setCenter(new OpenLayers.LonLat(-58.39688441711421,-34.60834737727606)
      .transform(
        new OpenLayers.Projection("EPSG:4326"), // de WGS 1984
        new OpenLayers.Projection("EPSG:900913") // a Proyección Esférica Mercator
      ), 13 // Nivel de zum
    );
    markers = new OpenLayers.Layer.Markers( "Markers" );
    map.addLayer(markers);
    
};


var addPlace = function (name, direccion, latitud, longitud) {
    if(!map) initMap();
    //latitud =  -34.6011977;
    //longitud =  -58.38388459999999;

    console.log('[%s] [%s] [%s]',name,latitud,longitud);
    var lonlat = new OpenLayers.LonLat(longitud,latitud).transform(
            new OpenLayers.Projection("EPSG:4326"),
            new OpenLayers.Projection("EPSG:900913"));
    var template = _.template('<h4><%= name %></h4><%= direccion %>');
    var htmltext = template({name:name, direccion:direccion})

    map.setCenter(lonlat, 20 );



    var size = new OpenLayers.Size(21,25);
    var offset = new OpenLayers.Pixel(-(size.w/2), -size.h);

    var icon = new OpenLayers.Icon('http://www.openlayers.org/dev/img/marker.png', size, offset);


    markers.addMarker(new OpenLayers.Marker(lonlat, icon));
    //markers.addMarker(new OpenLayers.Marker(lonlat, icon.clone()));

    var popup = new  OpenLayers.Popup.FramedCloud(
            name,
            lonlat,
            size, 
            htmltext, 
            icon,
            true
    );
    popup.minSize = new OpenLayers.Size(80,200);
    map.addPopup(popup);
};

/*
 * Lectura de eventos culturales desde el webservice de la ciudad.
 *
**/
var verError = function (obj, error){
    //find every Tutorial and print the author
    console.log('hay un error [%s]',typeof obj);
    //inspect(obj,0,'inspect');
};

var buildPlaces = function (lugares) {
    //var pattern = /\([0-9a-zA-Z ]+\)\s\|/gm;
    var pattern = /\([0-9a-zA-Z\s\)]+\|/gm;

    //console.log('0-buildPlaces: lugares[%s]:',lugares);
        
    var arr = lugares.split(pattern);
    //console.log('1-buildPlaces: len:[%s] arr[%s]:',arr.length,arr);

    arr = _.map(arr, function(elem){
        elem = elem.trim();
        var ii = elem.indexOf('(')-1;
        return (ii>0?elem.substring(0,ii):elem);
    });
    //console.log('2-buildPlaces: len:[%s] arr[%s]:',arr.length,arr);
    return arr;
};

var parseProductions = function(response){
    var coll = response.productions;
    console.log('parsex PRODUCTIONS BEGIN length:[%s] ',coll.length);
    producciones = new ProductionCollection(coll);
    renderTable();

};

var parseXml = function (xml){

    var coll = [];
    $(xml).find("Item").each(function(){
        var item = {};
        item.eventid = $(this).find('IdEvento').text();
        item.title = $(this).find('Titulo').text();
        item.status = $(this).find('IdEstadoEvento').text();
        item.resumen = $(this).find('Resumen').text();
        item.descripcion = $(this).find('Descripcion').text();
        item.feinicio = $(this).find('FechaInicio').text();
        item.fefinal = $(this).find('FechaFin').text();
        item.image = $(this).find('Imagen').text();
        var ytb = $(this).find('Youtube').text();
        if(!ytb) ytb = $(this).find('Twitter').text();
        if(!ytb) ytb = $(this).find('Facebook').text();
        if(!ytb) ytb = '#';
        if(ytb.indexOf('http') == -1 && ytb!=='#') ytb='http://'+ytb
        item.youtube = ytb;
        item.parentevent = $(this).find('IdEventoPadre').text();
        item.tipoevento = $(this).find('IdTipoEvento').text();
        item.lugares = $(this).find('Lugares').text();
        item.places = buildPlaces(item.lugares);
 
        console.log('id:[%s] tit:[%s] ',item.eventid, item.places);
        coll.push(item);
    });
    console.log('parsexml END length:[%s] ',coll.length);
    eventosculturales = new AgendaCollection(coll);
    renderTable();
};

var inspect = function  (target, deep, whoami) {
        var deep = deep+=1 || 1;
        var self = this;
        console.log('[%s]:inspect CALLED: [%s]: [%s]',deep, whoami, target);
        _.each(target, function(value, key){
            console.log('[%s]:inspect: [%s] [%s]: [%s]',deep, whoami, key,value);
            if( (_.isObject(value) && !_.isFunction(value)) && deep<4 ){
                self.inspect(value, deep);
            }
        });
};

var initQuery = function  () {
    var today = new Date();
    var nextday = new Date (today.getTime() + (7*24*60*60*1000))

    var md = today.getMonth()+1 < 10 ? '0'+ (today.getMonth()+1) : today.getMonth()+1;
    var mh = nextday.getMonth()+1 < 10 ? '0'+ (nextday.getMonth()+1) : nextday.getMonth()+1;

    var dd = today.getDate() < 10 ? '0'+ today.getDate() : today.getDate();
    var dh = nextday.getDate() < 10 ? '0'+ nextday.getDate() : nextday.getDate();
    
    var fedesde =   today.getFullYear()+'-'+md+'-'+dd;
    var fehasta = nextday.getFullYear()+'-'+mh+'-'+dh;
    query = new Agenda({feinicio: fedesde, fefinal: fehasta});
};


var login = function (data){
    console.log('success');

};



var User = Backbone.Model.extend({
    //urlRoot: "/agendaculturl",

    urlRoot: '186.137.141.82:60138/app/ea/j_security_check?resource=/content/ea/api/discovery.v1.json',

    whoami: 'Anyw USER',
    idAttribute: "_id",

    initialize: function () {
    },

    defaults: {
        j_username:'admin',
        j_password: 'admin',
    }
});

var verError = function (obj, error){
    //find every Tutorial and print the author
    console.dir('hay un error [%s]', obj);
    //inspect(obj,0,'inspect');
    /*    $.ajax({
            type: "GET",
            url: "http://186.137.141.82:60138/content/ea/git/productions.v1.json",
            Type: "json",
            withCredentials: true,
        });
    */
    };


var srvconnect = function  () {
    console.log('connect');

//    if(!query) initQuery();
//    var querydata = query.toJSON();
    var user = new User();
    var userdata = user.toJSON();

    $.ajax({
        type: "POST",
        url: "http://186.137.141.82:60138/app/ea/j_security_check?resource=/content/ea/api/discovery.v1.json",
        dataType: "json",
        data: userdata,
        success: login,
        error:verError
    });


    //http://186.137.141.82:60138/content/ea/git/productions.v1.json

};



var srvconnectvianode = function  () {
    console.log('connect');

//    if(!query) initQuery();
//    var querydata = query.toJSON();
//    var user = new User();
//    var userdata = user.toJSON();

    $.ajax({
        type: "GET",
        url: "/studio/login",
        dataType: "json",
        success: parseProductions,
        error:verError
    });


    //http://186.137.141.82:60138/content/ea/git/productions.v1.json

};

var text3 = "Ciudad Cultural Konex (a 3497 metros) | Beckett Teatro (a 3505 metros) | Teatro El Tinglado (a 7254 metros) | Sala Mediterránea (a 7254 metros) | Teatro del Viejo Mercado (a 7254 metros) | LA CARPINTERÍA (a 7254 metros) | El Cubo (a 7254 metros)";

$(function(){
  srvconnectvianode();
  //var arr = buildPlaces(text3);
  //console.log('arr: len:[%s]',arr.length);
});

