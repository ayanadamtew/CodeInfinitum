import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js'; 
import Problem from './models/Problem.js'; 
import Topic from './models/Topic.js';  

dotenv.config();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Sample data
const topics = [
  { name: 'Arrays', notes: "Arrays are a fundamental data structure..." },
  { name: 'Linked Lists', notes: 'Linked lists are linear data structures...' },
  {
  name: 'Trees',
  notes: `
🌳 Trees in DSA

✅ Definition:
A Tree is a non-linear hierarchical data structure consisting of nodes connected by edges. It is used to represent data with a hierarchical relationship (e.g., file system, organization charts).

🧩 Key Terminology:
- Node: An individual element in a tree.
- Root: The topmost node in a tree.
- Edge: The link between parent and child nodes.
- Parent: A node with one or more child nodes.
- Child: A node that descends from a parent.
- Leaf: A node without children.
- Sibling: Nodes that share the same parent.
- Depth: Distance from the root node.
- Height: Length of the longest path to a leaf.
- Subtree: A tree formed from any node and its descendants.

📂 Types of Trees:
1. Binary Tree – Each node has at most 2 children.
2. Binary Search Tree (BST) – Left < Root < Right.
3. Balanced Tree – Height-balanced for better performance.
4. Full Binary Tree – Every node has 0 or 2 children.
5. Complete Binary Tree – All levels filled, last from left.
6. Perfect Binary Tree – All internal nodes have 2 children, all leaves are at the same level.
7. AVL Tree – Self-balancing BST with height difference ≤ 1.
8. Heap – Complete tree (Max or Min Heap).
9. Trie – Prefix tree for string search.

🔁 Traversal Techniques:
1. DFS:
   - Inorder (LNR)
   - Preorder (NLR)
   - Postorder (LRN)
2. BFS:
   - Level Order using Queue

🧠 Common Operations:
- Insertion: O(log n) in BST
- Deletion: O(log n) in BST
- Searching: O(log n) in BST
- Traversals: O(n)

🎯 Applications:
- File systems
- Expression evaluation
- Routing algorithms
- Database indexing (B-tree)
- AI (Decision trees)

`
}

  // Add more topics
];

const problems = [
  {
    title: 'Two Sum',
    topicName: 'Arrays',            
    statement: '<p>Given an array of integers <code>nums</code> and an integer <code>target</code>, return indices of the two numbers such that they add up to <code>target</code>.</p>',
    difficulty: 'Easy',
    tags: ['Arrays', 'Hash Table'],
    examples: [
      {
        input: 'nums = [2,7,11,15], target = 9',
        output: '[0,1]',
        explanation: 'Because nums[0] + nums[1] == 9, we return [0, 1].'
      }
    ],
    constraints: [
      '2 <= nums.length <= 10^4',
      '-10^9 <= nums[i] <= 10^9',
      '-10^9 <= target <= 10^9',
      'Only one valid answer exists.'
    ],
    initialCode: {
      javascript: 'function twoSum(nums, target) {\n    // Your code here\n}',
      python: 'def twoSum(nums, target):\n    # Your code here\n    pass',
      java: 'class Solution {\n    public int[] twoSum(int[] nums, int target) {\n        // Your code here\n    }\n}',
      cpp: '#include <vector>\n\nclass Solution {\npublic:\n    std::vector<int> twoSum(std::vector<int>& nums, int target) {\n        // Your code here\n    }\n};'
    },
    testCases: [
      {
        input: '[2,7,11,15]\n9',
        expectedOutput: '[0,1]',
        isVisible: true
      },
      {
        input: '[3,2,4]\n6',
        expectedOutput: '[1,2]',
        isVisible: true
      }
    ],
    solution: {
      explanation: '<p>We can use a hash map to solve this problem in O(n) time...</p>',
      code: {
        javascript: 'function twoSum(nums, target) {\n    const map = new Map();\n    for (let i = 0; i < nums.length; i++) {\n        const complement = target - nums[i];\n        if (map.has(complement)) {\n            return [map.get(complement), i];\n        }\n        map.set(nums[i], i);\n    }\n    return [];\n}'
      },
      complexity: {
        time: 'O(n)',
        space: 'O(n)'
      }
    }
  }
];

// Admin user data
const adminUser = {
    username: 'admin',
    email: 'admin@example.com',
    password: 'adminpassword123', 
    role: 'admin'
};

// Seed function
async function seedDatabase() {
  try {
    console.log('Clearing existing data...');
    // Clear existing data (Users, Topics, Problems)
    await User.deleteMany({});
    await Topic.deleteMany({});
    await Problem.deleteMany({});
    console.log('Existing data cleared.');

    // Insert admin user
    console.log('Inserting admin user...');
    const createdAdmin = await User.create(adminUser);
    console.log(`Admin user created: ${createdAdmin.username} (${createdAdmin.email})`);
    
    // Insert topics
    console.log('Inserting topics...');
    const insertedTopics = await Topic.insertMany(topics);
    console.log(`${insertedTopics.length} topics inserted`);

    // Build topic name 
    const topicMap = {};
    insertedTopics.forEach(t => {
      topicMap[t.name] = t._id;
    });

    // Assign topic IDs to problems
    const problemsWithIds = problems.map(p => {
      return {
        ...p,
        topic: topicMap[p.topicName],
      };
    });
    // Insert problems
    console.log('Inserting problems...');
    const insertedProblems = await Problem.insertMany(problemsWithIds);
    console.log(`${insertedProblems.length} problems inserted`);
    
    console.log('Database seeded successfully');
  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    mongoose.disconnect();
  }
}

seedDatabase();
