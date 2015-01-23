window.ResourceView = Backbone.View.extend({
    /**
     *  Constructor en main.js:
     *        new ResourceView({{model: resource})
     *
     */
    whoami:'ResourceView',

    initialize: function () {
        console.log('[%s] BEGINS 1',this.whoami);
        this.render();
        console.log('[%s] BEGINS 2',this.whoami);
        this.assetlist();
        console.log('[%s] BEGINS 3',this.whoami);
    },

    render: function () {
        $(this.el).html(this.template(this.model.toJSON()));
        return this;
    },

    events: {
        "change"            : "change",
        "show #quoteViewer" : "showquote",
        "hide #quoteViewer" : "hidequote",
        "click .save"       : "beforeSave",
        "click .delete"     : "deleteNode",
        "click .clonar"     : "clone",
        "click .browse"     : "browse",
        "dragover"          : "dragoverHandler",
        "drop #picture"     : "dropHandler"
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
        this.saveNode();
        return false;
    },

    saveNode: function () {
        var self = this;
        this.model.save(null, {
            success: function (model) {
                self.render();
                app.navigate('recursos/' + model.id, false);
                utils.showAlert('Success!', 'Node saved successfully', 'alert-success');
            },
            error: function () {
                utils.showAlert('Error', 'An error occurred while trying to delete this item', 'alert-error');
            }
        });
    },

    deleteNode: function () {
        this.model.destroy({
            success: function () {
                alert('Node deleted successfully');
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
        app.navigate('recursos/add', false);
        this.model.unset('id',{ silent : true });
        this.model.unset('_id',{ silent : true });
        this.saveNode();
        return false;
    },

    browse: function () {
        utils.approuter.navigate('navegar/recursos', true);
        return false;
    },

    showquote: function () {
        $('#quotecallback').html(new ResourceQuoteView({model: this.model}).el);
        utils.editor.render('nicpanel','quotetext',this.model.get('quote'));
        //return false;
    },

    hidequote: function(){
        this.model.set({quote:utils.editor.getContent('quotetext')});
    },
 
    dragoverHandler: function (event) {
        console.log('dragoverHandler:resourcedetails');
        var e = event.originalEvent;
        e.stopPropagation();
        e.preventDefault();
    },

    dropHandler: function (event) {
        var self = this,
            resmodel = this.model,
            e = event.originalEvent
            asset = new Asset(),
            formData = new FormData(),
            folder = asset.assetFolder();
        
        e.stopPropagation();
        e.preventDefault();
        e.dataTransfer.dropEffect = 'copy';

        this.uploadingfiles = e.dataTransfer.files;

        $('#uplprogressbar').css({'width':'0%;'});
        console.log('dropHandler:resourcedetails');

        formData.append('loadfiles', this.uploadingfiles[0]);
        formData.append('folder',folder);

        var xhr = new XMLHttpRequest();

        xhr.open('POST', '/files');
        xhr.onload = function() {
            var srvresponse = JSON.parse(xhr.responseText);
            var filelink = '<a href="'+srvresponse.urlpath+'" >'+srvresponse.name.substr(0,20)+'</a>'

            console.log('xhr.onload:resourcedetails: '+filelink);

            $('#uplprogressbar').css({'width':'100%;'});
            $('#uploaded').html(filelink);

            asset.updateAsset(srvresponse, resmodel, function(what){
                utils.showAlert('Success', what, 'alert-success');
                self.assetlist();
            });

        };
        xhr.upload.onprogress = function(event) {
            console.log('xhr.onprogres:resourcedetails: !!! ');
            if (event.lengthComputable) {
                var complete = (event.loaded / event.total * 100 | 0);
                $('#uplprogressbar').css({'width':complete+'%'});
            }
        };
        xhr.send(formData);
    },

    assetlist: function(){
        var resource = this.model;
        resource.loadassets(function(assetList){
            if(assetList.length>0){
                $('#assets').html('');
                assetList.each(function(asset){
                    console.log('assetviewsuccess: [%s]',asset.get('slug'));
                    var assetAccordionView = new AssetAccordionView({model:asset});
                    $('#assets').append(assetAccordionView.render().el);
                });
            }
        });
    }


});