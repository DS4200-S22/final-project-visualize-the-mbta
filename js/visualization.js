//This is filler -- delete it and start coding your visualization tool here
d3.select("#vis-container")
  .append("text")
  .attr("x", 20)
  .attr("y", 20)
  .text("Hello World!");

//d3.csv("/data/Line,_and_Stop.csv", function (data) {
//console.log(data);
//});

// d3.csv("/data/Line,_and_Stop.csv").then((data) => {
//   // d3.csv parses a csv file and passes the data
//   // to an anonymous function. Note how we build
//   // our visual inside of this anonymous function

//   // let's check our data

//   for (let i = 0; i < 10; i++) {
//     console.log(data[i]);
//   }
// });

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