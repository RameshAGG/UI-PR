import React, { useEffect, useRef } from "react";
import * as d3 from "d3";

interface Data {
  name: string;
  value: number;
}

interface PieChartProps {
  title?: string;
  data: Data[]; // Data for the pie chart
  titleStyle?: React.CSSProperties;
  colors?: Record<string, string>; // Optional color mapping
  margin?: number;
  height?: number;
  countHeaderText?: boolean; // Add new prop with default value true
  percentageHeaderText?: boolean; // Add new prop with default value true
  countText?: boolean;
  percentageText?: boolean;
}

const PieChart: React.FC<PieChartProps> = ({ title, titleStyle, data, colors, margin, height = 400, countHeaderText = true, percentageHeaderText = true, countText = true, percentageText = true }) => {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Calculate total for percentages
  const total = data.reduce((sum, item) => sum + item.value, 0);

  // Format number with commas
  const formatNumber = (num: number) => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  // Calculate percentage
  const calculatePercentage = (value: number) => {
    return ((value / total) * 100).toFixed(0);
  };


  useEffect(() => {
    if (!data.length || !svgRef.current || !containerRef.current) return;

    // Create ResizeObserver to handle container size changes
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const container = entry.target as HTMLDivElement;
        const containerWidth = container.clientWidth;

        updateChart(containerWidth, height);
      }
    });

    // Start observing the container
    resizeObserver.observe(containerRef.current);

    // Function to update the chart
    const updateChart = (containerWidth: number, containerHeight: number) => {
      // Clear previous SVG content
      d3.select(svgRef.current).selectAll("*").remove();

      const radius = Math.min(containerWidth, containerHeight) / 2 - (margin || 0);

      // Define color scale
      const colorScale = d3
        .scaleOrdinal<string>()
        .domain(data.map((d) => d.name))
        .range(data.map((d) => colors?.[d.name] || "#ccc"));

      // Select and configure SVG
      const svg = d3.select(svgRef.current)
        .attr("width", containerWidth)
        .attr("height", containerHeight);

      // Create a group for the pie chart, centered in the top half
      const pieG = svg.append("g")
        .attr("transform", `translate(${containerWidth / 2}, ${containerHeight * 0.35})`);

      // Create pie chart layout
      const pie = d3.pie<Data>().value((d) => d.value).sort(null);
      const arc = d3.arc<d3.PieArcDatum<Data>>().innerRadius(0).outerRadius(radius * 0.8);

      // Tooltip setup
      const tooltipDiv = d3.select("body")
        .append("div")
        .style("position", "absolute")
        .style("background", "black")
        .style("color", "white")
        .style("padding", "8px")
        .style("border-radius", "5px")
        .style("font-size", "12px")
        .style("pointer-events", "none")
        .style("opacity", 0);

      // Bind data and create pie chart
      pieG.selectAll(".arc")
        .data(pie(data))
        .enter()
        .append("path")
        .attr("d", arc as any)
        .attr("fill", (d) => colorScale(d.data.name) as string)
        .attr("stroke", "white")
        .style("stroke-width", "2px")
        .on("mouseover", (event, d) => {
          tooltipDiv
            .style("opacity", 1)
            .html(`${d.data.name}: ${d.data.value}`)
            .style("left", `${event.pageX + 10}px`)
            .style("top", `${event.pageY - 20}px`);
        })
        .on("mousemove", (event) => {
          tooltipDiv.style("left", `${event.pageX + 10}px`).style("top", `${event.pageY - 20}px`);
        })
        .on("mouseout", () => tooltipDiv.style("opacity", 0));

      // Add legend
      const legendG = svg.append("g")
        .attr("transform", `translate(20, ${containerHeight * 0.7})`);

      // Add legend items
      const leftLegendItems = legendG.selectAll(".legend-item")
        .data(data)
        .enter()
        .append("g")
        .attr("class", "legend-item")
        .attr("transform", (d, i) => `translate(0, ${i * 25 + 20})`);

      // Add color boxes
      leftLegendItems.append("rect")
        .attr("width", 15)
        .attr("height", 15)
        .attr("fill", d => colorScale(d.name) as string);

      // Add location names
      leftLegendItems.append("text")
        .attr("x", 30)
        .attr("y", 12)
        .text(d => d.name)
        .style("font-size", "14px");

      // Add right side legend (counts and percentages)
      const rightLegendG = svg.append("g")
        .attr("transform", `translate(${containerWidth}, ${containerHeight * 0.7})`);

      // Add header for count and percentage
      const rightHeaderG = rightLegendG.append("g");

      // Only add Count text if countHeaderText is true
      if (countText) {
        if (countHeaderText) {
          rightHeaderG.append("text")
            .attr("x", -80)
            .attr("y", 0)
            .text("Count")
            .style("font-size", "14px")
            .style("text-anchor", "end");
        }
      }

      if (percentageText) {
        if (percentageHeaderText) {
          rightHeaderG.append("text")
            .attr("x", -20)
            .attr("y", 0)
            .text("%")
            .style("font-size", "14px")
            .style("text-anchor", "end");
        }
      }

      // Add count and percentage items
      const rightLegendItems = rightLegendG.selectAll(".legend-item")
        .data(data)
        .enter()
        .append("g")
        .attr("class", "legend-item")
        .attr("transform", (d, i) => `translate(0, ${i * 25 + 20})`);

      // Add counts
      if (countText) {
        rightLegendItems.append("text")
          .attr("x", -80)
          .attr("y", 12)
          .text(d => formatNumber(d.value))
          .style("font-size", "14px")
          .style("text-anchor", "end");
      }


      // Add percentages
      if (percentageText) {
        rightLegendItems.append("text")
          .attr("x", -20)
          .attr("y", 12)
          .text(d => `${calculatePercentage(d.value)}%`)
          .style("font-size", "14px")
          .style("text-anchor", "end");
      }

      // Clean up tooltip on unmount
      return () => {
        resizeObserver.disconnect();
        tooltipDiv.remove();
      };
    };
  }, [data, colors, height, countHeaderText, percentageHeaderText, countText, percentageText]);

  return (
    <div className="w-full max-w-md mx-auto" style={{ padding: "10px" }}>
      <h2 className="heading" style={{ marginBottom: '10px' ,...titleStyle }}>{title}</h2>
      <div ref={containerRef} className="relative" style={{ height: `${height}px` }}>
        <svg ref={svgRef} className="w-full h-full" />
      </div>
    </div>
  );
};

export default PieChart;
