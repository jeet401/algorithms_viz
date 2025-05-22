
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { GraphEditor } from "./GraphEditor";

type Vertex = { id: string; x: number; y: number };
type Edge = { source: string; target: string; weight: number };
type Graph = { vertices: Vertex[]; edges: Edge[] };
type DistanceMatrix = Array<Array<number>>;
type PredecessorMatrix = Array<Array<string | null>>;
type Step = {
  k: number;
  i: number;
  j: number;
  dist: number;
  improved: boolean;
};

export default function FloydWarshall() {
  const [graph, setGraph] = useState<Graph>({
    vertices: [
      { id: "A", x: 100, y: 100 },
      { id: "B", x: 250, y: 50 },
      { id: "C", x: 400, y: 100 },
      { id: "D", x: 250, y: 250 }
    ],
    edges: [
      { source: "A", target: "B", weight: 3 },
      { source: "B", target: "C", weight: -2 },
      { source: "C", target: "D", weight: 2 },
      { source: "D", target: "A", weight: -1 },
      { source: "A", target: "C", weight: 8 }
    ]
  });
  
  const [distanceMatrices, setDistanceMatrices] = useState<DistanceMatrix[]>([]);
  const [predecessorMatrices, setPredecessorMatrices] = useState<PredecessorMatrix[]>([]);
  const [steps, setSteps] = useState<Step[]>([]);
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [kValues, setKValues] = useState<number[]>([]);
  
  const runFloydWarshall = () => {
    const vertices = graph.vertices;
    const vertexIds = vertices.map(v => v.id);
    const n = vertices.length;
    
    // Initialize distance matrix with Infinity
    const dist: DistanceMatrix = Array(n).fill(0).map(() => Array(n).fill(Infinity));
    const next: PredecessorMatrix = Array(n).fill(0).map(() => Array(n).fill(null));
    
    // Initialize distances for direct edges
    for (let i = 0; i < n; i++) {
      dist[i][i] = 0; // Distance from a vertex to itself is 0
    }
    
    // Add direct edges
    graph.edges.forEach(edge => {
      const u = vertexIds.indexOf(edge.source);
      const v = vertexIds.indexOf(edge.target);
      dist[u][v] = edge.weight;
      next[u][v] = edge.target;
    });
    
    // Save initial state
    const distanceMatrixSteps: DistanceMatrix[] = [JSON.parse(JSON.stringify(dist))];
    const predecessorMatrixSteps: PredecessorMatrix[] = [JSON.parse(JSON.stringify(next))];
    const algorithmSteps: Step[] = [];
    const kValueSteps: number[] = [-1]; // -1 represents initial state
    
    // Floyd-Warshall algorithm
    for (let k = 0; k < n; k++) {
      let matrixChanged = false;
      
      // For each intermediate vertex
      for (let i = 0; i < n; i++) {
        for (let j = 0; j < n; j++) {
          // If path through k is shorter
          if (dist[i][k] !== Infinity && dist[k][j] !== Infinity) {
            const throughK = dist[i][k] + dist[k][j];
            const improved = throughK < dist[i][j];
            
            algorithmSteps.push({
              k,
              i,
              j,
              dist: improved ? throughK : dist[i][j],
              improved
            });
            
            if (improved) {
              dist[i][j] = throughK;
              next[i][j] = next[i][k];
              matrixChanged = true;
            }
          }
        }
      }
      
      // Save state after processing this k value
      distanceMatrixSteps.push(JSON.parse(JSON.stringify(dist)));
      predecessorMatrixSteps.push(JSON.parse(JSON.stringify(next)));
      kValueSteps.push(k);
    }
    
    setDistanceMatrices(distanceMatrixSteps);
    setPredecessorMatrices(predecessorMatrixSteps);
    setSteps(algorithmSteps);
    setKValues(kValueSteps);
    setCurrentStepIndex(0);
  };
  
  const getPath = (start: string, end: string): string[] => {
    if (!distanceMatrices.length) return [];
    
    const vertexIds = graph.vertices.map(v => v.id);
    const u = vertexIds.indexOf(start);
    const v = vertexIds.indexOf(end);
    const finalNext = predecessorMatrices[predecessorMatrices.length - 1];
    
    if (finalNext[u][v] === null) return [];
    
    const path: string[] = [start];
    let current = u;
    
    while (current !== v) {
      const nextIdx = vertexIds.indexOf(finalNext[current][v] || "");
      if (nextIdx === -1) break;
      
      path.push(vertexIds[nextIdx]);
      current = nextIdx;
    }
    
    return path;
  };
  
  const formatDistance = (d: number) => {
    return d === Infinity ? "∞" : d;
  };
  
  const currentMatrix = distanceMatrices[Math.min(currentStepIndex, distanceMatrices.length - 1)];
  const currentK = kValues[Math.min(currentStepIndex, kValues.length - 1)];
  const vertexIds = graph.vertices.map(v => v.id);

  return (
    <div className="flex flex-col gap-6">
      <h2 className="text-2xl font-bold mb-2">Floyd-Warshall Algorithm</h2>
      <p className="text-gray-700">
        The Floyd-Warshall algorithm finds shortest paths between all pairs of vertices in a weighted graph.
        It works with both positive and negative edge weights, as long as there are no negative cycles.
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
        <h3 className="text-xl font-semibold mb-3">Run Algorithm</h3>
        <Button onClick={runFloydWarshall}>
          Execute Floyd-Warshall
        </Button>
      </div>
      
      {distanceMatrices.length > 0 && (
        <div className="border p-4 rounded-md">
          <h3 className="text-xl font-semibold mb-4">Results</h3>
          
          <div className="flex flex-col gap-4">
            <div>
              <h4 className="font-semibold mb-3">
                {currentK === -1 
                  ? "Initial Distance Matrix" 
                  : `Distance Matrix After Considering Vertex ${vertexIds[currentK]} (k=${currentK})`}
              </h4>
              <div className="overflow-x-auto">
                <table className="min-w-full bg-white border">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="px-4 py-2 border text-gray-900"></th>
                      {vertexIds.map(id => (
                        <th key={id} className="px-4 py-2 border text-gray-900">{id}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {vertexIds.map((fromId, i) => (
                      <tr key={fromId}>
                        <td className="px-4 py-2 border font-medium bg-gray-100 text-gray-900">{fromId}</td>
                        {vertexIds.map((toId, j) => {
                          const currentValue = currentMatrix?.[i][j];
                          const previousValue = currentStepIndex > 0 ? 
                            distanceMatrices[currentStepIndex - 1]?.[i][j] : Infinity;
                          
                          return (
                            <td 
                              key={`${fromId}-${toId}`} 
                              className={`px-4 py-2 border text-center ${
                                currentValue !== previousValue && currentStepIndex > 0
                                  ? "bg-yellow-100 font-medium text-gray-900"
                                  : "text-gray-900 bg-white"
                              }`}
                            >
                              {currentMatrix ? formatDistance(currentMatrix[i][j]) : "-"}
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              <div className="text-xs mt-1 text-gray-700">
                <span className="inline-block w-4 h-4 bg-yellow-100 mr-1"></span> 
                Highlighted cells indicate a change from previous state
              </div>
            </div>
            
            {steps.length > 0 && (
              <div className="mt-4">
                <h4 className="font-semibold mb-2">Algorithm Progress</h4>
                <div className="flex items-center gap-2 mb-4">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={currentStepIndex === 0}
                    onClick={() => setCurrentStepIndex(0)}
                  >
                    Initial
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={currentStepIndex === 0}
                    onClick={() => setCurrentStepIndex(Math.max(0, currentStepIndex - 1))}
                  >
                    Previous
                  </Button>
                  <div className="px-3 py-1 border rounded flex-1 text-center text-gray-900 bg-white">
                    Step {currentStepIndex} of {distanceMatrices.length - 1}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={currentStepIndex >= distanceMatrices.length - 1}
                    onClick={() => setCurrentStepIndex(Math.min(distanceMatrices.length - 1, currentStepIndex + 1))}
                  >
                    Next
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={currentStepIndex >= distanceMatrices.length - 1}
                    onClick={() => setCurrentStepIndex(distanceMatrices.length - 1)}
                  >
                    Final
                  </Button>
                </div>
                
                {currentStepIndex > 0 && kValues[currentStepIndex] !== -1 && (
                  <div className="p-3 bg-gray-50 border rounded mb-4 text-gray-900">
                    <p className="mb-1">
                      <span className="font-medium">Current Phase:</span> Using <strong>{vertexIds[kValues[currentStepIndex]]}</strong> as intermediate vertex (k={kValues[currentStepIndex]})
                    </p>
                    <p className="mb-1">
                      <span className="font-medium">Process:</span> For each pair of vertices (i,j), we check if going through vertex k gives a shorter path.
                    </p>
                    <p className="text-blue-600">
                      New formula: dist[i][j] = min(dist[i][j], dist[i][k] + dist[k][j])
                    </p>
                  </div>
                )}
              </div>
            )}
            
            {currentStepIndex === distanceMatrices.length - 1 && (
              <div className="mt-4">
                <h4 className="font-semibold mb-2">Final Shortest Paths</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {vertexIds.map(from => (
                    vertexIds.map(to => {
                      if (from === to) return null;
                      const path = getPath(from, to);
                      const distance = currentMatrix[vertexIds.indexOf(from)][vertexIds.indexOf(to)];
                      
                      return (
                        <div key={`${from}-${to}`} className="p-3 border rounded bg-white text-gray-900">
                          <h5 className="font-medium">{from} → {to}</h5>
                          {distance === Infinity ? (
                            <p className="text-gray-500">No path available</p>
                          ) : (
                            <>
                              <p className="text-sm">Distance: {distance}</p>
                              <p className="text-sm">Path: {path.join(" → ")}</p>
                            </>
                          )}
                        </div>
                      );
                    })
                  )).flat().filter(Boolean)}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
