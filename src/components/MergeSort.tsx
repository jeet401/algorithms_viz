
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";

const MergeSort = () => {
  const [array, setArray] = useState<number[]>([]);
  const [animations, setAnimations] = useState<{ array: number[], comparing: number[], sorted: number[] }>({ array: [], comparing: [], sorted: [] });
  const [speed, setSpeed] = useState<number>(500);
  const [arraySize, setArraySize] = useState<number>(10);
  const [isAnimating, setIsAnimating] = useState<boolean>(false);
  const [customArray, setCustomArray] = useState<string>("");
  const [currentStep, setCurrentStep] = useState<number>(-1);
  const [steps, setSteps] = useState<{array: number[], comparing: number[], sorted: number[]}[]>([]);
  const [complexity, setComplexity] = useState<{
    timeComplexityBest: string;
    timeComplexityAvg: string;
    timeComplexityWorst: string;
    spaceComplexity: string;
  }>({
    timeComplexityBest: "O(n log n)",
    timeComplexityAvg: "O(n log n)",
    timeComplexityWorst: "O(n log n)",
    spaceComplexity: "O(n)"
  });

  // Generate a random array
  const generateRandomArray = () => {
    const newArray = Array.from({ length: arraySize }, () => Math.floor(Math.random() * 100) + 1);
    setArray(newArray);
    setCurrentStep(-1);
    setSteps([]);
    setAnimations({ array: [...newArray], comparing: [], sorted: [] });
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
      setAnimations({ array: [...parsedArray], comparing: [], sorted: [] });
    } catch (error) {
      alert("Please enter valid numbers separated by commas");
    }
  };

  // Initialize with random array
  useEffect(() => {
    generateRandomArray();
  }, [arraySize]);

  // Merge sort algorithm implementation with step recording
  const mergeSort = async () => {
    if (isAnimating || array.length <= 1) return;
    setIsAnimating(true);
    setCurrentStep(-1);

    const animationSteps: {array: number[], comparing: number[], sorted: number[]}[] = [];
    const tempArray = [...array];
    const sortedIndices: number[] = [];

    // Function to merge two halves
    const merge = (start: number, mid: number, end: number) => {
      const leftSize = mid - start + 1;
      const rightSize = end - mid;
      
      const left = new Array(leftSize);
      const right = new Array(rightSize);
      
      // Copy data to temporary arrays
      for (let i = 0; i < leftSize; i++)
        left[i] = tempArray[start + i];
      for (let j = 0; j < rightSize; j++)
        right[j] = tempArray[mid + 1 + j];
      
      // Merge the temporary arrays back
      let i = 0, j = 0, k = start;
      
      while (i < leftSize && j < rightSize) {
        // Comparing elements
        animationSteps.push({
          array: [...tempArray],
          comparing: [start + i, mid + 1 + j],
          sorted: [...sortedIndices]
        });
        
        if (left[i] <= right[j]) {
          tempArray[k] = left[i];
          i++;
        } else {
          tempArray[k] = right[j];
          j++;
        }
        k++;
      }
      
      // Copy remaining elements
      while (i < leftSize) {
        animationSteps.push({
          array: [...tempArray],
          comparing: [start + i],
          sorted: [...sortedIndices]
        });
        tempArray[k] = left[i];
        i++;
        k++;
      }
      
      while (j < rightSize) {
        animationSteps.push({
          array: [...tempArray],
          comparing: [mid + 1 + j],
          sorted: [...sortedIndices]
        });
        tempArray[k] = right[j];
        j++;
        k++;
      }
      
      // Mark this section as sorted
      for (let idx = start; idx <= end; idx++) {
        sortedIndices.push(idx);
      }
      
      // Final state after this merge
      animationSteps.push({
        array: [...tempArray],
        comparing: [],
        sorted: [...sortedIndices]
      });
    };

    // Recursive merge sort function
    const mergeSortRecursive = (start: number, end: number) => {
      if (start < end) {
        const mid = Math.floor((start + end) / 2);
        
        // Animation step for dividing
        animationSteps.push({
          array: [...tempArray],
          comparing: [start, end],
          sorted: [...sortedIndices]
        });
        
        // Sort first and second halves
        mergeSortRecursive(start, mid);
        mergeSortRecursive(mid + 1, end);
        
        // Merge the sorted halves
        merge(start, mid, end);
      }
    };

    // Start the sort
    mergeSortRecursive(0, array.length - 1);
    
    // Complete the sort - all indices are sorted
    const allIndices = Array.from({ length: array.length }, (_, i) => i);
    animationSteps.push({
      array: [...tempArray],
      comparing: [],
      sorted: allIndices
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
        <h2 className="text-2xl font-bold">Merge Sort</h2>
        <p className="text-gray-600 dark:text-gray-300">
          Merge Sort is a divide and conquer algorithm that divides the input array into two halves, 
          recursively sorts them, and then merges the sorted halves.
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
            <Button onClick={mergeSort} disabled={isAnimating || array.length <= 1}>
              Sort
            </Button>
          </div>
        </div>
        
        <div className="flex-1">
          {/* Visualization */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border h-72 flex items-end justify-center gap-1">
            {animations.array.map((value, idx) => {
              const heightPercentage = (value / Math.max(...animations.array)) * 100;
              const isComparing = animations.comparing.includes(idx);
              const isSorted = animations.sorted.includes(idx);
              
              const colorClass = isComparing 
                ? "bg-algo-comparing" 
                : isSorted 
                  ? "bg-algo-sorted" 
                  : "bg-secondary";
                  
              return (
                <div
                  key={idx}
                  className={`array-bar ${colorClass} relative`}
                  style={{ 
                    height: `${heightPercentage}%`,
                  }}
                >
                  <div className="text-center absolute bottom-0 left-0 right-0 -mb-6 text-sm font-medium text-gray-800 dark:text-gray-300">
                    {value}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Algorithm complexity */}
          <div className="mt-10 border rounded-lg p-4 bg-gray-50 dark:bg-gray-800">
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
                  Merge Sort has consistent O(n log n) time complexity in all cases because it always divides the array in half and takes linear time to merge.
                </p>
              </div>
              <div>
                <h4 className="font-medium text-gray-800 dark:text-gray-200">Space Complexity</h4>
                <p className="font-mono text-gray-700 dark:text-gray-300">{complexity.spaceComplexity}</p>
                <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                  Merge Sort requires additional space proportional to the size of the input array for the merging process.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MergeSort;
