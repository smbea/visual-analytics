// set the dimensions and margins of the graph
var margin = { top: 10, right: 20, bottom: 30, left: 50 },
    width = 650 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;


var size = d3.scaleSqrt()
    .domain([1, 50000000])  // What's in the data, let's say it is percentage
    .range([1, 20])  // Size in pixe

var valuesToShow = [3500000, 15000000, 50000000]
var xCircle = 50
var xLabel = 100
var yCircle = 50

// append the svg object to the body of the page
var svg = d3.select("#bubble-chart")
    .append("svg")
    .style("position", "relative")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform",
        "translate(" + margin.left + "," + margin.top + ")")

var b_x = d3.scaleLinear()
    .domain([0, 381000000])
    .range([0, width]);
svg.append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(b_x))

// Add Y axis
var b_y = d3.scaleLinear()
    .domain([1, 10])
    .range([height, 0]);
svg.append("g")
    .call(d3.axisLeft(b_y));

// Add a scale for bubble size
var b_z = d3.scaleLinear()
    .domain([0, 50000000])
    .range([1, 3]);

// Add X axi
// Add a scale for bubble color
var myColor = d3.scaleOrdinal()
    .domain(["action", "comedy", "adventure", "drama", "crime", "horror"])
    .range(d3.schemeSet2);

var tooltip = d3.select("#bubble-chart")
    .append("div")
    .style("opacity", 0)
    .attr("class", "tooltip")
    .style("background-color", "black")
    .style("border-radius", "5px")
    .style("padding", "10px")
    .style("color", "white")


function createBubbleVizualization(data) {

    var legendsvg = d3.select("#legend")
        .append("svg")
        .attr("width", 150)
        .attr("height", 70)

    legendsvg.selectAll("legend")
        .data(valuesToShow)
        .enter()
        .append("circle")
        .attr("cx", xCircle)
        .attr("cy", function (d) { return yCircle - size(d) })
        .attr("r", function (d) { return size(d) })
        .style("fill", "none")
        .attr("stroke", "black")

    // Add legend: segments
    legendsvg
        .selectAll("legend")
        .data(valuesToShow)
        .enter()
        .append("line")
        .attr('x1', function (d) { return xCircle + size(d) })
        .attr('x2', xLabel)
        .attr('y1', function (d) { return yCircle - size(d) })
        .attr('y2', function (d) { return yCircle - size(d) })
        .attr('stroke', 'black')
        .style('stroke-dasharray', ('2,2'))

    // Add legend: labels
    legendsvg
        .selectAll("legend")
        .data(valuesToShow)
        .enter()
        .append("text")
        .attr('x', xLabel)
        .attr('y', function (d) { return yCircle - size(d) })
        .text(function (d) { return (d / 1000000 + "M €") })
        .style("font-size", 10)
        .attr('alignment-baseline', 'middle')

    makeChart(data)

}


function makeChart(data) {

    svg.append('g')
        .selectAll("dot")
        .data(data)
        .enter()
        .append("circle")
        .attr("class", "bubbles")
        .attr("cx", function (d) { return b_x(d.gross); })
        .attr("cy", function (d) { return b_y(d.score); })
        .attr("r", function (d) { return b_z(d.budget); })
        .style("fill", function (d) { return myColor(d.genre) })
        .on("mouseover", showTooltip)
        .on("mousemove", moveTooltip)
        .on("mouseleave", hideTooltip)

}

function updateChart(newData, replace) {

    if (replace) {
        makeChart(newData)
    }

    else {
        svg.selectAll("circle").filter(function (d) {
            return newData.indexOf(d) < 0
        }).remove()
    }

}


function updateBubble(newData, replace) {
    if (state.data) {
        updateChart(newData, replace)
    }
}



var showTooltip = function (d) {
    tooltip
        .transition()
        .duration(200)
    tooltip
        .style("opacity", 1)
        .html(
            "Title: " + d.name + "<br/>" +
            "Genre: " + d.genre + "<br/>" +
            "Country: " + d.country + "<br/>" +
            "Year: " + d.year + "<br/>" +
            "Budget: " + d.budget + "€<br/>" +
            "Gross: " + d.gross + "€<br/>" +
            "Score: " + d.score
        )
        .style("left", (d3.mouse(this)[0] + 30) + "px")
        .style("top", (d3.mouse(this)[1] + 30) + "px")
}
var moveTooltip = function (d) {

    tooltip
        .style("left", (d3.mouse(this)[0] + 30) + "px")
        .style("top", (d3.mouse(this)[1] + 30) + "px")
}
var hideTooltip = function (d) {
    tooltip
        .transition()
        .duration(200)
        .style("opacity", 0)
}
