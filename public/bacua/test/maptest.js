
/*
var element = document.getElementById("map");


var map = new google.maps.Map(element, {

     center: new google.maps.LatLng(-34.60833, -58.3970669),

     zoom: 16,

     mapTypeId: "OSM",

     mapTypeControl: false,

     streetViewControl: false

 });


map.mapTypes.set("OSM", new google.maps.ImageMapType({

   getTileUrl: function(coord, zoom) {

    return "http://tile.openstreetmap.org/" + zoom + "/" + coord.x + "/" + coord.y + ".png";

 },

 tileSize: new google.maps.Size(256, 256),

 name: "OpenStreetMap",

 maxZoom: 18

}));

*/


function initialize() {
    var mapOptions = {
      center: new google.maps.LatLng(-34.397, 150.644),
      zoom: 8,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    var map = new google.maps.Map(document.getElementById("map-canvas"),
        mapOptions);
  }
  
google.maps.event.addDomListener(window, 'load', initialize);


