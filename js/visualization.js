//MAP
const width1 = 500,
  height1 = 600;

//defining projection and map setup

let projection = d3
  .geoMercator()
  .center([109.07, 42.35])
  .scale(80000)
  .rotate([-180, 0]);

let mapsvg = d3
  .select("#vis-container")
  .append("svg")
  .attr("width", width1)
  .attr("height", height1);

let path = d3.geoPath().projection(projection);

let g = mapsvg.append("g");

//colors for station points
const station_color = d3
  .scaleOrdinal()
  .domain(["red", "orange", "green", "blue"])
  .range(["red", "orange", "green", "blue"]);

// array of selected station names
let selected_stations = [];

// array of selected lines
let selected_lines = [];

// function that handles selecting and unselecting
function select_click() {
  if (d3.select(this).style("stroke") == "yellow") {
    //if already selected
    d3.select(this).style("stroke", "");
    // remove station from array
    let indexOfStation = selected_stations.indexOf(
      this.getAttribute("station")
    );
    selected_stations.splice(indexOfStation, 1);
    // remove line from array
    let indexOfLine = selected_stations.indexOf(this.getAttribute("line"));
    selected_lines.splice(indexOfLine, 1);
  } else {
    d3.select(this)
      .style("stroke", "yellow")
      .style("stroke-width", this.r / 3);
    // adds station to array
    selected_stations.push(this.getAttribute("station"));
    // adds line to array
    selected_lines.push(this.getAttribute("line"));
  }
  drawBar();
  drawTable();
  drawPie();
}

// load and display massachusetts
d3.json("data/mass_counties.json").then(function (topology) {
  g.selectAll("path")
    .data(
      topojson.feature(
        topology,
        topology.objects.cb_2015_massachusetts_county_20m
      ).features
    )
    .enter()
    .append("path")
    .attr("d", path)
    .style("fill", "black");

  // load and display the stations and their names
  d3.csv("data/station_locations.csv").then(function (data) {
    //adding station points
    g.selectAll("circle")
      .data(data)
      .enter()
      .append("circle")
      .attr("cx", function (d) {
        return projection([d.X, d.Y])[0];
      })
      .attr("cy", function (d) {
        return projection([d.X, d.Y])[1];
      })
      .attr("r", 5)
      // attribute which representing the corresponding station name to the circle
      .attr("station", function (d) {
        return d.stop_name;
      })
      // attribute which representing the corresponding line name to the circle
      .attr("line", function (d) {
        return d.line_color;
      })
      .style("fill", function (d) {
        return station_color(d.line_color);
      })
      //adding click selection function
      .on("click", select_click);

    //adding text for station names
    g.selectAll("text")
      .data(data)
      .enter()
      .append("text")
      .attr("x", function (d) {
        return projection([d.X, d.Y])[0];
      })
      .attr("y", function (d) {
        return projection([d.X, d.Y])[1];
      })

      // place text at above
      .attr("dy", -1)
      .style("fill", "white")
      .attr("text-anchor", "middle")
      .attr("font-size", 10)
      .text(function (d) {
        return d.stop_name;
      });
  });
});

//zoom functionality added
let k = 1;

let zoom = d3
  .zoom()
  .scaleExtent([1, 8])
  .on("zoom", function (event) {
    g.selectAll("path").attr("transform", event.transform);

    g.selectAll("circle")
      .attr("transform", event.transform)
      .attr("r", 5 / event.transform.k)
      .attr("stroke-width", 3 / event.transform.k);

    g.selectAll("text")
      .attr("transform", event.transform)
      .attr("font-size", 10 / event.transform.k);
  });

//calling zoom
mapsvg.call(zoom);

//------------------------------------------------------------------------------------------------------------------
// PIE CHART

// given array from selecting
let all_stations_array = [];
let total_flow = 0;
let AM_PEAK_flow = 0;
let EARLY_AM_flow = 0;
let EVENING_flow = 0;
let LATE_EVENING_flow = 0;
let MIDDAY_BASE_flow = 0;
let MIDDAY_SCHOOL_flow = 0;
let NIGHT_flow = 0;
let OFF_PEAK_flow = 0;
let PM_PEAK_flow = 0;
let VERY_EARLY_MORNING_flow = 0;
let time_period_name_array = ["AM_PEAK"];

