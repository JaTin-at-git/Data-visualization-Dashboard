import {useEffect, useRef} from "react";
import * as d3 from "d3";

function RelevanceGraph({data}) {

    data.sort((a, b) => a._id - b._id)
    const ref = useRef();

    useEffect(() => {


        // Specify the chart’s dimensions.
        const width = 300;
        const height = 300;

        // Create the color scale.
        const color = d3.scaleOrdinal(d3.schemeSet3);

        // Create the pie layout and arc generator.
        const pie = d3.pie()
            .sort(null)
            .value(d => d.value);

        const arc = d3.arc()
            .innerRadius(0)
            .outerRadius(Math.min(width, height) / 2 - 1);

        const labelRadius = arc.outerRadius()() * 0.8;

        // A separate arc generator for labels.
        const arcLabel = d3.arc()
            .innerRadius(labelRadius)
            .outerRadius(labelRadius);

        const arcs = pie(data);

        // Create the SVG container.
        const svg = d3.select(ref.current)
            .append('svg')
            .attr("width", width)
            .attr("height", height)
            .attr("viewBox", [-width / 2, -height / 2, width, height])
            .attr("style", "max-width: 100%; height: auto; font: 10px sans-serif;")

        // Add a sector path for each value.
        svg.append("g")
            .attr("stroke", "white")
            .selectAll()
            .data(arcs)
            .join("path")
            .attr("fill", d => color(d.data._id))
            .attr("d", arc)
            .append("title")
            .text(d => `Relevance ${d.data._id}: ${d.data.value.toLocaleString("en-US")}`)

        // Create a new arc generator to place a label close to the edge.
        // The label shows the value if there is enough room.
        svg.append("g")
            .attr("text-anchor", "middle")
            .selectAll()
            .data(arcs)
            .join("text")
            .attr("transform", d => `translate(${arcLabel.centroid(d)})`)

            .call(text => text.append("tspan")

                .text(d => d.data._id))


        return () => ref.current.querySelector('svg').remove()

    }, [data]);

    return <div className="flex w-fit gap-8 bg-white p-8 rounded-md shadow-md">

        <div className="flex justify-center flex-col items-center">
            <div className="w-[300px]" ref={ref}></div>
            <div className="text-gray-500 p-2">Relevance Count</div>
        </div>

        <table className="table table-zebra table-sm">
            {/* head */}
            <thead>
            <tr>
                <th>Relevance</th>
                <th>Count</th>
            </tr>
            </thead>
            <tbody>
            {data.map((d, i) => {
                return (<tr key={i}>
                    <td>{d._id || "NA"}</td>
                    <td>{d.value}</td>
                </tr>)
            })}
            </tbody>
        </table>

    </div>

}

export default RelevanceGraph;