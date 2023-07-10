const { spawn } = require('child_process');

const runCode = (language, code, callback) => {
  let result = '';
  const maxExecutionTime = 5000; // Maximum execution time in milliseconds

  switch (language) {
    case 'javascript':
      try {
        result = eval(code);
      } catch (error) {
        result = `Error: ${error.message}`;
      }
      callback(result);
      break;

    case 'python':
      
      const pythonProcess = spawn('python', ['-c', code]);

      let timeoutId = setTimeout(() => {
        pythonProcess.kill(); // Terminate the process if it exceeds the execution time limit
        result = 'Error: Execution time limit exceeded';
        callback(result);
      }, maxExecutionTime);

      pythonProcess.stdout.on('data', (data) => {
        result += data.toString();
      });

      pythonProcess.stderr.on('data', (data) => {
        result = `Error: ${data.toString().trim()}`;
      });

      pythonProcess.on('close', (code) => {
        clearTimeout(timeoutId);
        if (code !== 0) {
          result = `Error: Python process exited with code ${code}`;
        }
        callback(result);
      });
      break;

    case 'java':
      const javaCode = `
        public class Main {
          public static void main(String[] args) {
            ${code}
          }
        }
      `;

      const javaProcess = spawn('java', ['Main']);

      timeoutId = setTimeout(() => {
        javaProcess.kill(); // Terminate the process if it exceeds the execution time limit
        result = 'Error: Execution time limit exceeded';
        callback(result);
      }, maxExecutionTime);

      javaProcess.stdout.on('data', (data) => {
        result += data.toString();
      });

      javaProcess.stderr.on('data', (data) => {
        result = `Error: ${data.toString().trim()}`;
      });

      javaProcess.on('close', (code) => {
        clearTimeout(timeoutId);
        if (code !== 0) {
          result = `Error: Java process exited with code ${code}`;
        }
        callback(result);
      });
      break;

    default:
      result = 'Unsupported language';
      callback(result);
  }
};

module.exports = { runCode };