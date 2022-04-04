// print first 10 rows to console
d3.csv("/data/Line,_and_Stop.csv").then((data) => {
  // d3.csv parses a csv file and passes the data
  // to an anonymous function. Note how we build
  // our visual inside of this anonymous function

  // let's check our data

  for (let i = 0; i < 10; i++) {
    console.log(data[i]);
  }
});

//MAP
const width1 = 500,
    height1 = 600;

var projection = d3.geoMercator()
    .center([109.07, 42.35])
    .scale(80000)
    .rotate([-180,0]);

var mapsvg = d3.select("#vis-container").append("svg")
    .attr("width", width1)
    .attr("height", height1);

var path = d3.geoPath()
    .projection(projection);

var g = mapsvg.append("g");

//colors for station points
const station_color = d3.scaleOrdinal()
                .domain(["red", "orange", "green", "blue"])
                .range(["red", "orange", "green", "blue"]);

// load and display massachusetts

d3.json("data/mass_counties.json").then(function(topology) {

    g.selectAll("path")
       .data(topojson.feature(topology, topology.objects.cb_2015_massachusetts_county_20m).features)
       .enter().append("path")
       .attr("d", path)
       .style("fill", "black");

// load and display the stations and their names
    d3.csv("data/station_locations.csv").then(function(data) {


        //adding station points
        g.selectAll("circle")
        .data(data)
        .enter()
        .append("circle")
        .attr("cx", function(d) {
            return projection([d.X, d.Y])[0];
         })
        .attr("cy", function(d) {
            return projection([d.X, d.Y])[1];
         })
        .attr("r", 5)
        .style("fill", function(d){return station_color(d.line_color) });
        //.style("fill", "red");

        //Adding text for station names
        g.selectAll("text")
        .data(data)
        .enter()
        .append("text")
        .attr("x", function(d) {
            return projection([d.X, d.Y])[0];
        })
        .attr("y", function(d) {
            return projection([d.X, d.Y])[1];
        })
        // place text at bottom of point
        .attr("dy", -1) // set y position of bottom of text
        .style("fill", "white") // fill the text with the colour black
        .attr("text-anchor", "middle") // set anchor y justification
        .text(function(d) {return d.stop_name;})
        .attr("font-size", 10); ;
    });

});

var k = 1;

var zoom = d3.zoom()
    .scaleExtent([1, 8])
    .on('zoom', function(event) {
    g.selectAll('path')
        .attr('transform', event.transform);

    g.selectAll("circle")
        .attr('transform', event.transform)
        .attr("r", 5/event.transform.k)
        .attr("stroke-width", 3/event.scale);

    g.selectAll("text")
        .attr('transform', event.transform)
        .attr("font-size", 10/event.transform.k); 

});

mapsvg.call(zoom);




//------------------------------------------------------------------------------------------------------------------
// PIE CHART

// piechart code used from https://d3-graph-gallery.com/graph/pie_annotation.html

// set the dimensions and margins of the graph
const width = 600,
    height = 450,
    margin = 40;

// The radius of the pieplot is half the width or half the height (smallest one). I subtract a bit of margin.
const radius = Math.min(width, height) / 2 - margin

// append the svg object to the div
const svg = d3.select("#vis-container")
  .append("svg")
    .attr("width", width)
    .attr("height", height)
    .append("g")
    .attr("transform", `translate(${width / 2}, ${height / 2})`);

// Create dummy data
var dummy = {Morning: 35, MidDay: 20, Afternoon:15, Evening:25, Night:5}

// set the color scale
const color = d3.scaleOrdinal()
.range(["#eff3ff", "#bdd7e7", "#6baed6", "#3182bd", "#08519c"])  

// Compute the position of each group on the pie:
const pie = d3.pie()
  .value(function(d) {return d[1]}).sort(null)
const data_ready = pie(Object.entries(dummy))
// Now I know that group A goes from 0 degrees to x degrees and so on.

// shape helper to build arcs:
const arcGenerator = d3.arc()
  .innerRadius(0)
  .outerRadius(radius)

// Build the pie chart: Basically, each part of the pie is a path that we build using the arc function.
svg
  .selectAll('mySlices')
  .data(data_ready)
  .join('path')
    .attr('d', arcGenerator)
    .attr('fill', function(d){ return(color(d.data[0])) })
    .attr("stroke", "black")
    .style("stroke-width", "2px")
    .style("opacity", 0.7)

// Now add the annotation. Use the centroid method to get the best coordinates
svg
  .selectAll('mySlices')
  .data(data_ready)
  .join('text')
  .text(function(d){ return d.data[1] + "%"})
  .attr("transform", function(d) { return `translate(${arcGenerator.centroid(d)})`})
  .style("text-anchor", "middle")
  .style("font-size", 17)

// legend code from https://d3-graph-gallery.com/graph/custom_legend.html

// Handmade legend
// Circles
svg.append("circle").attr("cx",200).attr("cy",80).attr("r", 6).style("fill", "#eff3ff")
svg.append("circle").attr("cx",200).attr("cy",100).attr("r", 6).style("fill", "#bdd7e7")
svg.append("circle").attr("cx",200).attr("cy",120).attr("r", 6).style("fill", "#6baed6")
svg.append("circle").attr("cx",200).attr("cy",140).attr("r", 6).style("fill", "#3182bd")
svg.append("circle").attr("cx",200).attr("cy",160).attr("r", 6).style("fill", "#08519c")
// Texts
svg.append("text").attr("x", 220).attr("y", 80).text("Morning").style("font-size", "15px").attr("alignment-baseline","middle")
svg.append("text").attr("x", 220).attr("y", 100).text("Mid-Day").style("font-size", "15px").attr("alignment-baseline","middle")
svg.append("text").attr("x", 220).attr("y", 120).text("Afternoon").style("font-size", "15px").attr("alignment-baseline","middle")
svg.append("text").attr("x", 220).attr("y", 140).text("Evening").style("font-size", "15px").attr("alignment-baseline","middle")
svg.append("text").attr("x", 220).attr("y", 160).text("Night").style("font-size", "15px").attr("alignment-baseline","middle")
//------------------------------------------------------------------------------------------------------------------

  d3.csv("/data/Line,_and_Stop.csv").then((data) => {
    // d3.csv parses a csv file and passes the data
    // to an anonymous function. Note how we build
    // our visual inside of this anonymous function
  
    // let's check our data
  
    var tableData = [];
  
    for (let i = 0; i < 10; i++) {
      let row = [];
      row["Station"] = data[i]["stop_name"];
      row["Line(s)"] = data[i]["route_name"];
      row["Ons"] = data[i]["average_ons"];
      row["Offs"] = data[i]["average_offs"];
      row["Average Flow"] = data[i]["average_flow"];
  
      tableData.push(row);
    }
    console.log(tableData);
  
    // Create table
    var table = d3.select("#table-holder").append("table");
    var thead = table.append("thead");
    var tbody = table.append("tbody");
  
    var columns = ["Station", "Line(s)", "Ons", "Offs", "Average Flow"];
  
    thead.append("tr")
      .selectAll("th")
      .data(columns)
      .enter()
      .append("th")
      .text(function(d,i){
        return d;
      })
  
    var rows = tbody.selectAll("tr")
      .data(tableData)
      .enter()
      .append("tr");
  
    var cells = rows.selectAll("td")
      .data(function(row) {
        return columns.map(function(column) {
          return {
            column:column,
            value:row[column]
          }
        })
      })
      .enter()
      .append("td")
      .text(function(d,i) {
        return d.value;
      })
  
      
  });

