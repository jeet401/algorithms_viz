
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";

const InsertionSort = () => {
  const [array, setArray] = useState<number[]>([]);
  const [animations, setAnimations] = useState<{ array: number[], comparing: number[], active: number, sorted: number[] }>({ array: [], comparing: [], active: -1, sorted: [] });
  const [speed, setSpeed] = useState<number>(500);
  const [arraySize, setArraySize] = useState<number>(10);
  const [isAnimating, setIsAnimating] = useState<boolean>(false);
  const [customArray, setCustomArray] = useState<string>("");
  const [currentStep, setCurrentStep] = useState<number>(-1);
  const [steps, setSteps] = useState<{array: number[], comparing: number[], active: number, sorted: number[]}[]>([]);
  const [complexity, setComplexity] = useState<{
    timeComplexityBest: string;
    timeComplexityAvg: string;
    timeComplexityWorst: string;
    spaceComplexity: string;
  }>({
    timeComplexityBest: "O(n)",
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
    setAnimations({ array: [...newArray], comparing: [], active: -1, sorted: [] });
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
      setAnimations({ array: [...parsedArray], comparing: [], active: -1, sorted: [] });
    } catch (error) {
      alert("Please enter valid numbers separated by commas");
    }
  };

  // Initialize with random array
  useEffect(() => {
    generateRandomArray();
  }, [arraySize]);

  // Insertion sort algorithm implementation with step recording
  const insertionSort = async () => {
    if (isAnimating || array.length <= 1) return;
    setIsAnimating(true);
    setCurrentStep(-1);

    const animationSteps: {array: number[], comparing: number[], active: number, sorted: number[]}[] = [];
    const tempArray = [...array];
    let sortedIndices: number[] = [0]; // First element is considered sorted initially
    
    // Initial state
    animationSteps.push({
      array: [...tempArray],
      comparing: [],
      active: -1,
      sorted: [...sortedIndices]
    });

    for (let i = 1; i < tempArray.length; i++) {
      const key = tempArray[i];
      let j = i - 1;
      
      // Show current element being considered
      animationSteps.push({
        array: [...tempArray],
        comparing: [],
        active: i,
        sorted: [...sortedIndices]
      });
      
      // Compare with each element in the sorted portion
      while (j >= 0 && tempArray[j] > key) {
        animationSteps.push({
          array: [...tempArray],
          comparing: [j, j + 1],
          active: i,
          sorted: [...sortedIndices]
        });
        
        tempArray[j + 1] = tempArray[j];
        j--;
        
        // Show the shift
        animationSteps.push({
          array: [...tempArray],
          comparing: [],
          active: j + 1,
          sorted: [...sortedIndices]
        });
      }
      
      tempArray[j + 1] = key;
      
      // Show insertion of key
      animationSteps.push({
        array: [...tempArray],
        comparing: [],
        active: j + 1,
        sorted: [...sortedIndices]
      });
      
      // Update sorted portion
      sortedIndices = Array.from({ length: i + 1 }, (_, idx) => idx);
      
      // Show updated sorted portion
      animationSteps.push({
        array: [...tempArray],
        comparing: [],
        active: -1,
        sorted: [...sortedIndices]
      });
    }
    
    // Final state - all sorted
    animationSteps.push({
      array: [...tempArray],
      comparing: [],
      active: -1,
      sorted: Array.from({ length: tempArray.length }, (_, i) => i)
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
        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Insertion Sort</h2>
        <p className="text-gray-700 dark:text-gray-300">
          Insertion Sort builds the final sorted array one item at a time by repeatedly taking the next element and inserting it into its correct position among the previously sorted elements.
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
            <Button onClick={insertionSort} disabled={isAnimating || array.length <= 1}>
              Sort
            </Button>
          </div>
        </div>
        
        <div className="flex-1">
          {/* Visualization */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border h-80 flex items-end justify-center gap-1">
            {animations.array.map((value, idx) => {
              const heightPercentage = (value / Math.max(...animations.array)) * 100;
              const isComparing = animations.comparing.includes(idx);
              const isActive = animations.active === idx;
              const isSorted = animations.sorted.includes(idx);
              
              let colorClass = "bg-secondary";
              if (isActive) colorClass = "bg-algo-active";
              else if (isComparing) colorClass = "bg-algo-comparing";
              else if (isSorted) colorClass = "bg-algo-sorted";
                  
              return (
                <div
                  key={idx}
                  className={`array-bar ${colorClass} relative`}
                  style={{ 
                    height: `${heightPercentage}%`,
                  }}
                >
                  <div className="text-center absolute bottom-0 left-0 right-0 -mb-6 text-xs md:text-sm font-medium text-gray-800 dark:text-gray-300">
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
                  Insertion Sort performs well on small or nearly sorted arrays, achieving O(n) time when the input is already sorted.
                </p>
              </div>
              <div>
                <h4 className="font-medium text-gray-800 dark:text-gray-200">Space Complexity</h4>
                <p className="font-mono text-gray-700 dark:text-gray-300">{complexity.spaceComplexity}</p>
                <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                  Insertion Sort is an in-place algorithm requiring only a constant amount of additional memory regardless of input size.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InsertionSort;
