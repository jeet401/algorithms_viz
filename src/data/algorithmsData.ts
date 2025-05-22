
// Define algorithm info
export type AlgorithmInfo = {
  name: string;
  description: string;
  complexity: {
    time: {
      best: string;
      average: string;
      worst: string;
    };
    space: string;
  };
  explanation?: {
    time: string;
    space: string;
  };
  pseudocode: string[];
}

// Divide & Conquer Algorithms
export const sortingAlgorithms: Record<string, AlgorithmInfo> = {
  "merge-sort": {
    name: "Merge Sort",
    description: "Merge Sort is a divide and conquer algorithm that divides the input array into two halves, recursively sorts them, and then merges the sorted halves.",
    complexity: {
      time: {
        best: "O(n log n)",
        average: "O(n log n)",
        worst: "O(n log n)",
      },
      space: "O(n)"
    },
    explanation: {
      time: "Always divides the array into halves and merges in linear time, resulting in O(n log n) complexity in all cases.",
      space: "Requires additional array of size n to merge the sorted subarrays."
    },
    pseudocode: [
      "mergeSort(array)",
      "  if length of array <= 1",
      "    return array",
      "  middle = length of array / 2",
      "  left = mergeSort(array[0...middle-1])",
      "  right = mergeSort(array[middle...length-1])",
      "  return merge(left, right)",
      "",
      "merge(left, right)",
      "  result = []",
      "  while left is not empty and right is not empty",
      "    if first(left) <= first(right)",
      "      append first(left) to result",
      "      left = rest(left)",
      "    else",
      "      append first(right) to result",
      "      right = rest(right)",
      "  append remaining left to result",
      "  append remaining right to result",
      "  return result"
    ]
  },
  "quick-sort": {
    name: "Quick Sort",
    description: "Quick Sort is a divide and conquer algorithm that picks an element as a pivot and partitions the array around the pivot, placing elements smaller than the pivot to its left and larger to its right.",
    complexity: {
      time: {
        best: "O(n log n)",
        average: "O(n log n)",
        worst: "O(n²)",
      },
      space: "O(log n)"
    },
    explanation: {
      time: "Best/average case when pivot divides array evenly. Worst case (O(n²)) occurs with already sorted arrays or when all elements are identical.",
      space: "Requires log n space for recursion stack in average case. Worst case is O(n) space."
    },
    pseudocode: [
      "quickSort(array, low, high)",
      "  if low < high",
      "    pivotIndex = partition(array, low, high)",
      "    quickSort(array, low, pivotIndex - 1)",
      "    quickSort(array, pivotIndex + 1, high)",
      "",
      "partition(array, low, high)",
      "  pivot = array[high]",
      "  i = low - 1",
      "  for j = low to high - 1",
      "    if array[j] <= pivot",
      "      i++",
      "      swap array[i] with array[j]",
      "  swap array[i + 1] with array[high]",
      "  return i + 1"
    ]
  },
  "insertion-sort": {
    name: "Insertion Sort",
    description: "Insertion sort is a simple algorithm that builds the final sorted array one item at a time. It's efficient for small data sets and is often used as part of more sophisticated algorithms.",
    complexity: {
      time: {
        best: "O(n)",
        average: "O(n²)",
        worst: "O(n²)",
      },
      space: "O(1)"
    },
    explanation: {
      time: "Best case O(n) when array is already sorted. Worst case O(n²) when array is reverse sorted, requiring shifting all elements.",
      space: "Sorts in-place with only a constant amount of extra memory needed."
    },
    pseudocode: [
      "insertionSort(array)",
      "  for i = 1 to length(array) - 1",
      "    key = array[i]",
      "    j = i - 1",
      "    while j >= 0 and array[j] > key",
      "      array[j + 1] = array[j]",
      "      j = j - 1",
      "    array[j + 1] = key",
      "  return array"
    ]
  },
  "selection-sort": {
    name: "Selection Sort",
    description: "Selection sort is a simple algorithm that repeatedly finds the minimum element from the unsorted part and puts it at the beginning.",
    complexity: {
      time: {
        best: "O(n²)",
        average: "O(n²)",
        worst: "O(n²)",
      },
      space: "O(1)"
    },
    explanation: {
      time: "Always makes n(n-1)/2 comparisons regardless of input, resulting in O(n²) time complexity in all cases.",
      space: "Sorts in-place using only a constant amount of extra memory."
    },
    pseudocode: [
      "selectionSort(array)",
      "  for i = 0 to length(array) - 2",
      "    minIdx = i",
      "    for j = i + 1 to length(array) - 1",
      "      if array[j] < array[minIdx]",
      "        minIdx = j",
      "    swap array[i] and array[minIdx]",
      "  return array"
    ]
  },
  "heap-sort": {
    name: "Heap Sort",
    description: "Heap sort is a comparison-based algorithm that uses a binary heap data structure. It divides the input into a sorted and an unsorted region, and iteratively shrinks the unsorted region by extracting the largest element.",
    complexity: {
      time: {
        best: "O(n log n)",
        average: "O(n log n)",
        worst: "O(n log n)",
      },
      space: "O(1)"
    },
    explanation: {
      time: "Building the heap takes O(n) time, and extracting each maximum element takes O(log n), resulting in O(n log n) complexity.",
      space: "Sorts in-place without requiring additional memory beyond variables for swapping."
    },
    pseudocode: [
      "heapSort(array)",
      "  buildMaxHeap(array)",
      "  for i = array.length - 1 to 1",
      "    swap array[0] with array[i]",
      "    heapSize = heapSize - 1",
      "    maxHeapify(array, 0)",
      "",
      "buildMaxHeap(array)",
      "  heapSize = array.length",
      "  for i = floor(array.length / 2) down to 0",
      "    maxHeapify(array, i)",
      "",
      "maxHeapify(array, i)",
      "  left = 2 * i + 1",
      "  right = 2 * i + 2",
      "  largest = i",
      "  if left < heapSize and array[left] > array[largest]",
      "    largest = left",
      "  if right < heapSize and array[right] > array[largest]",
      "    largest = right",
      "  if largest != i",
      "    swap array[i] with array[largest]",
      "    maxHeapify(array, largest)"
    ]
  }
};

