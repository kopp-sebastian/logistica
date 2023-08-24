import {useEffect, useRef} from 'react';
import * as d3 from 'd3';
import {useNodes} from "../providers/NodesContext.tsx";
import {useEdges} from "../providers/EdgesContext.tsx";

const Graph = () => {
    const d3Container = useRef(null);
    const {nodes, setNodes} = useNodes();

    useEffect(() => {
        const width = 700;
        const height = 700;
        const margin = 40;

        const svg = d3.select(d3Container.current)
            .selectAll('svg')
            .data([null])
            .join('svg')
            .attr('width', width)
            .attr('height', height);

        const xScale = d3.scaleLinear().domain([-100, 100]).range([margin, width - margin]);
        const yScale = d3.scaleLinear().domain([-100, 100]).range([height - margin, margin]);

        // Adding click handler for the svg
        svg.on('click', function (event) {
            const [x, y] = d3.pointer(event);
            const newX = xScale.invert(x);
            const newY = yScale.invert(y);

            // Check if the coordinates are within the range and not already occupied
            if (
                newX >= -100 && newX <= 100 &&
                newY >= -100 && newY <= 100 &&
                !nodes.some(node => node.x.toFixed(1) === newX.toFixed(1) && node.y.toFixed(1) === newY.toFixed(1))
            ) {
                const newNode = {x: newX, y: newY};
                setNodes((prevNodes) => [...prevNodes, newNode]);
            }
        });

        // Grid lines
        const makeXLines = () => d3.axisBottom(xScale).ticks(10);
        const makeYLines = () => d3.axisLeft(yScale).ticks(10);

        // Draw grid lines
        svg.append('g')
            .attr('class', 'grid x-grid')
            .attr('transform', `translate(0, ${height - margin})`)
            .call(makeXLines().tickSize(-height + 2 * margin).tickFormat(() => ''))
            .selectAll('line')
            .attr('stroke', (_, i) => (i === 5 ? 'black' : '#E5E7EB'));

        svg.append('g')
            .attr('class', 'grid y-grid')
            .attr('transform', `translate(${margin}, 0)`)
            .call(makeYLines().tickSize(-width + 2 * margin).tickFormat(() => ''))
            .selectAll('line')
            .attr('stroke', (_, i) => (i === 5 ? 'black' : '#E5E7EB'));

        // Axis generators
        const xAxis = d3.axisBottom(xScale);
        const yAxis = d3.axisLeft(yScale);

        // Append x-axis
        svg.append("g")
            .attr("transform", `translate(0, ${height - margin})`)
            .call(xAxis);

        // Append y-axis
        svg.append("g")
            .attr("transform", `translate(${margin}, 0)`)
            .call(yAxis);

    }, []);

    // This useEffect will run every time nodes change.
    useEffect(() => {
        if (d3Container.current) {
            const margin = 40;
            const svg = d3.select(d3Container.current).select('svg');
            const xScale = d3.scaleLinear().domain([-100, 100]).range([margin, 700 - margin]);
            const yScale = d3.scaleLinear().domain([-100, 100]).range([700 - margin, margin]);

            // Drawing nodes
            svg.selectAll("circle.node")
                .data(nodes)
                .join("circle")
                .attr("class", "node")
                .attr("cx", (d) => xScale(d.x))
                .attr("cy", (d) => yScale(d.y) - 1.5)
                .attr("r", 15)
                .style("fill", "blue");

            // Drawing numbers inside nodes
            svg.selectAll("text.node-number")
                .data(nodes)
                .join("text")
                .attr("class", "node-number")
                .attr("x", (d) => xScale(d.x))
                .attr("y", (d) => yScale(d.y))
                .text((_, i) => i + 1)
                .attr("fill", "white")
                .attr("text-anchor", "middle")
                .attr("dominant-baseline", "middle")
                .attr("font-size", "15px");

        }
    }, [nodes]);

    return (
        <div ref={d3Container} style={{width: '700px'}}>
        </div>
    );
};

export default Graph;