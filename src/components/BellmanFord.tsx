
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { GraphEditor } from "./GraphEditor";

type Vertex = { id: string; x: number; y: number };
type Edge = { source: string; target: string; weight: number };
type Graph = { vertices: Vertex[]; edges: Edge[] };
type DistanceEntry = { vertex: string; distance: number; predecessor: string | null };

export default function BellmanFord() {
  const [graph, setGraph] = useState<Graph>({
    vertices: [
      { id: "A", x: 100, y: 100 },
      { id: "B", x: 250, y: 50 },
      { id: "C", x: 400, y: 100 },
      { id: "D", x: 250, y: 250 }
    ],
    edges: [
      { source: "A", target: "B", weight: 4 },
      { source: "A", target: "D", weight: 5 },
      { source: "B", target: "C", weight: 6 },
      { source: "C", target: "D", weight: -3 },
      { source: "D", target: "B", weight: -2 }
    ]
  });
  
  const [sourceVertex, setSourceVertex] = useState<string>("A");
  const [iterations, setIterations] = useState<DistanceEntry[][]>([]);
  const [negativeCycle, setNegativeCycle] = useState<boolean>(false);
  const [steps, setSteps] = useState<string[]>([]);

  const runBellmanFord = () => {
    const vertices = graph.vertices.map(v => v.id);
    const edges = graph.edges;
    
    // Initialize distances
    let distances: Record<string, number> = {};
    let predecessors: Record<string, string | null> = {};
    
    vertices.forEach(vertex => {
      distances[vertex] = vertex === sourceVertex ? 0 : Infinity;
      predecessors[vertex] = null;
    });
    
    const iterationResults: DistanceEntry[][] = [];
    const stepsLog: string[] = [];
    
    // Record initial state
    iterationResults.push(vertices.map(v => ({
      vertex: v,
      distance: distances[v],
      predecessor: predecessors[v]
    })));
    
    stepsLog.push(`Initialization: Set distance of source vertex ${sourceVertex} to 0 and all others to ∞`);
    
    // Relax edges |V| - 1 times
    for (let i = 0; i < vertices.length - 1; i++) {
      let hasChanges = false;
      
      stepsLog.push(`Iteration ${i + 1}: Checking all edges for relaxation`);
      
      edges.forEach(edge => {
        const { source, target, weight } = edge;
        
        // If we can improve the distance to target through source
        if (distances[source] !== Infinity && distances[source] + weight < distances[target]) {
          distances[target] = distances[source] + weight;
          predecessors[target] = source;
          hasChanges = true;
          
          stepsLog.push(`  Relaxed edge ${source} → ${target} with weight ${weight}. New distance to ${target} = ${distances[target]}`);
        }
      });
      
      // Record the state after this iteration
      iterationResults.push(vertices.map(v => ({
        vertex: v,
        distance: distances[v],
        predecessor: predecessors[v]
      })));
      
      if (!hasChanges) {
        stepsLog.push(`  No changes in this iteration, algorithm can terminate early`);
        break;
      }
    }
    
    // Check for negative cycles
    let hasNegativeCycle = false;
    
    stepsLog.push(`Checking for negative cycles...`);
    
    edges.forEach(edge => {
      const { source, target, weight } = edge;
      if (distances[source] !== Infinity && distances[source] + weight < distances[target]) {
        hasNegativeCycle = true;
        stepsLog.push(`  Negative cycle detected! Edge ${source} → ${target} can still be relaxed.`);
      }
    });
    
    if (hasNegativeCycle) {
      stepsLog.push(`Graph contains a negative cycle, shortest path not well-defined.`);
    } else {
      stepsLog.push(`Algorithm completed. Final distances from source ${sourceVertex} have been computed.`);
    }
    
    setIterations(iterationResults);
    setNegativeCycle(hasNegativeCycle);
    setSteps(stepsLog);
  };
  
  const formatDistance = (distance: number) => {
    return distance === Infinity ? "∞" : distance;
  };
  
  const getShortestPathTo = (targetVertex: string): string[] => {
    if (!iterations.length) return [];
    
    const finalState = iterations[iterations.length - 1];
    const finalDistances = finalState.reduce<Record<string, DistanceEntry>>((acc, entry) => {
      acc[entry.vertex] = entry;
      return acc;
    }, {});
    
    if (finalDistances[targetVertex].distance === Infinity) {
      return [`No path from ${sourceVertex} to ${targetVertex}`];
    }
    
    const path: string[] = [];
    let current = targetVertex;
    
    while (current) {
      path.unshift(current);
      current = finalDistances[current].predecessor || "";
      if (!current) break;
    }
    
    return path;
  };

  return (
    <div className="flex flex-col gap-6">
      <h2 className="text-2xl font-bold mb-2">Bellman-Ford Algorithm</h2>
      <p className="text-gray-700">
        The Bellman-Ford algorithm computes shortest paths from a single source vertex to all other vertices
        in a weighted directed graph. Unlike Dijkstra's algorithm, it can handle graphs with negative weight edges.
        It can also detect negative cycles in the graph.
      </p>
      
      <div className="border rounded-md p-4 bg-muted/30">
        <h3 className="text-xl font-semibold mb-2">Graph Editor</h3>
        <p className="text-gray-600 mb-3">
          Use the graph editor below to create or modify a graph. Each edge can have a positive or negative weight.
        </p>
        
        <GraphEditor 
          graph={graph} 
          setGraph={setGraph}
          height={500}
          width={800}
        />
      </div>
      
      <div className="border p-4 rounded-md">
        <h3 className="text-xl font-semibold mb-3">Configuration</h3>
        <div className="flex items-center gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Source Vertex</label>
            <select 
              className="border rounded px-3 py-2 bg-white text-gray-900"
              value={sourceVertex}
              onChange={(e) => setSourceVertex(e.target.value)}
            >
              {graph.vertices.map(v => (
                <option key={v.id} value={v.id}>{v.id}</option>
              ))}
            </select>
          </div>
          
          <div className="mt-4">
            <Button onClick={runBellmanFord} className="py-2">
              Run Bellman-Ford
            </Button>
          </div>
        </div>
      </div>
      
      {iterations.length > 0 && (
        <div className="border p-4 rounded-md">
          <h3 className="text-xl font-semibold mb-4">Results</h3>
          
          {negativeCycle && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-md">
              <p className="font-medium">⚠️ Negative cycle detected!</p>
              <p>The graph contains a negative weight cycle, so shortest paths are not well-defined.</p>
            </div>
          )}
          
          <div className="mb-6">
            <h4 className="font-semibold mb-2">Iterations</h4>
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white border">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="px-4 py-2 border text-gray-900">Iteration</th>
                    {graph.vertices.map(v => (
                      <th key={v.id} className="px-4 py-2 border text-gray-900">{v.id}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {iterations.map((iteration, i) => (
                    <tr key={i}>
                      <td className="px-4 py-2 border font-medium text-gray-900 bg-gray-50">
                        {i === 0 ? "Initial" : i}
                      </td>
                      {graph.vertices.map(v => {
                        const entry = iteration.find(e => e.vertex === v.id);
                        return (
                          <td 
                            key={v.id} 
                            className={`px-4 py-2 border ${
                              i > 0 && entry && iterations[i-1].find(e => e.vertex === v.id)?.distance !== entry.distance
                                ? "bg-yellow-100 text-gray-900"
                                : "bg-white text-gray-900"
                            }`}
                          >
                            {entry 
                              ? <div>
                                  <div>{formatDistance(entry.distance)}</div>
                                  {entry.predecessor && <div className="text-xs text-gray-500">prev: {entry.predecessor}</div>}
                                </div>
                              : "N/A"
                            }
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="text-xs text-gray-700 mt-1">
              <span className="inline-block w-4 h-4 bg-yellow-100 mr-1"></span> Highlighted cells indicate a change in distance from previous iteration
            </div>
          </div>
          
          <div className="mb-6">
            <h4 className="font-semibold mb-2">Algorithm Steps</h4>
            <div className="bg-gray-50 p-3 rounded-md border max-h-60 overflow-y-auto text-gray-900">
              <ol className="list-decimal list-inside space-y-1">
                {steps.map((step, index) => (
                  <li key={index} className={step.includes("Relaxed edge") ? "pl-4 text-green-700" : ""}>
                    {step}
                  </li>
                ))}
              </ol>
            </div>
          </div>
          
          <div>
            <h4 className="font-semibold mb-2">Shortest Paths from {sourceVertex}</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {graph.vertices
                .filter(v => v.id !== sourceVertex)
                .map(v => {
                  const path = getShortestPathTo(v.id);
                  const finalDistance = iterations[iterations.length - 1].find(e => e.vertex === v.id)?.distance;
                  
                  return (
                    <div key={v.id} className="p-3 border rounded-md bg-white text-gray-900">
                      <h5 className="font-medium">{sourceVertex} → {v.id}</h5>
                      {finalDistance === Infinity ? (
                        <p className="text-gray-500">No path available</p>
                      ) : (
                        <>
                          <p className="text-sm">Distance: {finalDistance}</p>
                          <p className="text-sm">Path: {path.join(" → ")}</p>
                        </>
                      )}
                    </div>
                  );
                })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
