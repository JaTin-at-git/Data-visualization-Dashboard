import {useEffect, useRef} from "react";
import * as d3 from "d3";

function LikelihoodGraph({data}) {

    const ref = useRef();

    useEffect(() => {

        data.sort((a, b) => a._id - b._id);

        let margin = {top: 10, right: 30, bottom: 20, left: 50}, width = 300 - margin.left - margin.right,
            height = 300 - margin.top - margin.bottom;


        let svg = d3.select(ref.current)
            .attr('class', 'overflow-visible transition-all')
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        let intensityGroups = data.length > 0 ? Object.entries(data[0]).filter(o => o[0] !== '_id').map(o => o[0]) : [];
        let likelihoogGroup = data.length > 0 ? data.map(o => o._id) : [];

        // Add X axis
        let x = d3.scaleBand()
            .domain(likelihoogGroup)
            .range([0, width])
            .padding([0.2])

        svg.append("g")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(x).tickSizeOuter(0));

        svg.append("text")
            .attr("class", "text-xs")
            .attr("text-anchor", "middle")
            .attr("x", width / 2)
            .attr("y", height + 30)
            .text("Likelihood");


        // Add Y axis
        let y = d3.scaleLinear()
            .domain([0, d3.max(data, d => d.l1 + d.l2 + d.l3)])
            .range([height, 0]);

        svg.append("g")
            .call(d3.axisLeft(y));

        svg.append("text")
            .attr("class", "text-xs")
            .attr("text-anchor", "middle")
            .attr("transform", "rotate(-90)")
            .attr("x", -height / 2)
            .attr("y", -40)
            .text("Count");

        let color = d3.scaleOrdinal()
            .domain(intensityGroups)
            .range(d3.schemePaired);

        let stackedData = d3.stack()
            .keys(intensityGroups)(data)


        // ----------------
        // Highlight a specific subgroup when hovered
        // ----------------

        // What happens when user hover a bar
        let mouseover = function (d) {
            let subgroupName = d3.select(this.parentNode).datum().key; // This was the tricky part
            d3.selectAll(".myRect").style("opacity", 0.2)
            d3.selectAll("." + subgroupName)
                .style("opacity", 1)
        }

        // When user do not hover anymore
        let mouseleave = function (d) {
            // Back to normal opacity: 0.8
            d3.selectAll(".myRect")
                .style("opacity", 0.8)
        }

        // Show the bars
        svg.append("g")
            .selectAll("g")
            // Enter in the stack data = loop key per key = group per group
            .data(stackedData)
            .enter().append("g")
            .attr("fill", function (d) {
                return color(d.key);
            })
            .attr("class", function (d) {
                return "myRect " + d.key
            }) // Add a class to each subgroup: their name
            .selectAll("rect")
            // enter a second time = loop subgroup per subgroup to add all rectangles
            .data(function (d) {
                return d;
            })
            .enter().append("rect")
            .attr("x", function (d) {
                return x(d.data._id);
            })
            .attr("y", function (d) {
                return y(d[1]);
            })
            .attr("height", function (d) {
                return y(d[0]) - y(d[1]);
            })
            .attr("width", x.bandwidth())
            .attr("stroke", "grey")
            .on("mouseover", mouseover)
            .on("mouseleave", mouseleave)

    }, []);

    return <svg ref={ref}></svg>
}

export default LikelihoodGraph;