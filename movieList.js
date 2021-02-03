
async function initMovieList(data) {

    let pagesNeeded = Math.floor(data.length / 50)
    if (data.length % 50 != 0) pagesNeeded += 1
    let lowerIndex = 0
    let higherIndex = 50
    console.log(pagesNeeded)

    d3.select("#select")
        .on("change", dosmth)

    return new Promise(() => {
        makeList(data)

        let array = document.getElementsByClassName("card")
        Array.from(array).forEach(element => {
            element.onmouseover = function () {
                selectBubble(element.getAttribute("value"))
            };
            element.onmouseleave = function () {
                deselectBubble(element.getAttribute("value"))
            };
        });



    });

}


var dosmth = () => {
    let select = document.getElementById("select");
    let value = document.getElementsByTagName("option")[select.selectedIndex].value
    let data = state.data

    switch (value) {
        case "name-asc":
            data = data.sort(function (x, y) {
                return d3.ascending(x.name, y.name);
            })
            d3.selectAll(".card").remove()
            updateList(data, true)
            break;
        case "name-desc":
            data = data.sort(function (x, y) {
                return d3.descending(x.name, y.name);
            })
            updateList(data, true)
            break;
    }
}
async function updateList(newData, replace) {

    console.log(newData)

    if (replace) {

        makeList(newData)
        let array = document.getElementsByClassName("card")
        Array.from(array).forEach(element => {
            element.onmouseover = function () {
                selectBubble(element.getAttribute("value"))
            };
            element.onmouseleave = function () {
                deselectBubble(element.getAttribute("value"))
            };
        });
    }

    else {
        d3.selectAll(".card").filter(function (d) {
            return newData.indexOf(d) < 0
        }).remove()
    }
}


function makeList(data) {
    let newdata = [...data]
    //newdata = newdata.splice(0, 100)

    console.log(data)
    let card = d3.select("#movie-cards")
        .selectAll("div")
        .data(newdata)
        .enter()
        .append("div")
        .attr("class", "card")
        .attr("value", function (d) {
            return d.name
        })


    let title = card.append("div")
        .attr("class", "card-title d-flex justify-content-between")

    title.append("span")
        .html(function (d) {
            return d.name
        })

    title.append("span")
        .html(function (d) {
            return d.score
        }).style("color", function (d) {
            let score = parseInt(d.score)
            if (score < 5) {
                return "red"
            } if (score < 7)
                return "orange"
            else return "green"
        })

    card.append("hr")

    let body = card.append("div")
        .attr("class", "card-body d-flex justify-content-center")
    makeCard(body)
}

function makeCard(body) {
    let column1 = body
        .append("div")
        .attr("class", "flex-column w-50")

    column1.append("div")
        .html(function (d) {
            return "Genre: " + d.genre
        })
    column1.append("div")
        .html(function (d) {
            return "Runtime: " + d.runtime
        })

    column1.append("div")
        .html(function (d) {
            return "Rating: " + d.rating
        })

    let column2 = body
        .append("div")
        .attr("class", "flex-column w-50")

    column2.append("div")
        .html(function (d) {
            return "Release Date: " + d.year
        })
    column2.append("div")
        .html(function (d) {
            return "Star: " + d.star
        })

    column2.append("div")
        .html(function (d) {
            return "Country: " + d.country
        })
}