//airline_sentiment,negativereason,airline,name

//colors
red_green = true
yellow_blue = false

//selected for terms
var selected;
var selected_leg;

//legend colors
rg = ['#808080','#14aa08','#Be0509']
yb = ['#808080', '#E3DA32', '#2CBBF6']

//sentiments button values
neutral = ["neutral", "positive", "negative"]
positive = ["positive", "negative", "neutral"]
negative = ["negative", "neutral", "positive"]

//airlines list "American", "Delta", "Southwest", "United", "US Airways", "Virgin America" 
airlines = ["Epsilon", "Zêta", "Êta", "Thêta", "Iota", "Kappa"]

let translation = {
    "American": {1: "Epsilon"},
    "Delta": {1: "Zêta"},
    "Southwest": {1: "Êta"},
    "United": {1: "Thêta"},
    "US Airways": {1: "Iota"},
    "Virgin America": {1: "Kappa"}
}

//sentiments button flag
b_positive = false
b_negative = false
b_neutral = false

aux = [];

var max;

let data_t = {
    "american": {1: null},
    "delta": {1: null},
    "southwest": {1: null},
    "united": {1: null},
    "us": {1: null},
    "virgin": {1: null}
    };

let conv = {
    "American": {1: "american"},
    "Delta": {1: "delta"},
    "Southwest": {1: "southwest"},
    "United": {1: "united"},
    "US Airways": {1: "us"},
    "Virgin America": {1: "virgin"}
    };

var terms;

var all_air;

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

        data_t["american"][1] = data[1];
        data_t["delta"][1] = data[2];
        data_t["southwest"][1] = data[3];
        data_t["united"][1] = data[4];
        data_t["us"][1] = data[5];
        data_t["virgin"][1] = data[6];

        aux1 = data[1].concat(data[2]).concat(data[3]).concat(data[4]).concat(data[5]).concat(data[6])
        
        all_air = d3.flatRollup(aux1, v=> d3.sum(v, function(d) {return d.count}), d=> d.word, d=>d.sent)
       
        all_air.sort(function (a, b){

            if (a[2]> b[2]) {return -1;} 
            else if (a[2]< b[2]) { return 1;} 
            else  return 0;
        });

        all_air =  all_air.slice(0,60);

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

        terms = all_air;

        createStackedBarChart(Object.values(aux));
    });
}

