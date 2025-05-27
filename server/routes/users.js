import express from 'express';
import User from '../models/User.js';
import Submission from '../models/Submission.js';
import Problem from '../models/Problem.js';
import { auth, adminAuth } from '../middleware/auth.js';

const router = express.Router();

// Get user progress
router.get('/me/progress', auth, async (req, res) => {
  try {
    const userId = req.user._id;
    
    // Get all accepted submissions
    const acceptedSubmissions = await Submission.find({
      userId,
      status: 'Accepted'
    }).distinct('problemId');
    
    // Count problems by difficulty
    const problems = await Problem.find();
    const easyProblems = problems.filter(p => p.difficulty === 'Easy');
    const mediumProblems = problems.filter(p => p.difficulty === 'Medium');
    const hardProblems = problems.filter(p => p.difficulty === 'Hard');
    
    // Count solved problems by difficulty
    const solvedProblems = await Problem.find({
      _id: { $in: acceptedSubmissions }
    });
    
    const easySolved = solvedProblems.filter(p => p.difficulty === 'Easy').length;
    const mediumSolved = solvedProblems.filter(p => p.difficulty === 'Medium').length;
    const hardSolved = solvedProblems.filter(p => p.difficulty === 'Hard').length;
    
    // Calculate ranking (simplified)
    // In a real app, this would be more complex and possibly pre-calculated
    const allUsers = await User.find();
    const userSubmissionCounts = await Promise.all(
      allUsers.map(async (user) => {
        const count = await Submission.find({
          userId: user._id,
          status: 'Accepted'
        }).distinct('problemId').countDocuments();
        return { userId: user._id, count };
      })
    );
    
    userSubmissionCounts.sort((a, b) => b.count - a.count);
    const ranking = userSubmissionCounts.findIndex(u => 
      u.userId.toString() === userId.toString()
    ) + 1;
    
    res.json({
      totalSolved: acceptedSubmissions.length,
      easySolved,
      mediumSolved,
      hardSolved,
      easyTotal: easyProblems.length,
      mediumTotal: mediumProblems.length,
      hardTotal: hardProblems.length,
      streak: req.user.streak,
      ranking
    });
  } catch (error) {
    console.error('Get progress error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get solved problems
router.get('/me/solved-problems', auth, async (req, res) => {
  try {
    const userId = req.user._id;
    
    // Get all accepted submissions
    const acceptedSubmissions = await Submission.find({
      userId,
      status: 'Accepted'
    }).sort({ submissionTime: -1 });
    
    // Get unique problem IDs
    const uniqueProblemIds = [...new Set(
      acceptedSubmissions.map(sub => sub.problemId.toString())
    )];
    
    // Get problem details
    const problems = await Problem.find({
      _id: { $in: uniqueProblemIds }
    }).select('title difficulty tags');
    
    // Map problems with submission details
    const solvedProblems = uniqueProblemIds.map(problemId => {
      const problem = problems.find(p => p._id.toString() === problemId);
      const submission = acceptedSubmissions.find(
        sub => sub.problemId.toString() === problemId
      );
      
      return {
        id: problem._id,
        title: problem.title,
        difficulty: problem.difficulty,
        tags: problem.tags,
        solvedAt: submission.submissionTime,
        language: submission.language
      };
    });
    
    res.json(solvedProblems);
  } catch (error) {
    console.error('Get solved problems error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get user submissions for a problem
router.get('/me/problems/:problemId/submissions', auth, async (req, res) => {
  try {
    const userId = req.user._id;
    const { problemId } = req.params;
    
    const submissions = await Submission.find({
      userId,
      problemId
    }).sort({ submissionTime: -1 });
    
    res.json(submissions);
  } catch (error) {
    console.error('Get submissions error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Admin routes
router.get('/', adminAuth, async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;