var b = {
    w: 100, h: 30, s: 3, t: 10
};

const totalSize = 6820
const levels = ["All", "genre", "score", "country"]
const depth = levels.length - 1

const sWidth = 500,
    sHeight = 500,
    maxRadius = (Math.min(sWidth, sHeight) / 2) - 5;

const formatNumber = d3.format(',d');

const x = d3.scaleLinear()
    .range([0, 2 * Math.PI])
    .clamp(true);

const y = d3.scaleSqrt()
    .range([maxRadius * .1, maxRadius]);

const color = d3.scaleOrdinal(d3.schemeSet3);

const partition = d3.partition()

const arc = d3.arc()
    .startAngle(d => x(d.x0))
    .endAngle(d => x(d.x1))
    .innerRadius(d => Math.max(0, y(d.y0)))
    .outerRadius(d => Math.max(0, y(d.y1)));

const middleArcLine = d => {
    const halfPi = Math.PI / 2;
    const angles = [x(d.x0) - halfPi, x(d.x1) - halfPi];
    const r = Math.max(0, (y(d.y0) + y(d.y1)) / 2);

    const middleAngle = (angles[1] + angles[0]) / 2;
    const invertDirection = middleAngle > 0 && middleAngle < Math.PI; // On lower quadrants write text ccw
    if (invertDirection) { angles.reverse(); }

    const path = d3.path();
    path.arc(0, 0, r, angles[0], angles[1], invertDirection);
    return path.toString();
};

const textFits = d => {
    const CHAR_SPACE = 6;

    const deltaAngle = x(d.x1) - x(d.x0);
    const r = Math.max(0, (y(d.y0) + y(d.y1)) / 2);
    const perimeter = r * deltaAngle;

    return d.data.name.length * CHAR_SPACE < perimeter;

};

const sunburstSVG = d3.select('#sunburst-chart').append('svg')
    .style('width', sWidth)
    .style('height', sWidth)
    .attr('viewBox', `${-sWidth / 2} ${-sHeight / 2} ${sWidth} ${sHeight}`)
    .on('click', () => focusOn()); // Reset zoom on canvas click


function createSunburstVisualization(data) {
    let root = prepareSunburst(data);
    initializeBreadcrumbTrail(root)
    createVisualization(root);
}

function createVisualization(root) {

    root.sum(d => d.size);

    const slice = sunburstSVG.selectAll('g.slice')
        .data(partition(root).descendants())


    slice.exit().remove();


    const newSlice = slice.enter()
        .append('g').attr('class', 'slice')
        .on('click', d => {
            d3.event.stopPropagation();
            focusOn(d);
        });

    newSlice.append('title')
        .text(d => d.data.name + '\n' + formatNumber(d.value));

    newSlice.append('path')
        .attr('class', 'main-arc')
        .style('fill', d => color(d.data.name))
        .attr('d', arc);

    newSlice.append('path')
        .attr('class', 'hidden-arc')
        .attr('id', (_, i) => `hiddenArc${i}`)
        .attr('d', middleArcLine);

    const text = newSlice.append('text')
        .attr('display', d => textFits(d) ? null : 'none');

    // Add white contour
    text.append('textPath')
        .attr('startOffset', '50%')
        .attr('xlink:href', (_, i) => `#hiddenArc${i}`)
        .text(d => d.data.name)
        .style('fill', 'none')
        .style('stroke', '#fff')
        .style('stroke-width', 5)
        .style('stroke-linejoin', 'round');

    text.append('textPath')
        .attr('startOffset', '50%')
        .attr('xlink:href', (_, i) => `#hiddenArc${i}`)
        .text(d => d.data.name);
}

