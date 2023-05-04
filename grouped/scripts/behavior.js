//airline_sentiment,negativereason,airline,name

//colors
red_green = ['#ffffff','#73e603','#F00408']
yellow_blue = ['#ffffff', '#F6e32c', '#2CBBF6']

function init() {
    color_scheme = red_green;

    info = d3.csv("../../data/airline.csv").then(function(data) {

        var air_counts = d3.rollup(data, v=> v.length, d => d.airline, d => d.airline_sentiment);

        createGrouped(air_counts, info);
    });
}

function createGrouped(values, data) {

    const sentiments = ["neutral", "positive", "negative"]

    width = window.innerWidth*0.9, 
    height = window.innerHeight*0.70;

    tooltip = d3.select("body")
			.append("div")
			.attr("class", "tooltip")
			.style("opacity", 0),

    svg = d3.select("div#grouped")
                .select("#legend")
                .append("svg")
                .attr("height", 30)
                .attr("width", width)

                svg.append("circle").attr("cx", width/2 - 40).attr("cy",12).attr("r", 10)
                    .style("fill", "#ffffff")
                    .style('stroke', '#444647')
                    .style('stroke-width', 1)
                    .style("opacity", 0)
                    .transition().duration(1000).style("opacity", 1)
                
                svg.append("text")
                    .attr("text-anchor", "left")
                    .attr("x", (width/2 - 25))
                    .attr("y", 17)
                    .style("opacity", 0)
                    .transition().duration(1000).style("opacity", 1)
                    .style('fill', '#444647')
                    .text("Neutral")
                    .attr("font-size", "12px")


                svg.append("circle").attr("cx", width/3 - 40).attr("cy",12).attr("r", 10)
                    .style("fill", color_scheme[1])
                    .style('stroke', '#444647')
                    .style('stroke-width', 1)
                    .style("opacity", 0)
                    .transition().duration(1000).style("opacity", 1)
                
                svg.append("text")
                    .attr("text-anchor", "left")
                    .attr("x", (width/3 - 25))
                    .attr("y", 17)
                    .style("opacity", 0)
                    .style('fill', '#444647')
                    .transition().duration(1000).style("opacity", 1)
                    .text("Positive")
                    .attr("font-size", "12px");

                svg.append("circle").attr("cx", width/3*2 - 40).attr("cy",12).attr("r", 10)
                    .style("fill", color_scheme[2])
                    .style('stroke', '#444647')
                    .style('stroke-width', 1)
                    .style("opacity", 0)
                    .transition().duration(1000).style("opacity", 1)
                
                svg.append("text")
                    .attr("text-anchor", "left")
                    .attr("x", (width/3*2 - 25))
                    .attr("y", 17)
                    .style('fill', '#444647')
                    .style("opacity", 0)
                    .transition().duration(1000).style("opacity", 1)
                    .text("Negative")
                    .attr("font-size", "12px")
    
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
        .range(color_scheme)

    
    svg.append("g")
        .selectAll("g")
        .data(values)
        .enter()
        .append("g")
          .attr("transform", function(d) { return "translate(" + x(d[0]) + ",0)"; })
        .selectAll("rect")
        .data(function(d) { return sentiments.map(function(key) { return {key: key, value: d[1].get(key)}; }); })
        .enter().append("rect")
          .attr("class", function(d){ return "myRect " + d.key })  
          .attr("x", function(d) { return xSubgroup(d.key); })
          .attr("width", xSubgroup.bandwidth())
          .attr("y", function(d) { return y(0); })
          .on("mouseover", function (event,d) { 
               d3.selectAll(".myRect").style("opacity", 0.2)
               d3.selectAll("."+d.key).style("opacity",1)

               tooltip.transition().duration(200).style("opacity", 0.9);
               tooltip
                   .html(function (e) {
                       return "Sentiment " + d.key + "<br>" + d.value + " people";
                   })
                   .style("left", event.pageX - 130 + "px")
                   .style("top", event.pageY - 28 + "px");
          })
          .on("mousemove", function (d) {
            // Position the tooltip
            tooltip.style("left", event.pageX + 10 + "px")
              .style("top", event.pageY + 10 + "px");
          })
          .on("mouseleave", function (event,d) { // When user do not hover anymore
              d3.selectAll(".myRect")
            .style("opacity",1)

            tooltip.transition().duration(200).style("opacity", 0);
            })
          .transition()
          .duration(1000)
          .attr("y", function(d) { return y(d.value); })
          .attr("height", function(d) { return height*0.8 - y(d.value); })
          .attr("fill", function(d) { return color(d.key); })
          .attr("stroke", "grey");
}           