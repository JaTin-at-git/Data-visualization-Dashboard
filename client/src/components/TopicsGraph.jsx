import {useEffect, useRef} from "react";
import * as d3 from "d3";

function TopicsGraph({data}) {
    const ref = useRef();

    console.log(data)
    data = {children: data || []}
    console.log(data.children.length)

    useEffect(() => {

        // set the dimensions and margins of the graph
        let margin = {top: 10, right: 10, bottom: 10, left: 10}, width = 445 - margin.left - margin.right,
            height = 445 - margin.top - margin.bottom;

        // append the svg object to the body of the page
        let svg = d3.select(ref.current)
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


        // Give the data to this cluster layout:
        let root = d3.hierarchy(data).sum(function (d) {
            return d.value
        })

        d3.treemap()
            .size([width, height])
            .paddingTop(28)
            .paddingRight(7)
            .paddingInner(3)(root)

        // prepare a color scale
        let color = d3.scaleOrdinal(d3.schemeCategory10)

        svg
            .selectAll("rect")
            .data(root.leaves())
            .enter()
            .append("rect")
            .attr('x', function (d) {
                return d.x0;
            })
            .attr('y', function (d) {
                return d.y0;
            })
            .attr('width', function (d) {
                return d.x1 - d.x0;
            })
            .attr('height', function (d) {
                return d.y1 - d.y0;
            })
            .style("stroke", "black")
            .style("fill", function (d) {
                return color(d?.parent?.data?.name || "")
            })


        // and to add the text labels
        svg
            .selectAll("text")
            .data(root.leaves())
            .enter()
            .append("text")
            .attr("x", function (d) {
                return d.x0 + 5
            })    // +10 to adjust position (more right)
            .attr("y", function (d) {
                return d.y0 + 20
            })    // +20 to adjust position (lower)
            // .text(function (d) {
            //     return d?.data?.name || "no-record"
            // })
            .attr("font-size", "19px")
            .attr("fill", "white")

        // and to add the text labels
        svg
            .selectAll("vals")
            .data(root.leaves())
            .enter()
            .append("text")
            .attr("x", function (d) {
                return d.x0 + 5
            })    // +10 to adjust position (more right)
            .attr("y", function (d) {
                return d.y0 + 35
            })    // +20 to adjust position (lower)
            .text(function (d) {
                return d?.data?.value || "NA"
            })
            .attr("font-size", "11px")
            .attr("fill", "white")

        // Add title for the 3 groups
        svg
            .selectAll("titles")
            .data(root.descendants().filter(function (d) {
                return d.depth === 1
            }))
            .enter()
            .append("text")
            .attr("x", function (d) {
                return d.x0
            })
            .attr("y", function (d) {
                return d.y0 + 21
            })
            .text(function (d) {
                return d?.data?.name || "null"
            })
            .attr("font-size", "19px")
            .attr("fill", function (d) {
                return color(d?.data?.name)
            })

        // Add title
        // svg
        //     .append("text")
        //     .attr("x", 0)
        //     .attr("y", 14)    // +20 to adjust position (lower)
        //     .text("Three group leaders and 14 employees")
        //     .attr("font-size", "19px")
        //     .attr("fill", "grey")


    }, []);

    return <svg ref={ref}></svg>
}

export default TopicsGraph;