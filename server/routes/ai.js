// routes/ai.js
import express from 'express';
import { auth } from '../middleware/auth.js'; // Assuming auth middleware is correctly set up
import Problem from '../models/Problem.js'; // Assuming Problem model is correct
import { getAIHelp } from '../services/aiService.js'; // Make sure this path is correct

const router = express.Router();

// POST /api/ai-help
router.post('/', auth, async (req, res) => {
  try {
    const { problemId, userQuery, conversationHistory, currentCode } = req.body;

    if (!problemId || !userQuery) {
      return res.status(400).json({
        message: 'Problem ID and user query are required.'
      });
    }

    const problem = await Problem.findById(problemId).lean(); // .lean() for plain JS object
    if (!problem) {
      return res.status(404).json({ message: 'Problem not found.' });
    }

    // Ensure conversationHistory is an array, even if not provided
    const history = Array.isArray(conversationHistory) ? conversationHistory : [];

    const aiResponseText = await getAIHelp(
      problem, // Pass the full problem object (title, statement, etc.)
      userQuery,
      history,
      currentCode
    );

    res.json({ aiResponse: aiResponseText }); // Send back just the text content

  } catch (error) {
    // Log the detailed error on the server for debugging
    console.error('Error in /ai-help route:', error.message);
    // Send a generic error message to the client
    res.status(500).json({
      aiResponse: 'Sorry, an unexpected error occurred while trying to get AI help. Please try again.'
    });
  }
});

export default router;