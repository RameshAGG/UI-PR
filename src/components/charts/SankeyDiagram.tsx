import React, { useEffect, useState } from "react";
import { Layer, Rectangle, Text } from "recharts";

interface NodeData {
  name: string;
}

interface LinkData {
  source: number;
  target: number;
  value: string | number;
}

interface InputData {
  nodes: NodeData[];
  links: LinkData[];
}

interface ProcessedNode {
  id: number;
  name: string;
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  color?: string;
}

interface ProcessedFlow {
  source: number;
  target: number;
  value: number;
  color?: string;
  gradientId?: string;
  sourceX?: number;
  sourceY?: number;
  targetX?: number;
  targetY?: number;
  height?: number;
}

interface Props {
  title?: string;
  titleStyle?: React.CSSProperties;
  selectData1?: any;
  selectData2?: any;
  data: InputData;
  height?: string | number;
  onStateChange?: (stateId: string) => void;
  onSiteChange?: (siteId: number) => void;
}

const DataDrivenSankey: React.FC<Props> = ({
  title,
  titleStyle,
  data,
  height = '400',
  selectData1 = [],
  selectData2 = [],
  onStateChange,
  onSiteChange
}) => {
  const [selectedKey1, setSelectedKey1] = useState<string>("");
  const [selectedKey2, setSelectedKey2] = useState<string>("");
  const [processedData, setProcessedData] = useState<{
    nodes: ProcessedNode[];
    flows: ProcessedFlow[];
  }>({ nodes: [], flows: [] });

  useEffect(() => {
    if (data && Array.isArray(data.nodes) && Array.isArray(data.links)) {
      processData(data);
    }
  }, [data]);


  const renderGradients = () => {
    return <defs>
      {processedData.flows.map((flow) => {
        const gradientId = `gradient-${flow.source}-${flow.target}`;
        return (
          <linearGradient key={gradientId} id={gradientId} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={processedData.nodes[flow.source].color} />
            <stop offset="100%" stopColor={processedData.nodes[flow.target].color} />
          </linearGradient>
        );
      })}
    </defs>
  }

  const processData = (inputData: InputData) => {
    if (!inputData || !inputData.nodes || !inputData.links) return;
    const rawNodes = inputData.nodes;
    const rawLinks = inputData.links;
    const numNodes = rawNodes.length;
    const nodeWidth = 10;
    const nodeSpacing = 60;
    const startX = 100;
    const layerSpacing = 300;

    const numericHeight = typeof height === "string" ? parseInt(height) : height;

    const nodeColors = Array.from({ length: numNodes }, (_, i) => {
      const hue = (i * 137.5) % 360;
      return `hsl(${hue}, 70%, 60%)`;
    });

    const processedNodes: ProcessedNode[] = rawNodes.map((node, index) => ({
      id: index,
      name: node.name,
      color: nodeColors[index],
    }));

    const outgoingCount: Record<number, number> = {};
    rawLinks.forEach((link) => {
      outgoingCount[link.source] = (outgoingCount[link.source] || 0) + 1;
    });

    // Set default height for all nodes
    processedNodes.forEach((node) => {
      const isParent = outgoingCount[node.id] > 0;
      const height = isParent ? 100 : 50;
      node.height = height;
    });

    const parentFlowOffsets: Record<number, number> = {};
    Object.keys(outgoingCount).forEach(sourceIdStr => {
      const sourceId = +sourceIdStr;
      parentFlowOffsets[sourceId] = processedNodes[sourceId].y || 0;
    });

    // Adjust child node heights
    rawLinks.forEach((link) => {
      const parentHeight = processedNodes[link.source].height || 50;
      const childrenCount = outgoingCount[link.source] || 1;
      const childHeight = parentHeight / childrenCount;

      if (!processedNodes[link.target].height || processedNodes[link.target].height! > childHeight) {
        processedNodes[link.target].height = childHeight;
      }
    });

    const nodeLevels: number[] = Array(numNodes).fill(-1);
    nodeLevels[0] = 0;
    let changed = true;

    while (changed) {
      changed = false;
      rawLinks.forEach((link) => {
        if (nodeLevels[link.source] !== -1 && nodeLevels[link.target] === -1) {
          nodeLevels[link.target] = nodeLevels[link.source] + 1;
          changed = true;
        }
      });
    }

    const nodesByLevel: Record<number, ProcessedNode[]> = {};
    processedNodes.forEach((node, index) => {
      const level = nodeLevels[index] === -1 ? numNodes : nodeLevels[index];
      if (!nodesByLevel[level]) nodesByLevel[level] = [];
      nodesByLevel[level].push(node);
    });

    const currentYByLevel: Record<number, number> = {};
    Object.keys(nodesByLevel).sort((a, b) => +a - +b).forEach((levelStr) => {
      const level = +levelStr;
      const nodes = nodesByLevel[level];
      const totalHeight = nodes.reduce((sum, node) => sum + (node.height || 0), 0) + (nodes.length - 1) * nodeSpacing;
      const startY = (numericHeight - totalHeight) / 2;
      currentYByLevel[level] = startY < 0 ? 10 : startY;

      nodes.forEach((node) => {
        node.x = startX + level * layerSpacing;
        node.y = currentYByLevel[level];
        node.width = nodeWidth;
        currentYByLevel[level] += (node.height || 0) + nodeSpacing;
      });
    });

    const processedFlows: ProcessedFlow[] = rawLinks.map((link) => {
      const sourceNode = processedNodes[link.source];
      const targetNode = processedNodes[link.target];
      const value = +link.value;

      const parentHeight = sourceNode.height || 50;
      const childCount = outgoingCount[link.source] || 1;
      const flowHeight = parentHeight / childCount;

      const sourceY = (parentFlowOffsets[link.source] || sourceNode.y!) + flowHeight / 2;
      const targetY = targetNode.y! + (targetNode.height! / 2);

      parentFlowOffsets[link.source] = (parentFlowOffsets[link.source] || sourceNode.y!) + flowHeight;

      return {
        source: link.source,
        target: link.target,
        value,
        color: sourceNode?.color,
        gradientId: `gradient-${link.source}-${link.target}`,
        sourceX: sourceNode.x! + (sourceNode.width! / 2),
        sourceY: sourceY,
        targetX: targetNode.x! + (targetNode.width! / 2),
        targetY: targetY,
        height: flowHeight
      };
    });

    setProcessedData({ nodes: processedNodes, flows: processedFlows });
  };

  const renderNode = (node: ProcessedNode) => (
    <Layer key={`node-${node.id}`}>
      <Rectangle
        x={node.x}
        y={node.y}
        width={node.width}
        height={node.height}
        fill={node.color || "gray"}
      />
      <Text
        x={node.x! + node.width! + 8}
        y={node.y! + node.height! / 2}
        textAnchor="start"
        verticalAnchor="middle"
        fontSize={12}
      >
        {node.name}
      </Text>
    </Layer>
  );

  const renderFlow = (flow: ProcessedFlow) => {
    const path = `M ${flow.sourceX},${flow.sourceY} C ${flow.sourceX! + 50},${flow.sourceY} ${flow.targetX! - 50},${flow.targetY} ${flow.targetX},${flow.targetY}`;
    return (
      <Layer key={`flow-${flow.source}-${flow.target}`}>
        <path
          d={path}
          stroke={`url(#${flow.gradientId})`}
          // stroke={flow.color || "gray"}
          strokeWidth={flow.height}
          fill="none"
          opacity={0.6}
        />
      </Layer>
    );
  };

  return (
    <div className="w-full overflow-x-auto">
      <div className="min-w-full p-2">
        <div className="header-chart" style={{ display: "flex", justifyContent: "space-between", marginBottom: '10px' }}>
          <p className="heading" style={titleStyle}>{title}</p>
          <div className="filter" style={{ display: "flex", gap: "10px" }}>
            {selectData1?.length > 0 && (
              <select
                onChange={(e) => {
                  setSelectedKey1(e.target.value);
                  onStateChange?.(e.target.value);
                }}
                value={selectedKey1}
                className="border px-2 py-1 text-sm rounded"
              >
                <option value="all">All</option>
                {selectData1.map((val: any, idx: number) => (
                  <option key={idx} value={val.id}>{val.name}</option>
                ))}
              </select>
            )}
            {selectData2?.length > 0 && (
              <select
                onChange={(e) => {
                  setSelectedKey2(e.target.value);
                  onSiteChange?.(Number(e.target.value));
                }}
                value={selectedKey2 || 1}
                className="border px-2 py-1 text-sm rounded"
              >
                {selectData2.map((val: any, idx: number) => (
                  <option key={idx} value={val.id}>{val.name}</option>
                ))}
              </select>
            )}
          </div>
        </div>
        <svg className="w-full" height={height}>
          {processedData.flows.map(renderFlow)}
          {processedData.nodes.map(renderNode)}
          {renderGradients()}
        </svg>
      </div>
    </div>
  );
};

export default DataDrivenSankey;
