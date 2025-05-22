import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp } from "lucide-react";

// Node = { id: string, x:number, y:number }
const RADIUS = 18;

type Vertex = { id: string; x: number; y: number };
type Edge = { source: string; target: string; weight: number };

export function GraphEditor({
  graph,
  setGraph,
  height = 600, // Increased default height
  width = 800,  // Increased default width
  showHeader = true,
}: {
  graph: { vertices: Vertex[]; edges: Edge[] };
  setGraph: (g: { vertices: Vertex[]; edges: Edge[] }) => void;
  height?: number;
  width?: number;
  showHeader?: boolean;
}) {
  const [mode, setMode] = useState<"add-node" | "add-edge" | null>("add-node");
  const [edgeStart, setEdgeStart] = useState<string | null>(null);
  const [edgeWeight, setEdgeWeight] = useState<number>(1);
  const [collapsed, setCollapsed] = useState(false);

  // Create a unique node label automatically
  const getNextLabel = () => {
    const existingLabels = graph.vertices.map(v => v.id);
    
    // Try letters first (A-Z)
    for (let i = 0; i < 26; i++) {
      const label = String.fromCharCode("A".charCodeAt(0) + i);
      if (!existingLabels.includes(label)) {
        return label;
      }
    }
    
    // If all letters are used, try combinations (AA, AB, etc.)
    for (let i = 0; i < 26; i++) {
      for (let j = 0; j < 26; j++) {
        const label = String.fromCharCode("A".charCodeAt(0) + i) + 
                      String.fromCharCode("A".charCodeAt(0) + j);
        if (!existingLabels.includes(label)) {
          return label;
        }
      }
    }
    
    // If all are used, just use a number
    return `N${graph.vertices.length}`;
  };

  // Add node at clicked position
  const handleSvgClick = (e: React.MouseEvent<SVGSVGElement, MouseEvent>) => {
    if (mode !== "add-node") return;
    const box = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - box.left;
    const y = e.clientY - box.top;
    setGraph({
      ...graph,
      vertices: [
        ...graph.vertices,
        { id: getNextLabel(), x: x - RADIUS, y: y - RADIUS },
      ],
    });
  };

  // Start drawing edge from a node
  const handleNodeClick = (v: Vertex) => {
    if (mode === "add-edge" && !edgeStart) setEdgeStart(v.id);
    else if (mode === "add-edge" && edgeStart && edgeStart !== v.id) {
      // Check if edge already exists
      const edgeExists = graph.edges.some(
        e => (e.source === edgeStart && e.target === v.id) || 
             (e.source === v.id && e.target === edgeStart)
      );
      
      if (!edgeExists) {
        // Create edge (edgeStart, v.id)
        setGraph({
          ...graph,
          edges: [
            ...graph.edges,
            { source: edgeStart, target: v.id, weight: edgeWeight },
          ],
        });
      }
      setEdgeStart(null);
    }
  };

  // Remove vertex/edge logic
  const removeVertex = (id: string) => {
    setGraph({
      vertices: graph.vertices.filter((v) => v.id !== id),
      edges: graph.edges.filter((e) => e.source !== id && e.target !== id),
    });
  };
  
  const removeEdge = (i: number) => {
    setGraph({
      ...graph,
      edges: graph.edges.filter((_, idx) => idx !== i),
    });
  };

  return (
    <div className="border border-border rounded-md overflow-hidden bg-background">
      {showHeader && (
        <div className="p-2 border-b border-border flex items-center justify-between bg-muted/30">
          <div className="flex gap-2">
            <Button size="sm" variant={mode === "add-node" ? "default" : "outline"} onClick={() => setMode("add-node")}>Add Node</Button>
            <Button size="sm" variant={mode === "add-edge" ? "default" : "outline"} onClick={() => setMode("add-edge")}>Add Edge</Button>
            {mode === "add-edge" && (
              <div className="flex items-center gap-1">
                <label className="text-sm">Weight:</label>
                <Input 
                  type="number" 
                  min="1" 
                  value={edgeWeight} 
                  onChange={e=>setEdgeWeight(Number(e.target.value))} 
                  className="w-16 h-8" 
                />
              </div>
            )}
          </div>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => setCollapsed(!collapsed)}
            className="h-8 w-8 p-0"
          >
            {collapsed ? <ChevronDown className="h-4 w-4" /> : <ChevronUp className="h-4 w-4" />}
          </Button>
        </div>
      )}
      
      {!collapsed && (
        <div>
          <svg
            width={width}
            height={height}
            style={{ background: "#fff" }}
            onClick={handleSvgClick}
          >
            {/* Edges */}
            {graph.edges.map((e, i) => {
              const s = graph.vertices.find((v) => v.id === e.source);
              const t = graph.vertices.find((v) => v.id === e.target);
              if (!s || !t) return null;
              return (
                <g key={`e-${i}`}>
                  <line
                    x1={s.x + RADIUS}
                    y1={s.y + RADIUS}
                    x2={t.x + RADIUS}
                    y2={t.y + RADIUS}
                    stroke="#888"
                    strokeWidth={3}
                    markerEnd="url(#arrow)"
                  />
                  <text 
                    x={(s.x+t.x)/2+RADIUS} 
                    y={(s.y+t.y)/2+RADIUS-4} 
                    fontSize={13}
                    className="select-none"
                  >
                    {e.weight}
                  </text>
                  <circle 
                    cx={(s.x+t.x)/2+RADIUS+14} 
                    cy={(s.y+t.y)/2+RADIUS-8} 
                    r="7" 
                    fill="#eee" 
                    stroke="#999" 
                    onClick={ev=>{ev.stopPropagation(); removeEdge(i);}} 
                    className="cursor-pointer hover:stroke-red-500"
                  />
                  <text 
                    x={(s.x+t.x)/2+RADIUS+14-4} 
                    y={(s.y+t.y)/2+RADIUS-4} 
                    fontSize={11} 
                    fill="#c00" 
                    onClick={ev=>{ ev.stopPropagation(); removeEdge(i)}}
                    className="cursor-pointer select-none"
                  >
                    ×
                  </text>
                </g>
              );
            })}
            {/* Node Circles */}
            {graph.vertices.map((v) => (
              <g key={v.id}>
                <circle
                  cx={v.x + RADIUS}
                  cy={v.y + RADIUS}
                  r={RADIUS}
                  fill="#0369a1"
                  stroke="#155e75"
                  strokeWidth={2}
                  onClick={ev => {ev.stopPropagation(); handleNodeClick(v)}}
                  className="cursor-pointer"
                />
                <text 
                  x={v.x + RADIUS-7} 
                  y={v.y+RADIUS+5} 
                  fontSize={17} 
                  fill="#fff" 
                  stroke="none"
                  className="select-none"
                >
                  {v.id}
                </text>
                <circle 
                  cx={v.x+RADIUS+18} 
                  cy={v.y+RADIUS-16} 
                  r="7" 
                  fill="#eee" 
                  stroke="#999" 
                  onClick={ev=>{ev.stopPropagation(); removeVertex(v.id)}}
                  className="cursor-pointer hover:stroke-red-500"
                />
                <text 
                  x={v.x+RADIUS+18-4} 
                  y={v.y+RADIUS-12} 
                  fontSize={11} 
                  fill="#c00" 
                  onClick={ev=>{ ev.stopPropagation(); removeVertex(v.id)}}
                  className="cursor-pointer select-none"
                >
                  ×
                </text>
              </g>
            ))}
            {/* For showing which node we are drawing edges from */}
            {mode === "add-edge" && edgeStart && (() => {
              const v = graph.vertices.find(x => x.id === edgeStart);
              if (!v) return null;
              return (
                <circle
                  cx={v.x + RADIUS}
                  cy={v.y + RADIUS}
                  r={RADIUS+4}
                  fill="none"
                  stroke="#22c55e"
                  strokeWidth={3}
                  pointerEvents="none"
                />
              )
            })()}
            <defs>
            <marker id="arrow"
              markerWidth="10" markerHeight="10" 
              refX="9" refY="5"
              orient="auto"
              markerUnits="strokeWidth">
              <path d="M0,0 L10,5 L0,10" fill="#888" />
            </marker>
            </defs>
          </svg>
          <div className="px-4 py-2 text-xs text-gray-500">
            Click canvas to add node, or click nodes to create edges when in "Add Edge" mode. Remove nodes/edges by clicking ×.
            {mode === "add-edge" && edgeStart && (
              <span className="ml-2 text-green-600">
                Select a second node to complete the edge from {edgeStart}
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
