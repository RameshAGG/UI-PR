import React, { useEffect, useRef, useState, useLayoutEffect } from "react";
import * as d3 from "d3";

interface DataPoint {
    vendorName: string;
    allocatedQuantity: number | string;
    returnedStock: number | string;
}

interface Props {
    title?: string;
    titleStyle?: React.CSSProperties;
    data: DataPoint[];
    colors?: Record<string, string>;
    height?: string | number;
    barWidth?: number; 
    barSpacing?: number; // New prop for controlling spacing between bars
}

const GroupedBarChart: React.FC<Props> = ({
    title,
    titleStyle,
    data,
    colors = { allocatedQuantity: "#1f77b4", returnedStock: "#ff7f0e" },
    height = "400px",
    barWidth = 15,
    barSpacing = 2 // Default small spacing between bars in the same group
}) => {
    const svgRef = useRef<SVGSVGElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const tooltipRef = useRef<HTMLDivElement | null>(null);
    const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
    const [isInitialized, setIsInitialized] = useState(false);

    // Process data once
    const processedData = React.useMemo(() => {
        return data.map(item => ({
            vendorName: item.vendorName,
            allocatedQuantity: typeof item.allocatedQuantity === 'string' 
                ? parseFloat(item.allocatedQuantity) || 0 
                : item.allocatedQuantity || 0,
            returnedStock: typeof item.returnedStock === 'string' 
                ? parseFloat(item.returnedStock) || 0 
                : item.returnedStock || 0
        }));
    }, [data]);

    // Initialize dimensions only once after mount
    useLayoutEffect(() => {
        if (!containerRef.current || isInitialized) return;
        
        const container = containerRef.current;
        const containerWidth = container.clientWidth;
        const containerHeight = container.clientHeight;
        
        setDimensions({
            width: Math.max(containerWidth - 60, 0),
            height: Math.max(containerHeight - 80, 0)
        });
        
        setIsInitialized(true);
        
        // Create tooltip only once
        if (!tooltipRef.current) {
            tooltipRef.current = d3.select("body").append("div")
                .attr("class", "chart-tooltip")
                .style("position", "absolute")
                .style("background", "black")
                .style("color", "white")
                .style("padding", "8px")
                .style("border-radius", "5px")
                .style("font-size", "12px")
                .style("white-space", "nowrap")
                .style("pointer-events", "none")
                .style("z-index", "9999")
                .style("opacity", 0)
                .node();
        }
    }, [isInitialized]);

    // Handle resize
    useEffect(() => {
        if (!containerRef.current || !isInitialized) return;

        const handleResize = () => {
            const container = containerRef.current;
            if (!container) return;
            
            const containerWidth = container.clientWidth;
            const containerHeight = container.clientHeight;
            
            setDimensions({
                width: Math.max(containerWidth - 60, 0),
                height: Math.max(containerHeight - 80, 0)
            });
        };

        const resizeObserver = new ResizeObserver(handleResize);
        resizeObserver.observe(containerRef.current);

        return () => {
            resizeObserver.disconnect();
            if (tooltipRef.current) {
                d3.select(tooltipRef.current).remove();
                tooltipRef.current = null;
            }
        };
    }, [isInitialized]);

    // Render chart only when both dimensions and data are ready
    useEffect(() => {
        if (
            !svgRef.current || 
            !dimensions.width || 
            !dimensions.height || 
            !processedData.length ||
            !isInitialized
        ) return;

        const margin = { top: 20, right: 30, bottom: 100, left: 60 };
        const width = dimensions.width;
        const height = dimensions.height;
        
        const svg = d3.select(svgRef.current);
        svg.selectAll("*").remove();
        
        svg.attr("width", width + margin.left + margin.right)
           .attr("height", height + margin.top + margin.bottom);
        
        const g = svg.append("g")
                    .attr("transform", `translate(${margin.left},${margin.top})`);

        const categories = ["allocatedQuantity", "returnedStock"];
        const categoryLabels = {
            "allocatedQuantity": "Allocated Quantity",
            "returnedStock": "Returned Stock"
        };

        // Create x scale with increased padding for narrower groups
        const x0 = d3.scaleBand()
            .domain(processedData.map(d => d.vendorName))
            .range([0, width])
            .padding(0.4); // Increased padding between vendor groups

        // Calculate the space available for each bar group
        const groupWidth = x0.bandwidth();
        
        // Calculate the width of each bar in the group
        const actualBarWidth = Math.min(barWidth, (groupWidth - barSpacing) / categories.length);
        
        // Calculate group center for positioning
        const groupCenter = groupWidth / 2;
        
        // Calculate total width of all bars + spacing
        const totalBarsWidth = (categories.length * actualBarWidth) + ((categories.length - 1) * barSpacing);

        // Add x-axis
        g.append("g")
            .attr("class", "x-axis")
            .attr("transform", `translate(0,${height})`)
            .call(d3.axisBottom(x0).tickSize(0))
            .selectAll(".tick text")
            .attr("y", 10)
            .style("text-anchor", "middle")
            .each(function() {
                const text = d3.select(this);
                const words = text.text().split(/\s+/);
                
                if (words.length <= 1) return;
                
                text.text('');
                
                for (let i = 0; i < words.length; i++) {
                    text.append('tspan')
                        .attr('x', 0)
                        .attr('dy', i === 0 ? 0 : '1em')
                        .text(words[i]);
                }
            });

        // Find max value for y scale
        const maxValue = d3.max(processedData, d => {
            return Math.max(d.allocatedQuantity, d.returnedStock);
        }) || 0;

        // Create y scale
        const y = d3.scaleLinear()
            .domain([0, maxValue * 1.1 || 10]) // Ensure non-zero domain
            .nice()
            .range([height, 0]);

        // Add y-axis with grid lines
        const yAxis = g.append("g")
            .attr("class", "y-axis")
            .call(d3.axisLeft(y).ticks(5).tickFormat(d3.format(",")).tickSize(-width));
            
        yAxis.selectAll("line")
            .attr("stroke", "#ccc")
            .attr("stroke-dasharray", "5,5")
            .attr("stroke-width", 1);
            
        yAxis.selectAll("text")
            .attr("x", -10);
            
        g.selectAll(".domain").remove();

        // Create tooltip reference
        const tooltip = d3.select(tooltipRef.current);

        // Add bars with manual positioning for precise control and closer spacing
        g.selectAll(".bar-group")
            .data(processedData)
            .enter()
            .append("g")
            .attr("class", "bar-group")
            .attr("transform", d => `translate(${x0(d.vendorName) || 0},0)`)
            .each(function(d) {
                const group = d3.select(this);
                
                // Calculate starting position to center all bars
                const startX = groupCenter - (totalBarsWidth / 2);
                
                categories.forEach((key, i) => {
                    const value = d[key as keyof DataPoint] as number;
                    // Position each bar with minimal spacing between them
                    const barX = startX + (i * (actualBarWidth + barSpacing));
                    const barY = y(value);
                    const barHeight = height - barY;
                    
                    group.append("rect")
                        .attr("class", `bar ${key}`)
                        .attr("x", barX)
                        .attr("y", barY)
                        .attr("width", actualBarWidth)
                        .attr("height", barHeight)
                        .attr("fill", colors[key] || "#888")
                        .on("mouseover", function(event) {
                            tooltip
                                .style("opacity", 1)
                                .html(`<strong>${d.vendorName}</strong><br>${categoryLabels[key as keyof typeof categoryLabels]}: ${value}`)
                                .style("left", `${event.pageX + 10}px`)
                                .style("top", `${event.pageY - 20}px`);
                        })
                        .on("mousemove", function(event) {
                            tooltip
                                .style("left", `${event.pageX + 10}px`)
                                .style("top", `${event.pageY - 20}px`);
                        })
                        .on("mouseout", function() {
                            tooltip.style("opacity", 0);
                        });
                });
            });

        // Add legend with fixed positioning
        const legendGroup = g.append("g")
            .attr("class", "legend")
            .attr("transform", `translate(${width / 2 - 100}, ${height + 50})`);

        categories.forEach((category, i) => {
            const legendItem = legendGroup.append("g")
                .attr("transform", `translate(${i * 150}, 0)`);
                
            legendItem.append("rect")
                .attr("width", 15)
                .attr("height", 15)
                .attr("fill", colors[category] || "#888");
                
            legendItem.append("text")
                .attr("x", 20)
                .attr("y", 12)
                .attr("font-size", "12px")
                .text(categoryLabels[category as keyof typeof categoryLabels]);
        });

    }, [dimensions.width, dimensions.height, processedData, colors, isInitialized, barWidth, barSpacing]);

    // Handle empty data case
    if (!data.length) {
        return (
            <div
                style={{
                    width: '100%',
                    height: typeof height === 'number' ? `${height}px` : height,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}
            >
                <p style={{ color: '#666', fontSize: '14px' }}>No data available</p>
            </div>
        );
    }

    return (
        <div
            style={{
                width: '100%',
                padding: '10px',
                marginTop: '10px'
            }}
        >
            {title && <p className="heading" style={{ ...titleStyle }}>{title}</p>}
            <div
                ref={containerRef}
                style={{
                    width: '100%',
                    height: typeof height === 'number' ? `${height}px` : height,
                    position: 'relative'
                }}
            >
                <svg 
                    ref={svgRef}
                    style={{
                        position: 'absolute',
                        top: 0,
                        left: 0
                    }}
                ></svg>
            </div>
        </div>
    );
};

export default GroupedBarChart;