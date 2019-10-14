/*
	TODO:
	1. Animate the bubbles so they move 
	2. Randomize bubble colors
	3. Add different filters (i.e. by continent)
	4. Add real data
*/

data = d3.csv("cities.csv").then(function(data, error) {
	nodes = createNodes(data);
	var simulation = simulateNodes();
	var container = containIndividualNodes();

	// set timeout to ensure that all the circles have loaded
	setTimeout(
	  () => {
	    d3.selectAll('.circleContainer')
	      .data(nodes)
	      .append("text")
	      .attr("x", d => d.x)
	      .attr("y", d => d.y)
	      .text(d => d.id);
	  }, 2000);
	});

async function loadData() {
  return await d3.csv('cities.csv');
}

function createNodes(data) {
	// Clean up data
	data.forEach((d) => {
	   d.Population = d.Population.replace(/,/g, '')
	   d.radius = Math.sqrt(d.Population / Math.PI)
	 });

	var nodes = data.map( i => {
    var d = {
      id: i.City,
      radius: i.radius,
      population: i.Population
    };
    return d;
  });

  return nodes;
}

function simulateNodes() {
	var simulation = d3.forceSimulation(nodes)
	  .force('charge', d3.forceManyBody().strength(-10))
	  .force('center', d3.forceCenter(300,300))
	  .force('collision', d3.forceCollide().radius(d => d.radius/20))
	  .on('tick', ticked);

	return simulation;
}

function containIndividualNodes() {
	var container = d3.select('svg')
	  .selectAll('circle')
	  .data(nodes)
	  .enter()
	  .append("g") // block containing the circle
	  .attr("class", "circleContainer");

	return container;
}

function ticked() {
  var chart = d3.select(".chart")
    .attr("width", 1000)
    .attr("height", 1000); // todo make 100 percent

  var x = d3.scaleLinear()
    .domain([0, d3.max(data, function(d) { return d.Population; })])
    .range([0, 30]);

  // individual bubbles
  var bubble = d3.select('svg')
    .selectAll('circle')
    .data(nodes)

  bubble.enter()
    .append('circle')
    .attr("class", "bubble")
    .attr('r', d => d.radius/17)
    .merge(bubble)
    .attr('cx', d => d.x)
    .attr('cy', d => d.y)
    .style("fill", "69b3a2")
    .attr("stroke", "#69b3a2")
    .attr("stroke-width", 3)
    .attr("fill-opacity", .4)
    .attr("id", d => d.id)
    .on("mouseover", handleMouseOver)
    .on("mouseout", handleMouseOut);

  bubble.exit().remove()
}

function handleMouseOver(d, i) {
	d3.select(this).transition().style("fill", "purple");
  d3.select(".cityName").text("City: " + d.id);
  d3.select(".population").text("Population: " + d.population);
}

function handleMouseOut(d, i) {
	d3.select(this).transition().style("fill", "69b3a2");
}

