
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Table, TableHead, TableBody, TableHeader, TableRow, TableCell } from "@/components/ui/table";

export default function MatrixChainInput({
  dims,
  setDims,
  onCompute,
}: {
  dims: number[];
  setDims: (d: number[]) => void;
  onCompute: () => void;
}) {
  const [inputStr, setInputStr] = useState(dims.join(' '));
  
  return (
    <div>
      <div className="flex gap-2 mb-2">
        <Input
          placeholder="e.g. 10 20 30 15"
          value={inputStr}
          onChange={e => setInputStr(e.target.value)}
          className="w-64"
        />
        <Button variant="outline" onClick={() => {
          const arr = inputStr.trim().split(/\s+/).map(Number).filter(x=>!isNaN(x) && x>0);
          setDims(arr);
        }}>Set Dimensions</Button>
        <Button onClick={onCompute}>Compute</Button>
      </div>
      <span className="text-xs text-gray-600">
        Enter array of dimensions (n+1 numbers for n matrices). Example: 10 20 30 means A<sub>1</sub> 10x20, A<sub>2</sub> 20x30.
      </span>
    </div>
  );
}
