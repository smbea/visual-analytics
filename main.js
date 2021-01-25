d3.csv("./dataset.csv")
    .get(function (data) {

        let root = prepareSunburst(data);
        initializeBreadcrumbTrail(root)
        createVisualization(root);

    });
