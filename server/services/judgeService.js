import Submission from '../models/Submission.js';
import { runCode } from './codeExecution.js';

// ========================================================================
// Auto I/O Wrapping — LeetCode-style function wrapping
// Users write just the function; the judge handles stdin/stdout automatically.
// ========================================================================

/**
 * Wrap user code with an I/O driver that reads stdin, parses arguments,
 * calls the user's function, and prints the result.
 * If the user already handles I/O (reads stdin), returns code unchanged.
 */
function wrapUserCode(code, language) {
  switch (language) {
    case 'python':
      return wrapPythonCode(code);
    case 'javascript':
      return wrapJavaScriptCode(code);
    default:
      return code; // Java/C++ — no auto-wrapping for now
  }
}

function wrapPythonCode(code) {
  // If user already handles stdin, don't wrap
  if (/sys\.stdin/.test(code) || /\binput\s*\(/.test(code)) {
    return code;
  }

  // Find the main function name (first top-level 'def')
  const funcMatch = code.match(/^def\s+(\w+)\s*\(/m);
  if (!funcMatch) return code; // No function found, can't wrap
  const funcName = funcMatch[1];

  // Strategy: prepend stdin capture + stdout suppression,
  // let user code run (test code output is suppressed),
  // then restore stdout and call function with parsed stdin args.
  const wrapper = `import sys as _sys, json as _json, io as _io

# Capture stdin before user code can consume it
_stdin_data = _sys.stdin.read()
_sys.stdin = _io.StringIO('')

# Suppress stdout from user's test code
_old_stdout = _sys.stdout
_sys.stdout = _io.StringIO()

# ---- User code starts ----
${code}
# ---- User code ends ----

# Restore stdout
_sys.stdout = _old_stdout

# Parse stdin input and call the user's function
_lines = _stdin_data.strip().split('\\n')
_args = [_json.loads(_l) for _l in _lines]
_result = ${funcName}(*_args)
print(_json.dumps(_result))
`;

  return wrapper;
}

function wrapJavaScriptCode(code) {
  // If user already handles stdin, don't wrap
  if (/readline/.test(code) || /process\.stdin/.test(code) || /readFileSync/.test(code)) {
    return code;
  }

  // Find the main function name
  const funcMatch = code.match(/function\s+(\w+)\s*\(/) ||
                    code.match(/(?:var|let|const)\s+(\w+)\s*=\s*function/);
  if (!funcMatch) return code;
  const funcName = funcMatch[1];

  // Strategy: read stdin first, override console.log to suppress user test output,
  // run user code, restore console.log, call function with parsed args.
  const wrapper = `const _fs = require('fs');
const _stdinData = _fs.readFileSync('/dev/stdin', 'utf-8');

// Suppress console.log from user's test code
const _originalLog = console.log;
console.log = () => {};

// ---- User code starts ----
${code}
// ---- User code ends ----

// Restore console.log
console.log = _originalLog;

// Parse stdin input and call the user's function
const _lines = _stdinData.trim().split('\\n');
const _args = _lines.map(_l => JSON.parse(_l));
const _result = ${funcName}(..._args);
console.log(JSON.stringify(_result));
`;

  return wrapper;
}

// ========================================================================

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
    
    // Wrap user code with I/O driver (LeetCode-style)
    const wrappedCode = wrapUserCode(submission.code, submission.language);
    
    // Run each test case
    for (const testCase of testCases) {
      const result = await runCode(
        wrappedCode,
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
          // Debug logging for output comparison mismatches
          console.log(`[Judge Debug] Submission ${submissionId} - Test case mismatch:`);
          console.log(`  Input:                 ${JSON.stringify(testCase.input)}`);
          console.log(`  Expected (normalized): ${JSON.stringify(normalizedExpected)}`);
          console.log(`  Got      (normalized): ${JSON.stringify(normalizedOutput)}`);
          console.log(`  Expected (raw):        ${JSON.stringify(testCase.expectedOutput)}`);
          console.log(`  Got      (raw):        ${JSON.stringify(result.output)}`);
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
  
  return output
    .replace(/\r\n/g, '\n')         // normalize line endings
    .split('\n')                     // split into lines
    .map(line => line.trimEnd())     // trim trailing whitespace per line
    .join('\n')                      // rejoin
    .trim()                          // trim leading/trailing empty lines
    .replace(/\s*,\s*/g, ',')        // normalize spaces around commas: "0, 1" -> "0,1"
    .replace(/\[\s+/g, '[')          // normalize space after opening bracket: "[ 0" -> "[0"
    .replace(/\s+\]/g, ']');         // normalize space before closing bracket: "0 ]" -> "0]"
}