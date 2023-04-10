//airline_sentiment,negativereason,airline,name

function init() {
    info = d3.csv("../donuts/data/airline.csv").then(function(data) {

        var air_counts = d3.rollup(data, v=> v.length, d => d.airline, d => d.airline_sentiment);
        
        console.log(info);

        createGrouped(air_counts, info);
    });
}

function createGrouped(values, data) {

    const sentiments = ["neutral", "positive", "negative"]

    width = window.innerWidth*0.9, 
    height = window.innerHeight*0.75;
    
    var svg = d3.select("#grouped")
    .append("svg")
    .attr("width", width)
    .attr("height", height)
    .append("g")
    .attr("transform",
          "translate(" + width*0.1 + "," + height*0.05 + ")");

    var x = d3.scaleBand()
      .domain(values.keys())
      .range([0, width*0.8])
      .padding([0.2])
    
    svg.append("g")
        .attr("transform", `translate(0, ${height*0.8})`)
        .call(d3.axisBottom(x).tickSizeOuter(0));

    var y = d3.scaleLinear()
        .domain([0, 2700])
        .range([ height*0.8, 0 ]);
    
    svg.append("g")
        .call(d3.axisLeft(y));
    
    var xSubgroup = d3.scaleBand()
        .domain(sentiments)
        .range([0, x.bandwidth()])
        .padding([0.01])
    
    var color = d3.scaleOrdinal()
        .domain(sentiments)
        .range(['#ffffff','#73e603','#F00408'])
    
    console.log(values)
    console.log(data)
    
    svg.append("g")
        .selectAll("g")
        .data(values)
        .enter()
        .append("g")
          .attr("transform", function(d) { return "translate(" + x(d[0]) + ",0)"; })
        .selectAll("rect")
        .data(function(d) { return sentiments.map(function(key) { return {key: key, value: d[1].get(key)}; }); })
        .enter().append("rect")
          .attr("x", function(d) { console.log(d); return xSubgroup(d.key); })
          .attr("y", function(d) { return y(d.value); })
          .attr("width", xSubgroup.bandwidth())
          .attr("height", function(d) { return height*0.8 - y(d.value); })
          .attr("fill", function(d) { return color(d.key); })
          .attr("stroke", "grey");
}           