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

//https://d3-graph-gallery.com/graph/barplot_stacked_basicWide.html

// Define color scale for barchart
const color = d3
  .scaleOrdinal()
  .domain(["Morning", "Midday", "Afternoon", "Evening", "Night"])
  .range(["#eff3ff", "#bdd7e7", "#6baed6", "#3182bd", "#08519c"]);