// Greedy Algorithms
export const greedyAlgorithms: Record<string, AlgorithmInfo> = {
  "knapsack-greedy": {
    name: "0/1 Knapsack (Greedy)",
    description: "A greedy approach to the knapsack problem where items are selected based on value-to-weight ratio. Note that this doesn't always give the optimal solution for 0/1 knapsack.",
    complexity: {
      time: {
        best: "O(n log n)",
        average: "O(n log n)",
        worst: "O(n log n)",
      },
      space: "O(1)"
    },
    explanation: {
      time: "Sorting items by value-to-weight ratio takes O(n log n) time, followed by a linear scan through the sorted items.",
      space: "Only requires constant extra space beyond the input arrays."
    },
    pseudocode: [
      "knapsackGreedy(values, weights, capacity)",
      "  n = length of values array",
      "  ratios = []",
      "  for i = 0 to n-1",
      "    ratios[i] = {index: i, ratio: values[i]/weights[i]}",
      "  sort ratios in descending order by ratio",
      "  totalValue = 0",
      "  totalWeight = 0",
      "  for i = 0 to n-1",
      "    if totalWeight + weights[ratios[i].index] <= capacity",
      "      take the whole item",
      "      totalValue += values[ratios[i].index]",
      "      totalWeight += weights[ratios[i].index]",
      "  return totalValue"
    ]
  },
  "job-scheduling": {
    name: "Job Scheduling with Deadlines",
    description: "A greedy algorithm to schedule jobs with deadlines to maximize profit. Jobs are considered in order of decreasing profit.",
    complexity: {
      time: {
        best: "O(n²)",
        average: "O(n²)",
        worst: "O(n²)",
      },
      space: "O(n)"
    },
    explanation: {
      time: "Sorting takes O(n log n) and for each job we may need to search for an available slot, taking O(n), resulting in O(n²) overall.",
      space: "Requires O(n) space to track scheduled jobs and available time slots."
    },
    pseudocode: [
      "jobScheduling(jobs, deadlines)",
      "  sort jobs in decreasing order of profit",
      "  result = array of size n initialized with 0",
      "  slot = array of size n initialized with false",
      "  for i = 0 to n-1",
      "    for j = min(n, deadlines[i]) - 1 down to 0",
      "      if slot[j] is false",
      "        result[j] = i",
      "        slot[j] = true",
      "        break",
      "  return jobs scheduled in result"
    ]
  },
  "kruskals": {
    name: "Kruskal's Algorithm",
    description: "A greedy algorithm to find the minimum spanning tree of a connected, undirected graph with weighted edges.",
    complexity: {
      time: {
        best: "O(E log E)",
        average: "O(E log E)",
        worst: "O(E log E)",
      },
      space: "O(V + E)"
    },
    explanation: {
      time: "Sorting edges takes O(E log E) time. Union-find operations for cycle detection take O(E log V) time, making O(E log E) overall.",
      space: "Requires space to store the edges and the disjoint-set data structure for vertices."
    },
    pseudocode: [
      "kruskalMST(graph)",
      "  sort edges in non-decreasing order of weight",
      "  initialize result = empty set",
      "  create disjoint sets for each vertex",
      "  for each edge (u, v) in sorted edges",
      "    if including edge (u, v) doesn't form a cycle",
      "      add edge to result",
      "      union sets containing u and v",
      "  return result"
    ]
  },
  "prims": {
    name: "Prim's Algorithm",
    description: "A greedy algorithm to find the minimum spanning tree of a connected, undirected graph with weighted edges.",
    complexity: {
      time: {
        best: "O(E log V)",
        average: "O(E log V)",
        worst: "O(E log V)",
      },
      space: "O(V)"
    },
    explanation: {
      time: "Using a binary heap, each vertex extraction takes O(log V) and there are O(V) such operations. Edge relaxation takes O(E log V) time.",
      space: "Requires space to store the priority queue, key values, and the resulting MST."
    },
    pseudocode: [
      "primMST(graph)",
      "  initialize key values as infinite for all vertices except 0",
      "  key[0] = 0",
      "  initialize parent array with -1 for all vertices",
      "  initialize mstSet as empty",
      "  for each vertex",
      "    find vertex u with minimum key value not in mstSet",
      "    add u to mstSet",
      "    for each adjacent vertex v of u not in mstSet",
      "      if weight of edge (u, v) < key[v]",
      "        update key[v] = weight of edge (u, v)",
      "        update parent[v] = u",
      "  return parent array which represents MST"
    ]
  },
  "dijkstra": {
    name: "Dijkstra's Algorithm",
    description: "A greedy algorithm to find the shortest paths from a source vertex to all other vertices in a graph with non-negative edge weights.",
    complexity: {
      time: {
        best: "O(E log V)",
        average: "O(E log V)",
        worst: "O(E log V)",
      },
      space: "O(V)"
    },
    explanation: {
      time: "Using a min-heap, each vertex extraction takes O(log V) and there are O(V) such operations. Edge relaxation takes O(E log V) time.",
      space: "Requires space to store the distance array, priority queue, and visited set."
    },
    pseudocode: [
      "dijkstra(graph, source)",
      "  initialize distance array with infinite for all vertices except source",
      "  distance[source] = 0",
      "  initialize sptSet as empty",
      "  for each vertex",
      "    find vertex u with minimum distance value not in sptSet",
      "    add u to sptSet",
      "    for each adjacent vertex v of u not in sptSet",
      "      if distance[u] + weight(u, v) < distance[v]",
      "        update distance[v] = distance[u] + weight(u, v)",
      "  return distance array"
    ]
  }
};

