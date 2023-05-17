//airline_sentiment,negativereason,airline,name

//colors
red_green = true
yellow_blue = false

//legend colors
rg = ['#ffffff','#73e603','#F00408']
yb = ['#ffffff', '#F6e32c', '#2CBBF6']

//sentiments button values
neutral = ["neutral", "positive", "negative"]
positive = ["positive", "negative", "neutral"]
negative = ["negative", "neutral", "positive"]

//airlines list
airlines = ["American", "Delta", "Southwest", "United", "US Airways", "Virgin America"]

//sentiments button flag
b_positive = false
b_negative = false
b_neutral = false

 aux = [];

var american;
var delta;
var southwest;
var united;
var us;
var virgin;

//TODO: por o click a funcionar e seguir para o click das legendas e fazer a questão das cores; visão geral da wordcloud

function init() {

    legend = []

    if(red_green){
        legend = rg
    } else if(yellow_blue){
        legend = yb
    }


    color_scheme =  []

    sentiments = neutral;

    color();

    Promise.all([d3.csv("../../data/airline.csv"), 
                d3.csv("../../data/american.csv"),
                d3.csv("../../data/delta.csv"),
                d3.csv("../../data/southwest.csv"),
                d3.csv("../../data/united.csv"),
                d3.csv("../../data/us.csv"),
                d3.csv("../../data/virgin.csv")]).then(function(data){

        american = data[1];
        delta = data[2];
        southwest = data[3];
        united = data[4];
        us = data[5];
        virgin = data[6];
        
        var air_counts = d3.flatRollup(data[0], v=> v.length, d => d.airline, d => d.airline_sentiment)
            
        var totals = d3.flatRollup(data[0], v => v.length, d => d.airline);

        for (const x in air_counts){
            for(const y in totals){
                if (air_counts[x][0] == totals[y][0]){
                    air_counts[x][2] = (air_counts[x][2] / totals[y][1])*100;
                }
            }
        }

        const format = air_counts.map(([airline, sentiment, count]) => ({airline, sentiment, count}));

        aux = format.reduce((acc, { airline, sentiment, count }) => {
            if (!acc[airline]) {
              acc[airline] = {airline};
              acc[airline].airline = airline;
            }

            acc[airline][sentiment] = count;
            return acc;
          }, {});
        
        createStackedBarChart(Object.values(aux), american);
    });
}

function color(){

    if (red_green){
        for (x = 0; x < sentiments.length; x++){
            if(sentiments[x] == "neutral"){
                color_scheme[x] = '#ffffff'
            }else if (sentiments[x] == "positive"){
                color_scheme[x] = '#73e603'
            }else if (sentiments[x] == "negative"){
                color_scheme[x] = '#F00408'
            }
        }

    } else if (yellow_blue){
        for (x = 0; x < sentiments.length; x++){
            if(sentiments[x] == "neutral"){
                color_scheme[x] = '#ffffff'
            }else if (sentiments[x] == "positive"){
                color_scheme[x] = '#F6e32c'
            }else if (sentiments[x] == "negative"){
                color_scheme[x] = '#2CBBF6'
            }
        }

    }


}

function handlingButton(sentiment){

    plot = d3.select("div#stacked").selectAll("svg");
    plot.remove()

    if (sentiment == "positive"){
        sentiments = positive;
    } else if (sentiment == "negative"){
        sentiments = negative;
    } else if (sentiment == "neutral"){
        sentiments = neutral;
    }

    color();

    createStackedBarChart(Object.values(aux));
}

function createStackedBarChart(data){
    var data = data;

    var groups = d3.map(data, function(d){return(d.airline)})

    width = (window.innerWidth*0.9)/2.1, 
    height = window.innerHeight*0.68,

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
                    .style("fill", legend[1])
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
                    .style("fill", legend[2])
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
        
    svg = d3.select("div#stacked").select("#st")
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
          .on("click", handleClick)
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

        createWordcloud(width, height, american);
    }

    function handleClick(event, d) {
        console.log(d.data.airline)
    }

    function createWordcloud(width, height, terms) {
        var svg = d3.select("div#stacked").select("#word").append("svg")
            .attr("width", width)
            .attr("height", height)
            .append("g")
            .attr("width", width)
            .attr("height", height)
            .attr("transform", "translate(" + - width*0.05 + "," + height*0.02 + ")");

        
        var layout = d3.layout.cloud()
          .size([width, height])
          .words(terms)
          .padding(11)       
          .rotate(0)
          .fontSize(function(d) { return d.count;})   
          .font("Verdana") 
          .text(function(d) { return d.word; }) 
          .on("end", draw);
        layout.start();
    
        function draw(words) {
          svg
            .append("g")
              .attr("transform", "translate(" + layout.size()[0] / 2 + "," + layout.size()[1] / 2 + ")")
              .selectAll("text")
                .data(words)
              .enter().append("text")
                .style("font-size", function(d) { return d.count; })
                .style("fill", "#808080")
                .attr("text-anchor", "middle")
                .style("font-family", "Verdana")
                .attr("transform", function(d) {
                  return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")";
                })
                .text(function(d) { return d.word; });
    }
}
