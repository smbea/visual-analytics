
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

async function updateList(newData, replace){

    d3.select("#movies-list")
        .selectAll("div").remove()

    d3.select("#movies-list")
        .selectAll("div")
        .data(newData)
        .enter()
        .append("div")
        .attr("class", "card")
        .append("div")
        .attr("class", "card-body")
        .html(function (d) { return d.name; })
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