
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

type ArrowDirection = 'diagonal' | 'left' | 'up' | null;

interface DPCell {
  value: number;
  direction: ArrowDirection;
  inPath: boolean;
}

export default function LCS() {
  const [string1, setString1] = useState<string>("ABCBDAB");
  const [string2, setString2] = useState<string>("BDCABA");
  const [dpTable, setDpTable] = useState<DPCell[][]>([]);
  const [lcs, setLcs] = useState<string>("");
  const [computed, setComputed] = useState<boolean>(false);

  const computeLCS = () => {
    if (!string1 || !string2) return;
    
    const m = string1.length;
    const n = string2.length;
    
    // Initialize DP table
    const table: DPCell[][] = Array(m + 1).fill(null).map(() => 
      Array(n + 1).fill(null).map(() => ({ value: 0, direction: null, inPath: false }))
    );
    
    // Fill the table
    for (let i = 1; i <= m; i++) {
      for (let j = 1; j <= n; j++) {
        if (string1[i - 1] === string2[j - 1]) {
          // Characters match
          table[i][j] = {
            value: table[i - 1][j - 1].value + 1,
            direction: 'diagonal',
            inPath: false
          };
        } else if (table[i - 1][j].value >= table[i][j - 1].value) {
          // Up is greater or equal
          table[i][j] = {
            value: table[i - 1][j].value,
            direction: 'up',
            inPath: false
          };
        } else {
          // Left is greater
          table[i][j] = {
            value: table[i][j - 1].value,
            direction: 'left',
            inPath: false
          };
        }
      }
    }
    
    // Backtrack to find LCS
    let subsequence = "";
    let i = m;
    let j = n;
    
    while (i > 0 && j > 0) {
      if (table[i][j].direction === 'diagonal') {
        subsequence = string1[i - 1] + subsequence;
        table[i][j].inPath = true;
        i--;
        j--;
      } else if (table[i][j].direction === 'up') {
        i--;
      } else {
        j--;
      }
    }
    
    setDpTable(table);
    setLcs(subsequence);
    setComputed(true);
  };

  const renderArrow = (direction: ArrowDirection, inPath: boolean) => {
    if (!direction) return null;
    
    // Updated color scheme for better contrast - using black arrows on light backgrounds
    const className = inPath ? 'text-green-800 font-bold' : 'text-gray-800';
    
    switch (direction) {
      case 'diagonal':
        return <span className={`${className} text-lg`}>↖</span>;
      case 'left':
        return <span className={`${className} text-lg`}>←</span>;
      case 'up':
        return <span className={`${className} text-lg`}>↑</span>;
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-2xl font-bold">Longest Common Subsequence</h2>
      
      <div className="flex flex-wrap gap-4 items-end">
        <div>
          <label className="text-sm font-medium block mb-1">String 1:</label>
          <Input 
            value={string1}
            onChange={(e) => setString1(e.target.value.toUpperCase())}
            className="w-64"
            placeholder="Enter first string"
          />
        </div>
        
        <div>
          <label className="text-sm font-medium block mb-1">String 2:</label>
          <Input 
            value={string2}
            onChange={(e) => setString2(e.target.value.toUpperCase())}
            className="w-64"
            placeholder="Enter second string"
          />
        </div>
        
        <Button onClick={computeLCS} disabled={!string1 || !string2}>
          Compute LCS
        </Button>
      </div>
      
      {computed && (
        <div className="mt-4 flex flex-col gap-4">
          <div className="p-4 bg-green-50 border border-green-200 rounded-md">
            <h3 className="text-lg font-bold text-green-800">Result</h3>
            <p className="text-green-700">
              <span className="font-semibold">Longest Common Subsequence:</span> {lcs}
            </p>
            <p className="text-green-700">
              <span className="font-semibold">Length:</span> {lcs.length}
            </p>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-2">DP Table with Arrows</h3>
            <div className="border border-gray-300 rounded-md overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="bg-gray-100 text-gray-900"></TableHead>
                    <TableHead className="bg-gray-100 text-gray-900"></TableHead>
                    {string2.split('').map((char, i) => (
                      <TableHead key={i} className="bg-gray-100 text-gray-900 text-center font-bold">
                        {char}
                      </TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="bg-gray-100 text-gray-900"></TableCell>
                    <TableCell className="text-center p-2 border text-gray-900 bg-white">0</TableCell>
                    {Array(string2.length).fill(0).map((_, i) => (
                      <TableCell key={i} className="text-center p-2 border text-gray-900 bg-white">0</TableCell>
                    ))}
                  </TableRow>
                  {string1.split('').map((char, i) => (
                    <TableRow key={i}>
                      <TableCell className="bg-gray-100 text-gray-900 text-center font-bold">{char}</TableCell>
                      <TableCell className="text-center p-2 border text-gray-900 bg-white">0</TableCell>
                      {Array(string2.length).fill(0).map((_, j) => {
                        const cell = dpTable[i + 1][j + 1];
                        const cellClasses = cell.inPath ? 'bg-green-50 border-green-300 text-gray-900' : 'border text-gray-900 bg-white';
                        
                        return (
                          <TableCell key={j} className={`text-center p-2 ${cellClasses}`}>
                            <div className="flex flex-col items-center">
                              <span className={cell.inPath ? 'font-bold text-gray-900' : 'text-gray-900'}>{cell.value}</span>
                              {renderArrow(cell.direction, cell.inPath)}
                            </div>
                          </TableCell>
                        );
                      })}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            
            <div className="mt-4 p-4 border border-gray-200 rounded-md bg-white text-gray-900">
              <h4 className="font-semibold mb-2">Algorithm Explanation</h4>
              <p className="mb-2">
                The Longest Common Subsequence (LCS) problem finds the longest subsequence that is present in both given sequences.
                A subsequence is a sequence that appears in the same relative order, but not necessarily contiguous.
              </p>
              <p className="mb-2">
                <span className="font-medium">DP Table Construction:</span> For each pair of characters from both strings, 
                we determine if they match (diagonal arrow) or which previous best solution to use (up or left arrow).
              </p>
              <p className="mb-2">
                <span className="font-medium">Arrow Legend:</span>
              </p>
              <ul className="list-disc pl-5 mb-2">
                <li><span className="inline-block mr-2">↖</span> Diagonal: Characters match, take diagonal value + 1</li>
                <li><span className="inline-block mr-2">←</span> Left: Take value from the left cell (skip character from string 1)</li>
                <li><span className="inline-block mr-2">↑</span> Up: Take value from the cell above (skip character from string 2)</li>
              </ul>
              <p className="font-medium mt-2">
                Green cells and bold arrows indicate the path used to construct the LCS.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
