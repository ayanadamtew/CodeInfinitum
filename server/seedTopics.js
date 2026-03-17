// seedTopics.js - Seed 25 comprehensive DSA topics into the database
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Topic from './models/Topic.js';

dotenv.config();

const topics = [
  {
    name: "Arrays",
    order: 1,
    notes: `<h2>Arrays – The Foundation of Data Structures</h2>

<p>An array is the most fundamental data structure in computer science. At its core, an array is a contiguous block of memory that stores a fixed-size sequential collection of elements, all of the same data type. Because elements are stored in adjacent memory locations, arrays enable <strong>constant-time O(1) random access</strong> — you can jump directly to any element using its index without scanning through other elements. This makes arrays exceptionally fast for lookups when you know the position of the data you need.</p>

<p>However, arrays come with trade-offs. <strong>Insertion and deletion</strong> operations are costly — O(n) in the worst case — because elements must be shifted to maintain the contiguous layout. For example, inserting an element at the beginning of an array of size n requires shifting all n existing elements one position to the right. Similarly, deleting from the middle leaves a gap that must be filled by shifting subsequent elements. Dynamic arrays (like JavaScript's arrays, Python's lists, or Java's ArrayList) solve the fixed-size limitation by automatically resizing when capacity is exceeded, but the amortized cost of resizing is still O(n) in the worst case during a resize event.</p>

<p>Arrays are the backbone of many powerful algorithmic techniques. The <strong>Two Pointer technique</strong> uses two indices that traverse the array from different positions (often from both ends toward the center, or both from the start at different speeds) to solve problems like finding pairs with a given sum or removing duplicates in-place in O(n) time. The <strong>Sliding Window technique</strong> maintains a dynamic subarray and slides it across the data, which is invaluable for problems involving contiguous subarrays or substrings, such as finding the maximum sum subarray of size k or the longest substring without repeating characters. <strong>Prefix sums</strong> precompute cumulative sums so that the sum of any subarray can be calculated in O(1) time after an O(n) preprocessing step. <strong>Kadane's Algorithm</strong> solves the maximum subarray sum problem in O(n) time by maintaining a running sum and resetting it when it becomes negative.</p>

<h3>Further Reading</h3>
<ul>
  <li><a href="https://www.geeksforgeeks.org/array-data-structure/" target="_blank">GeeksforGeeks – Complete Guide to Arrays</a></li>
  <li><a href="https://leetcode.com/explore/learn/card/fun-with-arrays/" target="_blank">LeetCode – Fun with Arrays (Interactive Course)</a></li>
  <li><a href="https://www.youtube.com/watch?v=QJrGC3yZDVI" target="_blank">NeetCode – Arrays & Hashing Explained (Video)</a></li>
  <li><a href="https://www.programiz.com/dsa/array" target="_blank">Programiz – Array Data Structure</a></li>
</ul>`
  },
  {
    name: "Strings",
    order: 2,
    notes: `<h2>Strings – Mastering Character Sequences</h2>

<p>A string is a sequence of characters, and string manipulation is one of the most frequently tested topics in coding interviews. Strings may seem simple on the surface, but they introduce unique challenges. In many languages like Java and Python, strings are <strong>immutable</strong> — any modification (concatenation, replacement, etc.) creates an entirely new string object in memory, making naive string building operations O(n²) if done inside a loop. Understanding this is critical: for efficient string construction, you should use a StringBuilder (Java), list joining (Python), or array-based approaches.</p>

<p>String problems frequently revolve around a few core techniques. <strong>Character frequency counting</strong> using hash maps is essential for solving anagram problems, checking if two strings are permutations of each other, or finding the first non-repeating character. The <strong>sliding window technique</strong> applied to strings enables solving problems like finding the longest substring without repeating characters or the minimum window substring containing all target characters. <strong>Palindrome detection</strong> — strings that read the same forwards and backwards — is another common theme, solvable by expanding from the center outward (O(n²)) or using Manacher's algorithm (O(n)). For <strong>pattern matching</strong>, the brute force approach is O(n×m), but the KMP (Knuth-Morris-Pratt) algorithm achieves O(n+m) by preprocessing the pattern to avoid re-scanning matched characters, and the Rabin-Karp algorithm uses rolling hash functions for efficient multi-pattern matching.</p>

<p>When working with strings, pay special attention to edge cases: empty strings, strings with only one character, strings with all identical characters, and strings containing special characters or Unicode. Also consider whether the problem requires case sensitivity, and whether leading/trailing whitespace matters. Many string problems can be simplified by first sorting the characters, converting to a character array, or using two pointers from opposite ends.</p>

<h3>Further Reading</h3>
<ul>
  <li><a href="https://www.geeksforgeeks.org/string-data-structure/" target="_blank">GeeksforGeeks – String Data Structure</a></li>
  <li><a href="https://leetcode.com/explore/learn/card/array-and-string/" target="_blank">LeetCode – Array and String Card</a></li>
  <li><a href="https://cp-algorithms.com/string/string-hashing.html" target="_blank">CP-Algorithms – String Hashing</a></li>
  <li><a href="https://www.youtube.com/watch?v=BRO7mVIFt08" target="_blank">Abdul Bari – KMP Algorithm (Video)</a></li>
</ul>`
  },
  {
    name: "Hash Table",
    order: 3,
    notes: `<h2>Hash Tables – O(1) Lookups and Beyond</h2>

<p>A hash table (also known as a hash map or dictionary) is one of the most powerful and widely used data structures in software engineering. It stores key-value pairs and provides <strong>average-case O(1) time complexity</strong> for insertions, deletions, and lookups. This near-instant access is achieved through a <strong>hash function</strong> — a mathematical function that maps each key to a specific index in an underlying array of "buckets." When you insert a key-value pair, the hash function computes the bucket index; when you look up a key, the same function tells you exactly where to find it.</p>

<p>The main challenge with hash tables is <strong>collision handling</strong> — what happens when two different keys map to the same bucket index. There are two primary strategies. <strong>Chaining</strong> stores a linked list (or other collection) at each bucket, so multiple entries can coexist at the same index. <strong>Open addressing</strong> finds an alternative empty slot using probing sequences: linear probing checks the next slot, quadratic probing uses squared offsets, and double hashing applies a second hash function. The <strong>load factor</strong> (ratio of stored entries to total buckets) determines when the table should be resized (rehashed) — typically when it exceeds 0.7-0.75. Rehashing is an O(n) operation that doubles the array size and reinserts all existing entries.</p>

<p>In coding interviews, hash tables appear everywhere. The classic "Two Sum" problem is solved optimally with a hash map in O(n) time by storing complements as you iterate through the array. Frequency counting problems — like finding the most common element, checking for anagrams, or grouping anagrams together — all rely on hash maps. A <strong>HashSet</strong> (a hash table storing only keys, no values) is invaluable for O(1) membership testing, deduplication, and tracking visited states. More advanced applications include using hash maps with prefix sums to find subarrays with a given sum in O(n) time, or implementing an LRU cache by combining a hash map with a doubly linked list.</p>

<h3>Further Reading</h3>
<ul>
  <li><a href="https://www.geeksforgeeks.org/hashing-data-structure/" target="_blank">GeeksforGeeks – Hashing</a></li>
  <li><a href="https://visualgo.net/en/hashtable" target="_blank">VisuAlgo – Hash Table Visualization</a></li>
  <li><a href="https://www.youtube.com/watch?v=KyUTuwz_b7Q" target="_blank">CS Dojo – Hash Tables Explained (Video)</a></li>
</ul>`
  },
  {
    name: "Two Pointers",
    order: 4,
    notes: `<h2>Two Pointers – Elegant Linear-Time Solutions</h2>

<p>The two pointers technique is an algorithmic pattern that uses two indices (or references) to traverse a data structure — typically a sorted array or a linked list — in a way that reduces time complexity from O(n²) brute force to O(n) or O(n log n). The elegance of this approach lies in its simplicity: by strategically moving two pointers based on certain conditions, you can eliminate large portions of the search space in each step without missing valid solutions.</p>

<p>There are several variations of the two pointer pattern. The <strong>opposite-direction approach</strong> places one pointer at the beginning and another at the end of a sorted array, then moves them inward. This is perfect for problems like finding a pair that sums to a target (if the current sum is too small, move the left pointer right to increase it; if too large, move the right pointer left to decrease it), or finding the container with the most water. The <strong>same-direction approach</strong> (also called the fast-and-slow pointer pattern) starts both pointers at the beginning but moves them at different speeds. This is used to remove duplicates from a sorted array in-place (one pointer tracks the write position, the other scans ahead), to detect cycles in a linked list (Floyd's tortoise and hare algorithm), or to find the middle of a linked list. The <strong>three pointers extension</strong> is used for problems like 3Sum, where an outer loop fixes one element and two inner pointers find the remaining pair.</p>

<p>The key to recognizing when two pointers applies is usually: the input is sorted (or can be sorted without losing information), and you need to find pairs or subarrays satisfying some condition. If brute force requires nested loops, two pointers might collapse them into a single pass. Always consider: does moving one pointer in a specific direction definitively eliminate candidates? If yes, two pointers will work.</p>

<h3>Further Reading</h3>
<ul>
  <li><a href="https://www.geeksforgeeks.org/two-pointers-technique/" target="_blank">GeeksforGeeks – Two Pointers Technique</a></li>
  <li><a href="https://leetcode.com/explore/learn/card/array-and-string/205/array-two-pointer-technique/" target="_blank">LeetCode – Two Pointer Technique</a></li>
  <li><a href="https://www.youtube.com/watch?v=On03HWe2tZM" target="_blank">NeetCode – Two Pointers Overview (Video)</a></li>
</ul>`
  },
  {
    name: "Sliding Window",
    order: 5,
    notes: `<h2>Sliding Window – Efficient Subarray and Substring Processing</h2>

<p>The sliding window technique is a powerful method for solving problems that involve finding an optimal contiguous subarray or substring within a larger sequence. Instead of recalculating properties from scratch each time you shift your focus, the sliding window maintains a "window" of elements and efficiently updates its state by adding one element on one side and removing another from the opposite side. This transforms what would typically be an O(n²) or O(n³) brute force into an O(n) solution.</p>

<p>There are two main variants. A <strong>fixed-size sliding window</strong> has a predetermined width — for example, "find the maximum sum of any 5 consecutive elements." You initialize the window with the first 5 elements, compute their sum, then slide: subtract the element leaving the window on the left, add the new element entering on the right. This keeps each update at O(1). A <strong>variable-size sliding window</strong> is more versatile — the window expands and contracts based on conditions. You typically expand the right boundary until a condition is violated, then contract the left boundary until the condition is satisfied again, tracking the optimal answer along the way. This pattern solves problems like "longest substring without repeating characters" (expand right, tracking characters in a hash set; when a duplicate is found, shrink from the left until the duplicate is removed) and "minimum window substring" (expand until all target characters are included, then shrink to find the smallest valid window).</p>

<p>The sliding window often uses auxiliary data structures — a hash map to track character frequencies within the window, a counter for how many conditions are satisfied, or a deque for maintaining the window's maximum. Mastering this technique requires practice recognizing when a problem involves contiguous elements and an optimization criterion over subsets of those elements.</p>

<h3>Further Reading</h3>
<ul>
  <li><a href="https://www.geeksforgeeks.org/window-sliding-technique/" target="_blank">GeeksforGeeks – Sliding Window Technique</a></li>
  <li><a href="https://leetcode.com/tag/sliding-window/" target="_blank">LeetCode – Sliding Window Problems</a></li>
  <li><a href="https://www.youtube.com/watch?v=MK-NZ4hN7rs" target="_blank">NeetCode – Sliding Window (Video)</a></li>
</ul>`
  },
  {
    name: "Linked List",
    order: 6,
    notes: `<h2>Linked Lists – Dynamic Sequential Data</h2>

<p>A linked list is a linear data structure where each element (called a node) contains data and a pointer (or reference) to the next node in the sequence. Unlike arrays, linked lists do not store elements in contiguous memory locations. This fundamental difference gives linked lists a major advantage: <strong>O(1) insertions and deletions</strong> at any known position, because no shifting of elements is required — you simply rewire the pointers. However, this comes at the cost of <strong>O(n) access time</strong>, since reaching the kth element requires traversing from the head through k nodes sequentially.</p>

<p>There are three main types of linked lists. A <strong>singly linked list</strong> has nodes with one pointer (to the next node only), making it memory-efficient but limiting traversal to one direction. A <strong>doubly linked list</strong> has nodes with two pointers (next and previous), enabling bidirectional traversal at the cost of extra memory per node — this is what powers real-world structures like browser history and undo functionality. A <strong>circular linked list</strong> has the last node pointing back to the first, forming a ring — useful for applications like round-robin scheduling or circular buffers.</p>

<p>Several essential techniques apply to linked list problems. The <strong>dummy head node</strong> technique creates a placeholder node before the actual head, which dramatically simplifies edge cases involving insertions or deletions at the beginning of the list. The <strong>fast and slow pointer technique</strong> (Floyd's Cycle Detection) uses two pointers moving at different speeds — the slow pointer moves one step at a time, the fast pointer moves two steps. If there is a cycle, they will eventually meet; if the fast pointer reaches null, there is no cycle. This same technique finds the middle of a linked list (when the fast pointer reaches the end, the slow pointer is at the middle). <strong>Reversing a linked list</strong> is a fundamental operation, accomplished iteratively with three pointers (prev, current, next) or recursively by reversing the rest of the list and adjusting pointers on the way back up the call stack.</p>

<h3>Further Reading</h3>
<ul>
  <li><a href="https://www.geeksforgeeks.org/data-structures/linked-list/" target="_blank">GeeksforGeeks – Linked List</a></li>
  <li><a href="https://leetcode.com/explore/learn/card/linked-list/" target="_blank">LeetCode – Linked List Card</a></li>
  <li><a href="https://visualgo.net/en/list" target="_blank">VisuAlgo – Linked List Visualization</a></li>
</ul>`
  },
  {
    name: "Stack",
    order: 7,
    notes: `<h2>Stacks – Last In, First Out</h2>

<p>A stack is a linear data structure that follows the <strong>Last-In, First-Out (LIFO)</strong> principle — the most recently added element is the first one to be removed. Think of it like a stack of plates: you can only add or remove plates from the top. Stacks support three primary operations, all in O(1) time: <strong>push</strong> (add to the top), <strong>pop</strong> (remove from the top), and <strong>peek</strong> (view the top element without removing it). Despite their simplicity, stacks are incredibly versatile and appear in countless algorithms and system designs.</p>

<p>Stacks are the mechanism behind <strong>function calls and recursion</strong> in programming languages. Every time a function is called, its local variables and return address are pushed onto the call stack; when the function returns, they are popped. This is why infinite recursion causes a "stack overflow" error — the call stack runs out of memory. Understanding this connection between stacks and recursion helps you convert recursive algorithms to iterative ones using explicit stacks, which is particularly useful when recursion depth might be too large.</p>

<p>In coding interviews, stacks are used in several important patterns. <strong>Bracket matching</strong> (valid parentheses) pushes opening brackets onto the stack and pops when a matching closing bracket is found. <strong>Expression evaluation</strong> (like Reverse Polish Notation) uses a stack to hold operands and applies operators as they appear. The <strong>monotonic stack</strong> pattern is especially powerful — it maintains elements in sorted order (either increasing or decreasing) and is used to solve "next greater element," "daily temperatures," "largest rectangle in histogram," and "trapping rain water" problems in O(n) time. The key insight is: when a new element violates the monotonic property, you pop elements and process them, knowing they have found their "answer."</p>

<h3>Further Reading</h3>
<ul>
  <li><a href="https://www.geeksforgeeks.org/stack-data-structure/" target="_blank">GeeksforGeeks – Stack Data Structure</a></li>
  <li><a href="https://leetcode.com/explore/learn/card/queue-stack/" target="_blank">LeetCode – Queue & Stack Card</a></li>
  <li><a href="https://www.youtube.com/watch?v=WTzjTskDFMg" target="_blank">NeetCode – Stack Problems (Video)</a></li>
</ul>`
  },
  {
    name: "Queue",
    order: 8,
    notes: `<h2>Queues – First In, First Out</h2>

<p>A queue is a linear data structure that follows the <strong>First-In, First-Out (FIFO)</strong> principle — the earliest added element is the first one to be removed, just like a real-world line at a store. The two primary operations are <strong>enqueue</strong> (add to the rear) and <strong>dequeue</strong> (remove from the front), both running in O(1) time. Queues are essential in scenarios where order of processing matters: task scheduling, print job management, message passing between processes, and especially Breadth-First Search (BFS) in graphs and trees.</p>

<p>Several specialized queue variants exist for different use cases. A <strong>deque (double-ended queue)</strong> allows insertion and removal from both ends in O(1), making it a superset of both stacks and queues. Deques are particularly useful for the "sliding window maximum" problem, where you maintain a monotonic deque to track the maximum element in the current window. A <strong>priority queue</strong> orders elements not by insertion time but by priority (typically implemented using a heap), allowing you to always extract the highest (or lowest) priority element efficiently. A <strong>circular queue</strong> (or ring buffer) wraps around when it reaches the end of the underlying array, efficiently reusing vacated space at the front — this is how operating systems implement fixed-size buffers for I/O operations.</p>

<p>The most important application of queues in algorithm design is <strong>BFS traversal</strong>. BFS explores a graph level by level by adding all neighbors of the current node to the queue, ensuring that closer nodes are visited before farther ones. This property makes BFS the go-to algorithm for finding shortest paths in unweighted graphs, performing level-order tree traversal, or solving "minimum steps" problems in grids. Multi-source BFS extends this by starting from multiple nodes simultaneously, useful for problems like "rotting oranges" or "walls and gates."</p>

<h3>Further Reading</h3>
<ul>
  <li><a href="https://www.geeksforgeeks.org/queue-data-structure/" target="_blank">GeeksforGeeks – Queue Data Structure</a></li>
  <li><a href="https://visualgo.net/en/list" target="_blank">VisuAlgo – Queue Visualization</a></li>
  <li><a href="https://www.programiz.com/dsa/queue" target="_blank">Programiz – Queue Tutorial</a></li>
</ul>`
  },
  {
    name: "Binary Search",
    order: 9,
    notes: `<h2>Binary Search – Divide and Conquer on Sorted Data</h2>

<p>Binary search is one of the most elegant algorithms in computer science. Given a <strong>sorted</strong> array, it finds a target value — or determines its absence — in O(log n) time by repeatedly halving the search space. At each step, you compare the target with the middle element: if they match, you are done; if the target is smaller, you discard the right half; if larger, you discard the left half. This logarithmic efficiency is remarkable — searching through one billion sorted elements requires only about 30 comparisons.</p>

<p>The classic implementation seems straightforward, but the devil is in the details. Off-by-one errors are the most common pitfall. Should your loop condition be <code>left &lt;= right</code> or <code>left &lt; right</code>? Should you compute mid as <code>(left + right) / 2</code> (which can cause integer overflow in languages like Java and C++) or as <code>left + (right - left) / 2</code> (which is safe)? Should your return value be <code>left</code>, <code>right</code>, or <code>mid</code>? The answers depend on whether you are searching for an exact match, the leftmost occurrence (lower bound), or the rightmost occurrence (upper bound). Practicing these variations until they become second nature is essential for interview success.</p>

<p>Beyond searching sorted arrays, binary search has a powerful extension called <strong>"binary search on the answer"</strong> (or "binary search on the solution space"). Instead of searching within the data, you binary-search over possible answers and check whether each candidate is feasible. For example, "find the minimum speed to eat all bananas within h hours" — you binary search over possible speeds (from 1 to max pile size) and check if each speed allows finishing in time. This pattern applies whenever the feasibility function is monotonic: once an answer works, all larger (or smaller) answers also work. Problems like "split array largest sum," "capacity to ship packages within d days," and "koko eating bananas" all use this approach.</p>

<h3>Further Reading</h3>
<ul>
  <li><a href="https://www.geeksforgeeks.org/binary-search/" target="_blank">GeeksforGeeks – Binary Search</a></li>
  <li><a href="https://leetcode.com/explore/learn/card/binary-search/" target="_blank">LeetCode – Binary Search Card</a></li>
  <li><a href="https://www.topcoder.com/thrive/articles/Binary%20Search" target="_blank">TopCoder – Binary Search Tutorial</a></li>
  <li><a href="https://www.youtube.com/watch?v=W9QJ8HaRvJQ" target="_blank">Errichto – Binary Search (Video)</a></li>
</ul>`
  },
  {
    name: "Sorting",
    order: 10,
    notes: `<h2>Sorting – Organizing Data Efficiently</h2>

<p>Sorting is the process of arranging elements in a specific order (typically ascending or descending), and it is one of the most studied problems in computer science. Understanding sorting algorithms is fundamental because sorting often serves as a preprocessing step that enables other algorithms to work efficiently — binary search requires sorted input, many greedy algorithms depend on sorted order, and duplicate detection becomes trivial with sorted data.</p>

<p>The simplest sorting algorithms — <strong>Bubble Sort</strong>, <strong>Selection Sort</strong>, and <strong>Insertion Sort</strong> — all run in O(n²) time in the worst case. Despite their inefficiency for large datasets, Insertion Sort is actually the fastest for <em>nearly sorted</em> data (O(n) best case) and for very small arrays (typically n &lt; 16), which is why hybrid algorithms like Timsort use it as a subroutine. The efficient comparison-based sorts — <strong>Merge Sort</strong> and <strong>Quick Sort</strong> — achieve O(n log n) average-case performance. Merge Sort divides the array in half recursively, sorts each half, then merges them — it is stable (preserves relative order of equal elements) and guarantees O(n log n) in all cases, but requires O(n) extra space. Quick Sort selects a pivot, partitions elements around it, and recursively sorts the partitions — it is in-place (O(log n) space for recursion) and typically faster in practice due to cache friendliness, but degrades to O(n²) with poor pivot choices (mitigated by randomized pivot selection). <strong>Heap Sort</strong> uses a max-heap to repeatedly extract the maximum element, achieving O(n log n) in all cases with O(1) extra space, but it is not stable and has poor cache behavior.</p>

<p>Non-comparison sorts like <strong>Counting Sort</strong> (O(n+k)), <strong>Radix Sort</strong> (O(d×(n+k))), and <strong>Bucket Sort</strong> (O(n) average) can beat the O(n log n) lower bound of comparison sorts when the input has known constraints on its range or distribution. It is worth noting that most programming languages provide built-in sort functions (Arrays.sort in Java, sorted() in Python, Array.sort in JavaScript) that use highly optimized hybrid algorithms — in interviews, you should know when to use built-in sorts and when you need to understand the underlying mechanics.</p>

<h3>Further Reading</h3>
<ul>
  <li><a href="https://www.geeksforgeeks.org/sorting-algorithms/" target="_blank">GeeksforGeeks – Sorting Algorithms</a></li>
  <li><a href="https://visualgo.net/en/sorting" target="_blank">VisuAlgo – Sorting Visualization</a></li>
  <li><a href="https://www.youtube.com/watch?v=kPRA0W1kECg" target="_blank">CS50 – Sorting Algorithms (Video)</a></li>
</ul>`
  },
  {
    name: "Recursion",
    order: 11,
    notes: `<h2>Recursion – Solving Problems by Solving Smaller Versions</h2>

<p>Recursion is a problem-solving technique where a function calls itself to break down a complex problem into simpler, identical sub-problems. Every recursive function has two essential components: a <strong>base case</strong> that provides an immediate answer for the simplest input (stopping the recursion), and a <strong>recursive case</strong> that reduces the problem size and calls the function again. For example, computing factorial: the base case is factorial(0) = 1, and the recursive case is factorial(n) = n × factorial(n-1). The function keeps calling itself with smaller values until it hits the base case, then the results cascade back up the call chain.</p>

<p>Under the hood, each recursive call is placed on the <strong>call stack</strong> — a region of memory that stores each function's local variables, parameters, and return address. This means recursion inherently uses O(d) space where d is the maximum depth of recursion. If the recursion is too deep (e.g., computing fibonacci(100000) naively), the call stack overflows and the program crashes. This is why it is important to consider whether a recursive solution can be converted to an iterative one using an explicit stack, or whether <strong>tail recursion</strong> (where the recursive call is the very last operation) can be optimized by the compiler to reuse the same stack frame.</p>

<p>Recursion is the natural way to think about many categories of problems. Any problem involving <strong>trees</strong> (binary trees, tries, etc.) is inherently recursive because a tree is defined recursively — a tree is a root node connected to subtrees. <strong>Divide and conquer</strong> algorithms (merge sort, quick sort) use recursion to split, solve, and combine. <strong>Backtracking</strong> algorithms (generating permutations, solving Sudoku, N-Queens) use recursion to explore decision trees. When you encounter a problem where the solution depends on solutions to smaller instances of the same problem, recursion is likely the right approach. To analyze recursive algorithms, use recurrence relations and the Master Theorem to determine time complexity.</p>

<h3>Further Reading</h3>
<ul>
  <li><a href="https://www.geeksforgeeks.org/introduction-to-recursion-data-structure-and-algorithm-tutorials/" target="_blank">GeeksforGeeks – Recursion Tutorial</a></li>
  <li><a href="https://www.youtube.com/watch?v=IJDJ0kBx2LM" target="_blank">freeCodeCamp – Recursion in Programming (Video)</a></li>
  <li><a href="https://www.programiz.com/dsa/recursion" target="_blank">Programiz – Recursion</a></li>
</ul>`
  },
  {
    name: "Backtracking",
    order: 12,
    notes: `<h2>Backtracking – Systematic Exploration with Pruning</h2>

<p>Backtracking is an algorithmic technique that incrementally builds candidates for a solution and abandons ("backtracks" from) a candidate as soon as it determines that the candidate cannot possibly lead to a valid or optimal solution. It is essentially a depth-first search through the space of all possible solutions, enhanced with intelligent pruning to avoid exploring obviously fruitless paths. Without pruning, backtracking degenerates into brute-force enumeration; with effective pruning, it can solve problems that seem computationally infeasible.</p>

<p>The mental model for backtracking is a <strong>decision tree</strong>. At each node, you make a choice (e.g., include this element or exclude it, place a queen in this column, assign this color to this vertex). Each choice leads to a branch — a deeper level of the tree. If at any point the current partial solution violates a constraint (e.g., two queens attack each other, the current subset sum exceeds the target), you immediately prune that entire branch and return to the parent node to try the next option. This "try, check, undo" pattern is the essence of backtracking. The typical code structure involves three steps inside a recursive function: (1) check if the current state is a complete valid solution and record it; (2) iterate over possible next choices; (3) for each choice, make it, recurse deeper, then undo it (backtrack) before trying the next choice.</p>

<p>Classic backtracking problems include the <strong>N-Queens problem</strong> (place N queens on an N×N chessboard so none attack each other), <strong>Sudoku Solver</strong> (fill a 9×9 grid following Sudoku rules), generating all <strong>permutations and combinations</strong> of a set, the <strong>Word Search</strong> problem (find a word path in a character grid), and <strong>Combination Sum</strong> (find all unique combinations that sum to a target). The time complexity of backtracking varies widely — in the worst case it is exponential (e.g., O(n!) for permutations), but effective pruning often makes it practical for reasonable input sizes.</p>

<h3>Further Reading</h3>
<ul>
  <li><a href="https://www.geeksforgeeks.org/backtracking-algorithms/" target="_blank">GeeksforGeeks – Backtracking</a></li>
  <li><a href="https://leetcode.com/tag/backtracking/" target="_blank">LeetCode – Backtracking Problems</a></li>
  <li><a href="https://www.youtube.com/watch?v=Zq4upTEaQyM" target="_blank">NeetCode – Backtracking (Video)</a></li>
</ul>`
  },
  {
    name: "Dynamic Programming",
    order: 13,
    notes: `<h2>Dynamic Programming – Optimizing Overlapping Sub-Problems</h2>

<p>Dynamic programming (DP) is an optimization technique for solving problems that exhibit two key properties: <strong>optimal substructure</strong> (the optimal solution to the problem contains optimal solutions to its sub-problems) and <strong>overlapping sub-problems</strong> (the same sub-problems are solved repeatedly in a naive recursive approach). By storing the results of sub-problems and reusing them instead of recomputing, DP transforms exponential-time recursive solutions into polynomial-time algorithms. For example, naive recursive Fibonacci runs in O(2ⁿ), but DP reduces it to O(n) by storing each Fibonacci number once.</p>

<p>There are two fundamental approaches to implementing DP. <strong>Top-down (memoization)</strong> starts with the original problem and recursively breaks it into sub-problems, caching results in a hash map or array the first time each sub-problem is solved. This is often the more intuitive approach because it mirrors the natural recursive thinking. <strong>Bottom-up (tabulation)</strong> starts from the smallest sub-problems and iteratively builds up to the original problem using a table (array). This approach eliminates recursion overhead and often enables <strong>space optimization</strong> — for example, if each state depends only on the previous row of the table, you can keep only two rows in memory instead of the entire table, reducing space from O(n²) to O(n).</p>

<p>DP problems fall into several recognizable patterns. The <strong>0/1 Knapsack pattern</strong> asks whether to include or exclude each item (Subset Sum, Partition Equal Subset Sum, Target Sum). The <strong>Unbounded Knapsack pattern</strong> allows items to be used multiple times (Coin Change, Rod Cutting). <strong>Longest Common Subsequence (LCS)</strong> and <strong>Longest Increasing Subsequence (LIS)</strong> compare sequences to find optimal matches. <strong>Grid DP</strong> involves navigating a 2D matrix with constraints (Unique Paths, Minimum Path Sum). <strong>String DP</strong> handles problems like Edit Distance, Regular Expression Matching, and Palindrome Partitioning. The key to mastering DP is identifying the "state" (what information uniquely defines a sub-problem) and the "transition" (how to combine solutions of smaller sub-problems into the current one). Practice is essential — DP is widely considered the most challenging interview topic, but with pattern recognition, it becomes highly systematic.</p>

<h3>Further Reading</h3>
<ul>
  <li><a href="https://www.geeksforgeeks.org/dynamic-programming/" target="_blank">GeeksforGeeks – Dynamic Programming</a></li>
  <li><a href="https://leetcode.com/explore/learn/card/dynamic-programming/" target="_blank">LeetCode – DP Explore Card</a></li>
  <li><a href="https://www.youtube.com/watch?v=oBt53YbR9Kk" target="_blank">freeCodeCamp – Dynamic Programming Full Course (Video)</a></li>
  <li><a href="https://atcoder.jp/contests/dp/tasks" target="_blank">AtCoder – Educational DP Contest (26 Practice Problems)</a></li>
</ul>`
  }
];

export default topics;
