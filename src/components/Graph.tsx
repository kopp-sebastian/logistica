import { useState, useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { useNodes } from '../providers/NodesContext';
import { useEdges } from '../providers/EdgesContext';
import { Node } from '../providers/NodesContext';
import WeightingDialog from './WeightingDialog';

interface GraphProps {
  onNodeSelect: (nodeId: number | null) => void;
  selectedNode: number | null;
  isManualWeightInput: boolean;
}

const Graph: React.FC<GraphProps> = ({ onNodeSelect, selectedNode, isManualWeightInput }) => {
  const { nodes, addNode } = useNodes();
  const { edges, addEdge } = useEdges();
  const [sourceNode, setSourceNode] = useState<Node | null>(null);
  const [targetNode, setTargetNode] = useState<Node | null>(null);
  const [showWeightingDialog, setShowWeightingDialog] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const svgRef = useRef<SVGSVGElement>(null);
  const tempLineRef = useRef<any>(null);
  const isManualWeightInputRef = useRef(isManualWeightInput);

  useEffect(() => {
    isManualWeightInputRef.current = isManualWeightInput;
  }, [isManualWeightInput]);

  useEffect(() => {
    if (!svgRef.current) return;

    const svg = d3.select(svgRef.current);

    // Initialize layers only if they don't already exist
    if (!svg.select('#grid-layer').node()) {
      svg.append('g').attr('id', 'grid-layer');
    }
    if (!svg.select('#edge-layer').node()) {
      svg.append('g').attr('id', 'edge-layer');
    }
    if (!svg.select('#node-layer').node()) {
      svg.append('g').attr('id', 'node-layer');
    }

    // Select layers
    const gridLayer = svg.select('#grid-layer');
    const edgeLayer = svg.select('#edge-layer');
    const nodeLayer = svg.select('#node-layer');

    // disable the option to select text on the svg
    svg.attr('focusable', false)
      .attr('aria-hidden', true)
      .style('-webkit-tap-highlight-color', 'transparent')
      .style('-webkit-user-select', 'none')
      .style('-khtml-user-select', 'none')
      .style('-moz-user-select', 'none')
      .style('-ms-user-select', 'none')
      .style('user-select', 'none');

    const width = 800;
    const height = 800;
    const margin = 40;

    const xScale = d3.scaleLinear().domain([-100, 100]).range([margin, width - margin]);
    const yScale = d3.scaleLinear().domain([-100, 100]).range([height - margin, margin]);

    // Grid lines
    const makeXLines = () => d3.axisBottom(xScale).ticks(10);
    const makeYLines = () => d3.axisLeft(yScale).ticks(10);

    // Draw grid lines
    gridLayer.append('g')
      .attr('class', 'grid x-grid')
      .attr('transform', `translate(0, ${height - margin})`)
      .call(makeXLines().tickSize(-height + 2 * margin).tickFormat(() => ''))
      .selectAll('line')
      .attr('stroke', (_, i) => (i === 5 ? 'black' : '#babbbf'));

    gridLayer.append('g')
      .attr('class', 'grid y-grid')
      .attr('transform', `translate(${margin}, 0)`)
      .call(makeYLines().tickSize(-width + 2 * margin).tickFormat(() => ''))
      .selectAll('line')
      .attr('stroke', (_, i) => (i === 5 ? 'black' : '#babbbf'));

    // Axes
    const xAxis = d3.axisBottom(xScale).ticks(10);
    const yAxis = d3.axisLeft(yScale).ticks(10);

    // Append x-axis
    gridLayer.append("g")
      .attr("transform", `translate(0, ${height - margin})`)
      .call(xAxis);

    // Append y-axis
    gridLayer.append("g")
      .attr("transform", `translate(${margin}, 0)`)
      .call(yAxis);

    gridLayer.append('g')

    svg.on('click', function (event) {
      if (isDragging) { // New condition
        setIsDragging(false);
        return;
      }
      if (d3.select(event.target).classed('node-circle')) {
        return;
      }
      if (d3.select(event.target).classed('node-circle')) {
        return;
      }
      const [x, y] = d3.pointer(event);
      const invertedX = xScale.invert(x);
      const invertedY = yScale.invert(y);
      if (invertedX > -100 && invertedX < 100 && invertedY > -100 && invertedY < 100) {
        addNode({ x: invertedX, y: invertedY, id: nodes.length + 1 });
      }
    });

    const nodeGroup = nodeLayer
      .selectAll('.node')
      .data(nodes, (node: any) => node.id)
      .join('g')
      .attr('class', 'node')
      .attr('transform', (d: Node) => `translate(${xScale(d.x)}, ${yScale(d.y)})`)
      .on('mouseover', function () {
        d3.select(this).select('.node-circle')
          .transition()
          .duration(150)
          .attr('r', 16)
          .attr('stroke-width', 3);

        d3.select(this).select('text')
          .transition()
          .duration(150)
          .attr('font-size', '14px');
      })
      .on('mouseout', function () {
        d3.select(this).select('.node-circle')
          .transition()
          .duration(150)
          .attr('r', 13)
          .attr('stroke-width', 1);

        d3.select(this).select('text')
          .transition()
          .duration(150)
          .attr('font-size', '12px');
      });

    nodeGroup
      .append('circle')
      .attr('class', 'node-circle')
      .attr('cx', 0)
      .attr('cy', 0)
      .attr('r', 13)
      .attr('fill', d => (selectedNode === d.id ? 'green' : 'blue'))
      .attr('stroke', 'black')
      .attr('stroke-width', 1)
      .on('click', (event, d) => {
        event.stopPropagation(); // Prevent the SVG click event
        if (d.id === selectedNode) {
          onNodeSelect(null); // Unselect if the same node is clicked
        } else {
          onNodeSelect(d.id);
        }
      });

    nodeGroup
      .append('text')
      .attr('x', 0)
      .attr('y', 4)
      .attr('text-anchor', 'middle')
      .attr('font-size', '12px')
      .attr('fill', 'white')
      .text(d => d.id)
      .on('click', (event, d) => {
        event.stopPropagation(); // Prevent the SVG click event
        if (d.id === selectedNode) {
          onNodeSelect(null); // Unselect if the same node is clicked
        } else {
          onNodeSelect(d.id);
        }
      });

    nodeLayer.selectAll('.node');

    const dragBehavior = d3.drag<SVGGElement, Node>()
      .on('start', function (event: d3.D3DragEvent<SVGGElement, Node, unknown>, d: Node) {
        setIsDragging(true);
        setSourceNode(d);
        const startPoint = [xScale(d.x), yScale(d.y)];
        tempLineRef.current = svg.append('line')
          .attr('x1', startPoint[0])
          .attr('y1', startPoint[1])
          .attr('x2', startPoint[0])
          .attr('y2', startPoint[1])
          .attr('stroke', 'black')
          .attr('stroke-dasharray', '5,5');
      })
      .on('drag', function (event: d3.D3DragEvent<SVGGElement, Node, unknown>, d: Node) {
        const [x, y] = d3.pointer(event, svg.node() as SVGGElement);
        tempLineRef.current.attr('x2', x).attr('y2', y);
      })
      .on('end', function (event: d3.D3DragEvent<SVGGElement, Node, unknown>, d: Node) {
        const [x, y] = d3.pointer(event, svg.node() as SVGGElement);
        const target = nodes.find(
          node =>
            Math.sqrt(
              (node.x - xScale.invert(x)) ** 2 +
              (node.y - yScale.invert(y)) ** 2
            ) < 5
        );

        if (target && target.id !== d.id) {
          handleEdgeCreation(d, target);
        } else {
          if (tempLineRef.current) {
            tempLineRef.current.remove();
            tempLineRef.current = null;
          }
        }
        setIsDragging(false);
      });
    (nodeGroup as any).call(dragBehavior);

    const lineGenerator = d3.line<{ x: number; y: number }>()
      .x(d => xScale(d.x))
      .y(d => yScale(d.y));

    const edgeGroup = edgeLayer
      .selectAll('.edge-group')
      .data(edges)
      .join('g')
      .attr('class', 'edge-group');

    edgeGroup
      .append('path')
      .attr('class', 'edge')
      .attr('d', (d) => {
        const source = nodes.find(node => node.id === d.from);
        const target = nodes.find(node => node.id === d.to);
        if (source && target) {
          return lineGenerator([source, target]);
        }
        return null;
      })
      .attr('stroke', 'black')
      .attr('stroke-width', 2)
      .attr('fill', 'none');

    edgeGroup
      .append('text')
      .attr('x', (d) => {
        const source = nodes.find(node => node.id === d.from);
        const target = nodes.find(node => node.id === d.to);
        if (source && target) {
          const midX = xScale((source.x + target.x) / 2);
          const deltaY = target.y - source.y;
          const deltaX = target.x - source.x;
          const slope = deltaY / deltaX;

          const offset = Math.abs(slope) > 5 ? 10 : 0;  // Add horizontal offset for nearly vertical lines
          return midX + offset;
        }
        return 0;
      })

      .attr('y', (d) => {
        const source = nodes.find(node => node.id === d.from);
        const target = nodes.find(node => node.id === d.to);
        if (source && target) {
          const midY = yScale((source.y + target.y) / 2);
          return midY;
        }
        return 0;
      })
      .attr('dy', (d) => {
        const source = nodes.find(node => node.id === d.from);
        const target = nodes.find(node => node.id === d.to);
        if (source && target) {
          const deltaY = target.y - source.y;
          const deltaX = target.x - source.x;
          const slope = deltaY / deltaX;

          // Add vertical offset for nearly vertical lines
          return Math.abs(slope) > 5 ? "-1.5em" : "-0.3em";
        }
        return "-0.3em";
      })
      .attr('text-anchor', 'middle')
      .attr('font-size', '16px')
      .attr('fill', 'black')
      .text((d) => d.weight);


    edgeLayer.selectAll('.edge');

    if (nodes.length === 0) {
      nodeLayer.selectAll('.node').remove();
    }
    if (edges.length === 0) {
      edgeLayer.selectAll('.edge').remove();
    }
  }, [nodes, edges, selectedNode]);

  const handleWeightingDialogClose = (weight: number, sourceNode: Node | null) => {
    if (sourceNode && targetNode) {
      addEdge(sourceNode.id, targetNode.id, weight);
      setSourceNode(null);
      setTargetNode(null);
    }
    removeTempLine();
    setShowWeightingDialog(false);
  };

  const handleEdgeCreation = (source: Node, target: Node) => {
    if (isManualWeightInputRef.current) {
      setSourceNode(source);
      setTargetNode(target);
      setShowWeightingDialog(true);
    } else {
      const weight = calculateWeight(source, target);
      addEdge(source.id, target.id, Math.round(weight));
      removeTempLine();
    }
  };

  const removeTempLine = () => {
    if (tempLineRef.current) {
      tempLineRef.current.remove();
      tempLineRef.current = null;
    }
  }

  const calculateWeight = (nodeA: Node, nodeB: Node) => {
    const xDistance = Math.abs(nodeA.x - nodeB.x);
    const yDistance = Math.abs(nodeA.y - nodeB.y);
    return Math.sqrt(xDistance ** 2 + yDistance ** 2);
  };

  return (
    <div>
      <svg ref={svgRef} width={800} height={800}></svg>
      {showWeightingDialog && (
        <WeightingDialog sourceNode={sourceNode} targetNode={targetNode} onClose={handleWeightingDialogClose} />
      )}
    </div>
  );
};

export default Graph;