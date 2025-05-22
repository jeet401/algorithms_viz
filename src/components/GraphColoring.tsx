
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { GraphEditor } from './GraphEditor';

type Vertex = { id: string; x: number; y: number };
type Edge = { source: string; target: string; weight: number };
type Graph = { vertices: Vertex[]; edges: Edge[] };
type ColorAssignment = { [vertex: string]: number };
type StepInfo = { node: string; color: number; status: 'trying' | 'success' | 'backtrack' };

// Colors with improved contrast
const COLORS = [
  '#ef4444', // Red
  '#3b82f6', // Blue
  '#22c55e', // Green
  '#eab308', // Yellow
  '#8b5cf6', // Purple
  '#ec4899', // Pink
  '#f97316', // Orange
  '#14b8a6', // Teal
];

export default function GraphColoring() {
  const [graph, setGraph] = useState<Graph>({ 
    vertices: [
      { id: "A", x: 100, y: 100 },
      { id: "B", x: 200, y: 50 },
      { id: "C", x: 300, y: 100 },
      { id: "D", x: 100, y: 200 },
    ], 
    edges: [
      { source: "A", target: "B", weight: 1 },
      { source: "B", target: "C", weight: 1 },
      { source: "C", target: "A", weight: 1 },
      { source: "A", target: "D", weight: 1 },
    ] 
  });
  const [maxColors, setMaxColors] = useState<number>(3);
  const [solutions, setSolutions] = useState<ColorAssignment[]>([]);
  const [selectedSolution, setSelectedSolution] = useState<number>(0);
  const [steps, setSteps] = useState<StepInfo[]>([]);
  const [computed, setComputed] = useState<boolean>(false);
  
  // Build adjacency list from graph
  const buildAdjacencyList = (): { [vertex: string]: string[] } => {
    const adjList: { [vertex: string]: string[] } = {};
    
    // Initialize all vertices with empty arrays
    graph.vertices.forEach(v => {
      adjList[v.id] = [];
    });
    
    // Add edges
    graph.edges.forEach(e => {
      adjList[e.source].push(e.target);
      adjList[e.target].push(e.source); // Undirected graph
    });
    
    return adjList;
  };
  
  // Check if a color assignment is valid
  const isColorValid = (
    vertex: string, 
    color: number, 
    assignment: ColorAssignment,
    adjList: { [vertex: string]: string[] }
  ): boolean => {
    // Check if any adjacent vertex has the same color
    for (const adj of adjList[vertex]) {
      if (assignment[adj] === color) {
        return false;
      }
    }
    return true;
  };
  
  // Solve graph coloring using backtracking
  const solveGraphColoring = () => {
    const vertices = graph.vertices.map(v => v.id);
    const adjList = buildAdjacencyList();
    
    const allSolutions: ColorAssignment[] = [];
    const stepHistory: StepInfo[] = [];
    
    const backtrack = (
      index: number,
      colors: ColorAssignment
    ): void => {
      // Base case: all vertices colored
      if (index === vertices.length) {
        allSolutions.push({...colors});
        return;
      }
      
      const vertex = vertices[index];
      
      // Try each color
      for (let color = 1; color <= maxColors; color++) {
        stepHistory.push({
          node: vertex,
          color: color,
          status: 'trying'
        });
        
        if (isColorValid(vertex, color, colors, adjList)) {
          colors[vertex] = color;
          
          stepHistory.push({
            node: vertex,
            color: color,
            status: 'success'
          });
          
          // Continue to next vertex
          backtrack(index + 1, colors);
          
          // Remove color (backtrack)
          delete colors[vertex];
        } else {
          stepHistory.push({
            node: vertex,
            color: color,
            status: 'backtrack'
          });
        }
      }
    };
    
    backtrack(0, {});
    
    setSolutions(allSolutions);
    setSteps(stepHistory);
    setComputed(true);
    
    if (allSolutions.length > 0) {
      setSelectedSolution(0);
    }
  };

  // Function to get text color based on background for contrast
  const getTextColor = (backgroundColor: string): string => {
    // Convert hex to RGB
    const hex = backgroundColor.replace('#', '');
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    
    // Calculate luminance (perceived brightness)
    // Using the formula: 0.299*R + 0.587*G + 0.114*B
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    
    // Use white text for dark backgrounds, black text for light backgrounds
    return luminance > 0.5 ? '#000000' : '#ffffff';
  };

  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-2xl font-bold">Graph Coloring</h2>
      
      <div className="mb-4">
        <div className="flex gap-2 items-center mb-4">
          <label className="text-sm font-medium text-gray-800 dark:text-gray-200">Maximum Colors:</label>
          <Input
            type="number"
            min="1"
            max="8"  // Increased to match our COLORS array
            value={maxColors}
            onChange={(e) => setMaxColors(Number(e.target.value))}
            className="w-20"
          />
          <Button onClick={solveGraphColoring} disabled={graph.vertices.length === 0}>
            Solve Graph Coloring
          </Button>
        </div>
        <GraphEditor graph={graph} setGraph={setGraph} height={400} />
      </div>
      
      {computed && (
        <div className="flex flex-col gap-4 mt-4">
          {solutions.length > 0 ? (
            <>
              <div className="p-4 bg-green-50 dark:bg-green-900 border border-green-200 dark:border-green-700 rounded-md">
                <h3 className="text-lg font-bold text-green-800 dark:text-green-100">Found {solutions.length} valid coloring{solutions.length !== 1 ? 's' : ''}</h3>
                {solutions.length > 1 && (
                  <div className="flex items-center gap-2 mt-2">
                    <Button 
                      size="sm"
                      onClick={() => setSelectedSolution(prev => Math.max(0, prev - 1))}
                      disabled={selectedSolution === 0}
                    >
                      Previous
                    </Button>
                    <span className="text-green-800 dark:text-green-100">
                      Solution {selectedSolution + 1} of {solutions.length}
                    </span>
                    <Button
                      size="sm"
                      onClick={() => setSelectedSolution(prev => Math.min(solutions.length - 1, prev + 1))}
                      disabled={selectedSolution === solutions.length - 1}
                    >
                      Next
                    </Button>
                  </div>
                )}
                
                <div className="flex flex-wrap gap-3 mt-4">
                  {graph.vertices.map((v) => {
                    const colorIndex = (solutions[selectedSolution][v.id] - 1) % COLORS.length;
                    const bgColor = COLORS[colorIndex];
                    const textColor = getTextColor(bgColor);
                    
                    return (
                      <div key={v.id} className="flex items-center gap-1">
                        <div
                          className="w-6 h-6 rounded-full flex items-center justify-center"
                          style={{ backgroundColor: bgColor, border: "1px solid rgba(0,0,0,0.2)" }}
                        >
                          <span style={{ color: textColor, fontWeight: "bold", fontSize: "12px" }}>
                            {solutions[selectedSolution][v.id]}
                          </span>
                        </div>
                        <span className="text-gray-800 dark:text-gray-200">{v.id}: Color {solutions[selectedSolution][v.id]}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold mb-2 text-gray-800 dark:text-gray-100">Colored Graph</h3>
                <div className="border border-gray-200 dark:border-gray-700 rounded-md bg-white dark:bg-gray-900">
                  <svg width="800" height="400">
                    {/* Edges */}
                    {graph.edges.map((e, i) => {
                      const s = graph.vertices.find((v) => v.id === e.source);
                      const t = graph.vertices.find((v) => v.id === e.target);
                      if (!s || !t) return null;
                      
                      return (
                        <line
                          key={`e-${i}`}
                          x1={s.x + 18}
                          y1={s.y + 18}
                          x2={t.x + 18}
                          y2={t.y + 18}
                          stroke="#888"
                          strokeWidth={2}
                        />
                      );
                    })}
                    
                    {/* Nodes */}
                    {graph.vertices.map((v) => {
                      const colorNum = solutions[selectedSolution][v.id];
                      const colorIndex = (colorNum - 1) % COLORS.length;
                      const fillColor = COLORS[colorIndex];
                      const textColor = getTextColor(fillColor);
                      
                      return (
                        <g key={v.id}>
                          <circle
                            cx={v.x + 18}
                            cy={v.y + 18}
                            r={24}
                            fill={fillColor}
                            stroke="#333"
                            strokeWidth={2}
                          />
                          <text
                            x={v.x + 18}
                            y={v.y + 18}
                            textAnchor="middle"
                            dominantBaseline="middle"
                            fill={textColor}
                            fontSize={16}
                            fontWeight="bold"
                          >
                            {v.id}
                          </text>
                          <text
                            x={v.x + 18}
                            y={v.y + 35}
                            textAnchor="middle"
                            dominantBaseline="middle"
                            fill={textColor}
                            fontSize={10}
                            fontWeight="bold"
                          >
                            Color: {colorNum}
                          </text>
                        </g>
                      );
                    })}
                  </svg>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold mb-2 text-gray-800 dark:text-gray-100">Backtracking Steps</h3>
                <div className="border border-gray-200 dark:border-gray-700 rounded-md p-4 max-h-60 overflow-y-auto bg-white dark:bg-gray-900">
                  {steps.map((step, i) => {
                    let message = "";
                    let className = "";
                    
                    if (step.status === 'trying') {
                      message = `Trying color ${step.color} for vertex ${step.node}`;
                      className = "text-blue-600 dark:text-blue-400";
                    } else if (step.status === 'success') {
                      message = `Assigned color ${step.color} to vertex ${step.node}`;
                      className = "text-green-600 dark:text-green-400";
                    } else {
                      message = `Color ${step.color} is not valid for vertex ${step.node}, backtracking...`;
                      className = "text-red-600 dark:text-red-400";
                    }
                    
                    return (
                      <p key={i} className={`text-sm mb-1 ${className}`}>
                        {i+1}. {message}
                      </p>
                    );
                  })}
                </div>
              </div>
            </>
          ) : (
            <div className="p-4 bg-red-50 dark:bg-red-900 border border-red-200 dark:border-red-700 rounded-md">
              <h3 className="text-lg font-bold text-red-800 dark:text-red-100">No Valid Coloring Found</h3>
              <p className="text-red-700 dark:text-red-200">
                The graph cannot be colored with {maxColors} colors. Try increasing the number of colors.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