// Dynamic Programming Algorithms
export const dpAlgorithms: Record<string, AlgorithmInfo> = {
  "multistage-graph": {
    name: "Multistage Graph",
    description: "A dynamic programming approach to find the shortest path in a weighted, directed multistage graph.",
    complexity: {
      time: {
        best: "O(V + E)",
        average: "O(V + E)",
        worst: "O(V + E)",
      },
      space: "O(V)"
    },
    explanation: {
      time: "Each vertex and edge is processed exactly once, giving O(V + E) time complexity.",
      space: "Requires O(V) space to store the cost array for dynamic programming."
    },
    pseudocode: [
      "shortestPath(graph, stages)",
      "  n = number of vertices",
      "  initialize cost array of size n",
      "  cost[n-1] = 0",
      "  for i = n-2 down to 0",
      "    cost[i] = infinity",
      "    for each vertex j in next stage",
      "      if there is an edge from i to j",
      "        cost[i] = min(cost[i], graph[i][j] + cost[j])",
      "  return cost[0]"
    ]
  },
  "knapsack-dp": {
    name: "0/1 Knapsack (DP)",
    description: "A dynamic programming approach to solve the 0/1 knapsack problem, where we either take an item entirely or leave it.",
    complexity: {
      time: {
        best: "O(n * W)",
        average: "O(n * W)",
        worst: "O(n * W)",
      },
      space: "O(n * W)"
    },
    explanation: {
      time: "Fills an n×W table where n is number of items and W is capacity, taking O(n*W) time regardless of input distribution.",
      space: "Requires a 2D array of size n×W to store intermediate results."
    },
    pseudocode: [
      "knapsackDP(values, weights, capacity)",
      "  n = length of values array",
      "  dp = 2D array of size (n+1) x (capacity+1)",
      "  for i = 0 to n",
      "    dp[i][0] = 0",
      "  for j = 0 to capacity",
      "    dp[0][j] = 0",
      "  for i = 1 to n",
      "    for w = 1 to capacity",
      "      if weights[i-1] <= w",
      "        dp[i][w] = max(values[i-1] + dp[i-1][w-weights[i-1]], dp[i-1][w])",
      "      else",
      "        dp[i][w] = dp[i-1][w]",
      "  return dp[n][capacity]"
    ]
  },
  "tsp": {
    name: "Travelling Salesman Problem",
    description: "A dynamic programming approach to find the shortest possible route that visits each city exactly once and returns to the origin city.",
    complexity: {
      time: {
        best: "O(n² * 2ⁿ)",
        average: "O(n² * 2ⁿ)",
        worst: "O(n² * 2ⁿ)",
      },
      space: "O(n * 2ⁿ)"
    },
    explanation: {
      time: "For each subset of vertices (2^n) and each ending vertex (n), we consider all possible last edges (n), giving O(n²*2^n) time.",
      space: "Requires a table of size n×2^n to store the minimum cost paths for all subproblems."
    },
    pseudocode: [
      "tsp(graph)",
      "  n = number of vertices",
      "  initialize dp array of size (2^n) x n with infinity",
      "  dp[1][0] = 0",
      "  for mask = 0 to 2^n - 1",
      "    for u = 0 to n-1",
      "      if mask & (1 << u)",
      "        for v = 0 to n-1",
      "          if mask & (1 << v) and u != v",
      "            dp[mask][u] = min(dp[mask][u], dp[mask ^ (1 << u)][v] + graph[v][u])",
      "  return minimum of dp[(2^n)-1][i] + graph[i][0] for all i from 0 to n-1"
    ]
  },
  "bellman-ford": {
    name: "Bellman-Ford Algorithm",
    description: "A dynamic programming approach to find shortest paths from a source vertex to all other vertices, even with negative edge weights.",
    complexity: {
      time: {
        best: "O(V * E)",
        average: "O(V * E)",
        worst: "O(V * E)",
      },
      space: "O(V)"
    },
    explanation: {
      time: "In worst case, all edges are relaxed V-1 times, leading to O(V*E) time complexity regardless of graph structure.",
      space: "Requires O(V) space to store the distance array for all vertices."
    },
    pseudocode: [
      "bellmanFord(graph, source)",
      "  initialize distance array with infinite for all vertices except source",
      "  distance[source] = 0",
      "  for i = 1 to V-1",
      "    for each edge (u, v) with weight w",
      "      if distance[u] + w < distance[v]",
      "        distance[v] = distance[u] + w",
      "  for each edge (u, v) with weight w",
      "    if distance[u] + w < distance[v]",
      "      negative cycle detected",
      "  return distance array"
    ]
  },
  "floyd-warshall": {
    name: "Floyd-Warshall Algorithm",
    description: "A dynamic programming approach to find shortest paths between all pairs of vertices in a weighted graph.",
    complexity: {
      time: {
        best: "O(V³)",
        average: "O(V³)",
        worst: "O(V³)",
      },
      space: "O(V²)"
    },
    explanation: {
      time: "Three nested loops iterate through all vertices as potential intermediate points, giving O(V³) time complexity.",
      space: "Requires a V×V matrix to store shortest path distances between all pairs of vertices."
    },
    pseudocode: [
      "floydWarshall(graph)",
      "  initialize dist array as a copy of the graph",
      "  for k = 0 to V-1",
      "    for i = 0 to V-1",
      "      for j = 0 to V-1",
      "        if dist[i][k] + dist[k][j] < dist[i][j]",
      "          dist[i][j] = dist[i][k] + dist[k][j]",
      "  return dist array"
    ]
  },
  "matrix-chain": {
    name: "Matrix Chain Multiplication",
    description: "A dynamic programming approach to find the most efficient way to multiply a chain of matrices.",
    complexity: {
      time: {
        best: "O(n³)",
        average: "O(n³)",
        worst: "O(n³)",
      },
      space: "O(n²)"
    },
    explanation: {
      time: "Computes optimal cost for all possible subchains using three nested loops, resulting in O(n³) time complexity.",
      space: "Requires two n×n matrices to store costs and split positions for all subproblems."
    },
    pseudocode: [
      "matrixChainOrder(dimensions)",
      "  n = length of dimensions - 1",
      "  initialize dp array of size n x n with 0",
      "  for L = 2 to n",
      "    for i = 1 to n-L+1",
      "      j = i+L-1",
      "      dp[i][j] = infinity",
      "      for k = i to j-1",
      "        cost = dp[i][k] + dp[k+1][j] + dimensions[i-1] * dimensions[k] * dimensions[j]",
      "        dp[i][j] = min(dp[i][j], cost)",
      "  return dp[1][n]"
    ]
  }
};

