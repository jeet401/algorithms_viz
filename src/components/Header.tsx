
import { Link, useLocation } from "react-router-dom";

export default function Header() {
  const location = useLocation();
  const isActive = (path: string) =>
    location.pathname === path ? "border-b-2 border-primary font-medium" : "";

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 max-w-screen-2xl items-center">
        <div className="mr-4 hidden md:flex">
          <Link className="mr-6 flex items-center space-x-2" to="/">
            <span className="font-bold">Algorithm Visualizer</span>
          </Link>
          <nav className="flex items-center space-x-6 text-sm font-medium">
            <Link
              to="/"
              className={`transition-colors hover:text-foreground/80 ${isActive(
                "/"
              )}`}
            >
              Home
            </Link>
            <Link
              to="/sorting"
              className={`transition-colors hover:text-foreground/80 ${isActive(
                "/sorting"
              )}`}
            >
              Sorting
            </Link>
            <Link
              to="/dynamic-programming"
              className={`transition-colors hover:text-foreground/80 ${isActive(
                "/dynamic-programming"
              )}`}
            >
              Dynamic Programming
            </Link>
            <Link
              to="/greedy"
              className={`transition-colors hover:text-foreground/80 ${isActive(
                "/greedy"
              )}`}
            >
              Greedy
            </Link>
            <Link
              to="/branch-and-bound"
              className={`transition-colors hover:text-foreground/80 ${isActive(
                "/branch-and-bound"
              )}`}
            >
              Branch and Bound
            </Link>
          </nav>
        </div>
        <div className="md:hidden">Algorithm Visualizer</div>
      </div>
    </header>
  );
}
