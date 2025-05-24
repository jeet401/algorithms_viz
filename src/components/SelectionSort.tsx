
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";

const SelectionSort = () => {
  const [array, setArray] = useState<number[]>([]);
  const [animations, setAnimations] = useState<{ array: number[], comparing: number[], minIndex: number, sorted: number[] }>({ array: [], comparing: [], minIndex: -1, sorted: [] });
  const [speed, setSpeed] = useState<number>(500);
  const [arraySize, setArraySize] = useState<number>(10);
  const [isAnimating, setIsAnimating] = useState<boolean>(false);
  const [customArray, setCustomArray] = useState<string>("");
  const [currentStep, setCurrentStep] = useState<number>(-1);
  const [steps, setSteps] = useState<{array: number[], comparing: number[], minIndex: number, sorted: number[]}[]>([]);
  const [complexity, setComplexity] = useState<{
    timeComplexityBest: string;
    timeComplexityAvg: string;
    timeComplexityWorst: string;
    spaceComplexity: string;
  }>({
    timeComplexityBest: "O(n²)",
    timeComplexityAvg: "O(n²)",
    timeComplexityWorst: "O(n²)",
    spaceComplexity: "O(1)"
  });

  // Generate a random array
  const generateRandomArray = () => {
    const newArray = Array.from({ length: arraySize }, () => Math.floor(Math.random() * 100) + 1);
    setArray(newArray);
    setCurrentStep(-1);
    setSteps([]);
    setAnimations({ array: [...newArray], comparing: [], minIndex: -1, sorted: [] });
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
      setAnimations({ array: [...parsedArray], comparing: [], minIndex: -1, sorted: [] });
    } catch (error) {
      alert("Please enter valid numbers separated by commas");
    }
  };

  // Initialize with random array
  useEffect(() => {
    generateRandomArray();
  }, [arraySize]);

  // Selection sort algorithm implementation with step recording
  const selectionSort = async () => {
    if (isAnimating || array.length <= 1) return;
    setIsAnimating(true);
    setCurrentStep(-1);

    const animationSteps: {array: number[], comparing: number[], minIndex: number, sorted: number[]}[] = [];
    const tempArray = [...array];
    let sortedIndices: number[] = [];
    
    // Initial state
    animationSteps.push({
      array: [...tempArray],
      comparing: [],
      minIndex: -1,
      sorted: [...sortedIndices]
    });

    for (let i = 0; i < tempArray.length - 1; i++) {
      let minIdx = i;
      
      // Show current minimum
      animationSteps.push({
        array: [...tempArray],
        comparing: [],
        minIndex: minIdx,
        sorted: [...sortedIndices]
      });
      
      // Find the minimum element in the remaining array
      for (let j = i + 1; j < tempArray.length; j++) {
        // Show comparison
        animationSteps.push({
          array: [...tempArray],
          comparing: [j],
          minIndex: minIdx,
          sorted: [...sortedIndices]
        });
        
        if (tempArray[j] < tempArray[minIdx]) {
          minIdx = j;
          
          // Show new minimum
          animationSteps.push({
            array: [...tempArray],
            comparing: [],
            minIndex: minIdx,
            sorted: [...sortedIndices]
          });
        }
      }
      
      // Swap the found minimum element with the first element
      if (minIdx !== i) {
        // Show elements to be swapped
        animationSteps.push({
          array: [...tempArray],
          comparing: [i, minIdx],
          minIndex: -1,
          sorted: [...sortedIndices]
        });
        
        // Perform swap
        [tempArray[i], tempArray[minIdx]] = [tempArray[minIdx], tempArray[i]];
        
        // Show after swap
        animationSteps.push({
          array: [...tempArray],
          comparing: [],
          minIndex: -1,
          sorted: [...sortedIndices]
        });
      }
      
      // Mark current position as sorted
      sortedIndices.push(i);
      
      // Show updated sorted portion
      animationSteps.push({
        array: [...tempArray],
        comparing: [],
        minIndex: -1,
        sorted: [...sortedIndices]
      });
    }
    
    // Mark the last element as sorted too
    sortedIndices.push(tempArray.length - 1);
    
    // Final state - all sorted
    animationSteps.push({
      array: [...tempArray],
      comparing: [],
      minIndex: -1,
      sorted: sortedIndices
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
        <h2 className="text-2xl font-bold text-gray-800">Selection Sort</h2>
        <p className="text-gray-600 dark:text-gray-300">
          Selection Sort works by repeatedly finding the minimum element from the unsorted part and putting it at the beginning of the array.
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
            <Button onClick={selectionSort} disabled={isAnimating || array.length <= 1}>
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
              const isMinimum = animations.minIndex === idx;
              const isSorted = animations.sorted.includes(idx);
              
              let colorClass = "bg-secondary";
              if (isMinimum) colorClass = "bg-algo-active";
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
                  Selection Sort always makes O(n²) comparisons, regardless of the initial order of the input, because it must scan the entire unsorted portion for each element.
                </p>
              </div>
              <div>
                <h4 className="font-medium text-gray-800 dark:text-gray-200">Space Complexity</h4>
                <p className="font-mono text-gray-700 dark:text-gray-300">{complexity.spaceComplexity}</p>
                <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                  Selection Sort is an in-place algorithm that requires only a constant amount of additional memory space.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SelectionSort;
