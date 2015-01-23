var rendertree= function(settings){
    var root = settings.root;

    var diameter = 1020;
    var tree = d3.layout.tree()
        .size([360, diameter / 2 - 150])
        .separation(function(a, b) { return (a.parent == b.parent ? 1 : 2) / a.depth; });

    var diagonal = d3.svg.diagonal.radial()
        .projection(function(d) { return [d.y, d.x / 180 * Math.PI]; });

    var svg = d3.select(settings.selector).append("svg")
        .attr("width", diameter)
        .attr("height", diameter - 80)
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
};
var renderp = function(){
  var dataset = [1,2,3,4];
  d3.select('div.container').selectAll('p')
    .data(dataset)
    .enter()
    .append('p')
    .html(function(d){ return 'Dato: <input type=text value='+d+ '>'}).style('color','green');
};

var circles_6_10 = function(){
      //Width and height
      var w = 500;
      var h = 50;
      
      //Data
      var dataset = [ 5, 10, 15, 20, 25 ];
      
      //Create SVG element
      var svg = d3.select("body")
            .append("svg")
            .attr("width", 500)
            .attr("height", 50);

      var circles = svg.selectAll("circle")
          .data(dataset)
          .enter()
          .append("circle");

      circles.attr("cx", function(d, i) {
            return (i * 50) + 25;
          })
           .attr("cy", h/2)
           .attr("r", function(d) {
            return d;
           });
};
var scatter_6_24 = function(){
      //Width and height
      var w = 500;
      var h = 100;
      
      var dataset = [
              [5, 20], [480, 90], [250, 50], [100, 33], [330, 95],
              [410, 12], [475, 44], [25, 67], [85, 21], [220, 88]
              ];
  
      //Create SVG element
      var svg = d3.select("body")
            .append("svg")
            .attr("width", w)
            .attr("height", h);

      svg.selectAll("circle")
         .data(dataset)
         .enter()
         .append("circle")
         .attr("cx", function(d) {
            return d[0];
         })
         .attr("cy", function(d) {
            return d[1];
         })
         .attr("r", function(d) {
            return Math.sqrt(h - d[1]);
         });

      svg.selectAll("text")
         .data(dataset)
         .enter()
         .append("text")
         .text(function(d) {
            return d[0] + "," + d[1];
         })
         .attr("x", function(d) {
            return d[0];
         })
         .attr("y", function(d) {
            return d[1];
         })
         .attr("font-family", "sans-serif")
         .attr("font-size", "11px")
         .attr("fill", "red");
};

$(function(){
	console.log('opened');
	//rendertree({selector: 'body', root: window.opener.utils.d3treegraph});
  //renderp();
  //circles_6_10();
  scatter_6_24();
});
