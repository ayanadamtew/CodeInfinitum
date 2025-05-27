import Submission from '../models/Submission.js';
import { runCode } from './codeExecution.js';

// Judge a submission against all test cases
export async function judgeSubmission(submissionId, problem) {
  try {
    // Get the submission
    const submission = await Submission.findById(submissionId);
    if (!submission) {
      console.error(`Submission ${submissionId} not found`);
      return;
    }
    
    // Update status to Running
    submission.status = 'Running';
    await submission.save();
    
    // Get test cases
    const testCases = problem.testCases || [];
    
    if (testCases.length === 0) {
      submission.status = 'Error';
      await submission.save();
      console.error(`No test cases found for problem ${problem._id}`);
      return;
    }
    
    // Initialize results array
    const results = [];
    let overallStatus = 'Accepted';
    let maxExecutionTime = 0;
    let maxMemoryUsage = 0;
    
    // Run each test case
    for (const testCase of testCases) {
      const result = await runCode(
        submission.code,
        submission.language,
        testCase.input,
        problem.timeLimit,
        problem.memoryLimit
      );
      
      // Update max values
      maxExecutionTime = Math.max(maxExecutionTime, result.time || 0);
      maxMemoryUsage = Math.max(maxMemoryUsage, result.memory || 0);
      
      if (result.error) {
        // Handle errors
        if (result.error.includes('Time Limit Exceeded')) {
          overallStatus = 'Time Limit Exceeded';
          results.push({
            testCaseId: testCase._id,
            status: 'Error',
            output: '',
            expectedOutput: testCase.expectedOutput,
            executionTime: result.time,
            memoryUsage: result.memory,
            errorMessage: 'Time Limit Exceeded'
          });
        } else if (result.error.includes('Memory Limit Exceeded')) {
          overallStatus = 'Memory Limit Exceeded';
          results.push({
            testCaseId: testCase._id,
            status: 'Error',
            output: '',
            expectedOutput: testCase.expectedOutput,
            executionTime: result.time,
            memoryUsage: result.memory,
            errorMessage: 'Memory Limit Exceeded'
          });
        } else if (result.error.includes('Compilation Error')) {
          overallStatus = 'Compile Error';
          results.push({
            testCaseId: testCase._id,
            status: 'Error',
            output: '',
            expectedOutput: testCase.expectedOutput,
            executionTime: 0,
            memoryUsage: 0,
            errorMessage: result.error
          });
          
          // Stop testing on compilation error
          break;
        } else {
          overallStatus = 'Runtime Error';
          results.push({
            testCaseId: testCase._id,
            status: 'Error',
            output: '',
            expectedOutput: testCase.expectedOutput,
            executionTime: result.time,
            memoryUsage: result.memory,
            errorMessage: result.error
          });
        }
        
        // If we have a non-Accepted status, we can potentially stop early
        // But for now, we'll continue to run all test cases
      } else {
        // Compare output with expected output
        const normalizedOutput = normalizeOutput(result.output);
        const normalizedExpected = normalizeOutput(testCase.expectedOutput);
        
        if (normalizedOutput === normalizedExpected) {
          results.push({
            testCaseId: testCase._id,
            status: 'Pass',
            output: result.output,
            expectedOutput: testCase.expectedOutput,
            executionTime: result.time,
            memoryUsage: result.memory
          });
        } else {
          overallStatus = 'Wrong Answer';
          results.push({
            testCaseId: testCase._id,
            status: 'Fail',
            output: result.output,
            expectedOutput: testCase.expectedOutput,
            executionTime: result.time,
            memoryUsage: result.memory
          });
        }
      }
    }
    
    // Update submission with results
    submission.status = overallStatus;
    submission.executionTime = maxExecutionTime;
    submission.memoryUsage = maxMemoryUsage;
    submission.results = results;
    
    await submission.save();
    
    // Update user streak if submission is accepted
    if (overallStatus === 'Accepted') {
      // This would be handled in a separate function
      // updateUserStreak(submission.userId);
    }
  } catch (error) {
    console.error(`Error judging submission ${submissionId}:`, error);
    
    // Update submission status to Error
    try {
      const submission = await Submission.findById(submissionId);
      if (submission) {
        submission.status = 'Error';
        await submission.save();
      }
    } catch (updateError) {
      console.error(`Error updating submission status:`, updateError);
    }
  }
}

// Helper function to normalize output for comparison
function normalizeOutput(output) {
  if (!output) return '';
  
  // Trim whitespace, normalize line endings, and remove trailing newlines
  return output.trim().replace(/\r\n/g, '\n').replace(/\n+$/, '');
}