import {useEffect, useRef} from "react";
import * as d3 from "d3";

function IntensityGraph({data}) {

    const ref = useRef();
    const outerDiv = useRef();

    useEffect(() => {

        const color = d3.scaleOrdinal(d3.schemeSet3);

        // set the dimensions and margins of the graph
        var margin = {top: 20, right: 30, bottom: 40, left: 90}, width = 1000 - margin.left - margin.right,
            height = Math.max(data.length * 10, 200);

        // append the svg object to the body of the page
        var svg = d3.select(ref.current)
            .append('svg')
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .attr('class','overflow-visible')
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")")


        var x = d3.scaleLinear()
            .domain([0, d3.max(data, d => d.value)])
            .range([0, width]);

        svg.append("g")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(x))
            .selectAll("text")
            .attr("transform", "translate(-10,0)rotate(-45)")
            .style("text-anchor", "end");

        svg.append("text")
            .attr("class", "text-xs")
            .attr("text-anchor", "middle")
            .attr("x", width / 2)
            .attr("y", height + 30)
            .text("Effective Intensity");

        // Y axis
        var y = d3.scaleBand()
            .range([0, height])
            .domain(data.map(function (d) {
                return `${d.sector}/${d.topic}`;
            }))
            .padding(.1);
        svg.append("g")
            .call(d3.axisLeft(y))

        // create a tooltip
        let Tooltip = d3.select(outerDiv.current)
            .append("div")
            .style("display", "none")
            .attr("class", "tooltip")
            .style("background-color", "white")
            .style("border", "solid")
            .style("border-width", "2px")
            .style("border-radius", "5px")
            .style("padding", "5px")
            .style("position", "absolute")
            .text("some text")

        // Three function that change the tooltip when user hover / move / leave a cell
        let mouseover = function (e, d) {
            Tooltip
                .style("display", "block")
            d3.select(e.target)
                .style("stroke", "black")
                .style("opacity", 1)
        }
        let mousemove = function (e, d) {
            Tooltip
                .html("Effective intensity " + d.value)
                .style("left", (d3.pointer(e)[0] + 100) + "px")
                .style("top", (d3.pointer(e)[1]) + "px")
        }
        let mouseleave = function (e, d) {
            Tooltip
                .style("display", "none")
            d3.select(e.target)
                .style("stroke", "none")
        }

        //Bars
        svg.selectAll("myRect")
            .data(data)
            .enter()
            .append("rect")
            .attr("x", x(0))
            .attr("y", function (d) {
                return y(`${d.sector}/${d.topic}`);
            })
            .attr("width", function (d) {
                return x(d.value);
            })
            .attr("height", y.bandwidth())
            .attr("fill", (d) => color(d.sector))
            .on("mouseover", mouseover)
            .on("mousemove", mousemove)
            .on("mouseleave", mouseleave)

        return () => {
            ref.current.querySelector('svg').remove()
            outerDiv.current.querySelector(".tooltip").remove()
        }
    }, [data]);


    return <div className="mt-8 relative bg-white w-max" ref={outerDiv}>
        <div className="text-lg">Intensity contribution accross various Groups</div>
        <div ref={ref}></div>
    </div>
}


export default IntensityGraph;