// @TODO: YOUR CODE HERE!
// Create chart height and width

var svgWidth = 960;
var svgHeight = 500;

var margin = {
    top: 20,
    right: 40,
    left: 100,
    bottom: 60
};

var chartWidth = svgWidth - margin.left - margin.right;
var chartHeight = svgHeight - margin.top - margin.bottom;

//Create a d3 function for SVG and chartgGroup

var svg = d3.select("#scatter")
    .append("svg")
    .attr("width", svgWidth)
    .attr("height", svgHeight);

var chartGroup = svg.append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

var chosenX = "poverty";

function xScale(data, chosenX) {
    var xLinearScale = d3.scaleLinear()
        .domain([8, d3.max(data, d => d[chosenX])])
        .range([0, chartWidth]);

    return xLinearScale;
};

// Import datasets

d3.csv("assets/data/data.csv").then(function (data) {
    data.forEach(function (data) {
        data.healthcare = +data.healthcare;
        data.poverty = +data.poverty;

    });

    // create both x and y LinearScale

    var xLinearScale = xScale(data, chosenX);

    var yLinearScale = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.healthcare)])
        .range([chartHeight, 0]);

    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);

    // Create x axis codes

    var xAxis = chartGroup.append("g")
        .classed("x-axis", true)
        .attr("transform", `translate(0, ${chartHeight})`)
        .call(bottomAxis);

    chartGroup.append("g")
        .call(leftAxis);

    // Create circleGroup with beautiful color display

    var circlesGroup = chartGroup.selectAll("circle")
        .data(data)
        .enter()
        .append("circle")
        .attr("cx", d => xLinearScale(d.poverty))
        .attr("cy", d => yLinearScale(d.healthcare))
        .attr("r", "16")
        .attr("fill", "lightblue")
        .attr("opacity", ".8");


    chartGroup
        .selectAll("abbr")
        .data(data)
        .enter()
        .append("text")
        .text(d => d.abbr)
        .attr("text-anchor", "middle")
        .attr("dx", d => xLinearScale(d.poverty))
        .attr("dy", d => yLinearScale(d.healthcare))
        .attr("font-size", "8px")
        .attr("color", "red")


    // Set toolTip to show values in each circle

    var toolTip = d3.tip()
        .attr("class", "tooltip")
        .offset([80, -60])
        .html(function (d) {
            return (`${d.state}<br>healthcare: ${d.healthcare}<br>percentage ${d.poverty}`)
        });

    chartGroup.call(toolTip);

    // Mouseover and mouseout to show/hide values

    chartGroup.selectAll("circle")
        .on("mouseover", function (d) { toolTip.show(d, this) })
        .on("mouseout", function (d) { toolTip.hide(d, this) })

    // Display 

    chartGroup.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left + 40)
        .attr("x", 0 - (chartHeight / 2))
        .attr("dy", "1em")
        .attr("class", "axisText")
        .text("Lacks healthcare (%)");

    chartGroup.append("text")

        .attr("y", chartHeight + margin.bottom / 2)
        .attr("x", chartWidth / 2)
        .attr("class", "axisText")
        .text("In poverty (%)");


});
