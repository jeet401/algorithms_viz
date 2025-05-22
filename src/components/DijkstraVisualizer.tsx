
import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "./ui/button";

type DijkstraStep = {
  visited: string[];
  current: string | null;
  distances: Record<string, number>;
};

type ShortestPath = {
  path: string[];
  distance: number;
};

type DijkstraVisualizerProps = {
  steps: DijkstraStep[];
  sourceNode: string;
  shortestPaths: {[key: string]: ShortestPath};
  graph: {
    vertices: {id: string; x: number; y: number}[];
    edges: {source: string; target: string; weight: number}[];
  };
};

const DijkstraVisualizer = ({ steps, sourceNode, shortestPaths, graph }: DijkstraVisualizerProps) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [showStepByStep, setShowStepByStep] = useState(true);
  const [showFinalPaths, setShowFinalPaths] = useState(true);

  // Get list of nodes sorted alphabetically
  const nodes = graph.vertices.map(v => v.id).sort((a, b) => {
    // Try to sort numerically first if both are numbers
    const numA = parseInt(a);
    const numB = parseInt(b);
    if (!isNaN(numA) && !isNaN(numB)) {
      return numA - numB;
    }
    // Otherwise sort alphabetically
    return a.localeCompare(b);
  });
  
  // Format distances for display
  const formatDistance = (dist: number) => {
    return dist === Infinity ? "∞" : dist.toString();
  };
  
  // Get current step data
  const currentStepData = steps[currentStep];
  
  return (
    <div className="mt-6 bg-white dark:bg-gray-800 rounded-lg p-4 shadow">
      <h3 className="text-lg font-medium mb-4 text-gray-900 dark:text-white">Dijkstra's Algorithm Results</h3>
      
      {/* Step-by-Step panel */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <h4 
            className="font-medium text-gray-800 dark:text-gray-100" 
            onClick={() => setShowStepByStep(!showStepByStep)} 
            style={{cursor: "pointer"}}
          >
            Step-by-Step Execution {showStepByStep ? <ChevronUp className="inline h-4 w-4" /> : <ChevronDown className="inline h-4 w-4" />}
          </h4>
          {showStepByStep && steps.length > 0 && (
            <div className="flex space-x-2">
              <Button
                size="sm" variant="outline"
                onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
                disabled={currentStep === 0}
              >
                Previous Step
              </Button>
              <span className="py-2 px-3 bg-slate-100 dark:bg-slate-700 rounded text-gray-800 dark:text-gray-200">
                Step {currentStep} of {steps.length - 1}
              </span>
              <Button
                size="sm" variant="outline"
                onClick={() => setCurrentStep(Math.min(steps.length - 1, currentStep + 1))}
                disabled={currentStep === steps.length - 1}
              >
                Next Step
              </Button>
            </div>
          )}
        </div>
        
        {showStepByStep && currentStepData && (
          <div className="border rounded-lg p-4 bg-slate-50 dark:bg-slate-800">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-200 dark:bg-gray-700">
                    <TableHead className="text-gray-900 dark:text-gray-100 font-bold border-r">Iteration</TableHead>
                    <TableHead className="text-gray-900 dark:text-gray-100 font-bold border-r">S</TableHead>
                    <TableHead className="text-gray-900 dark:text-gray-100 font-bold border-r">Selected</TableHead>
                    {nodes.map(node => (
                      <TableHead key={node} className="text-gray-900 dark:text-gray-100 font-bold text-center">
                        ({node})
                      </TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {steps.slice(0, currentStep + 1).map((step, index) => (
                    <TableRow key={index} className={index === currentStep ? "bg-blue-100 dark:bg-blue-900/30" : "bg-white dark:bg-gray-800"}>
                      <TableCell className="font-medium border-r text-gray-800 dark:text-gray-200">
                        {index === 0 ? "Initial" : index}
                      </TableCell>
                      <TableCell className="border-r text-gray-800 dark:text-gray-200">
                        {index === 0 ? "" : step.visited.join(',')}
                      </TableCell>
                      <TableCell className="border-r text-gray-800 dark:text-gray-200">
                        {index === 0 ? "----" : step.current}
                      </TableCell>
                      
                      {nodes.map(node => (
                        <TableCell key={node} className="text-center text-gray-800 dark:text-gray-200">
                          {formatDistance(step.distances[node])}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            
            <div className="mt-4 p-3 bg-gray-100 dark:bg-gray-700 rounded">
              <div className="font-medium text-gray-900 dark:text-gray-100">Key:</div>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 mt-1">
                <div className="flex items-center">
                  <span className="w-4 h-4 bg-blue-100 dark:bg-blue-900/30 border mr-2"></span>
                  <span className="text-gray-800 dark:text-gray-200">Current step</span>
                </div>
                <div className="flex items-center">
                  <span className="text-gray-800 dark:text-gray-200 font-mono">∞</span>
                  <span className="text-gray-800 dark:text-gray-200 ml-2">Infinity (no path)</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* Final Shortest Paths panel */}
      <div>
        <h4 
          className="font-medium mb-2 text-gray-800 dark:text-gray-100" 
          onClick={() => setShowFinalPaths(!showFinalPaths)}
          style={{cursor: "pointer"}}
        >
          Final Shortest Paths {showFinalPaths ? <ChevronUp className="inline h-4 w-4" /> : <ChevronDown className="inline h-4 w-4" />}
        </h4>
        
        {showFinalPaths && (
          <div className="border rounded-lg p-4 bg-slate-50 dark:bg-slate-800">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-200 dark:bg-gray-700">
                  <TableHead className="text-gray-800 dark:text-gray-200">Destination</TableHead>
                  <TableHead className="text-gray-800 dark:text-gray-200">Shortest Path</TableHead>
                  <TableHead className="text-gray-800 dark:text-gray-200">Total Distance</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {nodes.filter(node => node !== sourceNode).map((node) => {
                  const pathData = shortestPaths[node];
                  const hasPath = pathData && pathData.path.length > 0;
                  
                  return (
                    <TableRow key={node} className="bg-white dark:bg-gray-800">
                      <TableCell className="font-medium text-gray-800 dark:text-gray-200">{node}</TableCell>
                      <TableCell>
                        {hasPath ? (
                          <div className="flex items-center flex-wrap gap-1">
                            {pathData.path.map((step, index) => (
                              <React.Fragment key={index}>
                                <span className={
                                  step === sourceNode ? 
                                  "px-2 py-1 bg-blue-100 dark:bg-blue-700 text-blue-800 dark:text-blue-50 rounded font-medium" : 
                                  "px-2 py-1 bg-green-100 dark:bg-green-700 text-green-800 dark:text-green-50 rounded font-medium"
                                }>
                                  {step}
                                </span>
                                {index < pathData.path.length - 1 && (
                                  <span className="mx-1 text-gray-700 dark:text-gray-300">→</span>
                                )}
                              </React.Fragment>
                            ))}
                          </div>
                        ) : (
                          <span className="text-red-600 dark:text-red-400">No path exists</span>
                        )}
                      </TableCell>
                      <TableCell className="text-gray-800 dark:text-gray-200">
                        {hasPath ? pathData.distance : "∞"}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
            
            {/* Path visualization */}
            <div className="mt-4">
              <h5 className="font-medium mb-2 text-gray-800 dark:text-gray-200">Visualization:</h5>
              <div className="border border-gray-200 dark:border-gray-700 rounded-md bg-white dark:bg-gray-900">
                <svg width="800" height="400" style={{ background: "#fff" }}>
                  {/* Draw all edges */}
                  {graph.edges.map((e, i) => {
                    const s = graph.vertices.find((v) => v.id === e.source);
                    const t = graph.vertices.find((v) => v.id === e.target);
                    if (!s || !t) return null;
                    
                    // Check if this edge is part of any shortest path
                    const isPathEdge = Object.values(shortestPaths).some(pathData => {
                      const path = pathData.path;
                      for (let j = 0; j < path.length - 1; j++) {
                        if ((path[j] === e.source && path[j + 1] === e.target) ||
                            (path[j] === e.target && path[j + 1] === e.source)) {
                          return true;
                        }
                      }
                      return false;
                    });
                    
                    return (
                      <g key={`e-${i}`}>
                        <line
                          x1={s.x + 18}
                          y1={s.y + 18}
                          x2={t.x + 18}
                          y2={t.y + 18}
                          stroke={isPathEdge ? "#22b858" : "#666"}
                          strokeWidth={isPathEdge ? 5 : 2}
                        />
                        <text 
                          x={(s.x+t.x)/2+18} 
                          y={(s.y+t.y)/2+18-6}
                          fontSize={13}
                          fontWeight={isPathEdge ? "bold" : "normal"}
                          fill={isPathEdge ? "#166534" : "#444"}
                        >
                          {e.weight}
                        </text>
                      </g>
                    );
                  })}
                  
                  {/* Node Circles */}
                  {graph.vertices.map((v) => {
                    const isSource = v.id === sourceNode;
                    
                    return (
                      <g key={v.id}>
                        <circle
                          cx={v.x + 18}
                          cy={v.y + 18}
                          r={18}
                          fill={isSource ? "#3b82f6" : "#0c4a6e"}
                          stroke={isSource ? "#1d4ed8" : "#082f49"}
                          strokeWidth={isSource ? 3 : 2}
                        />
                        <text 
                          x={v.x + 18} 
                          y={v.y + 18 + 5} 
                          fontSize={17} 
                          fill="#ffffff" 
                          textAnchor="middle"
                          dominantBaseline="middle"
                        >
                          {v.id}
                        </text>
                      </g>
                    );
                  })}
                </svg>
              </div>
            </div>

            {/* Algorithm complexity */}
            <div className="mt-6">
              <h5 className="font-medium mb-2 text-gray-800 dark:text-gray-200">Algorithm Complexity:</h5>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-3 bg-white dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600">
                  <h6 className="font-medium text-gray-800 dark:text-gray-200 mb-2">Time Complexity</h6>
                  <div className="space-y-1">
                    <div className="flex justify-between">
                      <span className="text-gray-700 dark:text-gray-300">Best Case:</span>
                      <span className="text-gray-800 dark:text-gray-200 font-medium">O(E log V)</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-700 dark:text-gray-300">Average Case:</span>
                      <span className="text-gray-800 dark:text-gray-200 font-medium">O(E log V)</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-700 dark:text-gray-300">Worst Case:</span>
                      <span className="text-gray-800 dark:text-gray-200 font-medium">O(E log V)</span>
                    </div>
                  </div>
                  <p className="mt-2 text-sm text-gray-700 dark:text-gray-300">
                    Using a min-heap, each vertex extraction takes O(log V) and there are O(V) such operations. Edge relaxation takes O(E log V) time.
                  </p>
                </div>
                <div className="p-3 bg-white dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600">
                  <h6 className="font-medium text-gray-800 dark:text-gray-200 mb-2">Space Complexity</h6>
                  <div className="flex justify-between">
                    <span className="text-gray-700 dark:text-gray-300">All cases:</span>
                    <span className="text-gray-800 dark:text-gray-200 font-medium">O(V)</span>
                  </div>
                  <p className="mt-2 text-sm text-gray-700 dark:text-gray-300">
                    Requires space to store the distance array, priority queue, and visited set.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DijkstraVisualizer;
