/**
 * NeetCode 150 — the full list, grouped by topic, with live LeetCode links.
 *
 * status values stored in `progress` (kind = 'problem'):
 *   0 = todo        not attempted
 *   1 = attempted   tried, needed the solution
 *   2 = solved      solved it, possibly with a hint
 *   3 = mastered    re-solved from blank after 3+ days  <-- this is the one that counts
 *
 * `premium: true` means the problem is behind LeetCode Premium. All of them are
 * free on neetcode.io/practice — the link falls back there automatically.
 */

export type Difficulty = "Easy" | "Medium" | "Hard";

export interface Problem {
  slug: string;
  title: string;
  difficulty: Difficulty;
  topic: string;
  pattern: string;
  premium?: boolean;
  /** highest-frequency problems — do these first if you fall behind */
  core?: boolean;
}

export const PROBLEM_STATUS = ["To do", "Attempted", "Solved", "Mastered"] as const;

export function problemUrl(p: Problem): string {
  return p.premium
    ? `https://neetcode.io/practice`
    : `https://leetcode.com/problems/${p.slug}/`;
}

/** NeetCode's own video solution search — works for every problem in the list. */
export function solutionUrl(p: Problem): string {
  return `https://www.youtube.com/results?search_query=neetcode+${encodeURIComponent(p.title)}`;
}

