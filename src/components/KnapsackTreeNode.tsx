
import React from 'react';

export type KnapsackNode = {
  id: string;
  level: number;
  weight: number;
  value: number;
  bound: number;
  included: boolean[];
  pruned: boolean;
  optimal: boolean;
};

export default function KnapsackTreeNode({
  node,
  x,
  y,
  r = 28,
  edgeLabel,
  isLCBB = false
}: {
  node: KnapsackNode;
  x: number;
  y: number;
  r?: number;
  edgeLabel?: string;
  isLCBB?: boolean;
}) {
  // Yellow nodes with dark borders like in the reference image
  const fillColor = node.pruned ? '#ffcccc' : node.optimal ? '#ffffcc' : '#ffcc66';
  const textColor = '#333333'; // Dark text for better readability
  const strokeColor = node.pruned ? '#cc0000' : node.optimal ? '#008800' : '#333333';
  const strokeWidth = node.optimal ? 3 : node.pruned ? 2 : 1;
  
  // For LCBB, we display different labels
  const costEstimate = node.bound; // For LCBB this is already the negative value for display
  const upperBound = -node.value; // For LCBB, the upper bound is the negative of the value
  
  return (
    <g>
      {/* Node circle */}
      <circle
        cx={x}
        cy={y}
        r={r}
        fill={fillColor}
        stroke={strokeColor}
        strokeWidth={strokeWidth}
      />
      
      {/* Node ID/number */}
      <text
        x={x}
        y={y + 2}
        textAnchor="middle"
        fill={textColor}
        fontSize={r * 0.8}
        fontWeight="bold"
        dominantBaseline="middle"
      >
        {node.id}
      </text>
      
      {/* Upper bound and cost information for LCBB or regular bound info */}
      {isLCBB ? (
        <>
          <text
            x={x}
            y={y - r - 32}
            textAnchor="middle"
            fill="#333333"
            fontSize={18}
            fontWeight="medium"
            className="font-bold"
          >
            ĉ = {costEstimate.toFixed(0)} 
          </text>
          <text
            x={x}
            y={y - r - 8}
            textAnchor="middle"
            fill="#333333"
            fontSize={18}
            fontWeight="medium"
          >
            u = {upperBound.toFixed(0)}
          </text>
        </>
      ) : (
        <>
          <text
            x={x}
            y={y - r - 32}
            textAnchor="middle"
            fill="#333333"
            fontSize={18}
            fontWeight="medium"
          >
            U = {node.bound.toFixed(0)}
          </text>
          <text
            x={x}
            y={y - r - 8}
            textAnchor="middle"
            fill="#333333"
            fontSize={18}
            fontWeight="medium"
          >
            C = {node.value}
          </text>
        </>
      )}
      
      {/* Add X mark for pruned nodes */}
      {node.pruned && (
        <text
          x={x + r + 8}
          y={y}
          textAnchor="start"
          fill="#cc0000"
          fontSize={26}
          fontWeight="bold"
        >
          ✗
        </text>
      )}
      
      {/* Add underline for optimal node */}
      {node.optimal && (
        <line
          x1={x - r}
          y1={y + r + 5}
          x2={x + r}
          y2={y + r + 5}
          stroke="#008800"
          strokeWidth={3}
        />
      )}
      
      {/* Add edge label next to the edge line */}
      {edgeLabel && (
        <text
          x={x - r - 10}
          y={y - r + 5}
          textAnchor="end"
          fill={edgeLabel === "1" ? "#cc0000" : "#333333"}
          fontSize={22}
          fontWeight="bold"
        >
          x{node.level}={edgeLabel}
        </text>
      )}
    </g>
  );
}
