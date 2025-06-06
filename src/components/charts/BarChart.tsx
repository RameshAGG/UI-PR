import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';

interface TooltipData {
  inuse: number;
  godown: number;
}

interface TooltipState {
  show: boolean;
  x: number;
  y: number;
  data: TooltipData | null;
}

const MivanStockChart = () => {
  const svgRef = useRef(null);
  const [tooltip, setTooltip] = useState<TooltipState>({
    show: false,
    x: 0,
    y: 0,
    data: null
  });

  const data = [
    { city: 'Bangalore', inuse: 31796, godown: 3056 },
    { city: 'Kolkota', inuse: 34000, godown: 1000 },
    { city: 'Chennai', inuse: 9000, godown: 2500 }
  ];

  useEffect(() => {
    const width = 500;
    const height = 400;
    const margin = { top: 40, right: 30, bottom: 80, left: 50 };

    // Clear previous content
    d3.select(svgRef.current).selectAll('*').remove();

    // Create SVG
    const svg = d3.select(svgRef.current)
      .attr('width', width)
      .attr('height', height);

    // Add title
    svg.append('text')
      .attr('x', margin.left)
      .attr('y', margin.top - 10)
      .attr('class', 'text-lg font-bold')
      .text('MIVAN STOCK AVAILABILITY (sq m)');

    // Create scales
    const cities = data.map(d => d.city);
    
    const xScale = d3.scaleBand()
      .domain(cities)
      .range([margin.left, width - margin.right])
      .padding(0.5);

    const yScale = d3.scaleLinear()
      .domain([0, 40000])
      .range([height - margin.bottom, margin.top])
      .nice();

    // Create axes
    const xAxis = d3.axisBottom(xScale);
    const yAxis = d3.axisLeft(yScale)
      .ticks(5)
      .tickFormat(d => d.toString());

    // Add X axis
    svg.append('g')
      .attr('transform', `translate(0,${height - margin.bottom})`)
      .call(xAxis);

    // Add Y axis
    svg.append('g')
      .attr('transform', `translate(${margin.left},0)`)
      .call(yAxis);

    // Add gridlines
    svg.append('g')
      .attr('class', 'grid')
      .attr('transform', `translate(${margin.left},0)`)
      .call(d3.axisLeft(yScale)
        .tickSize(-width + margin.left + margin.right)
        .tickFormat('')
      )
      .style('stroke-dasharray', '3,3')
      .style('stroke-opacity', 0.2);

    // Create stacked bars
    data.forEach(d => {
      const x = xScale(d.city);
      const barWidth = xScale.bandwidth() * 0.8;
      const barOffset = xScale.bandwidth() * 0.1;

      // Godown (bottom)
      svg.append('rect')
        .attr('x', x! + barOffset) // Add null check with !
        .attr('y', yScale(d.godown))
        .attr('width', barWidth)
        .attr('height', height - margin.bottom - yScale(d.godown))
        .attr('fill', '#FFA500')
        .on('mouseover', (event) => {
          setTooltip({
            show: true,
            x: event.pageX,
            y: event.pageY,
            data: {
              inuse: d.inuse,
              godown: d.godown
            }
          });
        })
        .on('mouseout', () => setTooltip({ show: false, x: 0, y: 0, data: null }));

      // Inuse (top)
      svg.append('rect')
        .attr('x', x! + barOffset) // Add null check with !
        .attr('y', yScale(d.inuse + d.godown))
        .attr('width', barWidth)
        .attr('height', yScale(d.godown) - yScale(d.inuse + d.godown))
        .attr('fill', '#0066CC');
    });

    // Add legend at the bottom
    const legendData = [
      { label: 'Inuse', color: '#0066CC' },
      { label: 'Godown', color: '#FFA500' }
    ];

    const legendWidth = 200;
    const legendX = (width - legendWidth) / 2;
    const legendY = height - margin.bottom + 40;

    const legend = svg.append('g')
      .attr('transform', `translate(${legendX}, ${legendY})`);

    legendData.forEach((item, i) => {
      const legendRow = legend.append('g')
        .attr('transform', `translate(${i * 100}, 0)`);

      legendRow.append('rect')
        .attr('width', 12)
        .attr('height', 12)
        .attr('fill', item.color);

      legendRow.append('text')
        .attr('x', 20)
        .attr('y', 10)
        .text(item.label)
        .style('font-size', '12px');
    });

  }, []);

  return (
    <div className="relative">
      <h1>Barchart</h1>
      <svg ref={svgRef}></svg>
      {tooltip.show && tooltip.data && (
        <div 
          className="text-blue-600 font-semibold"
          style={{
            left: tooltip.x + 10,
            top: tooltip.y - 40,
            transform: 'translateX(-50%)'
          }}
        >
          <div>Inuse: {tooltip.data.inuse}</div>
          <div>Godown: {tooltip.data.godown}</div>
        </div>
      )}
    </div>
  );
};

export default MivanStockChart;