function color(){

    if (red_green){
        for (x = 0; x < sentiments.length; x++){
            if(sentiments[x] == "neutral"){
                color_scheme[x] = '#808080'
            }else if (sentiments[x] == "positive"){
                color_scheme[x] = '#14aa08'
            }else if (sentiments[x] == "negative"){
                color_scheme[x] = '#Be0509'
            }
        }

    } else if (yellow_blue){
        for (x = 0; x < sentiments.length; x++){
            if(sentiments[x] == "neutral"){
                color_scheme[x] = '#808080'
            }else if (sentiments[x] == "positive"){
                color_scheme[x] = '#E3DA32'
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
                    .style("fill", "#808080")
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
        .domain(airlines)
        .range([0, width*0.8])
        .padding([0.2])
  
    svg.append("g")
        .attr("transform", `translate(0, ${height*0.8})`)
        .call(d3.axisBottom(x).tickSizeOuter(0))
        .selectAll("text")
            .attr("class", "airline")
            .on("click", clickAirline)


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
                       return subGroupName.charAt(0).toUpperCase() + subGroupName.slice(1) + " sentiment"  + "<br>" + value.toFixed(2) + "%";
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
            .attr("x", function(d) { return x(translation[d.data.airline][1]); })
            .attr("y", function(d) { return y(0); })
            .attr("width",x.bandwidth())
            .transition()
            .duration(1000)
            .attr("y", function(d) { return y(d[1]); })
            .attr("height", function(d) { return y(d[0]) - y(d[1]); })
            .attr("stroke", "grey")

        createWordcloud(terms);

    }

    function clickAirline(event, d) {

        d3.select(selected).style("stroke-width", 1)
                            .style("stroke", "grey")
        
        d3.select(selected_leg).style("color", "grey")

        if(selected_leg == this){

            terms = all_air;
            selected_leg = null;
        }
        else{
            d3.select(this).style("color", "#444647")
            selected_leg = this;

            air = Object.keys(translation).find(key => translation[key][1] === d);
    
            airline = conv[air][1];
            terms = data_t[airline][1];
        }

        plot = d3.select("div#stacked").select("#word").selectAll("svg");
        plot.remove()

        createWordcloud(terms);
    }

    function handleClick(event, d) {

        d3.select(selected).style("stroke-width", 1)
                            .style("stroke", "grey")

        if(selected == this){

            terms = all_air;
            selected = null;
        } else {
            d3.select(this).style("stroke-width", 1.5)
                        .style("stroke", "black")

            selected = this;

            if(d3.select(this.parentNode).datum().key == "negative"){
                airline = conv[d.data.airline][1]
                terms = data_t[airline][1].filter(function(d){ return d.sent == "neg"})
            }

            if(d3.select(this.parentNode).datum().key == "positive"){
                airline = conv[d.data.airline][1]
                terms = data_t[airline][1].filter(function(d){ return d.sent == "pos"})
            }

            if(d3.select(this.parentNode).datum().key == "neutral"){
                airline = conv[d.data.airline][1]
                terms = data_t[airline][1].filter(function(d){ return d.sent == "neut"})
            }
        }

        plot = d3.select("div#stacked").select("#word").selectAll("svg");
        plot.remove()

        createWordcloud(terms);
    }

    function createWordcloud(terms) {
        width = (window.innerWidth*0.9)/2.1, 
        height = window.innerHeight*0.68;

        var svg = d3.select("div#stacked").select("#word").append("svg")
            .attr("width", width)
            .attr("height", height)
            .append("g")
            .attr("width", width)
            .attr("height", height)
            .attr("transform", "translate(" + - width*0.05 + "," + height*0.01 + ")");


        if(terms == all_air){
            var layout = d3.layout.cloud()
            .size([width, height])
            .words(terms)
            .padding(11)       
            .rotate(0)
            .fontSize(function(d) { return d[2] * 80 / 425;})   
            .font("Verdana") 
            .text(function(d) { return d[0]; }) 
            .on("end", draw);
            layout.start();

            function draw(words) {
                svg
                  .append("g")
                    .attr("transform", "translate(" + layout.size()[0] / 2 + "," + layout.size()[1] / 2 + ")")
                    .selectAll("text")
                      .data(words)
                    .enter().append("text")
                      .style("font-size", function(d) { return d[2] * 80 / 425; })
                      .style("fill", fillWords)
                      .attr("text-anchor", "middle")
                      .style("font-family", "Verdana")
                      .attr("transform", function(d) {
                        return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")";
                      })
                      .text(function(d) { return d[0]; });
            }

        }else{
            max = d3.max(terms, d => +d.count);

            var layout = d3.layout.cloud()
            .size([width, height])
            .words(terms)
            .padding(11)       
            .rotate(0)
            .fontSize(function(d) { return (d.count * 55) / max;})   
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
                      .style("font-size", function(d) { return (d.count * 55) / max; })
                      .style("fill", fillWords)
                      .attr("text-anchor", "middle")
                      .style("font-family", "Verdana")
                      .attr("transform", function(d) {
                        return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")";
                      })
                      .text(function(d) { return d.word; });
        }
    }

    function fillWords(d){

        var sent;

        if(terms == all_air){
            sent = d[1]
        }else{
            sent = d.sent
        }

        if(sent == "pos"){
            return legend[1];
        }
        if(sent == "neg"){
            return legend[2];
        }
        else{
            return legend[0];
        }
    }
}
