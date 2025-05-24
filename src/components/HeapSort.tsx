import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const HeapSort = () => {
  const [array, setArray] = useState<number[]>([]);
  const [animations, setAnimations] = useState<{ array: number[], comparing: number[], active: number[], sorted: number[] }>({ array: [], comparing: [], active: [], sorted: [] });
  const [steps, setSteps] = useState<{array: number[], comparing: number[], active: number[], sorted: number[], description: string}[]>([]);
  const [currentStep, setCurrentStep] = useState<number>(-1);
  const [speed, setSpeed] = useState<number>(500);
  const [arraySize, setArraySize] = useState<number>(10);
  const [isAnimating, setIsAnimating] = useState<boolean>(false);
  const [customArray, setCustomArray] = useState<string>("");
  const [complexity, setComplexity] = useState<{
    timeComplexityBest: string;
    timeComplexityAvg: string;
    timeComplexityWorst: string;
    spaceComplexity: string;
  }>({
    timeComplexityBest: "O(n log n)",
    timeComplexityAvg: "O(n log n)",
    timeComplexityWorst: "O(n log n)",
    spaceComplexity: "O(1)"
  });

  // Generate a random array
  const generateRandomArray = () => {
    const newArray = Array.from({ length: arraySize }, () => Math.floor(Math.random() * 100) + 1);
    setArray(newArray);
    setCurrentStep(-1);
    setSteps([]);
    setAnimations({ array: [...newArray], comparing: [], active: [], sorted: [] });
  };

  // Parse custom array input
  const handleCustomArraySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const parsedArray = customArray.split(',').map(item => {
        const num = parseInt(item.trim());
        if (isNaN(num)) throw new Error("Not a number");
        return num;
      });
      
      if (parsedArray.length === 0) throw new Error("Array is empty");
      
      setArray(parsedArray);
      setArraySize(parsedArray.length);
      setCurrentStep(-1);
      setSteps([]);
      setAnimations({ array: [...parsedArray], comparing: [], active: [], sorted: [] });
    } catch (error) {
      alert("Please enter valid numbers separated by commas");
    }
  };

  // Initialize with random array
  useEffect(() => {
    generateRandomArray();
  }, [arraySize]);

  // Heapify function - adjusts a subtree rooted at node i
  const heapify = (arr: number[], n: number, i: number, animationSteps: any[], sortedIndices: number[] = []): number[] => {
    const tempArr = [...arr];
    
    let largest = i;
    const left = 2 * i + 1;
    const right = 2 * i + 2;
    
    // Compare with left child
    if (left < n) {
      animationSteps.push({
        array: [...tempArr],
        comparing: [largest, left],
        active: [i],
        sorted: [...sortedIndices],
        description: `Comparing parent at index ${largest} (${tempArr[largest]}) with left child at index ${left} (${tempArr[left]})`
      });
      
      if (tempArr[left] > tempArr[largest]) {
        largest = left;
      }
    }
    
    // Compare with right child
    if (right < n) {
      animationSteps.push({
        array: [...tempArr],
        comparing: [largest, right],
        active: [i],
        sorted: [...sortedIndices],
        description: `Comparing parent at index ${largest} (${tempArr[largest]}) with right child at index ${right} (${tempArr[right]})`
      });
      
      if (tempArr[right] > tempArr[largest]) {
        largest = right;
      }
    }
    
    // If largest is not the root
    if (largest !== i) {
      animationSteps.push({
        array: [...tempArr],
        comparing: [i, largest],
        active: [],
        sorted: [...sortedIndices],
        description: `Swap: ${tempArr[i]} with ${tempArr[largest]}`
      });
      
      // Swap
      [tempArr[i], tempArr[largest]] = [tempArr[largest], tempArr[i]];
      
      animationSteps.push({
        array: [...tempArr],
        comparing: [],
        active: [i, largest],
        sorted: [...sortedIndices],
        description: `After swap: ${tempArr[i]} and ${tempArr[largest]}`
      });
      
      // Recursively heapify the affected sub-tree
      heapify(tempArr, n, largest, animationSteps, sortedIndices);
    }
    
    return tempArr;
  };

  // Build max heap
  const buildMaxHeap = () => {
    if (isAnimating || array.length <= 1) return;
    setIsAnimating(true);
    setCurrentStep(-1);
    
    const animationSteps: any[] = [];
    let tempArray = [...array];
    
    animationSteps.push({
      array: [...tempArray],
      comparing: [],
      active: [],
      sorted: [],
      description: "Starting to build max heap"
    });
    
    // Build max heap (rearrange array)
    for (let i = Math.floor(tempArray.length / 2) - 1; i >= 0; i--) {
      animationSteps.push({
        array: [...tempArray],
        comparing: [],
        active: [i],
        sorted: [],
        description: `Heapify subtree rooted at index ${i}`
      });
      
      tempArray = heapify(tempArray, tempArray.length, i, animationSteps);
    }
    
    animationSteps.push({
      array: [...tempArray],
      comparing: [],
      active: [],
      sorted: [],
      description: "Max heap built successfully"
    });
    
    setSteps(animationSteps);
    setCurrentStep(0);
    setArray(tempArray);
  };

  // Heap sort
  const heapSort = () => {
    if (isAnimating || array.length <= 1) return;
    setIsAnimating(true);
    setCurrentStep(-1);
    
    const animationSteps: any[] = [];
    let tempArray = [...array];
    const sortedIndices: number[] = [];
    
    // First, build the max heap
    animationSteps.push({
      array: [...tempArray],
      comparing: [],
      active: [],
      sorted: sortedIndices,
      description: "Starting to build max heap"
    });
    
    for (let i = Math.floor(tempArray.length / 2) - 1; i >= 0; i--) {
      animationSteps.push({
        array: [...tempArray],
        comparing: [],
        active: [i],
        sorted: sortedIndices,
        description: `Heapify subtree rooted at index ${i}`
      });
      
      tempArray = heapify(tempArray, tempArray.length, i, animationSteps, sortedIndices);
    }
    
    animationSteps.push({
      array: [...tempArray],
      comparing: [],
      active: [],
      sorted: sortedIndices,
      description: "Max heap built successfully. Starting extraction phase."
    });
    
    // Extract elements one by one from the heap
    for (let i = tempArray.length - 1; i > 0; i--) {
      // Move current root to end
      animationSteps.push({
        array: [...tempArray],
        comparing: [0, i],
        active: [],
        sorted: [...sortedIndices],
        description: `Move root (largest element ${tempArray[0]}) to the end`
      });
      
      // Swap
      [tempArray[0], tempArray[i]] = [tempArray[i], tempArray[0]];
      
      animationSteps.push({
        array: [...tempArray],
        comparing: [],
        active: [0, i],
        sorted: [...sortedIndices],
        description: `After swap: ${tempArray[0]} and ${tempArray[i]}`
      });
      
      // Add the latest index to sorted
      sortedIndices.push(i);
      
      animationSteps.push({
        array: [...tempArray],
        comparing: [],
        active: [],
        sorted: [...sortedIndices],
        description: `Element ${tempArray[i]} is now in its final sorted position`
      });
      
      // Call max heapify on the reduced heap
      tempArray = heapify(tempArray, i, 0, animationSteps, sortedIndices);
    }
    
    // Add the last element to sorted
    sortedIndices.push(0);
    
    animationSteps.push({
      array: [...tempArray],
      comparing: [],
      active: [],
      sorted: sortedIndices,
      description: "Heap sort completed"
    });
    
    setSteps(animationSteps);
    setCurrentStep(0);
  };

  // Animation effect
  useEffect(() => {
    if (currentStep >= 0 && currentStep < steps.length) {
      const timer = setTimeout(() => {
        setAnimations({
          array: steps[currentStep].array,
          comparing: steps[currentStep].comparing,
          active: steps[currentStep].active,
          sorted: steps[currentStep].sorted
        });
        setCurrentStep(prev => prev + 1);
      }, 1500 - speed);

      return () => clearTimeout(timer);
    } else if (currentStep >= steps.length) {
      setIsAnimating(false);
    }
  }, [currentStep, steps, speed]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
      <h2 className="text-2xl font-bold text-gray-800">Heap Sort</h2>
        <p className="text-gray-700 dark:text-gray-300">
          Heap Sort is a comparison-based sorting algorithm that uses a binary heap data structure. It builds a max heap and then extracts elements to get a sorted array.
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        <div className="flex flex-col gap-4 w-full md:w-1/3">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Array Size</label>
            <Slider
              value={[arraySize]}
              onValueChange={(value) => setArraySize(value[0])}
              disabled={isAnimating}
              min={5}
              max={20}
              step={1}
            />
            <div className="text-xs mt-1 text-gray-600 dark:text-gray-400">Size: {arraySize}</div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Animation Speed</label>
            <Slider
              value={[speed]}
              onValueChange={(value) => setSpeed(value[0])}
              min={100}
              max={1400}
              step={100}
            />
            <div className="text-xs mt-1 text-gray-600 dark:text-gray-400">Speed: {speed}</div>
          </div>

          <form onSubmit={handleCustomArraySubmit} className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Custom Array (comma separated)</label>
            <div className="flex gap-2">
              <Input
                value={customArray}
                onChange={(e) => setCustomArray(e.target.value)}
                placeholder="e.g., 64, 34, 25, 12, 22, 11, 90"
                disabled={isAnimating}
              />
              <Button type="submit" disabled={isAnimating} size="sm">Set</Button>
            </div>
          </form>
          
          <Tabs defaultValue="full-sort" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="full-sort">Full Sort</TabsTrigger>
              <TabsTrigger value="build-heap">Build Heap</TabsTrigger>
            </TabsList>
            <TabsContent value="full-sort">
              <Button 
                onClick={heapSort} 
                disabled={isAnimating || array.length <= 1} 
                className="w-full"
              >
                Run Heap Sort
              </Button>
            </TabsContent>
            <TabsContent value="build-heap">
              <Button 
                onClick={buildMaxHeap} 
                disabled={isAnimating || array.length <= 1} 
                className="w-full"
              >
                Build Max Heap
              </Button>
            </TabsContent>
          </Tabs>
          
          <Button onClick={generateRandomArray} disabled={isAnimating} variant="outline">
            Random Array
          </Button>
          
          {currentStep > 0 && currentStep <= steps.length && (
            <div className="p-3 bg-gray-100 dark:bg-gray-700 rounded-md text-sm text-gray-800 dark:text-gray-200">
              <p className="font-medium">Step {currentStep} of {steps.length}:</p>
              <p>{steps[currentStep-1].description}</p>
            </div>
          )}
        </div>
        
        <div className="flex-1">
          {/* Visualization */}
         <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-sm border h-96 flex items-end justify-center gap-2 relative">
            {animations.array.map((value, idx) => {
              const heightPercentage = (value / Math.max(...animations.array)) * 100;
              const isComparing = animations.comparing.includes(idx);
              const isActive = animations.active.includes(idx);
              const isSorted = animations.sorted.includes(idx);
              
              let colorClass = "bg-secondary";
              if (isActive) colorClass = "bg-algo-active";
              else if (isComparing) colorClass = "bg-algo-comparing";
              else if (isSorted) colorClass = "bg-algo-sorted";
                  
              return (
                <div
                  key={idx}
                  className={`array-bar ${colorClass} relative border border-gray-300`}
                  style={{ 
                    height: `${heightPercentage}%`,
                    width: `${Math.max(24, 100 / Math.max(20, animations.array.length))}px`,
                    minWidth: "24px"
                  }}
                >
                  <div className="text-center absolute bottom-0 left-0 right-0 -mb-8 text-sm font-medium text-gray-800">
                    {value}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Heap visualization */}
         <div className="mt-12 p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm border overflow-hidden">
            <h3 className="text-lg font-medium mb-3 text-gray-800 dark:text-gray-200">Heap Visualization</h3>
            <div className="relative h-80 overflow-auto">
              <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid meet" className="overflow-visible">
                <g transform="translate(0,10) scale(1)">
                {animations.array.map((value, idx) => {
                  const level = Math.floor(Math.log2(idx + 1));
                  const position = idx + 1 - Math.pow(2, level);
                  const maxNodesInLevel = Math.pow(2, level);
                  const levelWidth = Math.min(90, maxNodesInLevel * 15); // Cap width
                  const xRatio = position / maxNodesInLevel;
                  
                  // Calculate x position based on level and position
                  const x = 50 + (xRatio - 0.5) * levelWidth;
                  // Calculate y position based on level
                  const y = 10 + level * 15;
                  
                  // Draw lines to children
                  const leftChildIdx = 2 * idx + 1;
                  const rightChildIdx = 2 * idx + 2;
                  
                  const isComparing = animations.comparing.includes(idx);
                  const isActive = animations.active.includes(idx);
                  const isSorted = animations.sorted.includes(idx);
                  
                  let nodeColor = "#e5e7eb"; // default
                  if (isActive) nodeColor = "#fde68a"; // active
                  else if (isComparing) nodeColor = "#fecaca"; // comparing
                  else if (isSorted) nodeColor = "#bbf7d0"; // sorted
                  
                  return (
                    <g key={idx}>
                      {leftChildIdx < animations.array.length && (
                        <line
                          x1={`${x}`}
                          y1={y + 3}
                          x2={`${50 + ((position * 2) / (maxNodesInLevel * 2) - 0.5) * Math.min(95, maxNodesInLevel * 2 * 15)}`}
                          y2={10 + (level + 1) * 15}
                          stroke="#666"
                          strokeWidth="0.5"
                        />
                      )}
                      {rightChildIdx < animations.array.length && (
                        <line
                          x1={`${x}`}
                          y1={y + 3}
                          x2={`${50 + ((position * 2 + 1) / (maxNodesInLevel * 2) - 0.5) * Math.min(95, maxNodesInLevel * 2 * 15)}`}
                          y2={10 + (level + 1) * 15}
                          stroke="#666"
                          strokeWidth="0.5"
                        />
                      )}
                      <circle
                        cx={`${x}`}
                        cy={y}
                        r="3.5"
                        fill={nodeColor}
                        stroke="#666"
                        strokeWidth="0.5"
                      />
                      <text
                        x={`${x}`}
                        y={y}
                        textAnchor="middle"
                        dominantBaseline="middle"
                        fontSize="3"
                        fill="#333"
                        fontWeight="bold"
                      >
                        {value}
                      </text>
                    </g>
                  );
                })}
                </g>
              </svg>
            </div>
          </div>

          {/* Algorithm complexity */}
          <div className="mt-6 border rounded-lg p-4 bg-gray-50 dark:bg-gray-800">
            <h3 className="text-lg font-semibold mb-2 text-gray-800 dark:text-gray-200">Algorithm Complexity</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-medium text-gray-800 dark:text-gray-200">Time Complexity</h4>
                <ul className="list-disc pl-5 space-y-1 text-gray-700 dark:text-gray-300">
                  <li>Best Case: <span className="font-mono">{complexity.timeComplexityBest}</span></li>
                  <li>Average Case: <span className="font-mono">{complexity.timeComplexityAvg}</span></li>
                  <li>Worst Case: <span className="font-mono">{complexity.timeComplexityWorst}</span></li>
                </ul>
                <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                  Building the heap takes O(n) time, and extracting each element takes O(log n) time. Thus, the overall time complexity is O(n log n) for all cases.
                </p>
              </div>
              <div>
                <h4 className="font-medium text-gray-800 dark:text-gray-200">Space Complexity</h4>
                <p className="font-mono text-gray-700 dark:text-gray-300">{complexity.spaceComplexity}</p>
                <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                  Heap Sort is an in-place algorithm, requiring only a constant amount of additional memory regardless of input size.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeapSort;
