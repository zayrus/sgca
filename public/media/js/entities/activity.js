MediaManager.module("Entities", function(Entities, MediaManager, Backbone, Marionette, $, _){

    Entities.Activity = Backbone.Model.extend({
        urlRoot: "/activities/controller",
        whoami: 'activity:backboneModel ',
        idAttribute: "_id",

       initialize: function () {
        },

        defaults: {
            _id: null,
            eventname:'',
            data:{},
            query:{},
        }
    });

    Entities.ActivityCollection = Backbone.Collection.extend({

        model: Entities.Activity,
        
        initialize: function (model, options) {
        },

        url: "/activities"
    });

});


