// seedTopicsPart2.js - Topics 14-25 + seed runner
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Topic from './models/Topic.js';
import topicsPart1 from './seedTopics.js';

dotenv.config();

const topicsPart2 = [
  {
    name: "Greedy",
    order: 14,
    notes: `<h2>Greedy Algorithms – Locally Optimal, Globally Optimal</h2>

<p>A greedy algorithm builds a solution piece by piece, always making the choice that looks best at the current moment — the locally optimal choice — with the hope that these local choices will lead to a globally optimal solution. Unlike dynamic programming, which considers all possible sub-problem combinations, a greedy algorithm commits to each decision once and never reconsiders it. This makes greedy algorithms typically faster and simpler to implement, but they only work when the problem possesses the <strong>greedy choice property</strong> (a locally optimal choice leads to a globally optimal solution) and <strong>optimal substructure</strong> (an optimal solution contains optimal solutions to sub-problems).</p>

<p>The most critical skill with greedy algorithms is <strong>proving correctness</strong> — just because a greedy approach seems intuitive does not mean it produces the optimal result. The standard proof technique is the <strong>exchange argument</strong>: assume an optimal solution exists that differs from the greedy solution at some point, then show you can "exchange" the differing choice for the greedy choice without making the solution worse. If every non-greedy choice can be exchanged, the greedy solution must be optimal. Many greedy problems require <strong>sorting</strong> as a preprocessing step — for example, the Activity Selection problem sorts by finish time, the Fractional Knapsack sorts by value-to-weight ratio, and interval scheduling problems sort by start or end time.</p>

<p>Classic greedy problems include the <strong>Activity Selection / Meeting Rooms</strong> problem (select the maximum number of non-overlapping activities), <strong>Jump Game</strong> (determine if you can reach the last index, or find the minimum jumps needed), <strong>Huffman Coding</strong> (build an optimal prefix-free encoding tree), <strong>Minimum Spanning Tree</strong> algorithms (Kruskal's and Prim's both use greedy strategies), and <strong>Dijkstra's shortest path</strong> algorithm (greedily picks the nearest unvisited vertex). When you encounter a problem asking for a "maximum" or "minimum" with sequential choices and no need to revisit decisions, consider whether a greedy approach might work.</p>

<h3>Further Reading</h3>
<ul>
  <li><a href="https://www.geeksforgeeks.org/greedy-algorithms/" target="_blank">GeeksforGeeks – Greedy Algorithms</a></li>
  <li><a href="https://leetcode.com/tag/greedy/" target="_blank">LeetCode – Greedy Problems</a></li>
  <li><a href="https://www.youtube.com/watch?v=bC7o8P_Ste4" target="_blank">Abdul Bari – Greedy Algorithms (Video)</a></li>
</ul>`
  },
  {
    name: "Trees",
    order: 15,
    notes: `<h2>Trees – Hierarchical Data Structures</h2>

<p>A tree is a hierarchical, non-linear data structure consisting of nodes connected by edges, with one designated <strong>root</strong> node at the top and zero or more child subtrees beneath it. Trees are inherently recursive — every subtree is itself a tree with its own root. This recursive nature makes trees perfectly suited for recursive algorithms. Key terminology includes: the <strong>root</strong> (topmost node with no parent), <strong>leaf</strong> nodes (nodes with no children), <strong>depth</strong> (distance from root to a node), <strong>height</strong> (longest path from a node to any leaf), and <strong>subtree</strong> (a node and all its descendants).</p>

<p>The most common type is the <strong>Binary Tree</strong>, where each node has at most two children: left and right. A <strong>Binary Search Tree (BST)</strong> adds the ordering property: all values in the left subtree are less than the node's value, and all values in the right subtree are greater. This enables O(log n) search, insertion, and deletion in a balanced BST. However, if inserted in sorted order, a BST degenerates into a linked list with O(n) operations. Self-balancing BSTs like <strong>AVL trees</strong> (maintain height difference ≤ 1 between subtrees) and <strong>Red-Black trees</strong> (used by Java's TreeMap and C++'s std::map) guarantee O(log n) height through rotations after insertions and deletions.</p>

<p>Tree traversals are fundamental operations. <strong>Inorder traversal</strong> (Left → Root → Right) visits a BST's nodes in sorted order. <strong>Preorder traversal</strong> (Root → Left → Right) is useful for serializing a tree or creating a copy. <strong>Postorder traversal</strong> (Left → Right → Root) processes children before the parent, making it ideal for deletion or computing subtree properties. <strong>Level-order traversal</strong> uses BFS (a queue) to visit nodes level by level. Classic tree problems that appear frequently in interviews include: finding the maximum depth, checking if a tree is balanced, validating BST properties, finding the lowest common ancestor of two nodes, serializing and deserializing a tree, and converting between tree representations.</p>

<h3>Further Reading</h3>
<ul>
  <li><a href="https://www.geeksforgeeks.org/binary-tree-data-structure/" target="_blank">GeeksforGeeks – Binary Tree</a></li>
  <li><a href="https://leetcode.com/explore/learn/card/data-structure-tree/" target="_blank">LeetCode – Binary Tree Card</a></li>
  <li><a href="https://visualgo.net/en/bst" target="_blank">VisuAlgo – BST Visualization</a></li>
</ul>`
  },
  {
    name: "Heap / Priority Queue",
    order: 16,
    notes: `<h2>Heaps and Priority Queues – Efficient Extremum Access</h2>

<p>A heap is a specialized complete binary tree that satisfies the <strong>heap property</strong>: in a min-heap, every parent node's value is less than or equal to its children's values, so the root always holds the minimum element; in a max-heap, every parent is greater than or equal to its children, so the root holds the maximum. Heaps are typically implemented using arrays — the parent of element at index i is at index (i-1)/2, and its children are at 2i+1 and 2i+2. This array representation eliminates the overhead of pointers and provides excellent cache locality.</p>

<p>The key operations on a heap are <strong>insert</strong> (O(log n) — add the element at the end and "bubble up" by swapping with its parent while the heap property is violated), <strong>extract min/max</strong> (O(log n) — remove the root, replace it with the last element, and "bubble down" by swapping with the smaller/larger child until the heap is restored), and <strong>build heap</strong> (O(n) — heapify an existing array from the bottom up, which is surprisingly linear rather than O(n log n)). A <strong>priority queue</strong> is an abstract data type that allows inserting elements with priorities and extracting the element with the highest (or lowest) priority — it is most commonly implemented using a heap.</p>

<p>Heaps and priority queues appear frequently in coding interviews for optimization problems. Finding the <strong>Kth largest or smallest element</strong> in an array is elegantly solved with a min-heap of size k. <strong>Merging K sorted lists</strong> uses a min-heap to always extract the smallest current element across all lists. <strong>Top K frequent elements</strong> uses a heap after counting frequencies. The <strong>median from a data stream</strong> problem maintains two heaps — a max-heap for the lower half and a min-heap for the upper half of the data. Dijkstra's shortest path algorithm uses a priority queue to greedily process the nearest unvisited vertex. Heap sort uses a max-heap to sort in-place in O(n log n) time.</p>

<h3>Further Reading</h3>
<ul>
  <li><a href="https://www.geeksforgeeks.org/heap-data-structure/" target="_blank">GeeksforGeeks – Heap Data Structure</a></li>
  <li><a href="https://visualgo.net/en/heap" target="_blank">VisuAlgo – Heap Visualization</a></li>
  <li><a href="https://www.youtube.com/watch?v=t0Cq6tVNRBA" target="_blank">HackerRank – Heaps (Video)</a></li>
</ul>`
  },
  {
    name: "Graph",
    order: 17,
    notes: `<h2>Graphs – Modeling Relationships and Networks</h2>

<p>A graph is a data structure consisting of <strong>vertices</strong> (nodes) connected by <strong>edges</strong> (links). Graphs are the most general-purpose data structure for modeling relationships — social networks (users connected by friendships), maps (cities connected by roads), dependencies (tasks that must be completed in order), and countless other real-world scenarios. Graphs can be <strong>directed</strong> (edges have a direction, like a one-way street) or <strong>undirected</strong> (edges go both ways). Edges can be <strong>weighted</strong> (carrying a cost, distance, or capacity) or <strong>unweighted</strong>. A graph can also contain <strong>cycles</strong> (paths that loop back to the starting vertex) or be <strong>acyclic</strong>.</p>

<p>There are two standard ways to represent a graph in code. An <strong>adjacency matrix</strong> is a 2D array where matrix[i][j] indicates whether an edge exists between vertex i and vertex j. It uses O(V²) space and allows O(1) edge lookup, but is wasteful for sparse graphs (few edges relative to vertices). An <strong>adjacency list</strong> stores, for each vertex, a list of its neighbors — either as an array of arrays, a hash map of lists, or a combination. It uses O(V + E) space and is the preferred representation for most algorithms because real-world graphs are typically sparse.</p>

<p>Graph algorithms form a vast and critical topic in computer science. <strong>BFS</strong> explores vertices level by level and finds shortest paths in unweighted graphs. <strong>DFS</strong> explores as deep as possible before backtracking, useful for detecting cycles, finding connected components, and topological sorting. <strong>Dijkstra's algorithm</strong> finds the shortest path from a source to all other vertices in a weighted graph with non-negative edge weights, running in O((V + E) log V) with a priority queue. <strong>Bellman-Ford</strong> handles negative edge weights in O(VE) time and can detect negative cycles. <strong>Topological sort</strong> produces a linear ordering of vertices in a Directed Acyclic Graph (DAG) such that for every edge u→v, u comes before v — essential for dependency resolution and task scheduling. <strong>Union-Find</strong> efficiently tracks connected components and is the basis of Kruskal's minimum spanning tree algorithm. Mastering graph problems requires both understanding these algorithms and recognizing which real-world problems map to which graph formulations.</p>

<h3>Further Reading</h3>
<ul>
  <li><a href="https://www.geeksforgeeks.org/graph-data-structure-and-algorithms/" target="_blank">GeeksforGeeks – Graph Algorithms</a></li>
  <li><a href="https://leetcode.com/explore/learn/card/graph/" target="_blank">LeetCode – Graph Card</a></li>
  <li><a href="https://visualgo.net/en/dfsbfs" target="_blank">VisuAlgo – Graph Traversal</a></li>
  <li><a href="https://www.youtube.com/watch?v=tWVWeAqZ0WU" target="_blank">freeCodeCamp – Graph Algorithms (Video)</a></li>
</ul>`
  },
  {
    name: "BFS / DFS",
    order: 18,
    notes: `<h2>BFS & DFS – Fundamental Graph and Tree Traversal</h2>

<p><strong>Breadth-First Search (BFS)</strong> and <strong>Depth-First Search (DFS)</strong> are the two foundational traversal strategies for exploring graphs and trees. Understanding when to use each one — and why — is perhaps the single most important skill in graph-related problem solving. Both visit every vertex and edge once, giving them O(V + E) time complexity, but they explore in fundamentally different orders, making each one suited to different types of problems.</p>

<p>BFS explores a graph <strong>level by level</strong>, visiting all vertices at distance 1 from the source before visiting vertices at distance 2, then distance 3, and so on. It uses a <strong>queue</strong> to maintain the frontier of unvisited neighbors. This level-order exploration has a crucial property: the first time BFS reaches a vertex, it has found the <strong>shortest path</strong> to that vertex (in terms of number of edges). This makes BFS the default choice for shortest path problems in unweighted graphs, level-order tree traversal, and "minimum number of steps" problems in grids. <strong>Multi-source BFS</strong> starts from multiple source vertices simultaneously (by enqueueing all of them initially), enabling elegant solutions to problems like "rotting oranges" (how long until all oranges are rotten?) or "walls and gates" (find the distance from every room to the nearest gate).</p>

<p>DFS explores a graph by going <strong>as deep as possible</strong> along each branch before backtracking. It uses a <strong>stack</strong> (either an explicit stack or the implicit function call stack through recursion). DFS is naturally suited for problems that require exploring all paths, detecting cycles (if you revisit a node that is currently on the recursion stack, there is a cycle), finding connected components (each DFS call from an unvisited node discovers one component), and performing <strong>topological sorting</strong> of directed acyclic graphs (process a node only after all its dependencies have been processed). DFS also powers backtracking algorithms, which are essentially DFS with pruning. In tree contexts, DFS corresponds to preorder, inorder, and postorder traversals depending on when you process the current node relative to its children.</p>

<h3>Further Reading</h3>
<ul>
  <li><a href="https://www.geeksforgeeks.org/breadth-first-search-or-bfs-for-a-graph/" target="_blank">GeeksforGeeks – BFS</a></li>
  <li><a href="https://www.geeksforgeeks.org/depth-first-search-or-dfs-for-a-graph/" target="_blank">GeeksforGeeks – DFS</a></li>
  <li><a href="https://www.youtube.com/watch?v=pcKY4hjDrxk" target="_blank">William Fiset – BFS & DFS (Video)</a></li>
</ul>`
  },
  {
    name: "Trie",
    order: 19,
    notes: `<h2>Trie – The Prefix Tree for Fast String Operations</h2>

<p>A trie (pronounced "try," from the word "retrieval") is a tree-like data structure specifically designed for storing and searching strings. Unlike a binary search tree where each node holds a full key, a trie breaks strings into individual characters with each node representing a single character. The path from the root to any node spells out a prefix of one or more stored strings. A boolean flag at each node marks whether that node represents the end of a complete word. This structure enables <strong>O(m) time</strong> for insert, search, and prefix matching operations, where m is the length of the string — completely independent of how many strings are stored in the trie.</p>

<p>The fundamental advantage of a trie over hash-based approaches is its ability to efficiently handle <strong>prefix queries</strong>. While a hash map gives you O(1) exact lookups, it cannot answer "give me all words starting with 'app'" without scanning every key. A trie answers this instantly by traversing to the node for "app" and then exploring all its descendants. This property makes tries the backbone of <strong>autocomplete systems</strong>, <strong>spell checkers</strong>, <strong>IP routing tables</strong> (longest prefix matching), and <strong>search engine suggestions</strong>. The trade-off is memory usage — each node can have up to 26 children (for lowercase English), and many of these slots may be empty, leading to significant space overhead. Compressed tries (Patricia tries or radix trees) address this by merging nodes with single children.</p>

<p>In coding interviews, tries appear in problems like implementing a Trie class with insert, search, and startsWith methods, the <strong>Word Search II</strong> problem (finding all dictionary words in a 2D character grid — solved by building a trie from the word list and performing DFS on the grid while traversing the trie simultaneously), <strong>Longest Common Prefix</strong> among a set of strings, and <strong>Design Add and Search Words</strong> (supporting wildcard '.' characters in search). The trie is also the foundation for more advanced structures like suffix trees and Aho-Corasick automata used in multi-pattern string matching.</p>

<h3>Further Reading</h3>
<ul>
  <li><a href="https://www.geeksforgeeks.org/trie-insert-and-search/" target="_blank">GeeksforGeeks – Trie</a></li>
  <li><a href="https://leetcode.com/explore/learn/card/trie/" target="_blank">LeetCode – Trie Card</a></li>
  <li><a href="https://www.youtube.com/watch?v=oobqoCJlHA0" target="_blank">NeetCode – Implement Trie (Video)</a></li>
</ul>`
  },
  {
    name: "Union Find",
    order: 20,
    notes: `<h2>Union-Find – Tracking Connected Components Efficiently</h2>

<p>Union-Find (also known as Disjoint Set Union or DSU) is a data structure that manages a collection of non-overlapping sets and supports two primary operations: <strong>Find</strong> (determine which set a particular element belongs to by returning the set's representative/root) and <strong>Union</strong> (merge two sets into one). What makes Union-Find special is that with two key optimizations — path compression and union by rank — both operations run in nearly O(1) amortized time, specifically O(α(n)) where α is the inverse Ackermann function, which grows so slowly that it is effectively constant for any practical input size.</p>

<p><strong>Path compression</strong> optimizes the Find operation: when you traverse from a node to its root, you make every node along that path point directly to the root. This flattens the tree structure so that future Find operations on the same nodes are nearly instantaneous. <strong>Union by rank (or size)</strong> optimizes the Union operation: when merging two trees, the shorter (or smaller) tree is attached under the root of the taller (or larger) tree. This prevents the tree from degenerating into a long chain, keeping the height logarithmic even without path compression. Together, these two optimizations make Union-Find one of the most efficient data structures in existence for connectivity queries.</p>

<p>Union-Find is the ideal tool for dynamically tracking <strong>connected components</strong>. When edges are added one at a time and you need to quickly answer "are these two nodes connected?" or "how many components exist?", Union-Find handles it beautifully. It is the core of <strong>Kruskal's algorithm</strong> for finding minimum spanning trees: sort all edges by weight, iterate through them, and add each edge if it connects two different components (using Union-Find to check and merge). Other interview problems include detecting cycles in undirected graphs (if a new edge connects two nodes already in the same set, a cycle exists), the <strong>Accounts Merge</strong> problem (merge email accounts belonging to the same person), and <strong>Number of Islands II</strong> (dynamically count islands as land cells are added to a grid).</p>

<h3>Further Reading</h3>
<ul>
  <li><a href="https://www.geeksforgeeks.org/disjoint-set-data-structures/" target="_blank">GeeksforGeeks – Disjoint Set</a></li>
  <li><a href="https://cp-algorithms.com/data_structures/disjoint_set_union.html" target="_blank">CP-Algorithms – DSU</a></li>
  <li><a href="https://www.youtube.com/watch?v=ibjEGG7ylHk" target="_blank">William Fiset – Union-Find (Video)</a></li>
</ul>`
  },
  {
    name: "Bit Manipulation",
    order: 21,
    notes: `<h2>Bit Manipulation – Operating at the Binary Level</h2>

<p>Bit manipulation involves directly operating on the binary (base-2) representation of integers using bitwise operators. While it may seem low-level and esoteric, bit manipulation can lead to remarkably elegant and efficient solutions — often O(1) space and constant-factor faster execution — for certain categories of problems. At its core, every integer is stored as a sequence of bits (0s and 1s), and bitwise operators let you inspect, set, clear, flip, or combine individual bits with a single CPU instruction.</p>

<p>The fundamental bitwise operators are: <strong>AND (&amp;)</strong> — produces 1 only when both corresponding bits are 1 (useful for masking specific bits or checking if a bit is set); <strong>OR (|)</strong> — produces 1 when either bit is 1 (useful for setting bits); <strong>XOR (^)</strong> — produces 1 when bits differ (the "magical" operator: a^a=0, a^0=a, and XOR is commutative and associative); <strong>NOT (~)</strong> — flips all bits; <strong>Left Shift (&lt;&lt;)</strong> — multiplies by powers of 2; and <strong>Right Shift (&gt;&gt;)</strong> — divides by powers of 2. Mastering these operators opens up a world of tricks: checking if a number is a power of 2 (<code>n &amp; (n-1) == 0</code>), counting set bits using Brian Kernighan's algorithm (repeatedly clear the lowest set bit with <code>n &amp; (n-1)</code>), swapping two variables without a temporary (<code>a ^= b; b ^= a; a ^= b</code>), and toggling the kth bit (<code>n ^ (1 &lt;&lt; k)</code>).</p>

<p>In coding interviews, the most iconic bit manipulation problem is <strong>Single Number</strong>: given an array where every element appears twice except one, find the unique element by XOR-ing everything together (pairs cancel to 0, leaving only the singleton). Variations include finding two unique elements, or the element appearing once when others appear three times (using bit counting per position). <strong>Bit masking</strong> is used to represent subsets — each bit represents whether an element is included, enabling iteration over all 2ⁿ subsets of a set. This is the backbone of bitmask DP, used in problems like the Travelling Salesman Problem and assignment problems. Understanding bit manipulation also helps with systems design topics like feature flags, permission systems, and network subnet masks.</p>

<h3>Further Reading</h3>
<ul>
  <li><a href="https://www.geeksforgeeks.org/bit-manipulation-competitive-programming/" target="_blank">GeeksforGeeks – Bit Manipulation</a></li>
  <li><a href="https://leetcode.com/tag/bit-manipulation/" target="_blank">LeetCode – Bit Manipulation Problems</a></li>
  <li><a href="https://www.youtube.com/watch?v=NLKQEOgBAnw" target="_blank">NeetCode – Bit Manipulation (Video)</a></li>
</ul>`
  },
  {
    name: "Math",
    order: 22,
    notes: `<h2>Math & Number Theory – Computational Mathematics</h2>

<p>Mathematical problems in coding interviews test your understanding of fundamental number properties, modular arithmetic, combinatorics, and the ability to translate mathematical concepts into efficient code. While math-heavy problems are less common than data structure problems, they appear regularly and often serve as screening questions for analytical thinking. The key is recognizing mathematical patterns and knowing a handful of essential algorithms and identities.</p>

<p>The <strong>Euclidean algorithm</strong> for computing the Greatest Common Divisor (GCD) is one of the oldest algorithms known — <code>GCD(a, b) = GCD(b, a % b)</code> with base case <code>GCD(a, 0) = a</code>. It runs in O(log(min(a,b))) time. From GCD, you can compute the Least Common Multiple: <code>LCM(a, b) = a × b / GCD(a, b)</code>. <strong>Modular arithmetic</strong> is essential for problems involving large numbers: <code>(a + b) % m = ((a % m) + (b % m)) % m</code>, and similarly for multiplication. <strong>Binary exponentiation</strong> (fast power) computes a^n in O(log n) by squaring and halving: if n is even, a^n = (a²)^(n/2); if odd, a^n = a × a^(n-1). The <strong>Sieve of Eratosthenes</strong> generates all prime numbers up to N in O(N log log N) time by iteratively marking multiples of each prime as composite.</p>

<p>Common interview math problems include checking if a number is a palindrome (without converting to string), reversing an integer (handling overflow), determining power of two/three, counting primes less than N, computing factorials modulo a prime, and the "Happy Number" problem (detecting cycles in the digit-square sequence using Floyd's algorithm). Combinatorics problems involve computing binomial coefficients (nCr) efficiently using Pascal's Triangle or the multiplicative formula with modular inverses. Probability and expected value occasionally appear in more advanced interviews. A solid foundation in these mathematical concepts will help you recognize shortcuts and avoid brute-force approaches.</p>

<h3>Further Reading</h3>
<ul>
  <li><a href="https://www.geeksforgeeks.org/mathematical-algorithms/" target="_blank">GeeksforGeeks – Mathematical Algorithms</a></li>
  <li><a href="https://cp-algorithms.com/" target="_blank">CP-Algorithms – Comprehensive Reference</a></li>
  <li><a href="https://www.youtube.com/watch?v=ZL-LhaaMTTE" target="_blank">William Fiset – Number Theory (Video)</a></li>
</ul>`
  },
  {
    name: "Divide and Conquer",
    order: 23,
    notes: `<h2>Divide and Conquer – Decompose, Solve, Combine</h2>

<p>Divide and Conquer is an algorithmic paradigm where a problem is recursively broken into two or more smaller sub-problems of the same type until they become simple enough to solve directly. The solutions to the sub-problems are then combined to produce the solution to the original problem. The key distinction from dynamic programming is that divide-and-conquer sub-problems <strong>do not overlap</strong> — each sub-problem is independent and solved exactly once, so there is no benefit to caching results. The performance of divide-and-conquer algorithms is analyzed using the <strong>Master Theorem</strong>, which provides a formula for recurrences of the form T(n) = aT(n/b) + O(n^d).</p>

<p>The three canonical examples of divide and conquer are sorting algorithms. <strong>Merge Sort</strong> divides the array into two halves, recursively sorts each half, and merges the sorted halves in O(n) time — giving O(n log n) total. <strong>Quick Sort</strong> picks a pivot, partitions elements into those less than and greater than the pivot, and recursively sorts each partition. <strong>Binary Search</strong> itself is a divide-and-conquer algorithm: divide the search space in half, conquer by searching the relevant half, and combine is trivial (just return the result). Beyond sorting, divide and conquer solves the <strong>Closest Pair of Points</strong> problem in O(n log n) by splitting points by x-coordinate and efficiently handling the strip near the dividing line, <strong>Strassen's matrix multiplication</strong> in O(n^2.807) instead of O(n³), and the <strong>Maximum Subarray</strong> problem (though Kadane's O(n) algorithm is simpler for this specific problem).</p>

<p>To apply divide and conquer effectively, look for problems where the input can be naturally split into independent parts, each part can be solved using the same algorithm, and the results can be merged efficiently. If the merge step takes O(n) time and the problem is halved each time, you typically achieve O(n log n) complexity — a significant improvement over O(n²) brute force. The challenge often lies in designing an efficient combine step that does not bottleneck the overall algorithm.</p>

<h3>Further Reading</h3>
<ul>
  <li><a href="https://www.geeksforgeeks.org/divide-and-conquer/" target="_blank">GeeksforGeeks – Divide and Conquer</a></li>
  <li><a href="https://www.khanacademy.org/computing/computer-science/algorithms/merge-sort/a/divide-and-conquer-algorithms" target="_blank">Khan Academy – Divide and Conquer</a></li>
  <li><a href="https://www.youtube.com/watch?v=11V7Ik0IBHU" target="_blank">MIT OpenCourseWare – Divide and Conquer (Video)</a></li>
</ul>`
  },
  {
    name: "Design",
    order: 24,
    notes: `<h2>System & Data Structure Design – Architect for Efficiency</h2>

<p>Design problems test your ability to architect custom data structures or small systems that meet specific functional requirements under strict time and space complexity constraints. Unlike standard algorithmic problems where you are given an input and produce an output, design problems ask you to build a class or module that supports a set of operations (get, put, add, remove, getRandom, etc.), each within a specified time complexity. The challenge lies in selecting and <strong>combining existing data structures</strong> in creative ways to satisfy all constraints simultaneously.</p>

<p>The most famous design problem is the <strong>LRU (Least Recently Used) Cache</strong>. It requires O(1) time for both get and put operations, with automatic eviction of the least recently used item when capacity is exceeded. No single data structure satisfies this alone: a hash map gives O(1) lookups but cannot track usage order, while a linked list tracks order but has O(n) lookups. The solution is to combine both — a hash map whose values point to nodes in a doubly linked list, allowing O(1) access (via the map) and O(1) reordering (move the accessed node to the front of the list). This pattern of combining data structures is the core skill being tested. Similarly, a <strong>LFU (Least Frequently Used) Cache</strong> adds frequency tracking, requiring maps of frequency to doubly linked lists.</p>

<p>Other common design problems include implementing a <strong>Min Stack</strong> (stack with O(1) getMin — use an auxiliary stack tracking current minimums), <strong>Queue using Stacks</strong> (amortized O(1) using two stacks — one for enqueue, one for dequeue), <strong>RandomizedSet</strong> (O(1) insert, remove, and getRandom — use an array for random access and a hash map for index lookup), <strong>Twitter/News Feed Design</strong> (merge k sorted streams), and <strong>Iterator patterns</strong> (flatten nested lists, peeking iterators). When approaching these problems, always start by clarifying the required operations and their time complexity constraints, then work backwards to determine which data structures provide those guarantees.</p>

<h3>Further Reading</h3>
<ul>
  <li><a href="https://leetcode.com/tag/design/" target="_blank">LeetCode – Design Problems</a></li>
  <li><a href="https://www.youtube.com/watch?v=7ABFKPK2hD4" target="_blank">NeetCode – LRU Cache Explained (Video)</a></li>
  <li><a href="https://www.geeksforgeeks.org/lru-cache-implementation/" target="_blank">GeeksforGeeks – LRU Cache Implementation</a></li>
</ul>`
  },
  {
    name: "Intervals",
    order: 25,
    notes: `<h2>Intervals – Working with Ranges</h2>

<p>Interval problems involve working with ranges defined by a start and end point, such as [1, 5] or [3, 8]. These problems appear frequently in coding interviews and real-world applications — scheduling meetings, allocating resources, merging time ranges, and collision detection all involve interval logic. The single most important insight for almost all interval problems is: <strong>sort the intervals by start time</strong> (or sometimes by end time). Once sorted, relationships between intervals become easy to detect by comparing adjacent intervals in a single pass.</p>

<p>The foundational interval problem is <strong>Merge Overlapping Intervals</strong>. After sorting by start time, iterate through the intervals and compare each one with the last interval in your result set. If the current interval's start is less than or equal to the previous interval's end, they overlap and should be merged (extend the end to the maximum of both ends). Otherwise, the current interval is separate and added to the result. This runs in O(n log n) due to sorting. The <strong>Insert Interval</strong> problem extends this by adding a new interval into an already sorted list and handling any resulting merges. <strong>Meeting Rooms I</strong> asks whether a person can attend all meetings (check for any overlap after sorting), while <strong>Meeting Rooms II</strong> asks for the minimum number of conference rooms needed (equivalent to finding the maximum number of overlapping intervals at any point).</p>

<p>The <strong>Line Sweep</strong> (or event-based) technique is particularly powerful for interval problems. It converts each interval into two events — a start event (+1) and an end event (-1) — sorts all events by time (breaking ties by processing ends before starts, depending on the problem), and sweeps through in order, maintaining a running counter. The maximum value of the counter represents the maximum concurrency (e.g., the most meetings happening simultaneously). This technique generalizes to multi-dimensional problems and is used in computational geometry for segment intersection and area union calculations. Other notable interval problems include Non-Overlapping Intervals (find minimum removals to make all intervals non-overlapping) and Interval List Intersections (find intersections of two sorted interval lists using a two-pointer approach).</p>

<h3>Further Reading</h3>
<ul>
  <li><a href="https://www.geeksforgeeks.org/interval-scheduling-maximization-problem/" target="_blank">GeeksforGeeks – Interval Scheduling</a></li>
  <li><a href="https://leetcode.com/tag/intervals/" target="_blank">LeetCode – Interval Problems</a></li>
  <li><a href="https://www.youtube.com/watch?v=WjMdibFcRCQ" target="_blank">NeetCode – Merge Intervals (Video)</a></li>
</ul>`
  }
];

const allTopics = [...topicsPart1, ...topicsPart2];

async function seedTopics() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    let inserted = 0;
    let skipped = 0;

    for (const topicData of allTopics) {
      const existing = await Topic.findOne({ name: topicData.name });
      if (existing) {
        existing.notes = topicData.notes;
        existing.order = topicData.order;
        await existing.save();
        console.log(`  Updated: ${topicData.name}`);
        skipped++;
      } else {
        await Topic.create(topicData);
        console.log(`  Created: ${topicData.name}`);
        inserted++;
      }
    }

    console.log(`\nDone! Created ${inserted} new topics, updated ${skipped} existing topics.`);
    process.exit(0);
  } catch (error) {
    console.error('Error seeding topics:', error);
    process.exit(1);
  }
}

seedTopics();
