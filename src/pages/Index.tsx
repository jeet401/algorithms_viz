
import React from 'react';
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { Link } from 'react-router-dom';

const AlgorithmCard = ({ 
  title, 
  description, 
  category,
  link 
}: { 
  title: string; 
  description: string; 
  category: 'divide' | 'greedy' | 'dp' | 'branch';
  link: string;
}) => {
  return (
    <div className={`algorithm-card ${category}`}>
      <h3 className="text-lg font-bold mb-2">{title}</h3>
      <p className="text-sm text-foreground/70 mb-4">{description}</p>
      <Link to={link}>
        <Button variant="outline" className="w-full justify-between group">
          Explore
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </Button>
      </Link>
    </div>
  );
};

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-grow">
        <section className="py-16">
          <div className="container">
            <div className="max-w-2xl mx-auto text-center mb-16">
              <h1 className="text-4xl font-bold mb-4">Algorithm Visualizer</h1>
              <p className="text-xl text-foreground/70">
                Learn algorithms through interactive visualizations and step-by-step breakdowns.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
              <AlgorithmCard 
                title="Divide & Conquer" 
                category="divide"
                description="Merge Sort, Quick Sort, Insertion Sort, Selection Sort, Heap Sort"
                link="/sorting"
              />
              <AlgorithmCard 
                title="Greedy Algorithms" 
                category="greedy"
                description="Knapsack, Job Scheduling, Kruskal's, Prim's, Dijkstra's algorithms"
                link="/greedy"
              />
              <AlgorithmCard 
                title="Dynamic Programming" 
                category="dp"
                description="Matrix Chain, Longest Common Subsequence, 0/1 Knapsack, Bellman-Ford, Floyd-Warshall"
                link="/dynamic-programming"
              />
              <AlgorithmCard 
                title="Branch & Bound" 
                category="branch"
                description="0/1 Knapsack Problem, 15-Puzzle Problem solver"
                link="/branch-and-bound"
              />
            </div>
          </div>
        </section>
      </main>
      <footer className="py-6 border-t border-border">
        <div className="container">
          <div className="flex justify-between items-center">
            <p className="text-sm text-foreground/70">© 2025 AlgoViz. All rights reserved.</p>
            <div className="flex items-center gap-6">
              <a href="#" className="text-xs text-foreground/70 hover:text-foreground">About</a>
              <a href="#" className="text-xs text-foreground/70 hover:text-foreground">GitHub</a>
              <a href="#" className="text-xs text-foreground/70 hover:text-foreground">Report issue</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
