
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";

const QuickSort = () => {
  const [array, setArray] = useState<number[]>([]);
  const [animations, setAnimations] = useState<{ array: number[], comparing: number[], sorted: number[], pivot: number }>({ array: [], comparing: [], sorted: [], pivot: -1 });
  const [speed, setSpeed] = useState<number>(500);
  const [arraySize, setArraySize] = useState<number>(10);
  const [isAnimating, setIsAnimating] = useState<boolean>(false);
  const [customArray, setCustomArray] = useState<string>("");
  const [currentStep, setCurrentStep] = useState<number>(-1);
  const [steps, setSteps] = useState<{array: number[], comparing: number[], sorted: number[], pivot: number}[]>([]);
  const [complexity, setComplexity] = useState<{
    timeComplexityBest: string;
    timeComplexityAvg: string;
    timeComplexityWorst: string;
    spaceComplexity: string;
  }>({
    timeComplexityBest: "O(n log n)",
    timeComplexityAvg: "O(n log n)",
    timeComplexityWorst: "O(n²)",
    spaceComplexity: "O(log n)"
  });

  // Generate a random array
  const generateRandomArray = () => {
    const newArray = Array.from({ length: arraySize }, () => Math.floor(Math.random() * 100) + 1);
    setArray(newArray);
    setCurrentStep(-1);
    setSteps([]);
    setAnimations({ array: [...newArray], comparing: [], sorted: [], pivot: -1 });
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
      setAnimations({ array: [...parsedArray], comparing: [], sorted: [], pivot: -1 });
    } catch (error) {
      alert("Please enter valid numbers separated by commas");
    }
  };

  // Initialize with random array
  useEffect(() => {
    generateRandomArray();
  }, [arraySize]);

  // Quick sort algorithm implementation with step recording
  const quickSort = async () => {
    if (isAnimating || array.length <= 1) return;
    setIsAnimating(true);
    setCurrentStep(-1);

    const animationSteps: {array: number[], comparing: number[], sorted: number[], pivot: number}[] = [];
    const tempArray = [...array];
    const sortedIndices: number[] = [];

    // Partition function
    const partition = (low: number, high: number): number => {
      const pivot = tempArray[high]; // Using last element as pivot
      animationSteps.push({
        array: [...tempArray],
        comparing: [],
        sorted: [...sortedIndices],
        pivot: high
      });
      
      let i = low - 1;
      
      for (let j = low; j < high; j++) {
        // Compare current element with pivot
        animationSteps.push({
          array: [...tempArray],
          comparing: [j, high],
          sorted: [...sortedIndices],
          pivot: high
        });
        
        if (tempArray[j] <= pivot) {
          i++;
          
          // Swap elements
          [tempArray[i], tempArray[j]] = [tempArray[j], tempArray[i]];
          
          // Record the swap
          animationSteps.push({
            array: [...tempArray],
            comparing: [i, j],
            sorted: [...sortedIndices],
            pivot: high
          });
        }
      }
      
      // Swap pivot with element at i+1
      [tempArray[i + 1], tempArray[high]] = [tempArray[high], tempArray[i + 1]];
      
      // Record the pivot swap
      animationSteps.push({
        array: [...tempArray],
        comparing: [i + 1, high],
        sorted: [...sortedIndices],
        pivot: i + 1  // New pivot position
      });
      
      // Mark pivot as sorted
      sortedIndices.push(i + 1);
      
      return i + 1;
    };
    
    // Recursive quick sort function
    const quickSortRecursive = (low: number, high: number) => {
      if (low < high) {
        // Partition and get pivot index
        const pivotIndex = partition(low, high);
        
        // Mark elements in their final sorted positions
        if (low === 0 && high === tempArray.length - 1) {
          sortedIndices.push(pivotIndex);
        }
        
        // Sort elements before and after partition
        quickSortRecursive(low, pivotIndex - 1);
        quickSortRecursive(pivotIndex + 1, high);
        
        // After each recursive call, mark sorted portions
        if (high - low <= 1) {
          for (let i = low; i <= high; i++) {
            if (!sortedIndices.includes(i)) {
              sortedIndices.push(i);
            }
          }
          
          animationSteps.push({
            array: [...tempArray],
            comparing: [],
            sorted: [...sortedIndices],
            pivot: -1
          });
        }
      } else if (low === high && !sortedIndices.includes(low)) {
        // Single element is always sorted
        sortedIndices.push(low);
        animationSteps.push({
          array: [...tempArray],
          comparing: [],
          sorted: [...sortedIndices],
          pivot: -1
        });
      }
    };

    // Start the sort
    quickSortRecursive(0, array.length - 1);
    
    // Add final state - all sorted
    const allIndices = Array.from({ length: array.length }, (_, i) => i);
    animationSteps.push({
      array: [...tempArray],
      comparing: [],
      sorted: allIndices,
      pivot: -1
    });
    
    setSteps(animationSteps);
    setCurrentStep(0);
  };

  // Animation effect
  useEffect(() => {
    if (currentStep >= 0 && currentStep < steps.length) {
      const timer = setTimeout(() => {
        setAnimations(steps[currentStep]);
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
       <h2 className="text-2xl font-bold text-gray-800">Quick Sort</h2>
        <p className="text-gray-600 dark:text-gray-300">
          Quick Sort is a divide-and-conquer algorithm that selects a pivot element and partitions the array around it. Elements smaller than the pivot go to the left, larger to the right.
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
          
          <div className="flex gap-2">
            <Button onClick={generateRandomArray} disabled={isAnimating} variant="outline">
              Random Array
            </Button>
            <Button onClick={quickSort} disabled={isAnimating || array.length <= 1}>
              Sort
            </Button>
          </div>
        </div>
        
        <div className="flex-1">
          {/* Visualization */}
         <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-sm border h-96 flex items-end justify-center gap-2 relative">
            {animations.array.map((value, idx) => {
              const heightPercentage = (value / Math.max(...animations.array)) * 100;
              const isComparing = animations.comparing.includes(idx);
              const isSorted = animations.sorted.includes(idx);
              const isPivot = animations.pivot === idx;
              
              let colorClass = "bg-secondary";
              if (isPivot) colorClass = "bg-algo-pivot";
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

          {/* Algorithm complexity */}
           <div className="mt-12 border rounded-lg p-4 bg-gray-50 dark:bg-gray-800">
            <h3 className="text-lg font-semibold mb-2 text-gray-800 dark:text-gray-200">Algorithm Complexity</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-medium text-gray-800 dark:text-gray-200">Time Complexity</h4>
                <ul className="list-disc pl-5 space-y-1 text-gray-700 dark:text-gray-300">
                  <li>Best Case: <span className="font-mono">{complexity.timeComplexityBest}</span></li>
                  <li>Average Case: <span className="font-mono">{complexity.timeComplexityAvg}</span></li>
                  <li>Worst Case: <span className="font-mono">{complexity.timeComplexityWorst}</span></li>
                </ul>
                <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                  Quick Sort performs well on average but can degrade to O(n²) when the pivot selection is poor, such as with already sorted arrays.
                </p>
              </div>
              <div>
                <h4 className="font-medium text-gray-800 dark:text-gray-200">Space Complexity</h4>
                <p className="font-mono text-gray-700 dark:text-gray-300">{complexity.spaceComplexity}</p>
                <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                  Quick Sort uses O(log n) space for the recursive call stack in the best and average cases, but can use O(n) space in the worst case.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuickSort;
