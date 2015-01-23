window.AssetView = Backbone.View.extend({
    /**
     *  Constructor en main.js:
     *        new AssetView({{model: asset})
     *
     */

    whoami:'AssetView',

    initialize: function () {
        this.render();

    },

    render: function () {
        //Renderizar el modelo usando la vista template 
        $(this.el).html(this.template(this.model.toJSON()));
        //recuperar el array de versions
        
            //var vers=asset.get("versions");
            var vers=this.model.get("versions");
            len=vers.length;
            //inicializar el desde / hasta del for
            // ejecutar el for para cada elemento del array, mandando a este como 'model'
            //console.log("valor de longitud del for: "+len);
            for (var i = len-1; i >=0 ; i--) {
                //var version = vers[i];

                $('#versionslist',this.el).append(new AssetVersionListItemView({model: vers[i]}).render().el);
                //console.log("dentro del ciclo:"+vers[i].name);
            }



        return this;
    },

    events: {
        
        "change"                 : "change",
        "click .save"            : "beforeSave",
        "click .delete"          : "deleteAsset",
        "dragover #picture"      : "dragoverHandler",
        "drop #picture"          : "dropHandler"
        
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
        //utils.showAlert('Success!', 'name:['+target.name+'] value:['+target.value+'] key:['+target.id+']', 'alert-success');

        // Run validation rule (if any) on changed item
        var check = this.model.validateItem(target.id);
        if (check.isValid === false) {
            utils.addValidationError(target.id, check.message);
        } else {
            // OjO: mantengo la variable eventdate en paralelo con eventdatestr
            //      eventdate es la representacion numerica de Date
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
        this.saveAsset();
        return false;
    },

    saveAsset: function () {
        var self = this;
        //console.log('before save');
        this.model.save(null, {
            success: function (model) {
                self.render();

                utils.approuter.navigate('activos/' + model.id, false);
                utils.showAlert('Success!', 'Asset saved successfully', 'alert-success');
            },
            error: function () {
                utils.showAlert('Error', 'An error occurred while trying to delete this item', 'alert-error');
            }
        });
    },

    deleteAsset: function () {
        this.model.destroy({
            success: function () {
                alert('Asset deleted successfully');
                window.history.back();
            }
        });
        return false;
    },


    dragoverHandler: function (event) {
        var e = event.originalEvent;
        e.stopPropagation();
        e.preventDefault();
        console.log('dragoverHandler:assetdetails');
    },

    dropHandler: function (event) {
        var e = event.originalEvent;
        var currentasset = this.model;
        var assetview = this;
        e.stopPropagation();
        e.preventDefault();
        e.dataTransfer.dropEffect = 'copy';
        
        $('#uplprogressbar').css({'width':'0%'});
        console.log('dropHandler:assetdetails');

        this.uploadingfiles = e.dataTransfer.files;

        var urlstr = this.model.get('urlpath');

        var folder = urlstr.substring(5,urlstr.lastIndexOf('/'));
        // sbstr(comienzo, cantchars)
        // substring(comienzo,fin)

         //Use FormData to send the files
        var formData = new FormData();

         //append the files to the formData object
         //if you are using multiple attribute you would loop through 
         //but for this example i will skip that
        formData.append('loadfiles', this.uploadingfiles[0]);
        formData.append('folder',folder);
        //comienzo del objeto ajax.
        var xhr = new XMLHttpRequest();
        
        xhr.open('POST', '/files');
        xhr.onload = function() {
            var srvresponse = JSON.parse(xhr.responseText);
            var filelink = '<a href="'+srvresponse.urlpath+'" >'+srvresponse.uploaded+'</a>'
            console.log(xhr.responseText);
            $('#uplprogressbar').css({'width':'100%'});
            $('#uploaded').html(filelink);
            // create new asset-entry

            currentasset.get('versions').push(srvresponse.fileversion);
            currentasset.set('name',srvresponse.name);
            currentasset.set('urlpath',srvresponse.urlpath);
            assetview.beforeSave();

        };
        xhr.upload.onprogress = function(event) {
            if (event.lengthComputable) {
                    var complete = (event.loaded / event.total * 100 | 0);
                    //updates a <progress> tag to show upload progress
                    $('#uplprogressbar').css({'width':complete+'%'});
            }
        };
        xhr.send(formData);
    },



});

window.AssetVersionListItemView = Backbone.View.extend({

    tagName: "li",
    className:"",
    
    initialize: function () {
        //this.model.bind("change", this.render, this);
        //this.model.bind("destroy", this.close, this);
    },

    render: function () {
        $(this.el).html(this.template(this.model));
        //console.log("dentro de render, modelo: "+this.model.name);
        return this;
    }

});