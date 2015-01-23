var TableView = Backbone.View.extend({

    initialize: function () {
        this.model.bind("add", this.render, this);
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
        
        self.model.each(function(element){
            $('tbody',self.el).append(new TableRowView({model:element}).render().el);
        });
      
        return self;
    }
});

var TableHeaderView = Backbone.View.extend({
  
    headerSpec:[
        {tt:'th', flag:1, tclass:'col0', tmpl: 'template2', val:'item',     label:'item'},
        {tt:'th', flag:1, tclass:'col1', tmpl: 'template3', val:'nombre',   label:'nombre'},
        {tt:'th', flag:1, tclass:'col2', tmpl: 'template1', val:'mail',     label:'mail'},
        {tt:'th', flag:1, tclass:'col3', tmpl: 'template1', val:'tel',      label:'telefono'},
        {tt:'th', flag:1, tclass:'col3', tmpl: 'template4', val:'edit',     label:'editar'}
    ],
    
    template: _.template("<<%= tt %> name='<%= val %>' class='<%= tclass %>' ><%= label %></<%= tt %> >"),

    events: {
    },

    initialize: function () {
        this.render();
    },

    render: function () {
        var self = this;
        var tabledata = '';      
        _.each(self.headerSpec,function(element, index, list){
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
        {tt:'th', flag:1, tclass:'col0', tmpl: 'template2', val:'item',     label:'item'},
        {tt:'th', flag:1, tclass:'col1', tmpl: 'template3', val:'nombre',   label:'nombre'},
        {tt:'th', flag:1, tclass:'col2', tmpl: 'template1', val:'mail',     label:'mail'},
        {tt:'th', flag:1, tclass:'col3', tmpl: 'template1', val:'tel',      label:'telefono'},
        {tt:'th', flag:1, tclass:'col3', tmpl: 'template4', val:'edit',     label:'editar'},
    ],

    buildTableRowTemplates:{
        template1 : _.template("<td name='<%= val %>' class='<%= tclass %>' ><%= value %></td>"),
        template2 : _.template("<td name='<%= val %>' class='<%= tclass %>' ><input name=tselect type=checkbox class=tselect ></td>"),
        template3 : _.template("<td name='<%= val %>' class='<%= tclass %>' ><button class='btn-link tlink' title='editar item'><%= value %></button></td>"),
        template4 : _.template("<td name='<%= val %>' class='<%= tclass %>' ><button type='button' class='btn btn-default btn-sm tedit' title='edit'><span class='glyphicon glyphicon-edit'></span></button></td>")
    },

    editTemplate: _.template(
            '<form class="form-inline" role="form">' + 
            "<td><input name=tselect type=checkbox class=tselect ></td>" + 
            "<td><input type='text' class='form-control' name='nombre' value='<%= nombre %>'/></td>" + 
            "<td><input type='text' class='form-control' name='mail' value='<%= mail %>'/></td>" + 
            "<td><input type='text' class='form-control' name='tel' value='<%= tel %>'/></td>" +
            "<td><button type='button' class='btn btn-default btn-sm taccept' title='edit'><span class='glyphicon glyphicon-ok'></span></button></td>" +
            '</form>'
    ),

    events: {
        'change'        : 'change',
        'click .tedit'  : 'editRow',
        'click .taccept': 'updateRow',
    },

    addRow: function () {
        var self = this;
        console.log('addRow');
    },

    editRow: function () {
        var self = this;
        console.log('editRow');
        var rowrender = self.editTemplate(self.model.toJSON());
        $(self.el).html(rowrender);
        return false;
    },

    change: function (event) {

        console.log('change');
        var target = event.target;
        var change = {};
        change[target.name] = target.value;
        this.model.set(change);
    },

    updateRow: function () {
        console.log('update');
        var self = this;
        self.render();
        return false;
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
        console.log(tabledata);
        $(self.el).html(tabledata);
        return self;
    }
});




var Person = Backbone.Model.extend({
    urlRoot: "/persona",
    whoami: 'Model: persona',
    idAttribute: "_id",

   initialize: function () {
    },

    defaults: {
        _id: null,
        item:'',
        nombre:'nombre',
        mail:'mail',
        tel:'tel'
    }
});

var PersonCollection = Backbone.Collection.extend({

    model: Person,
    
    initialize: function (model, options) {
    },

    url: "/persons"

});


var collection = [
  {
    item:1,
    nombre:'juan',
    mail:'jjjuan@gmail.com',
    tel:'444555222'
  },
  {
    item:2,
    nombre:'maria',
    mail:'mmmaria@gmail.com',
    tel:'444555222'
  },
  {
    item:3,
    nombre:'david',
    mail:'dddavid@gmail.com',
    tel:'444555222'
  },
  {
    item:4,
    nombre:'goliat',
    mail:'gggoliat@gmail.com',
    tel:'444555222'
  }
];

// creando una coleccion de person(s)
var persons = new PersonCollection(collection);

$('.addrow').on('click',function(){

    var maxitem = persons.max(function(elem){
        console.log(elem.get('item'));
        return elem.get('item');
    });

    persons.add(new Person({item: maxitem.get('item') + 1 }));
});

$('.show').on('click',function(){
    var template = _.template("<div>item: <%= item %> / nombre: <%= nombre %> / mail: <%= mail %> / tel: <%= tel %></div>");
    $('.rendercollection').html('');

    persons.each(function(person){
        $('.rendercollection').append(template(person.toJSON()));
    });

});

var renderTable = function(){
    console.log('render table BEGINS');

    var tableview = new TableView({model: persons, el: $('#build-table') });

    tableview.render();

};

var verError = function (obj, error){
    //find every Tutorial and print the author
    console.log('hay un error [%s]',typeof obj);
    inspect(obj,0,'inspect');
};
var parseXml = function (xml){
    //find every Tutorial and print the author
  $(xml).find("Item").each(function(){
    var  id = $(this).find('IdEvento').text();
    var  title = $(this).find('Titulo').text();
    console.log('id:[%s] tit:[%s]',id, title)
  });

  // Output:
  // The Reddest
  // The Hairiest
  // The Tallest
  // The Fattest
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


var fetchEntries = function  (argument) {
    $.ajax({
        type: "GET",
        url: "/agendacultural",
        dataType: "xml",
        success: parseXml,
        error:verError
    });
};

$(function(){
  renderTable();
  //fetchEntries();
});
