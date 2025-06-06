import React, { useEffect, useState, useRef } from "react";
import { ComposableMap, Geographies, Geography } from "react-simple-maps";
import * as d3 from "d3";
import { Tooltip } from "react-tooltip";
import "react-tooltip/dist/react-tooltip.css";

interface StateData {
  state: string;
  value: number;
}

interface DataPoint {
  name: string;
  [key: string]: number | string;
}

interface IndiaMapWithD3Props {
  title: string;
  titleStyle?: React.CSSProperties;
  stateData: StateData[];
  customColors: string[];
  width?: number; // Width as a prop
  height?: number; // Height as a prop
  selectData1?: DataPoint[];
  selectData2?: DataPoint[];
}

const IndiaMapWithD3: React.FC<IndiaMapWithD3Props> = ({
  title,
  titleStyle,
  stateData,
  customColors,
  width,
  height,
  selectData1,
  selectData2
}) => {
  const [colorScale, setColorScale] = useState<d3.ScaleOrdinal<string, string> | null>(null);
  const [geoData, setGeoData] = useState<any>(null);
  const [tooltipContent, setTooltipContent] = useState<string | null>(null);
  const [selectedKey1, setSelectedKey1] = useState<string>("");
  const [selectedKey2, setSelectedKey2] = useState<string>("");
  const [containerWidth, setContainerWidth] = useState<number>(width || 280);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch("/assets/india.json")
      .then((res) => res.json())
      .then((data) => setGeoData(data))
      .catch((err) => console.error("Failed to load GeoJSON:", err));
  }, []);

  useEffect(() => {
    if (stateData.length > 0 && customColors.length > 0) {
      const dynamicColors = customColors.slice(0, stateData.length);
      const scale = d3
        .scaleOrdinal<string>()
        .domain(stateData.map((d) => d.state))
        .range(dynamicColors);

      setColorScale(() => scale);
    }
  }, [stateData, customColors]);

  useEffect(() => {
    if (!containerRef.current) return;

    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const container = entry.target as HTMLDivElement;
        const newWidth = container.clientWidth;
        setContainerWidth(newWidth);
      }
    });

    resizeObserver.observe(containerRef.current);

    return () => {
      resizeObserver.disconnect();
    };
  }, []);

  return (
    <div ref={containerRef} style={{ position: "relative", padding: '10px', width, height }}>
      <div className="header-chart" style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <p className="heading" style={{ ...titleStyle }}>{title}</p>
        <div className="filter" style={{ display: "flex", justifyContent: "space-between" }}>
          {selectData1 && selectData1.length > 0 && (
            <select
              onChange={(e) => setSelectedKey1(e.target.value)}
              value={selectedKey1}
              className="h-[28px] w-[83px] px-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-gray-700 bg-white rounded-2px text-sm font-semibold"
              style={{ fontFamily: "Montserrat", fontSize: "13px", fontWeight: 500, marginRight: 10}}
            >
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
              {Object.keys(selectData2[0]).map((key) => (
                <option key={key} value={key} className="text-gray-900">{key}</option>
              ))}
            </select>
          )}
        </div>
      </div>

      {geoData ? (
        <>
          <ComposableMap
            width={containerWidth}
            height={height || 300}
            projection="geoMercator"
            projectionConfig={{ center: [80, 22], scale: containerWidth }}
          >
            <Geographies geography={geoData}>
              {({ geographies }) =>
                geographies.map((geo) => {
                  const stateName = geo.properties.st_nm.toUpperCase().trim();
                  const stateDataEntry = stateData.find((d) => d.state === stateName);

                  const fillColor =
                    stateDataEntry && colorScale ? colorScale(stateDataEntry.state) : "#E5E7EB";

                  return (
                    <Geography
                      key={geo.rsmKey}
                      geography={geo}
                      fill={fillColor}
                      stroke="#FFFFFF"
                      onMouseEnter={() => setTooltipContent(stateName)}
                      onMouseLeave={() => setTooltipContent(null)}
                      data-tooltip-id="state-tooltip"
                      data-tooltip-content={stateName}
                      style={{
                        default: { outline: "none" },
                        hover: { fill: "#999", outline: "none" },
                        pressed: { outline: "none" }
                      }}
                    />
                  );
                })
              }
            </Geographies>
          </ComposableMap>
          <Tooltip id="state-tooltip" />
        </>
      ) : (
        <p>Loading map...</p>
      )}
    </div>
  );
};

export default IndiaMapWithD3;
