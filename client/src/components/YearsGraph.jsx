import {useEffect, useRef} from "react";
import * as d3 from "d3";


function YearsGraph({data}) {

    const ref = useRef();

    useEffect(() => {

        data.sort((a, b) => a._id - b._id);

        let margin = {top: 10, right: 100, bottom: 30, left: 30},
            width = 1000 - margin.left - margin.right,
            height = 300 - margin.top - margin.bottom;

        let svg = d3.select(ref.current)
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform",
                "translate(" + margin.left + "," + margin.top + ")");

        let allGroup = data.length > 0 ? Object.entries(data[0]).map(o => o[0]).filter(o => o !== '_id') : [];

        let dataReady = allGroup.map(function (grpName) { // .map allows to do something for each element of the list
            return {
                name: grpName,
                values: data.map(function (d) {
                    return {time: d._id, value: +d[grpName]};
                })
            };
        });

        let myColor = d3.scaleOrdinal()
            .domain(allGroup)
            .range(d3.schemeSet2);

        let x = d3.scaleBand()
            .domain(data.map(o => o._id))
            .range([0, width]);

        let xAxis = d3.axisBottom(x).tickFormat(d3.format('d'));

        svg.append("g")
            .attr("transform", `translate(0, ${height})`)
            .call(xAxis)
            .selectAll("text")
            .style('text-anchor', 'end')
            .attr('dx', '-0.8em')
            .attr('transform', 'rotate(-90)');


        const yLabelsSet = new Set([...data.map(d => d.start_year), ...data.map(d => d.end_year)]);
        const yLables = Array.from(yLabelsSet).sort((a, b) => 1 * a - 1 * b)


        // Add Y axis
        let y = d3.scaleBand()
            .domain(yLables)
            .range([height, 0]);

        svg.append("g")
            .call(d3.axisLeft(y));

        // Add the lines
        let line = d3.line()
            .x(function (d) {
                return x(+d.time)
            })
            .y(function (d) {
                return y(+d.value)
            })
        svg.selectAll("myLines")
            .data(dataReady)
            .enter()
            .append("path")
            .attr("d", function (d) {
                return line(d.values)
            })
            .attr("stroke", function (d) {
                return myColor(d.name)
            })
            .style("stroke-width", 2)
            .style("fill", "none")

        // Add the points
        svg
            // First we need to enter in a group
            .selectAll("myDots")
            .data(dataReady)
            .enter()
            .append('g')
            .style("fill", function (d) {
                return myColor(d.name)
            })
            // Second we need to enter in the 'values' part of this group
            .selectAll("myPoints")
            .data(function (d) {
                return d.values
            })
            .enter()


        // Add a legend at the end of each line
        svg
            .selectAll("myLabels")
            .data(dataReady)
            .enter()
            .append('g')
            .append("text")
            .datum(function (d) {
                return {name: d.name, value: d.values[d.values.length - 1]};
            }) // keep only the last value of each time series
            .attr("transform", function (d) {
                return "translate(" + x(d.value.time) + "," + y(d.value.value) + ")";
            }) // Put the text at the position of the last point
            .attr("x", 12) // shift the text a bit more right
            .text(function (d) {
                return d.name;
            })
            .style("fill", function (d) {
                return myColor(d.name)
            })
            .style("font-size", 15)


    }, []);


    return <svg ref={ref}></svg>
}

export default YearsGraph;