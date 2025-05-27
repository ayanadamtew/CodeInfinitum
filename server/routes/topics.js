import express from "express";
import Topic from "../models/Topic.js";
import { adminAuth } from "../middleware/auth.js";
import mongoose from 'mongoose';
import Problem from "../models/Problem.js";


const router = express.Router();

// Get all topics
router.get("/", async (req, res) => {
  try {
    const topics = await Topic.find().sort({ order: 1 });
    res.json(topics);
  } catch (error) {
    console.error("Get topics error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Get a specific topic
router.get("/:id", async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid topic ID" });
  }

  try {
    const topic = await Topic.findById(id);
    if (!topic) {
      return res.status(404).json({ message: "Topic not found" });
    }
    res.json(topic);
  } catch (error) {
    console.error("Get topic error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Get notes for a specific topic
router.get("/:id/notes", async (req, res) => {
  try {
    const topic = await Topic.findById(req.params.id);

    if (!topic) {
      return res.status(404).json({ message: "Topic not found" });
    }

    res.json({ notes: topic.notes });
  } catch (error) {
    console.error("Get topic notes error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/:id/problems", async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: "Invalid topic ID" });
    }

    try {
        // Find problems where the 'topic' field matches the topic ID
        // Assuming your Problem model has a field named 'topic' that stores the ObjectId of the Topic
        const problems = await Problem.find({ topic: id }).sort({ createdAt: 1 }); // You might want to sort problems

        // Optionally, check if the topic itself exists, though finding problems by topic ID is often sufficient
        const topic = await Topic.findById(id);
        if (!topic) {
          return res.status(404).json({ message: "Topic not found" });
        }

        res.json(problems); // Respond with the array of problems
    } catch (error) {
        console.error(`Get problems for topic ${id} error:`, error);
        res.status(500).json({ message: "Server error" });
    }
});

// Admin routes for topic management
router.post("/", adminAuth, async (req, res) => {
  try {
    const existing = await Topic.findOne({ name: req.body.name.trim() });
    if (existing) {
      return res.status(400).json({ message: "Topic with this name already exists." });
    }

    const topic = new Topic(req.body);
    await topic.save();
    res.status(201).json(topic);
  } catch (error) {
    console.error("Create topic error:", error);
    if (error.code === 11000) {
      res.status(400).json({ message: "Topic name must be unique." });
    } else {
      res.status(500).json({ message: "Server error" });
    }
  }
});


router.put("/:id", adminAuth, async (req, res) => {
  try {
    const topic = await Topic.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    if (!topic) {
      return res.status(404).json({ message: "Topic not found" });
    }

    res.json(topic);
  } catch (error) {
    console.error("Update topic error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

router.delete("/:id", adminAuth, async (req, res) => {
  try {
    const topic = await Topic.findByIdAndDelete(req.params.id);

    if (!topic) {
      return res.status(404).json({ message: "Topic not found" });
    }

    res.json({ message: "Topic deleted successfully" });
  } catch (error) {
    console.error("Delete topic error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
