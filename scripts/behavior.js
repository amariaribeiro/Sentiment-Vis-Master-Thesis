//var air_counts;

//airline_sentiment,negativereason,airline,name
var boxes = ["first", "second", "third"];
var count = 0;

function init() {
    info = d3.csv("/data/airline.csv").then(function(data) {

        var air_counts = d3.rollup(data, v=> v.length, d => d.airline, d => d.airline_sentiment);

        //console.log(air_counts.keys())

        for (const airline of air_counts.keys()) {
            createDonut(airline, air_counts.get(airline));
          }
    });
}

//TODO: Adicionar restantes, adicionar legendas, adicionar transições
function createDonut(airline, values) {

    var airline = airline
   
    var data = Object.entries(Object.fromEntries(values));

    //neutral, positive, negative
    width = window.innerWidth*0.9 /3.1, 
    height = window.innerHeight / 2.7,
    innerRadius = Math.min(width, height) / 4,
    outerRadius = Math.min(width, height) / 2.2;

    svg = d3.select("div#donut")
            .select("#" + boxes[count])
			.append("svg")
            .attr("height", height)
            .attr("width", width)
    
        g = svg.append("g").attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");
 
    count++;    
    var color = d3.scaleOrdinal(['#ffffff','#73e603','#F00408']);

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
                .attr("class", "arc")
                

    //Draw arc paths
    arcs.append("path")
        .attr("fill", function(d, i) {
            return color(i);
        })
        .attr("d", arc).style('stroke', '#444647')
        .style('stroke-width', 1.5);;

    svg.append("text")
        .attr("text-anchor", "middle")
        .style('fill', '#444647')
        .transition()
        .duration(200)
        .text(airline)
        .attr("font-size", "12px")
        .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");
}