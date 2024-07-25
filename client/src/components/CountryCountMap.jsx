import {useEffect, useRef, useState} from "react";
import * as d3 from "d3";

function CountryCountMap({data}) {
    const ref = useRef();
    const outerDiv = useRef();

    const colorDomain = Array.from(new Set(data.map(d => d.count))).sort((a, b) => 1 * a - 1 * b);

    const map = new Map();
    for (const obj of data) map.set(obj._id, obj.count)

    data = map;

    const [title, setTitle] = useState("Risk Count vs Countries");

    useEffect(() => {


        // The svg
        const svg = d3.select(ref.current).append('svg'),
            width = 500,
            height = 400;

        svg.attr('width',width).attr('height',height)

        // Map and projection
        const path = d3.geoPath();
        const projection = d3.geoMercator()
            .scale(70)
            .center([0, 20])
            .translate([width / 2, height / 2]);

        // Data and color scale
        const colorScale = d3.scaleThreshold()
            .domain(colorDomain)
            .range(d3.schemeBlues[3]);

        // Load external data and boot
        Promise.all([d3.json("https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson")]).then(function (loadData) {
            let topo = loadData[0]

            let mouseOver = function (d) {
                outerDiv.current.querySelectorAll("path").forEach(o => o.setAttribute('style', 'opacity: .3'))
                d.setAttribute('style', 'opacity: 1')
                d.setAttribute("stroke", "black")
                // d.setAttribute("fill", "#22c55e")

            }

            let mouseLeave = function (e,d) {
                outerDiv.current.querySelectorAll("path").forEach(o => {
                    o.setAttribute('style', 'opacity: 1');
                    o.setAttribute('stroke', 'none');
                })
                setTitle("Risk Count vs Countries");
                // e.target.setAttribute("fill", colorScale(data.get(d.properties.name) || 0))
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
                .attr('title', (d) => d.total)
                .attr("class", function (d) {
                    return "Country"
                })
                .style("opacity", .8)
                .on("mouseover", function (e, d) {
                    mouseOver(this)
                    setTitle(`${d.properties.name} reported ${d.total} risks`);
                })
                .on("mouseleave", mouseLeave)
        })

        return ()=>ref.current.querySelector("svg").remove()

    }, [data]);

    return <div title={title} ref={outerDiv} className="shadow-md bg-white rounded-md relative">
        <div className="text-gray-500 absolute top-0 right-0 p-2">{title}</div>
        <div ref={ref}></div>
    </div>

}

export default CountryCountMap;