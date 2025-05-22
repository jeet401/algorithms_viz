
import React, { useState } from 'react';
import KnapsackInput from './KnapsackInput';
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";

type Item = {
  id: string;
  value: number;
  weight: number;
};

export default function KnapsackDP() {
  const [items, setItems] = useState<Item[]>([
    { id: "A", value: 60, weight: 10 },
    { id: "B", value: 100, weight: 20 },
    { id: "C", value: 120, weight: 30 }
  ]);
  const [capacity, setCapacity] = useState(50);
  const [dpTable, setDpTable] = useState<number[][]>([]);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [totalValue, setTotalValue] = useState(0);
  const [showSolution, setShowSolution] = useState(false);

  const runDynamicProgramming = () => {
    if (items.length === 0 || capacity <= 0) return;

    // Create DP table
    const n = items.length;
    const table: number[][] = Array(n + 1)
      .fill(0)
      .map(() => Array(capacity + 1).fill(0));

    // Fill the DP table
    for (let i = 1; i <= n; i++) {
      const item = items[i - 1];
      for (let w = 0; w <= capacity; w++) {
        if (item.weight <= w) {
          table[i][w] = Math.max(
            table[i - 1][w],
            item.value + table[i - 1][w - item.weight]
          );
        } else {
          table[i][w] = table[i - 1][w];
        }
      }
    }

    // Find selected items
    let w = capacity;
    let selected: string[] = [];
    for (let i = n; i > 0; i--) {
      if (table[i][w] !== table[i - 1][w]) {
        selected.push(items[i - 1].id);
        w -= items[i - 1].weight;
      }
    }

    setDpTable(table);
    setSelectedItems(selected.reverse());
    setTotalValue(table[n][capacity]);
    setShowSolution(true);
  };

  // Generate indexing for table headers
  const headerRow = Array.from({ length: capacity + 1 }, (_, i) => i);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">0/1 Knapsack - Dynamic Programming</h2>
        <p className="text-gray-600 dark:text-gray-300 mt-2">
          This solves the 0/1 Knapsack problem using a bottom-up dynamic programming approach.
        </p>
      </div>

      <div className="space-y-4">
        <KnapsackInput
          items={items}
          setItems={setItems}
          capacity={capacity}
          setCapacity={setCapacity}
        />

        <Button onClick={runDynamicProgramming}>Solve with Dynamic Programming</Button>
      </div>

      {showSolution && (
        <div className="space-y-6">
          <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-md">
            <h3 className="text-lg font-bold text-green-800 dark:text-green-200">Optimal Solution</h3>
            <p className="text-green-700 dark:text-green-300">
              Selected items: <span className="font-semibold">{selectedItems.join(", ")}</span>
            </p>
            <p className="text-green-700 dark:text-green-300">
              Total value: <span className="font-semibold">{totalValue}</span>
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-gray-100">DP Table</h3>
            <div className="border border-gray-300 dark:border-gray-700 rounded-md overflow-x-auto bg-white dark:bg-gray-800">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-100 dark:bg-gray-700">
                    <TableHead className="text-gray-800 dark:text-gray-200 font-medium">Item / Weight</TableHead>
                    {headerRow.map(w => (
                      <TableHead key={w} className="text-gray-800 dark:text-gray-200 text-center">{w}</TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {dpTable.map((row, itemIndex) => (
                    <TableRow key={itemIndex} className="border-t border-gray-200 dark:border-gray-700">
                      <TableCell className="font-medium text-gray-900 dark:text-gray-100">
                        {itemIndex === 0 ? 'None' : items[itemIndex - 1].id}
                      </TableCell>
                      {row.map((cell, weightIndex) => {
                        const isPartOfOptimalSolution =
                          itemIndex > 0 &&
                          weightIndex >= items[itemIndex - 1].weight &&
                          cell === items[itemIndex - 1].value + dpTable[itemIndex - 1][weightIndex - items[itemIndex - 1].weight] &&
                          cell > dpTable[itemIndex - 1][weightIndex];

                        return (
                          <TableCell
                            key={weightIndex}
                            className={`text-center ${
                              isPartOfOptimalSolution ? 
                              'bg-yellow-100 text-gray-900 dark:bg-yellow-900/30 dark:text-gray-100 font-medium' : 
                              'text-gray-900 dark:text-gray-100'
                            }`}
                          >
                            {cell}
                          </TableCell>
                        );
                      })}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-gray-100">How to Read the Table</h3>
            <div className="border border-gray-200 dark:border-gray-700 rounded-md p-4 bg-gray-50 dark:bg-gray-800">
              <p className="text-gray-900 dark:text-gray-100 mb-2">
                The table shows the maximum value that can be obtained with the first i items 
                and a knapsack capacity of w.
              </p>
              <ul className="list-disc pl-5 text-gray-900 dark:text-gray-100 space-y-1">
                <li>Rows represent items (0 = no items, 1 = first item, etc.)</li>
                <li>Columns represent knapsack weights from 0 to {capacity}</li>
                <li>Highlighted cells show where an item was included in the optimal solution</li>
                <li>
                  For each cell, we choose the maximum of:
                  <ul className="list-disc pl-5 ml-2 mt-1">
                    <li>Not including the current item (value from the row above)</li>
                    <li>
                      Including the current item (its value + value from the row above at [weight - current item's weight])
                    </li>
                  </ul>
                </li>
              </ul>
            </div>
          </div>

          {/* Algorithm Complexity */}
          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-gray-100">Algorithm Complexity</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-3 bg-white dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600">
                <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-2">Time Complexity</h4>
                <div className="space-y-1">
                  <div className="flex justify-between">
                    <span className="text-gray-700 dark:text-gray-300">Best Case:</span>
                    <span className="text-gray-900 dark:text-gray-100 font-medium">O(n×W)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-700 dark:text-gray-300">Average Case:</span>
                    <span className="text-gray-900 dark:text-gray-100 font-medium">O(n×W)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-700 dark:text-gray-300">Worst Case:</span>
                    <span className="text-gray-900 dark:text-gray-100 font-medium">O(n×W)</span>
                  </div>
                </div>
                <p className="mt-2 text-sm text-gray-700 dark:text-gray-300">
                  Where n is the number of items and W is the capacity. We need to fill a table of size (n+1)×(W+1).
                </p>
              </div>
              <div className="p-3 bg-white dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600">
                <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-2">Space Complexity</h4>
                <div className="flex justify-between">
                  <span className="text-gray-700 dark:text-gray-300">All cases:</span>
                  <span className="text-gray-900 dark:text-gray-100 font-medium">O(n×W)</span>
                </div>
                <p className="mt-2 text-sm text-gray-700 dark:text-gray-300">
                  We need to store the entire DP table. Note that this can be optimized to O(W) space since we only need the previous row.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
