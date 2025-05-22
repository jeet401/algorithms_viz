
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import KnapsackInput from './KnapsackInput';
import KnapsackTreeNode, { KnapsackNode } from './KnapsackTreeNode';

type Item = { id: string; value: number; weight: number };

// Define the edge type with label included
type Edge = { 
  from: string; 
  to: string; 
  label: string;
};

export default function BranchAndBoundKnapsack() {
  const [items, setItems] = useState<Item[]>([
    { id: '1', value: 10, weight: 2 },
    { id: '2', value: 10, weight: 4 },
    { id: '3', value: 12, weight: 6 },
    { id: '4', value: 18, weight: 9 },
  ]);
  const [capacity, setCapacity] = useState(15);
  const [nodes, setNodes] = useState<KnapsackNode[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);
  const [solution, setSolution] = useState<{ selected: string[], totalValue: number, totalWeight: number }>({ selected: [], totalValue: 0, totalWeight: 0 });
  const [steps, setSteps] = useState<string[]>([]);
  const [computed, setComputed] = useState(false);

  // Calculate the bound for the node
  // For minimization (LCBB), we use negative values as bound
  const calculateBound = (
    level: number,
    weight: number,
    value: number,
    included: boolean[],
    items: Item[],
    capacity: number
  ): number => {
    // If weight exceeds capacity, return infinity (an invalid bound)
    if (weight > capacity) return Infinity;
    
    let bound = -value; // Start with the negative of current value
    let j = level;
    let totalWeight = weight;
    
    // For items not yet considered
    while (j < items.length && totalWeight + items[j].weight <= capacity) {
      bound -= items[j].value;  // Decrease bound (negative so it's like adding value)
      totalWeight += items[j].weight;
      j++;
    }
    
    // If all items don't fit, add fractional value
    if (j < items.length && totalWeight < capacity) {
      const remainingCapacity = capacity - totalWeight;
      const fraction = remainingCapacity / items[j].weight;
      bound -= fraction * items[j].value;  // Add fractional value
    }
    
    return bound;
  };

  const branchAndBound = () => {
    // First sort items by value/weight ratio for better bounds
    const sortedItems = [...items].sort((a, b) => 
      (b.value / b.weight) - (a.value / a.weight)
    );
    
    let nodeCounter = 1;
    const newNodes: KnapsackNode[] = [];
    const newEdges: Edge[] = [];
    const newSteps: string[] = [];
    
    // Queue for traversal
    const queue: KnapsackNode[] = [];
    
    // Create root node
    const root: KnapsackNode = {
      id: '1',
      level: 1, // Start at level 1 as in the example
      weight: 0,
      value: 0,
      bound: calculateBound(0, 0, 0, Array(items.length).fill(false), sortedItems, capacity),
      included: Array(items.length).fill(false),
      pruned: false,
      optimal: false,
    };
    
    newNodes.push(root);
    queue.push(root);
    
    let maxValue = 0;
    let optimalNode: KnapsackNode | null = null;
    
    // Process each node in the queue
    while (queue.length > 0) {
      // Pop the first node
      const currentNode = queue.shift()!;
      
      // Skip if bound is worse than current best solution
      if (currentNode.bound > -maxValue) {
        currentNode.pruned = true;
        newSteps.push(`Node ${currentNode.id} pruned: bound ${currentNode.bound} > current max value ${-maxValue}`);
        continue;
      }
      
      // If we've processed all items
      if (currentNode.level > sortedItems.length) {
        if (currentNode.value > maxValue) {
          maxValue = currentNode.value;
          optimalNode = currentNode;
          newSteps.push(`Found new optimal solution at node ${currentNode.id}, value: ${maxValue}`);
        }
        continue;
      }
      
      const currentLevel = currentNode.level;
      const currentItem = sortedItems[currentLevel - 1];
      
      // Create child that includes current item
      const includeWeight = currentNode.weight + currentItem.weight;
      if (includeWeight <= capacity) {
        nodeCounter++;
        const includeNode: KnapsackNode = {
          id: nodeCounter.toString(),
          level: currentLevel + 1,
          weight: includeWeight,
          value: currentNode.value + currentItem.value,
          bound: calculateBound(
            currentLevel,
            includeWeight,
            currentNode.value + currentItem.value,
            [...currentNode.included.slice(0, currentLevel - 1), true, ...currentNode.included.slice(currentLevel)],
            sortedItems,
            capacity
          ),
          included: [...currentNode.included.slice(0, currentLevel - 1), true, ...currentNode.included.slice(currentLevel)],
          pruned: false,
          optimal: false,
        };
        
        newNodes.push(includeNode);
        newEdges.push({ from: currentNode.id, to: includeNode.id, label: '1' });
        queue.push(includeNode);
        
        if (includeNode.value > maxValue) {
          maxValue = includeNode.value;
          optimalNode = includeNode;
        }
      }
      
      // Create child that excludes current item
      nodeCounter++;
      const excludeNode: KnapsackNode = {
        id: nodeCounter.toString(),
        level: currentLevel + 1,
        weight: currentNode.weight,
        value: currentNode.value,
        bound: calculateBound(
          currentLevel,
          currentNode.weight,
          currentNode.value,
          [...currentNode.included.slice(0, currentLevel - 1), false, ...currentNode.included.slice(currentLevel)],
          sortedItems,
          capacity
        ),
        included: [...currentNode.included.slice(0, currentLevel - 1), false, ...currentNode.included.slice(currentLevel)],
        pruned: false,
        optimal: false,
      };
      
      newNodes.push(excludeNode);
      newEdges.push({ from: currentNode.id, to: excludeNode.id, label: '0' });
      
      // Add to queue only if it has potential
      if (excludeNode.bound < -maxValue) {
        queue.push(excludeNode);
      } else {
        excludeNode.pruned = true;
        newSteps.push(`Node ${excludeNode.id} pruned: bound ${excludeNode.bound} > current max value ${-maxValue}`);
      }
    }
    
    // Mark optimal solution nodes
    if (optimalNode) {
      // Trace back from optimal node to root
      let currentNode = optimalNode;
      currentNode.optimal = true;
      
      while (true) {
        const parentEdge = newEdges.find(e => e.to === currentNode.id);
        if (!parentEdge) break;
        
        const parentNode = newNodes.find(n => n.id === parentEdge.from);
        if (!parentNode) break;
        
        parentNode.optimal = true;
        currentNode = parentNode;
      }
      
      // Collect selected items
      const selectedItems: string[] = [];
      let totalWeight = 0;
      
      // The included array in optimalNode contains our solution
      for (let i = 0; i < optimalNode.level - 1; i++) {
        if (optimalNode.included[i]) {
          selectedItems.push(sortedItems[i].id);
          totalWeight += sortedItems[i].weight;
        }
      }
      
      setSolution({
        selected: selectedItems,
        totalValue: optimalNode.value,
        totalWeight: totalWeight
      });
    }
    
    setNodes(newNodes);
    setEdges(newEdges);
    setSteps(newSteps);
    setComputed(true);
  };

  // Create an example problem similar to the one in the image
  const createExampleProblem = () => {
    setItems([
      { id: '1', value: 10, weight: 2 },
      { id: '2', value: 10, weight: 4 },
      { id: '3', value: 12, weight: 6 },
      { id: '4', value: 18, weight: 9 },
    ]);
    setCapacity(15);
  };

  return (
    <div className="flex flex-col gap-6">
      <h2 className="text-2xl font-bold">0/1 Knapsack Problem - Least Cost Branch and Bound</h2>
      
      <div className="mb-4">
        <Button 
          variant="outline" 
          onClick={createExampleProblem} 
          className="mb-4"
        >
          Load Example Problem (n=4, m=15)
        </Button>
        <KnapsackInput 
          items={items}
          setItems={setItems}
          capacity={capacity}
          setCapacity={setCapacity}
        />
      </div>
      
      <Button onClick={branchAndBound} disabled={items.length === 0}>Solve using Least Cost Branch and Bound</Button>
      
      {computed && (
        <div className="flex flex-col gap-6 mt-4">
          <div className="p-6 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-md">
            <h3 className="text-2xl font-bold text-green-800 dark:text-green-200 mb-2">Optimal Solution</h3>
            <p className="text-green-700 dark:text-green-300 text-xl">
              Selected items: <span className="font-semibold">{solution.selected.join(', ')}</span>
            </p>
            <p className="text-green-700 dark:text-green-300 text-xl">
              Total value: <span className="font-semibold">{solution.totalValue}</span>
            </p>
            <p className="text-green-700 dark:text-green-300 text-xl">
              Total weight: <span className="font-semibold">{solution.totalWeight}</span> (Capacity: {capacity})
            </p>
          </div>
          
          <div>
            <h3 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-gray-100">Solution Tree</h3>
            <div className="border border-gray-300 dark:border-gray-700 rounded-md overflow-auto bg-white dark:bg-gray-800 p-4" style={{ maxHeight: "800px", minHeight: "600px" }}>
              <svg width="1200" height="800">
                {/* Draw edges first so they appear behind nodes */}
                {edges.map((edge, i) => {
                  const fromNode = nodes.find(n => n.id === edge.from);
                  const toNode = nodes.find(n => n.id === edge.to);
                  if (!fromNode || !toNode) return null;
                  
                  // Calculate positions based on a hierarchical layout with proper level spacing
                  const levelSpacing = 160; // Increased vertical spacing
                  const nodesPerLevel: { [key: number]: number } = {};
                  
                  // Count nodes per level
                  nodes.forEach(node => {
                    const level = parseInt(node.level.toString());
                    nodesPerLevel[level] = (nodesPerLevel[level] || 0) + 1;
                  });
                  
                  // Calculate Y based on level (vertical position)
                  const fromY = 100 + (fromNode.level - 1) * levelSpacing;
                  const toY = 100 + (toNode.level - 1) * levelSpacing;
                  
                  // Find the position of the node within its level
                  const fromLevelNodes = nodes.filter(n => n.level === fromNode.level);
                  const toLevelNodes = nodes.filter(n => n.level === toNode.level);
                  
                  const fromIndex = fromLevelNodes.findIndex(n => n.id === fromNode.id);
                  const toIndex = toLevelNodes.findIndex(n => n.id === toNode.id);
                  
                  // Calculate X based on position within level (horizontal position)
                  const levelWidth = 1000;
                  const fromSegmentWidth = levelWidth / (nodesPerLevel[fromNode.level] || 1);
                  const toSegmentWidth = levelWidth / (nodesPerLevel[toNode.level] || 1);
                  
                  const fromX = 150 + fromIndex * fromSegmentWidth;
                  const toX = 150 + toIndex * toSegmentWidth;
                  
                  // Line style
                  const strokeColor = toNode.optimal && fromNode.optimal ? '#008800' : '#333333';
                  const strokeWidth = toNode.optimal && fromNode.optimal ? 3 : 1.5;
                  
                  return (
                    <React.Fragment key={`edge-${i}`}>
                      <line
                        x1={fromX}
                        y1={fromY}
                        x2={toX}
                        y2={toY}
                        stroke={strokeColor}
                        strokeWidth={strokeWidth}
                      />
                    </React.Fragment>
                  );
                })}
                
                {/* Draw nodes after edges */}
                {nodes.map((node) => {
                  // Calculate node positions using the same logic as for edges
                  const levelSpacing = 160; // Use same spacing as edges
                  const nodesPerLevel: { [key: number]: number } = {};
                  
                  // Count nodes per level
                  nodes.forEach(n => {
                    const level = parseInt(n.level.toString());
                    nodesPerLevel[level] = (nodesPerLevel[level] || 0) + 1;
                  });
                  
                  // Find this node's position within its level
                  const levelNodes = nodes.filter(n => n.level === node.level);
                  const nodeIndex = levelNodes.findIndex(n => n.id === node.id);
                  
                  // Calculate position
                  const levelWidth = 1000;
                  const segmentWidth = levelWidth / (nodesPerLevel[node.level] || 1);
                  const x = 150 + nodeIndex * segmentWidth;
                  const y = 100 + (node.level - 1) * levelSpacing;
                  
                  // Find edge coming to this node for edge label
                  const incomingEdge = edges.find(e => e.to === node.id);
                  const edgeLabel = incomingEdge?.label;
                  
                  return (
                    <KnapsackTreeNode
                      key={`node-${node.id}`}
                      node={node}
                      x={x}
                      y={y}
                      r={32} // Increased node size
                      edgeLabel={edgeLabel}
                      isLCBB={true}
                    />
                  );
                })}
              </svg>
            </div>
            
            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">Node Legend</h3>
                <div className="border border-gray-300 dark:border-gray-700 rounded-md p-6 bg-white dark:bg-gray-800">
                  <div className="flex items-center mb-4">
                    <div className="w-10 h-10 rounded-full bg-[#ffcc66] mr-3 border border-[#333333]"></div>
                    <span className="text-gray-900 dark:text-gray-100 text-xl">Regular node - being considered</span>
                  </div>
                  <div className="flex items-center mb-4">
                    <div className="w-10 h-10 rounded-full bg-[#ffcccc] mr-3 border border-[#cc0000]"></div>
                    <span className="text-gray-900 dark:text-gray-100 text-xl">Pruned node (✗) - bound exceeds current best</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full bg-[#ffffcc] mr-3 border-2 border-[#008800]"></div>
                    <span className="text-gray-900 dark:text-gray-100 text-xl">Optimal node - part of final solution</span>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">Edge Legend</h3>
                <div className="border border-gray-300 dark:border-gray-700 rounded-md p-6 bg-white dark:bg-gray-800">
                  <div className="flex items-center mb-4">
                    <span className="inline-block w-14 h-0 border-t-2 border-t-[#333333] mr-3"></span>
                    <span className="text-gray-900 dark:text-gray-100 text-xl">Regular edge connection</span>
                  </div>
                  <div className="flex items-center mb-4">
                    <span className="inline-block w-14 h-0 border-t-3 border-t-[#008800] mr-3"></span>
                    <span className="text-gray-900 dark:text-gray-100 text-xl">Optimal path edge</span>
                  </div>
                  <div className="flex items-center">
                    <div className="flex items-center mr-3">
                      <span className="text-[#cc0000] font-bold text-xl mr-1">x₁=1</span>
                      <span className="text-[#333333] font-bold text-xl mx-2">/</span>
                      <span className="text-[#333333] font-bold text-xl">x₁=0</span>
                    </div>
                    <span className="text-gray-900 dark:text-gray-100 text-xl">Item included/excluded</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-6">
              <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">Node Information</h3>
              <div className="border border-gray-300 dark:border-gray-700 rounded-md p-6 bg-white dark:bg-gray-800">
                <p className="text-gray-900 dark:text-gray-100 text-xl mb-4">Each node displays:</p>
                <ul className="list-disc pl-8 text-gray-900 dark:text-gray-100 text-xl space-y-2">
                  <li>Node ID in the circle</li>
                  <li>ĉ = Cost estimate (lower bound)</li>
                  <li>u = Upper bound value</li>
                  <li>Red edge labels (x₁=1) indicate item is included</li>
                  <li>Black edge labels (x₁=0) indicate item is excluded</li>
                </ul>
              </div>
            </div>
            
            <div className="mt-6">
              <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">Algorithm Steps</h3>
              <div className="border border-gray-300 dark:border-gray-700 rounded-md p-6 max-h-80 overflow-y-auto bg-white dark:bg-gray-800">
                <ol className="list-decimal pl-8 text-gray-900 dark:text-gray-100 text-xl space-y-2">
                  {steps.map((step, i) => (
                    <li key={i}>{step}</li>
                  ))}
                </ol>
              </div>
            </div>
            
            <div className="mt-6">
              <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">Problem Details</h3>
              <div className="border border-gray-300 dark:border-gray-700 rounded-md p-6 bg-white dark:bg-gray-800">
                <p className="text-gray-900 dark:text-gray-100 text-xl mb-4">
                  n = {items.length}; m = {capacity};
                </p>
                <p className="text-gray-900 dark:text-gray-100 text-xl mb-4">
                  Values: ({items.map(item => item.value).join(', ')})
                </p>
                <p className="text-gray-900 dark:text-gray-100 text-xl mb-4">
                  Weights: ({items.map(item => item.weight).join(', ')})
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
