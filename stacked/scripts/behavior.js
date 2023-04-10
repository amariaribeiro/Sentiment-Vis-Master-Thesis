//airline_sentiment,negativereason,airline,name

function init() {

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

// TODO transitions, tooltip, highlight, change first

function createStackedBarChart(data){
    var data = data;

    const sentiments = ["neutral", "positive", "negative"]

    var groups = d3.map(data, function(d){return(d.airline)})

    width = window.innerWidth*0.9, 
    height = window.innerHeight*0.75,
        
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
        .range(['#ffffff','#73e603','#F00408']);
    
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
            .attr("x", function(d) { return x(d.data.airline); })
            .attr("y", function(d) { return y(d[1]); })
            .attr("height", function(d) { return y(d[0]) - y(d[1]); })
            .attr("width",x.bandwidth())
            .attr("stroke", "grey")
    
}
