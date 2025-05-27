import express from 'express';
import { auth } from '../middleware/auth.js';
import Problem from '../models/Problem.js';
import { runCode } from '../services/codeExecution.js';

const router = express.Router();

// Run code (not a formal submission)
router.post('/', auth, async (req, res) => {
  try {
    const { problemId, language, code, customInput } = req.body;
    
    // Validate input
    if (!problemId || !language || !code) {
      return res.status(400).json({ 
        message: 'Problem ID, language, and code are required' 
      });
    }
    
    // Get problem
    const problem = await Problem.findById(problemId);
    if (!problem) {
      return res.status(404).json({ message: 'Problem not found' });
    }
    
    // Run the code
    const result = await runCode(code, language, customInput || '', problem.timeLimit, problem.memoryLimit);
    
    res.json(result);
  } catch (error) {
    console.error('Run code error:', error);
    res.status(500).json({ 
      error: 'Failed to run code. Please try again.' 
    });
  }
});

export default router;