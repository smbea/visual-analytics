let state = {
    depth:0,
    data:null,
    unchangeableData:[]
}


//Read the data
d3.csv("./pca.csv", function (data) {

    state.unchangeableData = data.filter(function (d) { 
        return d.budget > 35000000 && d.gross < 381000000 && d.gross > 1500000 
    })

    state.data = state.unchangeableData
    createSunburstVisualization(state.unchangeableData);
    createBubbleVizualization(state.unchangeableData)
    initMovieList(state.unchangeableData)
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

function updateData(labels, names){
    let newData = state.data
    let replace = false

    if (state.depth > labels.length) {
        let ogData = state.unchangeableData
        let tempData = ogData.filter(function (d, i) {
            return newData.indexOf(d) < 0
        })
        replace = true
        newData = filter(labels, names, tempData)
    }

    else if (state.depth < labels.length) {
        newData = filter(labels, names, newData)
    }

    state.depth = labels.length
    state.data = newData
    updateBubble(newData, replace)
    updateList(newData, replace)
    return newData
}


function filter(labels, names, newData){
    if (labels.length == 1) {
        newData = newData.filter(function (d) {
            return (d[labels[0]] == names[0]);
        })
    }else if(labels.length == 2) {
        let scoreArray = names[1].split('-');
        newData = newData.filter(function (d) {
            return (d[labels[0]] == names[0] && (d[labels[1]] <= scoreArray[1] && d[labels[1]] >= scoreArray[0]))
        })
    }else if(labels.length == 3) {
        let scoreArray = names[1].split('-');
        newData = newData.filter(function (d) {
            return (d[labels[2]] == names[2] && d[labels[0]] == names[0] && (d[labels[1]] <= scoreArray[1] && d[labels[1]] >= scoreArray[0]))
        })
    }

    return newData
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