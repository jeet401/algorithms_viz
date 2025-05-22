
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import BranchAndBoundKnapsack from "@/components/BranchAndBoundKnapsack";
import PuzzleSolver from "@/components/PuzzleSolver";
import GraphColoring from "@/components/GraphColoring";

export default function BranchAndBoundPage() {
  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-6">Branch and Bound Algorithms</h1>
      
      <Tabs defaultValue="knapsack">
        <TabsList className="mb-4">
          <TabsTrigger value="knapsack">0/1 Knapsack Problem</TabsTrigger>
          <TabsTrigger value="puzzle">15-Puzzle Problem</TabsTrigger>
          <TabsTrigger value="graphcoloring">Graph Coloring</TabsTrigger>
        </TabsList>
        
        <TabsContent value="knapsack">
          <BranchAndBoundKnapsack />
        </TabsContent>
        
        <TabsContent value="puzzle">
          <PuzzleSolver />
        </TabsContent>

        <TabsContent value="graphcoloring">
          <GraphColoring />
        </TabsContent>
      </Tabs>
    </div>
  );
}
