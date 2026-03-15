import express from "express";
import Problem from "../models/Problem.js";
import Submission from "../models/Submission.js";
import { auth, adminAuth } from "../middleware/auth.js";
import mongoose from 'mongoose';
import { generateProblemSummary } from "../services/aiService.js";


const router = express.Router();

// Get all problems with filtering
// In backend/routes/problems.js

// Get all problems with filtering, pagination, and status
router.get("/", async (req, res) => {
  try {
    const {
      difficulty,
      topic, // Note: Your current query filters by tag using 'topic'. If you want to filter by the topic ID reference, you'd need to change 'query.tags = topic;' to 'query.topic = topic;'
      search,
      status,
      page = 1,
      limit = 20,
    } = req.query;
    const query = {};

    // Apply filters
    if (difficulty && difficulty !== "all") {
      query.difficulty = difficulty;
    }

     
     if (topic && mongoose.Types.ObjectId.isValid(topic)) {
         query.topic = topic;
     } else if (topic) {
         
     }
     


    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { tags: { $regex: search, $options: "i" } }, 
      ];
    }

    // --- Pagination and Total Count ---
    // Calculate total documents matching the query
    const totalProblems = await Problem.countDocuments(query);
    const totalPages = Math.ceil(totalProblems / limit);

    // Pagination skip
    const skip = (page - 1) * limit;

    // Execute query with population and pagination
    const problems = await Problem.find(query)
      .populate('topic', 'name') 
      .sort({ createdAt: -1 })
      .skip(skip) 
      .limit(limit);

    // Add status for authenticated users and prepare final data structure
    let problemsWithStatus = problems; 

    if (req.user) {
      const userId = req.user._id;
      const submissions = await Submission.find({
        userId,
        problemId: { $in: problems.map((p) => p._id) },
      });

      const problemStatus = {};

      submissions.forEach((sub) => {
        const problemId = sub.problemId.toString();
        if (
          !problemStatus[problemId] ||
          problemStatus[problemId] !== "solved"
        ) {
          problemStatus[problemId] =
            sub.status === "Accepted" ? "solved" : "attempted";
        }
      });

       // --- Map problems to add status and topicName ---
      problemsWithStatus = problems.map((problem) => {
        const p = problem.toObject(); // Convert Mongoose document to plain object

        // Add the status property
        p.status = problemStatus[problem._id.toString()] || "unsolved";

        // Add the topicName property from the populated topic
        // problem.topic will be either null or the populated topic object { _id, name }
        p.topicName = problem.topic ? problem.topic.name : null; // Add topicName


        return p;
      });
      

    } else {
        // If not authenticated, still map problems to add topicName
         problemsWithStatus = problems.map((problem) => {
            const p = problem.toObject();
             p.topicName = problem.topic ? problem.topic.name : null;
            return p;
         });
    }


    
    res.json({
      problems: problemsWithStatus, 
      totalPages: totalPages, 
      currentPage: page, 
      totalProblems: totalProblems 
    });
    

  } catch (error) {
    console.error("Get problems error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Get a specific problem
router.get("/:id", async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid problem ID" });
  }

  try {
    const problem = await Problem.findById(id);
    if (!problem) {
      return res.status(404).json({ message: "Problem not found" });
    }

    const sanitizedProblem = problem.toObject();
    sanitizedProblem.testCases = problem.testCases
      .filter((tc) => tc.isVisible)
      .map((tc) => ({ input: tc.input, expectedOutput: tc.expectedOutput }));

    res.json(sanitizedProblem);
  } catch (error) {
    console.error("Get problem error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Get generated summary for a problem
router.get("/:id/generated-summary", async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "Invalid problem ID" });
    }

    const problem = await Problem.findById(req.params.id).lean();
    if (!problem) {
      return res.status(404).json({ message: "Problem not found" });
    }

    const summary = await generateProblemSummary(problem);
    res.json({ summary });
  } catch (error) {
    console.error("Generate summary error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Get solution for a problem
router.get("/:id/solution", auth, async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "Invalid problem ID" });
    }

    const problem = await Problem.findById(req.params.id);

    if (!problem) {
      return res.status(404).json({ message: "Problem not found" });
    }

    // Check if user has solved the problem or is admin
    if (req.user.role !== "admin") {
      const hasSolved = await Submission.exists({
        userId: req.user._id,
        problemId: problem._id,
        status: "Accepted",
      });

      if (!hasSolved) {
        return res.status(403).json({
          message: "Solve the problem first to view the solution",
        });
      }
    }

    res.json(problem.solution);
  } catch (error) {
    console.error("Get solution error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Admin routes for problem management
router.post("/", adminAuth, async (req, res) => {
  try {
    const problem = new Problem(req.body);
    await problem.save();
    res.status(201).json(problem);
  } catch (error) {
    console.error("Create problem error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

router.put("/:id", adminAuth, async (req, res) => {
  try {
    const problem = await Problem.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    if (!problem) {
      return res.status(404).json({ message: "Problem not found" });
    }

    res.json(problem);
  } catch (error) {
    console.error("Update problem error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

router.delete("/:id", adminAuth, async (req, res) => {
  try {
    const problem = await Problem.findByIdAndDelete(req.params.id);

    if (!problem) {
      return res.status(404).json({ message: "Problem not found" });
    }

    // Also delete all submissions for this problem
    await Submission.deleteMany({ problemId: req.params.id });

    res.json({ message: "Problem deleted successfully" });
  } catch (error) {
    console.error("Delete problem error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
