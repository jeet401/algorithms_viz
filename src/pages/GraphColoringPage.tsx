
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function GraphColoringPage() {
  const navigate = useNavigate();
  
  useEffect(() => {
    // Redirect to BranchAndBoundPage with graph-coloring tab
    navigate("/branch-and-bound?tab=graph-coloring");
  }, [navigate]);
  
  return (
    <div className="container py-8">
      <p>Redirecting to Graph Coloring in Branch and Bound section...</p>
    </div>
  );
}
