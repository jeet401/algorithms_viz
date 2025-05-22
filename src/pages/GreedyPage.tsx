
import React, { useState } from "react";
import Header from "@/components/Header";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import KnapsackInput from "@/components/KnapsackInput";
import JobSchedulerInput from "@/components/JobSchedulerInput";
import { GraphEditor } from "@/components/GraphEditor";
import DijkstraVisualizer from "@/components/DijkstraVisualizer";
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

// Types
type Item = { id: string; value: number; weight: number; ratio?: number; selected?: boolean; fraction?: number };
type Job = { id: string; profit: number; deadline: number; assigned?: number };
type Vertex = { id: string; x: number; y: number };
type Edge = { source: string; target: string; weight: number; selected?: boolean };

export default function GreedyPage() {
  // Knapsack state
  const [items, setItems] = useState<Item[]>([]);
  const [capacity, setCapacity] = useState<number>(50);
  const [knapsackFractional, setKnapsackFractional] = useState<Item[]>([]);
  const [knapsackTotal, setKnapsackTotal] = useState<{ value: number; weight: number }>({ value: 0, weight: 0 });

  // Job Scheduling state
  const [jobs, setJobs] = useState<Job[]>([]);
  const [maxDeadline, setMaxDeadline] = useState<number>(5);
  const [jobSchedule, setJobSchedule] = useState<Job[]>([]);
  const [totalProfit, setTotalProfit] = useState<number>(0);

  // Graph state (for MST/Dijkstra visualizations)
  const [graph, setGraph] = useState<{ vertices: Vertex[]; edges: Edge[] }>({ vertices: [], edges: [] });
  const [mstEdges, setMstEdges] = useState<Edge[]>([]);
  const [mstTotalWeight, setMstTotalWeight] = useState<number>(0);
  
  // Dijkstra state
  const [sourceNode, setSourceNode] = useState<string>("");
  const [showDijkstra, setShowDijkstra] = useState<boolean>(false);
  const [dijkstraSteps, setDijkstraSteps] = useState<any[]>([]);
  const [shortestPaths, setShortestPaths] = useState<{[key: string]: {path: string[], distance: number}}>({});

  // --- Knapsack Greedy solution (fractional) ---
  function runFractionalKnapsack() {
    // Compute ratio
    let sorted = [...items].map(i => ({ 
      ...i, 
      ratio: i.value / i.weight,
      fraction: 0 // Initialize all items as not selected
    })).sort((a, b) => (b.ratio ?? 0) - (a.ratio ?? 0));
    
    let remCap = capacity;
    let result: Item[] = [];
    let totalValue = 0, totalWeight = 0;
    
    for (let item of sorted) {
      if (remCap <= 0) {
        // Item not included at all
        result.push({ ...item, selected: false, fraction: 0 });
        continue;
      }
      
      if (item.weight <= remCap) {
        // Item fully included
        result.push({ ...item, selected: true, fraction: 1 });
        totalValue += item.value;
        totalWeight += item.weight;
        remCap -= item.weight;
      } else {
        // Fraction can be taken
        let frac = remCap / item.weight;
        result.push({ 
          ...item, 
          selected: true, 
          fraction: frac,
          value: Math.round(item.value * frac * 100) / 100, 
          weight: Math.round(remCap * 100) / 100 
        });
        totalValue += item.value * frac;
        totalWeight += remCap;
        remCap = 0;
      }
    }
    
    setKnapsackFractional(result);
    setKnapsackTotal({ value: Math.round(totalValue * 100) / 100, weight: Math.round(totalWeight * 100) / 100 });
  }

  // --- Job Scheduling solution (Greedy) ---
  function runJobScheduling() {
    let sorted = [...jobs].sort((a, b) => b.profit - a.profit);
    let slots: (Job | null)[] = Array(maxDeadline).fill(null);
    let schedule: Job[] = [];
    for (let job of sorted) {
      for (let d = Math.min(maxDeadline, job.deadline) - 1; d >= 0; d--) {
        if (!slots[d]) {
          slots[d] = { ...job, assigned: d + 1 };
          schedule.push({ ...job, assigned: d + 1 });
          break;
        }
      }
    }
    setJobSchedule(schedule);
    setTotalProfit(schedule.reduce((s, j) => s + j.profit, 0));
  }

  // --- Kruskal's MST (interactive) ---
  function runKruskals() {
    // Kruskal's: Simple union-find
    let edges = [...graph.edges].sort((a, b) => a.weight - b.weight);
    let parent: Record<string, string> = {};
    for (let v of graph.vertices) parent[v.id] = v.id;
    function find(x: string): string { return parent[x] === x ? x : (parent[x] = find(parent[x])); }
    
    let mst: Edge[] = [];
    let totalWeight = 0;
    
    for (let e of edges) {
      let ps = find(e.source), pt = find(e.target);
      if (ps !== pt) {
        mst.push({ ...e, selected: true });
        totalWeight += e.weight;
        parent[pt] = ps;
      }
    }
    
    setMstEdges(mst);
    setMstTotalWeight(totalWeight);
  }

  // --- Prim's MST (interactive) ---
  function runPrims() {
    let { vertices, edges } = graph;
    if (!vertices.length) return;
    
    let selected: Set<string> = new Set([vertices[0].id]);
    let mst: Edge[] = [];
    let totalWeight = 0;
    
    while (selected.size < vertices.length) {
      let possible = edges.filter(
        e => (selected.has(e.source) && !selected.has(e.target)) ||
            (selected.has(e.target) && !selected.has(e.source))
      );
      
      if(!possible.length) break;
      
      let minEdge = possible.reduce((a, b) => (a.weight < b.weight ? a : b));
      mst.push({ ...minEdge, selected: true });
      totalWeight += minEdge.weight;
      selected.add(selected.has(minEdge.source) ? minEdge.target : minEdge.source);
    }
    
    setMstEdges(mst);
    setMstTotalWeight(totalWeight);
  }

  // --- Dijkstra's (interactive) ---
  function runDijkstra() {
    // Only if at least one node
    if (!graph.vertices.length) return;
    
    let start = graph.vertices[0].id;
    setSourceNode(start);
    
    let dist: Record<string, number> = {};
    let prev: Record<string, string | null> = {};
    let vs = graph.vertices.map(v => v.id);
    
    vs.forEach(v => { 
      dist[v] = v === start ? 0 : Infinity; 
      prev[v] = null; 
    });
    
    let unvisited = new Set<string>(vs);
    let steps: any[] = [];
    
    // Initial state
    steps.push({
      visited: [],
      current: null,
      distances: { ...dist }
    });
    
    while (unvisited.size) {
      // Find node with minimum distance
      let u = Array.from(unvisited).reduce((a, b) => dist[a] < dist[b] ? a : b);
      
      // If we reached Infinity, the graph is disconnected
      if (dist[u] === Infinity) break;
      
      unvisited.delete(u);
      
      // Record this step
      steps.push({
        visited: [...vs.filter(v => !unvisited.has(v))],
        current: u,
        distances: { ...dist }
      });
      
      // Process all neighbors
      let neighbors = graph.edges
        .filter(e => e.source === u || e.target === u)
        .map(e => e.source === u ? e.target : e.source);
      
      for (let v of neighbors) {
        if (!unvisited.has(v)) continue;
        
        // Find edge weight
        const edge = graph.edges.find(
          e => (e.source === u && e.target === v) || (e.target === u && e.source === v)
        );
        if (!edge) continue;
        
        let alt = dist[u] + edge.weight;
        if (alt < dist[v]) {
          dist[v] = alt;
          prev[v] = u;
        }
      }
    }
    
    // Construct shortest paths
    const paths: {[key: string]: {path: string[], distance: number}} = {};
    for (const v of vs) {
      if (v === start) {
        paths[v] = {path: [v], distance: 0};
        continue;
      }
      
      const path: string[] = [];
      let current: string | null = v;
      
      while (current) {
        path.unshift(current);
        if (current === start) break;
        current = prev[current];
        if (!current) break; // No path exists
      }
      
      if (path[0] === start) {
        paths[v] = {path, distance: dist[v]};
      } else {
        paths[v] = {path: [], distance: Infinity};
      }
    }
    
    setDijkstraSteps(steps);
    setShortestPaths(paths);
    setShowDijkstra(true);
  }

  // --- Render ---
  return (
    <div className="min-h-screen flex flex-col">
      <main className="container py-8">
        <h1 className="text-3xl font-bold mb-6">Greedy Algorithms</h1>
        <Tabs defaultValue="knapsack" className="mb-8">
          <TabsList className="mb-4">
            <TabsTrigger value="knapsack">Fractional Knapsack</TabsTrigger>
            <TabsTrigger value="jobs">Job Scheduling</TabsTrigger>
            <TabsTrigger value="kruskal">Kruskal's MST</TabsTrigger>
            <TabsTrigger value="prim">Prim's MST</TabsTrigger>
            <TabsTrigger value="dijkstra">Dijkstra</TabsTrigger>
          </TabsList>

          {/* --- Knapsack Tab --- */}
          <TabsContent value="knapsack">
            <h2 className="text-xl font-bold mb-3">Fractional Knapsack (Greedy Visualization)</h2>
            <KnapsackInput items={items} setItems={setItems} capacity={capacity} setCapacity={setCapacity} />
            <Button onClick={runFractionalKnapsack} className="mt-4">Solve & Visualize</Button>
            
            {knapsackFractional.length > 0 && (
              <div className="mt-6 bg-white dark:bg-gray-800 rounded-lg p-4 shadow">
                <h3 className="font-medium mb-3 text-lg text-gray-900 dark:text-gray-100">Knapsack Solution:</h3>
                
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gray-50 dark:bg-gray-700">
                      <TableHead className="text-gray-800 dark:text-gray-200">Item</TableHead>
                      <TableHead className="text-gray-800 dark:text-gray-200">Value</TableHead>
                      <TableHead className="text-gray-800 dark:text-gray-200">Weight</TableHead>
                      <TableHead className="text-gray-800 dark:text-gray-200">V/W Ratio</TableHead>
                      <TableHead className="text-gray-800 dark:text-gray-200">Fraction Taken</TableHead>
                      <TableHead className="text-gray-800 dark:text-gray-200">Value Contribution</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {knapsackFractional.map((item, i) => (
                      <TableRow key={i} className={item.selected ? "bg-blue-50 dark:bg-blue-900/20" : ""}>
                        <TableCell className="text-gray-900 dark:text-gray-100">{item.id}</TableCell>
                        <TableCell className="text-gray-900 dark:text-gray-100">{item.value}</TableCell>
                        <TableCell className="text-gray-900 dark:text-gray-100">{item.weight}</TableCell>
                        <TableCell className="text-gray-900 dark:text-gray-100">{(item.ratio ?? 0).toFixed(2)}</TableCell>
                        <TableCell className="font-medium text-gray-900 dark:text-gray-100">
                          {item.fraction === 1 ? "1 (Full)" : 
                           item.fraction === 0 ? "0 (None)" : 
                           `${item.fraction?.toFixed(2)} (Partial)`}
                        </TableCell>
                        <TableCell className="text-gray-900 dark:text-gray-100">
                          {item.fraction ? (item.value * (item.fraction || 0)).toFixed(2) : "0"}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                
                <div className="mt-4 p-3 bg-green-50 dark:bg-green-900/30 rounded border border-green-200 dark:border-green-700">
                  <div className="font-medium text-green-900 dark:text-green-100">Total Value: {knapsackTotal.value}</div>
                  <div className="font-medium text-green-900 dark:text-green-100">Total Weight: {knapsackTotal.weight} / {capacity}</div>
                  <Progress className="mt-2 h-2" value={(knapsackTotal.weight / capacity) * 100} />
                </div>
                
                {/* Algorithm complexity */}
                <div className="mt-6">
                  <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-gray-100">Algorithm Complexity:</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600">
                      <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-2">Time Complexity</h4>
                      <div className="space-y-1">
                        <div className="flex justify-between">
                          <span className="text-gray-700 dark:text-gray-300">Best Case:</span>
                          <span className="text-gray-900 dark:text-gray-100 font-medium">O(n log n)</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-700 dark:text-gray-300">Average Case:</span>
                          <span className="text-gray-900 dark:text-gray-100 font-medium">O(n log n)</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-700 dark:text-gray-300">Worst Case:</span>
                          <span className="text-gray-900 dark:text-gray-100 font-medium">O(n log n)</span>
                        </div>
                      </div>
                      <p className="mt-2 text-sm text-gray-700 dark:text-gray-300">
                        The dominant operation is sorting items by value-to-weight ratio, which takes O(n log n) time.
                      </p>
                    </div>
                    <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600">
                      <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-2">Space Complexity</h4>
                      <div className="flex justify-between">
                        <span className="text-gray-700 dark:text-gray-300">All cases:</span>
                        <span className="text-gray-900 dark:text-gray-100 font-medium">O(n)</span>
                      </div>
                      <p className="mt-2 text-sm text-gray-700 dark:text-gray-300">
                        Requires additional space to store the sorted items and their ratios.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </TabsContent>

          {/* --- Job Scheduling Tab --- */}
          <TabsContent value="jobs">
            <h2 className="text-xl font-bold mb-3">Job Scheduling with Deadlines</h2>
            <JobSchedulerInput jobs={jobs} setJobs={setJobs} maxDeadline={maxDeadline} setMaxDeadline={setMaxDeadline} />
            <Button onClick={runJobScheduling} className="mt-4">Solve & Visualize</Button>
            {jobSchedule.length > 0 && (
              <div className="mt-4">
                <h3 className="font-medium">Scheduled Jobs:</h3>
                <ul>
                  {jobSchedule.sort((a,b)=>a.assigned! - b.assigned!).map((job, idx) => (
                    <li key={idx}>Slot {job.assigned}: <b>{job.id}</b> (Profit: {job.profit})</li>
                  ))}
                </ul>
                <div className="text-sm mt-1">Total Profit: {totalProfit}</div>
              </div>
            )}
          </TabsContent>

          {/* --- Kruskal --- */}
          <TabsContent value="kruskal">
            <h2 className="text-xl font-bold mb-3">Kruskal's MST Algorithm</h2>
            <GraphEditor graph={graph} setGraph={setGraph} />
            <Button onClick={runKruskals} className="mt-4">Run Kruskal</Button>
            
            {mstEdges.length > 0 && (
              <div className="mt-6 bg-white dark:bg-gray-800 rounded-lg p-4 shadow">
                <h3 className="font-medium mb-2">MST Result:</h3>
                
                <div className="border border-gray-200 dark:border-gray-700 rounded-md bg-white dark:bg-gray-900">
                  <svg width="800" height="400" style={{ background: "#fff" }}>
                    {/* Draw all edges first */}
                    {graph.edges.map((e, i) => {
                      const s = graph.vertices.find((v) => v.id === e.source);
                      const t = graph.vertices.find((v) => v.id === e.target);
                      if (!s || !t) return null;
                      
                      const isMSTEdge = mstEdges.some(
                        mstEdge => 
                          (mstEdge.source === e.source && mstEdge.target === e.target) ||
                          (mstEdge.source === e.target && mstEdge.target === e.source)
                      );
                      
                      return (
                        <g key={`e-${i}`}>
                          <line
                            x1={s.x + 18}
                            y1={s.y + 18}
                            x2={t.x + 18}
                            y2={t.y + 18}
                            stroke={isMSTEdge ? "#22c55e" : "#888"}
                            strokeWidth={isMSTEdge ? 5 : 2}
                          />
                          <text 
                            x={(s.x+t.x)/2+18} 
                            y={(s.y+t.y)/2+18-6}
                            fontSize={13}
                            fontWeight={isMSTEdge ? "bold" : "normal"}
                            fill={isMSTEdge ? "#166534" : "#555"}
                          >
                            {e.weight}
                          </text>
                        </g>
                      );
                    })}
                    
                    {/* Node Circles */}
                    {graph.vertices.map((v) => (
                      <g key={v.id}>
                        <circle
                          cx={v.x + 18}
                          cy={v.y + 18}
                          r={18}
                          fill="#0369a1"
                          stroke="#155e75"
                          strokeWidth={2}
                        />
                        <text 
                          x={v.x + 18} 
                          y={v.y + 18 + 5} 
                          fontSize={17} 
                          fill="#fff" 
                          textAnchor="middle"
                          dominantBaseline="middle"
                        >
                          {v.id}
                        </text>
                      </g>
                    ))}
                  </svg>
                </div>
                
                <div className="mt-4 p-3 bg-green-50 dark:bg-green-900/30 rounded border border-green-200 dark:border-green-700">
                  <div className="font-medium text-lg">MST Total Weight: {mstTotalWeight}</div>
                  <div className="mt-2">
                    <h4 className="font-medium">MST Edges:</h4>
                    <ul className="mt-1 list-disc list-inside">
                      {mstEdges.map((e, i) => (
                        <li key={i} className="text-green-700 dark:text-green-300">
                          {e.source} → {e.target} (weight {e.weight})
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </TabsContent>

          {/* --- Prim --- */}
          <TabsContent value="prim">
            <h2 className="text-xl font-bold mb-3">Prim's MST Algorithm</h2>
            <GraphEditor graph={graph} setGraph={setGraph} />
            <Button onClick={runPrims} className="mt-4">Run Prim</Button>
            
            {mstEdges.length > 0 && (
              <div className="mt-6 bg-white dark:bg-gray-800 rounded-lg p-4 shadow">
                <h3 className="font-medium mb-2">MST Result:</h3>
                
                <div className="border border-gray-200 dark:border-gray-700 rounded-md bg-white dark:bg-gray-900">
                  <svg width="800" height="400" style={{ background: "#fff" }}>
                    {/* Draw all edges first */}
                    {graph.edges.map((e, i) => {
                      const s = graph.vertices.find((v) => v.id === e.source);
                      const t = graph.vertices.find((v) => v.id === e.target);
                      if (!s || !t) return null;
                      
                      const isMSTEdge = mstEdges.some(
                        mstEdge => 
                          (mstEdge.source === e.source && mstEdge.target === e.target) ||
                          (mstEdge.source === e.target && mstEdge.target === e.source)
                      );
                      
                      return (
                        <g key={`e-${i}`}>
                          <line
                            x1={s.x + 18}
                            y1={s.y + 18}
                            x2={t.x + 18}
                            y2={t.y + 18}
                            stroke={isMSTEdge ? "#22c55e" : "#888"}
                            strokeWidth={isMSTEdge ? 5 : 2}
                          />
                          <text 
                            x={(s.x+t.x)/2+18} 
                            y={(s.y+t.y)/2+18-6}
                            fontSize={13}
                            fontWeight={isMSTEdge ? "bold" : "normal"}
                            fill={isMSTEdge ? "#166534" : "#555"}
                          >
                            {e.weight}
                          </text>
                        </g>
                      );
                    })}
                    
                    {/* Node Circles */}
                    {graph.vertices.map((v) => (
                      <g key={v.id}>
                        <circle
                          cx={v.x + 18}
                          cy={v.y + 18}
                          r={18}
                          fill="#0369a1"
                          stroke="#155e75"
                          strokeWidth={2}
                        />
                        <text 
                          x={v.x + 18} 
                          y={v.y + 18 + 5} 
                          fontSize={17} 
                          fill="#fff" 
                          textAnchor="middle"
                          dominantBaseline="middle"
                        >
                          {v.id}
                        </text>
                      </g>
                    ))}
                  </svg>
                </div>
                
                <div className="mt-4 p-3 bg-green-50 dark:bg-green-900/30 rounded border border-green-200 dark:border-green-700">
                  <div className="font-medium text-lg">MST Total Weight: {mstTotalWeight}</div>
                  <div className="mt-2">
                    <h4 className="font-medium">MST Edges:</h4>
                    <ul className="mt-1 list-disc list-inside">
                      {mstEdges.map((e, i) => (
                        <li key={i} className="text-green-700 dark:text-green-300">
                          {e.source} → {e.target} (weight {e.weight})
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </TabsContent>

          {/* --- Dijkstra --- */}
          <TabsContent value="dijkstra">
            <h2 className="text-xl font-bold mb-3">Dijkstra's Shortest Path</h2>
            <GraphEditor graph={graph} setGraph={setGraph} />
            <Button onClick={runDijkstra} className="mt-4">Compute Shortest Paths</Button>
            
            {showDijkstra && (
              <DijkstraVisualizer
                steps={dijkstraSteps}
                sourceNode={sourceNode}
                shortestPaths={shortestPaths}
                graph={graph}
              />
            )}
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
