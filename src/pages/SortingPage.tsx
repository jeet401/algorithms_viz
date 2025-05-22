
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import HeapSort from "@/components/HeapSort";
import MergeSort from "@/components/MergeSort";
import QuickSort from "@/components/QuickSort";
import InsertionSort from "@/components/InsertionSort";
import SelectionSort from "@/components/SelectionSort";

const SortingPage = () => {
  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-6">Sorting Algorithms</h1>
      
      <Tabs defaultValue="heap-sort" className="w-full">
        <TabsList className="mb-4 flex flex-wrap">
          <TabsTrigger value="heap-sort">Heap Sort</TabsTrigger>
          <TabsTrigger value="merge-sort">Merge Sort</TabsTrigger>
          <TabsTrigger value="quick-sort">Quick Sort</TabsTrigger>
          <TabsTrigger value="insertion-sort">Insertion Sort</TabsTrigger>
          <TabsTrigger value="selection-sort">Selection Sort</TabsTrigger>
        </TabsList>
        
        <TabsContent value="heap-sort" className="px-4 py-6 bg-white dark:bg-gray-800 rounded-lg shadow">
          <HeapSort />
        </TabsContent>
        
        <TabsContent value="merge-sort" className="px-4 py-6 bg-white dark:bg-gray-800 rounded-lg shadow">
          <MergeSort />
        </TabsContent>
        
        <TabsContent value="quick-sort" className="px-4 py-6 bg-white dark:bg-gray-800 rounded-lg shadow">
          <QuickSort />
        </TabsContent>
        
        <TabsContent value="insertion-sort" className="px-4 py-6 bg-white dark:bg-gray-800 rounded-lg shadow">
          <InsertionSort />
        </TabsContent>
        
        <TabsContent value="selection-sort" className="px-4 py-6 bg-white dark:bg-gray-800 rounded-lg shadow">
          <SelectionSort />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SortingPage;