function focusOn(d = { x0: 0, x1: 1, y0: 0, y1: 1 }) {

    // Reset to top-level if no data point specified
    var sequenceArray = d.ancestors().reverse();
    //sequenceArray.shift(); // remove root node from the array
    var percentage = (100 * d.value / totalSize).toPrecision(3);
    var percentageString = percentage + "%";
    if (percentage < 0.1) {
        percentageString = "< 0.1%";
    }
    updateBreadcrumbs(sequenceArray, percentageString)

    const transition = sunburstSVG.transition()
        .duration(750)
        .tween('scale', () => {
            const xd = d3.interpolate(x.domain(), [d.x0, d.x1]),
                yd = d3.interpolate(y.domain(), [d.y0, 1]);
            return t => { x.domain(xd(t)); y.domain(yd(t)); };
        });

    transition.selectAll('path.main-arc')
        .attrTween('d', d => () => arc(d));

    transition.selectAll('path.hidden-arc')
        .attrTween('d', d => () => middleArcLine(d));

    transition.selectAll('text')
        .attrTween('display', d => () => textFits(d) ? null : 'none');

    moveStackToFront(d);

    //

    function moveStackToFront(elD) {
        sunburstSVG.selectAll('.slice').filter(d => d === elD)
            .each(function (d) {
                this.parentNode.appendChild(this);
                if (d.parent) { moveStackToFront(d.parent); }
            })
    }
}

function prepareSunburst(data) {

    let nestedData = d3.nest()
        .key(function (d) { return d.genre; })
        .key(function (d) {
            let roundedScore = Math.round(d.score)
            if (roundedScore <= 4) {
                return "0-5"
            } else if (roundedScore <= 7) {
                return "5-7"
            } else return "8-10"
        })
        .key(function (d) { return d.country; })
        .entries(data)

    const newData = nest("Movies", nestedData, 0, depth);
    let root = d3.hierarchy(newData);
    return root
}

function nest(name, data, depth, maxDepth) {
    if (depth < maxDepth)
        return {
            "name": name,
            children: data.map((e) => nest(e.key, e.values, depth + 1, maxDepth))
        };
    else return {
        "name": name,
        "size": data.length
    };
}

function initializeBreadcrumbTrail(root) {
    var trail = d3.select("#sequence").append("svg:svg")
        .attr("width", sWidth)
        .attr("height", 50)
        .attr("id", "trail");
    // Add the label at the end, for the percentage.
    trail.append("svg:text")
        .attr("id", "endlabel")
        .style("fill", "#000");

    updateBreadcrumbs([root], "100%")
}

function updateBreadcrumbs(nodeArray, percentageString) {

    let labels = []
    let values = []

    // Data join; key function combines name and depth (= position in sequence).
    var trail = d3.select("#trail")
        .selectAll("g")
        .data(nodeArray, function (d) { return d.data.name + d.depth; });

    // Remove exiting nodes.
    trail.exit().remove();

    // Add breadcrumb and label for entering nodes.
    var entering = trail.enter().append("svg:g");

    entering.append("svg:polygon")
        .attr("points", breadcrumbPoints)
        .style("fill", function (d) { return color(d.data.name); });


    console.log(nodeArray[0])
    for (let i= 0; i<nodeArray.length; i++){
        node = nodeArray[i]
        let reverseDepth = depth - node.height

        if (reverseDepth > 0) {
            label = levels[reverseDepth]
            labels.push(label)
            values.push(node.data.name)
        } 

    }

    entering.append("svg:text")
        .attr("x", (b.w + b.t) / 2)
        .attr("y", b.h / 2)
        .attr("dy", "0.35em")
        .attr("text-anchor", "middle")
        .text(function (d) {
            let label

            if (nodeArray.length > 1) {
                let reverseDepth = depth - d.height
                label = levels[reverseDepth]
                label = label + ": "
            } else label = ""

            return label + d.data.name;
        });

    // Merge enter and update selections; set position for all nodes.
    entering.merge(trail).attr("transform", function (d, i) {
        return "translate(" + i * (b.w + b.s) + ", 0)";
    });

    // Now move and update the percentage at the end.
    d3.select("#trail").select("#endlabel")
        .attr("x", (nodeArray.length + 0.3) * (b.w + b.s))
        .attr("y", b.h / 2)
        .attr("dy", "0.35em")
        .attr("text-anchor", "middle")
        .text(percentageString);

    // Make the breadcrumb trail visible, if it's hidden.
    d3.select("#trail")
        .style("visibility", "");

    updateBubble(labels, values)
    updateList(labels, values)

}


function breadcrumbPoints(d, i) {
    var points = [];
    points.push("0,0");
    points.push(b.w + ",0");
    points.push(b.w + b.t + "," + (b.h / 2));
    points.push(b.w + "," + b.h);
    points.push("0," + b.h);
    if (i > 0) { // Leftmost breadcrumb; don't include 6th vertex.
        points.push(b.t + "," + (b.h / 2));
    }
    return points.join(" ");
}
