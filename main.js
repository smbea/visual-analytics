let state = {
    depth:0,
    data:null,
    unchangeableData:null
}


//Read the data
d3.csv("./pca.csv", function (data) {

    state.unchangeableData = data.filter(function (d) { return d.budget > 35000000 && d.gross < 381000000 && d.gross > 1500000 })
    state.data = state.unchangeableData

    createSunburstVisualization(state.data);

    createBubbleVizualization(state.data)

    initMovieList(state.data)
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