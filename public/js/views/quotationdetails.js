window.QuotationView = Backbone.View.extend({
    /**
     *  Constructor en main.js:
     *        new QuotationView({{model: quotation})
     *
     */
    whoami:'QuotationView',

    initialize: function () {
        //alert('QuotationView: project:['+ this.project.denom+']');
        this.render();
    },

    render: function () {
        $(this.el).html(this.template(this.model.toJSON()));
        return this;
    },

    /**
     * Scope of events: Events declared in a view use the view’s `el` element to wire up the events. 
     * Since the `el` in this example is being generated by the view, as a `ul` tag, 
     * the click event is wired up to all of the <a> tags in each of the <li> tags.     
    */

    events: {
        "change .selresources" : "selectchange",
        "change"            : "change",
        "show #quoteViewer" : "showresources",
        "hide #quoteViewer" : "hideresources",
        "click .save"       : "beforeSave",
        "click .delete"     : "deleteNode",
        "click .clonar"     : "clone",
        "click .browse"     : "browse",
        "click .vista"      : "vista",
    },

    selectchange: function(event){
        if(event.target.checked){
            if(_.indexOf(this.selectedResources,event.target.value!=-1)) this.selectedResources.push(event.target.value);
        }else{
            this.selectedResources =_.without(this.selectedResources,event.target.value);
        }
        //alert(this.selectedResources);
    },

    change: function (event) {
        /**
         *  event:
         *   event.target.name: model property
         *   event.target.value: model value
         *   event.target.id model key
         *  
         *   this.model.set( {prop1:newValue1, prop2,newValue2 }  )
         */

        // Remove any existing alert message
        utils.hideAlert();

        // Apply the change to the model
        var target = event.target;
        var change = {};
        change[target.name] = target.value;
        this.model.set(change);
        utils.showAlert('Success!', 'name:['+target.name+'] value:['+target.value+'] key:['+target.id+']', 'alert-success');

        // Run validation rule (if any) on changed item
        var check = this.model.validateItem(target.id);
        if (check.isValid === false) {
            utils.addValidationError(target.id, check.message);
        } else {
           utils.removeValidationError(target.id);
        }
    },

    beforeSave: function () {
        var self = this;
        var check = this.model.validateAll();
        if (check.isValid === false) {
            utils.displayValidationErrors(check.messages);
            return false;
        }
        if(this.selectedResources){
            console.log('hay selected resources!');
            this.model.setResourceList(this.selectedResources);
        }
        this.saveNode();
        return false;
    },

    saveNode: function () {
        var self = this;
        this.model.save(null, {
            success: function (model) {
                self.render();
                app.navigate('requisitorias/' + model.id, false);
                utils.showAlert('Exito!', 'El nodo se actualizó correctamente', 'alert-success');
            },
            error: function () {
                utils.showAlert('Error', 'Ocurrió un error al intentar actualizar este nodo', 'alert-error');
            }
        });
    },

    deleteNode: function () {
        this.model.destroy({
            success: function () {
                alert('El nodo se eliminó correctamente');
                window.history.back();
            }
        });
        return false;
    },

    clone: function () {
        var self = this;
        var check = this.model.validateAll();
        if (check.isValid === false) {
            utils.displayValidationErrors(check.messages);
            return false;
        }
        app.navigate('requisitorias/add', false);
        this.model.unset('id',{ silent : true });
        this.model.unset('_id',{ silent : true });
        this.saveNode();
        return false;
    },

    vista: function () {
        window.open('/requisitoria.html#req/'+this.model.id);
        //utils.approuter.navigate(, true);
        return false;
    },

    browse: function () {
        //dao.quotationsQueryData().setProject(this.model.get('project')._id,this.model.get('denom'));
        utils.approuter.navigate('navegar/requisitorias', true);
        return false;
    },

    showresources: function () {
        var query = {project: dao.quotationsQueryData().getProject()},
            resourceList = new ResourceCollection([], {quotation: this.model});

        this.selectedResources = this.model.getResourceList();

        resourceList.fetch({
            data: query,
            type: 'post',
            //data: $.param({rubro:'tecnica'}),
            //data: JSON.stringify({rubro:'tecnica'}),
            success: function() {
                $("#resourcecallback").html(new QuotationResourceView({model: resourceList}).el);
            }
        });

    },

    hideresources: function(){
        //this.model.set({quote:utils.editor.getContent('quotetext')});
    }
 
});