// Branch and Bound Algorithms
export const bnbAlgorithms: Record<string, AlgorithmInfo> = {
  "knapsack-bnb": {
    name: "0/1 Knapsack (Branch and Bound)",
    description: "A branch and bound approach to solve the 0/1 knapsack problem, which is often more efficient than brute force for larger instances.",
    complexity: {
      time: {
        best: "Exponential (but better than brute force)",
        average: "Exponential (but better than brute force)",
        worst: "Exponential (but better than brute force)",
      },
      space: "Exponential"
    },
    explanation: {
      time: "While still exponential in worst case, effective pruning significantly reduces the search space compared to brute force.",
      space: "Requires space for the state space tree which grows exponentially, but pruning reduces actual memory usage."
    },
    pseudocode: [
      "knapsackBnB(values, weights, capacity)",
      "  sort items by value/weight ratio in non-increasing order",
      "  initialize priority queue Q",
      "  create root node with level=-1, profit=0, weight=0, bound=calcBound",
      "  insert root into Q",
      "  maxProfit = 0",
      "  while Q is not empty",
      "    node = extract-max from Q",
      "    if node's bound > maxProfit",
      "      level++",
      "      if level == n",
      "        continue",
      "      if weight + weights[level] <= capacity",
      "        create newNode with level, profit+values[level], weight+weights[level]",
      "        if profit > maxProfit",
      "          maxProfit = profit",
      "        insert newNode into Q",
      "      create newNode with level, profit, weight",
      "      insert newNode into Q",
      "  return maxProfit"
    ]
  },
  "puzzle15": {
    name: "15 Puzzle Problem",
    description: "A branch and bound approach to solve the 15-puzzle problem, finding the shortest sequence of moves to reach the goal state.",
    complexity: {
      time: {
        best: "Exponential (but better with good heuristics)",
        average: "Exponential (but better with good heuristics)",
        worst: "Exponential (but better with good heuristics)",
      },
      space: "Exponential"
    },
    explanation: {
      time: "A* search with good heuristics significantly outperforms brute force but remains exponential in worst case.",
      space: "Must store all generated nodes that haven't been expanded yet, which can grow exponentially."
    },
    pseudocode: [
      "solve15Puzzle(initial)",
      "  initialize priority queue Q",
      "  create root node with current state=initial, moves=0, previous=null",
      "  insert root into Q with priority = moves + manhattan distance",
      "  visited = empty set",
      "  while Q is not empty",
      "    node = extract-min from Q",
      "    if node's state is goal state",
      "      return reconstruct path",
      "    if node's state in visited",
      "      continue",
      "    add node's state to visited",
      "    for each possible move",
      "      create newNode with new state, moves+1, previous=node",
      "      if new state not in visited",
      "        insert newNode into Q with priority = moves + manhattan distance",
      "  return no solution"
    ]
  }
};
