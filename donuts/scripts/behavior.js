//airline_sentiment,negativereason,airline,name
var boxes = ["first", "second", "third", "fourth", "fifth", "sixth"];
var count = 0;
var start = true;

//colors
red_green = ['#ffffff','#73e603','#F00408']
yellow_blue = ['#ffffff', '#F6e32c', '#2CBBF6']

function init() {
    color_scheme = yellow_blue;

    info = d3.csv("../donuts/data/airline.csv").then(function(data) {

        var air_counts = d3.rollup(data, v=> v.length, d => d.airline, d => d.airline_sentiment);
        var totals = d3.rollup(data, v => v.length, d => d.airline);

        for (const airline of air_counts.keys()){
            for(const sent of air_counts.get(airline).keys()){
                aux = air_counts.get(airline).get(sent)/totals.get(airline);
                aux *= 100;
                air_counts.get(airline).set(sent, aux);
            }
        }

        for (const airline of air_counts.keys()) {
            createDonut(airline, air_counts.get(airline));
          }
    });
}

function createDonut(airline, data) {

    var airline = airline
   
    var data = data;

    width = window.innerWidth*0.9; 

    //create legend in start
    if(start){
        svg = d3.select("div#donut")
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
    }
    
    start = false;

    tooltip = d3.select("body")
			.append("div")
			.attr("class", "tooltip")
			.style("opacity", 0)

    //neutral, positive, negative
    width = window.innerWidth*0.9 /3.1, 
    height = window.innerHeight / 3,
    innerRadius = Math.min(width, height) / 4,
    outerRadius = Math.min(width, height) / 2.1;
        
    svg = d3.select("div#donut")
            .select("#" + boxes[count])
			.append("svg")
            .attr("height", height)
            .attr("width", width)

    
        g = svg.append("g").attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");
 
    count++;    

    const sentiments = ["neutral", "positive", "negative"]

    var color = d3.scaleOrdinal()
        .domain(sentiments)
        .range(color_scheme);

    // Generate the pie
    var pie = d3.pie()
        .value(d => d[1]);
    

    // Generate the arcs
    var arc = d3.arc()
                .innerRadius(innerRadius)
                .outerRadius(outerRadius);

    //Generate groups

    var arcs = g.selectAll("arc")
                .data(pie(data))
                .enter()
                .append("g")
                .attr("class", function(d){ return "arc " + d.data[0] })
                .attr("d", arc)
                .on("mouseover", function (event, d) {

                    tooltip.transition().duration(200).style("opacity", 0.9);
                    tooltip
                        .html(function (e) {
                            return "Sentiment " + d.data[0] + "<br>" + d.data[1].toFixed(2) + "%";
                        })
                        .style("left", event.pageX - 130 + "px")
                        .style("top", event.pageY - 28 + "px");
                    
                    d3.selectAll(".arc").style("opacity", 0.2)
                    d3.selectAll("."+d.data[0]).style("opacity",1)
                })
                .on("mousemove", function (d) {
                    // Position the tooltip
                    tooltip.style("left", event.pageX + 10 + "px")
                      .style("top", event.pageY + 10 + "px");
                  })
                .on("mouseleave", function (d) {
                    tooltip.transition().duration(200).style("opacity", 0);

                    d3.selectAll(".arc")
                    .style("opacity",1)
                })               

    //Draw arc paths
    arcs.append("path")
        .attr("fill", d =>color(d.data[0]))
        .attr("d", arc).style('stroke', '#444647')
        .style('stroke-width', 1.5)
        .each(function(d) {
            // Set the start angles of the arcs to zero
            this._current = { startAngle: 0, endAngle: 0 };
          })
          .transition()
          .duration(1000) // Set the duration of the transition
          .attrTween("d", function(d) {
            // Define the interpolator function for the end angles
            const interpolate = d3.interpolate(this._current, d);
            this._current = interpolate(0);
            return function(t) {
              return arc(interpolate(t));
            };
          });
         
    svg.append("text")
        .attr("text-anchor", "middle")
        .attr("x", width / 2)
        .attr("y", height / 2 )
        .style('fill', '#444647')
        .transition()
        .duration(200)
        .text(airline)
        .attr("font-size", "11px")
        .style("opacity", 0)
        .transition().duration(1000).style("opacity", 1);
}