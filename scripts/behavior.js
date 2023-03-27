function init() {
        
	createDonut();
}

function createDonut() {

    var data = [2, 4, 8, 10];

    svg = d3.select("div#donut")
			.append("svg")
        width = window.innerWidth/2.5, 
        height = window.innerHeight/2,
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

    /*var color = d3.scaleOrdinal(['#4daf4a','#377eb8','#ff7f00','#984ea3','#e41a1c']);
    var data = [2, 4, 8, 10]
    const width = window.innerWidth * 0.42;
	height = window.innerHeight * 0.383;


		const pie = d3.pie()
			.value(d => d[1])

		const stroke = d3.scaleOrdinal()
			.range(["#b94366", "#ffe6ee"])

		const fill = d3.scaleOrdinal()
			.range(["#ff1493", "white"])

		//const data_aux = pie(data)

        svg = d3.select("div#donut")
			.append("svg")
        
        g = svg.append("g")


        var arc = d3.arc()
            .innerRadius(30)
            .outerRadius(100);
        
        var arcs = g.selectAll("arc")
            .data(pie(data))
            .enter()
            .append("g")
            .attr("class", "arc")

            arcs.append("path")
            .attr("fill", function(d, i) {
                return color(i);
            })
            .attr("d", arc);*/

        
		/*svg.append("text")
			.text("Women")
			.attr("font-size", "14px")
			.attr("transform", `translate(${width / 8},${height / 14})`);*/

		/*svg
			.data(data_aux)
			.join('path')
			.attr('d', d3.arc()
				.innerRadius(width / 12)
				.outerRadius(width / 7)
			)*/
			/*.attr('fill', d => fill(d.data))
			.style("opacity", 1)
			.style("stroke", d => stroke(d.data))
			.style("stroke-width", 2)*/


		/*svg.selectAll('path')
			.attr("transform", `translate(${width / 6.3},${height / 2})`);*/

		/*svg.append("text")
			.attr("text-anchor", "middle")
			.transition()
			.duration(200)
			.text(value + "%")
			.attr("font-size", "20px")
			.attr("transform", `translate(${width / 6.3},${height / 2})`);*/

}