let previous = null
var s_tooltip
const allRanges = document.querySelectorAll(".range-wrap");
allRanges.forEach(wrap => {
    const range = wrap.querySelector(".range");
    const bubble = wrap.querySelector(".bubble");

    range.addEventListener("input", () => {
        setBubble(range, bubble, true);
    });
    setBubble(range, bubble, false);
});

function setBubble(range, bubble, update) {
    const val = range.value;
    const min = range.min ? range.min : 0;
    const max = range.max ? range.max : 100;
    const newVal = Number(((val - min) * 100) / (max - min));
    bubble.innerHTML = val;

    // Sorta magic numbers based on size of the native UI thumb
    bubble.style.left = `calc(${newVal}% + (${8 - newVal * 0.15}px))`;
    if (update)
        updateSimilarity(val)
}

var s_x
var s_y
var s_margin = { top: 10, right: 30, bottom: 30, left: 60 },
    s_width = 460 - s_margin.left - s_margin.right,
    s_height = 400 - s_margin.top - s_margin.bottom;

var s_svg
var s_color = d3.scaleOrdinal()
    .domain(["first", "second", "third", "fourth"])
    .range(d3.schemeSet2)

function initScatterplot(data) {
    // set the dimensions and margins of the graph
    previous = data

    // append the svg object to the body of the page
    s_svg = d3.select("#similarity-scatterplot")
        .append("svg")
        .style("position", "relative")
        .attr("width", s_width + s_margin.left + s_margin.right)
        .attr("height", s_height + s_margin.top + s_margin.bottom)
        .append("g")
        .attr("transform",
            "translate(" + s_margin.left + "," + s_margin.top + ")");

    s_tooltip = d3.select("#similarity-scatterplot")
        .append("div")
        .style("opacity", 0)
        .style("position", "absolute")
        .style("background-color", "black")
        .style("border-radius", "5px")
        .style("padding", "10px")
        .style("color", "white")


    // Color scale: give me a specie name, I return a color
    initAxis(data)
    updateScatterplotData(data)


}

function updateScatterplotData(data) {

    let newData = data

    if (previous) {
        let newData = data.filter(function (d, i) {
            return previous.indexOf(d) < 0
        })
    }

    // Add dots
    s_svg.append('g')
        .selectAll("dot")
        .data(newData)
        .enter()
        .append("circle")
        .attr("class", function (d) { return `bubbles ${d.Segment}` })
        .style("visibility", "hidden")
        .attr("cx", function (d) { return s_x(d.Component2); })
        .attr("cy", function (d) { return s_y(d.Component1); })
        .attr("r", 5)
        .style("visibility", "initial")
        .style("fill", function (d) { return s_color(d.Segment) })
        .on("mouseover", showSTooltip)
        .on("mousemove", moveSTooltip)
        .on("mouseleave", hideSTooltip)

}

function initAxis(data) {

    s_x = d3.scaleLinear()
        .domain(d3.extent(data, function (d) { return +d.Component2; }))
        .range([0, s_width]);
    s_svg.append("g")
        .attr("transform", "translate(0," + s_height + ")")
        .style("visibility", "hidden")
        .call(d3.axisBottom(s_x));

    // Add s_y axis
    s_y = d3.scaleLinear()
        .domain(d3.extent(data, function (d) { return +d.Component1; }))
        .range([s_height, 0]);
    s_svg.append("g")
        .style("visibility", "hidden")
        .call(d3.axisLeft(s_y));

}

function updateAxis(data) {

    s_svg.selectAll("g").remove()

    s_x = d3.scaleLinear()
        .domain(d3.extent(data, function (d) { return +d.Component2; }))
        .range([0, s_width]);
    s_svg.append("g")
        .attr("transform", "translate(0," + s_height + ")")
        .style("visibility", "hidden")
        .call(d3.axisBottom(s_x));

    // Add s_y axis
    s_y = d3.scaleLinear()
        .domain(d3.extent(data, function (d) { return +d.Component1; }))
        .range([s_height, 0]);
    s_svg.append("g")
        .style("visibility", "hidden")
        .call(d3.axisLeft(s_y));
}

function updateSimilarity(val) {
    d3.csv(`./pca_${val}.csv`, function (data) {

        let newData = data.filter(function (d) {
            return d.budget > 35000000 && d.gross < 381000000 && d.gross > 1500000
        })
        console.log("have result")

        s_svg.selectAll("circle").remove()
        updateAxis(newData)
        updateScatterplotData(newData)
        previous = newData
    })
}

var onMouseOver = function (d) {
    console.log(d)
    highlight(d)
    showTooltip(d)
}


function highlight(d) {
    console.log(d)

    selected_specie = d.Segment
    console.log(selected_specie)

    s_svg.selectAll("circle")
        .transition()
        .duration(200)
        .style("fill", "lightgrey")
        .attr("r", 3)

    console.log(s_svg.selectAll("circle"))

    s_svg.selectAll("." + selected_specie)
        .transition()
        .duration(200)
        .style("fill", function (d) { return s_color(d.Segment) })
        .attr("r", 6)
}

var doNotHighlight = function () {
    s_svg.selectAll("circle")
        .transition()
        .duration(200)
        .style("fill", function (d) { return s_color(d.Segment) })
        .attr("r", 5)
}

var showSTooltip = function (d) {
    console.log(d)

    highlight(d)

    s_tooltip
        .transition()
        .duration(200)
        s_tooltip
        .style("opacity", 1)
        .html(
            "Title: " + d.name
        )
        .style("left", (d3.mouse(this)[0] + 30) + "px")
        .style("top", (d3.mouse(this)[1] + 30) + "px")
}
var moveSTooltip = function (d) {

    s_tooltip
        .style("left", (d3.mouse(this)[0] + 30) + "px")
        .style("top", (d3.mouse(this)[1] + 30) + "px")
}
var hideSTooltip = function (d) {
    s_tooltip
        .transition()
        .duration(200)
        .style("opacity", 0)

    doNotHighlight(d)
}