export const PROBLEMS: Problem[] = [
  // ── Arrays & Hashing ────────────────────────────────────────────────
  { slug: "contains-duplicate", title: "Contains Duplicate", difficulty: "Easy", topic: "Arrays & Hashing", pattern: "Hash set", core: true },
  { slug: "valid-anagram", title: "Valid Anagram", difficulty: "Easy", topic: "Arrays & Hashing", pattern: "Hash map counting", core: true },
  { slug: "two-sum", title: "Two Sum", difficulty: "Easy", topic: "Arrays & Hashing", pattern: "Hash map", core: true },
  { slug: "group-anagrams", title: "Group Anagrams", difficulty: "Medium", topic: "Arrays & Hashing", pattern: "Hash map grouping", core: true },
  { slug: "top-k-frequent-elements", title: "Top K Frequent Elements", difficulty: "Medium", topic: "Arrays & Hashing", pattern: "Bucket sort / heap", core: true },
  { slug: "encode-and-decode-strings", title: "Encode and Decode Strings", difficulty: "Medium", topic: "Arrays & Hashing", pattern: "String design", premium: true },
  { slug: "product-of-array-except-self", title: "Product of Array Except Self", difficulty: "Medium", topic: "Arrays & Hashing", pattern: "Prefix / suffix", core: true },
  { slug: "valid-sudoku", title: "Valid Sudoku", difficulty: "Medium", topic: "Arrays & Hashing", pattern: "Hash set" },
  { slug: "longest-consecutive-sequence", title: "Longest Consecutive Sequence", difficulty: "Medium", topic: "Arrays & Hashing", pattern: "Hash set", core: true },

  // ── Two Pointers ────────────────────────────────────────────────────
  { slug: "valid-palindrome", title: "Valid Palindrome", difficulty: "Easy", topic: "Two Pointers", pattern: "Two pointers", core: true },
  { slug: "two-sum-ii-input-array-is-sorted", title: "Two Sum II — Sorted Array", difficulty: "Medium", topic: "Two Pointers", pattern: "Two pointers" },
  { slug: "3sum", title: "3Sum", difficulty: "Medium", topic: "Two Pointers", pattern: "Sort + two pointers", core: true },
  { slug: "container-with-most-water", title: "Container With Most Water", difficulty: "Medium", topic: "Two Pointers", pattern: "Two pointers", core: true },
  { slug: "trapping-rain-water", title: "Trapping Rain Water", difficulty: "Hard", topic: "Two Pointers", pattern: "Two pointers / stack" },

  // ── Sliding Window ──────────────────────────────────────────────────
  { slug: "best-time-to-buy-and-sell-stock", title: "Best Time to Buy and Sell Stock", difficulty: "Easy", topic: "Sliding Window", pattern: "Sliding window", core: true },
  { slug: "longest-substring-without-repeating-characters", title: "Longest Substring Without Repeating Characters", difficulty: "Medium", topic: "Sliding Window", pattern: "Variable window", core: true },
  { slug: "longest-repeating-character-replacement", title: "Longest Repeating Character Replacement", difficulty: "Medium", topic: "Sliding Window", pattern: "Variable window", core: true },
  { slug: "permutation-in-string", title: "Permutation in String", difficulty: "Medium", topic: "Sliding Window", pattern: "Fixed window" },
  { slug: "minimum-window-substring", title: "Minimum Window Substring", difficulty: "Hard", topic: "Sliding Window", pattern: "Variable window", core: true },
  { slug: "sliding-window-maximum", title: "Sliding Window Maximum", difficulty: "Hard", topic: "Sliding Window", pattern: "Monotonic deque" },

  // ── Stack ───────────────────────────────────────────────────────────
  { slug: "valid-parentheses", title: "Valid Parentheses", difficulty: "Easy", topic: "Stack", pattern: "Stack", core: true },
  { slug: "min-stack", title: "Min Stack", difficulty: "Medium", topic: "Stack", pattern: "Stack design", core: true },
  { slug: "evaluate-reverse-polish-notation", title: "Evaluate Reverse Polish Notation", difficulty: "Medium", topic: "Stack", pattern: "Stack" },
  { slug: "generate-parentheses", title: "Generate Parentheses", difficulty: "Medium", topic: "Stack", pattern: "Backtracking", core: true },
  { slug: "daily-temperatures", title: "Daily Temperatures", difficulty: "Medium", topic: "Stack", pattern: "Monotonic stack", core: true },
  { slug: "car-fleet", title: "Car Fleet", difficulty: "Medium", topic: "Stack", pattern: "Sort + stack" },
  { slug: "largest-rectangle-in-histogram", title: "Largest Rectangle in Histogram", difficulty: "Hard", topic: "Stack", pattern: "Monotonic stack" },

  // ── Binary Search ───────────────────────────────────────────────────
  { slug: "binary-search", title: "Binary Search", difficulty: "Easy", topic: "Binary Search", pattern: "Binary search", core: true },
  { slug: "search-a-2d-matrix", title: "Search a 2D Matrix", difficulty: "Medium", topic: "Binary Search", pattern: "Binary search" },
  { slug: "koko-eating-bananas", title: "Koko Eating Bananas", difficulty: "Medium", topic: "Binary Search", pattern: "Search on answer", core: true },
  { slug: "find-minimum-in-rotated-sorted-array", title: "Find Minimum in Rotated Sorted Array", difficulty: "Medium", topic: "Binary Search", pattern: "Binary search", core: true },
  { slug: "search-in-rotated-sorted-array", title: "Search in Rotated Sorted Array", difficulty: "Medium", topic: "Binary Search", pattern: "Binary search", core: true },
  { slug: "time-based-key-value-store", title: "Time Based Key-Value Store", difficulty: "Medium", topic: "Binary Search", pattern: "Binary search + design" },
  { slug: "median-of-two-sorted-arrays", title: "Median of Two Sorted Arrays", difficulty: "Hard", topic: "Binary Search", pattern: "Binary search partition" },

  // ── Linked List ─────────────────────────────────────────────────────
  { slug: "reverse-linked-list", title: "Reverse Linked List", difficulty: "Easy", topic: "Linked List", pattern: "Pointer manipulation", core: true },
  { slug: "merge-two-sorted-lists", title: "Merge Two Sorted Lists", difficulty: "Easy", topic: "Linked List", pattern: "Two pointers", core: true },
  { slug: "reorder-list", title: "Reorder List", difficulty: "Medium", topic: "Linked List", pattern: "Fast/slow + reverse", core: true },
  { slug: "remove-nth-node-from-end-of-list", title: "Remove Nth Node From End of List", difficulty: "Medium", topic: "Linked List", pattern: "Fast/slow pointers", core: true },
  { slug: "copy-list-with-random-pointer", title: "Copy List With Random Pointer", difficulty: "Medium", topic: "Linked List", pattern: "Hash map" },
  { slug: "add-two-numbers", title: "Add Two Numbers", difficulty: "Medium", topic: "Linked List", pattern: "Simulation" },
  { slug: "linked-list-cycle", title: "Linked List Cycle", difficulty: "Easy", topic: "Linked List", pattern: "Fast/slow pointers", core: true },
  { slug: "find-the-duplicate-number", title: "Find the Duplicate Number", difficulty: "Medium", topic: "Linked List", pattern: "Floyd's cycle" },
  { slug: "lru-cache", title: "LRU Cache", difficulty: "Medium", topic: "Linked List", pattern: "Hash map + doubly linked list", core: true },
  { slug: "merge-k-sorted-lists", title: "Merge K Sorted Lists", difficulty: "Hard", topic: "Linked List", pattern: "Heap / divide & conquer", core: true },
  { slug: "reverse-nodes-in-k-group", title: "Reverse Nodes in K-Group", difficulty: "Hard", topic: "Linked List", pattern: "Pointer manipulation" },

  // ── Trees ───────────────────────────────────────────────────────────
  { slug: "invert-binary-tree", title: "Invert Binary Tree", difficulty: "Easy", topic: "Trees", pattern: "Tree DFS", core: true },
  { slug: "maximum-depth-of-binary-tree", title: "Maximum Depth of Binary Tree", difficulty: "Easy", topic: "Trees", pattern: "Tree DFS", core: true },
  { slug: "diameter-of-binary-tree", title: "Diameter of Binary Tree", difficulty: "Easy", topic: "Trees", pattern: "Tree DFS", core: true },
  { slug: "balanced-binary-tree", title: "Balanced Binary Tree", difficulty: "Easy", topic: "Trees", pattern: "Tree DFS" },
  { slug: "same-tree", title: "Same Tree", difficulty: "Easy", topic: "Trees", pattern: "Tree DFS", core: true },
  { slug: "subtree-of-another-tree", title: "Subtree of Another Tree", difficulty: "Easy", topic: "Trees", pattern: "Tree DFS" },
  { slug: "lowest-common-ancestor-of-a-binary-search-tree", title: "Lowest Common Ancestor of a BST", difficulty: "Medium", topic: "Trees", pattern: "BST traversal", core: true },
  { slug: "binary-tree-level-order-traversal", title: "Binary Tree Level Order Traversal", difficulty: "Medium", topic: "Trees", pattern: "Tree BFS", core: true },
  { slug: "binary-tree-right-side-view", title: "Binary Tree Right Side View", difficulty: "Medium", topic: "Trees", pattern: "Tree BFS", core: true },
  { slug: "count-good-nodes-in-binary-tree", title: "Count Good Nodes in Binary Tree", difficulty: "Medium", topic: "Trees", pattern: "Tree DFS" },
  { slug: "validate-binary-search-tree", title: "Validate Binary Search Tree", difficulty: "Medium", topic: "Trees", pattern: "BST bounds", core: true },
  { slug: "kth-smallest-element-in-a-bst", title: "Kth Smallest Element in a BST", difficulty: "Medium", topic: "Trees", pattern: "Inorder traversal", core: true },
  { slug: "construct-binary-tree-from-preorder-and-inorder-traversal", title: "Construct Binary Tree from Preorder and Inorder", difficulty: "Medium", topic: "Trees", pattern: "Divide & conquer", core: true },
  { slug: "binary-tree-maximum-path-sum", title: "Binary Tree Maximum Path Sum", difficulty: "Hard", topic: "Trees", pattern: "Tree DFS", core: true },
  { slug: "serialize-and-deserialize-binary-tree", title: "Serialize and Deserialize Binary Tree", difficulty: "Hard", topic: "Trees", pattern: "Tree design", core: true },

  // ── Tries ───────────────────────────────────────────────────────────
  { slug: "implement-trie-prefix-tree", title: "Implement Trie (Prefix Tree)", difficulty: "Medium", topic: "Tries", pattern: "Trie", core: true },
  { slug: "design-add-and-search-words-data-structure", title: "Design Add and Search Words Data Structure", difficulty: "Medium", topic: "Tries", pattern: "Trie + DFS" },
  { slug: "word-search-ii", title: "Word Search II", difficulty: "Hard", topic: "Tries", pattern: "Trie + backtracking" },

  // ── Heap / Priority Queue ───────────────────────────────────────────
  { slug: "kth-largest-element-in-a-stream", title: "Kth Largest Element in a Stream", difficulty: "Easy", topic: "Heap / PQ", pattern: "Min heap" },
  { slug: "last-stone-weight", title: "Last Stone Weight", difficulty: "Easy", topic: "Heap / PQ", pattern: "Max heap" },
  { slug: "k-closest-points-to-origin", title: "K Closest Points to Origin", difficulty: "Medium", topic: "Heap / PQ", pattern: "Top-K heap", core: true },
  { slug: "kth-largest-element-in-an-array", title: "Kth Largest Element in an Array", difficulty: "Medium", topic: "Heap / PQ", pattern: "Quickselect / heap", core: true },
  { slug: "task-scheduler", title: "Task Scheduler", difficulty: "Medium", topic: "Heap / PQ", pattern: "Greedy + heap" },
  { slug: "design-twitter", title: "Design Twitter", difficulty: "Medium", topic: "Heap / PQ", pattern: "Design + heap" },
  { slug: "find-median-from-data-stream", title: "Find Median from Data Stream", difficulty: "Hard", topic: "Heap / PQ", pattern: "Two heaps", core: true },

  // ── Backtracking ────────────────────────────────────────────────────
  { slug: "subsets", title: "Subsets", difficulty: "Medium", topic: "Backtracking", pattern: "Backtracking", core: true },
  { slug: "combination-sum", title: "Combination Sum", difficulty: "Medium", topic: "Backtracking", pattern: "Backtracking", core: true },
  { slug: "permutations", title: "Permutations", difficulty: "Medium", topic: "Backtracking", pattern: "Backtracking", core: true },
  { slug: "subsets-ii", title: "Subsets II", difficulty: "Medium", topic: "Backtracking", pattern: "Backtracking + dedupe" },
  { slug: "combination-sum-ii", title: "Combination Sum II", difficulty: "Medium", topic: "Backtracking", pattern: "Backtracking + dedupe" },
  { slug: "word-search", title: "Word Search", difficulty: "Medium", topic: "Backtracking", pattern: "Grid backtracking", core: true },
  { slug: "palindrome-partitioning", title: "Palindrome Partitioning", difficulty: "Medium", topic: "Backtracking", pattern: "Backtracking" },
  { slug: "letter-combinations-of-a-phone-number", title: "Letter Combinations of a Phone Number", difficulty: "Medium", topic: "Backtracking", pattern: "Backtracking", core: true },
  { slug: "n-queens", title: "N-Queens", difficulty: "Hard", topic: "Backtracking", pattern: "Backtracking" },

  // ── Graphs ──────────────────────────────────────────────────────────
  { slug: "number-of-islands", title: "Number of Islands", difficulty: "Medium", topic: "Graphs", pattern: "Grid DFS/BFS", core: true },
  { slug: "clone-graph", title: "Clone Graph", difficulty: "Medium", topic: "Graphs", pattern: "Graph DFS + hash map", core: true },
  { slug: "max-area-of-island", title: "Max Area of Island", difficulty: "Medium", topic: "Graphs", pattern: "Grid DFS" },
  { slug: "pacific-atlantic-water-flow", title: "Pacific Atlantic Water Flow", difficulty: "Medium", topic: "Graphs", pattern: "Multi-source DFS", core: true },
  { slug: "surrounded-regions", title: "Surrounded Regions", difficulty: "Medium", topic: "Graphs", pattern: "Grid DFS" },
  { slug: "rotting-oranges", title: "Rotting Oranges", difficulty: "Medium", topic: "Graphs", pattern: "Multi-source BFS", core: true },
  { slug: "walls-and-gates", title: "Walls and Gates", difficulty: "Medium", topic: "Graphs", pattern: "Multi-source BFS", premium: true },
  { slug: "course-schedule", title: "Course Schedule", difficulty: "Medium", topic: "Graphs", pattern: "Topological sort", core: true },
  { slug: "course-schedule-ii", title: "Course Schedule II", difficulty: "Medium", topic: "Graphs", pattern: "Topological sort", core: true },
  { slug: "redundant-connection", title: "Redundant Connection", difficulty: "Medium", topic: "Graphs", pattern: "Union-find" },
  { slug: "number-of-connected-components-in-an-undirected-graph", title: "Number of Connected Components", difficulty: "Medium", topic: "Graphs", pattern: "Union-find", premium: true },
  { slug: "graph-valid-tree", title: "Graph Valid Tree", difficulty: "Medium", topic: "Graphs", pattern: "Union-find", premium: true },
  { slug: "word-ladder", title: "Word Ladder", difficulty: "Hard", topic: "Graphs", pattern: "BFS shortest path", core: true },

  // ── Advanced Graphs ─────────────────────────────────────────────────
  { slug: "reconstruct-itinerary", title: "Reconstruct Itinerary", difficulty: "Hard", topic: "Advanced Graphs", pattern: "Eulerian path" },
  { slug: "min-cost-to-connect-all-points", title: "Min Cost to Connect All Points", difficulty: "Medium", topic: "Advanced Graphs", pattern: "MST (Prim's)" },
  { slug: "network-delay-time", title: "Network Delay Time", difficulty: "Medium", topic: "Advanced Graphs", pattern: "Dijkstra" },
  { slug: "swim-in-rising-water", title: "Swim in Rising Water", difficulty: "Hard", topic: "Advanced Graphs", pattern: "Dijkstra / binary search" },
  { slug: "alien-dictionary", title: "Alien Dictionary", difficulty: "Hard", topic: "Advanced Graphs", pattern: "Topological sort", premium: true },
  { slug: "cheapest-flights-within-k-stops", title: "Cheapest Flights Within K Stops", difficulty: "Medium", topic: "Advanced Graphs", pattern: "Bellman-Ford" },

  // ── 1-D DP ──────────────────────────────────────────────────────────
  { slug: "climbing-stairs", title: "Climbing Stairs", difficulty: "Easy", topic: "1-D DP", pattern: "1-D DP", core: true },
  { slug: "min-cost-climbing-stairs", title: "Min Cost Climbing Stairs", difficulty: "Easy", topic: "1-D DP", pattern: "1-D DP" },
  { slug: "house-robber", title: "House Robber", difficulty: "Medium", topic: "1-D DP", pattern: "1-D DP", core: true },
  { slug: "house-robber-ii", title: "House Robber II", difficulty: "Medium", topic: "1-D DP", pattern: "1-D DP", core: true },
  { slug: "longest-palindromic-substring", title: "Longest Palindromic Substring", difficulty: "Medium", topic: "1-D DP", pattern: "Expand from centre", core: true },
  { slug: "palindromic-substrings", title: "Palindromic Substrings", difficulty: "Medium", topic: "1-D DP", pattern: "Expand from centre" },
  { slug: "decode-ways", title: "Decode Ways", difficulty: "Medium", topic: "1-D DP", pattern: "1-D DP", core: true },
  { slug: "coin-change", title: "Coin Change", difficulty: "Medium", topic: "1-D DP", pattern: "Unbounded knapsack", core: true },
  { slug: "maximum-product-subarray", title: "Maximum Product Subarray", difficulty: "Medium", topic: "1-D DP", pattern: "1-D DP", core: true },
  { slug: "word-break", title: "Word Break", difficulty: "Medium", topic: "1-D DP", pattern: "1-D DP", core: true },
  { slug: "longest-increasing-subsequence", title: "Longest Increasing Subsequence", difficulty: "Medium", topic: "1-D DP", pattern: "1-D DP / patience", core: true },
  { slug: "partition-equal-subset-sum", title: "Partition Equal Subset Sum", difficulty: "Medium", topic: "1-D DP", pattern: "0/1 knapsack" },

  // ── 2-D DP ──────────────────────────────────────────────────────────
  { slug: "unique-paths", title: "Unique Paths", difficulty: "Medium", topic: "2-D DP", pattern: "Grid DP", core: true },
  { slug: "longest-common-subsequence", title: "Longest Common Subsequence", difficulty: "Medium", topic: "2-D DP", pattern: "2-D DP", core: true },
  { slug: "best-time-to-buy-and-sell-stock-with-cooldown", title: "Best Time to Buy/Sell Stock With Cooldown", difficulty: "Medium", topic: "2-D DP", pattern: "State machine DP" },
  { slug: "coin-change-ii", title: "Coin Change II", difficulty: "Medium", topic: "2-D DP", pattern: "Unbounded knapsack" },
  { slug: "target-sum", title: "Target Sum", difficulty: "Medium", topic: "2-D DP", pattern: "0/1 knapsack" },
  { slug: "interleaving-string", title: "Interleaving String", difficulty: "Medium", topic: "2-D DP", pattern: "2-D DP" },
  { slug: "longest-increasing-path-in-a-matrix", title: "Longest Increasing Path in a Matrix", difficulty: "Hard", topic: "2-D DP", pattern: "DFS + memo" },
  { slug: "distinct-subsequences", title: "Distinct Subsequences", difficulty: "Hard", topic: "2-D DP", pattern: "2-D DP" },
  { slug: "edit-distance", title: "Edit Distance", difficulty: "Hard", topic: "2-D DP", pattern: "2-D DP", core: true },
  { slug: "burst-balloons", title: "Burst Balloons", difficulty: "Hard", topic: "2-D DP", pattern: "Interval DP" },
  { slug: "regular-expression-matching", title: "Regular Expression Matching", difficulty: "Hard", topic: "2-D DP", pattern: "2-D DP" },

  // ── Greedy ──────────────────────────────────────────────────────────
  { slug: "maximum-subarray", title: "Maximum Subarray", difficulty: "Medium", topic: "Greedy", pattern: "Kadane's", core: true },
  { slug: "jump-game", title: "Jump Game", difficulty: "Medium", topic: "Greedy", pattern: "Greedy", core: true },
  { slug: "jump-game-ii", title: "Jump Game II", difficulty: "Medium", topic: "Greedy", pattern: "Greedy BFS" },
  { slug: "gas-station", title: "Gas Station", difficulty: "Medium", topic: "Greedy", pattern: "Greedy" },
  { slug: "hand-of-straights", title: "Hand of Straights", difficulty: "Medium", topic: "Greedy", pattern: "Greedy + counting" },
  { slug: "merge-triplets-to-form-target-triplet", title: "Merge Triplets to Form Target Triplet", difficulty: "Medium", topic: "Greedy", pattern: "Greedy" },
  { slug: "partition-labels", title: "Partition Labels", difficulty: "Medium", topic: "Greedy", pattern: "Greedy intervals" },
  { slug: "valid-parenthesis-string", title: "Valid Parenthesis String", difficulty: "Medium", topic: "Greedy", pattern: "Greedy range" },

  // ── Intervals ───────────────────────────────────────────────────────
  { slug: "insert-interval", title: "Insert Interval", difficulty: "Medium", topic: "Intervals", pattern: "Intervals", core: true },
  { slug: "merge-intervals", title: "Merge Intervals", difficulty: "Medium", topic: "Intervals", pattern: "Sort + merge", core: true },
  { slug: "non-overlapping-intervals", title: "Non-overlapping Intervals", difficulty: "Medium", topic: "Intervals", pattern: "Greedy intervals", core: true },
  { slug: "meeting-rooms", title: "Meeting Rooms", difficulty: "Easy", topic: "Intervals", pattern: "Sort + scan", premium: true },
  { slug: "meeting-rooms-ii", title: "Meeting Rooms II", difficulty: "Medium", topic: "Intervals", pattern: "Heap / sweep line", premium: true, core: true },
  { slug: "minimum-interval-to-include-each-query", title: "Minimum Interval to Include Each Query", difficulty: "Hard", topic: "Intervals", pattern: "Heap + sort" },

  // ── Math & Geometry ─────────────────────────────────────────────────
  { slug: "rotate-image", title: "Rotate Image", difficulty: "Medium", topic: "Math & Geometry", pattern: "Matrix manipulation", core: true },
  { slug: "spiral-matrix", title: "Spiral Matrix", difficulty: "Medium", topic: "Math & Geometry", pattern: "Matrix traversal", core: true },
  { slug: "set-matrix-zeroes", title: "Set Matrix Zeroes", difficulty: "Medium", topic: "Math & Geometry", pattern: "In-place markers" },
  { slug: "happy-number", title: "Happy Number", difficulty: "Easy", topic: "Math & Geometry", pattern: "Cycle detection" },
  { slug: "plus-one", title: "Plus One", difficulty: "Easy", topic: "Math & Geometry", pattern: "Simulation" },
  { slug: "powx-n", title: "Pow(x, n)", difficulty: "Medium", topic: "Math & Geometry", pattern: "Fast exponentiation" },
  { slug: "multiply-strings", title: "Multiply Strings", difficulty: "Medium", topic: "Math & Geometry", pattern: "Simulation" },
  { slug: "detect-squares", title: "Detect Squares", difficulty: "Medium", topic: "Math & Geometry", pattern: "Hash map design" },

  // ── Bit Manipulation ────────────────────────────────────────────────
  { slug: "single-number", title: "Single Number", difficulty: "Easy", topic: "Bit Manipulation", pattern: "XOR", core: true },
  { slug: "number-of-1-bits", title: "Number of 1 Bits", difficulty: "Easy", topic: "Bit Manipulation", pattern: "Bit counting", core: true },
  { slug: "counting-bits", title: "Counting Bits", difficulty: "Easy", topic: "Bit Manipulation", pattern: "DP + bits", core: true },
  { slug: "reverse-bits", title: "Reverse Bits", difficulty: "Easy", topic: "Bit Manipulation", pattern: "Bit manipulation", core: true },
  { slug: "missing-number", title: "Missing Number", difficulty: "Easy", topic: "Bit Manipulation", pattern: "XOR / Gauss sum", core: true },
  { slug: "sum-of-two-integers", title: "Sum of Two Integers", difficulty: "Medium", topic: "Bit Manipulation", pattern: "Bit manipulation" },
  { slug: "reverse-integer", title: "Reverse Integer", difficulty: "Medium", topic: "Bit Manipulation", pattern: "Overflow handling" },
];

