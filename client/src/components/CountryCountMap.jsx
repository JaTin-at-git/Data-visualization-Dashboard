import {useEffect, useRef} from "react";
import * as d3 from "d3";

function CountryCountMap({data}) {
    const ref = useRef();

    const colorDomain = Array.from(new Set(data.map(d => d.count))).sort((a, b) => 1 * a - 1 * b);

    const map = new Map();
    for (const obj of data) map.set(obj._id, obj.count)

    data = map;

    useEffect(() => {

        // The svg
        const svg = d3.select(ref.current),
            width = +svg.attr("width"),
            height = +svg.attr("height");

        // Map and projection
        const path = d3.geoPath();
        const projection = d3.geoMercator()
            .scale(70)
            .center([0, 20])
            .translate([width / 2, height / 2]);

        // Data and color scale
        const colorScale = d3.scaleThreshold()
            .domain(colorDomain)
            .range(d3.schemeBlues[7]);

        // Load external data and boot
        Promise.all([d3.json("https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson")]).then(function (loadData) {
            let topo = loadData[0]

            let mouseOver = function (d) {
                d3.selectAll(".Country")
                    .transition()
                    .duration(200)
                    .style("opacity", .5)
                d3.select(this)
                    .transition()
                    .duration(200)
                    .style("opacity", 1)
                    .style("stroke", "black")
            }

            let mouseLeave = function (d) {
                d3.selectAll(".Country")
                    .transition()
                    .duration(200)
                    .style("opacity", .8)
                d3.select(this)
                    .transition()
                    .duration(200)
                    .style("stroke", "transparent")
            }

            // Draw the map
            svg.append("g")
                .selectAll("path")
                .data(topo.features)
                .enter()
                .append("path")
                // draw each country
                .attr("d", d3.geoPath()
                    .projection(projection))
                // set the color of each country
                .attr("fill", function (d) {
                    d.total = data.get(d.properties.name) || 0;
                    return colorScale(d.total);
                })
                .style("stroke", "transparent")
                .attr("class", function (d) {
                    return "Country"
                })
                .style("opacity", .8)
                .on("mouseover", mouseOver)
                .on("mouseleave", mouseLeave)

        })

    }, []);

    return <svg height={500} width={500} ref={ref}></svg>

}

export default CountryCountMap;