import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";


interface DataPoint {
    name: string;
    [key: string]: number | string; // Allows dynamic keys
}

interface HeatmapChartProps {
    title?: string;
    titleStyle?: React.CSSProperties;
    data: any[];
    height?: number;
    colors: string[];
    cellAndHeaderHeight?: number;
    selectData1?: DataPoint[];
    selectData2?: DataPoint[];
}

const HeatmapChart: React.FC<HeatmapChartProps> = ({ title, titleStyle, data, height = 300, colors, cellAndHeaderHeight = 44, selectData1, selectData2 }) => {
    const containerRef = useRef(null);
    const svgRef = useRef(null);
    const [dimensions, setDimensions] = useState({ width: 800, height: 200 });
    const [selectedKey1, setSelectedKey1] = useState<string>("");
    const [selectedKey2, setSelectedKey2] = useState<string>("");

    // Create tooltip using D3
    useEffect(() => {
        d3.select("#heatmap-tooltip").remove();
        d3.select("body")
            .append("div")
            .attr("id", "heatmap-tooltip")
            .style("position", "absolute")
            .style("background", "black")
            .style("color", "white")
            .style("padding", "8px")
            .style("border-radius", "5px")
            .style("font-size", "12px")
            .style("pointer-events", "none")
            .style("opacity", 0);
    }, []);

    const colorScale = d3.scaleQuantile()
        .domain([d3.min(data?.flatMap(d => d.values?.map(v => v.value))) || 0,
        d3.max(data?.flatMap(d => d.values?.map(v => v.value))) || 1])
        .range(colors);

    useEffect(() => {
        if (!containerRef.current) return;
        const resizeObserver = new ResizeObserver(entries => {
            const { width } = entries[0].contentRect;
            setDimensions({
                width: width,
                height: height
            });
        });
        resizeObserver.observe(containerRef.current);
        return () => resizeObserver.disconnect();
    }, [height]);

    useEffect(() => {
        if (!svgRef.current) return;
        const { width } = dimensions;

        d3.select(svgRef.current).selectAll("*").remove();

        const svg = d3.select(svgRef.current)
            .attr("width", width)
            .attr("height", height)
            .attr("viewBox", `0 0 ${width} ${height}`)
            .attr("preserveAspectRatio", "none");

        const mainGroup = svg.append("g");

        // Calculate cell width to fill entire width
        const numColumns = data?.[0]?.values?.length ? data[0].values.length + 2 : 2;
        const cellWidth = width / numColumns;
        const cellHeight = cellAndHeaderHeight;

        const tooltipDiv = d3.select("#heatmap-tooltip");

        // Draw headers
        const headerHeight = cellAndHeaderHeight;
        const headers = ["Material Name", "Total Units", ...(data?.[0]?.values?.map(v => v.name) || [])];
        mainGroup.selectAll("text.header")
            .data(headers)
            .enter()
            .append("text")
            .attr("class", "header")
            .attr("x", (_, i) => {
                if (i < 2) {
                    return i * cellWidth + 10;
                } else {
                    return i * cellWidth + cellWidth / 2;
                }
            })
            .attr("y", headerHeight / 2)
            .attr("text-anchor", (_, i) => i < 2 ? "start" : "middle")
            .attr("dominant-baseline", "middle")
            .text(d => d)
            .style("font-size", "12px")
            .style("fill", "#6D6D6D");

        // Adjust starting Y position for cells to account for header height
        data?.forEach((row, rowIndex) => {
            mainGroup.append("text")
                .attr("x", 10)
                .attr("y", headerHeight + rowIndex * cellHeight + cellHeight / 2)
                .text(row.name)
                .style("fill", "black");


            mainGroup.append("text")
                .attr("x", cellWidth + 10)
                .attr("y", headerHeight + rowIndex * cellHeight + cellHeight / 2)
                .text(row.total.toFixed(2))
                .style("fill", "black");

            row.values.forEach((site, colIndex) => {
                const rectX = (colIndex + 2) * cellWidth;
                const rectY = headerHeight + rowIndex * cellHeight;  // Adjust Y position

                mainGroup.append("rect")
                    .attr("x", rectX)
                    .attr("y", rectY)
                    .attr("width", cellWidth)
                    .attr("height", cellHeight)
                    .attr("fill", colorScale(site.value))
                    .on("mouseover", (event, d) => {
                        tooltipDiv
                            .style("opacity", 1)
                            .html(`Value: ${site.value.toFixed(2)}`)
                            .style("left", `${event.pageX + 10}px`)
                            .style("top", `${event.pageY - 20}px`);
                    })
                    .on("mousemove", (event) => {
                        tooltipDiv
                            .style("left", `${event.pageX + 10}px`)
                            .style("top", `${event.pageY - 20}px`);
                    })
                    .on("mouseout", () => tooltipDiv.style("opacity", 0));

                mainGroup.append("text")
                    .attr("x", rectX + cellWidth / 2)
                    .attr("y", rectY + cellHeight / 2)
                    .attr("text-anchor", "middle")
                    .text(site.value.toFixed(2))
                    .style("fill", "black")
                    .style("font-size", "12px");
            });
        });

        // Add horizontal lines between rows
        data?.forEach((_, rowIndex) => {
            mainGroup.append("line")
                .attr("x1", 0)
                .attr("x2", width)
                .attr("y1", headerHeight + rowIndex * cellHeight)
                .attr("y2", headerHeight + rowIndex * cellHeight)
                .attr("stroke", "#E0E0E0")
                .attr("stroke-width", "1.3");
        });

        // Add final line at the bottom
        mainGroup.append("line")
            .attr("x1", 0)
            .attr("x2", width)
            .attr("y1", headerHeight + data?.length * cellHeight)
            .attr("y2", headerHeight + data?.length * cellHeight)
            .attr("stroke", "#E0E0E0")
            .attr("stroke-width", "1.3");
    }, [dimensions, data, colors]);

    return (
        <div>
            <div className="header-chart" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: '16px' }}>
                <p className="heading" style={{ ...titleStyle }}>{title}</p>
                <div className="filter" style={{ display: "flex", justifyContent: "space-between" }}>
                    {selectData1 && selectData1.length > 0 && (
                        <select
                            onChange={(e) => setSelectedKey1(e.target.value)}
                            value={selectedKey1}
                            className="h-[28px] w-[83px] px-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-gray-700 bg-white rounded-2px text-sm font-semibold"
                            style={{ fontFamily: "Montserrat", fontSize: "13px", fontWeight: 500, marginRight: 10 }}
                        >
                            <option value="" className="text-gray-500">Select Key 1</option>
                            {Object.keys(selectData1[0]).map((key) => (
                                <option key={key} value={key} className="text-gray-900">{key}</option>
                            ))}
                        </select>
                    )}

                    {selectData2 && selectData2.length > 0 && (
                        <select
                            onChange={(e) => setSelectedKey2(e.target.value)}
                            value={selectedKey2}
                            className="h-[28px] w-[83px] px-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-gray-700 bg-white rounded-2px text-sm font-semibold"
                            style={{ fontFamily: "Montserrat", fontSize: "13px", fontWeight: 500 }}
                        >
                            <option value="" className="text-gray-500">Select Key 2</option>
                            {Object.keys(selectData2[0]).map((key) => (
                                <option key={key} value={key} className="text-gray-900">{key}</option>
                            ))}
                        </select>
                    )}
                </div>
            </div>
            <div ref={containerRef} style={{ width: "100%", height: height, position: "relative" }}>
                <svg ref={svgRef} style={{ width: "100%" }} />
            </div>
        </div>
    );
};

export default HeatmapChart;
