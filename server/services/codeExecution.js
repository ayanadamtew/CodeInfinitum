import { exec } from 'child_process';
import fs from 'fs/promises';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Base directory for temporary files
const TEMP_DIR = path.join(__dirname, '../temp');

// Ensure temp directory exists
async function ensureTempDir() {
  try {
    await fs.mkdir(TEMP_DIR, { recursive: true });
  } catch (error) {
    console.error('Error creating temp directory:', error);
  }
}

// Clean up temporary files
async function cleanupFiles(filePaths) {
  for (const filePath of filePaths) {
    try {
      await fs.unlink(filePath);
    } catch (error) {
      console.error(`Error deleting file ${filePath}:`, error);
    }
  }
}

// Execute command with timeout
function executeCommand(command, timeoutMs) {
  return new Promise((resolve, reject) => {
    const startTime = Date.now();
    let memoryUsage = 0;
    
    const process = exec(command, {
      timeout: timeoutMs,
      maxBuffer: 1024 * 1024 // 1MB
    }, (error, stdout, stderr) => {
      const executionTime = Date.now() - startTime;
      
      if (error) {
        // Check if it's a timeout error
        if (error.killed && error.signal === 'SIGTERM') {
          reject({ 
            error: 'Time Limit Exceeded',
            time: timeoutMs,
            memory: memoryUsage
          });
        } else {
          reject({ 
            error: stderr || error.message,
            time: executionTime,
            memory: memoryUsage
          });
        }
        return;
      }
      
      resolve({ 
        output: stdout,
        time: executionTime,
        memory: memoryUsage
      });
    });
    
    // This is a simplified approach to memory tracking
    // In a real system, you'd use more sophisticated methods
    const memoryInterval = setInterval(() => {
      if (process.pid) {
        exec(`ps -o rss= -p ${process.pid}`, (err, stdout) => {
          if (!err && stdout) {
            const rss = parseInt(stdout.trim(), 10);
            memoryUsage = Math.max(memoryUsage, rss);
          }
        });
      }
    }, 100);
    
    process.on('close', () => {
      clearInterval(memoryInterval);
    });
  });
}

// Run code in different languages
export async function runCode(code, language, input, timeLimit = 1000, memoryLimit = 128000) {
  await ensureTempDir();
  
  const id = uuidv4();
  const filesToCleanup = [];
  
  try {
    let result;
    
    switch (language) {
      case 'javascript': {
        const jsFilePath = path.join(TEMP_DIR, `${id}.js`);
        const inputFilePath = path.join(TEMP_DIR, `${id}.input`);
        
        await fs.writeFile(jsFilePath, code);
        await fs.writeFile(inputFilePath, input);
        
        filesToCleanup.push(jsFilePath, inputFilePath);
        
        result = await executeCommand(
          `node ${jsFilePath} < ${inputFilePath}`,
          timeLimit
        );
        break;
      }
      
      case 'python': {
        const pyFilePath = path.join(TEMP_DIR, `${id}.py`);
        const inputFilePath = path.join(TEMP_DIR, `${id}.input`);
        
        await fs.writeFile(pyFilePath, code);
        await fs.writeFile(inputFilePath, input);
        
        filesToCleanup.push(pyFilePath, inputFilePath);
        
        result = await executeCommand(
          `python3 ${pyFilePath} < ${inputFilePath}`,
          timeLimit
        );
        break;
      }
      
      case 'java': {
        const className = 'Solution'; // Assuming the class name is Solution
        const javaFilePath = path.join(TEMP_DIR, `${className}.java`);
        const inputFilePath = path.join(TEMP_DIR, `${id}.input`);
        
        await fs.writeFile(javaFilePath, code);
        await fs.writeFile(inputFilePath, input);
        
        filesToCleanup.push(javaFilePath, inputFilePath);
        
        // Compile
        try {
          await executeCommand(
            `javac ${javaFilePath}`,
            10000 // Compilation timeout
          );
          
          filesToCleanup.push(path.join(TEMP_DIR, `${className}.class`));
          
          // Run
          result = await executeCommand(
            `cd ${TEMP_DIR} && java ${className} < ${id}.input`,
            timeLimit
          );
        } catch (error) {
          if (error.error && error.error.includes('error:')) {
            return { error: 'Compilation Error: ' + error.error };
          }
          throw error;
        }
        break;
      }
      
      case 'cpp': {
        const cppFilePath = path.join(TEMP_DIR, `${id}.cpp`);
        const execFilePath = path.join(TEMP_DIR, id);
        const inputFilePath = path.join(TEMP_DIR, `${id}.input`);
        
        await fs.writeFile(cppFilePath, code);
        await fs.writeFile(inputFilePath, input);
        
        filesToCleanup.push(cppFilePath, inputFilePath);
        
        // Compile
        try {
          await executeCommand(
            `g++ -std=c++17 ${cppFilePath} -o ${execFilePath}`,
            10000 // Compilation timeout
          );
          
          filesToCleanup.push(execFilePath);
          
          // Run
          result = await executeCommand(
            `${execFilePath} < ${inputFilePath}`,
            timeLimit
          );
        } catch (error) {
          if (error.error && error.error.includes('error:')) {
            return { error: 'Compilation Error: ' + error.error };
          }
          throw error;
        }
        break;
      }
      
      default:
        return { error: 'Unsupported language' };
    }
    
    // Check memory limit
    if (result.memory > memoryLimit) {
      return { 
        error: 'Memory Limit Exceeded',
        time: result.time,
        memory: result.memory
      };
    }
    
    return {
      output: result.output,
      time: result.time,
      memory: result.memory
    };
  } catch (error) {
    return {
      error: error.error || 'Execution error',
      time: error.time,
      memory: error.memory
    };
  } finally {
    await cleanupFiles(filesToCleanup);
  }
}