/** Topic order as it should appear in the UI — matches the learning dependency order. */
export const TOPIC_ORDER = [
  "Arrays & Hashing",
  "Two Pointers",
  "Sliding Window",
  "Stack",
  "Binary Search",
  "Linked List",
  "Trees",
  "Tries",
  "Heap / PQ",
  "Backtracking",
  "Graphs",
  "Advanced Graphs",
  "1-D DP",
  "2-D DP",
  "Greedy",
  "Intervals",
  "Math & Geometry",
  "Bit Manipulation",
];

/** Which phase week each topic belongs to, for the "is this on schedule" hint. */
export const TOPIC_WEEKS: Record<string, string> = {
  "Arrays & Hashing": "1–4",
  "Two Pointers": "3–4",
  "Sliding Window": "5–6",
  Stack: "5–6",
  "Binary Search": "7–8",
  "Linked List": "8–9",
  Trees: "10–12",
  Tries: "13",
  "Heap / PQ": "13–14",
  Backtracking: "14–15",
  Graphs: "15–16",
  "Advanced Graphs": "16",
  "1-D DP": "17–18",
  "2-D DP": "18",
  Greedy: "19",
  Intervals: "19",
  "Math & Geometry": "20",
  "Bit Manipulation": "20",
};

export const PROBLEMS_BY_TOPIC = TOPIC_ORDER.map((topic) => ({
  topic,
  weeks: TOPIC_WEEKS[topic],
  problems: PROBLEMS.filter((p) => p.topic === topic),
}));
