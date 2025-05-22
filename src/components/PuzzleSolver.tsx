
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowUp, ArrowDown, ArrowLeft, ArrowRight } from "lucide-react";

type PuzzleState = number[];
type Direction = "up" | "down" | "left" | "right";
type StepInfo = { node: string; color: number; status: 'trying' | 'success' | 'backtrack' };

interface TreeNode {
  state: PuzzleState;
  move: Direction | null;
  g: number; // depth/cost so far
  h: number; // heuristic (misplaced tiles)
  f: number; // f = g + h
  parent: TreeNode | null;
}

const PuzzleSolver: React.FC = () => {
  // Default starting state
  const defaultInitState = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 0];
  
  const [manualInput, setManualInput] = useState<string>("1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,0");
  const [inputError, setInputError] = useState<string>("");
  const [currentState, setCurrentState] = useState<PuzzleState>([...defaultInitState]);
  const [solutionPath, setSolutionPath] = useState<TreeNode[]>([]);
  const [isSolved, setIsSolved] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSolving, setIsSolving] = useState(false);

  // Goal state is always [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,0]
  const goalState: PuzzleState = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 0];

  // Generate a random puzzle
  const generateRandomPuzzle = () => {
    setIsGenerating(true);
    setSolutionPath([]);
    setIsSolved(false);

    // Start with the goal state and shuffle
    let shuffled = [...goalState];
    
    // Apply 10-20 random valid moves to ensure it's solvable
    const moves = Math.floor(Math.random() * 10) + 10;
    let zero = 15; // Position of zero (empty space)
    
    for (let i = 0; i < moves; i++) {
      const zeroRow = Math.floor(zero / 4);
      const zeroCol = zero % 4;
      
      const possibleMoves: Direction[] = [];
      
      if (zeroRow > 0) possibleMoves.push("up");
      if (zeroRow < 3) possibleMoves.push("down");
      if (zeroCol > 0) possibleMoves.push("left");
      if (zeroCol < 3) possibleMoves.push("right");
      
      const move = possibleMoves[Math.floor(Math.random() * possibleMoves.length)];
      let newZero = zero;
      
      switch (move) {
        case "up":
          newZero = zero - 4;
          break;
        case "down":
          newZero = zero + 4;
          break;
        case "left":
          newZero = zero - 1;
          break;
        case "right":
          newZero = zero + 1;
          break;
      }
      
      // Swap the empty space with the tile
      [shuffled[zero], shuffled[newZero]] = [shuffled[newZero], shuffled[zero]];
      zero = newZero;
    }
    
    setCurrentState(shuffled);
    setManualInput(shuffled.join(','));
    setIsGenerating(false);
  };

  // Handle manual input change
  const handleManualInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setManualInput(e.target.value);
  };

  // Parse and validate manual input
  const parseManualInput = () => {
    try {
      // Parse the input
      const values = manualInput.split(',').map(val => parseInt(val.trim()));
      
      // Check if we have exactly 16 numbers
      if (values.length !== 16) {
        setInputError("Input must contain exactly 16 numbers");
        return false;
      }
      
      // Check if values are between 0 and 15, inclusive
      for (let val of values) {
        if (isNaN(val) || val < 0 || val > 15) {
          setInputError("Values must be between 0 and 15");
          return false;
        }
      }
      
      // Check if each number appears exactly once
      const uniqueValues = new Set(values);
      if (uniqueValues.size !== 16) {
        setInputError("Each number must appear exactly once");
        return false;
      }
      
      // All checks passed, update state
      setCurrentState(values);
      setInputError("");
      return true;
    } catch (error) {
      setInputError("Invalid input format");
      return false;
    }
  };

  // Calculate misplaced tiles heuristic
  const calculateMisplacedTiles = (state: PuzzleState): number => {
    let misplaced = 0;
    
    for (let i = 0; i < 16; i++) {
      if (state[i] !== 0 && state[i] !== goalState[i]) {
        misplaced++;
      }
    }
    
    return misplaced;
  };

  // Get possible moves from a state
  const getPossibleMoves = (state: PuzzleState): { state: PuzzleState; move: Direction }[] => {
    const zeroIndex = state.indexOf(0);
    const zeroRow = Math.floor(zeroIndex / 4);
    const zeroCol = zeroIndex % 4;
    const moves: { state: PuzzleState; move: Direction }[] = [];
    
    // Check up
    if (zeroRow > 0) {
      const newState = [...state];
      const swapIndex = zeroIndex - 4;
      [newState[zeroIndex], newState[swapIndex]] = [newState[swapIndex], newState[zeroIndex]];
      moves.push({ state: newState, move: "up" });
    }
    
    // Check down
    if (zeroRow < 3) {
      const newState = [...state];
      const swapIndex = zeroIndex + 4;
      [newState[zeroIndex], newState[swapIndex]] = [newState[swapIndex], newState[zeroIndex]];
      moves.push({ state: newState, move: "down" });
    }
    
    // Check left
    if (zeroCol > 0) {
      const newState = [...state];
      const swapIndex = zeroIndex - 1;
      [newState[zeroIndex], newState[swapIndex]] = [newState[swapIndex], newState[zeroIndex]];
      moves.push({ state: newState, move: "left" });
    }
    
    // Check right
    if (zeroCol < 3) {
      const newState = [...state];
      const swapIndex = zeroIndex + 1;
      [newState[zeroIndex], newState[swapIndex]] = [newState[swapIndex], newState[zeroIndex]];
      moves.push({ state: newState, move: "right" });
    }
    
    return moves;
  };

  // Check if states are equal
  const areStatesEqual = (state1: PuzzleState, state2: PuzzleState): boolean => {
    return state1.every((val, idx) => val === state2[idx]);
  };

  // Convert state to string for hash
  const stateToString = (state: PuzzleState): string => {
    return state.join(',');
  };

  // Solve using A* search
  const solvePuzzle = () => {
    if (!parseManualInput()) {
      return;
    }
    
    setIsSolving(true);
    setSolutionPath([]);
    setIsSolved(false);
    
    if (areStatesEqual(currentState, goalState)) {
      setIsSolved(true);
      setSolutionPath([{
        state: currentState,
        move: null,
        g: 0,
        h: 0,
        f: 0,
        parent: null,
      }]);
      setIsSolving(false);
      return;
    }
    
    // A* search algorithm
    const openSet: TreeNode[] = [];
    const closedSet = new Set<string>();
    const initialNode: TreeNode = {
      state: currentState,
      move: null,
      g: 0,
      h: calculateMisplacedTiles(currentState),
      f: calculateMisplacedTiles(currentState),
      parent: null,
    };
    
    openSet.push(initialNode);
    
    // Limit search depth to avoid browser hanging
    const maxIterations = 10000;
    let iterations = 0;
    
    while (openSet.length > 0 && iterations < maxIterations) {
      iterations++;
      
      // Sort by f value and take the best node
      openSet.sort((a, b) => a.f - b.f);
      const current = openSet.shift()!;
      
      // Convert state to string for hash check
      const currentStateStr = stateToString(current.state);
      
      // Check if goal reached
      if (areStatesEqual(current.state, goalState)) {
        // Extract the solution path
        let node: TreeNode | null = current;
        const path: TreeNode[] = [];
        
        while (node) {
          path.unshift(node);
          node = node.parent;
        }
        
        setSolutionPath(path);
        setIsSolved(true);
        setIsSolving(false);
        return;
      }
      
      // Add to closed set
      closedSet.add(currentStateStr);
      
      // Generate possible moves
      const possibleMoves = getPossibleMoves(current.state);
      
      for (const { state, move } of possibleMoves) {
        // Convert to string for hash check
        const nextStateStr = stateToString(state);
        
        // Check if state already in closed set
        if (closedSet.has(nextStateStr)) {
          continue;
        }
        
        const g = current.g + 1;
        const h = calculateMisplacedTiles(state);
        const f = g + h;
        
        // Check if state already in open set with better f value
        const existingInOpenSet = openSet.findIndex(node => stateToString(node.state) === nextStateStr);
        
        if (existingInOpenSet !== -1 && openSet[existingInOpenSet].f <= f) {
          continue;
        }
        
        // Create new node
        const newNode: TreeNode = {
          state,
          move,
          g,
          h,
          f,
          parent: current,
        };
        
        // Remove existing node from open set if it exists
        if (existingInOpenSet !== -1) {
          openSet.splice(existingInOpenSet, 1);
        }
        
        // Add new node to open set
        openSet.push(newNode);
      }
    }
    
    // If we reach here, no solution was found within the limit
    setIsSolved(false);
    setIsSolving(false);
  };

  // Render a 4x4 puzzle grid
  const renderPuzzleGrid = (state: PuzzleState) => {
    return (
      <div className="grid grid-cols-4 gap-1 w-full max-w-[240px] aspect-square">
        {state.map((value, index) => (
          <div
            key={index}
            className={`flex items-center justify-center text-xl font-bold rounded-md p-2
              ${value === 0 
                ? "bg-gray-300 dark:bg-gray-700" 
                : value === goalState[index]
                  ? "bg-green-100 dark:bg-green-700 text-green-900 dark:text-green-50"
                  : "bg-blue-100 dark:bg-blue-700 text-blue-900 dark:text-blue-50"
              }`}
          >
            {value === 0 ? "" : value}
          </div>
        ))}
      </div>
    );
  };

  // Render move arrow
  const renderMoveArrow = (direction: Direction | null) => {
    if (!direction) return null;
    
    const Arrow = {
      up: ArrowUp,
      down: ArrowDown,
      left: ArrowLeft,
      right: ArrowRight
    }[direction];
    
    return <Arrow className="h-6 w-6 text-blue-600 dark:text-blue-400" />;
  };

  // Render the solution path
  const renderSolutionPath = () => {
    if (solutionPath.length === 0) return null;
    
    return (
      <div className="flex flex-col items-center gap-4">
        <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200">Solution Path</h3>
        
        <div className="flex flex-col gap-4 pb-4 items-center">
          {solutionPath.map((node, index) => (
            <div key={index} className="flex flex-none flex-col items-center">
              {index > 0 && (
                <div className="my-2 flex items-center">
                  {renderMoveArrow(node.move)}
                  <span className="ml-2 text-base font-medium text-gray-800 dark:text-gray-200">
                    Move: {node.move}
                  </span>
                </div>
              )}
              
              <div className="flex flex-col items-center bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700 shadow-md">
                <div className="mb-2">
                  {renderPuzzleGrid(node.state)}
                </div>
                
                <div className="mt-3 p-2 bg-blue-50 dark:bg-blue-900/30 rounded-lg w-full">
                  <div className="text-center">
                    <span className="text-base font-medium text-blue-800 dark:text-blue-200">
                      Step {index}
                    </span>
                  </div>
                  <div className="text-center mt-1 text-sm">
                    <span className="font-medium text-gray-800 dark:text-gray-200">
                      C*({index}) = g({node.g}) + h({node.h}) = {node.f}
                    </span>
                  </div>
                </div>
              </div>
              
              {index < solutionPath.length - 1 && (
                <div className="flex justify-center my-1">
                  <ArrowDown className="h-6 w-6 text-gray-600 dark:text-gray-400" />
                </div>
              )}
            </div>
          ))}
        </div>
        
        <div className="mt-4 p-4 bg-green-50 dark:bg-green-800 rounded-lg border border-green-200 dark:border-green-700 w-full max-w-md">
          <h4 className="font-medium text-green-800 dark:text-green-100 mb-2">Solution Summary</h4>
          <div className="text-green-700 dark:text-green-200">
            <p>Total steps: {solutionPath.length - 1}</p>
            <p>Final cost function value: {solutionPath[solutionPath.length - 1].f}</p>
            <p>g(n) = {solutionPath[solutionPath.length - 1].g} (moves)</p>
            <p>h(n) = {solutionPath[solutionPath.length - 1].h} (misplaced tiles)</p>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="bg-slate-100 dark:bg-slate-800 p-6 rounded-lg">
        <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-100">15-Puzzle Solver (A* Search)</h2>
        
        <div className="flex flex-col md:flex-row gap-8 items-center md:items-start">
          <div className="flex flex-col items-center">
            <h3 className="text-lg font-medium mb-4 text-center text-gray-800 dark:text-gray-200">Initial State</h3>
            
            <div className="mb-4">
              {renderPuzzleGrid(currentState)}
            </div>
            
            <div className="w-full max-w-xs mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Manual Input (comma separated, 0 represents empty tile):
              </label>
              <Input
                value={manualInput}
                onChange={handleManualInputChange}
                className="w-full"
                placeholder="1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,0"
              />
              {inputError && <div className="text-red-600 dark:text-red-400 text-sm mt-1">{inputError}</div>}
            </div>
            
            <div className="flex gap-4">
              <Button 
                onClick={generateRandomPuzzle}
                variant="outline"
                disabled={isGenerating || isSolving}
              >
                Generate Random Puzzle
              </Button>
              
              <Button 
                onClick={solvePuzzle}
                disabled={isGenerating || isSolving}
              >
                {isSolving ? "Solving..." : "Solve Puzzle"}
              </Button>
            </div>
          </div>
          
          <div className="flex-1 max-w-md">
            <h3 className="text-lg font-medium mb-4 text-center text-gray-800 dark:text-gray-200">Solution Information</h3>
            
            {isSolved ? (
              <div className="bg-green-100 dark:bg-green-800 p-4 rounded-lg text-green-800 dark:text-green-100">
                <p className="font-medium">Puzzle solved!</p>
                <p>Number of moves: {solutionPath.length - 1}</p>
                <p>Solution path is shown below</p>
              </div>
            ) : isSolving ? (
              <div className="bg-blue-100 dark:bg-blue-800 p-4 rounded-lg text-blue-800 dark:text-blue-100">
                <p>Solving puzzle using A* search...</p>
              </div>
            ) : (
              <div className="bg-blue-100 dark:bg-blue-800 p-4 rounded-lg text-blue-800 dark:text-blue-100">
                <p>Click "Solve Puzzle" to find the solution using A* search.</p>
                <p className="mt-2">Heuristic used: Misplaced Tiles</p>
              </div>
            )}
            
            <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div className="mb-2">
                <span className="text-sm font-medium text-gray-800 dark:text-gray-200">
                  A* Cost Function: f(n) = g(n) + h(n) where:
                </span>
              </div>
              
              <div className="flex items-center gap-2 mb-2 ml-4">
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  • g(n) = number of moves from start
                </span>
              </div>
              
              <div className="flex items-center gap-2 ml-4">
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  • h(n) = number of misplaced tiles
                </span>
              </div>
            </div>

            {/* Time and Space Complexity Information */}
            <div className="mt-6 bg-white dark:bg-gray-700 p-4 rounded-lg border border-gray-200 dark:border-gray-600">
              <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-3">Algorithm Complexity</h4>
              
              <div className="space-y-4">
                <div>
                  <h5 className="text-sm font-medium text-gray-800 dark:text-gray-200 mb-1">Time Complexity:</h5>
                  <div className="ml-4 space-y-1">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-700 dark:text-gray-300">Best case:</span>
                      <span className="text-sm font-medium text-gray-800 dark:text-gray-200">Exponential (but better with good heuristics)</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-700 dark:text-gray-300">Average case:</span>
                      <span className="text-sm font-medium text-gray-800 dark:text-gray-200">Exponential (but better with good heuristics)</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-700 dark:text-gray-300">Worst case:</span>
                      <span className="text-sm font-medium text-gray-800 dark:text-gray-200">Exponential (but better with good heuristics)</span>
                    </div>
                  </div>
                  <p className="text-xs text-gray-700 dark:text-gray-300 mt-1 ml-4">
                    A* search with good heuristics significantly outperforms brute force but remains exponential in worst case.
                  </p>
                </div>
                
                <div>
                  <h5 className="text-sm font-medium text-gray-800 dark:text-gray-200 mb-1">Space Complexity:</h5>
                  <div className="ml-4">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-700 dark:text-gray-300">All cases:</span>
                      <span className="text-sm font-medium text-gray-800 dark:text-gray-200">Exponential</span>
                    </div>
                  </div>
                  <p className="text-xs text-gray-700 dark:text-gray-300 mt-1 ml-4">
                    Must store all generated nodes that haven't been expanded yet, which can grow exponentially.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {isSolved && solutionPath.length > 0 && (
        <div className="bg-slate-100 dark:bg-slate-800 p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-100">Solution Path</h2>
          {renderSolutionPath()}
        </div>
      )}
    </div>
  );
};

export default PuzzleSolver;
