
//Read the data
d3.csv("./dataset.csv", function (data) {

    createSunburstVisualization(data);

    createBubbleVizualization(data)

    initMovieList(data)
})


async function initMovieList(data) {

    let pagesNeeded = Math.floor(data.length/50)
    if(data.length%50 != 0) pagesNeeded+= 1
    let lowerIndex = 0
    let higherIndex = 50
    console.log(pagesNeeded)


    return new Promise(() => {
        getCard(data)

      });

}

async function updateList(labels, names){

    let newData
    let list = d3.select("#movies-list")

    if (names.length == 1) {
        list.selectAll("div").filter(function (d) {
            return (d[labels[0]] != names[0]);
        }).remove()
    }
    
    if (names.length == 2) {
        let scoreArray = names[1].split('-');
        list.selectAll("div").filter(function (d) {
            return (d[labels[0]] != names[0] || (d[labels[1]] >= scoreArray[1] || d[labels[1]] <= scoreArray[0]));
        }).remove()
    }
    
    if (names.length == 3) {
        let scoreArray = names[1].split('-');
        list.selectAll("div").filter(function (d) {
            return (d[labels[2]] != names[2] || d[labels[0]] != names[0] || (d[labels[1]] >= scoreArray[1] || d[labels[1]] <= scoreArray[0]));
        }).remove()
    }

    /*d3.select("#movies-list")
        .selectAll("div")
        .data(data)
        .enter()
        .append("div")
        .attr("class", "card")
        .append("div")
        .attr("class", "card-body")
        .html(function (d) { return d.name; })*/
}


function getCard(data) {
    console.log(data)
    let temp = d3.select("#movies-list")
        .selectAll("div")
        .data(data)
        .enter()
        .append("div")
        .attr("class", "card")
        .append("div")
        .attr("class", "card-body")
        .html(function (d) { return d.name + "-" + d.genre + "-" + d.country})

    console.log(temp)
}


if (names.length == 0) {
    let oldList = currentData

    currentData = unchangeableData
    console.log(currentData)
    svg.selectAll("dot")
        .data(currentData.filter(function (d, i) {
            return oldList.indexOf(d) >= 0
        }))
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

if (names.length == 1) {
    svg.selectAll("circle").filter(function (d) {
        return (d[labels[0]] != names[0]);
    }).remove()
}

if (names.length == 2) {
    let scoreArray = names[1].split('-');
    svg.selectAll("circle").filter(function (d) {
        return (d[labels[0]] != names[0] || (d[labels[1]] >= scoreArray[1] || d[labels[1]] <= scoreArray[0]));
    }).remove()
}

if (names.length == 3) {
    let scoreArray = names[1].split('-');
    svg.selectAll("circle").filter(function (d) {
        return (d[labels[2]] != names[2] || d[labels[0]] != names[0] || (d[labels[1]] >= scoreArray[1] || d[labels[1]] <= scoreArray[0]));
    }).remove()
}