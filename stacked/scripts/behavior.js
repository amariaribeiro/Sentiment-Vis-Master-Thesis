//airline_sentiment,negativereason,airline,name

//colors
red_green = ['#ffffff','#73e603','#F00408']
yellow_blue = ['#ffffff', '#F6e32c', '#2CBBF6']

function init() {

    color_scheme = yellow_blue;

    info = d3.csv("../stacked/data/airline.csv").then(function(data) {
        
        var air_counts = d3.flatRollup(data, v=> v.length, d => d.airline, d => d.airline_sentiment)
            
        var totals = d3.flatRollup(data, v => v.length, d => d.airline);

        for (const x in air_counts){
            for(const y in totals){
                if (air_counts[x][0] == totals[y][0]){
                    air_counts[x][2] = (air_counts[x][2] / totals[y][1])*100;
                }
            }
        }

        const format = air_counts.map(([airline, sentiment, count]) => ({airline, sentiment, count}));

        const aux = format.reduce((acc, { airline, sentiment, count }) => {
            if (!acc[airline]) {
              acc[airline] = {airline};
              acc[airline].airline = airline;
            }

            acc[airline][sentiment] = count;
            return acc;
          }, {});

        createStackedBarChart(Object.values(aux));

    });
}

function createStackedBarChart(data){
    var data = data;

    const sentiments = ["neutral", "positive", "negative"]

    var groups = d3.map(data, function(d){return(d.airline)})

    width = window.innerWidth*0.9, 
    height = window.innerHeight*0.70,

    tooltip = d3.select("body")
			.append("div")
			.attr("class", "tooltip")
			.style("opacity", 0),

    svg = d3.select("div#stacked")
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
        
    svg = d3.select("div#stacked")
			.append("svg")
            .attr("height", height)
            .attr("width", width)
            .append("g").attr("transform", "translate(" + width*0.1 + "," + height*0.05 + ")");

    const x = d3.scaleBand()
        .domain(groups)
        .range([0, width*0.8])
        .padding([0.2])
  
    svg.append("g")
        .attr("transform", `translate(0, ${height*0.8})`)
        .call(d3.axisBottom(x).tickSizeOuter(0));

    const y = d3.scaleLinear()
        .domain([0, 100])
        .range([ height*0.8, 0 ]);
  
    svg.append("g")
        .call(d3.axisLeft(y));

    var color = d3.scaleOrdinal()
        .domain(sentiments)
        .range(color_scheme);
    
    const stackedData = d3.stack()
        .keys(sentiments)
        (data)

    svg.append("g")
        .selectAll("g")
        .data(stackedData)
        .enter().append("g")
          .attr("fill", function(d) { return color(d.key); })
          .attr("class", function(d){ return "myRect " + d.key }) 
          .selectAll("rect")
          .data(function(d) { return d; })
          .enter().append("rect")
          .on("mouseover", function (event,d) { 
            
            const subGroupName = d3.select(this.parentNode).datum().key
            const value = d.data[subGroupName];

               d3.selectAll(".myRect").style("opacity", 0.2)
               d3.selectAll("."+subGroupName).style("opacity",1)
            
               tooltip.transition().duration(200).style("opacity", 0.9);
               tooltip
                   .html(function (e) {
                       return "Sentiment " + subGroupName + "<br>" + value.toFixed(2) + "%";
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
            .attr("x", function(d) { return x(d.data.airline); })
            .attr("y", function(d) { return y(0); })
            .attr("width",x.bandwidth())
            .transition()
            .duration(1000)
            .attr("y", function(d) { return y(d[1]); })
            .attr("height", function(d) { return y(d[0]) - y(d[1]); })
            .attr("stroke", "grey")
            
}
