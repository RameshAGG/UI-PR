import React, { useEffect, useRef, useState, useCallback } from "react";
import * as d3 from "d3";

interface DataPoint {
    name: string;
    [key: string]: number | string; // Allows dynamic keys
}

interface Props {
    title?: string;
    titleStyle?: React.CSSProperties;
    selectData1?: DataPoint[];
    selectData2?: DataPoint[];
    data: DataPoint[];
    colors?: Record<string, string>;
    height?: string | number; // Add height prop
    onStateChange?: (stateId: string) => void;  // Add this prop
    onSiteChange?: (siteId: number) => void;  // Add this prop
}

const StackedBarChart: React.FC<Props> = ({
    title,
    titleStyle,
    data,
    colors = {},
    selectData1,
    selectData2,
    height = '400px',
    onStateChange,
    onSiteChange
}) => {
    const svgRef = useRef<SVGSVGElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
    const [selectedKey1, setSelectedKey1] = useState<string>("");
    const [selectedKey2, setSelectedKey2] = useState<string>("");

    // Update dimensions when container size changes
    useEffect(() => {
        if (!containerRef.current) return;

        const resizeObserver = new ResizeObserver((entries) => {
            const container = entries[0];
            const width = container.contentRect.width;
            const height = container.contentRect.height || width * 0.6;

            setDimensions({
                width: Math.max(width - 60, 0),  // Subtract padding, ensure non-negative
                height: Math.max(height - 80, 0) // Subtract margins, ensure non-negative
            });
        });

        resizeObserver.observe(containerRef.current);
        return () => resizeObserver.disconnect();
    }, []);

    // Update chart when dimensions or data change
    useEffect(() => {
        if (!svgRef.current ||
            dimensions.width === 0 ||
            dimensions.height === 0 ||
            !data ||
            data.length === 0 ||
            !data[0]) return;

        const keys = Object.keys(data[0]).filter(key => key !== "name");
        const barWidth = 22;
        const margin = { top: 10, right: 20, bottom: 100, left: 60 };
        const widthWithMargin = dimensions.width + margin.left + margin.right;
        const heightWithMargin = dimensions.height + margin.top + margin.bottom;

        d3.select(svgRef.current).selectAll("*").remove(); // Clear previous chart

        const svg = d3.select(svgRef.current)
            .attr("width", widthWithMargin)
            .attr("height", heightWithMargin + (heightWithMargin / 100 * 5))
            .append("g")
            .attr("transform", `translate(${margin.left}, ${margin.top})`)


        const x = d3.scaleBand()
            .domain(data.map(d => d.name))
            .range([0, dimensions.width])
            .padding(0.3);

        const maxValue = d3.max(data, d => keys.reduce((sum, key) => sum + (d[key] as number), 0)) || 0;
        const y = d3.scaleLinear()
            .domain([0, maxValue * 1.1])
            .nice()
            .range([dimensions.height, 0]);

        const colorScale = d3.scaleOrdinal()
            .domain(keys)
            .range(keys.map((key, i) => colors[key] || d3.schemeCategory10[i % 10]));

        const stack = d3.stack<DataPoint>()
            .keys(keys)
            .order(d3.stackOrderNone)
            .offset(d3.stackOffsetNone);

        const stackedData = stack(data);

        svg.append("g")
            .attr("transform", `translate(0, ${dimensions.height})`)
            .call(d3.axisBottom(x).tickSize(0))
            .selectAll(".tick text")
            .attr('y', 20)
            // .attr('transform', 'rotate(-45)')
            // .style('text-anchor', 'end')
            .each(function () {
                const text = d3.select(this);
                const words = text.text().split(' ');
                text.text('');

                for (let i = 0; i < words.length; i += 2) {
                    const tspan = text.append('tspan')
                        .attr('x', 0)
                        .attr('dy', i === 0 ? 0 : '1.2em')
                        .text(words.slice(i, i + 2).join(' '));
                }
            });


        const yAxisGroup = svg.append("g")
            .call(d3.axisLeft(y).ticks(5).tickFormat(d3.format(",")).tickSize(-dimensions.width));

        yAxisGroup.selectAll(".tick text")
            .attr("x", -10);

        yAxisGroup.selectAll(".tick line")
            .attr("stroke", "#ccc")
            .attr("stroke-dasharray", "5,5")
            .attr("stroke-width", 1);

        svg.selectAll(".domain").remove();

        const tooltipDiv = d3.select("body").append("div")
            .style("position", "absolute")
            .style("background", "black")
            .style("color", "white")
            .style("padding", "8px")
            .style("border-radius", "5px")
            .style("font-size", "12px")
            .style("white-space", "nowrap")
            .style("pointer-events", "none")
            .style("z-index", "9999")
            .style("opacity", 0);

        svg.selectAll(".bar-group")
            .data(stackedData)
            .enter().append("g")
            .attr("fill", d => colorScale(d.key) as string)
            .selectAll("rect")
            .data(d => d)
            .enter().append("rect")
            .attr("x", d => x(d.data.name)! + (x.bandwidth() - barWidth) / 2)
            .attr("y", d => y(d[1]))
            .attr("height", d => y(d[0]) - y(d[1]))
            .attr("width", barWidth)
            .on("mouseover", (event, d) => {
                tooltipDiv
                    .style("opacity", 1)
                    .html(keys.map(key => {
                        const value = parseFloat(d.data[key]);
                        return `${key}: ${value % 1 === 0 ? value : value.toFixed(2)}`;
                    }).join("<br>"))
                    // .html(keys.map(key => `${key}: ${d.data[key]}`).join("<br>"))
                    .style("left", `${event.pageX + 10}px`)
                    .style("top", `${event.pageY - 20}px`);
            })
            .on("mousemove", (event) => {
                tooltipDiv
                    .style("left", `${event.pageX + 10}px`)
                    .style("top", `${event.pageY - 20}px`);
            })
            .on("mouseout", () => tooltipDiv.style("opacity", 0));

        // const legendGroup = svg.append("g")
        //     .attr("transform", `translate(${dimensions.width / 2}, ${dimensions.height + 70})`);

        // const legend = legendGroup.selectAll(".legend")
        //     .data(keys)
        //     .enter().append("g")
        //     .attr("class", "legend")
        //     .attr("transform", (d, i) => `translate(${(i - keys.length / 2) * 100}, 0)`);

        // legend.append("rect")
        //     .attr("width", 15)
        //     .attr("height", 15)
        //     .attr("fill", d => colorScale(d) as string);

        // legend.append("text")
        //     .attr("x", 20)
        //     .attr("y", 12)
        //     .attr("font-size", "12px")
        //     .style("text-anchor", "start")
        //     .text(d => d);

        const legendGroup = svg.append("g")
            .attr("transform", `translate(${dimensions.width / 2}, ${dimensions.height + 70})`);

        const legend = legendGroup.selectAll(".legend")
            .data(keys)
            .enter().append("g")
            .attr("class", "legend")
            .attr("transform", (d, i) => `translate(${(i - keys.length / 2) * 110}, 0)`); // Adjusted for margin

        legend.append("rect")
            .attr("width", 15)
            .attr("height", 15)
            .attr("fill", d => colorScale(d) as string);

        legend.append("text")
            .attr("x", 20)
            .attr("y", 12)
            .attr("font-size", "12px")
            .style("text-anchor", "start")
            .text(d => d);
    }, [dimensions, data, colors]);

    // Add empty state handling in the render
    if (!data || data.length === 0) {
        return (
            <div
                style={{
                    position: "relative",
                    width: '100%',
                    padding: '10px',
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
                position: "relative",
                width: '100%',
                padding: '10px',
                marginTop: '10px'
            }}
        >
            <p className="heading" style={{ ...titleStyle }}>{title}</p>

            {/* <div className="header-chart" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: '10px' }}>
                <p className="heading" style={{ ...titleStyle }}>{title}</p>
                <div className="filter" style={{ display: "flex", justifyContent: "space-between" }}>
                    {selectData1 && selectData1.length > 0 && (
                        <select
                            onChange={(e) => {
                                setSelectedKey1(e.target.value);
                                if (onStateChange) {
                                    onStateChange(e.target.value);
                                }
                            }}
                            value={selectedKey1}
                            className="h-[28px] w-[83px] px-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-gray-700 bg-white rounded-2px text-sm font-semibold"
                            style={{ fontFamily: "Montserrat", fontSize: "13px", fontWeight: 500, marginRight: 10 }}
                        >
                            <option value="all">All</option>
                            {selectData1.map((value, index) => (
                                <option key={index} value={value.id} className="text-gray-900">{value.name}</option>
                            ))}
                        </select>
                    )}

                    {selectData2 && (
                        <select
                            onChange={(e) => {
                                setSelectedKey2(e.target.value);
                                if (onSiteChange) {
                                    onSiteChange(Number(e.target.value));
                                }
                            }}
                            value={selectedKey2}
                            disabled={!selectData2 || selectData2.length === 0}
                            className="h-[28px] w-[83px] px-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-gray-700 bg-white rounded-2px text-sm font-semibold"
                            style={{ fontFamily: "Montserrat", fontSize: "13px", fontWeight: 500 }}
                        >
                            <option value={-1}>All</option>
                            {selectData2?.map((value, index) => (
                                <option key={index} value={Number(value.id)} className="text-gray-900">{value.name}</option>
                            ))}
                        </select>
                    )}
                </div>
            </div> */}
            <div
                ref={containerRef}
                className="relative aspect-square"
                style={{
                    position: "relative",
                    width: '100%',
                    height: typeof height === 'number' ? `${height}px` : height,
                    marginBottom: '50px' // Added bottom margin
                }}
            >
                <svg ref={svgRef}></svg>
            </div>
            <div
                id="tooltip"
                style={{
                    position: "absolute",
                    background: "black",
                    color: "white",
                    padding: "5px",
                    borderRadius: "5px",
                    opacity: 0,
                    pointerEvents: "none",
                }}
            />
        </div>
    );
};

export default StackedBarChart;
