import express from 'express';
import { auth } from '../middleware/auth.js';
import Problem from '../models/Problem.js';
import Submission from '../models/Submission.js';
import { judgeSubmission } from '../services/judgeService.js';

const router = express.Router();

// Submit code for judging
router.post('/', auth, async (req, res) => {
  try {
    const { problemId, language, code } = req.body;
    const userId = req.user._id;
    
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
    
    // Create submission record
    const submission = new Submission({
      userId,
      problemId,
      language,
      code,
      status: 'Pending'
    });
    
    await submission.save();
    
    // Start judging process (async)
    judgeSubmission(submission._id, problem);
    
    res.status(202).json({ 
      submissionId: submission._id,
      status: 'Pending'
    });
  } catch (error) {
    console.error('Submit code error:', error);
    res.status(500).json({ 
      error: 'Failed to submit code. Please try again.' 
    });
  }
});

// Get submission status
router.get('/:id', auth, async (req, res) => {
  try {
    const submission = await Submission.findById(req.params.id);
    
    if (!submission) {
      return res.status(404).json({ message: 'Submission not found' });
    }
    
    // Check if user owns the submission or is admin
    if (submission.userId.toString() !== req.user._id.toString() && 
        req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }
    
    res.json(submission);
  } catch (error) {
    console.error('Get submission error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;