// set the dimensions and margins of the graph
const width = 600,
  height = 600,
  margin = 70;

// The radius of the pieplot is half the width or half the height (smallest one). I subtract a bit of margin.
const radius = Math.min(width, height) / 2.5 - margin;

let svg = d3
  .select("#pie-container")
  .append("svg")
  .attr("width", width)
  .attr("height", height)
  .attr("id", "pie_svg")
  .append("g")
  .attr("transform", `translate(${width / 3}, ${height / 2})`);

function drawPie() {
  // remove svg to re-render
  d3.select("#pie_svg").remove();
  // render svg
  d3.csv("data/Line,_and_Stop.csv").then((data) => {

    for (let i = 0; i < 7920; i++) {
      time_period_name_array[i] = data[i]["time_period_name"];
    }

    for (let index = 0; index < data.length; index++) {
      if (all_stations_array.indexOf(data[index]["stop_name"]) == -1) {
        all_stations_array.push(data[index]["stop_name"]);
      }
    }

    let pie_stations = [];

    // show all stations if none are selected
    if (selected_stations.length == 0) {
      pie_stations = all_stations_array;
    } else {
      pie_stations = selected_stations;
    }

    // for-loop for number of stations
    for (let i = 0; i < pie_stations.length; i++) {
      let current_station = pie_stations[i];

      for (let index = 0; index < data.length; index++) {
        if (current_station == data[index]["stop_name"]) {
          // adds average flows to get total flow for all stations
          total_flow += parseInt(data[index]["average_flow"]);

          // add to individual time flows
          switch (data[index]["time_period_name"]) {
            case "AM_PEAK":
              AM_PEAK_flow += parseInt(data[index]["average_flow"]);
              break;
            case "EARLY_AM":
              EARLY_AM_flow += parseInt(data[index]["average_flow"]);
              break;
            case "EVENING":
              EVENING_flow += parseInt(data[index]["average_flow"]);
              break;
            case "LATE_EVENING":
              LATE_EVENING_flow += parseInt(data[index]["average_flow"]);
              break;
            case "MIDDAY_BASE":
              MIDDAY_BASE_flow += parseInt(data[index]["average_flow"]);
              break;
            case "MIDDAY_SCHOOL":
              MIDDAY_SCHOOL_flow += parseInt(data[index]["average_flow"]);
              break;
            case "NIGHT":
              NIGHT_flow += parseInt(data[index]["average_flow"]);
              break;
            case "OFF_PEAK":
              OFF_PEAK_flow += parseInt(data[index]["average_flow"]);
              break;
            case "PM_PEAK":
              PM_PEAK_flow += parseInt(data[index]["average_flow"]);
              break;
            case "VERY_EARLY_MORNING":
              VERY_EARLY_MORNING_flow += parseInt(data[index]["average_flow"]);
              break;
            default:
              break;
          }
        }
      }
    }

    // piechart code used from https://d3-graph-gallery.com/graph/pie_annotation.html

    // append the svg object to the div
    svg = d3
      .select("#pie-container")
      .append("svg")
      .attr("width", width)
      .attr("height", height)
      .attr("id", "pie_svg")
      .append("g")
      .attr("transform", `translate(${width / 3}, ${height / 2})`);

    // Convert data to percentages
    let pieData = {
      VERY_EARLY_MORNING: percentRound(VERY_EARLY_MORNING_flow / total_flow),
      EARLY_AM: percentRound(EARLY_AM_flow / total_flow),
      AM_PEAK: percentRound(AM_PEAK_flow / total_flow),
      MIDDAY_BASE: percentRound(MIDDAY_BASE_flow / total_flow),
      MIDDDAY_SCHOOL: percentRound(MIDDAY_SCHOOL_flow / total_flow),
      PM_PEAK: percentRound(PM_PEAK_flow / total_flow),
      OFF_PEAK: percentRound(OFF_PEAK_flow / total_flow),
      EVENING: percentRound(EVENING_flow / total_flow),
      LATE_EVENING: percentRound(LATE_EVENING_flow / total_flow),
      NIGHT: percentRound(NIGHT_flow / total_flow),
    };

    function percentRound(p1) {
      return Math.round(p1 * 100);
    }

    // set the color scale
    const color = d3
      .scaleOrdinal()
      .range([
        "#fff100",
        "#ff8c00",
        "#e81123",
        "#ec008c",
        "#68217a",
        "#00188f",
        "#00bcf2",
        "#00b294",
        "#009e49",
        "#bad80a",
      ]);

    // Compute the position of each group on the pie:
    const pie = d3
      .pie()
      .value(function (d) {
        return d[1];
      })
      .sort(null);
    const data_ready = pie(Object.entries(pieData));
    // Now I know that group A goes from 0 degrees to x degrees and so on.

    // shape helper to build arcs:
    const arcGenerator = d3.arc().innerRadius(0).outerRadius(radius);

    // Build the pie chart: Basically, each part of the pie is a path that we build using the arc function.
    svg
      .selectAll("mySlices")
      .data(data_ready)
      .join("path")
      .attr("d", arcGenerator)
      .attr("fill", function (d) {
        return color(d.data[0]);
      })
      .attr("stroke", "black")
      .style("stroke-width", "2px")
      .style("opacity", 0.7);

    // Now add the annotation. Use the centroid method to get the best coordinates
    // Annotation code from: https://stackoverflow.com/questions/8053424/label-outside-arc-pie-chart-d3-js
    svg
      .selectAll("mySlices")
      .data(data_ready)
      .join("text")
      .text(function (d) {
        return d.data[1] + "%";
      })
      .attr("transform", function (d) {
        let c = arcGenerator.centroid(d);
        let x = c[0];
        let y = c[1];
        let h = Math.sqrt(x * x + y * y);
        let labelr = radius + 30;
        return "translate(" + (x / h) * labelr + "," + (y / h) * labelr + ")";
      })
      .style("text-anchor", "middle")
      .style("font-size", 9);

    // Title
    svg
      .append("text")
      .attr("x", 10)
      .attr("y", -220)
      .attr("text-anchor", "middle")
      .style("font-size", "20px")
      .style("font-weight", "bold")
      .text("Ridership Distribution by Time of Day");

    // legend code from https://d3-graph-gallery.com/graph/custom_legend.html

    // Circles
    svg
      .append("circle")
      .attr("cx", 200)
      .attr("cy", 80)
      .attr("r", 6)
      .style("fill", "#fff100");
    svg
      .append("circle")
      .attr("cx", 200)
      .attr("cy", 100)
      .attr("r", 6)
      .style("fill", "#ff8c00");
    svg
      .append("circle")
      .attr("cx", 200)
      .attr("cy", 120)
      .attr("r", 6)
      .style("fill", "#e81123");
    svg
      .append("circle")
      .attr("cx", 200)
      .attr("cy", 140)
      .attr("r", 6)
      .style("fill", "#ec008c");
    svg
      .append("circle")
      .attr("cx", 200)
      .attr("cy", 160)
      .attr("r", 6)
      .style("fill", "#68217a");
    svg
      .append("circle")
      .attr("cx", 200)
      .attr("cy", 180)
      .attr("r", 6)
      .style("fill", "#00188f");
    svg
      .append("circle")
      .attr("cx", 200)
      .attr("cy", 200)
      .attr("r", 6)
      .style("fill", "#00bcf2");
    svg
      .append("circle")
      .attr("cx", 200)
      .attr("cy", 220)
      .attr("r", 6)
      .style("fill", "#00b294");
    svg
      .append("circle")
      .attr("cx", 200)
      .attr("cy", 240)
      .attr("r", 6)
      .style("fill", "#009e49");
    svg
      .append("circle")
      .attr("cx", 200)
      .attr("cy", 260)
      .attr("r", 6)
      .style("fill", "#bad80a");
    // Texts
    svg
      .append("text")
      .attr("x", 220)
      .attr("y", 80)
      .text("Very Early Morning")
      .style("font-size", "15px")
      .attr("alignment-baseline", "middle");
    svg
      .append("text")
      .attr("x", 220)
      .attr("y", 100)
      .text("Early AM")
      .style("font-size", "15px")
      .attr("alignment-baseline", "middle");
    svg
      .append("text")
      .attr("x", 220)
      .attr("y", 120)
      .text("AM Peak")
      .style("font-size", "15px")
      .attr("alignment-baseline", "middle");
    svg
      .append("text")
      .attr("x", 220)
      .attr("y", 140)
      .text("Midday Base")
      .style("font-size", "15px")
      .attr("alignment-baseline", "middle");
    svg
      .append("text")
      .attr("x", 220)
      .attr("y", 160)
      .text("Midday School")
      .style("font-size", "15px")
      .attr("alignment-baseline", "middle");
    svg
      .append("text")
      .attr("x", 220)
      .attr("y", 180)
      .text("PM Peak")
      .style("font-size", "15px")
      .attr("alignment-baseline", "middle");
    svg
      .append("text")
      .attr("x", 220)
      .attr("y", 200)
      .text("Off Peak")
      .style("font-size", "15px")
      .attr("alignment-baseline", "middle");
    svg
      .append("text")
      .attr("x", 220)
      .attr("y", 220)
      .text("Evening")
      .style("font-size", "15px")
      .attr("alignment-baseline", "middle");
    svg
      .append("text")
      .attr("x", 220)
      .attr("y", 240)
      .text("Late Evening")
      .style("font-size", "15px")
      .attr("alignment-baseline", "middle");
    svg
      .append("text")
      .attr("x", 220)
      .attr("y", 260)
      .text("Night")
      .style("font-size", "15px")
      .attr("alignment-baseline", "middle");
  });
}
// Render first instance
drawPie();
//------------------------------------------------------------------------------------------------------------------
// TABLE
function drawTable() {
  d3.select("#tableObject").remove();
  d3.csv("data/Line,_and_Stop.csv").then((data) => {
    // d3.csv parses a csv file and passes the data
    // to an anonymous function. Note how we build
    // our visual inside of this anonymous function

    // let's check our data

    let tableData = [];

    for (let i = 0; i < data.length; i++) {
      let row = [];
      row["Station"] = data[i]["stop_name"];
      row["Line(s)"] = data[i]["route_name"];
      row["Ons"] = data[i]["average_ons"];
      row["Offs"] = data[i]["average_offs"];
      row["Average Flow"] = data[i]["average_flow"];

      let found = false;
      for (let k = 0; k < tableData.length; k++) {
        if (
          tableData[k]["Station"] == data[i]["stop_name"] &&
          tableData[k]["Line(s)"] == data[i]["route_name"]
        ) {
          tableData[k]["Ons"] =
            parseInt(tableData[k]["Ons"]) + parseInt(data[i]["average_ons"]);
          tableData[k]["Offs"] =
            parseInt(tableData[k]["Offs"]) + parseInt(data[i]["average_offs"]);
          tableData[k]["Average Flow"] =
            parseInt(tableData[k]["Average Flow"]) +
            parseInt(data[i]["average_flow"]);
          found = true;
          break;
        }
      }

      // only add to table if hasnt been found yet
      if (found == false) {
        tableData.push(row);
      }
    }

    // Filter tableData to selected_stations on the map
    let tableDataFiltered = [];
    for (let i = 0; i < selected_stations.length; i++) {
      for (let k = 0; k < tableData.length; k++) {
        if (selected_stations[i] == tableData[k]["Station"]) {
          tableDataFiltered.push(tableData[k]);
        }
      }
    }

    // Create table
    let table = d3
      .select("#table-container")
      .append("table")
      .attr("id", "tableObject");
    let thead = table.append("thead");
    let tbody = table.append("tbody");

    let columns = ["Station", "Line(s)", "Ons", "Offs", "Average Flow"];

    thead
      .append("tr")
      .selectAll("th")
      .data(columns)
      .enter()
      .append("th")
      .text(function (d, i) {
        return d;
      });

    let rows = tbody
      .selectAll("tr")
      .data(tableDataFiltered)
      .enter()
      .append("tr");

    let cells = rows
      .selectAll("td")
      .data(function (row) {
        return columns.map(function (column) {
          return {
            column: column,
            value: row[column],
          };
        });
      })
      .enter()
      .append("td")
      .text(function (d, i) {
        return d.value;
      });
  });
}
drawTable();

