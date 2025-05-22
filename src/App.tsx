
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Header from "@/components/Header";
import Index from "@/pages/Index";
import SortingPage from "@/pages/SortingPage";
import DynamicProgrammingPage from "@/pages/DynamicProgrammingPage";
import GreedyPage from "@/pages/GreedyPage";
import BranchAndBoundPage from "@/pages/BranchAndBoundPage";
import NotFound from "@/pages/NotFound";

import { Toaster } from "@/components/ui/toaster";

function App() {
  return (
    <BrowserRouter>
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-1 overflow-auto">
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/sorting" element={<SortingPage />} />
            <Route path="/dynamic-programming" element={<DynamicProgrammingPage />} />
            <Route path="/greedy" element={<GreedyPage />} />
            <Route path="/branch-and-bound" element={<BranchAndBoundPage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        <Toaster />
      </div>
    </BrowserRouter>
  );
}

export default App;
