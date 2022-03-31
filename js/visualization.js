
const width = 960,
    height = 500;

var projection = d3.geoMercator()
    .center([109.25, 42.3])
    .scale(50000)
    .rotate([-180,0]);

var svg = d3.select("#vis-container").append("svg")
    .attr("width", width)
    .attr("height", height);

var path = d3.geoPath()
    .projection(projection);

var g = svg.append("g");

// load and display massachusetts

d3.json("data/mass_counties.json").then(function(topology) {

    g.selectAll("path")
       .data(topojson.feature(topology, topology.objects.cb_2015_massachusetts_county_20m).features)
       .enter().append("path")
       .attr("d", path);

});


/*

d3.json("data/world-110m2.json").then(function(topology) {

    g.selectAll("path")
       .data(topojson.feature(topology, topology.objects.countries).features)
       .enter().append("path")
       .attr("d", path);

});
*/

var zoom = d3.zoom()
    .scaleExtent([1, 8])
    .on('zoom', function(event) {
      g.selectAll('path')
       .attr('transform', event.transform);
});

svg.call(zoom);