//------------------------------------------------------------------------------------------------------------------
// BAR CHART
// code used from https://d3-graph-gallery.com/graph/barplot_basic.html

// set the dimensions and margins of the graph
const barMargin = { top: 30, right: 30, bottom: 70, left: 100 },
  barWidth = 460 - barMargin.left - barMargin.right,
  barHeight = 400 - barMargin.top - barMargin.bottom;

// append the svg object to the body of the page
let barSvg = d3
  .select("#bar-container")
  .append("svg")
  .attr("width", barWidth + barMargin.left + barMargin.right)
  .attr("height", barHeight + barMargin.top + barMargin.bottom)
  .attr("id", "barSVG")
  .append("g")
  .attr("transform", `translate(${barMargin.left},${barMargin.top})`);

// Parse the Data
function drawBar() {
  d3.select("#barSVG").remove();

  barSvg = d3
    .select("#bar-container")
    .append("svg")
    .attr("width", barWidth + barMargin.left + barMargin.right)
    .attr("height", barHeight + barMargin.top + barMargin.bottom)
    .attr("id", "barSVG")
    .append("g")
    .attr("transform", `translate(${barMargin.left},${barMargin.top})`);

  d3.csv("data/Line,_and_Stop.csv").then(function (data) {
    // Calculate sum of flow for each station and store in array
    const newData = d3.rollups(
      data,
      (v) => d3.sum(v, (d) => d.average_flow),
      (d) => d.route_id
    );

    // Add color
    const barColor = d3
      .scaleOrdinal()
      .range(["#00843D", "#003DA5", "#ED8B00", "#DA291C"]);

    // X axis
    const x = d3
      .scaleBand()
      .range([0, barWidth])
      .domain(data.map((d) => d.route_id))
      .padding(0.2);
    barSvg
      .append("g")
      .attr("transform", `translate(0, ${barHeight})`)
      .call(d3.axisBottom(x))
      .selectAll("text")
      .attr("transform", "translate(10,0)")
      .style("text-anchor", "end")
      .attr("id", "barchart");

    // Add Y axis
    const y = d3.scaleLinear().domain([0, 7000000]).range([barHeight, 0]);
    barSvg.append("g").call(d3.axisLeft(y));

    // Bars
    barSvg
      .selectAll("mybar")
      .data(newData)
      .join("rect")
      .attr("x", (d) => x(d[0]))
      .attr("y", (d) => y(d[1]))
      .attr("width", x.bandwidth())
      .attr("height", (d) => barHeight - y(d[1]))
      .attr("fill", function (d, i) {
        return barColor(i);
      })
      .attr("stroke-width", function (d) {
        let name = d[0].toLowerCase();
        if (selected_lines.indexOf(name) !== -1) {
          return 3;
        } else {
          return 0;
        }
      })
      .attr("stroke", "black")
      .attr("id", "bars");

    // Bar Chart Axis
    // Axis Labels code from https://stackoverflow.com/questions/11189284/d3-axis-labeling

    // Title
    barSvg
      .append("text")
      .attr("x", barWidth / 2 - 30)
      .attr("y", 0 - barMargin.top / 2)
      .attr("text-anchor", "middle")
      .style("font-size", "20px")
      .style("font-weight", "bold")
      .text("Total Ridership by Line for Fall 2017-2019");

    // X Label
    barSvg
      .append("text")
      .attr("class", "x label")
      .attr("text-anchor", "end")
      .attr("x", barWidth - 120)
      .attr("y", barHeight + 50)
      .text("Line Name");

    // Y Label
    barSvg
      .append("text")
      .attr("class", "y label")
      .attr("text-anchor", "end")
      .attr("y", -80)
      .attr("x", -80)
      .attr("dy", ".75em")
      .attr("transform", "rotate(-90)")
      .text("Total Ridership");
  });
}
drawBar();
