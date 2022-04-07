//MAP
const width1 = 500,
  height1 = 600;

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
      .style("fill", function (d) {
        return station_color(d.line_color);
      });

    //Adding text for station names
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
      // place text at bottom of point
      .attr("dy", -1)
      .style("fill", "white")
      .attr("text-anchor", "middle")
      .text(function (d) {
        return d.stop_name;
      })
      .attr("font-size", 10);
  });
});

let k = 1;

let zoom = d3
  .zoom()
  .scaleExtent([1, 8])
  .on("zoom", function (event) {
    g.selectAll("path").attr("transform", event.transform);

    g.selectAll("circle")
      .attr("transform", event.transform)
      .attr("r", 5 / event.transform.k)
      .attr("stroke-width", 3 / event.scale);

    g.selectAll("text")
      .attr("transform", event.transform)
      .attr("font-size", 10 / event.transform.k);
  });

mapsvg.call(zoom);

//------------------------------------------------------------------------------------------------------------------
// PIE CHART

// print first 10 rows to console
let time_period_name_array = ["AM_PEAK"];
d3.csv("data/Line,_and_Stop.csv").then((data) => {
  // d3.csv parses a csv file and passes the data
  // to an anonymous function. Note how we build
  // our visual inside of this anonymous function

  // let's check our data

  for (let i = 0; i < 7920; i++) {
    time_period_name_array[i] = data[i]["time_period_name"];
  }

  // piechart code used from https://d3-graph-gallery.com/graph/pie_annotation.html

  // set the dimensions and margins of the graph
  const width = 700,
    height = 550,
    margin = 40;

  // The radius of the pieplot is half the width or half the height (smallest one). I subtract a bit of margin.
  const radius = Math.min(width, height) / 2 - margin;

  // append the svg object to the div
  const svg = d3
    .select("#vis-container")
    .append("svg")
    .attr("width", width)
    .attr("height", height)
    .append("g")
    .attr("transform", `translate(${width / 2}, ${height / 2})`);

  // calculating the percentages for the pie chart, live data being used
  let AM_PEAK_count = 0;
  let EARLY_AM_count = 0;
  let EVENING_count = 0;
  let LATE_EVENING_count = 0;
  let MIDDAY_BASE_count = 0;
  let MIDDAY_SCHOOL_count = 0;
  let NIGHT_count = 0;
  let OFF_PEAK_count = 0;
  let PM_PEAK_count = 0;
  let VERY_EARLY_MORNING_count = 0;

  for (let i = 0; i < time_period_name_array.length; i++) {
    switch (time_period_name_array[i]) {
      case "AM_PEAK":
        AM_PEAK_count++;
        break;
      case "EARLY_AM":
        EARLY_AM_count++;
        break;
      case "EVENING":
        EVENING_count++;
        break;
      case "LATE_EVENING":
        LATE_EVENING_count++;
        break;
      case "MIDDAY_BASE":
        MIDDAY_BASE_count++;
        break;
      case "MIDDAY_SCHOOL":
        MIDDAY_SCHOOL_count++;
        break;
      case "NIGHT":
        NIGHT_count++;
        break;
      case "OFF_PEAK":
        OFF_PEAK_count++;
        break;
      case "PM_PEAK":
        PM_PEAK_count++;
        break;
      case "VERY_EARLY_MORNING":
        VERY_EARLY_MORNING_count++;
        break;
      default:
        console.log("no  match in counting for pie chart");
    }
  }

  // Convert data to percentages
  let pieData = {
    AM_PEAK: percentRound(AM_PEAK_count),
    EARLY_AM: percentRound(EARLY_AM_count),
    EVENING: percentRound(EVENING_count),
    LATE_EVENING: percentRound(LATE_EVENING_count),
    MIDDAY_BASE: percentRound(MIDDAY_BASE_count),
    MIDDDAY_SCHOOL: percentRound(MIDDAY_SCHOOL_count),
    NIGHT: percentRound(NIGHT_count),
    OFF_PEAK: percentRound(OFF_PEAK_count),
    PM_PEAK: percentRound(PM_PEAK_count),
    VERY_EARLY_MORNING: percentRound(VERY_EARLY_MORNING_count),
  };

  function percentRound(p1) {
    return Math.round((p1 / data.length) * 100);
  }

  // set the color scale
  const color = d3
    .scaleOrdinal()
    .range([
      "#b1cb58",
      "#b9d16a",
      "#c2d67d",
      "#cbdc8f",
      "#d3e2a2",
      "#dce8b5",
      "#e5eec7",
      "#eef3da",
      "#f6f9ec",
      "black",
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
  svg
    .selectAll("mySlices")
    .data(data_ready)
    .join("text")
    .text(function (d) {
      return d.data[1] + "%";
    })
    .attr("transform", function (d) {
      return `translate(${arcGenerator.centroid(d)})`;
    })
    .style("text-anchor", "middle")
    .style("font-size", 17);

  // legend code from https://d3-graph-gallery.com/graph/custom_legend.html

  // Circles
  svg
    .append("circle")
    .attr("cx", 200)
    .attr("cy", 80)
    .attr("r", 6)
    .style("fill", "#b1cb58");
  svg
    .append("circle")
    .attr("cx", 200)
    .attr("cy", 100)
    .attr("r", 6)
    .style("fill", "#b9d16a");
  svg
    .append("circle")
    .attr("cx", 200)
    .attr("cy", 120)
    .attr("r", 6)
    .style("fill", "#c2d67d");
  svg
    .append("circle")
    .attr("cx", 200)
    .attr("cy", 140)
    .attr("r", 6)
    .style("fill", "#cbdc8f");
  svg
    .append("circle")
    .attr("cx", 200)
    .attr("cy", 160)
    .attr("r", 6)
    .style("fill", "#d3e2a2");
  svg
    .append("circle")
    .attr("cx", 200)
    .attr("cy", 180)
    .attr("r", 6)
    .style("fill", "#dce8b5");
  svg
    .append("circle")
    .attr("cx", 200)
    .attr("cy", 200)
    .attr("r", 6)
    .style("fill", "#e5eec7");
  svg
    .append("circle")
    .attr("cx", 200)
    .attr("cy", 220)
    .attr("r", 6)
    .style("fill", "#eef3da");
  svg
    .append("circle")
    .attr("cx", 200)
    .attr("cy", 240)
    .attr("r", 6)
    .style("fill", "#f6f9ec");
  svg
    .append("circle")
    .attr("cx", 200)
    .attr("cy", 260)
    .attr("r", 6)
    .style("fill", "black");
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

//------------------------------------------------------------------------------------------------------------------

d3.csv("data/Line,_and_Stop.csv").then((data) => {
  // d3.csv parses a csv file and passes the data
  // to an anonymous function. Note how we build
  // our visual inside of this anonymous function

  // let's check our data

  let tableData = [];

  for (let i = 0; i < 10; i++) {
    let row = [];
    row["Station"] = data[i]["stop_name"];
    row["Line(s)"] = data[i]["route_name"];
    row["Ons"] = data[i]["average_ons"];
    row["Offs"] = data[i]["average_offs"];
    row["Average Flow"] = data[i]["average_flow"];

    tableData.push(row);
  }

  // Create table
  let table = d3.select("#table-container").append("table");
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

  let rows = tbody.selectAll("tr").data(tableData).enter().append("tr");

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

//------------------------------------------------------------------------------------------------------------------
// bar chart
// code used from https://d3-graph-gallery.com/graph/barplot_basic.html

// set the dimensions and margins of the graph
const barMargin = { top: 30, right: 30, bottom: 70, left: 100 },
  barWidth = 460 - barMargin.left - barMargin.right,
  barHeight = 400 - barMargin.top - barMargin.bottom;

// append the svg object to the body of the page
const barSvg = d3
  .select("#bar-container")
  .append("svg")
  .attr("width", barWidth + barMargin.left + barMargin.right)
  .attr("height", barHeight + barMargin.top + barMargin.bottom)
  .append("g")
  .attr("transform", `translate(${barMargin.left},${barMargin.top})`);

// Parse the Data
d3.csv("data/Line,_and_Stop.csv").then(function (data) {
  // Calculate sum of flow for each station and store in array
  const newData = d3.rollups(
    data,
    (v) => d3.sum(v, (d) => d.average_flow),
    (d) => d.route_id
  );

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
    .style("text-anchor", "end");

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
    });

  // Bar Chart Axis
  // Axis Labels code from https://stackoverflow.com/questions/11189284/d3-axis-labeling

  barSvg
    .append("text")
    .attr("class", "x label")
    .attr("text-anchor", "end")
    .attr("x", barWidth - 120)
    .attr("y", barHeight + 50)
    .text("Line Name");

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
