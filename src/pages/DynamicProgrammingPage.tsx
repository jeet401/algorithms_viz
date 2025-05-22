
import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import MatrixChainInput from "@/components/MatrixChainInput";
import LCS from "@/components/LCS";
import BellmanFord from "@/components/BellmanFord";
import FloydWarshall from "@/components/FloydWarshall";
import KnapsackDP from "@/components/KnapsackDP";

export default function DynamicProgrammingPage() {
  // Matrix Chain Multiplication
  const [dims, setDims] = useState<number[]>([40, 20, 30, 10, 30]);
  const [mcmTable, setMcmTable] = useState<number[][]>([]);
  const [splitTable, setSplitTable] = useState<number[][]>([]);
  const [parenthesizedFormula, setParenthesizedFormula] = useState<string>("");
  
  const matrixChainMultiplication = () => {
    const n = dims.length - 1;
    
    // Initialize tables
    const m: number[][] = Array(n).fill(0).map(() => Array(n).fill(0));
    const s: number[][] = Array(n).fill(0).map(() => Array(n).fill(0));
    
    // l is chain length
    for (let l = 2; l <= n; l++) {
      for (let i = 0; i < n - l + 1; i++) {
        const j = i + l - 1;
        m[i][j] = Infinity;
        
        for (let k = i; k < j; k++) {
          const cost = m[i][k] + m[k + 1][j] + dims[i] * dims[k + 1] * dims[j + 1];
          
          if (cost < m[i][j]) {
            m[i][j] = cost;
            s[i][j] = k;
          }
        }
      }
    }
    
    setMcmTable(m);
    setSplitTable(s);
    
    // Generate parenthesized formula
    const formula = generateParenthesizedForm(s, 0, n - 1);
    setParenthesizedFormula(formula);
  };
  
  const generateParenthesizedForm = (s: number[][], i: number, j: number): string => {
    if (i === j) {
      return `A${i + 1}`;
    }
    
    return `(${generateParenthesizedForm(s, i, s[i][j])} × ${generateParenthesizedForm(s, s[i][j] + 1, j)})`;
  };
  
  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-6">Dynamic Programming Algorithms</h1>
      
      <Tabs defaultValue="mcm">
        <TabsList className="mb-4">
          <TabsTrigger value="mcm">Matrix Chain Multiplication</TabsTrigger>
          <TabsTrigger value="lcs">Longest Common Subsequence</TabsTrigger>
          <TabsTrigger value="knapsack">0/1 Knapsack</TabsTrigger>
          <TabsTrigger value="bellman-ford">Bellman-Ford</TabsTrigger>
          <TabsTrigger value="floyd-warshall">Floyd-Warshall</TabsTrigger>
        </TabsList>
        
        <TabsContent value="mcm">
          <div className="flex flex-col gap-4">
            <div>
              <h2 className="text-2xl font-bold mb-4">Matrix Chain Multiplication</h2>
              <MatrixChainInput dims={dims} setDims={setDims} onCompute={matrixChainMultiplication} />
            </div>
            
            {mcmTable.length > 0 && (
              <>
                <div className="p-4 bg-green-50 border border-green-200 rounded-md">
                  <h3 className="text-lg font-bold text-green-800">Result</h3>
                  <p className="text-green-700">
                    <span className="font-semibold">Minimum number of scalar multiplications:</span> {mcmTable[0][mcmTable.length - 1]}
                  </p>
                  <p className="text-green-700">
                    <span className="font-semibold">Optimal Parenthesization:</span> {parenthesizedFormula}
                  </p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Cost Table (m[i,j])</h3>
                    <div className="border border-gray-300 rounded-md overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead>
                          <tr>
                            <th className="px-4 py-2 bg-gray-100 text-gray-900">i\j</th>
                            {Array(mcmTable.length).fill(0).map((_, i) => (
                              <th key={i} className="px-4 py-2 bg-gray-100 text-gray-900">{i}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {mcmTable.map((row, i) => (
                            <tr key={i}>
                              <td className="px-4 py-2 bg-gray-100 text-gray-900 font-medium">{i}</td>
                              {row.map((cell, j) => (
                                <td key={j} className="px-4 py-2 border text-gray-900 bg-white text-center">
                                  {cell === Infinity ? "∞" : cell === 0 ? "-" : cell}
                                </td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Split Table (s[i,j])</h3>
                    <div className="border border-gray-300 rounded-md overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead>
                          <tr>
                            <th className="px-4 py-2 bg-gray-100 text-gray-900">i\j</th>
                            {Array(splitTable.length).fill(0).map((_, i) => (
                              <th key={i} className="px-4 py-2 bg-gray-100 text-gray-900">{i}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {splitTable.map((row, i) => (
                            <tr key={i}>
                              <td className="px-4 py-2 bg-gray-100 text-gray-900 font-medium">{i}</td>
                              {row.map((cell, j) => (
                                <td key={j} className="px-4 py-2 border text-gray-900 bg-white text-center">
                                  {i >= j ? "-" : cell}
                                </td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
                
                <div className="border p-4 rounded-md bg-gray-50">
                  <h3 className="text-lg font-semibold mb-2 text-gray-900">Explanation</h3>
                  <p className="mb-2 text-gray-900">
                    The Matrix Chain Multiplication problem finds the most efficient way to multiply a sequence of matrices.
                    Given matrices A₁, A₂, ..., Aₙ with dimensions p₀×p₁, p₁×p₂, ..., pₙ₋₁×pₙ, we find the optimal way to 
                    parenthesize the product to minimize the total number of scalar multiplications.
                  </p>
                  <p className="text-gray-900">
                    The table m[i,j] represents the minimum number of scalar multiplications needed to compute the matrix 
                    product from A<sub>i+1</sub> to A<sub>j+1</sub>. The table s[i,j] stores the index k where we split the 
                    product (i.e., we compute (A<sub>i+1</sub> × ... × A<sub>k+1</sub>) × (A<sub>k+2</sub> × ... × A<sub>j+1</sub>)).
                  </p>
                </div>
              </>
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="lcs">
          <LCS />
        </TabsContent>
        
        <TabsContent value="knapsack">
          <KnapsackDP />
        </TabsContent>
        
        <TabsContent value="bellman-ford">
          <BellmanFord />
        </TabsContent>
        
        <TabsContent value="floyd-warshall">
          <FloydWarshall />
        </TabsContent>
      </Tabs>
    </div>
  );
}
