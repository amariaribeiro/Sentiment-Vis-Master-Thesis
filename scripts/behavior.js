function init() {
        
	
    createDonut();
    console.log("adus");
    d3.csv("/data/airline.csv", function(data) {
        //console.log(data.airline);
        //console.log(data.airline_sentiment);
        //console.log(data.negativereason);
        //console.log(data.name);
    });
}

function createDonut() {

    var data = [2, 4, 8, 10];

    svg = d3.select("div#donut")
			.append("svg")
        width = window.innerWidth/2.5, 
        height = window.innerHeight/1.5,
        innerRadius = Math.min(width, height) / 4
        outerRadius = Math.min(width, height) / 2,
        g = svg.append("g").attr("transform", "translate(" + width / 2.5 + "," + height / 2 + ")");
        svg.attr("height", height)
        svg.attr("width", width)

    var color = d3.scaleOrdinal(['#4daf4a','#377eb8','#ff7f00','#984ea3','#e41a1c']);

    // Generate the pie
    var pie = d3.pie();

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
        .attr("d", arc);

}