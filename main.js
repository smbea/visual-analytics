
//Read the data
d3.csv("./dataset.csv", function (data) {

    createSunburstVisualization(data);

    createBubbleVizualization(data)

})

