// set the dimensions and margins of the graph
var margin = { top: 10, right: 20, bottom: 30, left: 50 },
    width = 650 - margin.left - margin.right,
    height = 300 - margin.top - margin.bottom;


var size

var valuesToShow
var xCircle = 50
var xLabel = 100
var yCircle = 50
var allgroups = ["Action", "Comedy", "Adventure", "Drama", "Crime", "Horror", "Animation", "Biography", "Mystery", "Sci-Fi","Fantasy","Romance"]

// append the svg object to the body of the page
var svg = d3.select("#bubble-chart")
    .append("svg")
    .style("position", "relative")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform",
        "translate(" + margin.left + "," + margin.top + ")")

var b_x
var b_y
var b_z

// Add X axi
// Add a scale for bubble color
var myColor = d3.scaleOrdinal()
    .domain(allgroups)
    .range(["#8dd3c7","#edd74a","#a69edb","#fb8072","#80b1d3","#fdb462","#b3de69","#dea4c2","#a8a8a8","#bc80bd","#9dbf95","#e07d53"]);

var tooltip = d3.select("#bubble-chart")
    .append("div")
    .style("opacity", 0)
    .attr("class", "tooltip")
    .style("background-color", "black")
    .style("border-radius", "5px")
    .style("padding", "10px")
    .style("color", "white")


function createBubbleVizualization(data) {

    setAxis(data)

    d3.select("#legend").append("text")
    .text("Votes")
    .style("margin-left","5em");

    var legendsvg = d3.select("#legend")
        .append("svg")
        .attr("width", 150)
        .attr("height", 60
        )

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
        .text(function (d) { return (d / 1000 + "k") })
        .style("font-size", 10)
        .attr('alignment-baseline', 'middle')


     // Add one dot in the legend for each name.
    var asize = 20
    let section = d3.select("#leg").attr("class", "d-flex flex-row align-items-center")

    let div = section.append("div").attr("class", "d-flex flex-column")
    let temp=0

    for(let i= 0; i<allgroups.length;i++){
        
        if(temp>=3){
            div = section.append("div").attr("class", "d-flex flex-column")
            temp=0
        }
        
        let newdiv = div.append("div").attr("class", "d-flex flex-row align-items-center")
        newdiv.append("span")
        .attr("cx", 0)
        .attr("cy", 0) // 100 is where the first dot appears. 25 is the distance between dots
        .attr("r", 7)
        .attr("class", "dott")
        .style("background-color", function(){ return myColor(allgroups[i])})

        newdiv.append("text")
        .attr("cx", 0)
        .attr("cy", 0) // 100 is where the first dot appears. 25 is the distance between dots
        .style("color", function(){ return myColor(allgroups[i])})
        .style("margin-right", "1em")
        .text(allgroups[i])
        temp++
    }


    makeChart(data)


}


function makeChart(data) {

    svg.append('g')
        .selectAll("dot")
        .data(data)
        .enter()
        .append("circle")
        .attr("class", "bubbles")
        .attr("cx", function (d) { return b_x(d.gross / 100000); })
        .attr("cy", function (d) { return b_y(d.budget / 100000); })
        .attr("r", function (d) { return b_z(d.votes); })
        .attr("name", function (d) { return d.name; })
        .style("fill", function (d) { return myColor(d.genre) })
        .on("mouseover", showTooltip)
        .on("mousemove", moveTooltip)
        .on("mouseleave", hideTooltip)


}

function setAxis(data) {
    b_x = d3.scaleLinear()
        .domain(d3.extent(data, function (d) { return +d.gross / 100000; }))
        .range([0, width]);
    svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(b_x))

    svg.append("text")
        .attr("transform",
            "translate(" + (width / 2) + " ," +
            (height + margin.top + 20) + ")")
        .style("text-anchor", "middle")
        .text("Gross Earnings (Millions)");

    b_y = d3.scaleLinear()
        .domain(d3.extent(data, function (d) { return +d.budget / 100000; }))
        .range([height, 0]);
    svg.append("g")
        .call(d3.axisLeft(b_y));

    svg.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left)
        .attr("x", 0 - (height / 2))
        .attr("dy", "1em")
        .style("text-anchor", "middle")
        .text("Budget (Millions)");

    b_z = d3.scaleLinear()
        .domain(d3.extent(data, function (d) { return +d.votes; }))
        .range([1.5, 25]);

    size = d3.scaleSqrt()
        .domain(d3.extent(data, function (d) { return +d.votes; }))  // What's in the data, let's say it is percentage
        .range([1.5, 25])  // Size in pixe

    valuesToShow = [50000, 500000, 1600000]

}

function updateChart(newData, replace) {
    let data = [...newData]

    if (replace) {
        makeChart(data)
    }

    else {
        svg.selectAll("circle").filter(function (d) {
            return data.indexOf(d) < 0
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
            "Score: " + d.score + "€<br/>" +
            "Votes:" + d.votes
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


function selectBubble(name){
    console.log(name)

    Array.from(document.getElementsByName(name)).forEach(element => {
       element.setAttribute("class", "bubbles-hover")
    });

}

deselectBubble

function deselectBubble(name){
    console.log(name)
    Array.from(document.getElementsByName(name)).forEach(element => {
        element.setAttribute("class", "bubbles-left-hover")
    });
}